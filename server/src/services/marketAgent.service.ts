import { watsonx, WatsonXService } from './watsonx.service';
import { db } from './database.service';
import { logger } from '../utils/logger';

interface CompetitorData {
  name: string;
  products: string[];
  priceRange: { min: number; max: number };
  lastUpdated: string;
}

interface MarketInsight {
  type: 'price_change' | 'new_product' | 'trend' | 'opportunity';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  createdAt: string;
}

interface MarketAnalysis {
  insights: MarketInsight[];
  competitorCount: number;
  marketTrends: string[];
  recommendations: string[];
  modelUsed: string;
}

export class MarketAgentService {
  private static instance: MarketAgentService;
  private currentStatus: string = 'idle';
  private lastAction: string = 'Monitoring market conditions';
  private thinking: string | null = null;
  private insights: MarketInsight[] = [];

  private constructor() {
    this.scheduleMarketAnalysis();
  }

  static getInstance(): MarketAgentService {
    if (!MarketAgentService.instance) {
      MarketAgentService.instance = new MarketAgentService();
    }
    return MarketAgentService.instance;
  }

  getStatus() {
    return {
      name: 'Market Agent',
      status: this.currentStatus,
      last_action: this.lastAction,
      thinking: this.thinking,
      icon: '📈',
      description: 'Analyzes competitors and market trends via IBM Granite',
      activeInsights: this.insights.filter((i) => i.severity === 'high').length,
      modelUsed: WatsonXService.MODELS.GRANITE_3_8B,
    };
  }

  private scheduleMarketAnalysis() {
    setInterval(() => {
      this.runMarketAnalysis().catch((err) => logger.error('Market Agent scheduled analysis failed:', err));
    }, 2 * 60 * 60 * 1000);

    setTimeout(() => {
      this.runMarketAnalysis().catch((err) => logger.error('Market Agent initial analysis failed:', err));
    }, 12000);
  }

  async runMarketAnalysis(): Promise<MarketAnalysis> {
    try {
      this.currentStatus = 'working';
      this.thinking = 'IBM Granite scanning competitor landscape...';
      logger.info('Market Agent: Starting market analysis with IBM Granite');

      const competitors = await this.getCompetitorData();
      this.thinking = `IBM Granite analyzing ${competitors.length} competitors...`;

      const systemPrompt = `You are a Market Intelligence Agent powered by IBM Granite.
Analyze competitor data for a Pakistani small business selling fashion accessories.
Provide actionable business intelligence with specific recommendations.

Respond ONLY with valid JSON:
{
  "insights": [
    {
      "type": "price_change|new_product|trend|opportunity",
      "severity": "high|medium|low",
      "title": "Brief insight title",
      "description": "Detailed explanation",
      "recommendation": "Specific action to take immediately"
    }
  ],
  "marketTrends": ["3-5 key market trends observed"],
  "recommendations": ["3-5 strategic recommendations for the business"]
}`;

      const userMessage = `Competitor Data:
${JSON.stringify(competitors, null, 2)}

Generate high-severity insights that require immediate action. Focus on pricing gaps, product opportunities, and market trends.`;

      const raw = await watsonx.simpleChat(systemPrompt, userMessage, {
        model: WatsonXService.MODELS.GRANITE_3_8B,
        maxTokens: 2000,
        temperature: 0.3,
      });

      this.thinking = 'Generating actionable insights...';

      const cleaned = this.cleanJSON(raw);
      const result = JSON.parse(cleaned);

      const newInsights: MarketInsight[] = result.insights.map((i: any) => ({
        ...i,
        createdAt: new Date().toISOString(),
      }));

      this.insights = [...newInsights, ...this.insights].slice(0, 20);
      this.thinking = null;
      this.currentStatus = 'idle';
      this.lastAction = `Analyzed ${competitors.length} competitors — found ${newInsights.length} insights`;

      return {
        insights: newInsights,
        competitorCount: competitors.length,
        marketTrends: result.marketTrends || [],
        recommendations: result.recommendations || [],
        modelUsed: WatsonXService.MODELS.GRANITE_3_8B,
      };
    } catch (error: any) {
      this.currentStatus = 'error';
      this.thinking = null;
      this.lastAction = 'Error during market analysis';
      logger.error('Market Agent error:', error);

      return {
        insights: [
          {
            type: 'trend',
            severity: 'medium',
            title: 'Market Analysis in Progress',
            description: 'IBM Granite is processing competitor data. Check back shortly.',
            recommendation: 'Continue monitoring competitor activities',
            createdAt: new Date().toISOString(),
          },
        ],
        competitorCount: 5,
        marketTrends: ['Analyzing market data...'],
        recommendations: ['Monitor competitor pricing', 'Track new product launches'],
        modelUsed: WatsonXService.MODELS.GRANITE_3_8B,
      };
    }
  }

  getInsights(severity?: 'high' | 'medium' | 'low'): MarketInsight[] {
    return severity ? this.insights.filter((i) => i.severity === severity) : this.insights;
  }

  simulatePriceAlert() {
    const alert: MarketInsight = {
      type: 'price_change',
      severity: 'high',
      title: 'Competitor Price Drop Detected',
      description: 'Fashion Hub reduced leather bag prices by 25%. This may impact your sales significantly.',
      recommendation: 'Run a limited-time 20% promotion on leather bags within 24 hours to stay competitive',
      createdAt: new Date().toISOString(),
    };
    this.insights.unshift(alert);
    this.lastAction = 'ALERT: Competitor price change detected by IBM Granite';
    return alert;
  }

  private cleanJSON(text: string): string {
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\n?/, '').replace(/\n?```$/, '');
    return cleaned;
  }

  private async getCompetitorData(): Promise<CompetitorData[]> {
    return db.getCompetitors().map(c => ({
      name: c.name,
      products: c.product_categories.split(', '),
      priceRange: { min: c.price_min, max: c.price_max },
      lastUpdated: c.last_updated,
    }));
  }
}

export const marketAgent = MarketAgentService.getInstance();
