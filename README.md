# 🚀 BrandPulse AI - Multi-Tenant B2B Social Commerce Platform

**Transform physical inventory into viral social media campaigns with AI-powered automation**

BrandPulse AI is a comprehensive multi-tenant platform that seamlessly orchestrates the journey from physical inventory ingestion to automated digital marketing. Vendors can onboard by selecting their industry niche, securely linking social media accounts, and leveraging cutting-edge AI to drive engagement and sales.

---

## 🌟 Key Features

### 📦 **Intelligent Inventory Management**

#### 1. **AI Tag Scanning**
- Upload product images
- AI automatically generates:
  - Descriptive tags for SEO
  - Product categories and subcategories
  - Compelling descriptions
  - Pricing suggestions
  - Target audience insights

#### 2. **IBM Bob Vision-to-Code**
- Snap photos of physical documents:
  - Delivery challans
  - Handwritten inventory sheets
  - Stock receipts
- AI extracts data and generates SQL INSERT statements
- Instant database updates
- Supports handwritten and printed text

### 📊 **Trend Analytics Engine**

- **Competitor Monitoring**: Continuously scrapes benchmark competitor profiles
- **Viral Pattern Detection**: Identifies what content drives engagement
- **Metadata Analysis**: Reverse-engineers:
  - Caption structures
  - Hashtag strategies
  - Visual styles
  - Posting times
- **Market Intelligence**: Real-time insights into industry trends

### 🎨 **AI Content Generation**

- **Brand Voice Profiles**: Define unique tone, style, and personality
- **Trend Integration**: Automatically incorporates viral patterns
- **Multi-Platform Optimization**: Tailored content for:
  - Instagram
  - Facebook
  - Twitter/X
  - TikTok
  - LinkedIn
- **A/B Testing**: Generate multiple variations
- **Smart Hashtags**: Mix of trending, niche, and branded tags

### 🤖 **Automated Social Media Posting**

- **Smart Scheduling**: Posts at optimal engagement times
- **Multi-Platform Publishing**: One-click posting to all connected accounts
- **Human-in-the-Loop**: Optional approval workflow
- **Engagement Tracking**: Real-time performance metrics
- **Auto-Optimization**: Learns from post performance

### 🔄 **n8n Workflow Automation**

- Pre-built workflows for:
  - Inventory synchronization
  - Daily trend analysis
  - Content generation pipelines
  - Engagement tracking
  - Stock alerts and reordering
- Custom workflow builder
- Webhook integrations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BRANDPULSE AI PLATFORM                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Frontend   │  │   Backend    │  │   Database   │      │
│  │  React + TS  │◄─┤  Express API │◄─┤  PostgreSQL  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                            │                                  │
│  ┌─────────────────────────┴──────────────────────────┐     │
│  │              AI SERVICES LAYER                      │     │
│  ├─────────────────────────────────────────────────────┤     │
│  │  • IBM Bob (Vision-to-Code)                         │     │
│  │  • AI Tag Scanner                                   │     │
│  │  • Trend Analytics Engine                           │     │
│  │  • Content Generation                               │     │
│  │  • Social Media Posting                             │     │
│  └─────────────────────────────────────────────────────┘     │
│                            │                                  │
│  ┌─────────────────────────┴──────────────────────────┐     │
│  │           INTEGRATION LAYER                         │     │
│  ├─────────────────────────────────────────────────────┤     │
│  │  • n8n Workflows                                    │     │
│  │  • Social Media APIs (Instagram, Facebook, etc.)    │     │
│  │  • Gemini AI API                                    │     │
│  │  • Redis Queue (Bull)                               │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis (for job queues)
- n8n instance (optional but recommended)
- Social media API credentials

### Installation

#### 🪟 Windows Users
**See [WINDOWS-SETUP.md](WINDOWS-SETUP.md) for detailed Windows setup guide**

**Quick Start:**
1. Double-click `install-dependencies.bat` to install all dependencies
2. Copy `.env.example` to `.env` and configure
3. Copy `server\.env.example` to `server\.env` and configure
4. Double-click `start-dev.bat` to start servers

#### 🐧 Linux/Mac Users

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/brandpulse-ai.git
   cd brandpulse-ai
   ```

2. **Install dependencies:**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server && npm install && cd ..
   ```

3. **Set up the database:**
   ```bash
   # Create PostgreSQL database
   createdb brandpulse_ai

   # Run migrations
   psql brandpulse_ai < database/schema.sql
   ```

4. **Configure environment variables:**
   ```bash
   # Copy example env files
   cp .env.example .env
   cp server/.env.example server/.env

   # Edit .env files with your credentials
   ```

5. **Start the development servers:**
   ```bash
   # Terminal 1: Frontend
   npm run dev

   # Terminal 2: Backend
   cd server
   npm run dev
   ```

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Docs: http://localhost:3001/api-docs

---

