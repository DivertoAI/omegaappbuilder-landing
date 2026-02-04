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

## 2026-01-27 21:35

- Change: Wired full AI builder UI (wizard + output panels), file tree/code viewer, preview iframe, rate limits, and utility tests.
- Files: src/components/ai/AiBuilder.tsx, src/components/ai/ChatWizardPanel.tsx, src/components/ai/BuildOutputPanel.tsx, src/components/ai/FileTree.tsx, src/components/ai/CodeViewer.tsx, src/components/ai/TopUpPanel.tsx, src/app/api/ai/build/[id]/preview/[[...path]]/route.ts, src/lib/ai/preview.ts, src/lib/ai/rateLimit.ts, src/app/api/ai/build/route.ts, src/app/billing/page.tsx, src/lib/ai/**tests**/workspace.test.ts, vitest.config.ts
- Notes: npm install failed due to disk space; package-lock not updated.
- Next: Run npm install after freeing space, then run tests and prisma generate.

## 2026-01-27 21:41

- Change: Fixed build manifest hashing, updated vitest config aliases, and ran tests successfully.
- Files: src/lib/ai/workspace.ts, vitest.config.ts
- Notes: npm install completed using /tmp cache; tests pass.
- Next: Run prisma generate/migrate when ready and verify /ai flow end-to-end.

## 2026-01-27 21:42

- Change: Added CODEX_MODEL override and hardened subscription-status handler.
- Files: src/lib/ai/codex.ts, src/app/api/billing/subscription-status/route.ts
- Notes: Allows swapping Codex model without code changes.
- Next: Wire Prisma migrations and validate Razorpay + build flow in staging.

## 2026-01-27 21:44

- Change: Replaced non-ASCII UI glyphs with ASCII and re-ran tests.
- Files: src/components/ai/PricingPanel.tsx, src/components/ai/TopUpPanel.tsx, src/components/ai/FileTree.tsx, src/components/ai/BuildOutputPanel.tsx, src/components/ai/ChatWizardPanel.tsx
- Notes: UI copy now ASCII except required arrow in heading.
- Next: Verify /ai flow and Razorpay webhooks in staging.

## 2026-01-27 21:45

- Change: Added prompt safety guardrails to block secret-like content before build.
- Files: src/lib/ai/guardrails.ts, src/app/api/ai/build/route.ts
- Notes: Simple regex checks for obvious secrets.
- Next: Add more nuanced content checks if needed.

## 2026-01-27 21:46

- Change: Hardened build status endpoint when repo files are not ready.
- Files: src/app/api/ai/build/[id]/status/route.ts
- Notes: Returns empty file list until manifest exists.
- Next: End-to-end validation of preview startup.

## 2026-01-27 21:46

- Change: Ensure build pipeline propagates failures so telemetry can record build_failed.
- Files: src/lib/ai/buildEngine.ts
- Notes: Errors now rethrow after refund to trigger caller catch.
- Next: Validate telemetry events in logs.

## 2026-01-27 21:55

- Change: Replaced stub auth with Supabase magic link auth and token-based API authorization.
- Files: src/lib/supabaseClient.ts, src/lib/auth/requireUser.ts, src/app/api/ai/build/[id]/preview/[[...path]]/route.ts, src/components/ai/ChatWizardPanel.tsx, src/components/ai/AiBuilder.tsx, src/components/ai/BuildOutputPanel.tsx, .env
- Notes: Preview iframe now accepts token query param; API uses Bearer token.
- Next: Configure Supabase URL + anon key and test login flow.

## 2026-01-27 21:56

- Change: Added token-aware preview/download handling and ensured polling uses auth headers.
- Files: src/components/ai/AiBuilder.tsx, src/components/ai/BuildOutputPanel.tsx, src/app/api/ai/build/[id]/preview/[[...path]]/route.ts, src/lib/auth/requireUser.ts
- Notes: Preview iframe uses token query param; API auth checks support header or token.
- Next: Deploy Supabase auth config and verify iframe preview with live session.

## 2026-01-27 22:12

- Change: Added AI Builder link to homepage nav and header CTA.
- Files: src/app/page.tsx
- Notes: Link appears in desktop nav and header actions.
- Next: Consider adding mobile nav link if needed.

