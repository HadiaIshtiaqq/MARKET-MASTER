import { dataAgent } from './dataAgent.service';
import { growthAgent } from './growthAgent.service';
import { marketAgent } from './marketAgent.service';
import { logger } from '../utils/logger';

interface AgentStatus {
  name: string;
  status: string;
  last_action: string;
  thinking: string | null;
  icon: string;
  description: string;
  [key: string]: any;
}

interface AgentMessage {
  from: string;
  to: string;
  message: string;
  timestamp: string;
  type: 'coordination' | 'alert' | 'request';
}

export class AgentOrchestratorService {
  private static instance: AgentOrchestratorService;
  private agentMessages: AgentMessage[] = [];
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
    // Simulate multi-agent coordination
    setInterval(() => {
      if (this.coordinationEnabled) {
        this.checkForCoordinationOpportunities();
      }
    }, 30000); // Every 30 seconds
  }

  private async checkForCoordinationOpportunities() {
    try {
      // Example: If Growth Agent detects high churn, ask Market Agent to check competitors
      const growthStatus = growthAgent.getStatus();
      const marketStatus = marketAgent.getStatus();

      // Simulate agent-to-agent communication
      if (growthStatus.status === 'idle' && marketStatus.status === 'idle') {
        const random = Math.random();
        
        if (random > 0.7) {
          // Growth Agent requests market data
          this.addAgentMessage({
            from: 'Growth Agent',
            to: 'Market Agent',
            message: 'Churn rate increased. Need competitor pricing analysis.',
            timestamp: new Date().toISOString(),
            type: 'request'
          });

          logger.info('Agent Coordination: Growth Agent requested market analysis');
        }
      }
    } catch (error) {
      logger.error('Coordination check failed:', error);
    }
  }

  getAllAgentStatuses(): AgentStatus[] {
    return [
      dataAgent.getStatus(),
      growthAgent.getStatus(),
      marketAgent.getStatus()
    ];
  }

  getAgentMessages(): AgentMessage[] {
    return this.agentMessages.slice(-10); // Last 10 messages
  }

  addAgentMessage(message: AgentMessage) {
    this.agentMessages.push(message);
    
    // Keep only last 50 messages
    if (this.agentMessages.length > 50) {
      this.agentMessages = this.agentMessages.slice(-50);
    }
  }

  async triggerAgentCoordination(scenario: 'sales_drop' | 'competitor_alert' | 'customer_churn') {
    logger.info(`Agent Coordination: Triggered ${scenario} scenario`);

    switch (scenario) {
      case 'sales_drop':
        this.addAgentMessage({
          from: 'Data Agent',
          to: 'Market Agent',
          message: 'Sales dropped 25% this week. Analyzing...',
          timestamp: new Date().toISOString(),
          type: 'alert'
        });

        setTimeout(() => {
          this.addAgentMessage({
            from: 'Market Agent',
            to: 'Growth Agent',
            message: 'Competitor launched 30% off sale. Recommend counter-campaign.',
            timestamp: new Date().toISOString(),
            type: 'coordination'
          });
        }, 2000);

        setTimeout(() => {
          this.addAgentMessage({
            from: 'Growth Agent',
            to: 'All Agents',
            message: 'Launching emergency re-engagement campaign for top 20 customers.',
            timestamp: new Date().toISOString(),
            type: 'coordination'
          });
        }, 4000);
        break;

      case 'competitor_alert':
        marketAgent.simulatePriceAlert();
        
        this.addAgentMessage({
          from: 'Market Agent',
          to: 'Growth Agent',
          message: 'Competitor price drop detected. Recommend promotional campaign.',
          timestamp: new Date().toISOString(),
          type: 'alert'
        });
        break;

      case 'customer_churn':
        this.addAgentMessage({
          from: 'Growth Agent',
          to: 'Data Agent',
          message: 'High churn detected. Need recent transaction analysis.',
          timestamp: new Date().toISOString(),
          type: 'request'
        });

        setTimeout(() => {
          this.addAgentMessage({
            from: 'Data Agent',
            to: 'Growth Agent',
            message: 'Analysis complete: 45% of churned customers bought seasonal items.',
            timestamp: new Date().toISOString(),
            type: 'coordination'
          });
        }, 2000);
        break;
    }

    return {
      scenario,
      triggered: true,
      messages: this.getAgentMessages()
    };
  }

  getSystemMetrics() {
    const agents = this.getAllAgentStatuses();
    
    return {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === 'working').length,
      idleAgents: agents.filter(a => a.status === 'idle').length,
      errorAgents: agents.filter(a => a.status === 'error').length,
      recentMessages: this.agentMessages.length,
      coordinationEnabled: this.coordinationEnabled,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }

  toggleCoordination(enabled: boolean) {
    this.coordinationEnabled = enabled;
    logger.info(`Agent Coordination: ${enabled ? 'Enabled' : 'Disabled'}`);
    return { coordinationEnabled: this.coordinationEnabled };
  }
}

export const orchestrator = AgentOrchestratorService.getInstance();

// Made with Bob
