import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  Bot, 
  Settings, 
  Bell, 
  Search,
  Menu,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'sales', label: 'Sales Ops', icon: TrendingUp },
    { id: 'marketing', label: 'Marketing', icon: Sparkles },
    { id: 'agent-builder', label: 'AI Agents', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface flex text-on-surface">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-surface-container-low border-r border-outline-variant/20 transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          {isSidebarOpen && (
            <div>
              <h2 className="font-bold text-primary tracking-tight">MarketMaster</h2>
              <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">Intelligence Active</p>
            </div>
          )}
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as View)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                    : 'text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isActive ? 'text-primary' : ''}`} />
                {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-outline-variant/10">
          <button className="w-full flex items-center gap-3 text-error hover:bg-error/10 p-2 rounded-lg transition-colors group">
            <LogOut className="w-5 h-5 group-active:scale-95 transition-transform" />
            {isSidebarOpen && <span className="font-bold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top App Bar */}
        <header className="h-16 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-surface-variant rounded-lg">
              <Menu className="w-5 h-5 text-on-surface-variant" />
            </button>
            <h1 className="font-bold text-lg hidden sm:block">MarketMaster AI</h1>
          </div>

          <div className="flex-1 max-w-2xl px-12 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Ask MarketMaster AI..." 
                className="w-full h-10 bg-surface-container-high border border-outline-variant/30 rounded-full pl-10 pr-12 text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
                <span className="text-[10px] border border-outline-variant px-1.5 rounded">⌘</span>
                <span className="text-[10px] border border-outline-variant px-1.5 rounded">K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:bg-surface-variant transition-colors rounded-full relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">Admin Account</p>
                <p className="text-[10px] text-on-surface-variant">v2.4.0 • Pro Tier</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-xs">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Canvas Area */}
        <div className="p-8 pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}
