# BrandPulse AI - n8n Workflow Integration

This directory contains n8n workflow templates for automating various aspects of the BrandPulse AI platform.

## Overview

n8n is used to orchestrate complex automation workflows that connect:
- Inventory management systems
- AI services (IBM Bob, Tag Scanning, Trend Analysis)
- Social media platforms
- Content generation pipelines
- Notification systems

## Available Workflows

### 1. Inventory Sync Workflow
**File:** `inventory-sync-workflow.json`

**Trigger:** Webhook or Schedule (every 6 hours)

**Flow:**
1. Receive new inventory data (manual upload or API)
2. Process images through IBM Bob Vision-to-Code
3. Extract product data and generate SQL statements
4. Validate and insert into database
5. Trigger AI Tag Scanning for product categorization
6. Send confirmation notification

**Use Case:** Automatically digitize delivery challans and inventory sheets

---

### 2. Trend Analysis Workflow
**File:** `trend-analysis-workflow.json`

**Trigger:** Schedule (daily at 2:00 AM)

**Flow:**
1. Fetch competitor profiles from database
2. Scrape latest posts from social media platforms
3. Analyze engagement metrics
4. Run AI trend analysis
5. Store viral trends in database
6. Generate trend report
7. Notify vendors of new opportunities

**Use Case:** Daily monitoring of competitor content and market trends

---

### 3. Content Generation & Posting Workflow
**File:** `content-generation-workflow.json`

**Trigger:** New product added OR Schedule (weekly content calendar)

**Flow:**
1. Fetch new products without social media posts
2. Retrieve latest viral trends
3. Get brand voice profile
4. Generate AI content (caption, hashtags, CTA)
5. Create multiple variations
6. If Human-in-the-Loop enabled:
   - Send for approval via email/Slack
   - Wait for approval webhook
7. Schedule posts across platforms
8. Publish at optimal times
9. Track engagement metrics

**Use Case:** Automated content creation and posting pipeline

---

### 4. Engagement Tracking Workflow
**File:** `engagement-tracking-workflow.json`

**Trigger:** Schedule (every 4 hours)

**Flow:**
1. Fetch published posts from last 48 hours
2. Query social media APIs for engagement metrics
3. Update database with latest stats
4. Calculate ROI and performance scores
5. Generate performance reports
6. Send alerts for viral posts or underperforming content

**Use Case:** Real-time social media performance monitoring

---

### 5. Vendor Onboarding Workflow
**File:** `vendor-onboarding-workflow.json`

**Trigger:** New vendor registration

**Flow:**
1. Receive vendor registration data
2. Create tenant record in database
3. Set up brand voice profile
4. Connect social media accounts (OAuth flow)
5. Import initial inventory
6. Run AI analysis on existing products
7. Generate welcome email with setup guide
8. Schedule onboarding call

**Use Case:** Streamlined vendor onboarding process

---

### 6. Stock Alert & Reorder Workflow
**File:** `stock-alert-workflow.json`

**Trigger:** Inventory level change

**Flow:**
1. Monitor stock levels in real-time
2. Detect low stock items (below reorder level)
3. Calculate Economic Order Quantity (EOQ)
4. Generate purchase order draft
5. Notify procurement team
6. If auto-reorder enabled:
   - Send PO to supplier via email/API
   - Track delivery status
7. Update inventory upon delivery

**Use Case:** Automated inventory management and reordering

---

## Setup Instructions

### Prerequisites
1. n8n instance (self-hosted or cloud)
2. BrandPulse AI backend API running
3. Database connection configured
4. Social media API credentials

### Installation

1. **Import Workflows:**
   ```bash
   # In n8n UI, go to Workflows > Import from File
   # Select the JSON file from this directory
   ```

2. **Configure Credentials:**
   - Add database credentials (PostgreSQL)
   - Add API keys (Gemini AI, social media platforms)
   - Add webhook URLs
   - Add email/Slack credentials for notifications

3. **Set Environment Variables:**
   ```env
   BRANDPULSE_API_URL=https://your-api.com
   GEMINI_API_KEY=your_key
   DATABASE_URL=postgresql://...
   ```

4. **Activate Workflows:**
   - Enable each workflow in n8n
   - Test with sample data
   - Monitor execution logs

### Webhook Endpoints

Each workflow exposes webhook endpoints for triggering:

```
POST /webhook/inventory-sync
POST /webhook/content-approval
POST /webhook/vendor-registration
POST /webhook/stock-alert
```

### Custom Nodes

BrandPulse AI provides custom n8n nodes:

1. **IBM Bob Node** - Vision-to-Code processing
2. **AI Tag Scanner Node** - Product image analysis
3. **Trend Analyzer Node** - Competitor analysis
4. **Content Generator Node** - AI content creation

Install via:
```bash
npm install @brandpulse/n8n-nodes-brandpulse
```

## Workflow Customization

### Adding Custom Logic

Edit workflows to add:
- Custom validation rules
- Additional notification channels
- Integration with other tools (Zapier, Make, etc.)
- Custom AI prompts
- Business-specific logic

### Example: Custom Approval Flow

```javascript
// In Function node
const post = $input.item.json;

// Custom approval logic
if (post.estimatedEngagement === 'viral') {
  // Auto-approve high-potential posts
  return { approved: true, reason: 'High viral potential' };
} else if (post.caption.length < 50) {
  // Reject short captions
  return { approved: false, reason: 'Caption too short' };
} else {
  // Send for human review
  return { needsReview: true };
}
```

## Monitoring & Debugging

### Execution Logs
- View in n8n UI under Executions
- Filter by workflow, status, date
- Export logs for analysis

### Error Handling
- All workflows include error handling nodes
- Failed executions trigger notifications
- Automatic retry logic for transient failures

### Performance Metrics
- Track execution time
- Monitor API rate limits
- Analyze workflow efficiency

## Best Practices

1. **Use Webhooks for Real-time Triggers**
   - Faster than polling
   - More efficient resource usage

2. **Implement Rate Limiting**
   - Respect API limits
   - Use delay nodes between API calls

3. **Enable Error Notifications**
   - Get alerted immediately on failures
   - Set up Slack/email notifications

4. **Version Control Workflows**
   - Export workflows regularly
   - Store in Git repository
   - Document changes

5. **Test with Sample Data**
   - Use n8n's test mode
   - Validate outputs at each step
   - Check edge cases

## Support

For issues or questions:
- GitHub: https://github.com/brandpulse-ai/n8n-workflows
- Documentation: https://docs.brandpulse.ai/n8n
- Community: https://community.brandpulse.ai

## License

Apache-2.0