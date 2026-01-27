# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` contains Next.js App Router routes (`page.tsx`, `layout.tsx`) plus API handlers in `src/app/api/*/route.ts`.
- `src/components/` holds reusable React components (PascalCase filenames like `Planet3D.tsx`).
- `src/lib/` contains server-side helpers (Supabase, mailer, schema utilities).
- `src/types/` stores shared TypeScript declarations.
- `public/` hosts static assets (e.g., 3D scene files in `public/planet/`).

## Build, Test, and Development Commands
```bash
npm run dev    # start local dev server (Next.js + Turbopack)
npm run build  # production build
npm run start  # run the production server after build
npm run lint   # ESLint (next/core-web-vitals + TypeScript)
```
There is no `test` script in `package.json` today.

## Coding Style & Naming Conventions
- TypeScript + React (Next.js 15 App Router). Strict mode is enabled in `tsconfig.json`.
- Formatting follows existing code: 2-space indentation, single quotes, semicolons.
- Tailwind CSS is used (`src/app/globals.css` imports `tailwindcss`).
- Route files use Next.js conventions: `src/app/<route>/page.tsx` and API routes at `src/app/api/<name>/route.ts`.
- Use the path alias `@/` for imports from `src/` (e.g., `@/lib/mailer`).

## Testing Guidelines
- No test framework is configured; add one if needed and document it.
- If you introduce tests, prefer `*.test.ts(x)` and co-locate near the module or in a `__tests__/` folder.

## Commit & Pull Request Guidelines
- Git history shows short, direct commit messages; keep them concise and imperative (e.g., “Fix footer nav”).
- PRs should include a clear description, linked issue (if any), and screenshots for UI changes.
- Note any required environment variables or deployment steps in the PR summary.

## Configuration & Secrets
- Store secrets in `.env.local` and never commit them.
- API routes expect variables such as `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `BREVO_SMTP_HOST`, `BREVO_SMTP_PORT`, `BREVO_SMTP_USER`, `BREVO_SMTP_PASS`, `NOTIFY_FROM`, `NOTIFY_TO`, and `ZAPIER_HOOK_URL`.


# AGENTS LOG
## 2026-01-27 21:08
- Change: Added /ai page shell with split layout and base panels.
- Files: src/app/ai/page.tsx, src/components/ai/AiBuilder.tsx, src/components/ai/ChatWizardPanel.tsx, src/components/ai/BuildOutputPanel.tsx
- Notes: Initial scaffolding only; no wiring yet.
- Next: Add subscription gating UI and status endpoint stubs.
