# HeadStart

> MVP for Powerhouse — turn your idea into a POWERHOUSE.

HeadStart helps first-time Indian founders and college entrepreneurs go from idea to launch-ready MVP with AI-generated market research, competitor analysis, product blueprints, brand kits, and launch content.

## Tech Stack

- **Framework:** TanStack Start v1 (React 19) on Vite 7
- **Styling:** Tailwind CSS v4
- **Backend / Auth / DB:** Lovable Cloud (Supabase)
- **AI:** Lovable AI Gateway (Google Gemini 2.5 Flash-Lite)
- **PDF export:** pdf-lib (client-side)

## Getting Started

### 1. Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ref |
| `LOVABLE_API_KEY` | Lovable AI Gateway key (server-side) |

> Never commit `.env`. It is git-ignored. Use `.env.example` as a template.

### 2. Install dependencies

```bash
bun install
```

### 3. Run the dev server

```bash
bun run dev
```

Open `http://localhost:8080`.

### 4. Build for production

```bash
bun run build
```

## Project Structure

```
src/
├── components/        # Reusable UI (Navbar, Footer, dashboard tabs)
├── dashboard/         # ResultsDashboard with 6 report tabs
├── hooks/             # use-auth, use-theme, use-mobile
├── integrations/      # Supabase client + Lovable AI
├── lib/               # Shared utilities
├── routes/            # TanStack file routes (/, /auth, /dashboard, /admin)
├── services/          # db.ts — typed Supabase data layer
├── utils/             # api.ts, report-pdf.ts
└── styles.css         # Tailwind v4 theme + design tokens
```

## Database

Schema lives in Supabase migrations: `profiles`, `user_roles`, `startup_ideas`, `generated_reports` — all with Row-Level Security scoped per user.

## License

MIT
