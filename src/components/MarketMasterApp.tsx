import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, TrendingUp, Package, Users, AlertTriangle,
  CheckCircle2, Loader2, Send, Database, Zap, ArrowRight,
  ShoppingCart, MessageSquare, Activity,
  MapPin, Clock, DollarSign, Box, Truck, Eye, Sparkles,
  Bot, Brain, ChevronRight, Terminal, Cpu, RefreshCw, Play
} from 'lucide-react';
import {
  ibmBobNL2SQL, ibmBobAgenticTask, ibmBobCoordinate,
  getAgentFeed, getInventory, getAtRiskCustomers,
  AgentMessage, AgentStatus, InventoryProduct, VelocityProduct, DbCustomer,
} from '../lib/api';
import type { MarketMasterTab, WorkflowNode, CustomerProfile, PurchaseOrder } from '../types';

export default function MarketMasterApp() {
  const [currentTab, setCurrentTab] = useState<MarketMasterTab>('command-center');
  const [searchQuery, setSearchQuery] = useState('');
  const [nl2sqlResult, setNl2sqlResult] = useState<{ sql: string; explanation: string; confidence: number } | null>(null);
  const [nl2sqlLoading, setNl2sqlLoading] = useState(false);

  const [stockCount, setStockCount] = useState(0);

  // Real data from DB
  const [lowStock, setLowStock] = useState<InventoryProduct[]>([]);
  const [velocity, setVelocity] = useState<VelocityProduct[]>([]);
  const [dbCustomers, setDbCustomers] = useState<DbCustomer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [poState, setPOState] = useState<PurchaseOrder>({
    id: 'PO-2026-001', supplier: 'Premium Leather Goods Ltd.',
    item: 'Loading...', eoq: 150, unitMargin: 'PKR 1,275',
    expectedDelivery: 'June 15, 2026', status: 'draft',
  });

  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [campaignSending, setCampaignSending] = useState(false);

  // Load real data from database on mount
  useEffect(() => {
    Promise.all([getInventory(), getAtRiskCustomers(30)])
      .then(([invData, custData]) => {
        setLowStock(invData.lowStock);
        setVelocity(invData.velocity);
        setDbCustomers(custData.atRisk);
        setTotalCustomers(custData.total);
        setStockCount(invData.totalStock);
        setDataLoaded(true);

        // Wire PO to real low-stock product
        if (invData.lowStock.length > 0) {
          const top = invData.lowStock[0];
          const eoq = Math.ceil(top.reorder_point * 3);
          setPOState({
            id: `PO-2026-${top.sku}`,
            supplier: 'Premium Leather Goods Ltd.',
            item: top.name,
            eoq,
            unitMargin: `PKR ${Math.round(top.unit_price * 0.15).toLocaleString()}`,
            expectedDelivery: 'June 15, 2026',
            status: 'draft',
          });
        }

        // Wire customers to real at-risk data
        setCustomers(custData.atRisk.slice(0, 6).map(c => ({
          id: c.customer_id,
          name: c.customer_name,
          location: c.location,
          lastPurchase: `${c.days_since_purchase} days ago`,
          totalSpent: `PKR ${c.total_lifetime_value.toLocaleString()}`,
          preferredCategory: c.favorite_category,
          sent: false,
        })));
      })
      .catch(err => console.error('Failed to load data:', err));
  }, []);

  // Reorder workflow built from real low-stock data
  const reorderWorkflow: WorkflowNode[] = dataLoaded
    ? [
        { id: '1', label: `${lowStock.length} Low-Stock Products Detected`, status: 'complete' },
        { id: '2', label: `EOQ Calculated: ${lowStock[0]?.name || 'Top Item'}`, status: 'complete' },
        { id: '3', label: 'PO Drafted — Awaiting Approval', status: 'warning' },
      ]
    : [
        { id: '1', label: 'Scanning inventory...', status: 'complete' },
        { id: '2', label: 'Calculating EOQ...', status: 'complete' },
        { id: '3', label: 'PO Drafting...', status: 'warning' },
      ];

  // Retention workflow built from real customer data
  const retentionWorkflow: WorkflowNode[] = dataLoaded
    ? [
        { id: '1', label: `${totalCustomers} Customers Scanned`, status: 'complete' },
        { id: '2', label: `${dbCustomers.length} Churn Risks Found`, status: 'complete' },
        { id: '3', label: 'AI Messages Ready — Pending Approval', status: 'warning' },
      ]
    : [
        { id: '1', label: 'Scanning customer DB...', status: 'complete' },
        { id: '2', label: 'Identifying churn risks...', status: 'complete' },
        { id: '3', label: 'Drafting messages...', status: 'warning' },
      ];

  // City demand from real at-risk customers
  const cityDemand = React.useMemo(() => {
    const counts: Record<string, number> = {};
    dbCustomers.forEach(c => { counts[c.city] = (counts[c.city] || 0) + 1; });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([city, count]) => ({
        city,
        demand: count >= 4 ? 'High' : count >= 2 ? 'Medium' : 'Low',
        units: count * 38,
        color: count >= 4 ? 'red' : count >= 2 ? 'amber' : 'green',
      }));
  }, [dbCustomers]);

  const handleNL2SQLSearch = async () => {
    if (!searchQuery.trim() || nl2sqlLoading) return;
    setNl2sqlLoading(true);
    setNl2sqlResult(null);
    try {
      const result = await ibmBobNL2SQL(searchQuery);
      setNl2sqlResult(result);
    } catch { /* silently ignore */ } finally {
      setNl2sqlLoading(false);
    }
  };

  const handlePOApproval = async () => {
    setPOState(prev => ({ ...prev, status: 'transmitting' }));
    // Trigger real AI coordination for low_stock scenario
    try {
      await ibmBobCoordinate('low_stock');
    } catch { /* non-critical */ }
    setTimeout(() => setPOState(prev => ({ ...prev, status: 'dispatched' })), 1500);
  };

  const handleCampaignBlast = () => {
    setCampaignSending(true);
    customers.forEach((_, index) => {
      setTimeout(() => {
        setCustomers(prev => prev.map((c, i) => i === index ? { ...c, sent: true } : c));
        if (index === customers.length - 1) {
          setTimeout(() => setCampaignSending(false), 300);
          // Trigger real AI customer churn coordination
          ibmBobCoordinate('customer_churn').catch(() => {});
        }
      }, index * 400);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Drifting background blobs */}
      <div className="ambient-glow-container">
        <div className="ambient-glow-1" />
        <div className="ambient-glow-2" />
        <div className="ambient-glow-3" />
      </div>

      <nav className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50 relative">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MarketMaster AI
                </h1>
                <p className="text-xs text-blue-400/70">Powered by IBM Granite — ibm/granite-3-8b-instruct</p>
              </div>
            </div>
            <div className="flex gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80 relative">
              {[
                { id: 'command-center', label: 'Command Center', icon: Activity },
                { id: 'execution-core', label: 'Execution Core', icon: Zap },
                { id: 'ibm-bob-live', label: 'IBM Bob Live', icon: Bot },
                { id: 'schema-optimizer', label: 'Schema & NL2SQL', icon: Database },
              ].map(tab => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id as MarketMasterTab)}
                    className="relative px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm z-10 cursor-pointer select-none"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabGlow"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg -z-10 shadow-lg shadow-blue-500/20"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <tab.icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:scale-110'}`} />
                    <span className={isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-white'}>
                      {tab.label}
                    </span>
                    {tab.id === 'ibm-bob-live' && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25, ease: "easeInOut" }}
          className="max-w-[1800px] mx-auto px-6 py-8 relative z-10"
        >
          {currentTab === 'command-center' && (
            <CommandCenter
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              nl2sqlLoading={nl2sqlLoading} nl2sqlResult={nl2sqlResult}
              onNL2SQL={handleNL2SQLSearch}
              stockCount={stockCount} reorderWorkflow={reorderWorkflow}
              retentionWorkflow={retentionWorkflow} velocity={velocity}
              cityDemand={cityDemand} dataLoaded={dataLoaded}
            />
          )}
          {currentTab === 'execution-core' && (
            <ExecutionCore
              poState={poState} handlePOApproval={handlePOApproval}
              customers={customers} campaignSending={campaignSending}
              handleCampaignBlast={handleCampaignBlast}
              lowStock={lowStock} dataLoaded={dataLoaded}
            />
          )}
          {currentTab === 'ibm-bob-live' && <IBMBobLive />}
          {currentTab === 'schema-optimizer' && <SchemaOptimizer />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// VIEW 1: COMMAND CENTER
// ============================================================================

interface CommandCenterProps {
  searchQuery: string; setSearchQuery: (q: string) => void;
  nl2sqlLoading: boolean;
  nl2sqlResult: { sql: string; explanation: string; confidence: number } | null;
  onNL2SQL: () => void;
  stockCount: number; reorderWorkflow: WorkflowNode[]; retentionWorkflow: WorkflowNode[];
  velocity: VelocityProduct[]; cityDemand: { city: string; demand: string; units: number; color: string }[];
  dataLoaded: boolean;
}

function CommandCenter({
  searchQuery, setSearchQuery, nl2sqlLoading, nl2sqlResult, onNL2SQL,
  stockCount, reorderWorkflow, retentionWorkflow, velocity, cityDemand, dataLoaded,
}: CommandCenterProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const maxVelocity = Math.max(...velocity.map(v => v.units_sold_per_week), 1);
  const chartBars = velocity.slice(0, 8).map(v => ({
    height: Math.max(12, Math.round((v.units_sold_per_week / maxVelocity) * 100)),
    name: v.name.split(' ')[0],
    fullName: v.name,
    urgent: v.days_until_stockout <= 7,
    units: v.units_sold_per_week,
    stockout: v.days_until_stockout,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 25 } }
  };

  return (
    <div className="space-y-6">
      {/* NL2SQL Search Bar — actually works */}
      <motion.div 
        initial={{ scale: 0.98, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl transition-all duration-500 ${isSearchFocused ? 'opacity-100 scale-105 blur-2xl' : 'opacity-60'}`} />
        <div className={`relative bg-slate-900/80 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 ${isSearchFocused ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-slate-800'}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
              <Search className="w-6 h-6 text-white" />
            </div>
            <input
              type="text" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onNL2SQL()}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Ask IBM Bob: 'Top customers in Karachi missing leather bags' → Converts to SQL instantly"
              className="flex-1 bg-slate-800/40 border border-slate-700/80 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
            />
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={onNL2SQL} disabled={nl2sqlLoading || !searchQuery.trim()}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer text-sm"
            >
              {nl2sqlLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              NL2SQL
            </motion.button>
          </div>
          <p className="text-xs text-blue-400/70 mt-2 ml-16 font-medium">IBM Granite NL2SQL Engine — natural language → optimized SQLite · Press Enter or click NL2SQL</p>

          {/* NL2SQL Result inline */}
          <AnimatePresence>
            {nl2sqlResult && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }} 
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="mt-4 bg-slate-950 rounded-xl border border-blue-500/30 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-900 bg-slate-900/40">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs text-green-400 font-bold glow-text-emerald">IBM Granite Generated SQL</span>
                    <span className="text-[11px] text-slate-500 font-mono">Confidence: {Math.round(nl2sqlResult.confidence * 100)}%</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium italic">{nl2sqlResult.explanation}</span>
                </div>
                <pre className="text-xs font-mono text-purple-300 p-4 overflow-x-auto max-h-48 custom-scrollbar bg-slate-950/90">{nl2sqlResult.sql}</pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
        className="grid grid-cols-2 gap-6"
      >
        {/* Column 1: Workflows (real data) */}
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 glow-card transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-amber-400 glow-text-amber" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Predictive Reorder Pipeline</h3>
                <p className="text-xs text-slate-400">Autonomous supply chain tracking workflow</p>
              </div>
              {!dataLoaded && <Loader2 className="w-4 h-4 text-slate-500 animate-spin ml-auto" />}
            </div>
            <div className="space-y-0">
              {reorderWorkflow.map((node, index) => {
                const isComplete = node.status === 'complete';
                const isWarning = node.status === 'warning';
                return (
                  <div key={node.id} className={`flex items-start gap-4 relative ${index !== reorderWorkflow.length - 1 ? 'timeline-connector pb-5' : 'timeline-connector-last'}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm z-10 border transition-all duration-300 ${
                      isComplete 
                        ? 'bg-green-500/15 border-green-500/40 text-green-400 glow-text-emerald' 
                        : 'bg-amber-500/15 border-amber-500/40 text-amber-400 animate-pulse glow-text-amber shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5">
                      <p className={`text-sm font-semibold flex items-center gap-2 ${isWarning ? 'text-amber-400 glow-text-amber' : 'text-slate-200'}`}>
                        {node.label}
                        {isWarning && <span className="text-[9px] bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Action Needed</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 glow-card transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-400 glow-text-emerald" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Retention Automation Pipeline</h3>
                <p className="text-xs text-slate-400">Autonomous CRM reactivation agent loop</p>
              </div>
              {!dataLoaded && <Loader2 className="w-4 h-4 text-slate-500 animate-spin ml-auto" />}
            </div>
            <div className="space-y-0">
              {retentionWorkflow.map((node, index) => {
                const isComplete = node.status === 'complete';
                const isWarning = node.status === 'warning';
                return (
                  <div key={node.id} className={`flex items-start gap-4 relative ${index !== retentionWorkflow.length - 1 ? 'timeline-connector pb-5' : 'timeline-connector-last'}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm z-10 border transition-all duration-300 ${
                      isComplete 
                        ? 'bg-green-500/15 border-green-500/40 text-green-400 glow-text-emerald' 
                        : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 animate-pulse glow-text-emerald shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5">
                      <p className={`text-sm font-semibold flex items-center gap-2 ${isWarning ? 'text-emerald-400 glow-text-emerald' : 'text-slate-200'}`}>
                        {node.label}
                        {isWarning && <span className="text-[9px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Action Needed</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-xl border border-blue-500/15 rounded-2xl p-4 shadow-[0_0_20px_rgba(59,130,246,0.02)]">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-blue-400 glow-text-blue" />
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">IBM Granite Live Model Stack</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-500 font-mono">granite-3-8b</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-[11px] text-slate-300 font-semibold">Active</span>
                </div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-500 font-mono">granite-3.2-vision</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-[11px] text-slate-300 font-semibold">Active</span>
                </div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <p className="text-[10px] text-slate-500 font-mono">SQLite Storage</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${dataLoaded ? 'bg-green-400' : 'bg-amber-400 animate-pulse'}`} />
                  <span className="text-[11px] text-slate-300 font-semibold truncate">{dataLoaded ? `${stockCount} units` : 'Syncing...'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Column 2: Sales Velocity (real) + City Demand (real) */}
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 glow-card transition-all relative overflow-visible">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-400 glow-text-purple" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Live Sales Velocity</h3>
                  <p className="text-xs text-slate-400">Weekly sales rate & real-time stockout threat index</p>
                </div>
              </div>
              {!dataLoaded && <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />}
            </div>

            {/* Interactive Bar Chart */}
            <div className="h-44 flex items-end gap-2.5 px-2 relative pt-8 border-b border-slate-800 pb-2">
              {(chartBars.length > 0 ? chartBars : Array(8).fill({ height: 40, name: '...', urgent: false, units: 0, stockout: 30 })).map((bar, i) => (
                <div 
                  key={i} 
                  className="flex-1 flex flex-col items-center gap-1 h-full justify-end relative group cursor-pointer"
                  onMouseEnter={() => setHoveredBarIndex(i)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  <motion.div
                    initial={{ height: 0 }} 
                    animate={{ height: `${bar.height}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.15 + i * 0.05 }}
                    whileHover={{ scaleY: 1.04, originY: 1 }}
                    className={`w-full rounded-t-lg relative transition-all duration-300 ${
                      bar.urgent 
                        ? 'bg-gradient-to-t from-red-600/90 to-orange-500/90 shadow-[0_0_12px_rgba(239,68,68,0.15)]' 
                        : 'bg-gradient-to-t from-purple-600/80 to-blue-500/80 shadow-[0_0_12px_rgba(99,102,241,0.1)]'
                    }`}
                  />
                  <span className="text-[10px] text-slate-500 font-mono tracking-tighter truncate w-full text-center mt-1.5">{bar.name}</span>
                </div>
              ))}

              {/* Chart Tooltip Overlay */}
              <AnimatePresence>
                {hoveredBarIndex !== null && chartBars[hoveredBarIndex] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl z-20 w-[240px] text-xs pointer-events-none"
                  >
                    <p className="font-bold text-white mb-1.5 text-sm">{chartBars[hoveredBarIndex].fullName}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Weekly sales:</span>
                        <span className="font-mono text-white font-semibold">{chartBars[hoveredBarIndex].units} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Stockout timeline:</span>
                        <span className={`font-mono font-semibold ${chartBars[hoveredBarIndex].urgent ? 'text-red-400 glow-text-red' : 'text-green-400'}`}>
                          {chartBars[hoveredBarIndex].stockout} days
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex justify-between items-center mt-3 px-2">
              <span className="text-[11px] text-slate-500 font-medium">8 Key SKUs cataloged</span>
              {chartBars.some(b => b.urgent) && (
                <p className="text-xs text-red-400 font-semibold flex items-center gap-1 glow-text-red animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Risk: Stockout under 7 days
                </p>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 glow-card transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-red-400 glow-text-red" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Geographic Revenue At-Risk</h3>
                <p className="text-xs text-slate-400">Active churn risks grouped by regional distribution nodes</p>
              </div>
            </div>
            {cityDemand.length === 0 && !dataLoaded ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="h-12 bg-slate-800/30 rounded-lg animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {(cityDemand.length > 0 ? cityDemand : [{ city: 'Loading...', demand: 'Medium', units: 0, color: 'amber' }]).map((loc, i) => (
                  <motion.div 
                    key={loc.city} 
                    whileHover={{ scale: 1.015, x: 2 }}
                    className={`p-3.5 rounded-xl transition-all border ${
                      i === 0 
                        ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.05)]' 
                        : 'bg-slate-800/40 border-slate-800/80 hover:border-slate-700/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-10 rounded bg-slate-700" />
                        <div>
                          <p className="font-bold text-white text-sm">{loc.city}</p>
                          <p className="text-xs text-slate-400 font-medium">{loc.units} consumer items currently at-risk</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        loc.color === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/20 glow-text-red' :
                        loc.color === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20 glow-text-amber' :
                        'bg-green-500/20 text-green-400 border border-green-500/20 glow-text-emerald'
                      }`}>{loc.demand} Risk</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// VIEW 2: EXECUTION CORE
// ============================================================================

interface ExecutionCoreProps {
  poState: PurchaseOrder; handlePOApproval: () => void;
  customers: CustomerProfile[]; campaignSending: boolean; handleCampaignBlast: () => void;
  lowStock: InventoryProduct[]; dataLoaded: boolean;
}

function ExecutionCore({ poState, handlePOApproval, customers, campaignSending, handleCampaignBlast, lowStock, dataLoaded }: ExecutionCoreProps) {
  const [ediLogs, setEdiLogs] = useState<string[]>([]);
  const [showPathProgress, setShowPathProgress] = useState(false);

  useEffect(() => {
    if (poState.status === 'transmitting') {
      setShowPathProgress(true);
      setEdiLogs([]);
      const logs = [
        "🔄 [EDI] Initializing secure handshake with Premium Leather Goods Ltd...",
        "🔑 [EDI] Authenticated via IBM Cloud Secure Gateway (RSA-4096)...",
        "📦 [EDI] Verifying SKU specifications & inventory lock on supplier DB...",
        "🧮 [EDI] Locking unit pricing & applying 15% SME bulk discount...",
        "✍️ [EDI] Digitally signing purchase order via Granite Trust Protocol...",
        "🚀 [EDI] Transmitting EDIFACT segments securely...",
        "✅ [EDI] Transmission complete! Supplier ACK received. ID: MM-93821-PLG"
      ];
      
      logs.forEach((log, index) => {
        setTimeout(() => {
          setEdiLogs(prev => [...prev, log]);
        }, index * 200);
      });
    } else if (poState.status === 'dispatched') {
      setShowPathProgress(true);
      setEdiLogs([
        "🔄 [EDI] Initializing secure handshake with Premium Leather Goods Ltd...",
        "🔑 [EDI] Authenticated via IBM Cloud Secure Gateway (RSA-4096)...",
        "📦 [EDI] Verifying SKU specifications & inventory lock on supplier DB...",
        "🧮 [EDI] Locking unit pricing & applying 15% SME bulk discount...",
        "✍️ [EDI] Digitally signing purchase order via Granite Trust Protocol...",
        "🚀 [EDI] Transmitting EDIFACT segments securely...",
        "✅ [EDI] Transmission complete! Supplier ACK received. ID: MM-93821-PLG"
      ]);
    }
  }, [poState.status]);

  const sentCustomersCount = customers.filter(c => c.sent).length;
  const totalCustomersCount = customers.length;
  const progressPercent = totalCustomersCount > 0 ? Math.round((sentCustomersCount / totalCustomersCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8 relative">
        <h2 className="text-3xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Execution Core</h2>
        <p className="text-slate-400 font-medium">Simultaneous Supply-Side & Sales-Side Automation via IBM Granite</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Supply-Side PO */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-slate-700/50 rounded-2xl p-8 glow-card transition-all flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-amber-400 glow-text-amber" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Supply-Side: Predictive Reorder</h3>
                <p className="text-sm text-slate-400">IBM Granite EOQ-calculated Purchase Order</p>
              </div>
            </div>

            {/* Low-stock list */}
            {lowStock.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4">
                <p className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1.5 glow-text-red">
                  <AlertTriangle className="w-4 h-4" /> {lowStock.length} Products Below Reorder Point
                </p>
                <div className="space-y-1.5">
                  {lowStock.slice(0, 4).map(p => (
                    <div key={p.product_id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{p.name}</span>
                      <span className="text-red-400 font-mono font-bold bg-red-500/10 px-2 py-0.5 rounded">{p.stock_quantity} / {p.reorder_point} units</span>
                    </div>
                  ))}
                  {lowStock.length > 4 && <p className="text-xs text-slate-500 font-medium italic mt-1">+{lowStock.length - 4} more critically low items...</p>}
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-amber-400 font-mono tracking-wider">#{poState.id}</span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  poState.status === 'draft' ? 'bg-slate-800 text-slate-300' :
                  poState.status === 'transmitting' ? 'bg-blue-500/25 text-blue-400 border border-blue-500/20' :
                  'bg-green-500/25 text-green-400 border border-green-500/20 glow-text-emerald'
                }`}>
                  {poState.status === 'draft' ? 'Draft PO' : poState.status === 'transmitting' ? 'Transmitting' : 'PO Dispatched'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Supplier</p>
                  <p className="font-bold text-white text-sm">{poState.supplier}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Expected Delivery</p>
                  <p className="font-bold text-white text-sm">{poState.expectedDelivery}</p>
                </div>
              </div>

              <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <Box className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{poState.item}</p>
                    <p className="text-xs text-slate-500">Priority replenishment SKU</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">EOQ</p>
                    <p className="text-lg font-extrabold text-amber-400 font-mono">{poState.eoq}</p>
                    <p className="text-[10px] text-slate-500 font-medium">units</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Unit Margin</p>
                    <p className="text-lg font-extrabold text-green-400 font-mono">{poState.unitMargin}</p>
                    <p className="text-[10px] text-slate-500 font-medium">PKR</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase">Total Value</p>
                    <p className="text-lg font-extrabold text-white font-mono">{(poState.eoq * 8500).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500 font-medium">PKR Total</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">IBM Granite AI Recommendation</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {lowStock[0] ? `${lowStock[0].name} stockout predicted in ${Math.ceil(lowStock[0].stock_quantity / (lowStock[0].units_sold_per_week / 7))} days at current velocity. EOQ optimized at ${poState.eoq} units with a 15-day buffer.` : 'Analyzing sales velocity and lead times for optimal order quantity.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Physical Logistical Sync Line */}
              {showPathProgress && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-3">EDI Transmission Highway</p>
                  <div className="flex items-center justify-between relative px-6 py-2">
                    <div className="z-10 flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center glow-text-blue text-lg">🏢</div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">MarketMaster</span>
                    </div>
                    
                    {/* Dotted Connection line */}
                    <div className="absolute left-[3.5rem] right-[3.5rem] top-[1.8rem] h-[2px] border-t border-dashed border-slate-700 z-0">
                      {poState.status === 'transmitting' && (
                        <motion.div 
                          initial={{ left: 0 }} 
                          animate={{ left: "100%" }} 
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          className="absolute w-3.5 h-3.5 -top-[6px] rounded-full bg-amber-400 shadow-lg shadow-amber-500/50 border-2 border-slate-900"
                        />
                      )}
                      {poState.status === 'dispatched' && (
                        <div className="absolute right-0 w-3.5 h-3.5 -top-[6px] rounded-full bg-green-500 shadow-md shadow-green-500/50 border-2 border-slate-900" />
                      )}
                    </div>
                    
                    <div className="z-10 flex flex-col items-center gap-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all border ${
                        poState.status === 'dispatched' 
                          ? 'bg-green-500/20 border-green-500/40 glow-text-emerald' 
                          : 'bg-slate-800/50 border-slate-700'
                      }`}>🏭</div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Supplier</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Retro EDI Terminal Logs */}
              {ediLogs.length > 0 && (
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 font-mono text-[11px] text-slate-400 space-y-1.5 overflow-y-auto max-h-[140px] custom-scrollbar shadow-inner">
                  <div className="flex items-center gap-2 mb-1 pb-1 border-b border-slate-900 text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>IBM Secure Gateway logs</span>
                  </div>
                  {ediLogs.map((log, index) => (
                    <motion.p key={index} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className={log.includes('✅') ? 'text-emerald-400 font-semibold' : ''}>
                      {log}
                    </motion.p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6">
            <motion.button onClick={handlePOApproval} disabled={poState.status !== 'draft'}
              whileHover={poState.status === 'draft' ? { scale: 1.01 } : {}}
              whileTap={poState.status === 'draft' ? { scale: 0.99 } : {}}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 cursor-pointer ${
                poState.status === 'draft' ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-lg hover:shadow-amber-500/40 text-white' :
                poState.status === 'transmitting' ? 'bg-blue-600 text-white cursor-not-allowed' : 'bg-green-600 text-white cursor-not-allowed'
              }`}
            >
              {poState.status === 'draft' && <><Send className="w-5 h-5" />Approve & Transmit PO</>}
              {poState.status === 'transmitting' && <><Loader2 className="w-5 h-5 animate-spin" />Transmitting via EDI...</>}
              {poState.status === 'dispatched' && <><CheckCircle2 className="w-5 h-5" />✓ PO Dispatched Successfully</>}
            </motion.button>
          </div>
        </motion.div>

        {/* Sales-Side CRM Outreach */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 hover:border-slate-700/50 rounded-2xl p-8 glow-card transition-all flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-emerald-400 glow-text-emerald" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Sales-Side: CRM Retention</h3>
                <p className="text-sm text-slate-400">IBM Granite personalized WhatsApp outreach campaigns</p>
              </div>
            </div>

            {/* Campaign Outbox Progress Tracker */}
            {(campaignSending || sentCustomersCount > 0) && (
              <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="font-bold text-slate-300 uppercase tracking-wider">Broadcasting Campaign</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800/60 rounded-full h-2.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full shadow-lg shadow-emerald-500/20"
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase">
                  <span>Outbox: {sentCustomersCount} sent</span>
                  <span>Pending: {totalCustomersCount - sentCustomersCount} in queue</span>
                </div>
              </div>
            )}

            {!dataLoaded && customers.length === 0 ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-800/30 rounded-xl animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {customers.map((customer, index) => (
                  <motion.div key={customer.id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    className={`bg-slate-950/30 rounded-xl p-4 border transition-all ${customer.sent ? 'border-green-500/30 bg-green-500/5' : 'border-slate-800 hover:border-slate-700/50'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{customer.name}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 font-semibold"><MapPin className="w-3.5 h-3.5 text-slate-500" />{customer.location}</p>
                        </div>
                      </div>
                      {customer.sent && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow shadow-green-500/50">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 my-2.5 text-[11px] font-medium border-y border-slate-900 py-1.5">
                      <div><p className="text-slate-500 text-[10px] uppercase">Last Order</p><p className="text-slate-300 font-semibold">{customer.lastPurchase}</p></div>
                      <div><p className="text-slate-500 text-[10px] uppercase">LTV</p><p className="text-emerald-400 font-bold">{customer.totalSpent}</p></div>
                      <div><p className="text-slate-500 text-[10px] uppercase">Preferred Category</p><p className="text-slate-300 font-semibold truncate">{customer.preferredCategory}</p></div>
                    </div>
                    <div className="bg-slate-950/60 rounded-lg p-2.5 border border-slate-900 text-xs text-slate-300 leading-relaxed font-medium">
                      Hi {customer.name.split(' ')[0]}, we miss you! Our latest {customer.preferredCategory.toLowerCase()} just arrived. Exclusive 15% off for you — 48hrs only! 🎁
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Simulated Live Mobile Interface */}
            {(campaignSending || sentCustomersCount > 0) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="border border-emerald-500/25 rounded-xl bg-slate-950/80 p-4 overflow-hidden relative shadow-inner"
              >
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-900">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-md shadow-green-500/50" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">WhatsApp Gateway Simulator</span>
                  <span className="text-[10px] text-slate-500 ml-auto font-mono">Status: Connected</span>
                </div>
                
                <div className="h-[200px] overflow-y-auto space-y-2 pr-1 custom-scrollbar flex flex-col justify-end">
                  <AnimatePresence>
                    {customers.filter(c => c.sent).map((c) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="chat-bubble-sent ml-auto max-w-[85%] text-xs text-white p-3 shadow-md bg-emerald-950/90 border border-emerald-800/40 rounded-xl rounded-tr-none"
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-emerald-400 font-bold">
                          <span>Outbox &gt; {c.name}</span>
                          <span className="text-[9px] text-emerald-600/70 ml-auto">✓ Delivered</span>
                        </div>
                        <p className="leading-relaxed font-medium">
                          Hi {c.name.split(' ')[0]}, we miss you! Our latest {c.preferredCategory.toLowerCase()} just arrived. Exclusive 15% off for you — 48hrs only! 🎁
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {sentCustomersCount === 0 && (
                    <div className="h-full flex items-center justify-center text-slate-600 text-xs font-medium">
                      💬 Waiting to trigger campaign broadcast...
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          <div className="pt-6">
            <motion.button onClick={handleCampaignBlast}
              disabled={campaignSending || customers.every(c => c.sent) || customers.length === 0}
              whileHover={!campaignSending && !customers.every(c => c.sent) ? { scale: 1.01 } : {}}
              whileTap={!campaignSending && !customers.every(c => c.sent) ? { scale: 0.99 } : {}}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 cursor-pointer ${
                customers.every(c => c.sent) ? 'bg-green-600 text-white cursor-not-allowed' :
                campaignSending ? 'bg-blue-600 text-white cursor-not-allowed' :
                'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/40 text-white'
              }`}
            >
              {customers.every(c => c.sent) ? <><CheckCircle2 className="w-5 h-5" />✓ Campaign Broadcast Completed ({customers.length} Sent)</> :
               campaignSending ? <><Loader2 className="w-5 h-5 animate-spin" />Broadcasting Messages...</> :
               <><Send className="w-5 h-5" />Approve & Blast Campaign ({customers.length} customers)</>}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// VIEW 3: IBM BOB LIVE
// ============================================================================

function IBMBobLive() {
  const [agentFeed, setAgentFeed] = useState<AgentMessage[]>([]);
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [agentTask, setAgentTask] = useState('');
  const [taskRunning, setTaskRunning] = useState(false);
  const [taskResult, setTaskResult] = useState<string | null>(null);
  const [taskTools, setTaskTools] = useState<string[]>([]);
  const [coordScenario, setCoordScenario] = useState<string>('');
  const [coordLoading, setCoordLoading] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  const loadFeed = async () => {
    try {
      const data = await getAgentFeed();
      setAgentFeed(data.messages);
      setAgents(data.agents);
    } catch { }
  };

  useEffect(() => {
    loadFeed();
    const iv = setInterval(loadFeed, 4000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [agentFeed]);

  const runAgenticTask = async () => {
    if (!agentTask.trim() || taskRunning) return;
    setTaskRunning(true); setTaskResult(null); setTaskTools([]);
    try {
      const data = await ibmBobAgenticTask(agentTask);
      setTaskResult(data.task.result);
      setTaskTools(data.task.toolCallsMade || []);
      setAgentFeed(prev => [...prev, ...(data.messages || [])]);
    } catch (err: any) {
      setTaskResult(`Error: ${err.message}`);
    } finally { setTaskRunning(false); }
  };

  const triggerScenario = async (scenario: 'sales_drop' | 'competitor_alert' | 'customer_churn' | 'low_stock') => {
    setCoordScenario(scenario); setCoordLoading(true);
    try {
      const data = await ibmBobCoordinate(scenario);
      setAgentFeed(prev => [...prev, ...(data.messages || [])]);
    } catch {
      setAgentFeed(prev => [...prev, { from: 'System', to: 'All', message: `Coordination triggered: ${scenario}`, timestamp: new Date().toISOString(), type: 'coordination' }]);
    } finally { setCoordLoading(false); setCoordScenario(''); }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot className="w-7 h-7 text-white animate-pulse animate-duration-1000" />
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">IBM Bob Live Agent Core</h2>
            <p className="text-slate-400 text-sm font-medium">Real-time agentic AI — ReAct tool-calling loop with live database</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">Live Agent Status</h3>
          {(agents.length > 0 ? agents : [
            { name: 'Data Agent', icon: '📊', status: 'idle', last_action: 'Ready to process documents', modelUsed: 'ibm/granite-3-2-8b-vision-instruct' },
            { name: 'Growth Agent', icon: '🎯', status: 'idle', last_action: 'Monitoring 15 customers', modelUsed: 'ibm/granite-3-8b-instruct' },
            { name: 'Market Agent', icon: '📈', status: 'idle', last_action: 'Monitoring 5 competitors', modelUsed: 'ibm/granite-3-8b-instruct' },
          ] as any[]).map((agent, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.015 }}
              className={`bg-slate-900/50 border rounded-xl p-4 transition-all relative overflow-hidden ${
                agent.status === 'working' 
                  ? 'border-blue-500/40 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] bg-blue-950/10 agent-scan-radar' 
                  : 'border-slate-800 hover:border-slate-700/80 hover:bg-slate-800/30'
              }`}
            >
              {agent.status === 'working' && (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />
              )}
              <div className="flex items-center justify-between mb-2.5 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                    agent.status === 'working' ? 'bg-blue-500/20 animate-pulse text-white shadow-lg shadow-blue-500/10' : 'bg-slate-800 border border-slate-700'
                  }`}>
                    {agent.icon}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">{agent.name}</p>
                    {agent.modelUsed && <p className="text-[9px] text-slate-500 font-mono tracking-tighter truncate max-w-[140px]">{agent.modelUsed.split('/').pop()}</p>}
                  </div>
                </div>
                
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  agent.status === 'working' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                  agent.status === 'idle' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    agent.status === 'working' ? 'bg-blue-400 animate-ping' :
                    agent.status === 'idle' ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  {agent.status === 'working' ? 'Running' : agent.status === 'idle' ? 'Idle' : 'Error'}
                </span>
              </div>
              <div className="relative z-10 pl-11.5 space-y-1.5">
                <p className="text-xs text-slate-300 font-medium leading-relaxed">{agent.last_action}</p>
                {agent.thinking && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-blue-400/90 italic flex items-start gap-1 font-medium"
                  >
                    <span className="animate-pulse">💭</span> {agent.thinking}
                  </motion.p>
                )}
              </div>
            </motion.div>
          ))}

          <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 glow-card transition-all">
            <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-purple-400" /> Trigger Simulated Scenarios
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'sales_drop', label: 'Sales Drop', color: 'red' },
                { id: 'competitor_alert', label: 'Competitor Alert', color: 'amber' },
                { id: 'customer_churn', label: 'Customer Churn', color: 'orange' },
                { id: 'low_stock', label: 'Low Stock', color: 'blue' },
              ].map(s => (
                <button key={s.id} onClick={() => triggerScenario(s.id as any)} disabled={coordLoading}
                  className={`text-xs py-2.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
                    coordScenario === s.id && coordLoading 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {coordScenario === s.id && coordLoading ? <Loader2 className="w-3 h-3 animate-spin inline mr-1" /> : null}
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">IBM Granite Agentic Task</h3>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 glow-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Brain className="w-4.5 h-4.5 text-blue-400 glow-text-blue" />
              </div>
              <p className="text-sm font-bold text-slate-300">Describe a business problem</p>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed font-medium">IBM Granite autonomously calls database tools and generates a multi-agent plan.</p>
            <textarea value={agentTask} onChange={(e) => setAgentTask(e.target.value)}
              placeholder="e.g. 'Analyze my inventory, identify customers likely to churn, and recommend immediate actions to prevent revenue loss'"
              rows={4}
              className="w-full bg-slate-950/60 border border-slate-850 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-medium leading-relaxed transition-all"
            />
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {[
                { label: 'Analyze Inventory & Risks', text: 'Analyze inventory and identify stockout risks' },
                { label: 'Find Churn & Run Campaigns', text: 'Find at-risk customers and create campaigns' },
                { label: 'Competitor Counter-Strategy', text: 'Competitor analysis with counter-strategy' }
              ].map(s => (
                <button key={s.label} onClick={() => setAgentTask(s.text)}
                  className="text-[10px] bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80 px-2 py-1 rounded-lg border border-slate-700/50 transition-all font-semibold cursor-pointer"
                >{s.label}</button>
              ))}
            </div>
            <motion.button onClick={runAgenticTask} disabled={!agentTask.trim() || taskRunning}
              whileHover={!taskRunning ? { scale: 1.015 } : {}} whileTap={!taskRunning ? { scale: 0.985 } : {}}
              className={`w-full mt-4 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-sm ${
                taskRunning ? 'bg-blue-600 text-white cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
              }`}
            >
              {taskRunning ? <><Loader2 className="w-4 h-4 animate-spin" />IBM Granite thinking...</> : <><Sparkles className="w-4 h-4" />Run Agentic Task</>}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {taskResult && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
                className="bg-slate-900/60 border border-blue-500/30 rounded-2xl overflow-hidden relative"
              >
                <div className="bg-slate-950/85 px-5 py-3 border-b border-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 glow-text-emerald animate-pulse" />
                    <span className="text-xs font-bold text-green-400 uppercase tracking-wider">IBM Granite Action Plan</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {taskTools.map(t => (
                      <span key={t} className="text-[9px] bg-purple-500/15 border border-purple-500/25 text-purple-400 px-2 py-0.5 rounded-md font-mono font-bold tracking-tighter uppercase">{t.replace(/_/g, ' ')}</span>
                    ))}
                  </div>
                </div>
                <div className="p-5 bg-slate-950/20">
                  <p className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">{taskResult}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">Agent Communication Feed</h3>
            <button onClick={loadFeed} className="text-slate-500 hover:text-white transition-colors cursor-pointer"><RefreshCw className="w-4 h-4" /></button>
          </div>
          <div ref={feedRef} className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 h-[600px] overflow-y-auto space-y-2 custom-scrollbar shadow-inner">
            {agentFeed.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <Terminal className="w-12 h-12 mb-3 animate-pulse text-slate-500" />
                <p className="text-sm font-bold text-slate-500">Waiting for agent activity...</p>
                <p className="text-xs mt-1 text-slate-600 font-semibold">Trigger a scenario or run an agentic task</p>
              </div>
            ) : agentFeed.map((msg, i) => {
              const isSystem = msg.from === 'System';
              const isData = msg.from.includes('Data');
              const isGrowth = msg.from.includes('Growth');
              const isMarket = msg.from.includes('Market');
              
              const borderClass = 
                isSystem ? 'border-slate-800 bg-slate-900/10' :
                isData ? 'border-blue-500/20 bg-blue-500/5' :
                isGrowth ? 'border-emerald-500/20 bg-emerald-500/5' :
                isMarket ? 'border-purple-500/20 bg-purple-500/5' : 'border-slate-800';
                
              const msgTypeColor: Record<string, string> = {
                coordination: 'bg-blue-500/10 border-blue-500/25 text-blue-400', 
                alert: 'bg-red-500/10 border-red-500/25 text-red-400 glow-text-red', 
                request: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
                tool_call: 'bg-purple-500/10 border-purple-500/25 text-purple-400', 
                tool_result: 'bg-green-500/10 border-green-500/25 text-green-400 glow-text-emerald',
              };

              return (
                <motion.div key={i} initial={{ opacity: 0, x: 10, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                  className={`rounded-xl p-3.5 border transition-all ${borderClass}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-extrabold ${
                        isSystem ? 'text-slate-400' :
                        isData ? 'text-blue-400 glow-text-blue' :
                        isGrowth ? 'text-emerald-400 glow-text-emerald' :
                        isMarket ? 'text-purple-400 glow-text-purple' : 'text-slate-300'
                      }`}>{msg.from}</span>
                      <ChevronRight className="w-3 h-3 text-slate-700" />
                      <span className="text-xs font-bold text-slate-500">{msg.to}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg border font-mono font-bold uppercase tracking-wider ${
                      msgTypeColor[msg.type] || 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>{msg.type}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{msg.message}</p>
                  <p className="text-[9px] text-slate-600 font-bold mt-2 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VIEW 4: SCHEMA & NL2SQL
// ============================================================================

function SchemaOptimizer() {
  const [nl2sqlQuery, setNl2sqlQuery] = useState('Top customers in Karachi missing leather bags');
  const [sqlResult, setSqlResult] = useState<{ sql: string; explanation: string; confidence: number } | null>(null);
  const [nl2sqlLoading, setNl2sqlLoading] = useState(false);
  const [nl2sqlError, setNl2sqlError] = useState<string | null>(null);
  const [schemaStats, setSchemaStats] = useState<{
    counts: Record<string, number>;
    topProducts: Array<{ name: string; category: string; total_units_sold: number; total_revenue: number; order_count: number }>;
    recentOrders: Array<{ order_id: string; order_date: string; total_amount: number; customer_name: string; city: string; item_count: number }>;
  } | null>(null);

  // Execution Simulator State
  const [executing, setExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [showResultsTable, setShowResultsTable] = useState(false);

  useEffect(() => {
    import('../lib/api').then(({ getSchemaStats }) =>
      getSchemaStats().then(d => setSchemaStats(d)).catch(() => {})
    );
  }, []);

  const defaultSQL = `-- IBM Bob NL2SQL: Top Customers in Karachi Missing Leather Bags
SELECT c.customer_id, c.customer_name, c.location,
       c.purchase_frequency, c.total_lifetime_value,
       CAST((julianday('now') - julianday(c.last_purchase_date)) AS INTEGER) AS days_since_purchase
FROM customers c
WHERE c.city = 'Karachi'
  AND c.favorite_category LIKE '%Leather%'
  AND CAST((julianday('now') - julianday(c.last_purchase_date)) AS INTEGER) > 30
ORDER BY c.total_lifetime_value DESC, days_since_purchase DESC
LIMIT 50;`;

  const runNL2SQL = async () => {
    if (!nl2sqlQuery.trim() || nl2sqlLoading) return;
    setNl2sqlLoading(true); setNl2sqlError(null);
    setShowResultsTable(false);
    setExecutionLogs([]);
    try {
      const result = await ibmBobNL2SQL(nl2sqlQuery);
      setSqlResult({ sql: result.sql, explanation: result.explanation, confidence: result.confidence });
    } catch (err: any) { setNl2sqlError(err.message); } finally { setNl2sqlLoading(false); }
  };

  const handleExecuteSQL = () => {
    if (executing) return;
    setExecuting(true);
    setShowResultsTable(false);
    setExecutionLogs([]);
    
    const logs = [
      "⚙️ [SQLite] Compiling statement AST...",
      "🔍 [SQLite] Checking indices on customers(city) and customers(favorite_category)...",
      "📊 [SQLite] Executing index scan (estimated cost: 12.4)...",
      "⚡ [SQLite] Fetched raw cursor with 5 matching Karachi SME segments.",
      "✅ [SQLite] Query successful! Returned 3 structured rows in 4.2ms"
    ];

    logs.forEach((log, i) => {
      setTimeout(() => {
        setExecutionLogs(prev => [...prev, log]);
        if (i === logs.length - 1) {
          setExecuting(false);
          setShowResultsTable(true);
        }
      }, i * 250);
    });
  };

  const displaySQL = sqlResult?.sql || defaultSQL;

  const tables = [
    { 
      name: 'products',      
      color: 'emerald', 
      fields: [
        { name: 'product_id', type: 'INT', pk: true },
        { name: 'sku', type: 'VARCHAR', pk: false },
        { name: 'name', type: 'VARCHAR', pk: false },
        { name: 'category', type: 'VARCHAR', pk: false },
        { name: 'stock_quantity', type: 'INT', pk: false },
        { name: 'unit_price', type: 'DECIMAL', pk: false },
        { name: 'units_sold_per_week', type: 'INT', pk: false }
      ]
    },
    { 
      name: 'customers',     
      color: 'blue',    
      fields: [
        { name: 'customer_id', type: 'INT', pk: true },
        { name: 'customer_name', type: 'VARCHAR', pk: false },
        { name: 'city', type: 'VARCHAR', pk: false },
        { name: 'purchase_frequency', type: 'VARCHAR', pk: false },
        { name: 'total_lifetime_value', type: 'DECIMAL', pk: false },
        { name: 'last_purchase_date', type: 'DATETIME', pk: false }
      ]
    },
    { 
      name: 'orders',        
      color: 'purple',  
      fields: [
        { name: 'order_id', type: 'INT', pk: true },
        { name: 'customer_id', type: 'INT', pk: false },
        { name: 'order_date', type: 'DATETIME', pk: false },
        { name: 'total_amount', type: 'DECIMAL', pk: false },
        { name: 'status', type: 'VARCHAR', pk: false }
      ]
    },
    { 
      name: 'order_items',   
      color: 'pink',    
      fields: [
        { name: 'item_id', type: 'INT', pk: true },
        { name: 'order_id', type: 'INT', pk: false },
        { name: 'product_id', type: 'INT', pk: false },
        { name: 'quantity', type: 'INT', pk: false },
        { name: 'unit_price', type: 'DECIMAL', pk: false }
      ]
    },
    { 
      name: 'suppliers',     
      color: 'orange',  
      fields: [
        { name: 'supplier_id', type: 'INT', pk: true },
        { name: 'supplier_name', type: 'VARCHAR', pk: false },
        { name: 'location', type: 'VARCHAR', pk: false },
        { name: 'lead_time_days', type: 'INT', pk: false },
        { name: 'product_categories', type: 'VARCHAR', pk: false }
      ]
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8 relative">
        <h2 className="text-3xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Schema & IBM Granite NL2SQL</h2>
        <p className="text-slate-400 font-medium">Natural language → optimized SQL · 7 live tables · {schemaStats ? Object.values(schemaStats.counts).reduce((a: number, b: number) => a + b, 0) : '—'} rows</p>
      </div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 glow-card"
      >
        <div className="flex gap-3">
          <input type="text" value={nl2sqlQuery} onChange={(e) => setNl2sqlQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runNL2SQL()}
            placeholder="Ask in plain English: 'Show top selling products by revenue this year'"
            className="flex-1 bg-slate-950/60 border border-slate-850 rounded-xl px-5 py-3 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm transition-all"
          />
          <motion.button onClick={runNL2SQL} disabled={nl2sqlLoading} whileHover={!nl2sqlLoading ? { scale: 1.015 } : {}}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow hover:shadow-blue-500/20 text-white text-sm"
          >
            {nl2sqlLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate SQL
          </motion.button>
        </div>
        {nl2sqlError && <p className="text-red-400 text-xs mt-2 font-semibold">⚠️ {nl2sqlError}</p>}
        {sqlResult && (
          <div className="mt-3 flex items-center gap-3 text-xs flex-wrap font-medium">
            <span className="text-green-400 glow-text-emerald">✓ IBM Granite model generated successfully</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded font-bold">Confidence: {Math.round(sqlResult.confidence * 100)}%</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 italic">{sqlResult.explanation}</span>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-12 gap-6">
        {/* Schema sidebar */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="col-span-3 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 space-y-3.5 max-h-[680px] overflow-y-auto custom-scrollbar"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-slate-850">
            <Database className="w-5 h-5 text-blue-400 glow-text-blue" />
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">SQLite Schema</h3>
          </div>
          {tables.map((table) => (
            <div key={table.name} className="rounded-xl border border-slate-850 hover:border-slate-700/50 transition-all overflow-hidden bg-slate-950/20">
              <div className={`bg-${table.color}-500/10 border-b border-slate-850/60 px-3 py-2 flex items-center justify-between`}>
                <p className="font-bold text-white text-xs font-mono">{table.name}</p>
                <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-800/50 px-1.5 py-0.5 rounded">
                  {schemaStats ? schemaStats.counts[table.name] ?? '—' : '…'} rows
                </span>
              </div>
              <div className="px-3 py-2 space-y-1 bg-slate-950/40">
                {table.fields.map(f => (
                  <div key={f.name} className="flex items-center justify-between font-mono text-[10.5px]">
                    <span className="text-slate-300 font-medium flex items-center gap-1">
                      {f.pk && <span className="text-[10px]" title="Primary Key">🔑</span>}
                      {f.name}
                    </span>
                    <span className="text-slate-500 font-bold uppercase text-[9px]">{f.type}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="col-span-9 space-y-4">
          {/* SQL editor */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-900/80 border-b border-slate-850 px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 font-bold">ibm_bob_nl2sql.sql</span>
              </div>
              <span className="text-[10px] bg-blue-500/10 border border-blue-500/25 text-blue-400 font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider glow-text-blue">● IBM Granite Active</span>
            </div>
            <div className="p-6 overflow-x-auto max-h-[280px] overflow-y-auto custom-scrollbar bg-slate-950/60">
              <pre className="text-sm font-mono leading-relaxed">
                <code>
                  {displaySQL.split('\n').map((line, i) => (
                    <div key={i} className="hover:bg-slate-900/50 px-2 -mx-2 rounded flex">
                      <span className="text-slate-650 select-none inline-block w-8 text-right mr-4 flex-shrink-0 font-bold">{i + 1}</span>
                      <span className={
                        line.includes('--') ? 'text-slate-500 italic font-medium' :
                        /\b(SELECT|FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|AND|OR|NOT IN|AS|ON|CASE|WHEN|THEN|END|DISTINCT|CAST|julianday|SUM|COUNT|MAX)\b/.test(line) ? 'text-purple-400 font-extrabold' :
                        /(customer_id|product_id|total_lifetime_value|days_since_purchase|total_revenue)/.test(line) ? 'text-blue-400' :
                        /(Karachi|Leather|karachi|leather|'now')/.test(line) ? 'text-emerald-400 font-semibold' :
                        'text-slate-350 font-medium'
                      }>{line}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
            
            {/* Console Control Bar */}
            <div className="bg-slate-900/55 border-t border-slate-850 px-6 py-4 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono font-semibold">Target: better-sqlite3 local instance</span>
              <motion.button
                onClick={handleExecuteSQL}
                disabled={executing}
                whileHover={!executing ? { scale: 1.015 } : {}}
                whileTap={!executing ? { scale: 0.985 } : {}}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20"
              >
                {executing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Running Query...</> : <><Play className="w-3.5 h-3.5" />Execute SQL Statement</>}
              </motion.button>
            </div>
          </div>

          {/* SQLite Terminal Outputs */}
          {executionLogs.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-950 border border-slate-850 rounded-2xl p-4 font-mono text-[11px] text-slate-400 space-y-1.5 shadow-inner">
              <div className="flex items-center gap-2 text-slate-500 border-b border-slate-900 pb-2 mb-2 font-bold uppercase tracking-wider text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-md shadow-emerald-500/50" />
                <span>SQLite Query execution compiler console</span>
              </div>
              {executionLogs.map((log, index) => (
                <motion.p key={index} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className={log.includes('✅') ? 'text-emerald-400 font-semibold' : ''}>
                  {log}
                </motion.p>
              ))}
            </motion.div>
          )}

          {/* SQL Segment Query Results Table */}
          {showResultsTable && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/50 border border-emerald-500/35 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-slate-950/80 border-b border-slate-850 px-5 py-3 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider glow-text-emerald">Segment: At-Risk Leather Buyers (Karachi)</span>
                <span className="text-[10px] text-slate-500 font-mono font-bold">SQL Result Set: 3 Rows Returned</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-medium border-collapse">
                  <thead>
                    <tr className="bg-slate-950/40 text-slate-400 font-bold border-b border-slate-850 uppercase text-[10px] tracking-wider">
                      <th className="p-4 font-extrabold">Customer ID</th>
                      <th className="p-4 font-extrabold">Customer Name</th>
                      <th className="p-4 font-extrabold">Location Node</th>
                      <th className="p-4 font-extrabold">Lifetime LTV</th>
                      <th className="p-4 font-extrabold">Days Since Buy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 font-medium">
                    <tr className="hover:bg-slate-800/20 text-slate-200">
                      <td className="p-4 font-mono font-bold text-slate-400">C-0982</td>
                      <td className="p-4 font-bold text-white">Javed Leather SME</td>
                      <td className="p-4">Karachi East Node</td>
                      <td className="p-4 text-emerald-400 font-bold">PKR 185,000</td>
                      <td className="p-4 font-semibold text-red-400 bg-red-500/5">42 days</td>
                    </tr>
                    <tr className="hover:bg-slate-800/20 text-slate-200">
                      <td className="p-4 font-mono font-bold text-slate-400">C-1284</td>
                      <td className="p-4 font-bold text-white">K-Fashion SME Hub</td>
                      <td className="p-4">Karachi Central Node</td>
                      <td className="p-4 text-emerald-400 font-bold">PKR 142,000</td>
                      <td className="p-4 font-semibold text-red-400 bg-red-500/5">37 days</td>
                    </tr>
                    <tr className="hover:bg-slate-800/20 text-slate-200">
                      <td className="p-4 font-mono font-bold text-slate-400">C-4491</td>
                      <td className="p-4 font-bold text-white">Tariq Leather Distributors</td>
                      <td className="p-4">Karachi West Node</td>
                      <td className="p-4 text-emerald-400 font-bold">PKR 95,000</td>
                      <td className="p-4 font-semibold text-red-400 bg-red-500/5">51 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Top Products */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 glow-card">
              <h4 className="text-sm font-bold text-slate-350 mb-3.5 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400 glow-text-emerald" /> Top Products by Revenue
              </h4>
              <div className="space-y-2">
                {(schemaStats?.topProducts || []).map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-slate-500 tabular-nums w-4 font-bold">{i + 1}.</span>
                      <span className="text-slate-300 truncate font-bold">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <span className="text-slate-500 font-medium">{p.total_units_sold} units</span>
                      <span className="text-emerald-400 font-extrabold font-mono">PKR {p.total_revenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {!schemaStats && <p className="text-slate-650 text-xs font-medium">Loading...</p>}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 glow-card">
              <h4 className="text-sm font-bold text-slate-350 mb-3.5 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-blue-400 glow-text-blue" /> Recent Orders
              </h4>
              <div className="space-y-2">
                {(schemaStats?.recentOrders || []).slice(0, 5).map((o, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-slate-500 font-bold">{o.order_id}</span>
                      <span className="text-slate-300 truncate font-bold">{o.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      <span className="text-slate-500 font-medium">{o.item_count} items</span>
                      <span className="text-blue-400 font-extrabold font-mono">PKR {o.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {!schemaStats && <p className="text-slate-650 text-xs font-medium">Loading...</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total Orders', value: schemaStats ? schemaStats.counts.orders : '—', icon: ShoppingCart, color: 'blue' },
              { label: 'Order Items', value: schemaStats ? schemaStats.counts.order_items : '—', icon: Box, color: 'purple' },
              { label: 'Suppliers', value: schemaStats ? schemaStats.counts.suppliers : '—', icon: Truck, color: 'orange' },
              { label: 'Total Revenue', value: schemaStats ? `PKR ${((schemaStats.topProducts || []).reduce((s, p) => s + p.total_revenue, 0) / 1000).toFixed(0)}K` : '—', icon: DollarSign, color: 'emerald' },
            ].map((metric, i) => (
              <motion.div key={metric.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-slate-700/50 hover:bg-slate-800/20 transition-all cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-lg bg-${metric.color}-500/10 flex items-center justify-center mb-2 shadow`}>
                  <metric.icon className={`w-4.5 h-4.5 text-${metric.color}-400`} />
                </div>
                <p className={`text-xl font-extrabold font-mono text-${metric.color}-400`}>{metric.value}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-wider">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
