# Omega App Builder Landing

Marketing site plus a local AI Builder demo built on Next.js App Router.

## Quick Start

```bash
npm run dev
```

Open `http://localhost:3000`.

## Local AI Builder Demo

```bash
node scripts/local-agent.mjs
npm run dev
```

Open `http://localhost:3000/ai`.

## Auth + Project Persistence

Omega uses Firebase Auth for signup/login (email + Google + GitHub) and stores project metadata in Firestore so users can resume previous builds.

Required environment variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `SUPABASE_URL` (still used by the local credits service)
- `SUPABASE_SERVICE_ROLE_KEY` (still used by the local credits service)
- `OMEGA_DEFAULT_USER_ID` (used for local credits and project ownership in demos)

Create a `profiles` and `projects` collection in Firestore (the app will auto-create docs on first login).

## Recent Updates (2026-02-04 20:30 IST)

- Added signup/login flows with Supabase Auth, plus account and project persistence pages.
- Builder now lists saved workspaces and can reopen them via the local agent.
- Workflow + Contact moved to standalone pages for cleaner navigation.

## Notes

- Native previews use the generated HTML storyboard inside device frames. Full device previews still require an emulator.
- Credit conversion can be tuned via `OMEGA_CREDIT_INPUT_PER_MILLION` and `OMEGA_CREDIT_OUTPUT_PER_MILLION`.
