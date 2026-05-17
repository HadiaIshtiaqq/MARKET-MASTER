# MarketMaster AI — Agent Development Guide

## Project Overview

MarketMaster AI is a **multi-agent B2B SaaS platform** built for the IBM Hackathon. It bridges the gap between physical inventory and digital commerce for SMEs in emerging markets (initially Pakistan), using IBM WatsonX Granite models, vision-to-code document extraction, and autonomous agent orchestration.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts |
| Backend | Express.js, TypeScript, SQLite (better-sqlite3) |
| AI Engine | IBM WatsonX (Granite 3-8b / 3-2-vision), Groq fallback, Gemini fallback |
| Automation | n8n workflows |
| Deployment | Docker, Docker Compose, optional Nginx |

## Hackathon Narrative (Elevator Pitch)

> 40 million SMEs in emerging markets lose 30% of revenue to stockouts and poor customer retention. MarketMaster AI digitizes physical inventory in seconds using **IBM Granite Vision** (snap a photo of a delivery challan → structured database rows), predicts stockouts with **IBM WatsonX Predictions**, and autonomously re-engages at-risk customers via orchestrated AI agents — all in Urdu/English mix. Built with IBM Bob (Vision-to-Code) and powered by **IBM Granite**.

## Code Conventions

- **TypeScript strict mode**: No `any` in new code without comment.
- **API Responses**: Always return `{ success: boolean, ...data }`.
- **Database**: Use `DatabaseService` singleton (`db.ts`).
- **AI Calls**: Route through `WatsonXService` to ensure provider-agnostic AI usage.
- **Environment**: Use `dotenv` in backend; use `import.meta.env` in Vite frontend.
- **Naming**: PascalCase for components/services, camelCase for variables/functions.

## Quick Commands

```bash
# Start everything (Windows)
start-hackathon.bat

# Start everything (Unix/Mac)
./start-hackathon.sh

# Dev (frontend)
npm run dev

# Dev (backend)
cd server && npm run dev

# Docker
docker-compose up --build
```

## Critical Security Rules

1. **NEVER commit `.env` files.** `server/.env` was previously committed with real keys and has been rotated.
2. **SQL Injection**: All DB access goes through `better-sqlite3` parameterized statements.
3. **IBM Bob SQL Validation**: Only `INSERT INTO products` is auto-executed. DROP/DELETE/UPDATE are blocked in `ibmBob.service.ts`.
4. **Rate Limiting**: Backend uses `express-rate-limit` at 200 req / 15 min.

## Key Files for Judges

- `server/src/services/watsonx.service.ts` — Unified AI provider (IBM WatsonX is Priority 1).
- `server/src/services/ibmBob.service.ts` — Vision-to-Code & NL2SQL.
- `server/src/services/agentOrchestrator.service.ts` — Multi-agent ReAct loop with tool calling.
- `server/src/services/database.service.ts` — Seeded SQLite DB with realistic PKR business data.
- `src/components/MarketMasterApp.tsx` — Main hackathon demo UI (4 tabs).
- `JUDGE_WALKTHROUGH.md` — Step-by-step demo script.

## IBM Technology Integration Map

| Feature | IBM Tech | How It's Used |
|---------|----------|---------------|
| Document Digitization | IBM Granite 3.2 Vision | Extracts items from photos of challans/inventory sheets |
| Natural Language Queries | IBM Granite 3.8b Instruct | Converts user questions to SQL (NL2SQL) |
| Agent Orchestration | IBM WatsonX AI | ReAct tool-calling loop for multi-agent coordination |
| Backend Hosting | IBM Cloud Foundry / Code Engine | Docker-ready for IBM Cloud deployment |

## Known Limitations

- SQLite is used for hackathon simplicity; production would migrate to **IBM Db2** or PostgreSQL.
- Social media posting is mocked (no real OAuth credentials required for demo).
- n8n workflows are templates; production workflows would run on **IBM Cloud Functions** or n8n on IBM Cloud.

## Environment Variables

See `.env.example` (frontend) and `server/.env.example` (backend). The backend auto-detects:
1. `WATSONX_API_KEY` + `WATSONX_PROJECT_ID` → IBM Granite (preferred for IBM hackathons)
2. `GROQ_API_KEY` → Groq Llama (free, fast)
3. `GEMINI_API_KEY` → Google Gemini (fallback)

## License

Apache-2.0
