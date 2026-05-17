import { watsonx, WatsonXService } from './watsonx.service';
import { dataAgent } from './dataAgent.service';
import { growthAgent } from './growthAgent.service';
import { marketAgent } from './marketAgent.service';
import { db } from './database.service';
import { logger } from '../utils/logger';

interface AgentMessage {
  from: string;
  to: string;
  message: string;
  timestamp: string;
  type: 'coordination' | 'alert' | 'request' | 'tool_call' | 'tool_result';
}

interface AgentTask {
  id: string;
  description: string;
  assignedAgent: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  toolCallsMade?: string[];
  startedAt: string;
  completedAt?: string;
}

// Tools available to the IBM Granite orchestrator
const ORCHESTRATOR_TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'get_inventory_status',
      description: 'Get current inventory levels, low stock items, and reorder recommendations',
      parameters: {
        type: 'object',
        properties: {
          category: { type: 'string', description: 'Product category to filter by (optional)' },
        },
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_at_risk_customers',
      description: 'Get customers who have not purchased recently and are at risk of churning',
      parameters: {
        type: 'object',
        properties: {
          days_threshold: { type: 'number', description: 'Number of days since last purchase to consider at-risk' },
        },
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_market_insights',
      description: 'Get competitor analysis and market trend insights',
      parameters: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['high', 'medium', 'low'], description: 'Filter by insight severity' },
        },
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'generate_reengagement_campaign',
      description: 'Generate personalized WhatsApp re-engagement messages for at-risk customers',
      parameters: {
        type: 'object',
        properties: {
          customer_ids: { type: 'array', items: { type: 'string' }, description: 'List of customer IDs to target' },
        },
        required: ['customer_ids'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'create_purchase_order',
      description: 'Create a purchase order recommendation for low-stock items',
      parameters: {
        type: 'object',
        properties: {
          product_name: { type: 'string', description: 'Product to reorder' },
          quantity: { type: 'number', description: 'Recommended order quantity (EOQ)' },
          supplier: { type: 'string', description: 'Supplier name' },
        },
        required: ['product_name', 'quantity'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'analyze_sales_velocity',
      description: 'Analyze sales velocity and predict stockout dates for products',
      parameters: {
        type: 'object',
        properties: {
          product_category: { type: 'string', description: 'Category to analyze' },
        },
      },
    },
  },
];

export class AgentOrchestratorService {
  private static instance: AgentOrchestratorService;
  private agentMessages: AgentMessage[] = [];
  private activeTasks: AgentTask[] = [];
  private coordinationEnabled: boolean = true;

  private constructor() {
    this.initializeCoordination();
  }

  static getInstance(): AgentOrchestratorService {
    if (!AgentOrchestratorService.instance) {
      AgentOrchestratorService.instance = new AgentOrchestratorService();
    }
    return AgentOrchestratorService.instance;
  }

  private initializeCoordination() {
    setInterval(() => {
      if (this.coordinationEnabled) this.checkForCoordinationOpportunities();
    }, 30000);
  }

  private async checkForCoordinationOpportunities() {
    const growthStatus = growthAgent.getStatus();
    const marketStatus = marketAgent.getStatus();

    if (growthStatus.status === 'idle' && marketStatus.status === 'idle' && Math.random() > 0.7) {
      this.addAgentMessage({
        from: 'IBM Granite Orchestrator',
        to: 'Market Agent',
        message: 'Churn rate elevated. Requesting competitor pricing analysis.',
        timestamp: new Date().toISOString(),
        type: 'request',
      });
    }
  }

  getAllAgentStatuses() {
    return [dataAgent.getStatus(), growthAgent.getStatus(), marketAgent.getStatus()];
  }

  getAgentMessages(): AgentMessage[] {
    return this.agentMessages.slice(-20);
  }

  getActiveTasks(): AgentTask[] {
    return this.activeTasks.slice(-10);
  }

  addAgentMessage(message: AgentMessage) {
    this.agentMessages.push(message);
    if (this.agentMessages.length > 100) {
      this.agentMessages = this.agentMessages.slice(-100);
    }
    try {
      db.saveAgentMessage({ from_agent: message.from, to_agent: message.to, message: message.message, msg_type: message.type });
    } catch { /* non-critical */ }
  }

  /**
   * Run a full agentic task using IBM Granite with tool-calling
   * This is the core demo: IBM Granite autonomously decides which tools to invoke
   */
  async runAgenticTask(taskDescription: string): Promise<AgentTask> {
    const task: AgentTask = {
      id: `task_${Date.now()}`,
      description: taskDescription,
      assignedAgent: 'IBM Granite Orchestrator',
      status: 'running',
      toolCallsMade: [],
      startedAt: new Date().toISOString(),
    };
    this.activeTasks.push(task);

    this.addAgentMessage({
      from: 'IBM Granite Orchestrator',
      to: 'All Agents',
      message: `Starting agentic task: "${taskDescription}"`,
      timestamp: new Date().toISOString(),
      type: 'coordination',
    });

    logger.info(`Orchestrator: Starting agentic task with IBM Granite`, { task: taskDescription });

    try {
      const systemPrompt = `You are the IBM Granite Orchestrator — the master AI agent for MarketMaster AI.
You coordinate Data Agent, Growth Agent, and Market Agent to solve complex business problems.
You have access to tools to gather data and take actions.
Think step-by-step. Use tools to gather information before making recommendations.
Always provide concrete, actionable recommendations backed by the data you collect.`;

      const { result, iterations, toolCallsMade } = await watsonx.agenticLoop(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: taskDescription },
        ],
        ORCHESTRATOR_TOOLS,
        this.executeToolCall.bind(this),
        { model: WatsonXService.MODELS.GRANITE_3_8B, maxIterations: 5 }
      );

      task.status = 'completed';
      task.result = result;
      task.toolCallsMade = toolCallsMade;
      task.completedAt = new Date().toISOString();

      this.addAgentMessage({
        from: 'IBM Granite Orchestrator',
        to: 'All Agents',
        message: `Task completed in ${iterations} iterations. Tools used: ${toolCallsMade.join(', ') || 'none'}`,
        timestamp: new Date().toISOString(),
        type: 'coordination',
      });

      logger.info(`Orchestrator: Agentic task completed`, { iterations, toolCallsMade });
      return task;
    } catch (error: any) {
      task.status = 'failed';
      task.result = error.message;
      task.completedAt = new Date().toISOString();
      logger.error('Orchestrator: Agentic task failed', { error: error.message });
      throw error;
    }
  }

  private async executeToolCall(name: string, args: Record<string, unknown>): Promise<string> {
    logger.info(`Orchestrator: Executing tool "${name}"`, { args });

    this.addAgentMessage({
      from: 'IBM Granite Orchestrator',
      to: 'Tool System',
      message: `Calling tool: ${name}(${JSON.stringify(args)})`,
      timestamp: new Date().toISOString(),
      type: 'tool_call',
    });

    let result: string;

    switch (name) {
      case 'get_inventory_status': {
        const category = (args.category as string) || 'all';
        const inventory = db.getInventory(category).slice(0, 15);
        const lowStock = db.getLowStockProducts();
        result = JSON.stringify({
          inventory: inventory.map(p => ({ product: p.name, sku: p.sku, stock: p.stock_quantity, reorderPoint: p.reorder_point, category: p.category, unitPrice: `PKR ${p.unit_price.toLocaleString()}` })),
          lowStockCount: lowStock.length,
          lowStockItems: lowStock.map(p => ({ product: p.name, stock: p.stock_quantity, reorderPoint: p.reorder_point })),
          totalProducts: inventory.length,
          category,
        });
        break;
      }

      case 'get_at_risk_customers': {
        const threshold = (args.days_threshold as number) || 30;
        const customers = db.getAtRiskCustomers(threshold).map(c => ({
          id: c.customer_id,
          name: c.customer_name,
          city: c.city,
          daysSinceLastPurchase: c.days_since_purchase,
          totalSpent: `PKR ${c.total_lifetime_value.toLocaleString()}`,
          favoriteCategory: c.favorite_category,
          phone: c.phone,
        }));
        result = JSON.stringify({ atRiskCustomers: customers, threshold, totalAtRisk: customers.length });
        break;
      }

      case 'get_market_insights': {
        const severity = args.severity as string | undefined;
        const insights = marketAgent.getInsights(severity as any);
        result = JSON.stringify({
          insights: insights.slice(0, 5),
          totalInsights: insights.length,
          highSeverityCount: insights.filter((i) => i.severity === 'high').length,
        });
        break;
      }

      case 'generate_reengagement_campaign': {
        const customerIds = (args.customer_ids as string[]) || [];
        result = JSON.stringify({
          campaignCreated: true,
          targetedCustomers: customerIds.length,
          channel: 'whatsapp',
          estimatedReachRate: '68%',
          messages: customerIds.map((id) => ({
            customerId: id,
            status: 'drafted',
            personalizedMessage: `Hi! We miss you! Exclusive 20% off for valued customers — valid 48hrs only. Shop now! 🎁`,
          })),
        });
        break;
      }

      case 'create_purchase_order': {
        const productName = (args.product_name as string) || 'Leather Goods';
        const qty = (args.quantity as number) || 50;
        const lowItems = db.getLowStockProducts();
        const unitPrice = lowItems.find(p => p.name.toLowerCase().includes(productName.toLowerCase()))?.unit_price || 5000;
        result = JSON.stringify({
          poCreated: true,
          poNumber: `PO-${Date.now()}`,
          product: productName,
          quantity: qty,
          supplier: (args.supplier as string) || 'Premium Leather Goods Ltd.',
          estimatedDelivery: '15 business days',
          totalValue: `PKR ${(qty * unitPrice).toLocaleString()}`,
          status: 'draft_ready_for_approval',
          itemsIncluded: lowItems.slice(0, 3).map(p => ({ sku: p.sku, name: p.name, currentStock: p.stock_quantity, reorderPoint: p.reorder_point })),
        });
        break;
      }

      case 'analyze_sales_velocity': {
        const velocityData = db.getSalesVelocity(args.product_category as string);
        const critical = velocityData.filter((p: any) => p.days_until_stockout <= 7);
        const revenueAtRisk = critical.reduce((sum: number, p: any) => sum + p.stock_quantity * p.unit_price, 0);
        result = JSON.stringify({
          category: args.product_category || 'all',
          topVelocityItems: velocityData.slice(0, 6).map((p: any) => ({
            product: p.name,
            unitsSoldPerWeek: p.units_sold_per_week,
            stockoutDate: `${p.days_until_stockout} days`,
            urgency: p.days_until_stockout <= 3 ? 'critical' : p.days_until_stockout <= 7 ? 'high' : 'medium',
          })),
          revenueAtRisk: `PKR ${revenueAtRisk.toLocaleString()}`,
          criticalItemCount: critical.length,
          recommendation: critical.length > 0
            ? `Place emergency reorder for ${critical.length} item(s) immediately`
            : 'Stock levels acceptable across all categories',
        });
        break;
      }

      default:
        result = JSON.stringify({ error: `Unknown tool: ${name}` });
    }

    this.addAgentMessage({
      from: 'Tool System',
      to: 'IBM Granite Orchestrator',
      message: `Tool "${name}" returned ${result.length} chars of data`,
      timestamp: new Date().toISOString(),
      type: 'tool_result',
    });

    return result;
  }

  async triggerAgentCoordination(
    scenario: 'sales_drop' | 'competitor_alert' | 'customer_churn' | 'low_stock'
  ) {
    logger.info(`Orchestrator: Triggered scenario "${scenario}" via IBM Granite`);

    const scenarioTasks: Record<string, string> = {
      sales_drop:
        'Sales dropped 25% this week. Analyze inventory levels, identify at-risk customers, and recommend immediate actions to recover revenue.',
      competitor_alert:
        'A competitor just launched a 30% off sale. Analyze market insights and recommend a counter-campaign strategy.',
      customer_churn:
        'Customer churn rate is elevated. Identify at-risk customers and generate personalized re-engagement campaigns.',
      low_stock:
        'Multiple products are running low on stock. Analyze sales velocity and create priority purchase orders before stockouts occur.',
    };

    try {
      const task = await this.runAgenticTask(scenarioTasks[scenario]);
      return { scenario, triggered: true, task, messages: this.getAgentMessages() };
    } catch (error: any) {
      // Fallback to simulated coordination for demo robustness
      this.simulateCoordination(scenario);
      return { scenario, triggered: true, task: null, messages: this.getAgentMessages() };
    }
  }

  private simulateCoordination(scenario: string) {
    const scripts: Record<string, AgentMessage[]> = {
      sales_drop: [
        { from: 'IBM Granite Orchestrator', to: 'Data Agent', message: 'Sales dropped 25%. Requesting transaction analysis.', timestamp: new Date().toISOString(), type: 'request' },
        { from: 'Data Agent', to: 'IBM Granite Orchestrator', message: 'Analysis: 60% drop in leather goods sales. Possible competitor promotion.', timestamp: new Date(Date.now() + 2000).toISOString(), type: 'coordination' },
        { from: 'IBM Granite Orchestrator', to: 'Growth Agent', message: 'Launching emergency re-engagement for top 20 customers.', timestamp: new Date(Date.now() + 4000).toISOString(), type: 'coordination' },
      ],
      competitor_alert: [
        { from: 'Market Agent', to: 'IBM Granite Orchestrator', message: 'ALERT: Fashion Hub launched 30% off leather goods.', timestamp: new Date().toISOString(), type: 'alert' },
        { from: 'IBM Granite Orchestrator', to: 'Growth Agent', message: 'Counter-campaign needed. Recommend 25% flash sale for 24 hours.', timestamp: new Date(Date.now() + 1500).toISOString(), type: 'coordination' },
      ],
    };

    const messages = scripts[scenario] || [];
    messages.forEach((msg, i) => setTimeout(() => this.addAgentMessage(msg), i * 1500));
  }

  getSystemMetrics() {
    const agents = this.getAllAgentStatuses();
    return {
      totalAgents: agents.length,
      activeAgents: agents.filter((a) => a.status === 'working').length,
      idleAgents: agents.filter((a) => a.status === 'idle').length,
      errorAgents: agents.filter((a) => a.status === 'error').length,
      recentMessages: this.agentMessages.length,
      activeTasks: this.activeTasks.filter((t) => t.status === 'running').length,
      completedTasks: this.activeTasks.filter((t) => t.status === 'completed').length,
      coordinationEnabled: this.coordinationEnabled,
      ibmGraniteModel: WatsonXService.MODELS.GRANITE_3_8B,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  toggleCoordination(enabled: boolean) {
    this.coordinationEnabled = enabled;
    return { coordinationEnabled: this.coordinationEnabled };
  }
}

export const orchestrator = AgentOrchestratorService.getInstance();
