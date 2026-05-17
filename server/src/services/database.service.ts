import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger';

const DB_PATH = path.join(process.cwd(), 'data', 'marketmaster.db');

export interface Product {
  product_id: string;
  tenant_id: string;
  sku: string;
  name: string;
  category: string;
  stock_quantity: number;
  reorder_point: number;
  unit_price: number;
  units_sold_per_week: number;
  ingestion_method: string;
  created_at: string;
}

export interface Customer {
  customer_id: string;
  customer_name: string;
  city: string;
  location: string;
  phone: string;
  purchase_frequency: number;
  total_lifetime_value: number;
  last_purchase_date: string;
  favorite_category: string;
  days_since_purchase?: number;
}

export interface Competitor {
  competitor_id: string;
  name: string;
  location: string;
  product_categories: string;
  price_min: number;
  price_max: number;
  last_updated: string;
}

class DatabaseService {
  private static instance: DatabaseService;
  private db!: Database.Database;

  private constructor() {
    this.initialize();
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) DatabaseService.instance = new DatabaseService();
    return DatabaseService.instance;
  }

  private initialize() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL');
    this.createSchema();
    this.seedIfEmpty();
    this.seedOrdersIfEmpty();
    logger.info(`[DB] SQLite initialized: ${DB_PATH}`);
  }

  private createSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        product_id    TEXT PRIMARY KEY,
        tenant_id     TEXT DEFAULT 'demo_tenant',
        sku           TEXT UNIQUE NOT NULL,
        name          TEXT NOT NULL,
        category      TEXT NOT NULL,
        stock_quantity  INTEGER DEFAULT 0,
        reorder_point   INTEGER DEFAULT 10,
        unit_price      REAL DEFAULT 0,
        units_sold_per_week REAL DEFAULT 0,
        ingestion_method TEXT DEFAULT 'manual',
        created_at    TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS customers (
        customer_id           TEXT PRIMARY KEY,
        customer_name         TEXT NOT NULL,
        city                  TEXT NOT NULL,
        location              TEXT NOT NULL,
        phone                 TEXT,
        purchase_frequency    INTEGER DEFAULT 0,
        total_lifetime_value  REAL DEFAULT 0,
        last_purchase_date    TEXT,
        favorite_category     TEXT,
        created_at            TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS competitors (
        competitor_id      TEXT PRIMARY KEY,
        name               TEXT NOT NULL,
        location           TEXT NOT NULL,
        product_categories TEXT NOT NULL,
        price_min          REAL DEFAULT 0,
        price_max          REAL DEFAULT 0,
        last_updated       TEXT DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS orders (
        order_id      TEXT PRIMARY KEY,
        customer_id   TEXT NOT NULL,
        order_date    TEXT NOT NULL,
        total_amount  REAL DEFAULT 0,
        status        TEXT DEFAULT 'completed',
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      );

      CREATE TABLE IF NOT EXISTS order_items (
        item_id     TEXT PRIMARY KEY,
        order_id    TEXT NOT NULL,
        product_id  TEXT NOT NULL,
        quantity    INTEGER DEFAULT 1,
        unit_price  REAL DEFAULT 0,
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
      );

      CREATE TABLE IF NOT EXISTS suppliers (
        supplier_id    TEXT PRIMARY KEY,
        supplier_name  TEXT NOT NULL,
        location       TEXT NOT NULL,
        contact_email  TEXT,
        lead_time_days INTEGER DEFAULT 7,
        product_categories TEXT
      );

      CREATE TABLE IF NOT EXISTS agent_messages (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        from_agent  TEXT NOT NULL,
        to_agent    TEXT NOT NULL,
        message     TEXT NOT NULL,
        msg_type    TEXT NOT NULL,
        created_at  TEXT DEFAULT (datetime('now'))
      );
    `);
  }

  private seedIfEmpty() {
    const count = (this.db.prepare('SELECT COUNT(*) as n FROM products').get() as any).n;
    if (count > 0) return;

    const today = new Date();
    const daysAgo = (n: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() - n);
      return d.toISOString().split('T')[0];
    };

    const insertProducts = this.db.transaction(() => {
      const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO products (product_id, sku, name, category, stock_quantity, reorder_point, unit_price, units_sold_per_week)
        VALUES (@product_id, @sku, @name, @category, @stock_quantity, @reorder_point, @unit_price, @units_sold_per_week)
      `);
      [
        { product_id: 'prod_001', sku: 'LEA-001', name: 'Premium Leather Handbag',   category: 'Leather Goods', stock_quantity: 12, reorder_point: 20, unit_price: 8500,  units_sold_per_week: 8.2  },
        { product_id: 'prod_002', sku: 'LEA-002', name: 'Designer Belt',              category: 'Accessories',   stock_quantity: 3,  reorder_point: 15, unit_price: 3200,  units_sold_per_week: 5.8  },
        { product_id: 'prod_003', sku: 'LEA-003', name: 'Leather Wallet',             category: 'Leather Goods', stock_quantity: 8,  reorder_point: 25, unit_price: 2800,  units_sold_per_week: 12.1 },
        { product_id: 'prod_004', sku: 'LEA-004', name: 'Canvas Tote Bag',            category: 'Bags',          stock_quantity: 45, reorder_point: 15, unit_price: 4500,  units_sold_per_week: 4.3  },
        { product_id: 'prod_005', sku: 'LEA-005', name: 'Silk Scarf',                 category: 'Accessories',   stock_quantity: 67, reorder_point: 10, unit_price: 1800,  units_sold_per_week: 1.5  },
        { product_id: 'prod_006', sku: 'LEA-006', name: 'Ladies Clutch',              category: 'Bags',          stock_quantity: 23, reorder_point: 10, unit_price: 5200,  units_sold_per_week: 3.2  },
        { product_id: 'prod_007', sku: 'LEA-007', name: 'Mens Leather Jacket',        category: 'Outerwear',     stock_quantity: 7,  reorder_point: 10, unit_price: 18000, units_sold_per_week: 2.1  },
        { product_id: 'prod_008', sku: 'LEA-008', name: 'Leather Card Holder',        category: 'Leather Goods', stock_quantity: 34, reorder_point: 20, unit_price: 1200,  units_sold_per_week: 6.5  },
        { product_id: 'prod_009', sku: 'LEA-009', name: 'Crossbody Bag',              category: 'Bags',          stock_quantity: 18, reorder_point: 15, unit_price: 6800,  units_sold_per_week: 3.8  },
        { product_id: 'prod_010', sku: 'LEA-010', name: 'Leather Keychain',           category: 'Accessories',   stock_quantity: 89, reorder_point: 30, unit_price: 650,   units_sold_per_week: 9.2  },
        { product_id: 'prod_011', sku: 'LEA-011', name: 'Suede Ankle Boots',          category: 'Footwear',      stock_quantity: 5,  reorder_point: 8,  unit_price: 12000, units_sold_per_week: 1.8  },
        { product_id: 'prod_012', sku: 'LEA-012', name: 'Business Briefcase',         category: 'Bags',          stock_quantity: 9,  reorder_point: 8,  unit_price: 15000, units_sold_per_week: 1.2  },
        { product_id: 'prod_013', sku: 'LEA-013', name: 'Travel Duffel Bag',          category: 'Bags',          stock_quantity: 4,  reorder_point: 10, unit_price: 9500,  units_sold_per_week: 2.5  },
        { product_id: 'prod_014', sku: 'LEA-014', name: 'Leather Driving Gloves',     category: 'Accessories',   stock_quantity: 28, reorder_point: 15, unit_price: 2200,  units_sold_per_week: 4.1  },
        { product_id: 'prod_015', sku: 'LEA-015', name: 'Woven Basket Bag',           category: 'Bags',          stock_quantity: 16, reorder_point: 12, unit_price: 3800,  units_sold_per_week: 2.8  },
      ].forEach(p => stmt.run(p));
    });

    const insertCustomers = this.db.transaction(() => {
      const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO customers (customer_id, customer_name, city, location, phone, purchase_frequency, total_lifetime_value, last_purchase_date, favorite_category)
        VALUES (@customer_id, @customer_name, @city, @location, @phone, @purchase_frequency, @total_lifetime_value, @last_purchase_date, @favorite_category)
      `);
      [
        { customer_id: 'cust_001', customer_name: 'Ahmed Khan',      city: 'Karachi',     location: 'Karachi, Sindh',        phone: '+92-300-1234567', purchase_frequency: 12, total_lifetime_value: 45000,  last_purchase_date: daysAgo(185), favorite_category: 'Leather Goods' },
        { customer_id: 'cust_002', customer_name: 'Fatima Ali',      city: 'Lahore',      location: 'Lahore, Punjab',        phone: '+92-321-2345678', purchase_frequency: 8,  total_lifetime_value: 32000,  last_purchase_date: daysAgo(45),  favorite_category: 'Bags' },
        { customer_id: 'cust_003', customer_name: 'Hassan Raza',     city: 'Islamabad',   location: 'Islamabad, Capital',    phone: '+92-333-3456789', purchase_frequency: 15, total_lifetime_value: 67000,  last_purchase_date: daysAgo(219), favorite_category: 'Accessories' },
        { customer_id: 'cust_004', customer_name: 'Ayesha Malik',    city: 'Karachi',     location: 'Karachi, Sindh',        phone: '+92-312-4567890', purchase_frequency: 6,  total_lifetime_value: 28000,  last_purchase_date: daysAgo(197), favorite_category: 'Accessories' },
        { customer_id: 'cust_005', customer_name: 'Bilal Ahmed',     city: 'Rawalpindi',  location: 'Rawalpindi, Punjab',    phone: '+92-345-5678901', purchase_frequency: 20, total_lifetime_value: 95000,  last_purchase_date: daysAgo(12),  favorite_category: 'Leather Goods' },
        { customer_id: 'cust_006', customer_name: 'Sara Qureshi',    city: 'Lahore',      location: 'Lahore, Punjab',        phone: '+92-300-6789012', purchase_frequency: 9,  total_lifetime_value: 38500,  last_purchase_date: daysAgo(156), favorite_category: 'Bags' },
        { customer_id: 'cust_007', customer_name: 'Omar Sheikh',     city: 'Karachi',     location: 'Karachi, Sindh',        phone: '+92-321-7890123', purchase_frequency: 18, total_lifetime_value: 82000,  last_purchase_date: daysAgo(8),   favorite_category: 'Leather Goods' },
        { customer_id: 'cust_008', customer_name: 'Nadia Hussain',   city: 'Faisalabad',  location: 'Faisalabad, Punjab',    phone: '+92-333-8901234', purchase_frequency: 7,  total_lifetime_value: 24500,  last_purchase_date: daysAgo(78),  favorite_category: 'Bags' },
        { customer_id: 'cust_009', customer_name: 'Zubair Khan',     city: 'Multan',      location: 'Multan, Punjab',        phone: '+92-312-9012345', purchase_frequency: 4,  total_lifetime_value: 18000,  last_purchase_date: daysAgo(234), favorite_category: 'Accessories' },
        { customer_id: 'cust_010', customer_name: 'Hira Baig',       city: 'Karachi',     location: 'Karachi, Sindh',        phone: '+92-345-0123456', purchase_frequency: 11, total_lifetime_value: 51000,  last_purchase_date: daysAgo(31),  favorite_category: 'Bags' },
        { customer_id: 'cust_011', customer_name: 'Imran Siddiqui',  city: 'Islamabad',   location: 'Islamabad, Capital',    phone: '+92-300-1357900', purchase_frequency: 22, total_lifetime_value: 110000, last_purchase_date: daysAgo(5),   favorite_category: 'Leather Goods' },
        { customer_id: 'cust_012', customer_name: 'Sana Tariq',      city: 'Lahore',      location: 'Lahore, Punjab',        phone: '+92-321-2468011', purchase_frequency: 5,  total_lifetime_value: 22000,  last_purchase_date: daysAgo(167), favorite_category: 'Accessories' },
        { customer_id: 'cust_013', customer_name: 'Kamran Butt',     city: 'Lahore',      location: 'Lahore, Punjab',        phone: '+92-333-3579122', purchase_frequency: 10, total_lifetime_value: 43500,  last_purchase_date: daysAgo(88),  favorite_category: 'Bags' },
        { customer_id: 'cust_014', customer_name: 'Maria Farooq',    city: 'Karachi',     location: 'Karachi, Sindh',        phone: '+92-312-4680233', purchase_frequency: 14, total_lifetime_value: 62000,  last_purchase_date: daysAgo(22),  favorite_category: 'Bags' },
        { customer_id: 'cust_015', customer_name: 'Usman Ghani',     city: 'Peshawar',    location: 'Peshawar, KPK',         phone: '+92-345-5791344', purchase_frequency: 7,  total_lifetime_value: 31000,  last_purchase_date: daysAgo(145), favorite_category: 'Leather Goods' },
      ].forEach(c => stmt.run(c));
    });

    const insertCompetitors = this.db.transaction(() => {
      const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO competitors (competitor_id, name, location, product_categories, price_min, price_max)
        VALUES (@competitor_id, @name, @location, @product_categories, @price_min, @price_max)
      `);
      [
        { competitor_id: 'comp_001', name: 'Fashion Hub',     location: 'Karachi',   product_categories: 'Leather Goods, Wallets, Belts, Shoes',        price_min: 1500, price_max: 8000  },
        { competitor_id: 'comp_002', name: 'Style Bazaar',    location: 'Lahore',    product_categories: 'Handbags, Clutches, Jewelry, Scarves',         price_min: 2000, price_max: 12000 },
        { competitor_id: 'comp_003', name: 'Luxury Lane',     location: 'Karachi',   product_categories: 'Designer Bags, Premium Wallets, Watches',      price_min: 5000, price_max: 25000 },
        { competitor_id: 'comp_004', name: 'Budget Boutique', location: 'Islamabad', product_categories: 'Bags, Accessories, Footwear',                  price_min: 800,  price_max: 4000  },
        { competitor_id: 'comp_005', name: 'Trend Setters',   location: 'Karachi',   product_categories: 'Fashion Bags, Sunglasses, Belts, Accessories', price_min: 1800, price_max: 9000  },
      ].forEach(c => stmt.run(c));
    });

    insertProducts();
    insertCustomers();
    insertCompetitors();
    logger.info('[DB] Seeded: 15 products, 15 customers, 5 competitors');
  }

  private seedOrdersIfEmpty() {
    const count = (this.db.prepare('SELECT COUNT(*) as n FROM orders').get() as any).n;
    if (count > 0) return;

    const today = new Date();
    const daysAgo = (n: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() - n);
      return d.toISOString().split('T')[0];
    };

    const insertSuppliers = this.db.transaction(() => {
      const stmt = this.db.prepare(`
        INSERT OR IGNORE INTO suppliers (supplier_id, supplier_name, location, contact_email, lead_time_days, product_categories)
        VALUES (@supplier_id, @supplier_name, @location, @contact_email, @lead_time_days, @product_categories)
      `);
      [
        { supplier_id: 'sup_001', supplier_name: 'Premium Leather Goods Ltd.',  location: 'Lahore',     contact_email: 'orders@premiumleather.pk',  lead_time_days: 7,  product_categories: 'Leather Goods, Bags' },
        { supplier_id: 'sup_002', supplier_name: 'Karachi Accessories Co.',     location: 'Karachi',    contact_email: 'supply@kaccess.pk',         lead_time_days: 5,  product_categories: 'Accessories, Belts' },
        { supplier_id: 'sup_003', supplier_name: 'Punjab Textile Exports',      location: 'Faisalabad', contact_email: 'export@punjabtext.pk',      lead_time_days: 10, product_categories: 'Scarves, Canvas Bags' },
        { supplier_id: 'sup_004', supplier_name: 'National Footwear Factory',   location: 'Sialkot',    contact_email: 'orders@natfoot.pk',         lead_time_days: 14, product_categories: 'Footwear, Boots' },
        { supplier_id: 'sup_005', supplier_name: 'Islamabad Fashion Imports',   location: 'Islamabad',  contact_email: 'imports@isfashion.pk',      lead_time_days: 21, product_categories: 'Designer Bags, Outerwear' },
      ].forEach(s => stmt.run(s));
    });

    // 30 orders across the last 12 months, linked to real customers + products
    const orders = [
      { order_id: 'ORD-001', customer_id: 'cust_001', order_date: daysAgo(185), total_amount: 11700,  status: 'completed' },
      { order_id: 'ORD-002', customer_id: 'cust_001', order_date: daysAgo(120), total_amount: 8500,   status: 'completed' },
      { order_id: 'ORD-003', customer_id: 'cust_002', order_date: daysAgo(45),  total_amount: 7300,   status: 'completed' },
      { order_id: 'ORD-004', customer_id: 'cust_003', order_date: daysAgo(219), total_amount: 67000,  status: 'completed' },
      { order_id: 'ORD-005', customer_id: 'cust_003', order_date: daysAgo(160), total_amount: 22800,  status: 'completed' },
      { order_id: 'ORD-006', customer_id: 'cust_004', order_date: daysAgo(197), total_amount: 5200,   status: 'completed' },
      { order_id: 'ORD-007', customer_id: 'cust_004', order_date: daysAgo(100), total_amount: 9000,   status: 'completed' },
      { order_id: 'ORD-008', customer_id: 'cust_005', order_date: daysAgo(12),  total_amount: 28500,  status: 'completed' },
      { order_id: 'ORD-009', customer_id: 'cust_005', order_date: daysAgo(60),  total_amount: 17000,  status: 'completed' },
      { order_id: 'ORD-010', customer_id: 'cust_006', order_date: daysAgo(156), total_amount: 13600,  status: 'completed' },
      { order_id: 'ORD-011', customer_id: 'cust_007', order_date: daysAgo(8),   total_amount: 35000,  status: 'completed' },
      { order_id: 'ORD-012', customer_id: 'cust_007', order_date: daysAgo(45),  total_amount: 18500,  status: 'completed' },
      { order_id: 'ORD-013', customer_id: 'cust_008', order_date: daysAgo(78),  total_amount: 14300,  status: 'completed' },
      { order_id: 'ORD-014', customer_id: 'cust_009', order_date: daysAgo(234), total_amount: 9600,   status: 'completed' },
      { order_id: 'ORD-015', customer_id: 'cust_010', order_date: daysAgo(31),  total_amount: 22000,  status: 'completed' },
      { order_id: 'ORD-016', customer_id: 'cust_010', order_date: daysAgo(90),  total_amount: 17500,  status: 'completed' },
      { order_id: 'ORD-017', customer_id: 'cust_011', order_date: daysAgo(5),   total_amount: 55000,  status: 'completed' },
      { order_id: 'ORD-018', customer_id: 'cust_011', order_date: daysAgo(30),  total_amount: 36000,  status: 'completed' },
      { order_id: 'ORD-019', customer_id: 'cust_012', order_date: daysAgo(167), total_amount: 12400,  status: 'completed' },
      { order_id: 'ORD-020', customer_id: 'cust_013', order_date: daysAgo(88),  total_amount: 21750,  status: 'completed' },
      { order_id: 'ORD-021', customer_id: 'cust_014', order_date: daysAgo(22),  total_amount: 31000,  status: 'completed' },
      { order_id: 'ORD-022', customer_id: 'cust_014', order_date: daysAgo(75),  total_amount: 17000,  status: 'completed' },
      { order_id: 'ORD-023', customer_id: 'cust_015', order_date: daysAgo(145), total_amount: 26500,  status: 'completed' },
      { order_id: 'ORD-024', customer_id: 'cust_001', order_date: daysAgo(300), total_amount: 16000,  status: 'completed' },
      { order_id: 'ORD-025', customer_id: 'cust_005', order_date: daysAgo(200), total_amount: 45000,  status: 'completed' },
      { order_id: 'ORD-026', customer_id: 'cust_011', order_date: daysAgo(120), total_amount: 19000,  status: 'completed' },
      { order_id: 'ORD-027', customer_id: 'cust_007', order_date: daysAgo(180), total_amount: 28500,  status: 'completed' },
      { order_id: 'ORD-028', customer_id: 'cust_014', order_date: daysAgo(150), total_amount: 14000,  status: 'completed' },
      { order_id: 'ORD-029', customer_id: 'cust_003', order_date: daysAgo(90),  total_amount: 33000,  status: 'completed' },
      { order_id: 'ORD-030', customer_id: 'cust_002', order_date: daysAgo(15),  total_amount: 9500,   status: 'completed' },
    ];

    const orderItems = [
      { item_id: 'ITEM-001', order_id: 'ORD-001', product_id: 'prod_001', quantity: 1, unit_price: 8500  },
      { item_id: 'ITEM-002', order_id: 'ORD-001', product_id: 'prod_003', quantity: 1, unit_price: 2800  },
      { item_id: 'ITEM-003', order_id: 'ORD-001', product_id: 'prod_010', quantity: 1, unit_price: 400   },
      { item_id: 'ITEM-004', order_id: 'ORD-002', product_id: 'prod_001', quantity: 1, unit_price: 8500  },
      { item_id: 'ITEM-005', order_id: 'ORD-003', product_id: 'prod_004', quantity: 1, unit_price: 4500  },
      { item_id: 'ITEM-006', order_id: 'ORD-003', product_id: 'prod_009', quantity: 1, unit_price: 2800  },
      { item_id: 'ITEM-007', order_id: 'ORD-004', product_id: 'prod_007', quantity: 2, unit_price: 18000 },
      { item_id: 'ITEM-008', order_id: 'ORD-004', product_id: 'prod_012', quantity: 2, unit_price: 15000 },
      { item_id: 'ITEM-009', order_id: 'ORD-005', product_id: 'prod_001', quantity: 1, unit_price: 8500  },
      { item_id: 'ITEM-010', order_id: 'ORD-005', product_id: 'prod_002', quantity: 1, unit_price: 3200  },
      { item_id: 'ITEM-011', order_id: 'ORD-005', product_id: 'prod_014', quantity: 1, unit_price: 2200  },
      { item_id: 'ITEM-012', order_id: 'ORD-005', product_id: 'prod_003', quantity: 3, unit_price: 2800  },
      { item_id: 'ITEM-013', order_id: 'ORD-006', product_id: 'prod_006', quantity: 1, unit_price: 5200  },
      { item_id: 'ITEM-014', order_id: 'ORD-007', product_id: 'prod_005', quantity: 2, unit_price: 1800  },
      { item_id: 'ITEM-015', order_id: 'ORD-007', product_id: 'prod_014', quantity: 1, unit_price: 2200  },
      { item_id: 'ITEM-016', order_id: 'ORD-007', product_id: 'prod_002', quantity: 1, unit_price: 3200  },
      { item_id: 'ITEM-017', order_id: 'ORD-008', product_id: 'prod_007', quantity: 1, unit_price: 18000 },
      { item_id: 'ITEM-018', order_id: 'ORD-008', product_id: 'prod_001', quantity: 1, unit_price: 8500  },
      { item_id: 'ITEM-019', order_id: 'ORD-008', product_id: 'prod_012', quantity: 1, unit_price: 2000  },
      { item_id: 'ITEM-020', order_id: 'ORD-009', product_id: 'prod_013', quantity: 1, unit_price: 9500  },
      { item_id: 'ITEM-021', order_id: 'ORD-009', product_id: 'prod_001', quantity: 1, unit_price: 7500  },
      { item_id: 'ITEM-022', order_id: 'ORD-010', product_id: 'prod_004', quantity: 2, unit_price: 4500  },
      { item_id: 'ITEM-023', order_id: 'ORD-010', product_id: 'prod_009', quantity: 1, unit_price: 4600  },
      { item_id: 'ITEM-024', order_id: 'ORD-011', product_id: 'prod_007', quantity: 1, unit_price: 18000 },
      { item_id: 'ITEM-025', order_id: 'ORD-011', product_id: 'prod_001', quantity: 1, unit_price: 8500  },
      { item_id: 'ITEM-026', order_id: 'ORD-011', product_id: 'prod_012', quantity: 1, unit_price: 8500  },
      { item_id: 'ITEM-027', order_id: 'ORD-012', product_id: 'prod_009', quantity: 2, unit_price: 6800  },
      { item_id: 'ITEM-028', order_id: 'ORD-012', product_id: 'prod_006', quantity: 1, unit_price: 4900  },
      { item_id: 'ITEM-029', order_id: 'ORD-013', product_id: 'prod_004', quantity: 2, unit_price: 4500  },
      { item_id: 'ITEM-030', order_id: 'ORD-013', product_id: 'prod_009', quantity: 1, unit_price: 5300  },
      { item_id: 'ITEM-031', order_id: 'ORD-014', product_id: 'prod_002', quantity: 2, unit_price: 3200  },
      { item_id: 'ITEM-032', order_id: 'ORD-014', product_id: 'prod_005', quantity: 2, unit_price: 1600  },
      { item_id: 'ITEM-033', order_id: 'ORD-015', product_id: 'prod_001', quantity: 1, unit_price: 8500  },
      { item_id: 'ITEM-034', order_id: 'ORD-015', product_id: 'prod_007', quantity: 1, unit_price: 13500 },
      { item_id: 'ITEM-035', order_id: 'ORD-016', product_id: 'prod_006', quantity: 2, unit_price: 5200  },
      { item_id: 'ITEM-036', order_id: 'ORD-016', product_id: 'prod_013', quantity: 1, unit_price: 7100  },
      { item_id: 'ITEM-037', order_id: 'ORD-017', product_id: 'prod_007', quantity: 2, unit_price: 18000 },
      { item_id: 'ITEM-038', order_id: 'ORD-017', product_id: 'prod_012', quantity: 1, unit_price: 15000 },
      { item_id: 'ITEM-039', order_id: 'ORD-017', product_id: 'prod_001', quantity: 1, unit_price: 4000  },
      { item_id: 'ITEM-040', order_id: 'ORD-018', product_id: 'prod_007', quantity: 1, unit_price: 18000 },
      { item_id: 'ITEM-041', order_id: 'ORD-018', product_id: 'prod_001', quantity: 2, unit_price: 9000  },
      { item_id: 'ITEM-042', order_id: 'ORD-019', product_id: 'prod_005', quantity: 3, unit_price: 1800  },
      { item_id: 'ITEM-043', order_id: 'ORD-019', product_id: 'prod_002', quantity: 2, unit_price: 3200  },
      { item_id: 'ITEM-044', order_id: 'ORD-019', product_id: 'prod_010', quantity: 2, unit_price: 650   },
      { item_id: 'ITEM-045', order_id: 'ORD-020', product_id: 'prod_001', quantity: 1, unit_price: 8500  },
      { item_id: 'ITEM-046', order_id: 'ORD-020', product_id: 'prod_004', quantity: 1, unit_price: 4500  },
      { item_id: 'ITEM-047', order_id: 'ORD-020', product_id: 'prod_009', quantity: 1, unit_price: 6800  },
      { item_id: 'ITEM-048', order_id: 'ORD-020', product_id: 'prod_003', quantity: 1, unit_price: 1950  },
      { item_id: 'ITEM-049', order_id: 'ORD-021', product_id: 'prod_007', quantity: 1, unit_price: 18000 },
      { item_id: 'ITEM-050', order_id: 'ORD-021', product_id: 'prod_001', quantity: 1, unit_price: 8500  },
      { item_id: 'ITEM-051', order_id: 'ORD-021', product_id: 'prod_006', quantity: 1, unit_price: 4500  },
      { item_id: 'ITEM-052', order_id: 'ORD-022', product_id: 'prod_013', quantity: 1, unit_price: 9500  },
      { item_id: 'ITEM-053', order_id: 'ORD-022', product_id: 'prod_004', quantity: 2, unit_price: 3750  },
      { item_id: 'ITEM-054', order_id: 'ORD-023', product_id: 'prod_003', quantity: 3, unit_price: 2800  },
      { item_id: 'ITEM-055', order_id: 'ORD-023', product_id: 'prod_001', quantity: 2, unit_price: 8500  },
      { item_id: 'ITEM-056', order_id: 'ORD-023', product_id: 'prod_010', quantity: 1, unit_price: 700   },
      { item_id: 'ITEM-057', order_id: 'ORD-024', product_id: 'prod_008', quantity: 3, unit_price: 1200  },
      { item_id: 'ITEM-058', order_id: 'ORD-024', product_id: 'prod_003', quantity: 2, unit_price: 2800  },
      { item_id: 'ITEM-059', order_id: 'ORD-024', product_id: 'prod_002', quantity: 2, unit_price: 3200  },
      { item_id: 'ITEM-060', order_id: 'ORD-025', product_id: 'prod_007', quantity: 1, unit_price: 18000 },
      { item_id: 'ITEM-061', order_id: 'ORD-025', product_id: 'prod_012', quantity: 1, unit_price: 15000 },
      { item_id: 'ITEM-062', order_id: 'ORD-025', product_id: 'prod_001', quantity: 1, unit_price: 8500  },
      { item_id: 'ITEM-063', order_id: 'ORD-025', product_id: 'prod_011', quantity: 1, unit_price: 3500  },
      { item_id: 'ITEM-064', order_id: 'ORD-026', product_id: 'prod_009', quantity: 2, unit_price: 6800  },
      { item_id: 'ITEM-065', order_id: 'ORD-026', product_id: 'prod_006', quantity: 1, unit_price: 5400  },
      { item_id: 'ITEM-066', order_id: 'ORD-027', product_id: 'prod_007', quantity: 1, unit_price: 18000 },
      { item_id: 'ITEM-067', order_id: 'ORD-027', product_id: 'prod_001', quantity: 1, unit_price: 8500  },
      { item_id: 'ITEM-068', order_id: 'ORD-027', product_id: 'prod_002', quantity: 1, unit_price: 2000  },
      { item_id: 'ITEM-069', order_id: 'ORD-028', product_id: 'prod_009', quantity: 1, unit_price: 6800  },
      { item_id: 'ITEM-070', order_id: 'ORD-028', product_id: 'prod_004', quantity: 1, unit_price: 4500  },
      { item_id: 'ITEM-071', order_id: 'ORD-028', product_id: 'prod_005', quantity: 1, unit_price: 1800  },
      { item_id: 'ITEM-072', order_id: 'ORD-028', product_id: 'prod_010', quantity: 1, unit_price: 900   },
      { item_id: 'ITEM-073', order_id: 'ORD-029', product_id: 'prod_007', quantity: 1, unit_price: 18000 },
      { item_id: 'ITEM-074', order_id: 'ORD-029', product_id: 'prod_001', quantity: 1, unit_price: 8500  },
      { item_id: 'ITEM-075', order_id: 'ORD-029', product_id: 'prod_003', quantity: 2, unit_price: 3250  },
      { item_id: 'ITEM-076', order_id: 'ORD-030', product_id: 'prod_013', quantity: 1, unit_price: 9500  },
    ];

    const insertOrdersStmt = this.db.prepare(`
      INSERT OR IGNORE INTO orders (order_id, customer_id, order_date, total_amount, status)
      VALUES (@order_id, @customer_id, @order_date, @total_amount, @status)
    `);
    const insertItemsStmt = this.db.prepare(`
      INSERT OR IGNORE INTO order_items (item_id, order_id, product_id, quantity, unit_price)
      VALUES (@item_id, @order_id, @product_id, @quantity, @unit_price)
    `);

    const insertOrders = this.db.transaction(() => {
      insertSuppliers();
      orders.forEach(o => insertOrdersStmt.run(o));
      orderItems.forEach(i => insertItemsStmt.run(i));
    });

    insertOrders();
    logger.info('[DB] Seeded: 30 orders, 76 order items, 5 suppliers');
  }

  // ─── Products ─────────────────────────────────────────────────────────────────

  getInventory(category?: string): Product[] {
    if (category && category !== 'all') {
      return this.db.prepare('SELECT * FROM products WHERE category = ? ORDER BY stock_quantity ASC').all(category) as Product[];
    }
    return this.db.prepare('SELECT * FROM products ORDER BY stock_quantity ASC').all() as Product[];
  }

  getLowStockProducts(): Product[] {
    return this.db.prepare(
      'SELECT * FROM products WHERE stock_quantity <= reorder_point ORDER BY stock_quantity ASC'
    ).all() as Product[];
  }

  insertProduct(p: {
    product_id: string; tenant_id: string; sku: string; name: string;
    category: string; stock_quantity: number; reorder_point: number;
    unit_price: number; ingestion_method: string;
  }): void {
    this.db.prepare(`
      INSERT OR REPLACE INTO products (product_id, tenant_id, sku, name, category, stock_quantity, reorder_point, unit_price, ingestion_method)
      VALUES (@product_id, @tenant_id, @sku, @name, @category, @stock_quantity, @reorder_point, @unit_price, @ingestion_method)
    `).run(p);
  }

  getSalesVelocity(category?: string): any[] {
    const base = `
      SELECT name, category, stock_quantity, units_sold_per_week, reorder_point, unit_price,
             CASE WHEN units_sold_per_week > 0
                  THEN ROUND(CAST(stock_quantity AS REAL) / units_sold_per_week * 7, 0)
                  ELSE 999 END AS days_until_stockout
      FROM products WHERE units_sold_per_week > 0
    `;
    const rows = (category && category !== 'all')
      ? this.db.prepare(base + ' AND category = ? ORDER BY days_until_stockout ASC').all(category)
      : this.db.prepare(base + ' ORDER BY days_until_stockout ASC').all();
    return rows as any[];
  }

  // ─── Customers ────────────────────────────────────────────────────────────────

  getAllCustomers(): (Customer & { days_since_purchase: number })[] {
    return this.db.prepare(`
      SELECT *, CAST((julianday('now') - julianday(last_purchase_date)) AS INTEGER) AS days_since_purchase
      FROM customers ORDER BY last_purchase_date ASC
    `).all() as any[];
  }

  getAtRiskCustomers(daysThreshold = 30): (Customer & { days_since_purchase: number })[] {
    return this.db.prepare(`
      SELECT *, CAST((julianday('now') - julianday(last_purchase_date)) AS INTEGER) AS days_since_purchase
      FROM customers
      WHERE CAST((julianday('now') - julianday(last_purchase_date)) AS INTEGER) >= ?
      ORDER BY days_since_purchase DESC
    `).all(daysThreshold) as any[];
  }

  // ─── Competitors ──────────────────────────────────────────────────────────────

  getCompetitors(): Competitor[] {
    return this.db.prepare('SELECT * FROM competitors ORDER BY name').all() as Competitor[];
  }

  // ─── Orders ───────────────────────────────────────────────────────────────────

  getOrderSummary(): any[] {
    return this.db.prepare(`
      SELECT o.order_id, o.order_date, o.total_amount, o.status,
             c.customer_name, c.city,
             COUNT(oi.item_id) AS item_count
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      JOIN order_items oi ON o.order_id = oi.order_id
      GROUP BY o.order_id
      ORDER BY o.order_date DESC
    `).all();
  }

  getTopSellingProducts(limit = 10): any[] {
    return this.db.prepare(`
      SELECT p.name, p.category, p.unit_price,
             SUM(oi.quantity) AS total_units_sold,
             SUM(oi.quantity * oi.unit_price) AS total_revenue,
             COUNT(DISTINCT oi.order_id) AS order_count
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      GROUP BY p.product_id
      ORDER BY total_revenue DESC
      LIMIT ?
    `).all(limit);
  }

  getSuppliers(): any[] {
    return this.db.prepare('SELECT * FROM suppliers ORDER BY supplier_name').all();
  }

  getTableCounts(): Record<string, number> {
    return {
      products:      (this.db.prepare('SELECT COUNT(*) as n FROM products').get() as any).n,
      customers:     (this.db.prepare('SELECT COUNT(*) as n FROM customers').get() as any).n,
      orders:        (this.db.prepare('SELECT COUNT(*) as n FROM orders').get() as any).n,
      order_items:   (this.db.prepare('SELECT COUNT(*) as n FROM order_items').get() as any).n,
      suppliers:     (this.db.prepare('SELECT COUNT(*) as n FROM suppliers').get() as any).n,
      competitors:   (this.db.prepare('SELECT COUNT(*) as n FROM competitors').get() as any).n,
      agent_messages:(this.db.prepare('SELECT COUNT(*) as n FROM agent_messages').get() as any).n,
    };
  }

  // ─── Agent Messages ───────────────────────────────────────────────────────────

  saveAgentMessage(msg: { from_agent: string; to_agent: string; message: string; msg_type: string }): void {
    this.db.prepare(
      'INSERT INTO agent_messages (from_agent, to_agent, message, msg_type) VALUES (@from_agent, @to_agent, @message, @msg_type)'
    ).run(msg);
  }

  getRecentAgentMessages(limit = 50): any[] {
    return (this.db.prepare(
      'SELECT * FROM agent_messages ORDER BY created_at DESC LIMIT ?'
    ).all(limit) as any[]).reverse();
  }
}

export const db = DatabaseService.getInstance();
