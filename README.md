<div align="center">

# 💰 AI Finance Advisor

**Intelligent Personal Wealth & Spending Analytics Powered by Gemini AI**

[![Frontend](https://img.shields.io/badge/Frontend-Vercel_Live-black?logo=vercel&logoColor=white)](https://ai-finance-advisor-jet.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render_Live-46E3B7?logo=render&logoColor=white)](https://ai-finance-advisor-z5np.onrender.com)
[![API Docs](https://img.shields.io/badge/Swagger-API_Docs-85EA2D?logo=swagger&logoColor=black)](https://ai-finance-advisor-z5np.onrender.com/docs)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://www.python.org/)

[Live Application](https://ai-finance-advisor-jet.vercel.app) · [API Documentation](https://ai-finance-advisor-z5np.onrender.com/docs) · [Report Bug](https://github.com/imashwin-max/AI-finance-advisor/issues)

</div>

---

## 📖 Overview

**AI Finance Advisor** is a comprehensive personal finance dashboard designed to eliminate the friction of tracking personal capital. Users can upload custom bank statement CSVs or explore the platform using an auto-seeded, 6-month demographic transaction dataset (~500 entries).

The platform transforms raw transaction histories into categorized spending dashboards, budget tracking dials, anomaly alerts, next-month predictive forecasts, and a consolidated Financial Health Score. Users can also converse directly with a conversational financial advisor powered by Google Gemini, grounded in their real financial records.

---

## 🚀 Live Deployments

- **Frontend (Web App):** [https://ai-finance-advisor-jet.vercel.app](https://ai-finance-advisor-jet.vercel.app)
- **Backend (FastAPI Service):** [https://ai-finance-advisor-z5np.onrender.com](https://ai-finance-advisor-z5np.onrender.com)
- **Interactive Swagger Documentation:** [https://ai-finance-advisor-z5np.onrender.com/docs](https://ai-finance-advisor-z5np.onrender.com/docs)

---

## ✨ Key Features

- **Automated Data Seeding:** Registering a new account automatically provisions ~500 realistic, categorized transactions spanning 6 months for immediate out-of-the-box exploration.
- **AI Financial Copilot:** Grounded conversational agent with support for both standard and streaming responses (`/chat` and `/chat/stream`).
  - *Resilient Architecture:* Includes an automated heuristic rule-based mock engine that activates if no Gemini API key is configured.
- **Predictive Insights & Anomaly Detection:** Automated endpoints analyzing spending spikes, unusual recurring debits, and next-month savings forecasts.
- **Financial Health Score:** Algorithmic calculation evaluating debt-to-income, savings rates, and budget variance.
- **Complete Statement Reporting:** Export dynamic summary reports directly to formatted CSV or downloadable PDF formats generated on-the-fly with ReportLab.
- **Theme-Aware Design Engine:** Accessible light/dark theming built with CSS variable tokens (`rgb(var(--color-x) / <alpha-value>)`) eliminating high-contrast visual regressions across backgrounds, typography, and card containers.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18, Vite, TypeScript
- **Styling & Components:** Tailwind CSS, CSS Custom Variables, Framer Motion
- **Data Visualization:** Recharts
- **Forms & Networking:** React Hook Form, Axios
- **Deployment:** Vercel (SPA routing rewrite rules via `vercel.json`)

### Backend & AI
- **Framework:** FastAPI (Python 3.10+)
- **ORM & Data Processing:** SQLAlchemy, Pandas, Pydantic v2
- **Document Generation:** ReportLab (PDF Engine)
- **Authentication:** JWT (OAuth2 with `python-jose`, password hashing via `passlib[bcrypt]`)
- **Database:** SQLite (default / zero-config local), fully swappable to PostgreSQL via `DATABASE_URL`
- **AI Integration:** Google Gemini API with built-in heuristic fallback
- **Deployment:** Render (`render.yaml` blueprint with Uvicorn worker)

---

## 📁 Repository Structure

```text
ai-finance-advisor/
├── backend/                  # FastAPI microservice
│   ├── app/
│   │   ├── api/              # Route controllers (auth, transactions, chat, insights)
│   │   ├── core/             # JWT config, password hashing, environment variables
│   │   ├── models/           # SQLAlchemy database schemas
│   │   ├── schemas/          # Pydantic input/output validation models
│   │   └── services/         # Gemini interface, Pandas analytics, PDF generator
│   ├── main.py               # Application entrypoint & CORS configuration
│   ├── requirements.txt      # Python dependencies
│   ├── Procfile              # Process file for Render hosting
│   └── .env.example          # Sample backend configuration
├── frontend/                 # React 18 + Vite Single Page Application
│   ├── src/
│   │   ├── components/       # UI atoms, charts, layout, navigation, modals
│   │   ├── context/          # ThemeContext & AuthContext
│   │   ├── hooks/            # Custom financial data fetching hooks
│   │   ├── pages/            # Dashboard, Analytics, Budgets, AI Advisor, Profile
│   │   └── services/         # Axios API clients
│   ├── tailwind.config.ts    # Tokenized theme mapping
│   ├── vercel.json           # Client routing configuration
│   └── package.json
├── sample-data/
│   └── demo-transactions.csv # Reference banking statement dataset
├── render.yaml               # 1-click Render deployment blueprint
└── README.md
