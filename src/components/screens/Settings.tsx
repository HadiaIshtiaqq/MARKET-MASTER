import React from 'react';
import { 
  BadgeCheck, 
  Settings as SettingsIcon, 
  Shield, 
  Plus, 
  RefreshCw, 
  MessageCircle, 
  Database,
  ChevronRight,
  ShieldCheck,
  Download,
  Save,
  LogOut,
  Info,
  Clock,
  Key,
  Users,
  Bot,
  Star as StarIcon
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Settings() {
  const [guardrailValue, setGuardrailValue] = React.useState(65);

  return (
    <div className="space-y-bento-gap max-w-6xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Enterprise Settings</h1>
          <p className="text-on-surface-variant font-medium">Global configuration and agentic environment controls.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-surface-container-high border border-outline-variant/30 text-on-surface-variant px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-surface-variant transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Logs
          </button>
          <button className="bg-primary text-on-primary px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-primary/20">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap">
        {/* Organization Profile */}
        <div className="md:col-span-8 glass-panel rounded-2xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
            <Shield className="w-64 h-64 text-primary" />
          </div>
          
          <div className="flex items-center gap-3 mb-8">
            <BadgeCheck className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Organization Profile</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-10 relative z-10">
            <div className="relative">
              <div className="h-32 w-32 rounded-3xl overflow-hidden border-2 border-primary/20 p-1 bg-surface-container-highest">
                <img 
                  className="h-full w-full object-cover rounded-2xl" 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=256&auto=format&fit=crop" 
                  alt="Admin Profile"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-black tracking-tighter flex items-center gap-1.5 shadow-xl border-4 border-surface group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-3 h-3" /> ACTIVE
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center sm:text-left">
              <div>
                <h4 className="text-2xl font-bold text-primary tracking-tight mb-2">MarketMaster Admin</h4>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  <span className="bg-secondary-container/20 text-secondary px-4 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-secondary/10">
                    <Star className="w-3 h-3" /> Enterprise Platinum
                  </span>
                  <span className="bg-surface-container-highest/50 border border-outline-variant/30 text-on-surface-variant px-4 py-1 rounded-xl text-[10px] font-mono font-bold tracking-widest">ID: MM-2024-99812</span>
                </div>
              </div>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed max-w-lg">
                Primary administrator account for global stock monitoring and automated sales deployment across EMEA and APAC regions. Last access from <span className="text-on-surface">Dubai Node-04</span>.
              </p>
            </div>
          </div>
        </div>

        {/* AI Guardrails */}
        <div className="md:col-span-4 glass-panel rounded-2xl p-8 flex flex-col justify-between border-primary/10 bg-primary/[0.02] hover:bg-primary/[0.04] transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Bot className="w-32 h-32 text-secondary" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary ai-pulse">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">AI Guardrails</h3>
              </div>
              <Info className="w-4 h-4 text-on-surface-variant cursor-help" />
            </div>
            <p className="text-xs font-medium text-on-surface-variant mb-10 leading-relaxed">Limit decision-making authority for autonomous agents.</p>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.1em] text-secondary">
              <span>Level: Semi-Autonomous</span>
              <span className="font-mono">{guardrailValue}%</span>
            </div>
            <div className="relative w-full h-1.5 bg-surface-container-highest/50 rounded-full group/slider">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                style={{ width: `${guardrailValue}%` }}
              ></div>
              <input 
                type="range" 
                min="0" max="100" 
                value={guardrailValue}
                onChange={(e) => setGuardrailValue(Number(e.target.value))}
                className="absolute inset-x-0 -top-2 h-6 opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 h-6 w-6 bg-on-background rounded-full border-4 border-surface shadow-2xl transition-transform group-hover/slider:scale-125"
                style={{ left: `calc(${guardrailValue}% - 12px)` }}
              ></div>
            </div>
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
              <span className="text-left w-24">Collaborative Mode</span>
              <span className="text-right w-24">Agent Autonomy</span>
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="md:col-span-12 lg:col-span-7 glass-panel rounded-2xl p-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold tracking-tight">Integration Modules</h3>
            </div>
            <button className="text-primary text-[10px] font-bold uppercase tracking-widest hover:brightness-125 transition-all flex items-center gap-1">
              <Plus className="w-3 h-3" /> Connect Source
            </button>
          </div>

          <div className="space-y-4">
            {[
              { name: 'SAP ERP Sync', status: 'Connected', time: '2m ago', icon: Database, color: 'primary' },
              { name: 'WhatsApp Meta API', status: 'Active', time: 'Stable Connection', icon: MessageCircle, color: 'secondary' },
              { name: 'EDI Global Gateway', status: 'Active', time: 'Processing v2.1', icon: Share2, color: 'primary' }
            ].map((integ, i) => {
              const Icon = integ.icon;
              return (
                <div key={i} className="flex items-center justify-between p-5 bg-surface-container/50 rounded-2xl border border-outline-variant/20 hover:border-primary/20 transition-all group hover:bg-surface-container">
                  <div className="flex items-center gap-5">
                    <div className={`h-12 w-12 flex items-center justify-center bg-surface-container-high rounded-xl border border-outline-variant/30 group-hover:scale-105 transition-transform ${integ.color === 'primary' ? 'text-primary' : 'text-secondary'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">{integ.name}</p>
                      <p className="text-[10px] font-bold text-secondary flex items-center gap-1.5 uppercase tracking-widest mt-0.5">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full ai-pulse"></span>
                        {integ.status} • {integ.time}
                      </p>
                    </div>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface-container-highest cursor-pointer group-hover:bg-primary/20">
                    <span className="sr-only">Enable</span>
                    <span className="h-4 w-4 transform rounded-full bg-secondary-container transition duration-200 ease-in-out translate-x-6" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security Quick Links */}
        <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-bento-gap">
          <div className="glass-panel rounded-2xl p-8 flex-1">
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold tracking-tight">Security & Access</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Role-Based Permissions', icon: Users },
                { label: 'Cloud Key Management', icon: Key },
                { label: 'Compliance Audit Logs', icon: Clock }
              ].map((link, i) => {
                const Icon = link.icon;
                return (
                  <button key={i} className="w-full flex items-center justify-between p-5 bg-surface-container-high/30 hover:bg-surface-variant/50 transition-all rounded-2xl border border-outline-variant/30 group">
                    <div className="flex items-center gap-4">
                      <Icon className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                      <span className="text-sm font-bold tracking-tight">{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-outline group-hover:translate-x-1 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="bg-error/5 border border-error/20 rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:bg-error/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error border border-error/10 group-hover:rotate-12 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-on-surface tracking-tight">Enable 2FA Enforcement for all staff?</p>
            </div>
            <button className="text-error text-[10px] font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Enable Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Star = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
)

const Hub = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v3" />
    <path d="M12 18v3" />
    <path d="M3 12h3" />
    <path d="M18 12h3" />
    <path d="M18.36 5.64l-2.12 2.12" />
    <path d="M7.76 16.24l-2.12 2.12" />
    <path d="M18.36 18.36l-2.12-2.12" />
    <path d="M7.76 7.76l-2.12-2.12" />
  </svg>
)

const Share2 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)
