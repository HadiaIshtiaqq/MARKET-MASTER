
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Upload, TrendingUp, Package, Users, AlertTriangle,
  CheckCircle2, Loader2, Send, Database, Zap, ArrowRight,
  ShoppingCart, MessageSquare, FileText, Activity, BarChart3,
  MapPin, Clock, DollarSign, Box, Truck, Eye, Sparkles
} from 'lucide-react';
import type { MarketMasterTab, UploadState, WorkflowNode, CustomerProfile, PurchaseOrder } from '../types';

export default function MarketMasterApp() {
  const [currentTab, setCurrentTab] = useState<MarketMasterTab>('command-center');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Command Center States
  const [uploadState, setUploadState] = useState<UploadState>({
    isProcessing: false,
    progress: 0,
    isComplete: false
  });
  const [stockCount, setStockCount] = useState(247);

  // Execution Core States
  const [poState, setPOState] = useState<PurchaseOrder>({
    id: 'PO-2026-001',
    supplier: 'Premium Leather Goods Ltd.',
    item: 'Premium Leather Handbags',
    eoq: 150,
    unitMargin: '$45.00',
    expectedDelivery: 'June 15, 2026',
    status: 'draft'
  });

  const [customers, setCustomers] = useState<CustomerProfile[]>([
    {
      id: '1',
      name: 'Fatima Ahmed',
      location: 'Karachi - Clifton',
      lastPurchase: '45 days ago',
      totalSpent: '$2,450',
      preferredCategory: 'Leather Goods',
      sent: false
    },
    {
      id: '2',
      name: 'Hassan Ali',
      location: 'Karachi - DHA',
      lastPurchase: '52 days ago',
      totalSpent: '$3,120',
      preferredCategory: 'Premium Accessories',
      sent: false
    },
    {
      id: '3',
      name: 'Ayesha Khan',
      location: 'Karachi - Gulshan',
      lastPurchase: '38 days ago',
      totalSpent: '$1,890',
      preferredCategory: 'Handbags',
      sent: false
    },
    {
      id: '4',
      name: 'Zain Malik',
      location: 'Karachi - Saddar',
      lastPurchase: '61 days ago',
      totalSpent: '$2,780',
      preferredCategory: 'Leather Wallets',
      sent: false
    }
  ]);

  const [campaignSending, setCampaignSending] = useState(false);

  // Workflow States
  const reorderWorkflow: WorkflowNode[] = [
    { id: '1', label: 'Low Stock Detected', status: 'complete' },
    { id: '2', label: 'Calculating EOQ', status: 'complete' },
    { id: '3', label: 'PO Drafted', status: 'warning' }
  ];

  const retentionWorkflow: WorkflowNode[] = [
    { id: '1', label: 'Karachi Market Scan', status: 'complete' },
    { id: '2', label: '5 Churn Risks Found', status: 'complete' },
    { id: '3', label: 'Drafts Prepared', status: 'warning' }
  ];

  // File Upload Handler
  const handleFileUpload = () => {
    setUploadState({ isProcessing: true, progress: 0, isComplete: false });
    
    const interval = setInterval(() => {
      setUploadState(prev => {
        if (prev.progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadState({ isProcessing: false, progress: 100, isComplete: true });
            setStockCount(prev => prev + 12);
          }, 500);
          return { ...prev, progress: 100 };
        }
        return { ...prev, progress: prev.progress + 8 };
      });
    }, 120);
  };

  // PO Approval Handler
  const handlePOApproval = () => {
    setPOState(prev => ({ ...prev, status: 'transmitting' }));
    setTimeout(() => {
      setPOState(prev => ({ ...prev, status: 'dispatched' }));
    }, 1500);
  };

  // Campaign Blast Handler
  const handleCampaignBlast = () => {
    setCampaignSending(true);
    customers.forEach((_, index) => {
      setTimeout(() => {
        setCustomers(prev => 
          prev.map((c, i) => i === index ? { ...c, sent: true } : c)
        );
        if (index === customers.length - 1) {
          setTimeout(() => setCampaignSending(false), 300);
        }
      }, index * 400);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  MarketMaster AI
                </h1>
                <p className="text-xs text-slate-400">Enterprise B2B Intelligence Platform</p>
              </div>
            </div>

            <div className="flex gap-2">
              {[
                { id: 'command-center', label: 'Command Center', icon: Activity },
                { id: 'execution-core', label: 'Execution Core', icon: Zap },
                { id: 'schema-optimizer', label: 'Schema & AI Optimizer', icon: Database }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as MarketMasterTab)}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    currentTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-[1800px] mx-auto px-6 py-8"
        >
          {currentTab === 'command-center' && (
            <CommandCenter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              uploadState={uploadState}
              handleFileUpload={handleFileUpload}
              stockCount={stockCount}
              reorderWorkflow={reorderWorkflow}
              retentionWorkflow={retentionWorkflow}
            />
          )}

          {currentTab === 'execution-core' && (
            <ExecutionCore
              poState={poState}
              handlePOApproval={handlePOApproval}
              customers={customers}
              campaignSending={campaignSending}
              handleCampaignBlast={handleCampaignBlast}
            />
          )}

          {currentTab === 'schema-optimizer' && (
            <SchemaOptimizer />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// VIEW 1: COMMAND CENTER
// ============================================================================

interface CommandCenterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  uploadState: UploadState;
  handleFileUpload: () => void;
  stockCount: number;
  reorderWorkflow: WorkflowNode[];
  retentionWorkflow: WorkflowNode[];
}

function CommandCenter({
  searchQuery,
  setSearchQuery,
  uploadState,
  handleFileUpload,
  stockCount,
  reorderWorkflow,
  retentionWorkflow
}: CommandCenterProps) {
  return (
    <div className="space-y-6">
      {/* AI Search Bar */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl" />
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Search className="w-6 h-6 text-white" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask MarketMaster AI about inventory or customers... (e.g., 'Top customers in Karachi missing leather bags')"
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              Search
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 3-Column Bento Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Column 1: Analog to Digital Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-bold">Analog to Digital Upload</h3>
          </div>

          <div
            onClick={!uploadState.isProcessing && !uploadState.isComplete ? handleFileUpload : undefined}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              uploadState.isProcessing || uploadState.isComplete
                ? 'border-slate-700 bg-slate-800/30'
                : 'border-slate-600 bg-slate-800/50 hover:border-blue-500 hover:bg-slate-800 cursor-pointer'
            }`}
          >
            {!uploadState.isProcessing && !uploadState.isComplete && (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-slate-300 font-medium">Drop product photo here</p>
                <p className="text-sm text-slate-500">or click to upload</p>
              </div>
            )}

            {uploadState.isProcessing && (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 mx-auto text-blue-400 animate-spin" />
                <div>
                  <p className="text-blue-400 font-semibold mb-2">IBM Bob Vision-to-Code</p>
                  <p className="text-sm text-slate-400 mb-3">Generating SQL INSERT statements...</p>
                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadState.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-blue-400 font-bold mt-2">{uploadState.progress}%</p>
                </div>
              </div>
            )}

            {uploadState.isComplete && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-3"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-green-400 font-semibold">Upload Complete!</p>
                <p className="text-sm text-slate-400">12 new items added to inventory</p>
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-xs text-slate-500">Current Stock Count</p>
                  <p className="text-2xl font-bold text-white">{stockCount}</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Column 2: Active Agentic Workflows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Predictive Reorder Workflow */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-amber-400" />
              <h3 className="text-lg font-bold">Predictive Reorder</h3>
            </div>
            <div className="space-y-3">
              {reorderWorkflow.map((node, index) => (
                <div key={node.id} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    node.status === 'complete' ? 'bg-green-500' :
                    node.status === 'warning' ? 'bg-amber-500 animate-pulse' :
                    'bg-slate-600'
                  }`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      node.status === 'warning' ? 'text-amber-400' : 'text-slate-300'
                    }`}>
                      {node.label}
                      {node.status === 'warning' && (
                        <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                          Action Needed
                        </span>
                      )}
                    </p>
                  </div>
                  {index < reorderWorkflow.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Retention Engine Workflow */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold">Retention Engine</h3>
            </div>
            <div className="space-y-3">
              {retentionWorkflow.map((node, index) => (
                <div key={node.id} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    node.status === 'complete' ? 'bg-green-500' :
                    node.status === 'warning' ? 'bg-emerald-500 animate-pulse' :
                    'bg-slate-600'
                  }`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      node.status === 'warning' ? 'text-emerald-400' : 'text-slate-300'
                    }`}>
                      {node.label}
                      {node.status === 'warning' && (
                        <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                          Action Needed
                        </span>
                      )}
                    </p>
                  </div>
                  {index < retentionWorkflow.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Column 3: Analytics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Sales Velocity Chart */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-bold">Sales Velocity vs Lead Time</h3>
            </div>
            <div className="h-32 flex items-end gap-2">
              {[65, 78, 45, 89, 92, 67, 85, 95].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex-1 bg-gradient-to-t from-purple-600 to-blue-500 rounded-t"
                />
              ))}
            </div>
          </div>

          {/* Top Unmet Demand */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-bold">Top Unmet Demand by Location</h3>
            </div>
            <div className="space-y-3">
              {[
                { city: 'Karachi', demand: 'High', units: 450, color: 'red' },
                { city: 'Lahore', demand: 'Medium', units: 280, color: 'amber' },
                { city: 'Islamabad', demand: 'Medium', units: 195, color: 'amber' },
                { city: 'Faisalabad', demand: 'Low', units: 120, color: 'green' }
              ].map((location, i) => (
                <motion.div
                  key={location.city}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={`p-3 rounded-lg ${
                    i === 0 ? 'bg-red-500/10 border border-red-500/30' : 'bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{location.city}</p>
                      <p className="text-xs text-slate-400">{location.units} units needed</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      location.color === 'red' ? 'bg-red-500/20 text-red-400' :
                      location.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {location.demand}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// VIEW 2: EXECUTION CORE
// ============================================================================

interface ExecutionCoreProps {
  poState: PurchaseOrder;
  handlePOApproval: () => void;
  customers: CustomerProfile[];
  campaignSending: boolean;
  handleCampaignBlast: () => void;
}

function ExecutionCore({
  poState,
  handlePOApproval,
  customers,
  campaignSending,
  handleCampaignBlast
}: ExecutionCoreProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Execution Core</h2>
        <p className="text-slate-400">Simultaneous Supply-Side & Sales-Side Automation</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Panel: Supply-Side PO */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Supply-Side: Predictive Reorder</h3>
              <p className="text-sm text-slate-400">Automated Purchase Order Generation</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* PO Header */}
            <div className="border-b border-slate-700 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-amber-400">#{poState.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  poState.status === 'draft' ? 'bg-slate-700 text-slate-300' :
                  poState.status === 'transmitting' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {poState.status === 'draft' ? 'Draft' :
                   poState.status === 'transmitting' ? 'Transmitting...' :
                   'Dispatched'}
                </span>
              </div>
              <p className="text-sm text-slate-400">Purchase Order</p>
            </div>

            {/* PO Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Supplier</p>
                  <p className="font-semibold text-white">{poState.supplier}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Expected Delivery</p>
                  <p className="font-semibold text-white">{poState.expectedDelivery}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Box className="w-5 h-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="font-semibold text-white">{poState.item}</p>
                    <p className="text-xs text-slate-400">Item Description</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">EOQ</p>
                    <p className="text-lg font-bold text-amber-400">{poState.eoq}</p>
                    <p className="text-xs text-slate-400">units</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Unit Margin</p>
                    <p className="text-lg font-bold text-green-400">{poState.unitMargin}</p>
                    <p className="text-xs text-slate-400">per unit</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Total Value</p>
                    <p className="text-lg font-bold text-white">$6,750</p>
                    <p className="text-xs text-slate-400">estimated</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-400 mb-1">AI Recommendation</p>
                    <p className="text-xs text-slate-300">
                      Based on sales velocity analysis, current stock will deplete in 8 days. 
                      EOQ calculated for optimal reorder point with 15-day lead time buffer.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              onClick={handlePOApproval}
              disabled={poState.status !== 'draft'}
              whileHover={poState.status === 'draft' ? { scale: 1.02 } : {}}
              whileTap={poState.status === 'draft' ? { scale: 0.98 } : {}}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                poState.status === 'draft'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-lg hover:shadow-amber-500/50 text-white'
                  : poState.status === 'transmitting'
                  ? 'bg-blue-600 text-white'
                  : 'bg-green-600 text-white'
              }`}
            >
              {poState.status === 'draft' && (
                <>
                  <Send className="w-5 h-5" />
                  Approve & Transmit PO
                </>
              )}
              {poState.status === 'transmitting' && (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Transmitting via EDI...
                </>
              )}
              {poState.status === 'dispatched' && (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  ✓ PO Dispatched to Supplier
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Right Panel: Sales-Side Customer Outreach */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Sales-Side: Retention Engine</h3>
              <p className="text-sm text-slate-400">Personalized Customer Outreach</p>
            </div>
          </div>

          <div className="space-y-4 mb-6 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {customers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-slate-800/50 rounded-xl p-4 border transition-all ${
                  customer.sent
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{customer.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {customer.location}
                      </p>
                    </div>
                  </div>
                  {customer.sent && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div>
                    <p className="text-slate-500">Last Purchase</p>
                    <p className="text-slate-300 font-medium">{customer.lastPurchase}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Total Spent</p>
                    <p className="text-emerald-400 font-bold">{customer.totalSpent}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Prefers</p>
                    <p className="text-slate-300 font-medium truncate">{customer.preferredCategory}</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                  <div className="flex items-start gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400 font-semibold">Personalized Message</p>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Hi {customer.name.split(' ')[0]}, we noticed you love our {customer.preferredCategory.toLowerCase()}! 
                    Our latest premium leather stock just cleared customs. Here's an exclusive 15% restock discount 
                    just for you. Shop now! 🎁
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Campaign Action Button */}
          <motion.button
            onClick={handleCampaignBlast}
            disabled={campaignSending || customers.every(c => c.sent)}
            whileHover={!campaignSending && !customers.every(c => c.sent) ? { scale: 1.02 } : {}}
            whileTap={!campaignSending && !customers.every(c => c.sent) ? { scale: 0.98 } : {}}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
              customers.every(c => c.sent)
                ? 'bg-green-600 text-white'
                : campaignSending
                ? 'bg-blue-600 text-white'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:shadow-emerald-500/50 text-white'
            }`}
          >
            {customers.every(c => c.sent) ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                ✓ Campaign Sent Successfully
              </>
            ) : campaignSending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending Messages...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Approve & Blast Campaign
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// VIEW 3: SCHEMA & AI OPTIMIZER
// ============================================================================

function SchemaOptimizer() {
  const sqlQuery = `-- AI-Generated Query: Top Customers in Karachi Missing Leather Bags
-- Powered by IBM watsonx.ai NL2SQL Engine

SELECT 
    c.customer_id,
    c.customer_name,
    c.location,
    c.purchase_frequency,
    c.total_lifetime_value,
    COUNT(DISTINCT o.order_id) as total_orders,
    MAX(o.order_date) as last_purchase_date,
    DATEDIFF(CURRENT_DATE, MAX(o.order_date)) as days_since_purchase,
    SUM(oi.quantity * p.unit_price) as total_spent
FROM 
    customers c
    INNER JOIN orders o ON c.customer_id = o.customer_id
    INNER JOIN order_items oi ON o.order_id = oi.order_id
    INNER JOIN products p ON oi.product_id = p.product_id
WHERE 
    c.location LIKE '%Karachi%'
    AND c.customer_id NOT IN (
        SELECT DISTINCT o2.customer_id
        FROM orders o2
        INNER JOIN order_items oi2 ON o2.order_id = oi2.order_id
        INNER JOIN products p2 ON oi2.product_id = p2.product_id
        WHERE p2.category = 'Leather Bags'
        AND o2.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)
    )
    AND c.purchase_frequency >= 3
GROUP BY 
    c.customer_id, c.customer_name, c.location, 
    c.purchase_frequency, c.total_lifetime_value
HAVING 
    days_since_purchase > 30
ORDER BY 
    c.total_lifetime_value DESC,
    days_since_purchase DESC
LIMIT 50;`;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Schema & AI Optimizer</h2>
        <p className="text-slate-400">Visual Database Architecture & NL2SQL Intelligence</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar: Schema Tree */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-bold">Relational Schema</h3>
          </div>

          <div className="space-y-4">
            {/* Tenants */}
            <SchemaNode
              name="Tenants"
              icon={<Box className="w-4 h-4" />}
              color="purple"
              fields={['tenant_id', 'tenant_name', 'subscription_tier']}
            />

            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-blue-500" />
            </div>

            {/* Suppliers */}
            <SchemaNode
              name="Suppliers"
              icon={<Truck className="w-4 h-4" />}
              color="blue"
              fields={['supplier_id', 'supplier_name', 'lead_time_days', 'tenant_id']}
            />

            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-emerald-500" />
            </div>

            {/* Products */}
            <SchemaNode
              name="Products"
              icon={<Package className="w-4 h-4" />}
              color="emerald"
              fields={['product_id', 'product_name', 'category', 'inventory_level', 'supplier_id']}
              highlight
            />

            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-500 to-amber-500" />
            </div>

            {/* Orders */}
            <SchemaNode
              name="Orders"
              icon={<ShoppingCart className="w-4 h-4" />}
              color="amber"
              fields={['order_id', 'order_date', 'customer_id', 'sales_velocity']}
            />

            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-gradient-to-b from-amber-500 to-red-500" />
            </div>

            {/* Customers */}
            <SchemaNode
              name="Customers"
              icon={<Users className="w-4 h-4" />}
              color="red"
              fields={['customer_id', 'customer_name', 'location', 'purchase_frequency']}
              highlight
            />
          </div>
        </motion.div>

        {/* Main Section: SQL Code & Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-8 space-y-6"
        >
          {/* SQL Code Block */}
          <div className="bg-slate-950 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="bg-slate-900 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm font-mono text-slate-400">query_optimizer.sql</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-semibold">● IBM watsonx.ai</span>
              </div>
            </div>

            <div className="p-6 overflow-x-auto custom-scrollbar">
              <pre className="text-sm font-mono leading-relaxed">
                <code className="text-slate-300">
                  {sqlQuery.split('\n').map((line, i) => (
                    <div key={i} className="hover:bg-slate-800/50 px-2 -mx-2 rounded">
                      <span className="text-slate-600 select-none inline-block w-8 text-right mr-4">
                        {i + 1}
                      </span>
                      <span className={
                        line.includes('--') ? 'text-slate-500 italic' :
                        line.includes('SELECT') || line.includes('FROM') || line.includes('WHERE') || 
                        line.includes('INNER JOIN') || line.includes('GROUP BY') || line.includes('ORDER BY') || 
                        line.includes('HAVING') || line.includes('LIMIT') ? 'text-purple-400 font-semibold' :
                        line.includes('customer_id') || line.includes('order_id') || line.includes('product_id') ? 'text-blue-400' :
                        line.includes('Karachi') || line.includes('Leather Bags') ? 'text-emerald-400' :
                        'text-slate-300'
                      }>
                        {line}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Query Execution</p>
                  <p className="text-2xl font-bold text-green-400">12ms</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span>Optimized</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Optimizer</p>
                  <p className="text-2xl font-bold text-blue-400">IBM Bob</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
                <span>NL2SQL Active</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="text-2xl font-bold text-purple-400">Indexed</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-purple-400" />
                <span>Scaled & Ready</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// SCHEMA NODE COMPONENT
// ============================================================================

interface SchemaNodeProps {
  name: string;
  icon: React.ReactNode;
  color: 'purple' | 'blue' | 'emerald' | 'amber' | 'red';
  fields: string[];
  highlight?: boolean;
}

function SchemaNode({ name, icon, color, fields, highlight }: SchemaNodeProps) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600 border-purple-500/50',
    blue: 'from-blue-500 to-blue-600 border-blue-500/50',
    emerald: 'from-emerald-500 to-emerald-600 border-emerald-500/50',
    amber: 'from-amber-500 to-amber-600 border-amber-500/50',
    red: 'from-red-500 to-red-600 border-red-500/50'
  };

  const textColorClasses = {
    purple: 'text-purple-400',
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    red: 'text-red-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl border ${highlight ? 'ring-2 ring-offset-2 ring-offset-slate-900' : ''} ${
        highlight ? `ring-${color}-500/50` : ''
      }`}
    >
      <div className={`bg-gradient-to-r ${colorClasses[color]} p-3 rounded-t-xl border-b ${colorClasses[color]}`}>
        <div className="flex items-center gap-2 text-white">
          {icon}
          <span className="font-bold">{name}</span>
        </div>
      </div>
      <div className="bg-slate-800/50 p-3 rounded-b-xl space-y-1.5">
        {fields.map((field, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div className={`w-1.5 h-1.5 rounded-full ${textColorClasses[color].replace('text-', 'bg-')}`} />
            <span className="text-slate-300 font-mono">{field}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
