# 🏆 Pitch — MarketMaster AI

**Hackathon:** IBM Hackathon  
**Team:** MarketMaster AI  
**Solution:** Autonomous AI-Powered Inventory & Customer Intelligence for Emerging Market SMEs

---

## The Problem

40 million SMEs in emerging markets — from Karachi bazaars to Lagos markets — still operate on paper. The result is catastrophic:

- **30% revenue loss** from stockouts and overstocking.
- **60% of customers churn** because businesses can't track who stopped buying.
- **Days wasted** manually entering delivery challans into spreadsheets.

These aren't lazy business owners. They simply don't have access to enterprise-grade digital tools.

---

## Our Solution: MarketMaster AI

MarketMaster AI is a **multi-agent B2B SaaS platform** that turns a smartphone photo of a delivery challan into a live business intelligence system — in seconds.

### Three Core Pillars

| Pillar | What It Does | IBM Technology |
|--------|-------------|----------------|
| **📸 Vision-to-Code** | Snap a photo → AI extracts products → auto-inserts into database | **IBM Granite 3.2 Vision** (`ibm/granite-3-2-8b-vision-instruct`) |
| **🧠 Natural Language Intelligence** | Ask questions in English/Urdu → AI writes SQL & returns charts | **IBM Granite 3.8b Instruct** (`ibm/granite-3-8b-instruct`) |
| **🤖 Autonomous Agent Swarm** | AI agents monitor inventory, predict stockouts, and re-engage customers — 24/7 | **IBM WatsonX AI** ReAct tool-calling loop |

---

## Demo in 60 Seconds

1. **Upload a photo** of a handwritten delivery challan.
2. **IBM Granite Vision** reads every item — printed or handwritten.
3. **Structured data** appears instantly: product names, SKUs, quantities, prices.
4. **Auto-SQL** inserts the data into the live database.
5. **Ask in plain English:** *"Which customers in Karachi haven't bought leather bags in 30 days?"*
6. **IBM Granite** writes the SQL, runs it, and returns actionable results.
7. **AI agents** detect low stock, draft a purchase order, and launch a WhatsApp re-engagement campaign — autonomously.

---

## Why IBM?

| IBM Technology | Why We Chose It |
|---------------|-----------------|
| **IBM Granite 3.2 Vision** | Unmatched accuracy on low-quality, handwritten documents common in emerging markets. Supports Urdu-English code-mixed text. |
| **IBM Granite 3.8b Instruct** | Best-in-class NL2SQL and reasoning at a fraction of the cost. Ideal for high-frequency SME queries. |
| **IBM WatsonX** | Enterprise-grade governance, data privacy, and multi-model orchestration — critical for B2B SaaS. |
| **IBM Cloud / Code Engine** | Our Docker stack is deployment-ready for IBM Cloud. No vendor lock-in. |

> **IBM Bob** was instrumental in generating our backend architecture and SQL validation logic, accelerating our build velocity by 3x.

---

## Business Model

- **Freemium SaaS**: Free for single-store owners; $29/month for multi-location SMEs.
- **B2B2C**: Partner with logistics providers (TCS, Leopards Courier) to embed MarketMaster AI into delivery workflows.
- **White-label**: License the agentic engine to banks offering SME micro-loans.

---

## Impact

| Metric | Projection |
|--------|-----------|
| SMEs Reached (Year 1) | 10,000 |
| Average Revenue Uplift per SME | 25% |
| Time Saved per Week | 12 hours |
| Languages Supported | English, Urdu, Arabic, Swahili |

---

## Technical Highlights

- **React 19 + TypeScript** frontend with real-time Recharts dashboards.
- **Express.js + SQLite** backend with seeded Pakistani business data (15 products, 15 customers, 30 orders, 5 suppliers).
- **Provider-agnostic AI layer** — IBM WatsonX is Priority 1; Groq/Gemini are graceful fallbacks.
- **Security-first**: SQL injection prevention, rate limiting, JWT auth, SQL validation for AI-generated statements.
- **Docker + Docker Compose** — ready to deploy on IBM Cloud Foundry / Code Engine in minutes.

---

## The Team

We are builders obsessed with giving emerging-market SMEs the same digital superpowers that Fortune 500 companies have. Built with IBM Bob. Powered by IBM Granite.

---

## 🚀 Ask

We are looking for IBM Cloud credits and mentorship to deploy at scale across South Asia and Sub-Saharan Africa.

**Let's give 40 million SMEs the AI they deserve.**
