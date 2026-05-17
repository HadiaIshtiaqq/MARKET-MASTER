/**
 * AI Provider Service
 *
 * Priority (first key found wins):
 *   1. IBM WatsonX  → WATSONX_API_KEY + WATSONX_PROJECT_ID  (IBM Cloud)
 *   2. Groq         → GROQ_API_KEY                          (console.groq.com — FREE, no credit card)
 *   3. Google Gemini → GEMINI_API_KEY                       (aistudio.google.com — FREE)
 *
 * Groq gives real agentic tool-calling with Llama 3.3 70B, identical to IBM WatsonX path.
 */

import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | Array<{ type: 'text' | 'image_url'; text?: string; image_url?: { url: string } }>;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
  name?: string;
}

interface ToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

interface AITool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

type Provider = 'watsonx' | 'groq' | 'gemini';

function detectProvider(): Provider {
  const hasWatsonX = !!(process.env.WATSONX_API_KEY && process.env.WATSONX_PROJECT_ID &&
    !process.env.WATSONX_API_KEY.includes('PASTE'));
  const hasGroq = !!(process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('PASTE') && process.env.GROQ_API_KEY.startsWith('gsk_'));
  const hasGemini = !!(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('PASTE'));

  if (hasWatsonX) {
    logger.info('AI Provider: IBM WatsonX (Granite) — ibm/granite-3-8b-instruct');
    return 'watsonx';
  }
  if (hasGroq) {
    logger.info('AI Provider: Groq (Llama 3.3 70B) — llama-3.3-70b-versatile');
    return 'groq';
  }
  if (hasGemini) {
    logger.info('AI Provider: Google Gemini 2.5 Flash');
    return 'gemini';
  }
  logger.warn('No AI key found. Set GROQ_API_KEY (free at console.groq.com) in server/.env');
  return 'gemini';
}

// ─── IBM WatsonX (Granite) ────────────────────────────────────────────────────

class WatsonXProvider {
  private iamToken: string | null = null;
  private tokenExpiry: number = 0;

  private get url() { return process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com'; }
  private get projectId() { return process.env.WATSONX_PROJECT_ID || ''; }
  private get apiKey() { return process.env.WATSONX_API_KEY || ''; }

  async getToken(): Promise<string> {
    if (this.iamToken && Date.now() < this.tokenExpiry) return this.iamToken;
    const resp = await axios.post(
      'https://iam.cloud.ibm.com/identity/token',
      new URLSearchParams({ grant_type: 'urn:ibm:params:oauth:grant-type:apikey', apikey: this.apiKey }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 10000 }
    );
    this.iamToken = resp.data.access_token;
    this.tokenExpiry = Date.now() + (resp.data.expires_in - 300) * 1000;
    return this.iamToken!;
  }

  async chat(messages: AIMessage[], opts: { model?: string; maxTokens?: number; temperature?: number; tools?: AITool[] } = {}): Promise<{ content: string | null; tool_calls?: ToolCall[]; finish_reason: string }> {
    const { model = 'ibm/granite-3-8b-instruct', maxTokens = 2048, temperature = 0.3, tools } = opts;
    const token = await this.getToken();
    const body: Record<string, unknown> = {
      model_id: model,
      messages,
      parameters: { max_new_tokens: maxTokens, temperature, top_p: 0.9, repetition_penalty: 1.1 },
      project_id: this.projectId,
    };
    if (tools?.length) { body.tools = tools; body.tool_choice = 'auto'; }
    const resp = await axios.post(
      `${this.url}/ml/v1/text/chat?version=2023-05-29`,
      body,
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, timeout: 60000 }
    );
    const choice = resp.data.choices[0];
    return { content: choice.message.content, tool_calls: choice.message.tool_calls, finish_reason: choice.finish_reason };
  }

  async vision(text: string, imageBase64: string, mimeType = 'image/jpeg'): Promise<string> {
    const result = await this.chat(
      [{ role: 'user', content: [{ type: 'text', text }, { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } }] }],
      { model: 'ibm/granite-3-2-8b-vision-instruct', maxTokens: 3000, temperature: 0.1 }
    );
    return result.content || '';
  }
}

// ─── Groq (Llama 3.3 70B) — free, real tool-calling ─────────────────────────

class GroqProvider {
  private get apiKey() { return process.env.GROQ_API_KEY || ''; }
  static readonly MODEL = 'llama-3.3-70b-versatile';
  static readonly VISION_MODEL = 'llama-4-scout-17b-16e-instruct';

