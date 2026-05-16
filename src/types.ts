export type View = 'dashboard' | 'inventory' | 'sales' | 'marketing' | 'settings' | 'agent-builder';

export type MarketMasterTab = 'command-center' | 'execution-core' | 'schema-optimizer';

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

export interface UploadState {
  isProcessing: boolean;
  progress: number;
  isComplete: boolean;
}

export interface WorkflowNode {
  id: string;
  label: string;
  status: 'active' | 'complete' | 'pending' | 'warning';
}

export interface CustomerProfile {
  id: string;
  name: string;
  location: string;
  lastPurchase: string;
  totalSpent: string;
  preferredCategory: string;
  sent: boolean;
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  item: string;
  eoq: number;
  unitMargin: string;
  expectedDelivery: string;
  status: 'draft' | 'transmitting' | 'dispatched';
}