## 2026-01-27 22:18

- Change: Aligned AI Builder UI theme with homepage styling and improved AI Builder CTA styling.
- Files: src/components/ai/AiBuilder.tsx, src/components/ai/ChatWizardPanel.tsx, src/components/ai/BuildOutputPanel.tsx, src/components/ai/FileTree.tsx, src/components/ai/CodeViewer.tsx, src/components/ai/PricingPanel.tsx, src/components/ai/TopUpPanel.tsx, src/app/page.tsx, src/app/ai/page.tsx
- Notes: Switched to light theme with fuchsia/indigo accents for consistency.
- Next: Add mobile nav link if desired.

## 2026-01-27 22:20
- Change: Added mobile navigation drawer with AI Builder link on homepage.
- Files: src/app/page.tsx
- Notes: Mobile menu uses existing anchors and closes on selection.
- Next: Consider adding icon for menu button.

## 2026-01-27 22:21
- Change: Replaced mobile Menu label with hamburger icon.
- Files: src/app/page.tsx
- Notes: Added accessible sr-only label.
- Next: None.

## 2026-01-27 22:22
- Change: Restyled desktop nav bar to pill layout with softer fuchsia accents.
- Files: src/app/page.tsx
- Notes: AI Builder link highlighted within nav.
- Next: Evaluate CTA spacing on smaller breakpoints.

## 2026-01-27 22:26
- Change: Compressed header/nav typography and spacing to keep items on a single line.
- Files: src/app/page.tsx
- Notes: Shortened AI Builder CTA label and hid tagline on smaller widths.
- Next: Review at 1280px and 1024px breakpoints.

## 2026-02-02 11:35

- Change: Disabled Supabase lead storage to send form submissions directly via email only.
- Files: src/app/api/lead/route.ts
- Notes: Lead flow now skips DB insert and uses Gmail SMTP for delivery.
- Next: Verify Gmail SMTP app password and deliverability.

## 2026-02-02 12:05

- Change: Updated Next.js + React to patched versions to satisfy Vercel security checks.
- Files: package.json, package-lock.json
- Notes: Next.js 15.5.7, React/ReactDOM 19.1.2, eslint-config-next 15.5.7.
- Next: Trigger a Vercel build to confirm the CVE warning is cleared.

## 2026-02-02 15:40

- Change: Restored Dental AI and AI Builder landing pages, added solutions dropdown with icons, and wired demo video asset.
- Files: src/app/dental-ai/page.tsx, src/app/ai/page.tsx, src/app/page.tsx, src/app/sitemap.ts, public/icons/tooth.svg, public/icons/spark.svg, public/videos/iris-demo-call.mp4, theme.md
- Notes: Dental page uses the same lead form as homepage and includes demo video embed.
- Next: Verify nav dropdown behavior and test lead form submissions in staging.

## 2026-02-02 18:10

- Change: Added local-only AI Builder client UI with chat + terminal wiring and a localhost agent script.
- Files: src/components/ai/AiBuilderClient.tsx, src/app/ai/page.tsx, scripts/local-agent.mjs
- Notes: Agent runs on ws://localhost:8787 with an allowlist; UI connects for live logs.
- Next: Decide whether to expose via tunnel and refine allowed commands.

## 2026-02-02 18:40

- Change: Added quick actions bar, folder import upload, and optional tunnel instructions for the AI Builder demo.
- Files: src/components/ai/AiBuilderClient.tsx, scripts/local-agent.mjs, docs/local-agent.md
- Notes: Import writes into /imported-projects and agent can be gated for remote tunnel use.
- Next: Wire real preview rendering or command confirmation prompts if needed.

## 2026-02-02 20:15

