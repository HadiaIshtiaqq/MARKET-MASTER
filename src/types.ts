export type View = 'dashboard' | 'inventory' | 'sales' | 'marketing' | 'settings' | 'agent-builder';

export interface MetricCard {
  label: string;
  value: string;
  change?: string;
  icon: string;
  color: 'primary' | 'secondary' | 'tertiary';
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  uptime: string;
  currentTask: string;
  status: 'active' | 'idle' | 'warning';
  icon: string;
  color: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  velocity: string;
  status: 'optimized' | 'auto-reorder' | 'critical';
  image: string;
}

export interface SaleRegion {
  id: string;
  name: string;
  volume: string;
  active: boolean;
  coords: { x: number; y: number };
}
