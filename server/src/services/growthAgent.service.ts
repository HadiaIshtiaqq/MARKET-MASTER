import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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
      description: 'Detects churn and creates re-engagement campaigns',
      pendingApprovals: this.pendingMessages.filter(m => m.status === 'pending').length
    };
  }

  private scheduleChurnAnalysis() {
    setInterval(() => {
      this.runChurnAnalysis().catch(err => {
        logger.error('Growth Agent scheduled analysis failed:', err);
      });
    }, 60 * 60 * 1000);

    setTimeout(() => {
      this.runChurnAnalysis().catch(err => {
        logger.error('Growth Agent initial analysis failed:', err);
      });
    }, 5000);
  }

  async runChurnAnalysis(): Promise<ChurnAnalysis> {
    try {
      this.currentStatus = 'working';
      this.thinking = 'Analyzing customer purchase patterns...';
      logger.info('Growth Agent: Starting churn analysis');

      const customers = await this.getCustomerData();
      this.thinking = 'Identifying at-risk customers...';

      const atRiskCustomers = customers.filter(customer => {
        const daysSinceLastPurchase = this.getDaysSince(customer.lastPurchaseDate);
        return daysSinceLastPurchase >= 30;
      });

      this.thinking = `Found ${atRiskCustomers.length} at-risk customers. Generating personalized messages...`;

      for (const customer of atRiskCustomers.slice(0, 5)) {
        const message = await this.generateReEngagementMessage(customer);
        this.pendingMessages.push(message);
      }

      const churnRate = (atRiskCustomers.length / customers.length) * 100;

      this.thinking = null;
      this.currentStatus = 'idle';
      this.lastAction = `Analyzed ${customers.length} customers - ${atRiskCustomers.length} at risk (${churnRate.toFixed(1)}% churn rate)`;

      logger.info(`Growth Agent: Found ${atRiskCustomers.length} at-risk customers`);

      return {
        atRiskCustomers,
        churnRate,
        recommendations: [
          `${atRiskCustomers.length} customers haven't purchased in 30+ days`,
          `Churn rate is ${churnRate.toFixed(1)}% - ${churnRate > 25 ? 'HIGH RISK' : 'Normal'}`,
          `${this.pendingMessages.length} re-engagement messages ready for approval`
        ]
      };

    } catch (error) {
      this.currentStatus = 'error';
      this.thinking = null;
      this.lastAction = 'Error during churn analysis';
      logger.error('Growth Agent error:', error);
      throw error;
    }
  }

  async generateReEngagementMessage(customer: Customer): Promise<CampaignMessage> {
    try {
      const prompt = `You are a Growth Agent creating personalized re-engagement messages for customers.

**Customer Profile:**
- Name: ${customer.name}
- Last Purchase: ${customer.lastPurchaseDate} (${this.getDaysSince(customer.lastPurchaseDate)} days ago)
- Total Purchases: ${customer.totalPurchases}
- Favorite Products: ${customer.favoriteProducts.join(', ')}
- Total Spent: Rs. ${customer.totalSpent}

**Your Task:**
Create a warm, personalized WhatsApp message to re-engage this customer. 

**Guidelines:**
1. Be friendly and conversational (Pakistani context)
2. Reference their past purchases
3. Create urgency with a limited-time offer
4. Keep it under 160 characters for WhatsApp
5. Include a clear call-to-action

**Return ONLY valid JSON:**
{
  "message": "The WhatsApp message text",
  "reasoning": "Why this message will work for this customer"
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
      }

      const parsed = JSON.parse(jsonText);

      return {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        customerId: customer.id,
        customerName: customer.name,
        message: parsed.message,
        channel: 'whatsapp',
        reasoning: parsed.reasoning,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Error generating message:', error);
      return {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        customerId: customer.id,
        customerName: customer.name,
        message: `Hi ${customer.name}! We miss you! 🌟 Special 20% off on ${customer.favoriteProducts[0]} just for you. Valid 48hrs. Shop now!`,
        channel: 'whatsapp',
        reasoning: 'Fallback message due to generation error',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
    }
  }

  getPendingMessages(): CampaignMessage[] {
    return this.pendingMessages.filter(m => m.status === 'pending');
  }

  approveMessage(messageId: string): CampaignMessage | null {
    const message = this.pendingMessages.find(m => m.id === messageId);
    if (message) {
      message.status = 'approved';
      this.lastAction = `Approved message for ${message.customerName}`;
      logger.info(`Growth Agent: Message approved for ${message.customerName}`);
      
      setTimeout(() => {
        message.status = 'sent';
        this.lastAction = `Sent message to ${message.customerName}`;
      }, 1000);
    }
    return message || null;
  }

  approveAllMessages(): number {
    const pending = this.getPendingMessages();
    pending.forEach(msg => this.approveMessage(msg.id));
    return pending.length;
  }

  private getDaysSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private async getCustomerData(): Promise<Customer[]> {
    return [
      {
        id: 'cust_1',
        name: 'Ahmed Khan',
        lastPurchaseDate: '2024-11-15',
        totalPurchases: 12,
        favoriteProducts: ['Leather Bag', 'Wallet'],
        totalSpent: 45000
      },
      {
        id: 'cust_2',
        name: 'Fatima Ali',
        lastPurchaseDate: '2024-12-20',
        totalPurchases: 8,
        favoriteProducts: ['Handbag', 'Clutch'],
        totalSpent: 32000
      },
      {
        id: 'cust_3',
        name: 'Hassan Raza',
        lastPurchaseDate: '2024-10-10',
        totalPurchases: 15,
        favoriteProducts: ['Belt', 'Shoes'],
        totalSpent: 67000
      },
      {
        id: 'cust_4',
        name: 'Ayesha Malik',
        lastPurchaseDate: '2024-11-01',
        totalPurchases: 6,
        favoriteProducts: ['Scarf', 'Jewelry'],
        totalSpent: 28000
      },
      {
        id: 'cust_5',
        name: 'Bilal Ahmed',
        lastPurchaseDate: '2025-01-10',
        totalPurchases: 20,
        favoriteProducts: ['Watch', 'Sunglasses'],
        totalSpent: 95000
      }
    ];
  }
}

export const growthAgent = GrowthAgentService.getInstance();

// Made with Bob
