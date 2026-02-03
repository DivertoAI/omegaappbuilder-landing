#!/usr/bin/env node
import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { WebSocketServer } from 'ws';

const PORT = Number(process.env.LOCAL_AGENT_PORT || 8787);
const WORKDIR = process.env.LOCAL_AGENT_CWD || process.cwd();
const REQUIRED_TOKEN = process.env.LOCAL_AGENT_TOKEN || '';
const ALLOW_REMOTE = process.env.LOCAL_AGENT_ALLOW_REMOTE === '1';
const WORKSPACE_ROOT = path.join(WORKDIR, 'imported-projects');
const USE_CODEX_CLI = process.env.LOCAL_AGENT_USE_CODEX !== '0';
const CODEX_MODEL =
  process.env.LOCAL_AGENT_CODEX_MODEL ||
  process.env.CODEX_MODEL ||
  'gpt-5.2-codex';
const CODEX_BIN = process.env.LOCAL_AGENT_CODEX_BIN || 'codex';
let currentWorkspace = null;
let latestSpec = '';
let specSeed = '';
let activeProcess = null;
let activeProcessLabel = '';

const ALLOWED_COMMANDS = {
  new: ['node', '-e', 'process.exit(0)'],
  build: ['npm', 'run', 'build'],
  lint: ['npm', 'run', 'lint'],
  install: ['npm', 'install'],
  list: ['ls'],
  files: ['rg', '--files'],
};

const QUESTIONS = [
  'What are you building? (Website, web app, mobile app, desktop app, smartwatch)',
  'Target platforms? (iOS, Android, macOS, Windows, Linux, web)',
  'Preferred stack? (Next.js, React Native, Flutter, Electron, Tauri, etc.)',
  'Any architecture preference? (Monolith, modular, microservices, serverless)',
  'Key features and integrations? (Auth, payments, CRM, analytics)',
  'Starting from scratch or importing an existing project folder?',
];

const isFullSpec = (text) => {
  const value = String(text || '').toLowerCase();
  if (value.length < 24) return false;
  const checks = [
    /(website|web app|landing page|mobile|ios|android|desktop|macos|windows|linux|smartwatch)/,
    /(next|react|flutter|electron|tauri|vue|svelte|angular)/,
    /(modular|monolith|microservices|serverless|architecture)/,
    /(scratch|from scratch|greenfield|import)/,
  ];
  const score = checks.reduce((total, regex) => total + (regex.test(value) ? 1 : 0), 0);
  return score >= 3 || (value.includes(',') && score >= 2);
};

const applyCors = (req, res) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-omega-token');
};

const isLocalRequest = (req) => {
  const addr = req.socket.remoteAddress || '';
  return addr === '::1' || addr === '127.0.0.1' || addr.endsWith('127.0.0.1');
};

const getTokenFromRequest = (req) => {
  const url = new URL(req.url || '/', 'http://localhost');
  const headerToken = req.headers['x-omega-token'];
  return (Array.isArray(headerToken) ? headerToken[0] : headerToken) || url.searchParams.get('token');
};

const authorizeRequest = (req) => {
  if (!ALLOW_REMOTE && !isLocalRequest(req)) {
    return { ok: false, message: 'Localhost only' };
  }

  if (REQUIRED_TOKEN) {
    const token = getTokenFromRequest(req);
    if (token !== REQUIRED_TOKEN) {
      return { ok: false, message: 'Invalid token' };
    }
  }
  return { ok: true };
};

