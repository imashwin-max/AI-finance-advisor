# AI Finance Advisor

[![Live Application](https://img.shields.io/badge/Frontend-Vercel%20Live-black?style=for-the-badge&logo=vercel)](https://ai-finance-advisor-jet.vercel.app/)
[![API Status](https://img.shields.io/badge/Backend-Render%20Live-46E3B7?style=for-the-badge&logo=render)](https://ai-finance-advisor-z5np.onrender.com)
[![API Docs](https://img.shields.io/badge/Swagger-API%20Docs-85EA2D?style=for-the-badge&logo=swagger)](https://ai-finance-advisor-z5np.onrender.com/docs)

### 🚀 Live Deployment
- **Frontend (Web App):** [https://ai-finance-advisor-jet.vercel.app](https://ai-finance-advisor-jet.vercel.app/)
- **Backend (FastAPI):** [https://ai-finance-advisor-z5np.onrender.com](https://ai-finance-advisor-z5np.onrender.com)
- **API Documentation:** [https://ai-finance-advisor-z5np.onrender.com/docs](https://ai-finance-advisor-z5np.onrender.com/docs)

A full-stack AI-powered personal finance dashboard. Upload a bank statement CSV (or register
and get auto-generated demo data), see categorized spending analytics, track budgets, view a
financial health score, and chat with an AI advisor grounded in your real transaction data.

This repo contains both halves of the app:

```
ai-finance-advisor/
├── backend/          # FastAPI service (Python)
├── frontend/         # React + Vite SPA (TypeScript)
└── sample-data/
    └── demo-transactions.csv
```

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS (CSS-variable-driven theming), Recharts,
Framer Motion, React Hook Form, Axios
**Backend:** FastAPI, SQLAlchemy, Pandas, Pydantic, ReportLab
**AI:** Google Gemini API, with an automatic rule-based mock fallback if no API key is set
**Auth:** JWT (python-jose, passlib/bcrypt)
**Database:** SQLite by default, swappable to PostgreSQL via `DATABASE_URL`

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env        # then edit .env — see "Environment Variables" below
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000` (interactive docs at `/docs`).

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env        # set VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 3. Try it

1. Open `http://localhost:5173`
2. Register a new account — ~500 demo transactions across 6 months are seeded automatically
3. Explore Dashboard, Analytics, Budgets, Health Score
4. Try the AI Chat ("Where am I wasting money?", "Suggest a monthly budget")
5. Toggle light/dark theme from the navbar (top right)
6. Export a CSV or PDF report from the Dashboard or Profile page

## Environment Variables

**`backend/.env`**
```
DATABASE_URL=sqlite:///./finance_advisor.db
GEMINI_API_KEY=                # optional — leave blank to use the built-in mock AI advisor
JWT_SECRET_KEY=replace_with_a_long_random_string
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:5173
```

**`frontend/.env`**
```
VITE_API_BASE_URL=http://localhost:8000
```

### Gemini API Setup (optional)

1. Get a free key at https://aistudio.google.com/app/apikey
2. Paste it into `backend/.env` as `GEMINI_API_KEY`
3. Restart the backend

Without a key, `/chat` automatically falls back to a rule-based advisor that reads your real
transaction data — the chat feature never errors out, it just answers with less nuance.

## What Was Fixed in This Pass

- **Theme toggle**: previously the dark/light state updated in React but never wrote a class to
  `<html>` that Tailwind's CSS actually responded to, and there was no light palette defined at
  all — toggling visibly did nothing. Fixed by driving every color through CSS variables
  (`src/index.css`, `.dark` / `.light` blocks) that `tailwind.config.ts` reads via
  `rgb(var(--color-x) / <alpha-value>)`, plus an effect in `ThemeContext.tsx` that swaps the
  class on `<html>` and persists the choice to `localStorage`.
- **UI polish**: replaced hardcoded `text-white` with theme-aware `text-foreground` across cards,
  stat cards, sidebar, and navbar so light mode renders dark text on light surfaces instead of
  white-on-white; added hover/transition consistency, a real avatar initial badge in the navbar,
  and `aria-label`/`aria-pressed` on the theme toggle for accessibility.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create account, auto-seeds demo data |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/auth/me` | Current user info |
| POST | `/upload` | Upload bank statement CSV |
| GET | `/upload/sample-csv` | Download sample CSV |
| GET | `/transactions` | List/filter/search transactions |
| DELETE | `/transactions/{id}` | Delete a transaction |
| GET | `/summary` | Dashboard summary stats |
| GET | `/analytics` | Full analytics payload |
| GET | `/budgets` | List budgets |
| POST | `/budgets` | Create a budget |
| GET | `/health-score` | Financial health score |
| POST | `/chat` | AI chat (single response, with mock fallback) |
| POST | `/chat/stream` | AI chat (streaming) |
| GET | `/insights/unusual-spending` | Anomaly detection |
| GET | `/insights/spending-prediction` | Next-month forecast |
| GET | `/insights/savings-forecast` | Savings projection |
| GET | `/export/csv` | Download transactions as CSV |
| GET | `/export/pdf` | Download full financial report as PDF |

## Deployment

- **Frontend:** Deployed on Vercel at [https://ai-finance-advisor-jet.vercel.app](https://ai-finance-advisor-jet.vercel.app/)
  - Configuration: `frontend/vercel.json` provides client-side SPA routing rewrites.
- **Backend:** Deployed on Render at [https://ai-finance-advisor-z5np.onrender.com](https://ai-finance-advisor-z5np.onrender.com)
  - Configuration: `render.yaml` & `backend/Procfile` run FastAPI with Uvicorn.
  - Interactive Swagger Docs: [https://ai-finance-advisor-z5np.onrender.com/docs](https://ai-finance-advisor-z5np.onrender.com/docs)

`CORS_ORIGINS` automatically permits your Vercel deployment, and the frontend automatically targets the Render API in production. SQLite on free-tier hosting is ephemeral; for a persistent deployment switch `DATABASE_URL` to a PostgreSQL connection string — no other code changes needed, since SQLAlchemy abstracts the database.

## Pushing to GitHub

```bash
cd ai-finance-advisor
git init
git add .
git commit -m "Initial commit: AI Finance Advisor (frontend + backend)"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

`.gitignore` already excludes `node_modules/`, `.venv/`, `.env`, and the SQLite `.db` file, so
secrets and build artifacts won't be committed.
