import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

/**
 * IBM Bob - Vision-to-Code Service
 * Converts analog documents (delivery challans, handwritten inventory sheets) 
 * to digital SQL INSERT statements
 */

interface VisionToCodeResult {
  success: boolean;
  sqlStatements: string[];
  extractedData: any[];
  confidence: number;
  processingTime: number;
}

export class IBMBobService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  /**
   * Process delivery challan or inventory sheet image
   * Extracts structured data and generates SQL INSERT statements
   */
  async processDocument(
    imageBase64: string,
    tenantId: string,
    documentType: 'challan' | 'inventory_sheet'
  ): Promise<VisionToCodeResult> {
    const startTime = Date.now();

    try {
      const prompt = this.buildPrompt(documentType, tenantId);

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse the AI response
      const parsed = this.parseAIResponse(text);

      const processingTime = Date.now() - startTime;

      logger.info({
        message: 'IBM Bob processed document',
        documentType,
        tenantId,
        itemsExtracted: parsed.extractedData.length,
        processingTime,
      });

      return {
        success: true,
        sqlStatements: parsed.sqlStatements,
        extractedData: parsed.extractedData,
        confidence: parsed.confidence,
        processingTime,
      };
    } catch (error: any) {
      logger.error({
        message: 'IBM Bob processing failed',
        error: error.message,
        documentType,
        tenantId,
      });

      return {
        success: false,
        sqlStatements: [],
        extractedData: [],
        confidence: 0,
        processingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Build specialized prompt based on document type
   */
  private buildPrompt(documentType: string, tenantId: string): string {
    const basePrompt = `You are IBM Bob, an expert AI system that converts analog documents to digital SQL statements.

Analyze this ${documentType} image and extract ALL visible product information with extreme precision.

CRITICAL INSTRUCTIONS:
1. Extract EVERY product/item visible in the document
2. For each item, identify: product name, quantity, SKU/code (if visible), price (if visible), category
3. Handle handwritten text, printed text, and mixed formats
4. If text is unclear, make your best interpretation and note confidence level
5. Generate PostgreSQL INSERT statements for the products table

OUTPUT FORMAT (JSON):
{
  "items": [
    {
      "name": "Product Name",
      "sku": "SKU or generated code",
      "quantity": number,
      "price": number or null,
      "category": "inferred category",
      "confidence": 0.0-1.0
    }
  ],
  "sql_statements": [
    "INSERT INTO products (tenant_id, sku, name, category, stock_quantity, price, ingestion_method) VALUES ('${tenantId}', 'SKU001', 'Product Name', 'Category', 10, 99.99, 'vision_to_code');"
  ],
  "overall_confidence": 0.0-1.0,
  "notes": "Any important observations"
}

Be thorough and accurate. This data will directly update the warehouse inventory system.`;

    return basePrompt;
  }

  /**
   * Parse AI response and extract structured data
   */
  private parseAIResponse(text: string): {
    sqlStatements: string[];
    extractedData: any[];
    confidence: number;
  } {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;

      const parsed = JSON.parse(jsonText);

      return {
        sqlStatements: parsed.sql_statements || [],
        extractedData: parsed.items || [],
        confidence: parsed.overall_confidence || 0.8,
      };
    } catch (error) {
      logger.error('Failed to parse IBM Bob response', { error, text });
      return {
        sqlStatements: [],
        extractedData: [],
        confidence: 0,
      };
    }
  }

  /**
   * Batch process multiple documents
   */
  async batchProcessDocuments(
    documents: Array<{ imageBase64: string; documentType: 'challan' | 'inventory_sheet' }>,
    tenantId: string
  ): Promise<VisionToCodeResult[]> {
    const results = await Promise.all(
      documents.map((doc) => this.processDocument(doc.imageBase64, tenantId, doc.documentType))
    );

    return results;
  }

  /**
   * Validate and execute SQL statements safely
   */
  async executeSQL(sqlStatements: string[], db: any): Promise<{ success: boolean; insertedCount: number }> {
    let insertedCount = 0;

    try {
      for (const sql of sqlStatements) {
        // Basic SQL injection prevention
        if (!sql.toUpperCase().startsWith('INSERT INTO PRODUCTS')) {
          logger.warn('Rejected unsafe SQL statement', { sql });
          continue;
        }

        await db.query(sql);
        insertedCount++;
      }

      return { success: true, insertedCount };
    } catch (error: any) {
      logger.error('SQL execution failed', { error: error.message });
      return { success: false, insertedCount };
    }
  }
}

export default new IBMBobService();

// Made with Bob
