import React from 'react';
import { 
  Bot, 
  Sparkles, 
  TrendingUp, 
  Bolt, 
  Sliders, 
  Play, 
  Truck, 
  Megaphone, 
  CreditCard,
  BarChart3,
  Activity,
  Verified,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const metrics = [
    { label: 'Total Actions Orchestrated', value: '142,891', icon: BarChart3, color: 'primary' },
    { label: 'Cost Savings vs. Manual', value: '$12,440.00', icon: TrendingUp, color: 'secondary' },
    { label: 'System Efficiency', value: '99.8%', icon: Bolt, color: 'tertiary' },
  ];

  const agents = [
    {
      name: 'IBM Bob',
      role: 'Logistics Optimizer & Supply Chain Lead',
      uptime: '14d 2h 11m',
      task: 'Re-routing Port K-12',
      status: 'active',
      icon: Truck,
      color: 'primary'
    },
    {
      name: 'Sales Scout',
      role: 'Outbound Lead Generation & Qualification',
      uptime: '8d 14h 05m',
      task: 'Drafting 42 Campaigns',
      status: 'active',
      icon: Megaphone,
      color: 'secondary'
    },
    {
      name: 'Stock Sentinel',
      role: 'Inventory Anomaly Detection',
      uptime: 'Idle (Standby)',
      task: '4h ago (Last Trigger)',
      status: 'idle',
      icon: BarChart3,
      color: 'outline'
    }
  ];

  return (
    <div className="space-y-bento-gap max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">AI Workforce</h1>
          <p className="text-on-surface-variant">Orchestrating autonomous agents for global market operations.</p>
        </div>
        <button className="agent-sparkle-border rounded-xl group transition-all transform hover:scale-105 active:scale-95">
          <div className="agent-sparkle-inner px-6 py-3 rounded-xl flex items-center gap-2 group-hover:bg-primary/5 transition-colors">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-widest font-bold text-primary">Optimize Swarm</span>
          </div>
        </button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-bento-gap">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-container p-6 rounded-xl border border-outline-variant/30 flex items-center justify-between"
            >
              <div>
                <p className="text-on-surface-variant text-[10px] uppercase tracking-wider font-bold mb-1">{m.label}</p>
                <h3 className={`text-2xl font-mono ${m.color === 'secondary' ? 'text-secondary' : 'text-on-surface'}`}>{m.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${
                m.color === 'primary' ? 'bg-primary/10 text-primary' : 
                m.color === 'secondary' ? 'bg-secondary/10 text-secondary' : 
                'bg-tertiary/10 text-tertiary'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-8 mt-8">
        {/* Active Agents */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Active Agents</h2>
            <span className="text-[10px] uppercase tracking-widest font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full ai-pulse"></span>
              3 Live Instances
            </span>
          </div>
          <div className="space-y-4">
            {agents.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`bg-surface-container-high/50 p-5 rounded-xl border border-outline-variant/20 hover:border-primary/40 transition-all group ${agent.status === 'idle' ? 'opacity-80' : ''}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 transition-colors ${
                        agent.color === 'primary' ? 'text-primary group-hover:bg-primary/10' : 
                        agent.color === 'secondary' ? 'text-secondary group-hover:bg-secondary/10' : 
                        'text-outline'
                      }`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{agent.name}</h4>
                        <p className="text-on-surface-variant text-xs">{agent.role}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 md:gap-12">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Uptime</p>
                        <p className="font-mono text-sm">{agent.uptime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Current Task</p>
                        <p className={`text-sm font-bold ${agent.status === 'active' ? 'text-primary' : 'text-on-surface-variant'}`}>{agent.task}</p>
                      </div>
                      <button className="p-2 bg-surface-container rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant hover:text-on-surface">
                        {agent.status === 'idle' ? <Play className="w-5 h-5 text-primary" /> : <Sliders className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Deploy Sidebar */}
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Deploy New Agent
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Logistics', desc: 'Fleet & Warehousing', icon: Truck, color: 'tertiary' },
                { label: 'Marketing', desc: 'Ad-Ops & Outreach', icon: Megaphone, color: 'secondary' },
                { label: 'Financials', desc: 'Reconciliation & Risk', icon: CreditCard, color: 'primary' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <button key={i} className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-container-high border border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container-highest transition-all group/btn">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        item.color === 'primary' ? 'bg-primary/10 text-primary' :
                        item.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                        'bg-tertiary/10 text-tertiary'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-sm tracking-tight">{item.label}</p>
                        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant/30">
                   <img 
                    src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=128&auto=format&fit=crop" 
                    alt="AI Builder" 
                    className="w-full h-full object-cover"
                   />
                </div>
                <div>
                  <p className="text-sm font-bold">Custom Agent Builder</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Define custom LLM personas</p>
                </div>
              </div>
              <button className="w-full py-3 bg-surface-container-highest border border-outline-variant/30 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all">
                Launch Studio
              </button>
            </div>
          </div>

          {/* Health Stats */}
          <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Workforce Health</h3>
              <Verified className="w-4 h-4 text-secondary" />
            </div>
            <div className="space-y-4">
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[85%]"></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                <span>CPU Load: 42%</span>
                <span>Memory: 12.4GB / 32GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
