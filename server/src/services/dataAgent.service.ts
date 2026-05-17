import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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
      description: 'Extracts data from handwritten documents and receipts'
    };
  }

  async extractFromImage(imageBase64: string, imageType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg'): Promise<ExtractionResult> {
    try {
      this.currentStatus = 'working';
      this.thinking = 'Analyzing document structure...';
      logger.info('Data Agent: Starting document extraction');

      const prompt = `You are a Data Agent - an autonomous AI that extracts business data from documents.

**Your Task:**
Analyze this image and extract sales/transaction data. Think step-by-step and show your reasoning.

**Step-by-Step Process:**
1. Identify the document type (ledger, receipt, invoice, etc.)
2. Locate all transaction entries
3. Extract data for each transaction
4. Validate the extracted data
5. Flag any issues or anomalies

**Return ONLY valid JSON in this exact format:**
{
  "thinking": "Detailed step-by-step analysis of what you see and how you're processing it",
  "transactions": [
    {
      "customer": "Customer Name",
      "product": "Product Name",
      "price": 2500,
      "date": "2024-01-15",
      "quantity": 1
    }
  ],
  "confidence": "high|medium|low",
  "issues": ["List any data quality issues, unusual patterns, or validation concerns"]
}

**Important:**
- Extract ALL visible transactions
- Use YYYY-MM-DD format for dates
- If date is unclear, estimate based on context
- Flag suspicious data (unusual prices, unclear handwriting, etc.)
- Be thorough in your thinking process`;

      const geminiResult = await model.generateContent([
        {
          text: prompt
        },
        {
          inlineData: {
            data: imageBase64,
            mimeType: imageType
          }
        }
      ]);

      this.thinking = 'Parsing extracted data...';

      const response = await geminiResult.response;
      const text = response.text();

      // Extract JSON from response (handle markdown code blocks)
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
      }

      const parsedResult = JSON.parse(jsonText);

      this.thinking = null;
      this.currentStatus = 'idle';
      this.lastAction = `Processed document - Found ${parsedResult.transactions.length} transactions`;

      logger.info(`Data Agent: Extracted ${parsedResult.transactions.length} transactions with ${parsedResult.confidence} confidence`);

      return {
        agent: 'Data Agent',
        thinking: parsedResult.thinking,
        transactions: parsedResult.transactions,
        confidence: parsedResult.confidence,
        issues: parsedResult.issues || [],
        status: 'completed'
      };

    } catch (error) {
      this.currentStatus = 'error';
      this.thinking = null;
      this.lastAction = 'Error processing document';
      logger.error('Data Agent error:', error);
      
      throw new Error(`Data Agent failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validateTransaction(transaction: Transaction): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = [];

    // Basic validation
    if (!transaction.customer || transaction.customer.trim().length === 0) {
      issues.push('Customer name is missing');
    }

    if (!transaction.product || transaction.product.trim().length === 0) {
      issues.push('Product name is missing');
    }

    if (!transaction.price || transaction.price <= 0) {
      issues.push('Invalid price');
    }

    if (transaction.price > 100000) {
      issues.push('Price seems unusually high - please verify');
    }

    if (!transaction.date) {
      issues.push('Date is missing');
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

export const dataAgent = DataAgentService.getInstance();

// Made with Bob
