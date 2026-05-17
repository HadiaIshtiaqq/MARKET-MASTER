import { watsonx, WatsonXService } from './watsonx.service';
import { logger } from '../utils/logger';

interface Transaction {
  customer: string;
  product: string;
  price: number;
  date: string;
  quantity?: number;
}

interface ExtractionResult {
  agent: string;
  thinking: string;
  transactions: Transaction[];
  confidence: 'high' | 'medium' | 'low';
  issues: string[];
  status: 'working' | 'completed' | 'error';
  modelUsed: string;
}

export class DataAgentService {
  private static instance: DataAgentService;
  private currentStatus: string = 'idle';
  private lastAction: string = 'Ready to process documents';
  private thinking: string | null = null;

  private constructor() {}

  static getInstance(): DataAgentService {
    if (!DataAgentService.instance) {
      DataAgentService.instance = new DataAgentService();
    }
    return DataAgentService.instance;
  }

  getStatus() {
    return {
      name: 'Data Agent',
      status: this.currentStatus,
      last_action: this.lastAction,
      thinking: this.thinking,
      icon: '📊',
      description: 'Extracts transaction data from documents using IBM Granite Vision',
      modelUsed: WatsonXService.MODELS.GRANITE_3_2_VISION,
    };
  }

  async extractFromImage(
    imageBase64: string,
    imageType: string = 'image/jpeg'
  ): Promise<ExtractionResult> {
    try {
      this.currentStatus = 'working';
      this.thinking = 'IBM Granite Vision analyzing document structure...';
      logger.info('Data Agent: Starting extraction with IBM Granite Vision');

      const prompt = `You are a Data Agent powered by IBM Granite Vision.
Analyze this business document image and extract all transaction/sales data.

STEP-BY-STEP PROCESS:
1. Identify document type (receipt, ledger, invoice, delivery note, etc.)
2. Locate every transaction entry — both handwritten and printed
3. Extract: customer name, product, price, date, quantity for each entry
4. Validate data consistency (flag anomalies)
5. Assess confidence

RESPOND WITH ONLY VALID JSON:
{
  "thinking": "Detailed analysis of what you see, how you're reading it, any ambiguities",
  "transactions": [
    {
      "customer": "Customer Name",
      "product": "Product Name",
      "price": 2500,
      "date": "2026-01-15",
      "quantity": 1
    }
  ],
  "confidence": "high",
  "issues": ["List any data quality issues or anomalies found"]
}`;

      this.thinking = 'IBM Granite Vision reading document...';

      const rawText = await watsonx.chatWithVision(prompt, imageBase64, imageType as any, {
        maxTokens: 2500,
        temperature: 0.1,
      });

      this.thinking = 'Parsing extracted data...';

      const parsed = this.parseResult(rawText);

      this.thinking = null;
      this.currentStatus = 'idle';
      this.lastAction = `Extracted ${parsed.transactions.length} transactions (confidence: ${parsed.confidence})`;

      logger.info(`Data Agent: Extracted ${parsed.transactions.length} transactions`, {
        confidence: parsed.confidence,
      });

      return {
        agent: 'Data Agent',
        thinking: parsed.thinking,
        transactions: parsed.transactions,
        confidence: parsed.confidence,
        issues: parsed.issues,
        status: 'completed',
        modelUsed: WatsonXService.MODELS.GRANITE_3_2_VISION,
      };
    } catch (error: any) {
      this.currentStatus = 'error';
      this.thinking = null;
      this.lastAction = 'Error processing document';
      logger.error('Data Agent error:', error);
      throw new Error(`Data Agent (IBM Granite) failed: ${error.message}`);
    }
  }

  private parseResult(text: string): {
    thinking: string;
    transactions: Transaction[];
    confidence: 'high' | 'medium' | 'low';
    issues: string[];
  } {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    try {
      const parsed = JSON.parse(cleaned);
      return {
        thinking: parsed.thinking || '',
        transactions: parsed.transactions || [],
        confidence: parsed.confidence || 'medium',
        issues: parsed.issues || [],
      };
    } catch {
      logger.error('Data Agent: Failed to parse IBM Granite response');
      return { thinking: 'Parse error', transactions: [], confidence: 'low', issues: ['Response parse failed'] };
    }
  }

  async validateTransaction(transaction: Transaction): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];
    if (!transaction.customer?.trim()) issues.push('Customer name is missing');
    if (!transaction.product?.trim()) issues.push('Product name is missing');
    if (!transaction.price || transaction.price <= 0) issues.push('Invalid price');
    if (transaction.price > 100000) issues.push('Price seems unusually high — please verify');
    if (!transaction.date) issues.push('Date is missing');
    return { valid: issues.length === 0, issues };
  }
}

export const dataAgent = DataAgentService.getInstance();
