const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ── IBM Bob Vision-to-Code ──────────────────────────────────────────────────

export async function ibmBobVisionToCode(file: File, documentType: 'challan' | 'inventory_sheet' = 'challan') {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('documentType', documentType);
  formData.append('tenantId', 'demo_tenant');

  const res = await fetch(`${BASE_URL}/api/ibm-bob/vision-to-code`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'IBM Bob Vision-to-Code failed');
  }
  return res.json();
}

// ── IBM Bob NL2SQL ──────────────────────────────────────────────────────────

export async function ibmBobNL2SQL(query: string) {
  return request<{
    success: boolean;
    sql: string;
    explanation: string;
    confidence: number;
    estimatedRows: number;
  }>('/api/ibm-bob/nl2sql', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

// ── IBM Bob Agentic Task ────────────────────────────────────────────────────

export async function ibmBobAgenticTask(task: string) {
  return request<{
    success: boolean;
    task: {
      id: string;
      description: string;
      status: string;
      result: string;
      toolCallsMade: string[];
      startedAt: string;
      completedAt: string;
    };
    messages: AgentMessage[];
  }>('/api/ibm-bob/agentic-task', {
    method: 'POST',
    body: JSON.stringify({ task }),
  });
}

// ── IBM Bob Coordinate ──────────────────────────────────────────────────────

export async function ibmBobCoordinate(scenario: 'sales_drop' | 'competitor_alert' | 'customer_churn' | 'low_stock') {
  return request<{ success: boolean; scenario: string; messages: AgentMessage[] }>(
    '/api/ibm-bob/coordinate',
    { method: 'POST', body: JSON.stringify({ scenario }) }
  );
}

// ── Agent Feed ──────────────────────────────────────────────────────────────

export interface AgentMessage {
  from: string;
  to: string;
  message: string;
  timestamp: string;
  type: 'coordination' | 'alert' | 'request' | 'tool_call' | 'tool_result';
}

export interface AgentStatus {
  name: string;
  status: string;
  last_action: string;
  thinking: string | null;
  icon: string;
  description: string;
  modelUsed?: string;
  pendingApprovals?: number;
  activeInsights?: number;
}

export async function getAgentFeed() {
  return request<{
    success: boolean;
    messages: AgentMessage[];
    tasks: Array<{ id: string; description: string; status: string; result?: string; toolCallsMade?: string[] }>;
    metrics: Record<string, unknown>;
    agents: AgentStatus[];
  }>('/api/ibm-bob/agent-feed');
}

// ── Data Agent: Document Extraction ────────────────────────────────────────

export async function extractFromDocument(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${BASE_URL}/api/agents/data/extract`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Document extraction failed');
  }
  return res.json();
}

// ── Inventory (real DB) ─────────────────────────────────────────────────────

export interface InventoryProduct {
  product_id: string;
  sku: string;
  name: string;
  category: string;
  stock_quantity: number;
  reorder_point: number;
  unit_price: number;
  units_sold_per_week: number;
  ingestion_method: string;
}

export interface VelocityProduct extends InventoryProduct {
  days_until_stockout: number;
}

export async function getInventory() {
  return request<{
    success: boolean;
    products: InventoryProduct[];
    lowStock: InventoryProduct[];
    velocity: VelocityProduct[];
    totalStock: number;
  }>('/api/ibm-bob/inventory');
}

// ── Customers (real DB) ─────────────────────────────────────────────────────

export interface DbCustomer {
  customer_id: string;
  customer_name: string;
  city: string;
  location: string;
  phone: string;
  purchase_frequency: number;
  total_lifetime_value: number;
  last_purchase_date: string;
  favorite_category: string;
  days_since_purchase: number;
}

export async function getAtRiskCustomers(days = 30) {
  return request<{
    success: boolean;
    atRisk: DbCustomer[];
    total: number;
    atRiskCount: number;
  }>(`/api/ibm-bob/customers?days=${days}`);
}

// ── Schema Stats ────────────────────────────────────────────────────────────

export async function getSchemaStats() {
  return request<{
    success: boolean;
    counts: Record<string, number>;
    topProducts: Array<{ name: string; category: string; unit_price: number; total_units_sold: number; total_revenue: number; order_count: number }>;
    suppliers: Array<{ supplier_id: string; supplier_name: string; location: string; contact_email: string; lead_time_days: number; product_categories: string }>;
    recentOrders: Array<{ order_id: string; order_date: string; total_amount: number; status: string; customer_name: string; city: string; item_count: number }>;
  }>('/api/ibm-bob/schema-stats');
}

// ── Health Check ────────────────────────────────────────────────────────────

export async function checkHealth() {
  return request<{ status: string; service: string; ibmGraniteModels: string[] }>('/health');
}
