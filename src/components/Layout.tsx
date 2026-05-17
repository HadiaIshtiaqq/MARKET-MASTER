import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [aiStatus, setAiStatus] = useState<'active' | 'idle' | 'processing'>('active');

  useEffect(() => {
    // Simulate AI status changes
    const interval = setInterval(() => {
      const statuses: Array<'active' | 'idle' | 'processing'> = ['active', 'processing'];
      setAiStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`fixed left-0 top-0 h-full bg-surface-container-low border-r border-outline-variant/20 transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="p-6 flex items-center gap-3">
          <motion.div
            className="p-2 bg-primary/10 rounded-lg relative"
            animate={{
              boxShadow: aiStatus === 'active' ? '0 0 20px rgba(192, 193, 255, 0.3)' : '0 0 0px rgba(192, 193, 255, 0)'
            }}
            transition={{ duration: 0.5 }}
          >
            <Bot className="w-6 h-6 text-primary" />
            {aiStatus === 'active' && (
              <motion.span
                className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
          </motion.div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <h2 className="font-bold text-primary tracking-tight">MarketMaster</h2>
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-secondary" />
                  <p className="text-[10px] text-secondary uppercase tracking-widest font-bold">
                    {aiStatus === 'active' ? 'Intelligence Active' : 'Processing...'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onViewChange(item.id as View)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium text-sm"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-outline-variant/10">
          <button className="w-full flex items-center gap-3 text-on-surface-variant hover:text-error hover:bg-error/10 p-2 rounded-lg transition-colors group">
            <LogOut className="w-5 h-5 group-active:scale-95 transition-transform" />
            {isSidebarOpen && <span className="font-bold text-sm">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top App Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="h-16 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 flex items-center justify-between px-8 sticky top-0 z-40"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-surface-container-high rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-on-surface-variant" />
            </motion.button>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <h1 className="font-bold text-lg hidden sm:block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MarketMaster AI
              </h1>
            </div>
          </div>

          <div className="flex-1 max-w-2xl px-12 hidden md:block">
            <motion.div
              className="relative group"
              whileFocus={{ scale: 1.02 }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Ask MarketMaster AI anything..."
                className="w-full h-10 bg-surface-container-high border border-outline-variant/30 rounded-full pl-10 pr-12 text-sm focus:outline-none focus:border-primary/50 focus:bg-surface-container-highest transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
                <span className="text-[10px] border border-outline-variant px-1.5 rounded">⌘</span>
                <span className="text-[10px] border border-outline-variant px-1.5 rounded">K</span>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-full relative"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-4 h-4 bg-error rounded-full border-2 border-surface flex items-center justify-center text-[8px] font-bold"
                >
                  {notifications}
                </motion.span>
              )}
            </motion.button>
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/30">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold">Admin Account</p>
                <p className="text-[10px] text-on-surface-variant flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span>
                  v2.4.0 • Pro Tier
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary font-bold text-xs cursor-pointer"
              >
                AD
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Canvas Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8 pb-16"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
