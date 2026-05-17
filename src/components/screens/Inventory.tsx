import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Truck,
  ShoppingCart,
  BarChart3,
  Sparkles,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Zap,
  DollarSign,
  Calendar,
  MapPin,
  Box,
  Layers,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertCircle,
  Image as ImageIcon,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockAlerts, setStockAlerts] = useState(12);
  const [uploadedImages, setUploadedImages] = useState<{[key: number]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File, index: number) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImages(prev => ({
            ...prev,
            [index + 1]: reader.result as string
          }));
        };
        reader.readAsDataURL(file);
      });
      alert(`${files.length} image(s) uploaded successfully! Images will appear on inventory items.`);
    }
  };

  const metrics = [
    { label: 'Total Items', value: '2,847', change: '+124', trend: 'up', icon: Package, color: 'primary' },
    { label: 'Total Value', value: '$847K', change: '+$42K', trend: 'up', icon: DollarSign, color: 'secondary' },
    { label: 'Low Stock Items', value: '23', change: '-5', trend: 'down', icon: AlertTriangle, color: 'tertiary' },
    { label: 'Out of Stock', value: '7', change: '-2', trend: 'down', icon: AlertCircle, color: 'error' },
  ];

  const inventoryItems = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      sku: 'WH-1000XM5',
      category: 'Electronics',
      stock: 145,
      minStock: 50,
      maxStock: 200,
      price: 349.99,
      value: 50748.55,
      location: 'Warehouse A',
      supplier: 'TechCorp',
      lastRestocked: '2026-05-10',
      status: 'healthy',
      trend: 'up',
      velocity: 'high'
    },
    {
      id: 2,
      name: 'Smart Watch Pro',
      sku: 'SW-PRO-2026',
      category: 'Electronics',
      stock: 32,
      minStock: 40,
      maxStock: 150,
      price: 299.99,
      value: 9599.68,
      location: 'Warehouse B',
      supplier: 'SmartTech',
      lastRestocked: '2026-05-08',
      status: 'low',
      trend: 'down',
      velocity: 'medium'
    },
    {
      id: 3,
      name: 'Ergonomic Office Chair',
      sku: 'OC-ERG-500',
      category: 'Furniture',
      stock: 0,
      minStock: 20,
      maxStock: 80,
      price: 449.99,
      value: 0,
      location: 'Warehouse C',
      supplier: 'FurniturePlus',
      lastRestocked: '2026-04-28',
      status: 'out',
      trend: 'down',
      velocity: 'low'
    },
    {
      id: 4,
      name: 'Laptop Stand Aluminum',
      sku: 'LS-ALU-100',
      category: 'Accessories',
      stock: 234,
      minStock: 100,
      maxStock: 300,
      price: 79.99,
      value: 18717.66,
      location: 'Warehouse A',
      supplier: 'AccessoryCo',
      lastRestocked: '2026-05-15',
      status: 'healthy',
      trend: 'up',
      velocity: 'high'
    },
    {
      id: 5,
      name: 'USB-C Hub 7-in-1',
      sku: 'HUB-7IN1',
      category: 'Accessories',
      stock: 18,
      minStock: 30,
      maxStock: 120,
      price: 49.99,
      value: 899.82,
      location: 'Warehouse B',
      supplier: 'TechCorp',
      lastRestocked: '2026-05-12',
      status: 'low',
      trend: 'down',
      velocity: 'medium'
    }
  ];

  const stockTrend = [
    { month: 'Jan', inStock: 2650, lowStock: 45, outOfStock: 12 },
    { month: 'Feb', inStock: 2720, lowStock: 38, outOfStock: 9 },
    { month: 'Mar', inStock: 2780, lowStock: 32, outOfStock: 8 },
    { month: 'Apr', inStock: 2810, lowStock: 28, outOfStock: 6 },
    { month: 'May', inStock: 2847, lowStock: 23, outOfStock: 7 }
  ];

  const categoryDistribution = [
    { name: 'Electronics', value: 1245, color: '#c0c1ff' },
    { name: 'Furniture', value: 456, color: '#4edea3' },
    { name: 'Accessories', value: 789, color: '#ffb95f' },
    { name: 'Office Supplies', value: 357, color: '#ff6b9d' }
  ];

  const aiPredictions = [
    {
      type: 'warning',
      title: 'Restock Alert: Smart Watch Pro',
      description: 'Predicted to run out in 5 days based on current velocity',
      action: 'Create Purchase Order',
      urgency: 'high'
    },
    {
      type: 'success',
      title: 'Optimal Stock Level Detected',
      description: 'Laptop Stand Aluminum maintaining ideal inventory levels',
      action: 'View Details',
      urgency: 'low'
    },
    {
      type: 'info',
      title: 'Seasonal Demand Forecast',
      description: 'Electronics category expected to increase 25% next month',
      action: 'Adjust Stock Levels',
      urgency: 'medium'
    }
  ];

  const recentActivity = [
    { id: 1, action: 'Stock Added', item: 'Laptop Stand Aluminum', quantity: 50, user: 'IBM Bob', time: '5 min ago', type: 'in' },
    { id: 2, action: 'Stock Removed', item: 'Premium Wireless Headphones', quantity: 12, user: 'Sales Scout', time: '12 min ago', type: 'out' },
    { id: 3, action: 'Low Stock Alert', item: 'Smart Watch Pro', quantity: 32, user: 'Stock Sentinel', time: '1 hour ago', type: 'alert' },
    { id: 4, action: 'Stock Added', item: 'USB-C Hub 7-in-1', quantity: 30, user: 'IBM Bob', time: '2 hours ago', type: 'in' },
    { id: 5, action: 'Inventory Audit', item: 'All Items', quantity: 2847, user: 'Stock Sentinel', time: '4 hours ago', type: 'audit' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'healthy': return 'text-secondary bg-secondary/10';
      case 'low': return 'text-tertiary bg-tertiary/10';
      case 'out': return 'text-error bg-error/10';
      default: return 'text-on-surface-variant bg-surface-container';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'healthy': return CheckCircle2;
      case 'low': return AlertTriangle;
      case 'out': return AlertCircle;
      default: return Package;
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
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-transparent">
            Inventory Intelligence
          </h1>
          <p className="text-on-surface-variant flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-tertiary animate-pulse" />
            AI-powered stock management and predictive analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-surface-container-high border border-outline-variant/30 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-surface-container-highest transition-all"
          >
            <Upload className="w-4 h-4" />
            Upload Images
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-surface-container-high border border-outline-variant/30 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-surface-container-highest transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary to-secondary text-on-primary px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Item
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
              className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 hover:border-primary/40 transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${m.color}/10`}>
                    <Icon className={`w-6 h-6 text-${m.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${m.trend === 'up' ? 'text-secondary' : 'text-tertiary'}`}>
                    {m.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
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

      {/* Stock Trend Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">Stock Level Trends</h2>
            <p className="text-xs text-on-surface-variant">5-month inventory overview</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-xs">In Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-tertiary" />
              <span className="text-xs">Low Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-error" />
              <span className="text-xs">Out of Stock</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stockTrend}>
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
            <Line type="monotone" dataKey="inStock" stroke="#4edea3" strokeWidth={3} dot={{ fill: '#4edea3', r: 4 }} />
            <Line type="monotone" dataKey="lowStock" stroke="#ffb95f" strokeWidth={3} dot={{ fill: '#ffb95f', r: 4 }} />
            <Line type="monotone" dataKey="outOfStock" stroke="#ff6b9d" strokeWidth={3} dot={{ fill: '#ff6b9d', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Inventory Items */}
        <div className="xl:col-span-2 space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
              <input 
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-surface-container-high border border-outline-variant/30 rounded-xl pl-11 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-12 px-6 bg-surface-container-high border border-outline-variant/30 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-surface-container-highest transition-all"
            >
              <Filter className="w-5 h-5" />
              Filter
            </motion.button>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {inventoryItems.map((item, i) => {
              const StatusIcon = getStatusIcon(item.status);
              const stockPercentage = (item.stock / item.maxStock) * 100;
              
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-surface-container-high/50 p-6 rounded-2xl border border-outline-variant/20 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 overflow-hidden">
                        {uploadedImages[item.id] ? (
                          <img
                            src={uploadedImages[item.id]}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold">{item.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {item.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-3">
                          <span className="font-mono">{item.sku}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.location}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Stock</p>
                            <p className="text-sm font-bold font-mono">{item.stock} / {item.maxStock}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Price</p>
                            <p className="text-sm font-bold font-mono">${item.price}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Value</p>
                            <p className="text-sm font-bold font-mono text-secondary">${item.value.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Velocity</p>
                            <p className={`text-sm font-bold uppercase ${
                              item.velocity === 'high' ? 'text-secondary' :
                              item.velocity === 'medium' ? 'text-tertiary' : 'text-on-surface-variant'
                            }`}>
                              {item.velocity}
                            </p>
                          </div>
                        </div>
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
                        className="p-2 hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-error" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Stock Level Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-on-surface-variant">Stock Level</span>
                      <span className="font-bold font-mono">{stockPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stockPercentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${
                          item.status === 'healthy' ? 'bg-secondary' :
                          item.status === 'low' ? 'bg-tertiary' : 'bg-error'
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
          >
            <h3 className="text-lg font-bold mb-6">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
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
              {categoryDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Predictions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30 relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold">AI Predictions</h3>
              </div>
              <div className="space-y-4">
                {aiPredictions.map((prediction, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/20"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-1.5 rounded-lg ${
                        prediction.type === 'success' ? 'bg-secondary/20' :
                        prediction.type === 'warning' ? 'bg-tertiary/20' : 'bg-primary/20'
                      }`}>
                        {prediction.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-secondary" />
                        ) : prediction.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-tertiary" />
                        ) : (
                          <Zap className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm mb-1">{prediction.title}</p>
                        <p className="text-xs text-on-surface-variant">{prediction.description}</p>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 px-3 bg-surface-container-highest rounded-lg text-xs font-bold hover:bg-primary hover:text-on-primary transition-all"
                    >
                      {prediction.action}
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
            transition={{ delay: 0.8 }}
            className="bg-surface-container p-6 rounded-2xl border border-outline-variant/30"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Recent Activity</h3>
              <Clock className="w-4 h-4 text-on-surface-variant" />
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              {recentActivity.map((activity, i) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-high transition-colors"
                >
                  <div className={`p-1.5 rounded-lg ${
                    activity.type === 'in' ? 'bg-secondary/20' :
                    activity.type === 'out' ? 'bg-primary/20' :
                    activity.type === 'alert' ? 'bg-tertiary/20' : 'bg-surface-container-highest'
                  }`}>
                    {activity.type === 'in' ? (
                      <ArrowUpRight className="w-4 h-4 text-secondary" />
                    ) : activity.type === 'out' ? (
                      <ArrowDownRight className="w-4 h-4 text-primary" />
                    ) : activity.type === 'alert' ? (
                      <AlertTriangle className="w-4 h-4 text-tertiary" />
                    ) : (
                      <RefreshCw className="w-4 h-4 text-on-surface-variant" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.action}</p>
                    <p className="text-xs text-on-surface-variant truncate">{activity.item}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-primary">{activity.user}</span>
                      <span className="text-xs text-on-surface-variant">•</span>
                      <span className="text-xs text-on-surface-variant">{activity.time}</span>
                    </div>
                  </div>
                  {activity.quantity && (
                    <div className="text-right">
                      <p className="text-xs text-on-surface-variant">Qty</p>
                      <p className="font-bold font-mono text-sm">{activity.quantity}</p>
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