  async chat(messages: AIMessage[], opts: { model?: string; maxTokens?: number; temperature?: number; tools?: AITool[] } = {}): Promise<{ content: string | null; tool_calls?: ToolCall[]; finish_reason: string }> {
    const { model = GroqProvider.MODEL, maxTokens = 2048, temperature = 0.3, tools } = opts;

    // Groq doesn't accept 'tool' role with tool_call_id in the same way — map correctly
    const mappedMessages = messages.map(m => {
      if (m.role === 'tool') {
        return { role: 'tool', content: m.content, tool_call_id: m.tool_call_id };
      }
      if (m.tool_calls) {
        return { role: m.role, content: m.content || '', tool_calls: m.tool_calls };
      }
      return { role: m.role, content: m.content };
    });

    const body: Record<string, unknown> = {
      model,
      messages: mappedMessages,
      max_tokens: maxTokens,
      temperature,
    };
    if (tools?.length) { body.tools = tools; body.tool_choice = 'auto'; }

    const resp = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      body,
      { headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' }, timeout: 60000 }
    );
    const choice = resp.data.choices[0];
    return {
      content: choice.message.content,
      tool_calls: choice.message.tool_calls,
      finish_reason: choice.finish_reason,
    };
  }

  async vision(text: string, imageBase64: string, mimeType = 'image/jpeg'): Promise<string> {
    const result = await this.chat(
      [{ role: 'user', content: [{ type: 'text', text }, { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } }] }],
      { model: GroqProvider.VISION_MODEL, maxTokens: 3000, temperature: 0.1 }
    );
    return result.content || '';
  }
}

// ─── Google Gemini (fallback) ─────────────────────────────────────────────────

class GeminiProvider {
  private _genAI: GoogleGenerativeAI | null = null;

  private get genAI(): GoogleGenerativeAI {
    if (!this._genAI) this._genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    return this._genAI;
  }

  private buildChatPrompt(messages: AIMessage[]): string {
    return messages
      .map(m => {
        const role = m.role === 'assistant' ? 'Assistant' : m.role === 'system' ? 'System' : 'User';
        const content = typeof m.content === 'string' ? m.content : (m.content as any[]).find(c => c.type === 'text')?.text || '';
        return `${role}: ${content}`;
      })
      .join('\n\n');
  }

  async chat(messages: AIMessage[], opts: { maxTokens?: number; temperature?: number } = {}): Promise<{ content: string; finish_reason: string }> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = this.buildChatPrompt(messages);
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: opts.maxTokens || 2048, temperature: opts.temperature || 0.3 },
    });
    return { content: result.response.text(), finish_reason: 'stop' };
  }

  async vision(text: string, imageBase64: string, mimeType = 'image/jpeg', opts: { maxTokens?: number; temperature?: number } = {}): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text }, { inlineData: { data: imageBase64, mimeType } }] }],
      generationConfig: { maxOutputTokens: opts.maxTokens || 3000, temperature: opts.temperature || 0.1 },
    });
    return result.response.text();
  }
}

// ─── Unified WatsonXService ───────────────────────────────────────────────────

export class WatsonXService {
  private static instance: WatsonXService;
  private _provider: Provider | null = null;
  private watsonx: WatsonXProvider;
  private groq: GroqProvider;
  private gemini: GeminiProvider;

  static readonly MODELS = {
    GRANITE_3_8B: 'ibm/granite-3-8b-instruct',
    GRANITE_3_2_VISION: 'ibm/granite-3-2-8b-vision-instruct',
    GROQ_DEFAULT: GroqProvider.MODEL,
  };

  private get provider(): Provider {
    if (!this._provider) this._provider = detectProvider();
    return this._provider;
  }

  private constructor() {
    this.watsonx = new WatsonXProvider();
    this.groq = new GroqProvider();
    this.gemini = new GeminiProvider();
  }

  static getInstance(): WatsonXService {
    if (!WatsonXService.instance) WatsonXService.instance = new WatsonXService();
    return WatsonXService.instance;
  }

  getActiveProvider(): string {
    switch (this.provider) {
      case 'watsonx': return 'IBM WatsonX (granite-3-8b-instruct)';
      case 'groq':    return 'Groq — Llama 3.3 70B Versatile (free)';
      default:        return 'Google Gemini 2.5 Flash (free)';
    }
  }

