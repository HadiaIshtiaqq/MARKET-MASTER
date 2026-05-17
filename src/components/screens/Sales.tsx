import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Target,
  Award,
  Sparkles,
  Calendar,
  Filter,
  Download,
  Plus,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Trash2,
  Send,
  Star,
  TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

export default function Sales() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [realtimeRevenue, setRealtimeRevenue] = useState(847250);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeRevenue(prev => prev + Math.floor(Math.random() * 500));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: 'Total Revenue', value: `$${(realtimeRevenue / 1000).toFixed(1)}K`, change: '+18.2%', trend: 'up', icon: DollarSign, color: 'primary' },
    { label: 'Active Deals', value: '156', change: '+12', trend: 'up', icon: ShoppingCart, color: 'secondary' },
    { label: 'Conversion Rate', value: '24.8%', change: '+3.2%', trend: 'up', icon: Target, color: 'tertiary' },
    { label: 'Avg Deal Size', value: '$5.4K', change: '+$420', trend: 'up', icon: Award, color: 'primary' },
  ];

  const salesData = [
    { month: 'Jan', revenue: 65000, deals: 45, target: 70000 },
    { month: 'Feb', revenue: 72000, deals: 52, target: 75000 },
    { month: 'Mar', revenue: 81000, deals: 58, target: 80000 },
    { month: 'Apr', revenue: 89000, deals: 64, target: 85000 },
    { month: 'May', revenue: 95000, deals: 71, target: 90000 }
  ];

  const topDeals = [
    {
      id: 1,
      company: 'TechCorp Industries',
      contact: 'Sarah Johnson',
      value: 45000,
      stage: 'negotiation',
      probability: 85,
      closeDate: '2026-05-25',
      products: ['Enterprise Plan', 'Premium Support'],
      lastActivity: '2 hours ago',
      status: 'hot'
    },
    {
      id: 2,
      company: 'Global Solutions Ltd',
      contact: 'Michael Chen',
      value: 32000,
      stage: 'proposal',
      probability: 70,
      closeDate: '2026-05-30',
      products: ['Professional Plan', 'Training Package'],
      lastActivity: '5 hours ago',
      status: 'warm'
    },
    {
      id: 3,
      company: 'Innovation Labs',
      contact: 'Emily Rodriguez',
      value: 28000,
      stage: 'qualification',
      probability: 50,
      closeDate: '2026-06-10',
      products: ['Starter Plan'],
      lastActivity: '1 day ago',
      status: 'cold'
    },
    {
      id: 4,
      company: 'Digital Dynamics',
      contact: 'James Wilson',
      value: 52000,
      stage: 'closing',
      probability: 95,
      closeDate: '2026-05-20',
      products: ['Enterprise Plan', 'Premium Support', 'Custom Integration'],
      lastActivity: '30 min ago',
      status: 'hot'
    }
  ];

  const salesTeam = [
    { name: 'Alex Thompson', deals: 23, revenue: 245000, conversion: 28, avatar: 'AT', performance: 'excellent' },
    { name: 'Maria Garcia', deals: 19, revenue: 198000, conversion: 25, avatar: 'MG', performance: 'good' },
    { name: 'David Kim', deals: 17, revenue: 176000, conversion: 22, avatar: 'DK', performance: 'good' },
    { name: 'Lisa Anderson', deals: 15, revenue: 158000, conversion: 20, avatar: 'LA', performance: 'average' }
  ];

  const pipelineStages = [
    { name: 'Prospecting', value: 45, color: '#c0c1ff' },
    { name: 'Qualification', value: 32, color: '#4edea3' },
    { name: 'Proposal', value: 28, color: '#ffb95f' },
    { name: 'Negotiation', value: 18, color: '#ff6b9d' },
    { name: 'Closing', value: 12, color: '#a78bfa' }
  ];

  const recentActivities = [
    { id: 1, type: 'deal_won', agent: 'Sales Scout', description: 'Closed deal with TechCorp', value: 45000, time: '10 min ago' },
    { id: 2, type: 'meeting', agent: 'Alex Thompson', description: 'Demo scheduled with Innovation Labs', value: null, time: '1 hour ago' },
    { id: 3, type: 'proposal', agent: 'Maria Garcia', description: 'Sent proposal to Global Solutions', value: 32000, time: '3 hours ago' },
    { id: 4, type: 'call', agent: 'David Kim', description: 'Follow-up call with Digital Dynamics', value: null, time: '5 hours ago' },
    { id: 5, type: 'deal_lost', agent: 'Lisa Anderson', description: 'Lost deal - budget constraints', value: 18000, time: '1 day ago' }
  ];

  const aiInsights = [
    {
      type: 'success',
      title: 'High Conversion Opportunity',
      description: 'Digital Dynamics deal has 95% close probability. Prioritize follow-up.',
      action: 'View Deal'
    },
    {
      type: 'warning',
      title: 'Deal at Risk',
      description: 'Innovation Labs - No activity in 24h. Engagement dropping.',
      action: 'Send Follow-up'
    },
    {
      type: 'info',
      title: 'Upsell Opportunity',
      description: 'TechCorp Industries shows interest in additional services.',
      action: 'Create Proposal'
    }
  ];

  const getStageColor = (stage: string) => {
    switch(stage) {
      case 'closing': return 'text-secondary bg-secondary/10';
      case 'negotiation': return 'text-primary bg-primary/10';
      case 'proposal': return 'text-tertiary bg-tertiary/10';
      case 'qualification': return 'text-on-surface-variant bg-surface-container';
      default: return 'text-on-surface-variant bg-surface-container';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'hot': return 'bg-error';
      case 'warm': return 'bg-tertiary';
      case 'cold': return 'bg-primary';
      default: return 'bg-on-surface-variant';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch(performance) {
      case 'excellent': return 'text-secondary';
      case 'good': return 'text-primary';
      case 'average': return 'text-tertiary';
      default: return 'text-on-surface-variant';
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-secondary via-primary to-tertiary bg-clip-text text-transparent">
            Sales Operations Hub
          </h1>
          <p className="text-on-surface-variant flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
            AI-powered deal tracking and revenue optimization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-surface-container-high border border-outline-variant/30 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-surface-container-highest transition-all"
          >
            <Download className="w-4 h-4" />
            Export Report
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-secondary to-primary text-on-primary px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-secondary/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Deal
          </motion.button>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 hover:border-secondary/40 transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${m.color}/10`}>
                    <Icon className={`w-6 h-6 text-${m.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-secondary">
                    <ArrowUpRight className="w-4 h-4" />
                    {m.change}
                  </div>
                </div>
                <p className="text-on-surface-variant text-xs uppercase tracking-wider font-bold mb-2">{m.label}</p>
                <h3 className="text-3xl font-bold font-mono">{m.value}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Revenue Performance</h2>
            <p className="text-xs text-on-surface-variant">Monthly revenue vs target</p>
          </div>
          <div className="flex items-center gap-2">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedPeriod === period
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4edea3" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4edea3" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c0c1ff" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#c0c1ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#464554" opacity={0.3} />
            <XAxis dataKey="month" stroke="#c7c4d7" fontSize={12} />
            <YAxis stroke="#c7c4d7" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#171f33', 
                border: '1px solid #464554',
                borderRadius: '8px',
                color: '#dae2fd'
              }} 
            />
            <Area type="monotone" dataKey="revenue" stroke="#4edea3" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            <Area type="monotone" dataKey="target" stroke="#c0c1ff" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorTarget)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Top Deals */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Active Deals Pipeline</h2>
            <span className="text-xs uppercase tracking-widest font-bold text-secondary bg-secondary/10 px-4 py-2 rounded-full">
              ${topDeals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()} Total Value
            </span>
          </div>

          <div className="space-y-4">
            {topDeals.map((deal, i) => (
              <motion.div 
                key={deal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="bg-surface-container-high/50 p-6 rounded-2xl border border-outline-variant/20 hover:border-secondary/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(deal.status)} animate-pulse`} />
                      <h3 className="text-lg font-bold">{deal.company}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStageColor(deal.stage)}`}>
                        {deal.stage}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {deal.contact}
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Close: {deal.closeDate}
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {deal.lastActivity}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {deal.products.map((product, idx) => (
                        <span key={idx} className="px-2 py-1 bg-surface-container rounded-lg text-[10px] font-bold">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
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
                      <Edit className="w-4 h-4 text-on-surface-variant" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-secondary/10 rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4 text-secondary" />
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Deal Value</p>
                    <p className="text-lg font-bold font-mono text-secondary">${deal.value.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Probability</p>
                    <p className="text-lg font-bold font-mono">{deal.probability}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Expected</p>
                    <p className="text-lg font-bold font-mono text-primary">${((deal.value * deal.probability) / 100).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-on-surface-variant">Deal Progress</span>
                    <span className="font-bold font-mono">{deal.probability}%</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${deal.probability}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-gradient-to-r from-secondary to-primary h-full rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pipeline Stages */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
          >
            <h3 className="text-lg font-bold mb-6">Pipeline Stages</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pipelineStages}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pipelineStages.map((entry, index) => (
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
              {pipelineStages.map((stage, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span className="text-sm">{stage.name}</span>
                  </div>
                  <span className="text-sm font-bold font-mono">{stage.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sales Team Performance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
          >
            <h3 className="text-lg font-bold mb-6">Top Performers</h3>
            <div className="space-y-4">
              {salesTeam.map((member, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary font-bold">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm mb-1">{member.name}</p>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                      <span>{member.deals} deals</span>
                      <span>•</span>
                      <span className="text-secondary">${(member.revenue / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, idx) => (
                        <Star 
                          key={idx} 
                          className={`w-3 h-3 ${idx < Math.floor(member.conversion / 6) ? 'fill-secondary text-secondary' : 'text-on-surface-variant'}`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-bold ${getPerformanceColor(member.performance)}`}>
                      {member.conversion}% conv.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/10 blur-3xl rounded-full"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h3 className="text-lg font-bold">AI Insights</h3>
              </div>
              <div className="space-y-4">
                {aiInsights.map((insight, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/20"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-1.5 rounded-lg ${
                        insight.type === 'success' ? 'bg-secondary/20' :
                        insight.type === 'warning' ? 'bg-tertiary/20' : 'bg-primary/20'
                      }`}>
                        {insight.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-secondary" />
                        ) : insight.type === 'warning' ? (
                          <AlertCircle className="w-4 h-4 text-tertiary" />
                        ) : (
                          <Zap className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm mb-1">{insight.title}</p>
                        <p className="text-xs text-on-surface-variant">{insight.description}</p>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 px-3 bg-surface-container-highest rounded-lg text-xs font-bold hover:bg-secondary hover:text-on-secondary transition-all"
                    >
                      {insight.action}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Recent Activity</h3>
              <Activity className="w-4 h-4 text-on-surface-variant" />
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              {recentActivities.map((activity, i) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + i * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-high transition-colors"
                >
                  <div className={`p-1.5 rounded-lg ${
                    activity.type === 'deal_won' ? 'bg-secondary/20' :
                    activity.type === 'deal_lost' ? 'bg-error/20' :
                    activity.type === 'proposal' ? 'bg-primary/20' : 'bg-surface-container-highest'
                  }`}>
                    {activity.type === 'deal_won' ? (
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                    ) : activity.type === 'deal_lost' ? (
                      <XCircle className="w-4 h-4 text-error" />
                    ) : activity.type === 'proposal' ? (
                      <Send className="w-4 h-4 text-primary" />
                    ) : activity.type === 'meeting' ? (
                      <Calendar className="w-4 h-4 text-tertiary" />
                    ) : (
                      <Phone className="w-4 h-4 text-on-surface-variant" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-primary">{activity.agent}</span>
                      <span className="text-xs text-on-surface-variant">•</span>
                      <span className="text-xs text-on-surface-variant">{activity.time}</span>
                    </div>
                  </div>
                  {activity.value && (
                    <div className="text-right">
                      <p className="text-sm font-bold font-mono text-secondary">${(activity.value / 1000).toFixed(1)}K</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
