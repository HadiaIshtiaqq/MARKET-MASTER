import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Zap,
  Settings,
  Play,
  Pause,
  Save,
  Copy,
  Trash2,
  Plus,
  Code,
  Brain,
  Target,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sliders,
  Database,
  Workflow,
  MessageSquare,
  Eye,
  Edit
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AgentBuilder() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agentTemplates = [
    {
      id: 1,
      name: 'Sales Assistant',
      description: 'Automated lead qualification and outreach',
      icon: Target,
      color: 'secondary',
      capabilities: ['Lead Scoring', 'Email Campaigns', 'Follow-ups'],
      status: 'active',
      instances: 3
    },
    {
      id: 2,
      name: 'Inventory Monitor',
      description: 'Real-time stock tracking and alerts',
      icon: Database,
      color: 'primary',
      capabilities: ['Stock Alerts', 'Reorder Automation', 'Demand Forecasting'],
      status: 'active',
      instances: 2
    },
    {
      id: 3,
      name: 'Customer Support',
      description: 'AI-powered customer service automation',
      icon: MessageSquare,
      color: 'tertiary',
      capabilities: ['Ticket Routing', 'Auto-responses', 'Sentiment Analysis'],
      status: 'draft',
      instances: 0
    },
    {
      id: 4,
      name: 'Analytics Agent',
      description: 'Data analysis and reporting automation',
      icon: Activity,
      color: 'primary',
      capabilities: ['Report Generation', 'Trend Analysis', 'Anomaly Detection'],
      status: 'active',
      instances: 1
    }
  ];

  const deployedAgents = [
    {
      id: 1,
      name: 'IBM Bob',
      type: 'Logistics Optimizer',
      status: 'running',
      uptime: '14d 2h',
      tasks: 1247,
      efficiency: 98.5,
      lastActivity: '2 min ago'
    },
    {
      id: 2,
      name: 'Sales Scout',
      type: 'Lead Generation',
      status: 'running',
      uptime: '8d 14h',
      tasks: 892,
      efficiency: 97.2,
      lastActivity: '5 min ago'
    },
    {
      id: 3,
      name: 'Stock Sentinel',
      type: 'Inventory Monitor',
      status: 'idle',
      uptime: '21d 6h',
      tasks: 456,
      efficiency: 99.1,
      lastActivity: '4h ago'
    }
  ];

  const agentMetrics = [
    { label: 'Total Agents', value: '12', icon: Bot, color: 'primary' },
    { label: 'Active Now', value: '8', icon: Activity, color: 'secondary' },
    { label: 'Tasks Today', value: '2,847', icon: CheckCircle2, color: 'tertiary' },
    { label: 'Avg Efficiency', value: '98.3%', icon: Zap, color: 'primary' }
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
            AI Agent Studio
          </h1>
          <p className="text-on-surface-variant flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            Design, deploy, and manage autonomous AI agents
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-primary to-secondary text-on-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New Agent
        </motion.button>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agentMetrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 hover:border-primary/40 transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${m.color}/10`}>
                    <Icon className={`w-6 h-6 text-${m.color}`} />
                  </div>
                </div>
                <p className="text-on-surface-variant text-xs uppercase tracking-wider font-bold mb-2">{m.label}</p>
                <h3 className="text-3xl font-bold font-mono">{m.value}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Agent Templates */}
        <div className="xl:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">Agent Templates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agentTemplates.map((template, i) => {
              const Icon = template.icon;
              return (
                <motion.div 
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-surface-container-high p-6 rounded-2xl border border-outline-variant/20 hover:border-primary/40 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 rounded-xl bg-${template.color}/10`}>
                      <Icon className={`w-8 h-8 text-${template.color}`} />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      template.status === 'active' ? 'text-secondary bg-secondary/10' : 'text-on-surface-variant bg-surface-container'
                    }`}>
                      {template.status}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">{template.name}</h3>
                  <p className="text-sm text-on-surface-variant mb-4">{template.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.capabilities.map((cap, idx) => (
                      <span key={idx} className="px-2 py-1 bg-surface-container rounded-lg text-[10px] font-bold">
                        {cap}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                    <span className="text-xs text-on-surface-variant">
                      {template.instances} active instance{template.instances !== 1 ? 's' : ''}
                    </span>
                    <div className="flex items-center gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-surface-container rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-on-surface-variant" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-surface-container rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4 text-on-surface-variant" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                      >
                        <Play className="w-4 h-4 text-primary" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Deployed Agents */}
          <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold">Deployed Agents</h2>
            {deployedAgents.map((agent, i) => (
              <motion.div 
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="bg-surface-container-high/50 p-6 rounded-2xl border border-outline-variant/20 hover:border-secondary/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
                      <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold">{agent.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          agent.status === 'running' ? 'text-secondary bg-secondary/10' : 'text-on-surface-variant bg-surface-container'
                        }`}>
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant">{agent.type}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-6 mr-6">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Uptime</p>
                      <p className="text-sm font-bold font-mono">{agent.uptime}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Tasks</p>
                      <p className="text-sm font-bold font-mono">{agent.tasks}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Efficiency</p>
                      <p className="text-sm font-bold font-mono text-secondary">{agent.efficiency}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Last Active</p>
                      <p className="text-sm font-bold">{agent.lastActivity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-surface-container rounded-lg transition-colors"
                    >
                      <Settings className="w-5 h-5 text-on-surface-variant" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-surface-container rounded-lg transition-colors"
                    >
                      {agent.status === 'running' ? (
                        <Pause className="w-5 h-5 text-tertiary" />
                      ) : (
                        <Play className="w-5 h-5 text-secondary" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Start */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">Quick Start</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Deploy Template', icon: Play },
                  { label: 'Custom Agent', icon: Code },
                  { label: 'Import Config', icon: Database },
                  { label: 'View Docs', icon: Brain }
                ].map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <motion.button 
                      key={i}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-all group"
                    >
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="font-bold text-sm">{action.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Agent Capabilities */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
          >
            <h3 className="text-lg font-bold mb-6">Available Capabilities</h3>
            <div className="space-y-3">
              {[
                { name: 'Natural Language Processing', enabled: true },
                { name: 'Computer Vision', enabled: true },
                { name: 'Predictive Analytics', enabled: true },
                { name: 'Workflow Automation', enabled: true },
                { name: 'API Integration', enabled: true },
                { name: 'Real-time Monitoring', enabled: true }
              ].map((capability, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high">
                  <span className="text-sm">{capability.name}</span>
                  {capability.enabled && (
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
          >
            <h3 className="text-lg font-bold mb-6">System Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-on-surface-variant">API Quota</span>
                  <span className="font-bold font-mono">78%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    transition={{ duration: 1, delay: 1 }}
                    className="bg-primary h-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-on-surface-variant">Compute Resources</span>
                  <span className="font-bold font-mono">42%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '42%' }}
                    transition={{ duration: 1, delay: 1.1 }}
                    className="bg-secondary h-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-on-surface-variant">Storage Used</span>
                  <span className="font-bold font-mono">34%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '34%' }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="bg-tertiary h-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