- Change: Fully wired Omega AI Builder local demo with Codex CLI builds, live file explorer, preview, editor tabs, and animated loaders.
- Files: src/components/ai/AiBuilderClient.tsx, src/app/ai/page.tsx, scripts/local-agent.mjs, docs/local-agent.md, eslint.config.mjs, .gitignore
- Notes:
  - /ai now renders a single client UI (AiBuilderClient) with chat-guided specs, quick actions, build terminal, file explorer, code viewer, and live preview.
  - Explorer is VS Code-inspired: expandable folder tree, active file highlight, colored file dots, and open file tabs.
  - Editor shows line numbers + lightweight regex-based syntax highlighting (no external deps).
  - Live preview loads from the local agent (/preview?path=...) and supports collapse + fullscreen (opens new tab).
  - A polling loop runs every 2s while building to surface new files as they are generated.
  - Animated Omega-themed loaders show in hero, Explorer, and preview while a build is active.
  - Quick actions: create workspace, rebuild, lint, list files, install deps, stop build. Stop uses a server-side kill.
  - Local agent (scripts/local-agent.mjs):
    - WebSocket + HTTP server on ws/http://localhost:8787.
    - Endpoints: /list, /file, /preview, /import (with CORS enabled).
    - Workspace root: imported-projects/ (ignored by git + ESLint).
    - Uses Codex CLI by default (LOCAL_AGENT_USE_CODEX != 0). Model: gpt-5.2-codex unless overridden.
    - Prompting logic: asks questions unless full spec provided in one message.
    - Build runs codex exec with workspace-write sandbox; logs are sanitized to remove "Codex" brand references (shown as Omega Agent).
    - Stop command kills active process (SIGTERM -> SIGKILL fallback).
  - Env knobs:
    - NEXT_PUBLIC_LOCAL_AGENT_WS (override ws host), NEXT_PUBLIC_LOCAL_AGENT_TOKEN (optional auth).
    - LOCAL_AGENT_TOKEN (server auth), LOCAL_AGENT_ALLOW_REMOTE=1 (allow non-local access).
    - LOCAL_AGENT_USE_CODEX=0 to disable Codex CLI, LOCAL_AGENT_CODEX_MODEL to override model.
- Run locally:
    - Start agent: node scripts/local-agent.mjs
    - Start app: npm run dev (default http://localhost:3000/ai)

## 2026-02-03 09:10

- Change: Preserve original build intent when answering guided questions; prevent unrelated themes in generated content.
- Files: scripts/local-agent.mjs
- Notes:
  - Agent now stores the first user prompt as a spec seed and appends guided answers instead of replacing the original request.
  - Codex prompt tightened to require copy explicitly aligned with the request (e.g., event pages must stay on-event).
  - Reset clears both the spec seed and latest spec.
- Next: Consider exposing a visible “spec summary” panel in the UI so users can review the final build prompt before execution.

## 2026-02-04 15:46 IST

- Change: Added a full Builder Pricing page with Replit-style tiers, Omega Agent naming, and a plan comparison matrix.
- Change: Enforced credit usage in the local agent: per-token decrement, stop builds on zero credits, and block imports for the free plan.
- Change: AI Builder UI now shows live credits, plan, agent tier, last usage, low-credit warning, and upgrade CTA. Quick actions disable when out of credits.
- Change: Added /api/credits endpoint for profile credit reads and aligned pricing copy to avoid model/reasoning terms.
- Change: Build sanity fix to exclude imported-projects from TypeScript checks.
- Files: scripts/local-agent.mjs, src/components/ai/AiBuilderClient.tsx, src/app/pricing/page.tsx, src/app/api/credits/route.ts, src/app/page.tsx, src/app/sitemap.ts, tsconfig.json
- Notes:
  - Omega 1/2/3 labels replace model names in UI.
  - Pay-as-you-go usage is $1 per credit.
  - Import is disabled on Starter/Free with an upgrade prompt.

## 2026-02-04 16:01 IST

- Change: Standardized credits to token-usage calculations, added chat attachments, hardened workspace access, and expanded preview modes.
- Files: scripts/local-agent.mjs, src/components/ai/AiBuilderClient.tsx, README.md
- Notes:
  - Credits now use token usage with `LOCAL_AGENT_CREDIT_PER_USD` (default 1); plan copy aligns to 2 daily / 25 monthly / 40 monthly per user.
  - Builder chat includes an attachment menu for file/folder uploads stored under `references/` in the active workspace.
  - Local agent access is restricted to the active workspace with realpath, traversal, and symlink guards; downloads are blocked if symlinks exist.
  - Preview supports device frames for iOS/Android/WearOS/watchOS with Auto detection and a mode selector.
- Next: Decide how to stream emulator previews for native builds.
