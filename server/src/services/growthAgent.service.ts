import { watsonx, WatsonXService } from './watsonx.service';
import { db } from './database.service';
import { logger } from '../utils/logger';

interface Customer {
  id: string;
  name: string;
  lastPurchaseDate: string;
  totalPurchases: number;
  favoriteProducts: string[];
  totalSpent: number;
}

interface CampaignMessage {
  id: string;
  customerId: string;
  customerName: string;
  message: string;
  channel: 'whatsapp' | 'sms' | 'email';
  reasoning: string;
  status: 'pending' | 'approved' | 'sent' | 'responded';
  createdAt: string;
}

interface ChurnAnalysis {
  atRiskCustomers: Customer[];
  churnRate: number;
  recommendations: string[];
}

export class GrowthAgentService {
  private static instance: GrowthAgentService;
  private currentStatus: string = 'idle';
  private lastAction: string = 'Monitoring customer engagement';
  private thinking: string | null = null;
  private pendingMessages: CampaignMessage[] = [];

  private constructor() {
    this.scheduleChurnAnalysis();
  }

  static getInstance(): GrowthAgentService {
    if (!GrowthAgentService.instance) {
      GrowthAgentService.instance = new GrowthAgentService();
    }
    return GrowthAgentService.instance;
  }

  getStatus() {
    return {
      name: 'Growth Agent',
      status: this.currentStatus,
      last_action: this.lastAction,
      thinking: this.thinking,
      icon: '🎯',
      description: 'Detects churn and creates re-engagement campaigns via IBM Granite',
      pendingApprovals: this.pendingMessages.filter((m) => m.status === 'pending').length,
      modelUsed: WatsonXService.MODELS.GRANITE_3_8B,
    };
  }

  private scheduleChurnAnalysis() {
    setInterval(() => {
      this.runChurnAnalysis().catch((err) => logger.error('Growth Agent scheduled analysis failed:', err));
    }, 60 * 60 * 1000);

    setTimeout(() => {
      this.runChurnAnalysis().catch((err) => logger.error('Growth Agent initial analysis failed:', err));
    }, 8000);
  }

  async runChurnAnalysis(): Promise<ChurnAnalysis> {
    try {
      this.currentStatus = 'working';
      this.thinking = 'IBM Granite analyzing customer purchase patterns...';
      logger.info('Growth Agent: Starting churn analysis with IBM Granite');

      const customers = await this.getCustomerData();
      this.thinking = `IBM Granite identifying at-risk customers from ${customers.length} profiles...`;

      const atRiskCustomers = customers.filter((c) => this.getDaysSince(c.lastPurchaseDate) >= 30);

      this.thinking = `Found ${atRiskCustomers.length} at-risk. IBM Granite generating personalized messages...`;

      for (const customer of atRiskCustomers.slice(0, 5)) {
        const message = await this.generateReEngagementMessage(customer);
        this.pendingMessages.push(message);
      }

      const churnRate = (atRiskCustomers.length / customers.length) * 100;

      this.thinking = null;
      this.currentStatus = 'idle';
      this.lastAction = `Analyzed ${customers.length} customers — ${atRiskCustomers.length} at risk (${churnRate.toFixed(1)}% churn rate)`;

      return {
        atRiskCustomers,
        churnRate,
        recommendations: [
          `${atRiskCustomers.length} customers haven't purchased in 30+ days`,
          `Churn rate: ${churnRate.toFixed(1)}% — ${churnRate > 25 ? 'HIGH RISK' : 'Normal'}`,
          `${this.pendingMessages.filter((m) => m.status === 'pending').length} IBM Granite messages awaiting approval`,
        ],
      };
    } catch (error: any) {
      this.currentStatus = 'error';
      this.thinking = null;
      this.lastAction = 'Error during churn analysis';
      logger.error('Growth Agent error:', error);
      throw error;
    }
  }

  async generateReEngagementMessage(customer: Customer): Promise<CampaignMessage> {
    const systemPrompt = `You are a Growth Agent powered by IBM Granite.
Create personalized WhatsApp re-engagement messages for Pakistani small business customers.
Be warm, friendly, and reference their purchase history.
Keep messages under 160 characters with a clear call-to-action.

Respond ONLY with valid JSON:
{
  "message": "The WhatsApp message text",
  "reasoning": "Why this message will work for this customer"
}`;

    const userMessage = `Customer Profile:
- Name: ${customer.name}
- Last Purchase: ${customer.lastPurchaseDate} (${this.getDaysSince(customer.lastPurchaseDate)} days ago)
- Total Purchases: ${customer.totalPurchases}
- Favorite Products: ${customer.favoriteProducts.join(', ')}
- Total Spent: Rs. ${customer.totalSpent.toLocaleString()}

Generate a personalized WhatsApp re-engagement message.`;

    try {
      const raw = await watsonx.simpleChat(systemPrompt, userMessage, {
        model: WatsonXService.MODELS.GRANITE_3_8B,
        maxTokens: 500,
        temperature: 0.7,
      });

      let cleaned = raw.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      else if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```\n?/, '').replace(/\n?```$/, '');

      const parsed = JSON.parse(cleaned);

      return {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        customerId: customer.id,
        customerName: customer.name,
        message: parsed.message,
        channel: 'whatsapp',
        reasoning: parsed.reasoning,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    } catch (error: any) {
      logger.error('Growth Agent: IBM Granite message generation failed', { error: error.message });
      return {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        customerId: customer.id,
        customerName: customer.name,
        message: `Hi ${customer.name.split(' ')[0]}! We miss you! ✨ Special 20% off on ${customer.favoriteProducts[0]} just for you. Valid 48hrs only!`,
        channel: 'whatsapp',
        reasoning: 'Fallback message — IBM Granite temporarily unavailable',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
    }
  }

  getPendingMessages(): CampaignMessage[] {
    return this.pendingMessages.filter((m) => m.status === 'pending');
  }

  approveMessage(messageId: string): CampaignMessage | null {
    const message = this.pendingMessages.find((m) => m.id === messageId);
    if (message) {
      message.status = 'approved';
      this.lastAction = `Approved IBM Granite message for ${message.customerName}`;
      setTimeout(() => {
        message.status = 'sent';
        this.lastAction = `Sent message to ${message.customerName}`;
      }, 1000);
    }
    return message || null;
  }

  approveAllMessages(): number {
    const pending = this.getPendingMessages();
    pending.forEach((msg) => this.approveMessage(msg.id));
    return pending.length;
  }

  private getDaysSince(dateString: string): number {
    const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private async getCustomerData(): Promise<Customer[]> {
    return db.getAllCustomers().map(c => ({
      id: c.customer_id,
      name: c.customer_name,
      lastPurchaseDate: c.last_purchase_date,
      totalPurchases: c.purchase_frequency,
      favoriteProducts: [c.favorite_category],
      totalSpent: c.total_lifetime_value,
    }));
  }
}

export const growthAgent = GrowthAgentService.getInstance();
