# MarketMaster AI — IBM Hackathon Submission

> **Multi-agent B2B SaaS platform powered by IBM WatsonX Granite.**
> Digitize physical inventory with a photo. Predict stockouts. Re-engage customers autonomously.
> Built for 40 million SMEs in emerging markets.

---

## 🚀 Live Demo

```bash
# 1. Install dependencies
npm install
cd server && npm install && cd ..

# 2. Configure environment
cp .env.example .env
cp server/.env.example server/.env
# Edit server/.env and add ONE provider key (IBM WatsonX, Groq, or Gemini)

# 3. Start
npm run dev          # Frontend (localhost:3000)
cd server && npm run dev   # Backend (localhost:3001)
# Or use: start-hackathon.bat  /  ./start-hackathon.sh
```

**Recommended:** Add `GROQ_API_KEY` (free, no credit card) for the fastest demo experience.
**IBM Hackathon Optimized:** Add `WATSONX_API_KEY` + `WATSONX_PROJECT_ID` for full IBM Granite integration.

---

## 🎥 60-Second Demo Script

1. **Command Center** — Watch 3 AI agents run autonomously (live metrics, activity charts).
2. **IBM Bob Live** — Upload a photo of a delivery challan. AI extracts every item and writes SQL.
3. **Schema & NL2SQL** — Type in plain English: *"Show me Karachi customers who haven't bought leather bags in 30 days."* IBM Granite writes the SQL instantly.
4. **Execution Core** — One-click transmit AI-drafted purchase orders and launch WhatsApp re-engagement campaigns to at-risk customers.

📖 **Full judge walkthrough:** [`JUDGE_WALKTHROUGH.md`](JUDGE_WALKTHROUGH.md)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     MARKETMASTER AI                          │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React 19 + Tailwind)                             │
│     ↓                                                       │
│  Backend API (Express + TypeScript + SQLite)                │
│     ↓                                                       │
│  AI Engine — Unified Provider                               │
│     1. IBM WatsonX  (Granite 3-8b / Granite 3-2 Vision)    │
│     2. Groq         (Llama 3.3 70B fallback)               │
│     3. Gemini       (Google fallback)                      │
│     ↓                                                       │
│  Multi-Agent ReAct Loop                                     │
│     • IBM Bob      → Vision-to-Code & NL2SQL               │
│     • Stock Sentinel → Inventory optimization              │
│     • Sales Scout  → Customer churn detection              │
│     • Market Agent → Competitive intelligence              │
└─────────────────────────────────────────────────────────────┘
```

---

## 💎 Why It Wins

| Judge Criteria | How We Deliver |
|---------------|----------------|
| **IBM Tech Depth** | Native WatsonX Granite Vision + Instruct. ReAct tool-calling. Docker-ready for IBM Cloud. |
| **Innovation** | First agentic platform that converts a photo of a paper document into live SQL + autonomous business actions. |
| **Impact** | Targets 40M SMEs losing 30% revenue. Realistic PKR data. Urdu/English support. |
| **Completeness** | Working backend, real DB, live AI coordination, Docker stack, n8n workflows, judge walkthrough. |
| **Security** | Rate limiting, JWT auth, SQL injection prevention, AI SQL validation (blocks DROP/DELETE). |

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `server/src/services/watsonx.service.ts` | Unified AI provider (IBM WatsonX #1) |
| `server/src/services/ibmBob.service.ts` | Vision-to-Code & NL2SQL engine |
| `server/src/services/agentOrchestrator.service.ts` | Multi-agent ReAct loop with tool calling |
| `server/src/services/database.service.ts` | Seeded SQLite with realistic PKR business data |
| `src/components/MarketMasterApp.tsx` | Main hackathon demo UI |
| `JUDGE_WALKTHROUGH.md` | 5-minute step-by-step demo script |
| `PITCH.md` | Full hackathon pitch narrative |

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts
- **Backend:** Express.js, TypeScript, SQLite (better-sqlite3), JWT, rate-limit
- **AI:** IBM WatsonX Granite, Groq Llama 3.3, Gemini 2.5 Flash
- **DevOps:** Docker, Docker Compose, Nginx
- **Automation:** n8n

---

## 🐳 Docker

```bash
docker-compose up --build
```

Services: PostgreSQL (for n8n), Redis, Backend, Frontend, n8n, Nginx (production profile).

---

## 📄 License

Apache-2.0

---

**Built with IBM Bob. Powered by IBM Granite.**
