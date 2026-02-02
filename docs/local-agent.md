# Omega Local Agent (MVP Demo)

This project ships a **local-only agent** that lets the /ai page trigger safe commands and stream logs.

## 1) Start the local agent

```bash
node scripts/local-agent.mjs
```

If you see a missing `ws` module error, install it once:

```bash
npm install ws --legacy-peer-deps
```

Defaults:
- WebSocket: `ws://localhost:8787`
- HTTP import: `http://localhost:8787/import`
- Working dir: current repo

## 2) Start the web app

```bash
npm run dev
```

Open:
```
http://localhost:3000/ai
```

## 3) Commands allowed (safe allowlist)
Edit `ALLOWED_COMMANDS` in `scripts/local-agent.mjs` to add or remove commands.

By default:
- `build` → `npm run build`
- `lint` → `npm run lint`
- `install` → `npm install`
- `list` → `ls`
- `files` → `rg --files`

## 4) Import project folder
Click **Upload folder** or drag a folder into the import box. The agent writes files to:

```
<repo>/imported-projects/<folder-name>
```

## 5) Optional: safe tunnel for investor demo
If you need to show this remotely, expose the local agent via a tunnel and keep the token + allowlist.

### Cloudflared (recommended)
```bash
cloudflared tunnel --url http://localhost:8787
```

### ngrok
```bash
ngrok http 8787
```

### Required env for remote access
```bash
LOCAL_AGENT_ALLOW_REMOTE=1
LOCAL_AGENT_TOKEN=demo-token
NEXT_PUBLIC_LOCAL_AGENT_WS=wss://<your-tunnel-host>
NEXT_PUBLIC_LOCAL_AGENT_TOKEN=demo-token
```

**Important:** The agent is still protected by a strict command allowlist. Never expose it without a token.
