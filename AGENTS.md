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

## 2026-01-27 21:10
- Change: Added subscription status stub API and pricing gate UI for /ai.
- Files: src/app/api/billing/subscription-status/route.ts, src/components/ai/ChatWizardPanel.tsx, src/components/ai/PricingPanel.tsx
- Notes: Subscription logic is stubbed; Razorpay wiring comes next.
- Next: Implement Razorpay create-subscription + webhook + DB persistence.

## 2026-01-27 21:15
- Change: Added Prisma schema, session auth stub, and Razorpay subscription creation + webhook persistence.
- Files: prisma/schema.prisma, src/lib/db.ts, src/lib/auth/session.ts, src/lib/auth/requireUser.ts, src/app/api/auth/session/route.ts, src/lib/billing/plans.ts, src/lib/billing/razorpay.ts, src/app/api/billing/razorpay/create-subscription/route.ts, src/app/api/billing/razorpay/webhook/route.ts, src/app/api/billing/subscription-status/route.ts, src/components/ai/ChatWizardPanel.tsx, package.json, .env
- Notes: Subscription status now reads from DB; Razorpay checkout is wired client-side.
- Next: Implement credits system (ledger + enforcement + UI display).

## 2026-01-27 21:17
- Change: Implemented credit system API (status + topups) and UI display with credit history.
- Files: src/lib/ai/types.ts, src/lib/billing/credits.ts, src/app/api/ai/credits/route.ts, src/app/api/billing/topup/create-order/route.ts, src/app/api/billing/topup/webhook/route.ts, src/components/ai/TopUpPanel.tsx, src/components/ai/ChatWizardPanel.tsx
- Notes: Credits are now queryable; top-ups flow through Razorpay order + webhook.
- Next: Implement Codex build engine with file tree + ZIP download.

## 2026-01-27 21:23
- Change: Implemented Codex build engine, workspace writer, and build/status/file/download endpoints.
- Files: src/lib/ai/buildEngine.ts, src/lib/ai/codex.ts, src/lib/ai/parse.ts, src/lib/ai/prompt.ts, src/lib/ai/paths.ts, src/lib/ai/logs.ts, src/lib/ai/workspace.ts, src/lib/ai/telemetry.ts, src/app/api/ai/build/route.ts, src/app/api/ai/build/[id]/status/route.ts, src/app/api/ai/build/[id]/file/route.ts, src/app/api/ai/build/[id]/download/route.ts
- Notes: Build pipeline writes files, ensures envs, and records manifest + logs.
- Next: Add preview runner + proxy iframe route.

## 2026-01-27 21:26
- Change: Added preview runner, proxy iframe route, and restart endpoint with rate limiting.
- Files: src/lib/ai/preview.ts, src/lib/ai/rateLimit.ts, src/app/api/ai/build/[id]/preview/[...path]/route.ts, src/app/api/ai/build/[id]/preview/restart/route.ts, src/lib/ai/buildEngine.ts
- Notes: Preview auto-starts after build and updates build status.
- Next: Wire UI wizard, output panels, and polish with tests + rate limits.
