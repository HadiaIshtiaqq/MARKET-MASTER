declare module '@google/generative-ai' {
  export interface GenerativeModelConfig {
    model: string;
    apiKey?: string;
  }

  export interface GenerateContentRequest {
    contents?: any[];
    generationConfig?: any;
    safetySettings?: any[];
  }

  export interface GenerateContentResult {
    response: GenerateContentResponse;
  }

  export interface GenerateContentResponse {
    text(): string;
    candidates?: any[];
    promptFeedback?: any;
  }

  export interface GenerativeModel {
    generateContent(request: string | GenerateContentRequest): Promise<GenerateContentResult>;
    generateContentStream(request: string | GenerateContentRequest): Promise<any>;
    countTokens(request: string | GenerateContentRequest): Promise<any>;
  }

  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(config: GenerativeModelConfig): GenerativeModel;
  }
}

// Made with Bob
