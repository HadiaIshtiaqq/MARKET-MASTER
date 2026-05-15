import React from 'react';
import { 
  Package, 
  MapPin, 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  AlertCircle, 
  Maximize2,
  MoreVertical,
  Maximize
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Inventory() {
  const stockItems = [
    {
      name: 'Leather Handbags',
      category: 'Accessories',
      stock: '412 Units',
      velocity: '+12% / wk',
      status: 'optimized',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=100&auto=format&fit=crop'
    },
    {
      name: 'Suede Wallets',
      category: 'Small Goods',
      stock: '18 Units',
      velocity: 'Stable',
      status: 'auto-reorder',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=100&auto=format&fit=crop'
    },
    {
      name: 'Travel Watches',
      category: 'Accessories',
      stock: '2 Units',
      velocity: '+45% / wk',
      status: 'critical',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=100&auto=format&fit=crop'
    }
  ];

  return (
    <div className="space-y-bento-gap max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Inventory Intelligence</h1>
        <p className="text-on-surface-variant">Real-time stock health and automated replenishment tracking.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-bento-gap">
        {/* Stock Health */}
        <div className="lg:col-span-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 flex flex-col justify-between min-h-[350px] relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-bold">Stock Health</h2>
            </div>
            <Maximize2 className="w-4 h-4 text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  className="text-surface-container-high" 
                  cx="88" cy="88" r="75" fill="transparent" stroke="currentColor" strokeWidth="14" 
                />
                <circle 
                  className="text-primary" 
                  cx="88" cy="88" r="75" fill="transparent" stroke="currentColor" strokeWidth="14" 
                  strokeDasharray="471" strokeDashoffset="117" strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-on-surface">75%</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Capacity</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-surface-container-high/50 border border-outline-variant/10">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Capacity</p>
              <p className="font-mono text-primary font-bold text-lg">12,450 Units</p>
            </div>
            <div className="p-4 rounded-xl bg-error/5 border border-error/20">
              <p className="text-[10px] font-bold text-error uppercase tracking-widest mb-1">High-Risk SKUs</p>
              <p className="font-mono text-error font-bold text-lg">24 Items</p>
            </div>
          </div>
        </div>

        {/* Locations Map */}
        <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant/30 rounded-2xl overflow-hidden flex flex-col min-h-[350px]">
          <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container/30">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">Warehouse Locations</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold tracking-widest uppercase">3 Active Hubs</span>
          </div>
          
          <div className="flex-1 relative bg-surface-container-highest/20 group">
            {/* Mock Map Image */}
            <img 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" 
              className="w-full h-full object-cover opacity-20 grayscale contrast-125"
              alt="Map"
            />
            {/* Floating Marker Points */}
            <div className="absolute inset-0">
               <div className="absolute top-1/4 left-1/3 group/marker cursor-pointer">
                  <div className="w-4 h-4 bg-secondary rounded-full ai-pulse"></div>
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-surface-container-highest p-2 rounded-lg border border-outline-variant/50 text-xs hidden group-hover/marker:block whitespace-nowrap shadow-xl">
                    <p className="font-bold">Islamabad Transit Hub</p>
                    <p className="text-[10px] text-secondary">Optimal Performance</p>
                  </div>
               </div>
               <div className="absolute top-1/2 left-2/3 group/marker cursor-pointer">
                  <div className="w-4 h-4 bg-secondary rounded-full ai-pulse"></div>
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-surface-container-highest p-2 rounded-lg border border-outline-variant/50 text-xs hidden group-hover/marker:block whitespace-nowrap shadow-xl">
                    <p className="font-bold">Lahore Central</p>
                    <p className="text-[10px] text-secondary">Processing Peak Volume</p>
                  </div>
               </div>
               <div className="absolute bottom-1/4 left-1/4 group/marker cursor-pointer">
                  <div className="w-4 h-4 bg-tertiary rounded-full ai-pulse"></div>
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-surface-container-highest p-2 rounded-lg border border-outline-variant/50 text-xs hidden group-hover/marker:block whitespace-nowrap shadow-xl">
                    <p className="font-bold">Karachi Port Hub</p>
                    <p className="text-[10px] text-tertiary">Inventory Anomaly Detected</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* SKU Explorer Table */}
        <div className="lg:col-span-12 bg-surface-container-low border border-outline-variant/30 rounded-2xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold">SKU Explorer</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-surface-container border border-outline-variant/30 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-surface-variant transition-colors">
                <Filter className="w-3 h-3" /> Filter
              </button>
              <button className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all">
                <Download className="w-3 h-3" /> Export Data
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/30 border-b border-outline-variant/20">
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Product Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Current Stock</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Velocity</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">AI Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {stockItems.map((item, i) => (
                  <tr key={i} className="hover:bg-surface-container transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-highest overflow-hidden border border-outline-variant/20">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-tight">{item.name}</p>
                          <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-mono text-sm font-bold ${
                        item.status === 'critical' ? 'text-error' : 
                        item.status === 'auto-reorder' ? 'text-tertiary' : 
                        'text-secondary'
                      }`}>{item.stock}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.velocity !== 'Stable' && <TrendingUp className="w-3 h-3 text-secondary" />}
                        <span className="text-xs font-mono">{item.velocity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${
                        item.status === 'optimized' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                        item.status === 'auto-reorder' ? 'bg-tertiary/10 text-tertiary border-tertiary/20' :
                        'bg-error/10 text-error border-error/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-surface-variant rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4 text-on-surface-variant" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
