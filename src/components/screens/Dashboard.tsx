import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Zap,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Pause,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [realtimeData, setRealtimeData] = useState({
    revenue: 142891,
    savings: 12440,
    efficiency: 99.8,
    activeAgents: 3,
    tasksCompleted: 1247,
    avgResponseTime: 0.3
  });

  const [activityData, setActivityData] = useState([
    { time: '00:00', value: 45 },
    { time: '04:00', value: 32 },
    { time: '08:00', value: 78 },
    { time: '12:00', value: 95 },
    { time: '16:00', value: 112 },
    { time: '20:00', value: 88 },
    { time: '23:59', value: 67 }
  ]);

  const [agentPerformance, setAgentPerformance] = useState([
    { name: 'IBM Bob', tasks: 456, efficiency: 98.5, status: 'active' },
    { name: 'Sales Scout', tasks: 423, efficiency: 97.2, status: 'active' },
    { name: 'Stock Sentinel', tasks: 368, efficiency: 99.1, status: 'idle' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        ...prev,
        revenue: prev.revenue + Math.floor(Math.random() * 100),
        tasksCompleted: prev.tasksCompleted + Math.floor(Math.random() * 3),
        avgResponseTime: +(prev.avgResponseTime + (Math.random() - 0.5) * 0.1).toFixed(2)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { 
      label: 'Total Revenue', 
      value: `$${realtimeData.revenue.toLocaleString()}`, 
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign, 
      color: 'primary',
      bgColor: 'bg-primary/10'
    },
    { 
      label: 'Cost Savings', 
      value: `$${realtimeData.savings.toLocaleString()}`, 
      change: '+8.3%',
      trend: 'up',
      icon: TrendingUp, 
      color: 'secondary',
      bgColor: 'bg-secondary/10'
    },
    { 
      label: 'System Efficiency', 
      value: `${realtimeData.efficiency}%`, 
      change: '+0.2%',
      trend: 'up',
      icon: Bolt, 
      color: 'tertiary',
      bgColor: 'bg-tertiary/10'
    },
    { 
      label: 'Active Agents', 
      value: realtimeData.activeAgents.toString(), 
      change: 'All systems operational',
      trend: 'neutral',
      icon: Bot, 
      color: 'primary',
      bgColor: 'bg-primary/10'
    },
  ];

  const agents = [
    {
      name: 'IBM Bob',
      role: 'Logistics Optimizer & Supply Chain Lead',
      uptime: '14d 2h 11m',
      task: 'Re-routing Port K-12',
      status: 'active',
      icon: Truck,
      color: 'primary',
      progress: 78,
      tasksToday: 156
    },
    {
      name: 'Sales Scout',
      role: 'Outbound Lead Generation & Qualification',
      uptime: '8d 14h 05m',
      task: 'Drafting 42 Campaigns',
      status: 'active',
      icon: Megaphone,
      color: 'secondary',
      progress: 92,
      tasksToday: 203
    },
    {
      name: 'Stock Sentinel',
      role: 'Inventory Anomaly Detection',
      uptime: 'Idle (Standby)',
      task: '4h ago (Last Trigger)',
      status: 'idle',
      icon: BarChart3,
      color: 'outline',
      progress: 0,
      tasksToday: 0
    }
  ];

  const recentActivities = [
    { id: 1, agent: 'IBM Bob', action: 'Optimized shipping route', time: '2 min ago', status: 'success' },
    { id: 2, agent: 'Sales Scout', action: 'Generated 15 new leads', time: '5 min ago', status: 'success' },
    { id: 3, agent: 'IBM Bob', action: 'Detected inventory shortage', time: '12 min ago', status: 'warning' },
    { id: 4, agent: 'Sales Scout', action: 'Sent campaign to 500 contacts', time: '18 min ago', status: 'success' },
    { id: 5, agent: 'Stock Sentinel', action: 'Completed stock audit', time: '4h ago', status: 'success' }
  ];

  const taskDistribution = [
    { name: 'Logistics', value: 456, color: '#c0c1ff' },
    { name: 'Marketing', value: 423, color: '#4edea3' },
    { name: 'Inventory', value: 368, color: '#ffb95f' }
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
            AI Command Center
          </h1>
          <p className="text-on-surface-variant flex items-center gap-2">
            <Activity className="w-4 h-4 text-secondary animate-pulse" />
            Orchestrating autonomous agents for global market operations
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="agent-sparkle-border rounded-xl group transition-all"
        >
          <div className="agent-sparkle-inner px-6 py-3 rounded-xl flex items-center gap-2 group-hover:bg-primary/5 transition-colors">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-widest font-bold text-primary">Optimize Swarm</span>
          </div>
        </motion.button>
      </motion.div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 hover:border-primary/40 transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${m.bgColor}`}>
                    <Icon className={`w-6 h-6 text-${m.color}`} />
                  </div>
                  {m.trend !== 'neutral' && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${m.trend === 'up' ? 'text-secondary' : 'text-error'}`}>
                      {m.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {m.change}
                    </div>
                  )}
                </div>
                <p className="text-on-surface-variant text-xs uppercase tracking-wider font-bold mb-2">{m.label}</p>
                <h3 className="text-3xl font-bold font-mono">{m.value}</h3>
                {m.trend === 'neutral' && (
                  <p className="text-xs text-on-surface-variant mt-2">{m.change}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Agent Activity</h2>
              <p className="text-xs text-on-surface-variant">Real-time task execution metrics</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant">Last 24h</span>
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c0c1ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#c0c1ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#464554" opacity={0.3} />
              <XAxis dataKey="time" stroke="#c7c4d7" fontSize={12} />
              <YAxis stroke="#c7c4d7" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#171f33', 
                  border: '1px solid #464554',
                  borderRadius: '8px',
                  color: '#dae2fd'
                }} 
              />
              <Area type="monotone" dataKey="value" stroke="#c0c1ff" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Task Distribution */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
        >
          <h2 className="text-xl font-bold mb-6">Task Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={taskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {taskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#171f33', 
                  border: '1px solid #464554',
                  borderRadius: '8px',
                  color: '#dae2fd'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 mt-4">
            {taskDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-bold font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Active Agents */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Active Agents</h2>
            <span className="text-xs uppercase tracking-widest font-bold text-secondary bg-secondary/10 px-4 py-2 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full ai-pulse"></span>
              {realtimeData.activeAgents} Live Instances
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
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-surface-container-high/50 p-6 rounded-2xl border border-outline-variant/20 hover:border-primary/40 transition-all group ${agent.status === 'idle' ? 'opacity-70' : ''}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`w-14 h-14 rounded-xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 transition-colors ${
                          agent.color === 'primary' ? 'text-primary group-hover:bg-primary/10 group-hover:border-primary/30' : 
                          agent.color === 'secondary' ? 'text-secondary group-hover:bg-secondary/10 group-hover:border-secondary/30' : 
                          'text-outline'
                        }`}
                      >
                        <Icon className="w-8 h-8" />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{agent.name}</h4>
                          {agent.status === 'active' && (
                            <span className="px-2 py-0.5 bg-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-wider rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-on-surface-variant text-sm mb-3">{agent.role}</p>
                        {agent.status === 'active' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-on-surface-variant">Progress</span>
                              <span className="font-bold font-mono">{agent.progress}%</span>
                            </div>
                            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${agent.progress}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 lg:gap-8">
                      <div className="text-left lg:text-right">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Uptime</p>
                        <p className="font-mono text-sm font-bold">{agent.uptime}</p>
                      </div>
                      <div className="text-left lg:text-right">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Current Task</p>
                        <p className={`text-sm font-bold ${agent.status === 'active' ? 'text-primary' : 'text-on-surface-variant'}`}>{agent.task}</p>
                      </div>
                      <div className="text-left lg:text-right">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Tasks Today</p>
                        <p className="text-sm font-bold font-mono">{agent.tasksToday}</p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-surface-container rounded-xl hover:bg-surface-container-highest transition-colors text-on-surface-variant hover:text-on-surface"
                      >
                        {agent.status === 'idle' ? <Play className="w-5 h-5 text-primary" /> : <Sliders className="w-5 h-5" />}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Recent Activity</h3>
              <Clock className="w-4 h-4 text-on-surface-variant" />
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              {recentActivities.map((activity, i) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-high transition-colors"
                >
                  <div className={`p-1.5 rounded-lg ${
                    activity.status === 'success' ? 'bg-secondary/20' :
                    activity.status === 'warning' ? 'bg-tertiary/20' : 'bg-error/20'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    ) : activity.status === 'warning' ? (
                      <AlertCircle className="w-4 h-4 text-tertiary" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-error" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-primary">{activity.agent}</span>
                      <span className="text-xs text-on-surface-variant">•</span>
                      <span className="text-xs text-on-surface-variant">{activity.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Deploy Agent', icon: Bot, color: 'primary' },
                { label: 'View Analytics', icon: BarChart3, color: 'secondary' },
                { label: 'System Settings', icon: Settings, color: 'tertiary' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.button 
                    key={i}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-container-high border border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container-highest transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.color === 'primary' ? 'bg-primary/10 text-primary' :
                        item.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                        'bg-tertiary/10 text-tertiary'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* System Health */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">System Health</h3>
              <Verified className="w-5 h-5 text-secondary" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-on-surface-variant">CPU Load</span>
                  <span className="font-bold font-mono">42%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '42%' }}
                    transition={{ duration: 1, delay: 1 }}
                    className="bg-primary h-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-on-surface-variant">Memory</span>
                  <span className="font-bold font-mono">12.4GB / 32GB</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '38.75%' }}
                    transition={{ duration: 1, delay: 1.1 }}
                    className="bg-secondary h-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-on-surface-variant">Network</span>
                  <span className="font-bold font-mono">156 Mbps</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
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
