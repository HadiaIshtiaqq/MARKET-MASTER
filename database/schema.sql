-- BrandPulse AI - Multi-Tenant Database Schema
-- Supports vendor registration, inventory management, social media integration, and AI-driven marketing

-- ============================================
-- MULTI-TENANCY & AUTHENTICATION
-- ============================================

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    industry_niche VARCHAR(100) NOT NULL, -- e.g., 'fashion', 'electronics', 'food'
    subscription_tier VARCHAR(50) DEFAULT 'basic', -- basic, pro, enterprise
    status VARCHAR(20) DEFAULT 'active', -- active, suspended, trial
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'vendor', -- admin, vendor, manager
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- ============================================
-- SOCIAL MEDIA INTEGRATION
-- ============================================

CREATE TABLE social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- instagram, facebook, twitter, tiktok, linkedin
    account_handle VARCHAR(255) NOT NULL,
    account_id VARCHAR(255), -- Platform-specific ID
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    is_connected BOOLEAN DEFAULT true,
    auto_post_enabled BOOLEAN DEFAULT false,
    human_approval_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, platform, account_handle)
);

-- ============================================
-- INVENTORY MANAGEMENT
-- ============================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    brand VARCHAR(100),
    price DECIMAL(10, 2),
    cost DECIMAL(10, 2),
    stock_quantity INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    image_urls TEXT[], -- Array of image URLs
    ai_tags TEXT[], -- AI-generated tags from image scanning
    metadata JSONB, -- Flexible storage for additional attributes
    ingestion_method VARCHAR(50), -- 'ai_tag_scan', 'vision_to_code', 'manual'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, sku)
);

CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    capacity INTEGER,
    current_stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id UUID REFERENCES warehouses(id),
    transaction_type VARCHAR(50) NOT NULL, -- 'stock_in', 'stock_out', 'adjustment', 'transfer'
    quantity INTEGER NOT NULL,
    reference_document VARCHAR(255), -- Challan number, PO number, etc.
    document_image_url TEXT, -- Scanned challan/document
    processed_by VARCHAR(50), -- 'ibm_bob', 'manual', 'ai_scan'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- COMPETITOR ANALYSIS & TREND MONITORING
-- ============================================

CREATE TABLE competitor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    account_handle VARCHAR(255) NOT NULL,
    account_name VARCHAR(255),
    follower_count INTEGER,
    industry_niche VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_scraped_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, platform, account_handle)
);

CREATE TABLE competitor_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competitor_id UUID REFERENCES competitor_profiles(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    post_id VARCHAR(255) NOT NULL, -- Platform-specific post ID
    post_url TEXT,
    caption TEXT,
    hashtags TEXT[],
    media_urls TEXT[],
    media_type VARCHAR(50), -- image, video, carousel, reel
    engagement_likes INTEGER DEFAULT 0,
    engagement_comments INTEGER DEFAULT 0,
    engagement_shares INTEGER DEFAULT 0,
    engagement_views INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5, 2), -- Calculated percentage
    posted_at TIMESTAMP,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ai_analysis JSONB, -- AI-extracted insights: tone, style, hooks, etc.
    UNIQUE(competitor_id, post_id)
);

CREATE TABLE viral_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry_niche VARCHAR(100) NOT NULL,
    trend_type VARCHAR(50), -- 'hashtag', 'content_style', 'caption_hook', 'visual_style'
    trend_value TEXT NOT NULL,
    frequency_score INTEGER DEFAULT 1, -- How often this trend appears
    engagement_score DECIMAL(10, 2), -- Average engagement for posts with this trend
    time_period VARCHAR(50), -- 'daily', 'weekly', 'monthly'
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    metadata JSONB -- Additional trend details
);

-- ============================================
-- AI CONTENT GENERATION & CAMPAIGNS
-- ============================================

CREATE TABLE brand_voice_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    profile_name VARCHAR(255) DEFAULT 'Default',
    tone VARCHAR(100), -- 'professional', 'casual', 'playful', 'luxury'
    language VARCHAR(50) DEFAULT 'en',
    emoji_usage VARCHAR(50), -- 'none', 'minimal', 'moderate', 'heavy'
    hashtag_strategy VARCHAR(50), -- 'minimal', 'moderate', 'aggressive'
    call_to_action_style VARCHAR(100),
    brand_keywords TEXT[],
    avoid_words TEXT[],
    sample_captions TEXT[], -- Example captions for AI training
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    brand_voice_id UUID REFERENCES brand_voice_profiles(id),
    content_type VARCHAR(50), -- 'post', 'story', 'reel', 'carousel'
    platform VARCHAR(50),
    caption TEXT,
    hashtags TEXT[],
    media_urls TEXT[],
    ai_model VARCHAR(100), -- 'gemini-pro', 'gpt-4', etc.
    generation_prompt TEXT,
    viral_trends_used JSONB, -- Which trends were incorporated
    status VARCHAR(50) DEFAULT 'draft', -- draft, pending_approval, approved, rejected, published
    approval_notes TEXT,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scheduled_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    content_id UUID REFERENCES generated_content(id),
    social_account_id UUID REFERENCES social_accounts(id),
    scheduled_time TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, publishing, published, failed
    published_at TIMESTAMP,
    platform_post_id VARCHAR(255), -- ID returned by social platform
    platform_post_url TEXT,
    error_message TEXT,
    engagement_metrics JSONB, -- Collected post-publish
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- N8N WORKFLOW INTEGRATION
-- ============================================

CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    workflow_name VARCHAR(255) NOT NULL,
    workflow_type VARCHAR(100), -- 'inventory_sync', 'trend_analysis', 'content_generation', 'auto_post'
    trigger_type VARCHAR(100), -- 'manual', 'scheduled', 'webhook', 'event'
    status VARCHAR(50) DEFAULT 'running', -- running, completed, failed
    input_data JSONB,
    output_data JSONB,
    error_details TEXT,
    execution_time_ms INTEGER,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- ============================================
-- ANALYTICS & REPORTING
-- ============================================

CREATE TABLE campaign_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    scheduled_post_id UUID REFERENCES scheduled_posts(id),
    platform VARCHAR(50),
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    engagement_total INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(scheduled_post_id, date)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_ai_tags ON products USING GIN(ai_tags);
CREATE INDEX idx_competitor_posts_engagement ON competitor_posts(engagement_rate DESC);
CREATE INDEX idx_viral_trends_niche ON viral_trends(industry_niche, engagement_score DESC);
CREATE INDEX idx_scheduled_posts_time ON scheduled_posts(scheduled_time);
CREATE INDEX idx_social_accounts_tenant ON social_accounts(tenant_id);
CREATE INDEX idx_generated_content_status ON generated_content(status);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_voice_updated_at BEFORE UPDATE ON brand_voice_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Made with Bob
