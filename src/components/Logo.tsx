import React from 'react';

export const MarketMasterLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1976D2', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0D47A1', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#66BB6A', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#388E3C', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* M Letter - Blue */}
      <path 
        d="M 30 140 L 30 60 L 60 90 L 90 60 L 90 140 L 75 140 L 75 90 L 60 105 L 45 90 L 45 140 Z" 
        fill="url(#blueGradient)"
      />
      
      {/* Growth Arrow - Green */}
      <path 
        d="M 110 120 L 130 100 L 150 110 L 170 90 L 170 60 L 185 75 L 200 60 L 200 50 L 180 70 L 170 60 L 170 80 L 150 100 L 130 90 L 110 110 Z" 
        fill="url(#greenGradient)"
      />
      
      {/* Bar Chart */}
      <rect x="115" y="130" width="10" height="15" fill="#66BB6A" rx="2" />
      <rect x="130" y="120" width="10" height="25" fill="#66BB6A" rx="2" />
      <rect x="145" y="110" width="10" height="35" fill="#66BB6A" rx="2" />
      <rect x="160" y="100" width="10" height="45" fill="#66BB6A" rx="2" />
      
      {/* Upward Arrow */}
      <path 
        d="M 175 85 L 185 75 L 195 85 L 190 85 L 190 100 L 180 100 L 180 85 Z" 
        fill="#66BB6A"
      />
    </svg>
  );
};

export const MarketMasterLogoFull: React.FC<{ className?: string }> = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <MarketMasterLogo className="w-10 h-10" />
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="text-xl font-black tracking-tight" style={{ color: '#1976D2' }}>MARKET</span>
          <span className="text-xl font-black tracking-tight" style={{ color: '#66BB6A' }}>MASTER</span>
        </div>
        <div className="flex items-center gap-2 -mt-1">
          <div className="h-0.5 flex-1" style={{ background: '#1976D2' }}></div>
          <span className="text-xs font-bold tracking-widest text-gray-600">APP</span>
          <div className="h-0.5 flex-1" style={{ background: '#66BB6A' }}></div>
        </div>
      </div>
    </div>
  );
};

// Made with Bob
