import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

/**
 * AI Content Generation Service
 * Generates social media posts based on viral trends and brand voice
 */

interface BrandVoice {
  tone: string;
  language: string;
  emojiUsage: string;
  hashtagStrategy: string;
  callToActionStyle: string;
  brandKeywords: string[];
  avoidWords: string[];
  sampleCaptions?: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrls: string[];
  tags: string[];
}

interface ViralTrend {
  trendType: string;
  trendValue: string;
  engagementScore: number;
}

interface GeneratedContent {
  caption: string;
  hashtags: string[];
  callToAction: string;
  suggestedMediaType: string;
  targetAudience: string;
  estimatedEngagement: string;
  variations: string[];
}

export class ContentGenerationService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  /**
   * Generate social media post content for a product
   */
  async generatePostContent(
    product: Product,
    brandVoice: BrandVoice,
    viralTrends: ViralTrend[],
    platform: string
  ): Promise<GeneratedContent> {
    try {
      const prompt = this.buildContentPrompt(product, brandVoice, viralTrends, platform);

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const content = this.parseGeneratedContent(text);

      logger.info({
        message: 'Content generated successfully',
        productId: product.id,
        platform,
        captionLength: content.caption.length,
        hashtagCount: content.hashtags.length,
      });

      return content;
    } catch (error: any) {
      logger.error({
        message: 'Content generation failed',
        error: error.message,
        productId: product.id,
      });

      return {
        caption: '',
        hashtags: [],
        callToAction: '',
        suggestedMediaType: 'image',
        targetAudience: '',
        estimatedEngagement: 'low',
        variations: [],
      };
    }
  }

  /**
   * Build comprehensive content generation prompt
   */
  private buildContentPrompt(
    product: Product,
    brandVoice: BrandVoice,
    viralTrends: ViralTrend[],
    platform: string
  ): string {
    const trendsContext = viralTrends
      .map((t) => `- ${t.trendType}: ${t.trendValue} (Engagement: ${t.engagementScore})`)
      .join('\n');

    const sampleCaptions = brandVoice.sampleCaptions?.join('\n') || 'No samples provided';

    return `You are an expert social media content creator specializing in ${platform} marketing.

PRODUCT INFORMATION:
- Name: ${product.name}
- Description: ${product.description}
- Category: ${product.category}
- Price: $${product.price}
- Tags: ${product.tags.join(', ')}

BRAND VOICE GUIDELINES:
- Tone: ${brandVoice.tone}
- Language: ${brandVoice.language}
- Emoji Usage: ${brandVoice.emojiUsage}
- Hashtag Strategy: ${brandVoice.hashtagStrategy}
- CTA Style: ${brandVoice.callToActionStyle}
- Brand Keywords: ${brandVoice.brandKeywords.join(', ')}
- Avoid Words: ${brandVoice.avoidWords.join(', ')}

SAMPLE BRAND CAPTIONS:
${sampleCaptions}

CURRENT VIRAL TRENDS TO INCORPORATE:
${trendsContext}

PLATFORM: ${platform}
${this.getPlatformGuidelines(platform)}

CREATE:
1. **Main Caption**: Engaging, on-brand caption that incorporates viral trends
2. **Hashtags**: Mix of trending, niche, and branded hashtags (optimal count for ${platform})
3. **Call-to-Action**: Clear, compelling CTA aligned with brand voice
4. **3 Caption Variations**: Alternative versions for A/B testing
5. **Media Recommendation**: Best media type for this content (image/video/carousel/reel)
6. **Target Audience**: Who this content will resonate with most
7. **Engagement Prediction**: Estimated engagement level (low/medium/high/viral)

OUTPUT FORMAT (JSON):
{
  "caption": "Main caption text with emojis and line breaks",
  "hashtags": ["hashtag1", "hashtag2", ...],
  "call_to_action": "Clear CTA",
  "variations": [
    "Caption variation 1",
    "Caption variation 2",
    "Caption variation 3"
  ],
  "suggested_media_type": "image|video|carousel|reel|story",
  "target_audience": "Demographic description",
  "estimated_engagement": "low|medium|high|viral",
  "strategy_notes": "Why this approach will work"
}

IMPORTANT:
- Stay true to the brand voice
- Incorporate viral trends naturally (don't force them)
- Make it authentic and engaging
- Optimize for ${platform}'s algorithm
- Include strategic line breaks for readability
- Use emojis according to brand guidelines`;
  }

  /**
   * Get platform-specific guidelines
   */
  private getPlatformGuidelines(platform: string): string {
    const guidelines: Record<string, string> = {
      instagram: `
INSTAGRAM GUIDELINES:
- Optimal caption length: 125-150 characters for feed, longer for carousel
- Hashtags: 5-10 highly relevant (avoid 30-hashtag spam)
- First line must hook attention (appears before "more")
- Use line breaks for readability
- Include location tags when relevant
- Encourage saves and shares (algorithm boost)`,
      
      facebook: `
FACEBOOK GUIDELINES:
- Optimal length: 40-80 characters for highest engagement
- Ask questions to drive comments
- Use native video when possible
- Tag relevant pages/people
- Post when audience is most active`,
      
      twitter: `
TWITTER/X GUIDELINES:
- Character limit: 280 (aim for 71-100 for retweets)
- Use 1-2 hashtags maximum
- Include visual media
- Thread for longer stories
- Engage with trending topics`,
      
      tiktok: `
TIKTOK GUIDELINES:
- Hook in first 3 seconds
- Use trending sounds/effects
- Hashtags: 3-5 relevant + trending
- Caption: Short, punchy, intriguing
- Encourage duets/stitches`,
      
      linkedin: `
LINKEDIN GUIDELINES:
- Professional tone, value-driven
- Optimal length: 150-300 words
- Use 3-5 relevant hashtags
- Include industry insights
- Ask thought-provoking questions`,
    };

    return guidelines[platform.toLowerCase()] || guidelines.instagram;
  }

  /**
   * Parse generated content response
   */
  private parseGeneratedContent(text: string): GeneratedContent {
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;

      const parsed = JSON.parse(jsonText);

      return {
        caption: parsed.caption || '',
        hashtags: parsed.hashtags || [],
        callToAction: parsed.call_to_action || '',
        suggestedMediaType: parsed.suggested_media_type || 'image',
        targetAudience: parsed.target_audience || '',
        estimatedEngagement: parsed.estimated_engagement || 'medium',
        variations: parsed.variations || [],
      };
    } catch (error) {
      logger.error('Failed to parse generated content', { error, text });
      return {
        caption: text.substring(0, 500),
        hashtags: [],
        callToAction: '',
        suggestedMediaType: 'image',
        targetAudience: '',
        estimatedEngagement: 'low',
        variations: [],
      };
    }
  }

  /**
   * Generate batch content for multiple products
   */
  async generateBatchContent(
    products: Product[],
    brandVoice: BrandVoice,
    viralTrends: ViralTrend[],
    platform: string
  ): Promise<Map<string, GeneratedContent>> {
    const contentMap = new Map<string, GeneratedContent>();

    for (const product of products) {
      const content = await this.generatePostContent(product, brandVoice, viralTrends, platform);
      contentMap.set(product.id, content);
    }

    return contentMap;
  }

  /**
   * Refine existing content based on feedback
   */
  async refineContent(
    originalContent: GeneratedContent,
    feedback: string,
    brandVoice: BrandVoice
  ): Promise<GeneratedContent> {
    const prompt = `You are refining social media content based on user feedback.

ORIGINAL CONTENT:
Caption: ${originalContent.caption}
Hashtags: ${originalContent.hashtags.join(', ')}
CTA: ${originalContent.callToAction}

USER FEEDBACK:
${feedback}

BRAND VOICE:
${JSON.stringify(brandVoice, null, 2)}

Refine the content addressing the feedback while maintaining brand voice.

OUTPUT JSON FORMAT:
{
  "caption": "refined caption",
  "hashtags": ["hashtag1", ...],
  "call_to_action": "refined CTA",
  "changes_made": "explanation of changes"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const refined = this.parseGeneratedContent(text);
      return refined;
    } catch (error) {
      logger.error('Content refinement failed', { error });
      return originalContent;
    }
  }

  /**
   * Generate content calendar for a week
   */
  async generateContentCalendar(
    products: Product[],
    brandVoice: BrandVoice,
    viralTrends: ViralTrend[],
    platforms: string[],
    postsPerDay: number
  ): Promise<any[]> {
    const calendar = [];
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (const day of daysOfWeek) {
      for (let i = 0; i < postsPerDay; i++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const platform = platforms[Math.floor(Math.random() * platforms.length)];

        const content = await this.generatePostContent(product, brandVoice, viralTrends, platform);

        calendar.push({
          day,
          platform,
          product: product.name,
          content,
          scheduledTime: this.getOptimalPostingTime(platform, i),
        });
      }
    }

    return calendar;
  }

  /**
   * Get optimal posting time for platform
   */
  private getOptimalPostingTime(platform: string, postIndex: number): string {
    const optimalTimes: Record<string, string[]> = {
      instagram: ['9:00 AM', '2:00 PM', '7:00 PM'],
      facebook: ['1:00 PM', '3:00 PM', '8:00 PM'],
      twitter: ['8:00 AM', '12:00 PM', '5:00 PM'],
      tiktok: ['6:00 AM', '10:00 AM', '7:00 PM'],
      linkedin: ['7:30 AM', '12:00 PM', '5:30 PM'],
    };

    const times = optimalTimes[platform.toLowerCase()] || optimalTimes.instagram;
    return times[postIndex % times.length];
  }
}

export default new ContentGenerationService();

// Made with Bob