const server = http.createServer((req, res) => {
  applyCors(req, res);
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url?.startsWith('/list')) {
    handleList(req, res);
    return;
  }

  if (req.url?.startsWith('/file')) {
    handleFile(req, res);
    return;
  }

  if (req.url?.startsWith('/preview')) {
    handlePreview(req, res);
    return;
  }

  if (req.url?.startsWith('/download')) {
    handleDownload(req, res);
    return;
  }

  if (req.url?.startsWith('/import') && req.method === 'POST') {
    handleImport(req, res);
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Omega local agent running');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const auth = authorizeRequest(req);
  if (!auth.ok) {
    ws.close(1008, auth.message || 'Unauthorized');
    return;
  }

  let hasAskedQuestions = false;
  let hasCapturedSpec = false;

  ws.send(
    JSON.stringify({
      type: 'status',
      status: 'connected',
      cwd: WORKDIR,
      commands: Object.keys(ALLOWED_COMMANDS),
    })
  );

  ws.on('message', (data) => {
    let payload;
    try {
      payload = JSON.parse(data.toString());
    } catch {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON payload.' }));
      return;
    }

    if (payload.type === 'chat') {
      if (typeof payload.text === 'string' && payload.text.trim()) {
        const incoming = payload.text.trim();
        if (!hasAskedQuestions) {
          specSeed = incoming;
          latestSpec = incoming;
        } else if (!hasCapturedSpec) {
          latestSpec = specSeed
            ? `${specSeed}\nDetails: ${incoming}`
            : incoming;
        } else {
          latestSpec = specSeed
            ? `${specSeed}\nUpdate: ${incoming}`
            : incoming;
        }
      }
      if (!hasAskedQuestions) {
        if (isFullSpec(latestSpec)) {
          hasAskedQuestions = true;
          hasCapturedSpec = true;
          ws.send(
            JSON.stringify({
              type: 'ready',
              text: 'Specs captured. Creating a workspace and starting the build.',
              autoStart: true,
            })
          );
          return;
        }
        hasAskedQuestions = true;
        ws.send(
          JSON.stringify({
            type: 'chat',
            text: 'Got it. Here are a few quick questions to scope the build:',
            questions: QUESTIONS,
          })
        );
        return;
      }

      if (!hasCapturedSpec) {
        hasCapturedSpec = true;
        ws.send(
          JSON.stringify({
            type: 'ready',
            text: 'Specs captured. Creating a workspace and starting the build.',
            autoStart: true,
          })
        );
        return;
      }
      const intent = String(payload.text || '').toLowerCase();
      const wantsNewWorkspace = /new build|start over|fresh project|new project|start new/.test(intent);
      const wantsBuild = /build|run|compile|do it|start/.test(intent);

      if (wantsNewWorkspace || !currentWorkspace) {
        const workspace = createWorkspace();
        currentWorkspace = workspace.path;
        broadcast({
          type: 'workspace',
          name: workspace.name,
          files: workspace.files,
        });
        ws.send(
          JSON.stringify({
            type: 'log',
            line: `Workspace created at ${workspace.path}`,
          })
        );
      }

      if (wantsBuild && currentWorkspace) {
        ws.send(
          JSON.stringify({
            type: 'chat',
            text: 'Starting a build based on your latest update.',
          })
        );
        if (USE_CODEX_CLI) {
          runCodexBuild(ws, currentWorkspace, latestSpec);
        } else {
          runCommand(ALLOWED_COMMANDS.build, ws, currentWorkspace);
        }
        return;
      }

      ws.send(
        JSON.stringify({
          type: 'chat',
          text: 'Update received. Use the quick actions to rebuild or lint.',
        })
      );
      return;
    }

    if (payload.type === 'run') {
      const commandKey = String(payload.command || '');
      if (commandKey === 'stop') {
        if (activeProcess) {
          ws.send(
            JSON.stringify({
              type: 'log',
              line: `Stopping ${activeProcessLabel || 'active process'}...`,
            })
          );
          activeProcess.kill('SIGTERM');
          setTimeout(() => {
            if (activeProcess) {
              activeProcess.kill('SIGKILL');
            }
          }, 2000);
          return;
        }
        ws.send(
          JSON.stringify({
            type: 'error',
            message: 'No active build to stop.',
          })
        );
        return;
      }
      if (commandKey === 'new') {
        const workspace = createWorkspace();
        currentWorkspace = workspace.path;
        broadcast({
          type: 'workspace',
          name: workspace.name,
          files: workspace.files,
        });
        ws.send(
          JSON.stringify({
            type: 'log',
            line: `Workspace created at ${workspace.path}`,
          })
        );
        return;
      }

      if (commandKey === 'build' && USE_CODEX_CLI) {
        if (!currentWorkspace) {
          ws.send(
            JSON.stringify({
              type: 'error',
              message: 'No workspace active. Start a new build or import a project first.',
            })
          );
          return;
        }
        runCodexBuild(ws, currentWorkspace, latestSpec);
        return;
      }

      const command = ALLOWED_COMMANDS[commandKey];
      if (!command) {
        ws.send(
          JSON.stringify({
            type: 'error',
            message: `Command not allowed: ${commandKey}`,
          })
        );
        return;
      }

      if (!currentWorkspace) {
        ws.send(
          JSON.stringify({
            type: 'error',
            message: 'No workspace active. Start a new build or import a project first.',
          })
        );
        return;
      }

      runCommand(command, ws, currentWorkspace);
    }

    if (payload.type === 'reset') {
      hasAskedQuestions = false;
      hasCapturedSpec = false;
      latestSpec = '';
      specSeed = '';
      currentWorkspace = null;
      ws.send(
        JSON.stringify({
          type: 'status',
          status: 'connected',
          cwd: WORKDIR,
          commands: Object.keys(ALLOWED_COMMANDS),
        })
      );
    }
  });
});

