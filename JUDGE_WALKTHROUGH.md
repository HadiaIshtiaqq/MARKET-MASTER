# 🎯 Judge Walkthrough — MarketMaster AI

**Target Duration:** 5 minutes  
**Judge Persona:** IBM Hackathon judge evaluating technical depth, IBM tech usage, and real-world impact.

---

## 0. Setup (10 seconds)

Open two terminals:

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend (from root)
npm run dev
```

Or simply double-click `start-hackathon.bat` (Windows) or `./start-hackathon.sh` (Mac/Linux).

Navigate to **http://localhost:3000**.

---

## 1. The Hook — Problem Statement (30 seconds)

> *"40 million SMEs in emerging markets lose 30% of revenue to stockouts and poor customer retention because they still run on paper. MarketMaster AI digitizes a delivery challan in seconds using IBM Granite Vision, predicts stockouts, and autonomously re-engages at-risk customers via AI agents."*

**What to show:** The landing page (`Command Center`) with live metrics.

---

## 2. IBM Granite Vision — Snap a Photo (90 seconds)

**Tab:** `IBM Bob Live`

1. Upload the provided demo image (`demo-challan.jpg`) or any inventory sheet photo.
2. Watch the real-time status:
   - **Step 1:** IBM Granite 3.2 Vision reads the document.
   - **Step 2:** Structured data extracted with confidence scores.
   - **Step 3:** Auto-generated SQL INSERT statements.
3. Click **"Execute to DB"** — items are instantly inserted into the live SQLite database.
4. Switch to `Schema & NL2SQL` and run a natural language query like:
   > *"Show me Karachi customers who haven't bought leather bags in 30 days"*
5. IBM Granite converts the question to SQL and displays results in real time.

**IBM Tech Highlighted:** `ibm/granite-3-2-8b-vision-instruct` and `ibm/granite-3-8b-instruct`.

---

## 3. Multi-Agent Orchestration — Autonomous Business Brain (90 seconds)

**Tab:** `Command Center`

1. Point out the **three live agents** running autonomously:
   - **IBM Bob** — Logistics Optimizer
   - **Sales Scout** — Lead Generation
   - **Stock Sentinel** — Inventory Monitor
2. Click **"Optimize Swarm"** (top right).
3. Watch the **Agent Feed** populate with real inter-agent messages:
   - Stock Sentinel alerts low inventory.
   - IBM Bob drafts a purchase order.
   - Sales Scout identifies at-risk customers.
4. Click **"View Real-Time Workflows"** to see live status:
   - Low-stock product detection → EOQ calculation → PO drafting.

**IBM Tech Highlighted:** IBM WatsonX ReAct tool-calling loop (`agenticLoop` in `watsonx.service.ts`).

---

## 4. Real Data & Predictions — No Mock Data (60 seconds)

**Tab:** `Execution Core`

1. **Inventory Intelligence** — Show low-stock items with real PKR pricing.
2. **Sales Velocity** — Show days-until-stockout calculation.
3. **Purchase Order** — Click **"Transmit PO"** and watch status change from `Draft` → `Transmitting` → `Dispatched` (linked to real AI coordination API call).
4. **Customer Retention** — Click **"Launch Campaign"** to send AI-generated WhatsApp re-engagement messages to real at-risk customers from the database.

**Data Fact:** All inventory, customers, orders, and competitors are seeded with realistic Pakistani business data (Karachi, Lahore, Islamabad).

---

## 5. Architecture Deep Dive (30 seconds)

If the judge asks about technical implementation, show:

- `server/src/services/watsonx.service.ts` — Provider-agnostic AI wrapper. IBM WatsonX is Priority 1.
- `server/src/services/ibmBob.service.ts` — Vision-to-Code and NL2SQL engine.
- `server/src/services/agentOrchestrator.service.ts` — ReAct multi-agent loop with tool calling.
- `server/src/services/database.service.ts` — Auto-seeding SQLite with 15 products, 15 customers, 30 orders, 5 suppliers.
- `docker-compose.yml` — Full Docker stack ready for IBM Cloud deployment.

---

## 6. Closing — Impact & Scale (20 seconds)

> *"This isn't a prototype — it's a Docker-ready, multi-tenant B2B SaaS. With IBM WatsonX Granite handling vision and reasoning, we give 40 million SMEs the digital intelligence they need to compete globally."*

**Optional:** Mention the n8n workflow templates (`n8n-workflows/`) for production automation.

---

## 🔑 Winning Points to Emphasize

| Point | Why It Wins |
|-------|-------------|
| **IBM Granite Vision** | Real document digitization with an IBM foundation model |
| **IBM WatsonX ReAct** | True agentic tool-calling, not just prompt chaining |
| **Emerging Market Focus** | Solves a real, high-impact problem for 40M SMEs |
| **End-to-End Working System** | Working backend, real DB, live AI coordination |
| **Docker-Ready for IBM Cloud** | One command to deploy on IBM Cloud Foundry / Code Engine |

---

## ⚡ Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| "No AI provider found" | Add `GROQ_API_KEY` (free) to `server/.env` and restart server |
| Backend won't start | `cd server && npm install` |
| Frontend blank | `npm install` from root; ensure Vite dev server is on port 3000 |
| Database empty | Backend auto-seeds on first start; restart server if needed |

---

**Good luck! 🚀**
