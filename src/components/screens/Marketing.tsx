import React from 'react';
import { 
  MessageSquare, 
  Mail, 
  Send, 
  Users, 
  BellRing, 
  MoreHorizontal, 
  Sparkles, 
  Edit3, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Star,
  Clock,
  Rocket
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Marketing() {
  const channels = [
    { name: 'WhatsApp', icon: MessageSquare, status: 'active', color: 'secondary' },
    { name: 'Email', icon: Mail, status: 'active', color: 'primary' },
    { name: 'SMS', icon: MessageSquare, status: 'idle', color: 'outline' },
    { name: 'Push', icon: BellRing, status: 'active', color: 'primary' },
  ];

  const campaigns = [
    { title: 'Karachi Restock Alert', desc: 'Targeting electronics segment in Sindh.', progress: 88, icon: TrendingUp, color: 'secondary' },
    { title: 'Lahore VIP Discount', desc: 'High-value retention for Punjab hub.', progress: 42, icon: Sparkles, color: 'primary' },
    { title: 'National Leather Week', desc: 'Scheduled across all 12 zones.', progress: 0, icon: Clock, color: 'outline', status: 'Pending' }
  ];

  return (
    <div className="space-y-bento-gap max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Multi-Channel Marketing Manager</h1>
        <p className="text-on-surface-variant font-medium">Orchestrate agentic campaigns across Karachi, Lahore, and National segments.</p>
      </header>

      <div className="grid grid-cols-12 gap-bento-gap">
        {/* Delivery Channels */}
        <div className="col-span-12 lg:col-span-5 glass-panel p-6 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Delivery Channels
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Global Sync: Active</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {channels.map((channel, i) => {
              const Icon = channel.icon;
              return (
                <button 
                  key={i} 
                  className={`bg-surface-container p-4 rounded-xl flex items-center justify-between border border-outline-variant/30 hover:border-secondary/50 transition-all group ${channel.status === 'idle' ? 'opacity-50 grayscale' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${channel.color === 'secondary' ? 'text-secondary' : 'text-primary'}`} />
                    <div className="text-left">
                      <p className="text-xs font-bold tracking-tight">{channel.name}</p>
                      {channel.status === 'active' && (
                        <span className="text-[10px] text-secondary flex items-center gap-1 font-bold">
                          <span className="w-1.5 h-1.5 bg-secondary rounded-full ai-pulse"></span> Active
                        </span>
                      )}
                      {channel.status === 'idle' && (
                        <span className="text-[10px] text-on-surface-variant font-bold">Idle</span>
                      )}
                    </div>
                  </div>
                  {channel.status === 'active' && <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:translate-x-1 transition-transform" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Audience Segmenter */}
        <div className="col-span-12 lg:col-span-7 glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Audience Segmenter
            </h2>
            <div className="bg-secondary/10 px-3 py-1.5 rounded-lg text-secondary font-bold text-[10px] uppercase tracking-widest border border-secondary/20">
              8,421 Selected
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-3 items-end">
                <label className="text-xs font-bold text-on-surface uppercase tracking-widest">Churn Risk Score</label>
                <span className="text-sm font-mono text-secondary font-bold">High Risk (&gt;0.75)</span>
              </div>
              <div className="relative h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary w-[75%] rounded-full"></div>
                <div className="absolute left-[75%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-6 bg-on-surface rounded border-2 border-surface shadow-lg cursor-pointer"></div>
              </div>
              <div className="flex justify-between mt-2 text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">
                <span>0.0 (Stable)</span>
                <span>1.0 (Critical)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 relative overflow-hidden group">
                 <MapPin className="absolute -right-4 -bottom-4 w-16 h-16 text-primary/5 -rotate-12" />
                 <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">Primary Location</p>
                 <div className="flex items-center justify-between">
                   <span className="text-sm font-bold">Karachi</span>
                   <MapPin className="w-4 h-4 text-primary" />
                 </div>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 relative overflow-hidden group">
                 <Star className="absolute -right-4 -bottom-4 w-16 h-16 text-tertiary/5 -rotate-12" />
                 <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">Loyalty Tier</p>
                 <div className="flex items-center justify-between">
                   <span className="text-sm font-bold">VIP / Platinum</span>
                   <Star className="w-4 h-4 text-tertiary" />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign List */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Campaigns</h3>
            <MoreHorizontal className="w-4 h-4 text-on-surface-variant cursor-pointer hover:text-on-surface" />
          </div>

          {campaigns.map((camp, i) => {
            const Icon = camp.icon;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-surface-container p-5 rounded-2xl border-l-[6px] shadow-sm transition-all hover:bg-surface-container-high cursor-pointer ${
                  camp.color === 'secondary' ? 'border-secondary' : 
                  camp.color === 'primary' ? 'border-primary' : 
                  'border-outline opacity-70'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-on-surface tracking-tight">{camp.title}</h4>
                  <Icon className={`w-4 h-4 ${camp.color === 'secondary' ? 'text-secondary' : camp.color === 'primary' ? 'text-primary' : 'text-on-surface-variant'}`} />
                </div>
                <p className="text-[11px] text-on-surface-variant font-medium mb-4">{camp.desc}</p>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${camp.progress}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={`h-full ${camp.color === 'secondary' ? 'bg-secondary' : 'bg-primary'}`} 
                    />
                  </div>
                  <span className={`text-mono font-bold text-[10px] ${camp.color === 'outline' ? 'text-on-surface-variant' : camp.color === 'secondary' ? 'text-secondary' : 'text-primary'}`}>
                    {camp.status ? camp.status : `${camp.progress}%`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Template Editor */}
        <div className="col-span-12 lg:col-span-8 glass-panel p-8 rounded-2xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <Edit3 className="w-48 h-48 text-primary" />
          </div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <Edit3 className="w-6 h-6 text-secondary" /> Message Template Editor
            </h2>
            <button className="bg-surface-container-highest/50 text-primary px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-primary/20 hover:bg-primary/10 transition-all flex items-center gap-2 group">
              <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" /> AI Rewrite
            </button>
          </div>

          <div className="bg-surface-container-lowest/80 border border-outline-variant/30 rounded-2xl p-6 mb-8 relative z-10 shadow-inner">
            <div className="flex items-center gap-2 mb-6 border-b border-outline-variant/20 pb-4">
              <MessageSquare className="w-4 h-4 text-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Previewing: WhatsApp / Outreach Format</span>
            </div>
            <div className="font-sans text-base leading-relaxed text-on-surface font-medium min-h-[140px]">
              Hi <span className="text-secondary bg-secondary/10 px-1.5 py-0.5 rounded-lg border border-secondary/20 shadow-sm">{"{name}"}</span>, our warehouse just received new <span className="text-secondary bg-secondary/10 px-1.5 py-0.5 rounded-lg border border-secondary/20 shadow-sm">{"{category}"}</span> stock! Since you're one of our top customers in Karachi, we've reserved a special discount code for you: <span className="text-primary font-bold decoration-primary/40 underline underline-offset-4 decoration-2">STK24-VIP</span>. Click here to browse the fresh arrivals: [Link]
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Dynamic Personalization Tags</p>
            <div className="flex flex-wrap gap-2">
              {['name', 'category', 'location', 'order_total', 'last_purchase'].map(tag => (
                <button key={tag} className="bg-surface-container-high border border-outline-variant/30 px-4 py-1.5 rounded-full text-[11px] font-bold text-on-surface-variant hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all">
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <footer className="fixed bottom-0 left-64 right-0 h-24 bg-surface/80 backdrop-blur-3xl border-t border-outline-variant/30 z-40 px-12 flex items-center justify-between shadow-[0_-16px_32px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Rocket className="w-4 h-4 text-secondary" />
            <span className="text-xs font-bold text-on-surface tracking-tight uppercase">Campaign Configuration: <span className="text-secondary">Ready</span></span>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">Projected aggregate reach: <span className="text-on-surface">142,000 users</span></p>
        </div>
        
        <div className="flex gap-4">
          <button className="px-8 py-4 rounded-2xl border border-outline-variant text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant hover:bg-surface-container transition-all active:scale-95">
            Save Draft
          </button>
          <button className="px-10 py-4 rounded-2xl bg-secondary-container text-on-secondary-container font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-secondary/20">
            <Rocket className="w-4 h-4" />
            Launch Multi-Channel Campaign
          </button>
        </div>
      </footer>
    </div>
  );
}