  async chat(messages: AIMessage[], opts: { model?: string; maxTokens?: number; temperature?: number; tools?: AITool[] } = {}) {
    if (this.provider === 'watsonx') return this.watsonx.chat(messages, opts);
    if (this.provider === 'groq') return this.groq.chat(messages, opts);
    const result = await this.gemini.chat(messages, opts);
    return { content: result.content, tool_calls: undefined as ToolCall[] | undefined, finish_reason: 'stop' };
  }

  async chatWithVision(text: string, imageBase64: string, mimeType = 'image/jpeg', opts: { maxTokens?: number; temperature?: number } = {}): Promise<string> {
    if (this.provider === 'watsonx') return this.watsonx.vision(text, imageBase64, mimeType);
    if (this.provider === 'groq') return this.groq.vision(text, imageBase64, mimeType);
    return this.gemini.vision(text, imageBase64, mimeType, opts);
  }

  async simpleChat(systemPrompt: string, userMessage: string, opts: { model?: string; maxTokens?: number; temperature?: number } = {}): Promise<string> {
    const result = await this.chat(
      [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
      opts
    );
    return result.content || '';
  }

  /**
   * Agentic ReAct loop with real tool-calling.
   * IBM WatsonX and Groq run the full iterative loop.
   * Gemini runs a one-shot fallback (all tools in parallel, then reasoning).
   */
  async agenticLoop(
    messages: AIMessage[],
    tools: AITool[],
    toolExecutor: (name: string, args: Record<string, unknown>) => Promise<string>,
    opts: { model?: string; maxIterations?: number } = {}
  ): Promise<{ result: string; iterations: number; toolCallsMade: string[] }> {
    if (this.provider === 'gemini') {
      return this.geminiAgenticFallback(messages, tools, toolExecutor);
    }

    const { maxIterations = 8 } = opts;
    const model = this.provider === 'groq' ? GroqProvider.MODEL : WatsonXService.MODELS.GRANITE_3_8B;
    const conversation = [...messages];
    const toolCallsMade: string[] = [];
    let iterations = 0;

    while (iterations < maxIterations) {
      iterations++;

      const response = this.provider === 'groq'
        ? await this.groq.chat(conversation, { model, tools })
        : await this.watsonx.chat(conversation, { model, tools });

      const assistantMsg: AIMessage = {
        role: 'assistant',
        content: response.content || '',
        tool_calls: response.tool_calls,
      };
      conversation.push(assistantMsg);

      if (response.finish_reason === 'stop' || !response.tool_calls?.length) {
        return { result: response.content || '', iterations, toolCallsMade };
      }

      for (const tc of response.tool_calls) {
        toolCallsMade.push(tc.function.name);
        let args: Record<string, unknown> = {};
        try { args = JSON.parse(tc.function.arguments); } catch { args = {}; }

        logger.info(`[Agentic] ${this.provider} → tool "${tc.function.name}"`);
        let toolResult: string;
        try { toolResult = await toolExecutor(tc.function.name, args); }
        catch (e: any) { toolResult = `Tool error: ${e.message}`; }

        conversation.push({ role: 'tool', content: toolResult, tool_call_id: tc.id });
      }
    }

    const lastAssistant = [...conversation].reverse().find(m => m.role === 'assistant');
    return {
      result: typeof lastAssistant?.content === 'string' ? lastAssistant.content : 'Analysis complete.',
      iterations,
      toolCallsMade,
    };
  }

  private async geminiAgenticFallback(
    messages: AIMessage[],
    tools: AITool[],
    toolExecutor: (name: string, args: Record<string, unknown>) => Promise<string>
  ): Promise<{ result: string; iterations: number; toolCallsMade: string[] }> {
    const toolCallsMade: string[] = [];

    const toolResults = await Promise.all(
      tools.map(async (tool) => {
        toolCallsMade.push(tool.function.name);
        try {
          const result = await toolExecutor(tool.function.name, {});
          return `### ${tool.function.name}\n${result}`;
        } catch (e: any) {
          return `### ${tool.function.name}\nError: ${e.message}`;
        }
      })
    );

    const userTask = messages.find(m => m.role === 'user');
    const task = typeof userTask?.content === 'string' ? userTask.content : '';

    const prompt = `You are an AI business analyst. Based on the following data, answer the task with specific, actionable recommendations.

TASK: ${task}

DATA FROM ALL TOOLS:
${toolResults.join('\n\n')}

Provide a clear, structured analysis with specific recommendations.`;

    const result = await this.gemini.chat([{ role: 'user', content: prompt }], { maxTokens: 2048, temperature: 0.3 });
    return { result: result.content, iterations: 1, toolCallsMade };
  }
}

export const watsonx = WatsonXService.getInstance();
