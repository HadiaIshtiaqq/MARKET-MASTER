import React from 'react';
import { 
  Bot, 
  Target, 
  Brain, 
  Zap, 
  ShieldCheck, 
  MessageCircle, 
  Database, 
  Rocket, 
  Truck, 
  Search,
  Sparkles,
  Terminal,
  Paperclip,
  Send,
  ChevronDown,
  LayoutGrid,
  Activity,
  LineChart,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AgentBuilder() {
  const [tone, setTone] = React.useState(50);
  const [skillSearch, setSkillSearch] = React.useState('');

  const skillModules = [
    { label: 'Inventory Intelligence', desc: 'Real-time stock monitoring', icon: LineChart, color: 'secondary' },
    { label: 'Market NL2SQL', desc: 'Direct DB query execution', icon: BarChart3, color: 'primary' },
    { label: 'WhatsApp Orchestrator', desc: 'Campaign messaging', icon: MessageCircle, color: 'tertiary' },
    { label: 'Logistics Protocol', desc: 'Route optimization API', icon: Truck, color: 'primary' }
  ];

  const filteredSkills = skillModules.filter(skill => 
    skill.label.toLowerCase().includes(skillSearch.toLowerCase()) ||
    skill.desc.toLowerCase().includes(skillSearch.toLowerCase())
  );
  
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-bento-gap pb-48">
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight mb-2">Define New Agent Persona</h1>
           <p className="text-on-surface-variant font-medium">Configure logic engines and behavioral boundaries for autonomous agents.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 scale-90">
           <Activity className="w-3 h-3 text-secondary ai-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Neural Link Ready</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-bento-gap">
        {/* Left Column: Persona Configuration */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-bento-gap">
          <section className="glass-panel rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
              <Bot className="w-64 h-64 text-primary" />
            </div>
            
            <div className="flex items-center gap-3 mb-10 relative z-10">
              <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Core Identity</h2>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant ml-1">Agent Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Logistics Optimizer" 
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-5 py-4 text-sm font-medium focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all placeholder:text-on-surface-variant/30"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant ml-1">Logic Engine</label>
                  <div className="relative group">
                    <select className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-5 py-4 text-sm font-medium focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all appearance-none cursor-pointer">
                      <option>Gemini 2.5 Pro (Recommended)</option>
                      <option>Gemini 2.5 Flash (Ultra-Fast)</option>
                      <option>GPT-4o (Legacy Support)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant ml-1">Behavioral Directive & Boundary</label>
                <textarea 
                  rows={4}
                  placeholder="Define the agent's specific duties, boundaries, and organizational context..."
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl px-6 py-5 text-sm font-medium focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all resize-none shadow-inner placeholder:text-on-surface-variant/30"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Nuance Section */}
          <section className="glass-panel rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-2.5 bg-secondary/10 rounded-xl border border-secondary/20">
                <Brain className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Cognitive Nuance</h2>
            </div>
            
            <div className="space-y-12 py-4">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant">Persona Personality</label>
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-secondary/20 shadow-sm">
                    {tone < 50 ? 'STRICTLY ANALYTICAL' : tone === 50 ? 'BALANCED' : 'CONVERSATIONAL'}
                  </span>
                </div>
                <div className="relative h-2 bg-surface-container-highest/50 rounded-full group/slider">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-secondary to-tertiary rounded-full shadow-[0_0_15px_rgba(78,222,163,0.3)]"
                    style={{ width: `${tone}%` }}
                  ></div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={tone}
                    onChange={(e) => setTone(Number(e.target.value))}
                    className="absolute inset-x-0 -top-2 h-6 opacity-0 cursor-pointer z-10"
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 h-7 w-7 bg-on-background rounded-full border-[6px] border-surface shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform group-hover/slider:scale-125"
                    style={{ left: `calc(${tone}% - 14px)` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-4 text-[9px] font-black uppercase tracking-[0.15em] text-on-surface-variant">
                  <span>Logic Processor</span>
                  <span>Humanoid Empathy</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/20 flex items-center gap-4 group hover:border-primary/40 transition-all cursor-pointer">
                  <div className="p-3 bg-tertiary/10 rounded-xl text-tertiary group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface mb-0.5">Response Latency</p>
                    <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">Fixed: &lt;200ms</p>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/20 flex items-center gap-4 group hover:border-secondary/40 transition-all cursor-pointer">
                  <div className="p-3 bg-secondary/10 rounded-xl text-secondary group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface mb-0.5">Entity Guardrails</p>
                    <p className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">Compliant Tier-04</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Skill Modules */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-bento-gap">
          <section className="glass-panel rounded-2xl p-8 flex-1 flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20">
                  <LayoutGrid className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Skill Modules</h2>
              </div>
              <span className="bg-surface-container-highest/80 text-on-surface-variant text-[10px] font-bold px-3 py-1.5 rounded-full border border-outline-variant/20 uppercase tracking-widest">{filteredSkills.length} Ready</span>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search skills..." 
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 text-xs focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-on-surface-variant/30"
              />
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill, i) => {
                  const Icon = skill.icon;
                  return (
                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-surface-container border border-outline-variant/10 hover:border-secondary/40 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl border border-outline-variant/20 group-hover:scale-105 transition-transform ${
                          skill.color === 'secondary' ? 'bg-secondary/10 text-secondary' : 
                          skill.color === 'primary' ? 'bg-primary/10 text-primary' : 
                          'bg-tertiary/10 text-tertiary'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">{skill.label}</p>
                          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest leading-none mt-1">{skill.desc}</p>
                        </div>
                      </div>
                      <div className="relative inline-flex h-5 w-10 items-center rounded-full bg-surface-container-highest p-1 group-hover:bg-secondary/10 transition-colors">
                        <div className={`h-3 w-3 rounded-full bg-secondary shadow-lg shadow-secondary/40 transition-transform ${skill.label.includes('Intelligence') || skill.label.includes('NL2SQL') ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant opacity-50">
                  <Search className="w-8 h-8 mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">No skills found</p>
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-outline-variant/20 relative z-10">
              <button className="w-full bg-primary hover:bg-primary-container text-on-primary font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_12px_24px_-8px_rgba(192,193,255,0.4)] active:scale-95 transition-all uppercase text-[11px] tracking-[0.25em]">
                <Rocket className="w-4 h-4" />
                Initialize & Deploy Agent
              </button>
              <p className="text-center text-[9px] text-on-surface-variant font-bold uppercase tracking-widest mt-6">Estimated Resource Cost: $42.50 / Month / Node</p>
            </div>
          </section>
        </div>
      </div>

      {/* Sandbox Overlay */}
      <div className="fixed bottom-0 left-64 right-0 h-44 bg-surface/60 backdrop-blur-3xl border-t border-outline-variant/30 z-50 p-6 flex flex-col gap-4 shadow-[0_-16px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-secondary ai-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Neural Testing Sandbox</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <Terminal className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Log Stream: Active</span>
            </div>
            <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Reset Neural Memory</button>
          </div>
        </div>

        <div className="flex-1 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/20 p-3 flex items-center gap-4 group focus-within:border-primary/50 transition-all shadow-inner">
           <div className="flex-1 px-6 text-on-surface-variant font-medium text-sm italic group-focus-within:text-on-surface transition-colors">
              Type a diagnostic prompt to evaluate the agent's logic stream...
           </div>
           <div className="flex items-center gap-2">
              <button className="p-3 text-on-surface-variant hover:text-on-surface transition-colors rounded-xl hover:bg-surface-variant/30">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="h-12 px-8 bg-primary text-on-primary rounded-xl flex items-center gap-3 font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
                <Send className="w-4 h-4" />
                Evaluate Payload
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
