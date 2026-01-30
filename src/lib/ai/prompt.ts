import type { BuildConfig } from "@/lib/ai/types";

export function buildCodexPrompt(config: BuildConfig, userPrompt: string) {
  return `[BEGIN CODEX PROMPT]
You are generating a production-ready WEBSITE repository. Output MUST be ONLY JSON:
{
  "files": [
    {"path":"relative/path","content":"..."},
    ...
  ]
}
Rules:
- No output outside JSON.
- Use selected stack exactly.
- Include at root:
  README.md
  .env
  .env.example
  package.json
- .env and .env.example must list ALL required vars with DUMMY values.
- Never hardcode secrets.
- Include:
  - clean homepage
  - at least 2 additional pages/routes
  - components folder
  - API route if backend chosen + one sample endpoint
  - optional DB stub/migrations if DB chosen
  - scripts: dev, build, start, lint
- Must run via:
  npm install
  npm run dev
- Avoid paid external services by default.

User config:
Website type: ${config.websiteType}
Rendering: ${config.rendering}
Frontend: ${config.frontendStack}
Backend: ${config.backendStack}
DB: ${config.database}
Auth: ${config.auth}
Styling: ${config.styling}
Deployment: ${config.deployment}
App name: ${config.appName}

Core prompt:
${userPrompt}
[END CODEX PROMPT]`;
}
