import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../utils/logger';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY,
});

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
}

export class MarketAgentService {
  private static instance: MarketAgentService;
  private currentStatus: string = 'idle';
  private lastAction: string = 'Monitoring market conditions';
  private thinking: string | null = null;
  private insights: MarketInsight[] = [];

  private constructor() {
    // Auto-run market analysis every 2 hours
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
      description: 'Analyzes competitors and market trends',
      activeInsights: this.insights.filter(i => i.severity === 'high').length
    };
  }

  private scheduleMarketAnalysis() {
    // Run every 2 hours
    setInterval(() => {
      this.runMarketAnalysis().catch(err => {
        logger.error('Market Agent scheduled analysis failed:', err);
      });
    }, 2 * 60 * 60 * 1000);

    // Run 10 seconds after startup
    setTimeout(() => {
      this.runMarketAnalysis().catch(err => {
        logger.error('Market Agent initial analysis failed:', err);
      });
    }, 10000);
  }

  async runMarketAnalysis(): Promise<MarketAnalysis> {
    try {
      this.currentStatus = 'working';
      this.thinking = 'Scanning competitor landscape...';
      logger.info('Market Agent: Starting market analysis');

      // Get competitor data (mock - replace with real scraping)
      const competitors = await this.getCompetitorData();

      this.thinking = `Analyzing ${competitors.length} competitors...`;

      // Analyze with Claude
      const analysis = await this.analyzeMarketData(competitors);

      this.thinking = 'Generating actionable insights...';

      // Store insights
      this.insights = [...analysis.insights, ...this.insights].slice(0, 20); // Keep last 20

      this.thinking = null;
      this.currentStatus = 'idle';
      this.lastAction = `Analyzed ${competitors.length} competitors - Found ${analysis.insights.length} new insights`;

      logger.info(`Market Agent: Generated ${analysis.insights.length} insights`);

      return analysis;

    } catch (error) {
      this.currentStatus = 'error';
      this.thinking = null;
      this.lastAction = 'Error during market analysis';
      logger.error('Market Agent error:', error);
      throw error;
    }
  }

  private async analyzeMarketData(competitors: CompetitorData[]): Promise<MarketAnalysis> {
    try {
      const prompt = `You are a Market Intelligence Agent analyzing competitor data for a small business.

**Competitor Data:**
${JSON.stringify(competitors, null, 2)}

**Your Task:**
Analyze this data and provide actionable business intelligence.

**Analysis Areas:**
1. Price positioning - Are we competitive?
2. Product gaps - What are competitors offering that we're not?
3. Market trends - What patterns do you see?
4. Opportunities - Where can we gain advantage?
5. Threats - What risks should we address?

**Return ONLY valid JSON:**
{
  "insights": [
    {
      "type": "price_change|new_product|trend|opportunity",
      "severity": "high|medium|low",
      "title": "Brief insight title",
      "description": "Detailed explanation",
      "recommendation": "Specific action to take"
    }
  ],
  "marketTrends": ["List of 3-5 key market trends"],
  "recommendations": ["List of 3-5 strategic recommendations"]
}

Focus on HIGH SEVERITY insights that require immediate action.`;

      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type');
      }

      let jsonText = content.text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
      }

      const result = JSON.parse(jsonText);

      // Add timestamps
      const insights = result.insights.map((insight: any) => ({
        ...insight,
        createdAt: new Date().toISOString()
      }));

      return {
        insights,
        competitorCount: competitors.length,
        marketTrends: result.marketTrends,
        recommendations: result.recommendations
      };

    } catch (error) {
      logger.error('Error analyzing market data:', error);
      
      // Fallback analysis
      return {
        insights: [
          {
            type: 'trend',
            severity: 'medium',
            title: 'Market Analysis in Progress',
            description: 'Competitor data is being processed. Check back soon for insights.',
            recommendation: 'Continue monitoring competitor activities',
            createdAt: new Date().toISOString()
          }
        ],
        competitorCount: competitors.length,
        marketTrends: ['Market data being analyzed'],
        recommendations: ['Monitor competitor pricing', 'Track new product launches']
      };
    }
  }

  getInsights(severity?: 'high' | 'medium' | 'low'): MarketInsight[] {
    if (severity) {
      return this.insights.filter(i => i.severity === severity);
    }
    return this.insights;
  }

  private async getCompetitorData(): Promise<CompetitorData[]> {
    // Mock data - replace with real web scraping
    return [
      {
        name: 'Fashion Hub',
        products: ['Leather Bags', 'Wallets', 'Belts', 'Shoes'],
        priceRange: { min: 1500, max: 8000 },
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Style Bazaar',
        products: ['Handbags', 'Clutches', 'Jewelry', 'Scarves'],
        priceRange: { min: 2000, max: 12000 },
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Luxury Lane',
        products: ['Designer Bags', 'Premium Wallets', 'Watches'],
        priceRange: { min: 5000, max: 25000 },
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Budget Boutique',
        products: ['Bags', 'Accessories', 'Footwear'],
        priceRange: { min: 800, max: 4000 },
        lastUpdated: new Date().toISOString()
      },
      {
        name: 'Trend Setters',
        products: ['Fashion Bags', 'Sunglasses', 'Belts', 'Watches'],
        priceRange: { min: 1800, max: 9000 },
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  // Simulate real-time competitor price change
  simulatePriceAlert() {
    const alert: MarketInsight = {
      type: 'price_change',
      severity: 'high',
      title: 'Competitor Price Drop Detected',
      description: 'Fashion Hub reduced leather bag prices by 25%. This may impact your sales.',
      recommendation: 'Consider running a limited-time promotion to stay competitive',
      createdAt: new Date().toISOString()
    };
    
    this.insights.unshift(alert);
    this.lastAction = 'ALERT: Competitor price change detected';
    logger.warn('Market Agent: Price alert generated');
    
    return alert;
  }
}

export const marketAgent = MarketAgentService.getInstance();

// Made with Bob
