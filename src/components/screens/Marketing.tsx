import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  TrendingUp, 
  Users, 
  Mail, 
  MessageSquare,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Send,
  Eye,
  MousePointerClick,
  DollarSign,
  Calendar,
  Target,
  Sparkles,
  Play,
  Pause,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Marketing() {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);

  const metrics = [
    { label: 'Total Reach', value: '2.4M', change: '+18.2%', trend: 'up', icon: Users, color: 'primary' },
    { label: 'Engagement Rate', value: '8.7%', change: '+2.3%', trend: 'up', icon: Activity, color: 'secondary' },
    { label: 'Conversion Rate', value: '4.2%', change: '+0.8%', trend: 'up', icon: Target, color: 'tertiary' },
    { label: 'Campaign ROI', value: '342%', change: '+12%', trend: 'up', icon: DollarSign, color: 'primary' },
  ];

  const campaigns = [
    {
      id: 1,
      name: 'Summer Sale Blast',
      status: 'active',
      platform: ['email', 'social'],
      reach: '450K',
      engagement: '12.4%',
      conversions: 1847,
      budget: '$5,200',
      spent: '$3,840',
      progress: 74,
      startDate: '2026-05-10',
      endDate: '2026-05-25'
    },
    {
      id: 2,
      name: 'Product Launch Campaign',
      status: 'active',
      platform: ['social', 'ads'],
      reach: '890K',
      engagement: '15.8%',
      conversions: 3241,
      budget: '$12,000',
      spent: '$8,400',
      progress: 70,
      startDate: '2026-05-01',
      endDate: '2026-05-31'
    },
    {
      id: 3,
      name: 'Customer Retention',
      status: 'scheduled',
      platform: ['email'],
      reach: '120K',
      engagement: '0%',
      conversions: 0,
      budget: '$2,500',
      spent: '$0',
      progress: 0,
      startDate: '2026-05-20',
      endDate: '2026-06-05'
    },
    {
      id: 4,
      name: 'Brand Awareness',
      status: 'completed',
      platform: ['social', 'ads', 'email'],
      reach: '1.2M',
      engagement: '9.2%',
      conversions: 4521,
      budget: '$8,500',
      spent: '$8,500',
      progress: 100,
      startDate: '2026-04-15',
      endDate: '2026-05-10'
    }
  ];

  const performanceData = [
    { date: 'May 1', impressions: 45000, clicks: 3200, conversions: 280 },
    { date: 'May 5', impressions: 52000, clicks: 3800, conversions: 340 },
    { date: 'May 10', impressions: 68000, clicks: 4500, conversions: 420 },
    { date: 'May 15', impressions: 78000, clicks: 5200, conversions: 510 },
    { date: 'May 17', impressions: 85000, clicks: 5800, conversions: 580 }
  ];

  const socialPlatforms = [
    { name: 'Instagram', followers: '245K', engagement: '12.4%', posts: 156, icon: Instagram, color: '#E4405F' },
    { name: 'Facebook', followers: '189K', engagement: '8.7%', posts: 203, icon: Facebook, color: '#1877F2' },
    { name: 'Twitter', followers: '98K', engagement: '6.2%', posts: 412, icon: Twitter, color: '#1DA1F2' },
    { name: 'LinkedIn', followers: '67K', engagement: '15.3%', posts: 89, icon: Linkedin, color: '#0A66C2' }
  ];

  const aiInsights = [
    { 
      type: 'success',
      title: 'Optimal Posting Time Detected',
      description: 'Best engagement occurs at 2-4 PM on weekdays',
      action: 'Schedule posts automatically'
    },
    {
      type: 'warning',
      title: 'Budget Alert',
      description: 'Summer Sale campaign at 74% budget utilization',
      action: 'Review spending'
    },
    {
      type: 'info',
      title: 'Content Recommendation',
      description: 'Video content shows 3x higher engagement',
      action: 'Create video campaign'
    }
  ];

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'email': return Mail;
      case 'social': return MessageSquare;
      case 'ads': return Target;
      default: return Megaphone;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-secondary bg-secondary/10';
      case 'scheduled': return 'text-tertiary bg-tertiary/10';
      case 'completed': return 'text-primary bg-primary/10';
      default: return 'text-on-surface-variant bg-surface-container';
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
            Marketing Command Center
          </h1>
          <p className="text-on-surface-variant flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
            AI-powered campaign orchestration and analytics
          </p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreatingCampaign(true)}
          className="bg-gradient-to-r from-primary to-secondary text-on-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Campaign
        </motion.button>
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
                    <TrendingUp className="w-4 h-4" />
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

      {/* Performance Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Campaign Performance</h2>
            <p className="text-xs text-on-surface-variant">Multi-channel analytics overview</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs">Impressions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-xs">Clicks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-tertiary" />
              <span className="text-xs">Conversions</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c0c1ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#c0c1ff" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4edea3" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4edea3" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffb95f" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ffb95f" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#464554" opacity={0.3} />
            <XAxis dataKey="date" stroke="#c7c4d7" fontSize={12} />
            <YAxis stroke="#c7c4d7" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#171f33', 
                border: '1px solid #464554',
                borderRadius: '8px',
                color: '#dae2fd'
              }} 
            />
            <Area type="monotone" dataKey="impressions" stroke="#c0c1ff" strokeWidth={2} fillOpacity={1} fill="url(#colorImpressions)" />
            <Area type="monotone" dataKey="clicks" stroke="#4edea3" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
            <Area type="monotone" dataKey="conversions" stroke="#ffb95f" strokeWidth={2} fillOpacity={1} fill="url(#colorConversions)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Active Campaigns */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Active Campaigns</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold text-secondary bg-secondary/10 px-4 py-2 rounded-full">
                {campaigns.filter(c => c.status === 'active').length} Running
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign, i) => (
              <motion.div 
                key={campaign.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="bg-surface-container-high/50 p-6 rounded-2xl border border-outline-variant/20 hover:border-secondary/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{campaign.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {campaign.startDate} - {campaign.endDate}
                      </div>
                      <div className="flex items-center gap-2">
                        {campaign.platform.map((p, idx) => {
                          const Icon = getPlatformIcon(p);
                          return <Icon key={idx} className="w-4 h-4" />;
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
                      className="p-2 hover:bg-surface-container rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-on-surface-variant" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Reach</p>
                    <p className="text-lg font-bold font-mono">{campaign.reach}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Engagement</p>
                    <p className="text-lg font-bold font-mono text-secondary">{campaign.engagement}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Conversions</p>
                    <p className="text-lg font-bold font-mono text-tertiary">{campaign.conversions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Budget</p>
                    <p className="text-lg font-bold font-mono">{campaign.spent} / {campaign.budget}</p>
                  </div>
                </div>

                {campaign.status === 'active' && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-on-surface-variant">Campaign Progress</span>
                      <span className="font-bold font-mono">{campaign.progress}%</span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${campaign.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="bg-gradient-to-r from-secondary to-primary h-full rounded-full"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Social Platforms */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
          >
            <h3 className="text-lg font-bold mb-6">Social Platforms</h3>
            <div className="space-y-4">
              {socialPlatforms.map((platform, i) => {
                const Icon = platform.icon;
                return (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-colors group"
                  >
                    <div 
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${platform.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: platform.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm mb-1">{platform.name}</p>
                      <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                        <span>{platform.followers} followers</span>
                        <span>•</span>
                        <span className="text-secondary">{platform.engagement}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-on-surface-variant">Posts</p>
                      <p className="font-bold font-mono">{platform.posts}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
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
                    transition={{ delay: 0.8 + i * 0.1 }}
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
                      className="w-full py-2 px-3 bg-surface-container-highest rounded-lg text-xs font-bold hover:bg-primary hover:text-on-primary transition-all"
                    >
                      {insight.action}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
          >
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Schedule Post', icon: Calendar },
                { label: 'Generate Content', icon: Sparkles },
                { label: 'View Analytics', icon: BarChart3 },
                { label: 'Manage Audience', icon: Users }
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <motion.button 
                    key={i}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-all group"
                  >
                    <Icon className="w-5 h-5 text-secondary" />
                    <span className="font-bold text-sm">{action.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
