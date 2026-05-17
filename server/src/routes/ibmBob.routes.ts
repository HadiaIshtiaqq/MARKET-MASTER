import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ibmBob } from '../services/ibmBob.service';
import { orchestrator } from '../services/agentOrchestrator.service';
import { db } from '../services/database.service';
import { logger } from '../utils/logger';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

/**
 * POST /api/ibm-bob/vision-to-code
 * Upload a delivery challan or inventory sheet image.
 * IBM Granite Vision extracts items and returns SQL INSERT statements.
 */
router.post('/vision-to-code', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    const { tenantId = 'demo_tenant', documentType = 'challan' } = req.body;

    if (!['challan', 'inventory_sheet'].includes(documentType)) {
      return res.status(400).json({ success: false, error: 'documentType must be challan or inventory_sheet' });
    }

    logger.info(`IBM Bob Vision-to-Code: Processing ${documentType} (${req.file.size} bytes)`);

    const imageBase64 = req.file.buffer.toString('base64');
    const result = await ibmBob.processDocument(imageBase64, tenantId, documentType as any);

    // Store extracted items in the real database — completing the Vision-to-Code loop
    let storedCount = 0;
    if (result.success && result.extractedData.length > 0) {
      storedCount = await ibmBob.storeExtractedItems(result.extractedData, tenantId);
    }

    res.json({ success: true, modelUsed: result.modelUsed, extractedData: result.extractedData, sqlStatements: result.sqlStatements, confidence: result.confidence, processingTime: result.processingTime, thinking: result.thinking, storedInDatabase: storedCount });
  } catch (error: any) {
    logger.error('IBM Bob Vision-to-Code error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ibm-bob/nl2sql
 * Convert a natural language query to SQL using IBM Granite NL2SQL engine.
 */
router.post('/nl2sql', async (req: Request, res: Response) => {
  try {
    const { query, schema } = req.body;

    if (!query?.trim()) {
      return res.status(400).json({ success: false, error: 'query is required' });
    }

    logger.info(`IBM Bob NL2SQL: Processing query "${query}"`);

    const result = await ibmBob.naturalLanguageToSQL(query, schema);

    res.json({ success: true, query, ...result });
  } catch (error: any) {
    logger.error('IBM Bob NL2SQL error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ibm-bob/agentic-task
 * Run a full agentic task: IBM Granite orchestrates agents with tool-calling
 * to solve a complex business problem autonomously.
 */
router.post('/agentic-task', async (req: Request, res: Response) => {
  try {
    const { task } = req.body;

    if (!task?.trim()) {
      return res.status(400).json({ success: false, error: 'task description is required' });
    }

    logger.info(`IBM Bob Agentic Task: "${task}"`);

    const result = await orchestrator.runAgenticTask(task);

    res.json({ success: true, task: result, messages: orchestrator.getAgentMessages().slice(-10) });
  } catch (error: any) {
    logger.error('IBM Bob Agentic Task error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ibm-bob/coordinate
 * Trigger a pre-defined multi-agent coordination scenario.
 */
router.post('/coordinate', async (req: Request, res: Response) => {
  try {
    const { scenario } = req.body;
    const valid = ['sales_drop', 'competitor_alert', 'customer_churn', 'low_stock'];

    if (!valid.includes(scenario)) {
      return res.status(400).json({ success: false, error: `scenario must be one of: ${valid.join(', ')}` });
    }

    const result = await orchestrator.triggerAgentCoordination(scenario);
    res.json({ success: true, ...result });
  } catch (error: any) {
    logger.error('IBM Bob Coordinate error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ibm-bob/agent-feed
 * Get live inter-agent communication messages and active tasks.
 */
router.get('/agent-feed', (_req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      messages: orchestrator.getAgentMessages(),
      tasks: orchestrator.getActiveTasks(),
      metrics: orchestrator.getSystemMetrics(),
      agents: orchestrator.getAllAgentStatuses(),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ibm-bob/inventory
 * Returns all products, low-stock items, and sales velocity from the real database.
 */
router.get('/inventory', (_req: Request, res: Response) => {
  try {
    const products = db.getInventory();
    const lowStock = db.getLowStockProducts();
    const velocity = db.getSalesVelocity();
    const totalStock = products.reduce((sum, p) => sum + p.stock_quantity, 0);
    res.json({ success: true, products, lowStock, velocity, totalStock });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ibm-bob/customers?days=30
 * Returns at-risk customers (haven't purchased in N days) from the real database.
 */
router.get('/customers', (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const atRisk = db.getAtRiskCustomers(days);
    const all = db.getAllCustomers();
    res.json({ success: true, atRisk, total: all.length, atRiskCount: atRisk.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ibm-bob/schema-stats
 * Returns row counts for all tables + top selling products.
 */
router.get('/schema-stats', (_req: Request, res: Response) => {
  try {
    const counts = db.getTableCounts();
    const topProducts = db.getTopSellingProducts(5);
    const suppliers = db.getSuppliers();
    const orders = db.getOrderSummary().slice(0, 10);
    res.json({ success: true, counts, topProducts, suppliers, recentOrders: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