## 📋 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Backend (server/.env)
```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/brandpulse_ai

# AI Services
GEMINI_API_KEY=your_gemini_api_key

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Social Media APIs
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# n8n
N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

---

## 🎯 Usage Guide

### 1. Vendor Onboarding

```typescript
// Register new vendor
POST /api/vendors/register
{
  "businessName": "Fashion Boutique",
  "industryNiche": "fashion",
  "email": "vendor@example.com",
  "password": "secure_password"
}
```

### 2. Connect Social Media Accounts

```typescript
// Initiate OAuth flow
GET /api/social-media/connect/instagram

// After OAuth callback
POST /api/social-media/accounts
{
  "platform": "instagram",
  "accountHandle": "@fashionboutique",
  "accessToken": "oauth_token",
  "autoPostEnabled": true,
  "humanApprovalRequired": true
}
```

### 3. Add Inventory via AI Tag Scan

```typescript
// Upload product image
POST /api/inventory/scan
{
  "imageBase64": "data:image/jpeg;base64,...",
  "tenantId": "uuid"
}

// Response includes auto-generated tags and metadata
{
  "success": true,
  "product": {
    "name": "Leather Handbag",
    "category": "Fashion",
    "tags": ["leather", "handbag", "luxury", "brown"],
    "description": "Premium leather handbag...",
    "suggestedPrice": 149.99
  }
}
```

### 4. Process Physical Documents with IBM Bob

```typescript
// Upload delivery challan photo
POST /api/inventory/vision-to-code
{
  "imageBase64": "data:image/jpeg;base64,...",
  "documentType": "challan",
  "tenantId": "uuid"
}

// Response includes SQL statements and extracted data
{
  "success": true,
  "sqlStatements": [
    "INSERT INTO products (...) VALUES (...);"
  ],
  "extractedData": [
    { "name": "Product 1", "quantity": 50, "sku": "SKU001" }
  ],
  "confidence": 0.95
}
```

### 5. Analyze Competitor Trends

```typescript
// Add competitor profile
POST /api/trends/competitors
{
  "platform": "instagram",
  "accountHandle": "@competitor",
  "industryNiche": "fashion"
}

// Run trend analysis
POST /api/trends/analyze
{
  "tenantId": "uuid",
  "industryNiche": "fashion"
}

// Get viral trends
GET /api/trends/viral?niche=fashion
```

### 6. Generate AI Content

```typescript
// Generate post for product
POST /api/content/generate
{
  "productId": "uuid",
  "platform": "instagram",
  "brandVoiceId": "uuid"
}

// Response includes AI-generated content
{
  "caption": "✨ New arrival alert! ...",
  "hashtags": ["fashion", "style", "trending"],
  "callToAction": "Shop now via link in bio!",
  "variations": ["Alt caption 1", "Alt caption 2"],
  "estimatedEngagement": "high"
}
```

### 7. Schedule and Publish Posts

```typescript
// Schedule post
POST /api/content/schedule
{
  "contentId": "uuid",
  "socialAccountId": "uuid",
  "scheduledTime": "2026-05-20T14:00:00Z"
}

// Approve post (if human approval required)
POST /api/content/approve/:postId
{
  "approvedBy": "user_uuid",
  "modifications": {
    "caption": "Updated caption..."
  }
}
```

---

## 🔧 API Documentation

Full API documentation available at: `/api-docs` (Swagger UI)

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new vendor
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

#### Inventory
- `GET /api/inventory/products` - List products
- `POST /api/inventory/products` - Add product
- `POST /api/inventory/scan` - AI Tag Scan
- `POST /api/inventory/vision-to-code` - IBM Bob processing

#### Trends
- `GET /api/trends/viral` - Get viral trends
- `POST /api/trends/analyze` - Run trend analysis
- `POST /api/trends/competitors` - Add competitor

#### Content
- `POST /api/content/generate` - Generate content
- `POST /api/content/schedule` - Schedule post
- `GET /api/content/pending` - Get pending approvals
- `POST /api/content/approve/:id` - Approve post

#### Social Media
- `GET /api/social-media/accounts` - List connected accounts
- `POST /api/social-media/connect/:platform` - Connect account
- `GET /api/social-media/analytics` - Get engagement metrics

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
cd server && npm test

# Run with coverage
npm test -- --coverage
```

---

## 📦 Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set up Redis cluster
- [ ] Configure CDN for media files
- [ ] Set up SSL certificates
- [ ] Configure rate limiting
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

Apache-2.0 License - see [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Documentation**: https://docs.brandpulse.ai
- **Community Forum**: https://community.brandpulse.ai
- **Email**: support@brandpulse.ai
- **GitHub Issues**: https://github.com/your-org/brandpulse-ai/issues

---

## 🙏 Acknowledgments

- Google Gemini AI for powerful AI capabilities
- n8n for workflow automation
- The open-source community

---

**Built with ❤️ by the BrandPulse AI Team**