const broadcast = (payload) => {
  const message = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
};

const runCommand = (command, ws, cwd) => {
  const [bin, ...args] = command;
  ws.send(JSON.stringify({ type: 'log', line: sanitizeLogLine(`$ ${[bin, ...args].join(' ')}`) }));

  const child = spawn(bin, args, {
    cwd,
    env: process.env,
    shell: false,
  });
  activeProcess = child;
  activeProcessLabel = [bin, ...args].join(' ');

  child.stdout.on('data', (chunk) => emitLines(ws, chunk));
  child.stderr.on('data', (chunk) => emitLines(ws, chunk));
  child.on('error', (error) => {
    ws.send(JSON.stringify({ type: 'error', message: error.message }));
  });
  child.on('close', (code) => {
    activeProcess = null;
    activeProcessLabel = '';
    ws.send(JSON.stringify({ type: 'exit', code }));
  });
};

const runCodexBuild = (ws, cwd, specText) => {
  const prompt = buildCodexPrompt(specText);
  const args = [
    '--no-alt-screen',
    'exec',
    '--skip-git-repo-check',
    '--full-auto',
    '--sandbox',
    'workspace-write',
    '-m',
    CODEX_MODEL,
    '-C',
    cwd,
  ];

  ws.send(
    JSON.stringify({
      type: 'log',
      line: 'Launching Omega Agent build...',
    })
  );

  const child = spawn(CODEX_BIN, args, {
    cwd,
    env: process.env,
    shell: false,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  activeProcess = child;
  activeProcessLabel = 'Omega Agent build';

  child.stdin.write(prompt);
  child.stdin.end();

  child.stdout.on('data', (chunk) => emitLines(ws, chunk));
  child.stderr.on('data', (chunk) => emitLines(ws, chunk));
  child.on('error', (error) => {
    ws.send(JSON.stringify({ type: 'error', message: error.message }));
  });
  child.on('close', (code) => {
    activeProcess = null;
    activeProcessLabel = '';
    ws.send(JSON.stringify({ type: 'exit', code }));
    syncWorkspaceFiles(cwd);
  });
};

const syncWorkspaceFiles = (cwd) => {
  try {
    const files = listFiles(cwd, cwd);
    broadcast({
      type: 'workspace',
      name: path.basename(cwd),
      files,
    });
  } catch (error) {
    broadcast({
      type: 'log',
      line: `File sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
};

const buildCodexPrompt = (specText) => {
  const spec = specText || 'Build a modern product landing page.';
  const wantsNext = /next(\\.js|js)?|nextjs/i.test(spec);
  const wantsReact = /react/i.test(spec);
  const stack = wantsNext
    ? 'Next.js 15 App Router + TypeScript + Tailwind CSS'
    : wantsReact
    ? 'React + Vite + TypeScript'
    : 'Static HTML/CSS/JS';

  return `
You are an expert software engineer and designer. Build a clean, production-ready project based on this request:

${spec}

Requirements:
- Use: ${stack}
- Ensure the site is responsive and visually polished.
- Create a single-page landing page with a strong hero, benefits, schedule/details, and a CTA.
- Include realistic placeholder copy that is explicitly aligned with the request (do not invent unrelated themes).
- If the request mentions an event, make all copy clearly about that event (name, agenda, venue, highlights).
- Generate a static preview file at /index.html that mirrors the main page for live preview.
- Keep dependencies minimal and make sure the project can run.
- If a framework is used, include package.json and minimal config.

Deliverable:
- Write the full project files into the current working directory.
- Do not ask questions. Proceed with sensible defaults.
`.trim();
};

const emitLines = (ws, chunk) => {
  const lines = chunk.toString().split(/\r?\n/).filter(Boolean);
  lines.forEach((line) => {
    ws.send(JSON.stringify({ type: 'log', line: sanitizeLogLine(line) }));
  });
};

const sanitizeLogLine = (line) => {
  let safe = String(line || '');
  safe = safe.replace(/gpt-5\.2-codex/gi, 'omega-agent');
  safe = safe.replace(/openai codex/gi, 'Omega Agent');
  safe = safe.replace(/\bcodex\b/gi, 'Omega Agent');
  return safe;
};

const handleImport = async (req, res) => {
  const auth = authorizeRequest(req);
  if (!auth.ok) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end(auth.message || 'Forbidden');
    return;
  }

  try {
    const body = await readJsonBody(req, 50 * 1024 * 1024);
    const files = Array.isArray(body?.files) ? body.files : [];
    if (!files.length) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('No files provided');
      return;
    }

    const projectName = sanitizeName(body?.projectName || 'imported-project');
    const targetDir = path.join(WORKSPACE_ROOT, projectName);
    fs.mkdirSync(targetDir, { recursive: true });

    let bytesWritten = 0;
    for (const file of files) {
      const relativePath = String(file?.path || '').replace(/^([/\\\\])+/, '');
      const safePath = relativePath.replace(/^(\.\.(\/|\\\\|$))+/, '');
      const destination = path.join(targetDir, safePath);
      if (!destination.startsWith(targetDir)) {
        continue;
      }
      const buffer = Buffer.from(String(file?.contentBase64 || ''), 'base64');
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, buffer);
      bytesWritten += buffer.length;
    }

    const listedFiles = listFiles(targetDir, targetDir);
    broadcast({
      type: 'log',
      line: `Imported ${files.length} files to ${targetDir} (${bytesWritten} bytes).`,
    });
    currentWorkspace = targetDir;
    broadcast({
      type: 'workspace',
      name: projectName,
      files: listedFiles,
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, files: files.length }));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(error instanceof Error ? error.message : 'Import failed');
  }
};

const readJsonBody = (req, limit) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > limit) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });

const sanitizeName = (value) => {
  const cleaned = String(value).trim().replace(/[^a-zA-Z0-9-_]/g, '-');
  return cleaned || 'imported-project';
};

const listFiles = (dir, rootDir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const fullPath = path.join(dir, entry.name);
    const rel = path.relative(rootDir, fullPath);
    if (entry.isDirectory()) {
      files.push(`${rel}/`);
      files.push(...listFiles(fullPath, rootDir));
    } else {
      files.push(rel);
    }
  }
  return files;
};

const resolveWorkspacePath = (requestPath) => {
  if (!currentWorkspace) return null;
  const safePath = String(requestPath || '').replace(/^([/\\\\])+/, '');
  const fullPath = path.join(currentWorkspace, safePath);
  if (!fullPath.startsWith(currentWorkspace)) return null;
  return fullPath;
};

const handleList = (req, res) => {
  const auth = authorizeRequest(req);
  if (!auth.ok) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end(auth.message || 'Forbidden');
    return;
  }

  if (!currentWorkspace) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No workspace active');
    return;
  }

  try {
    const files = listFiles(currentWorkspace, currentWorkspace);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ files }));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(error instanceof Error ? error.message : 'Failed to list files');
  }
};

const handleFile = (req, res) => {
  const auth = authorizeRequest(req);
  if (!auth.ok) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end(auth.message || 'Forbidden');
    return;
  }

  const url = new URL(req.url || '/', 'http://localhost');
  const targetPath = resolveWorkspacePath(url.searchParams.get('path'));
  if (!targetPath) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File not found');
    return;
  }

  try {
    const content = fs.readFileSync(targetPath, 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(content);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(error instanceof Error ? error.message : 'Failed to read file');
  }
};

const handlePreview = (req, res) => {
  const auth = authorizeRequest(req);
  if (!auth.ok) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end(auth.message || 'Forbidden');
    return;
  }

  const url = new URL(req.url || '/', 'http://localhost');
  const targetPath = resolveWorkspacePath(url.searchParams.get('path') || 'index.html');
  if (!targetPath) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Preview not found');
    return;
  }

  try {
    const content = fs.readFileSync(targetPath);
    const ext = path.extname(targetPath).toLowerCase();
    const contentType =
      ext === '.html'
        ? 'text/html'
        : ext === '.css'
        ? 'text/css'
        : ext === '.js'
        ? 'application/javascript'
        : 'text/plain';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(error instanceof Error ? error.message : 'Failed to load preview');
  }
};

const handleDownload = (req, res) => {
  const auth = authorizeRequest(req);
  if (!auth.ok) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end(auth.message || 'Forbidden');
    return;
  }

  if (!currentWorkspace) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No workspace active');
    return;
  }

  const filename = `${path.basename(currentWorkspace)}.zip`;
  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-Disposition': `attachment; filename="${filename}"`,
  });

  const zip = spawn('zip', ['-r', '-', '.', '-x', 'node_modules/*', '.next/*', '.git/*'], {
    cwd: currentWorkspace,
    env: process.env,
    shell: false,
  });

  zip.stdout.pipe(res);
  zip.stderr.on('data', () => {});
  zip.on('error', (error) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(error.message);
  });
  zip.on('close', () => {
    res.end();
  });
};

const createWorkspace = () => {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const name = `workspace-${stamp}`;
  const dir = path.join(WORKSPACE_ROOT, name);
  fs.mkdirSync(dir, { recursive: true });

  const specText = latestSpec || 'New project workspace.';
  fs.writeFileSync(path.join(dir, 'README.md'), 'Omega AI Builder workspace.');
  fs.writeFileSync(path.join(dir, 'spec.txt'), specText);

  if (!USE_CODEX_CLI) {
    const title = formatTitle(specText);
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root { color-scheme: light; }
      body { margin: 0; font-family: 'Inter', Arial, sans-serif; background: #f8fafc; color: #0f172a; }
      .hero { padding: 80px 24px; background: linear-gradient(120deg, #fce7f3, #e0e7ff); }
      .container { max-width: 980px; margin: 0 auto; }
      h1 { font-size: 42px; margin-bottom: 12px; }
      p { font-size: 18px; line-height: 1.6; margin: 0; color: #475569; }
      .cta { margin-top: 24px; display: inline-flex; padding: 12px 20px; border-radius: 12px; background: #111827; color: #fff; text-decoration: none; font-weight: 600; }
      .details { padding: 48px 24px; display: grid; gap: 16px; }
      .card { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
    </style>
  </head>
  <body>
    <section class="hero">
      <div class="container">
        <h1>${title}</h1>
        <p>${specText}</p>
        <a class="cta" href="#register">Register your spot</a>
      </div>
    </section>
    <section class="details">
      <div class="container">
        <div class="card">
          <h2>Event highlights</h2>
          <p>Guided routes, summit views, and a community ride across Switzerland.</p>
        </div>
        <div class="card" id="register">
          <h2>Register now</h2>
          <p>Reserve your slot and get the full itinerary in your inbox.</p>
        </div>
      </div>
    </section>
  </body>
</html>`;

    const packageJson = {
      name: 'omega-workspace',
      private: true,
      scripts: {
        build: 'node build.mjs',
        lint: 'node build.mjs --lint',
      },
    };

    const buildScript = `const lines = [
  'Bootstrapping workspace',
  'Generating scaffold',
  'Synthesizing UI components',
  'Writing routes and configs',
  'Running validation checks',
  'Build complete'
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const run = async () => {
  for (const line of lines) {
    console.log(line);
    await delay(250);
  }
};

run();\n`;

    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(packageJson, null, 2));
    fs.writeFileSync(path.join(dir, 'build.mjs'), buildScript);
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }

  const files = listFiles(dir, dir);
  return { path: dir, name, files };
};

const formatTitle = (spec) => {
  const lower = String(spec).toLowerCase();
  if (lower.includes('bike') && lower.includes('switz')) return 'Swiss Alpine Bike Event';
  if (lower.includes('bike')) return 'Bike Event';
  if (lower.includes('landing page')) return 'Landing Page';
  return 'New Product Launch';
};

server.listen(PORT, () => {
  fs.mkdirSync(WORKSPACE_ROOT, { recursive: true });
  console.log(`Omega local agent listening on ws://localhost:${PORT}`);
  console.log(`Working directory: ${WORKDIR}`);
  if (ALLOW_REMOTE && !REQUIRED_TOKEN) {
    console.warn('Warning: LOCAL_AGENT_ALLOW_REMOTE is enabled without LOCAL_AGENT_TOKEN.');
  }
});
