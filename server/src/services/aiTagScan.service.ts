import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

/**
 * AI Tag Scan Service
 * Analyzes product images to automatically generate tags, categories, and metadata
 */

interface TagScanResult {
  success: boolean;
  tags: string[];
  category: string;
  subcategory: string;
  description: string;
  suggestedPrice?: number;
  attributes: Record<string, any>;
  confidence: number;
}

export class AITagScanService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  /**
   * Scan product image and generate comprehensive tags and metadata
   */
  async scanProduct(imageBase64: string, tenantNiche?: string): Promise<TagScanResult> {
    try {
      const prompt = this.buildScanPrompt(tenantNiche);

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

      const parsed = this.parseTagScanResponse(text);

      logger.info({
        message: 'AI Tag Scan completed',
        tagsGenerated: parsed.tags.length,
        category: parsed.category,
        confidence: parsed.confidence,
      });

      return {
        success: true,
        ...parsed,
      };
    } catch (error: any) {
      logger.error({
        message: 'AI Tag Scan failed',
        error: error.message,
      });

      return {
        success: false,
        tags: [],
        category: 'uncategorized',
        subcategory: '',
        description: '',
        attributes: {},
        confidence: 0,
      };
    }
  }

  /**
   * Build specialized prompt for product scanning
   */
  private buildScanPrompt(tenantNiche?: string): string {
    const nicheContext = tenantNiche ? `This product is from a ${tenantNiche} business.` : '';

    return `You are an expert product analyst AI. Analyze this product image in extreme detail.

${nicheContext}

EXTRACT THE FOLLOWING:
1. **Product Category**: Main category (e.g., Fashion, Electronics, Home & Garden)
2. **Subcategory**: Specific type (e.g., Handbags, Smartphones, Furniture)
3. **Descriptive Tags**: 10-15 relevant tags for searchability and SEO
4. **Product Description**: 2-3 sentence compelling description
5. **Key Attributes**: Color, material, style, size indicators, brand (if visible)
6. **Suggested Price Range**: Based on visual quality assessment (optional)
7. **Target Audience**: Who would buy this product
8. **Seasonal Relevance**: Is this seasonal or year-round

OUTPUT FORMAT (JSON):
{
  "category": "Main Category",
  "subcategory": "Specific Type",
  "tags": ["tag1", "tag2", "tag3", ...],
  "description": "Compelling product description",
  "attributes": {
    "color": "primary color",
    "material": "material type",
    "style": "style descriptor",
    "brand": "brand if visible",
    "condition": "new/used assessment"
  },
  "suggested_price_range": {
    "min": 0,
    "max": 0,
    "currency": "USD"
  },
  "target_audience": "demographic description",
  "seasonal": "year-round/seasonal",
  "confidence": 0.0-1.0
}

Be thorough and accurate. These tags will be used for inventory management and marketing.`;
  }

  /**
   * Parse AI response
   */
  private parseTagScanResponse(text: string): Omit<TagScanResult, 'success'> {
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;

      const parsed = JSON.parse(jsonText);

      return {
        tags: parsed.tags || [],
        category: parsed.category || 'uncategorized',
        subcategory: parsed.subcategory || '',
        description: parsed.description || '',
        suggestedPrice: parsed.suggested_price_range?.max || undefined,
        attributes: parsed.attributes || {},
        confidence: parsed.confidence || 0.8,
      };
    } catch (error) {
      logger.error('Failed to parse tag scan response', { error, text });
      return {
        tags: [],
        category: 'uncategorized',
        subcategory: '',
        description: '',
        attributes: {},
        confidence: 0,
      };
    }
  }

  /**
   * Batch scan multiple products
   */
  async batchScanProducts(images: string[], tenantNiche?: string): Promise<TagScanResult[]> {
    const results = await Promise.all(images.map((img) => this.scanProduct(img, tenantNiche)));
    return results;
  }

  /**
   * Enhance existing product data with AI insights
   */
  async enhanceProductData(
    existingData: any,
    imageBase64: string
  ): Promise<{ enhancedTags: string[]; suggestedUpdates: Record<string, any> }> {
    const scanResult = await this.scanProduct(imageBase64);

    // Merge existing tags with new AI-generated tags
    const existingTags = existingData.ai_tags || [];
    const enhancedTags = [...new Set([...existingTags, ...scanResult.tags])];

    // Suggest updates for missing fields
    const suggestedUpdates: Record<string, any> = {};

    if (!existingData.category && scanResult.category) {
      suggestedUpdates.category = scanResult.category;
    }

    if (!existingData.description && scanResult.description) {
      suggestedUpdates.description = scanResult.description;
    }

    if (!existingData.metadata) {
      suggestedUpdates.metadata = scanResult.attributes;
    }

    return {
      enhancedTags,
      suggestedUpdates,
    };
  }
}

export default new AITagScanService();

// Made with Bob
