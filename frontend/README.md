# AI Finance Advisor — Frontend

React + TypeScript + Vite SPA for the AI Finance Advisor app. Pairs with the `backend/` you
already verified working end-to-end (auth, demo seeding, chat, CSV/PDF export).

## Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:

```
VITE_API_BASE_URL=http://localhost:8000
```

Make sure your backend is running first (`uvicorn main:app --reload` in the backend folder,
on port 8000), then:

```bash
npm run dev
```

App will be live at `http://localhost:5173`.

## What to click through

1. Register a new account — your backend auto-seeds ~500 demo transactions, so the dashboard
   should be populated immediately after you land on it.
2. Dashboard — stat cards, recent transactions, Export CSV / Export PDF buttons.
3. Transactions — search, filter by category/date/type, delete a row.
4. Analytics — category pie chart, income vs expense bar chart, weekly trend, top merchants,
   spending heatmap, recurring subscriptions, largest expenses.
5. Budgets — create a budget for a category/month and watch the progress bar.
6. Health Score — circular gauge, factor breakdown, suggestions.
7. AI Advisor — chat (uses Gemini if you set `GEMINI_API_KEY` in the backend, otherwise the
   built-in mock advisor answers from your real data — never breaks the demo).
8. Profile — account info, export buttons again, logout.

## Build check

Since I couldn't reach npm's registry in my sandbox to run a real `npm install`/`tsc` pass, I
verified this differently before handing it to you: every `@/...` import path resolves to a real
file on disk, and every named import matches a real export in its target file (checked
programmatically, not by eye). That rules out the most common "file is missing" / "typo'd export
name" class of errors, but it does **not** replace a real TypeScript compile — if you hit a type
error from `npm run build` or `npm run dev`, paste me the exact output and I'll fix it immediately.

## Known constraint carried over from the backend

`localStorage` is used for the JWT and user info (`AuthContext.tsx`) — this is normal for a
standalone Vite app running in a real browser at `localhost:5173`, not the Claude.ai artifact
sandbox, so it's safe here.
