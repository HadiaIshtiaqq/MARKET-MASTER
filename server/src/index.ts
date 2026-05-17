import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import routes
import authRoutes from './routes/auth.routes';
import vendorRoutes from './routes/vendor.routes';
import inventoryRoutes from './routes/inventory.routes';
import socialMediaRoutes from './routes/socialMedia.routes';
import trendAnalyticsRoutes from './routes/trendAnalytics.routes';
import contentGenerationRoutes from './routes/contentGeneration.routes';
import agentsRoutes from './routes/agents.routes';
import workflowRoutes from './routes/workflow.routes';
import ibmBobRoutes from './routes/ibmBob.routes';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(rateLimiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'MarketMaster AI — Powered by IBM Granite',
    ibmGraniteModels: ['ibm/granite-3-8b-instruct', 'ibm/granite-3-2-8b-vision-instruct']
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/social-media', socialMediaRoutes);
app.use('/api/trends', trendAnalyticsRoutes);
app.use('/api/content', contentGenerationRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/ibm-bob', ibmBobRoutes);

// Error handling
app.use(errorHandler);

// Serve static assets in production
import path from 'path';
const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));

// Fallback to React index.html for all client-side routing
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 MarketMaster AI Server running on port ${PORT} — Powered by IBM Granite`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

// Made with Bob
