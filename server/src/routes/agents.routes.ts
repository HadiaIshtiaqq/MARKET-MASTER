import { Router, Request, Response } from 'express';
import multer from 'multer';
import { dataAgent } from '../services/dataAgent.service';
import { growthAgent } from '../services/growthAgent.service';
import { marketAgent } from '../services/marketAgent.service';
import { orchestrator } from '../services/agentOrchestrator.service';
import { logger } from '../utils/logger';

const router = Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

/**
 * GET /api/agents/status
 * Get real-time status of all agents
 */
router.get('/status', (req: Request, res: Response) => {
  try {
    const statuses = orchestrator.getAllAgentStatuses();
    res.json({
      success: true,
      agents: statuses,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error getting agent status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get agent status'
    });
  }
});

/**
 * GET /api/agents/metrics
 * Get system-wide agent metrics
 */
router.get('/metrics', (req: Request, res: Response) => {
  try {
    const metrics = orchestrator.getSystemMetrics();
    res.json({
      success: true,
      metrics
    });
  } catch (error) {
    logger.error('Error getting metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get metrics'
    });
  }
});

/**
 * GET /api/agents/messages
 * Get inter-agent communication messages
 */
router.get('/messages', (req: Request, res: Response) => {
  try {
    const messages = orchestrator.getAgentMessages();
    res.json({
      success: true,
      messages
    });
  } catch (error) {
    logger.error('Error getting messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get messages'
    });
  }
});

/**
 * POST /api/agents/data/extract
 * Data Agent: Extract data from uploaded image
 */
router.post('/data/extract', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    const imageBase64 = req.file.buffer.toString('base64');
    const imageType = req.file.mimetype as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

    logger.info(`Data Agent: Processing image (${req.file.size} bytes)`);

    const result = await dataAgent.extractFromImage(imageBase64, imageType);

    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    logger.error('Data extraction error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Extraction failed'
    });
  }
});

/**
 * POST /api/agents/growth/analyze
 * Growth Agent: Run churn analysis
 */
router.post('/growth/analyze', async (req: Request, res: Response) => {
  try {
    const analysis = await growthAgent.runChurnAnalysis();
    
    res.json({
      success: true,
      analysis
    });

  } catch (error) {
    logger.error('Churn analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Churn analysis failed'
    });
  }
});

/**
 * GET /api/agents/growth/messages
 * Growth Agent: Get pending approval messages
 */
router.get('/growth/messages', (req: Request, res: Response) => {
  try {
    const messages = growthAgent.getPendingMessages();
    
    res.json({
      success: true,
      messages,
      count: messages.length
    });

  } catch (error) {
    logger.error('Error getting messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get messages'
    });
  }
});

/**
 * POST /api/agents/growth/approve/:messageId
 * Growth Agent: Approve a specific message
 */
router.post('/growth/approve/:messageId', (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const message = growthAgent.approveMessage(messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    res.json({
      success: true,
      message,
      status: 'approved'
    });

  } catch (error) {
    logger.error('Error approving message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve message'
    });
  }
});

/**
 * POST /api/agents/growth/approve-all
 * Growth Agent: Approve all pending messages
 */
router.post('/growth/approve-all', (req: Request, res: Response) => {
  try {
    const count = growthAgent.approveAllMessages();
    
    res.json({
      success: true,
      approvedCount: count,
      message: `Approved ${count} messages`
    });

  } catch (error) {
    logger.error('Error approving all messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve messages'
    });
  }
});

/**
 * POST /api/agents/market/analyze
 * Market Agent: Run market analysis
 */
router.post('/market/analyze', async (req: Request, res: Response) => {
  try {
    const analysis = await marketAgent.runMarketAnalysis();
    
    res.json({
      success: true,
      analysis
    });

  } catch (error) {
    logger.error('Market analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Market analysis failed'
    });
  }
});

/**
 * GET /api/agents/market/insights
 * Market Agent: Get market insights
 */
router.get('/market/insights', (req: Request, res: Response) => {
  try {
    const { severity } = req.query;
    const insights = marketAgent.getInsights(severity as any);
    
    res.json({
      success: true,
      insights,
      count: insights.length
    });

  } catch (error) {
    logger.error('Error getting insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get insights'
    });
  }
});

/**
 * POST /api/agents/coordinate
 * Trigger multi-agent coordination scenario
 */
router.post('/coordinate', async (req: Request, res: Response) => {
  try {
    const { scenario } = req.body;
    
    if (!['sales_drop', 'competitor_alert', 'customer_churn'].includes(scenario)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid scenario. Use: sales_drop, competitor_alert, or customer_churn'
      });
    }

    const result = await orchestrator.triggerAgentCoordination(scenario);
    
    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    logger.error('Coordination error:', error);
    res.status(500).json({
      success: false,
      error: 'Coordination failed'
    });
  }
});

/**
 * POST /api/agents/coordination/toggle
 * Enable/disable agent coordination
 */
router.post('/coordination/toggle', (req: Request, res: Response) => {
  try {
    const { enabled } = req.body;
    const result = orchestrator.toggleCoordination(enabled);
    
    res.json({
      success: true,
      ...result
    });

  } catch (error) {
    logger.error('Toggle coordination error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle coordination'
    });
  }
});

export default router;

// Made with Bob
