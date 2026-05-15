import React from 'react';
import { 
  TrendingUp, 
  Map as MapIcon, 
  BarChart2, 
  Users, 
  AlertCircle, 
  Zap, 
  X, 
  Rocket, 
  MoreVertical,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Sales() {
  const [showInsight, setShowInsight] = React.useState(true);

  return (
    <div className="space-y-bento-gap max-w-7xl mx-auto relative">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Sales Performance</h1>
          <p className="text-on-surface-variant">Real-time analytical overview of global operations and agent efficiency.</p>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-6 min-w-[320px]">
          <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Revenue</p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold font-mono tracking-tight">$4.2M</span>
              <div className="flex items-center text-secondary text-xs font-bold bg-secondary/10 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                12%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-bento-gap">
        {/* Heatmap */}
        <div className="col-span-12 lg:col-span-8 glass-panel rounded-2xl overflow-hidden min-h-[450px] relative group">
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container/30">
            <div className="flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface">Regional Activity Heatmap: Pakistan</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[10px] font-bold tracking-widest uppercase">Live Feed</span>
          </div>
          
          <div className="absolute inset-0 top-14 bg-surface-container-lowest/50">
             <img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-10 grayscale brightness-50"
              alt="Globe Data"
             />
             
             {/* Map Markers */}
             <div className="absolute top-1/2 left-1/3 animate-pulse">
                <div className="w-6 h-6 bg-secondary/30 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                </div>
                <div className="mt-3 bg-surface-container-highest/90 backdrop-blur-md p-3 rounded-xl border border-secondary/30 shadow-2xl">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Lahore Cluster</p>
                  <p className="text-sm font-mono font-bold">$890K Vol</p>
                </div>
             </div>

             <div className="absolute bottom-1/4 right-1/4 animate-pulse" style={{ animationDelay: '1s' }}>
                <div className="w-8 h-8 bg-primary/30 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-primary rounded-full"></div>
                </div>
                <div className="mt-3 bg-surface-container-highest/90 backdrop-blur-md p-3 rounded-xl border border-primary/30 shadow-2xl">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Karachi Direct</p>
                  <p className="text-sm font-mono font-bold">$1.2M Vol</p>
                </div>
             </div>
          </div>
        </div>

        {/* Efficiency Chart */}
        <div className="col-span-12 lg:col-span-4 glass-panel rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-tertiary" />
                <span className="text-xs font-bold uppercase tracking-widest">Agent vs Manual Staff</span>
              </div>
              <MoreVertical className="w-4 h-4 text-on-surface-variant cursor-pointer" />
            </div>

            <div className="space-y-12 py-4">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary ai-pulse"></span>
                    <span className="text-sm font-bold tracking-tight">Sales Scout (AI)</span>
                  </div>
                  <span className="font-mono text-secondary font-bold">$2.8M</span>
                </div>
                <div className="h-10 w-full bg-surface-container-highest rounded-2xl overflow-hidden p-1 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-secondary-container to-secondary rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary/50"></span>
                    <span className="text-sm font-bold tracking-tight">Manual Staff</span>
                  </div>
                  <span className="font-mono text-primary font-bold">$1.4M</span>
                </div>
                <div className="h-10 w-full bg-surface-container-highest rounded-2xl overflow-hidden p-1 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-primary-container to-primary rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant/20 italic text-xs text-on-surface-variant leading-relaxed">
            "AI agents currently handle <span className="text-secondary font-bold">66.7%</span> of total volume with <span className="text-primary font-bold">0%</span> fatigue variance across the Pakistani market segments."
          </div>
        </div>
      </div>

      {/* AI Insight Overlay */}
      <AnimatePresence>
        {showInsight && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-8 right-8 max-w-sm w-full z-50"
          >
            <div className="glass-panel rounded-3xl p-6 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
              
              <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-primary p-0.5 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=128&auto=format&fit=crop" 
                      alt="IBM Bob" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-4 border-surface shadow-md ai-pulse"></div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-base leading-tight">IBM Bob</h3>
                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/10">AI ANALYST</span>
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Enterprise Intelligence</p>
                </div>
                <button 
                  onClick={() => setShowInsight(false)}
                  className="ml-auto p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-variant/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm font-medium leading-relaxed mb-8 relative z-10">
                "Karachi leather bag demand is outpacing current stock by <span className="text-secondary font-bold text-lg">18%</span>. Recommend immediate <span className="text-primary underline decoration-primary/30 underline-offset-4">supply-side execution</span> to capture weekend velocity."
              </p>

              <div className="flex gap-3 relative z-10">
                <button className="flex-1 h-12 rounded-xl bg-primary text-on-primary font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20">
                  <Rocket className="w-4 h-4" />
                  Execute Now
                </button>
                <button 
                  onClick={() => setShowInsight(false)}
                  className="px-6 h-12 rounded-xl bg-surface-container-highest text-on-surface font-bold text-xs uppercase tracking-widest hover:bg-surface-variant transition-all border border-outline-variant/30"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
