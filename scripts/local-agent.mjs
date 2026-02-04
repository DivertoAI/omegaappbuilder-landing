#!/usr/bin/env node
import http from 'node:http';
import { spawn, execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { WebSocketServer } from 'ws';
import { createClient } from '@supabase/supabase-js';

const execFileAsync = promisify(execFile);
const PORT = Number(process.env.LOCAL_AGENT_PORT || 8787);
const WORKDIR = process.env.LOCAL_AGENT_CWD || process.cwd();
const REQUIRED_TOKEN = process.env.LOCAL_AGENT_TOKEN || '';
const ALLOW_REMOTE = process.env.LOCAL_AGENT_ALLOW_REMOTE === '1';
const WORKSPACE_ROOT = path.join(WORKDIR, 'imported-projects');
fs.mkdirSync(WORKSPACE_ROOT, { recursive: true });
const WORKSPACE_ROOT_REAL = fs.realpathSync(WORKSPACE_ROOT);
const USE_CODEX_CLI = process.env.LOCAL_AGENT_USE_CODEX !== '0';
const CODEX_MODEL =
  process.env.LOCAL_AGENT_CODEX_MODEL ||
  process.env.CODEX_MODEL ||
  'gpt-5.2-codex';
const CODEX_BIN = process.env.LOCAL_AGENT_CODEX_BIN || 'codex';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const PROFILE_TABLE = process.env.OMEGA_PROFILE_TABLE || 'profiles';
const DEFAULT_USER_ID =
  process.env.OMEGA_DEFAULT_USER_ID ||
  process.env.LOCAL_AGENT_USER_ID ||
  '';
const CREDIT_RATE_INPUT = Number(process.env.OMEGA_CREDIT_INPUT_PER_MILLION || '1');
const CREDIT_RATE_OUTPUT = Number(process.env.OMEGA_CREDIT_OUTPUT_PER_MILLION || '4');
const AGENT_MULTIPLIERS = {
  'Omega 1': 0.6,
  'Omega 2': 1.0,
  'Omega 3': 1.4,
};
const AUTONOMY_MULTIPLIERS = {
  Standard: 1.0,
  Advanced: 1.5,
  Elite: 2.0,
};
const PLAN_META = {
  starter: { label: 'Starter', agent: 'Omega 1', autonomy: 'Standard', creditCap: 0.25, allowImport: false },
  core: { label: 'Core', agent: 'Omega 2', autonomy: 'Advanced', creditCap: 25, allowImport: true },
  teams: { label: 'Teams', agent: 'Omega 3', autonomy: 'Advanced', creditCap: 40, allowImport: true },
  enterprise: { label: 'Enterprise', agent: 'Omega 3', autonomy: 'Elite', creditCap: null, allowImport: true },
};
const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;
let currentWorkspace = null;
let latestSpec = '';
let specSeed = '';
let activeProcess = null;
let activeProcessLabel = '';
let cachedProfile = null;
let cachedProfileAt = 0;
let lastUsageSnapshot = null;

const isPathInside = (target, root) => {
  if (!target || !root) return false;
  return target === root || target.startsWith(`${root}${path.sep}`);
};

const resolveWorkspaceDir = (workspacePath) => {
  if (!workspacePath) return null;
  const resolved = path.resolve(workspacePath);
  if (!isPathInside(resolved, WORKSPACE_ROOT_REAL) || resolved === WORKSPACE_ROOT_REAL) {
    return null;
  }
  try {
    const real = fs.realpathSync(resolved);
    if (!isPathInside(real, WORKSPACE_ROOT_REAL) || real === WORKSPACE_ROOT_REAL) {
      return null;
    }
    return real;
  } catch {
    return null;
  }
};

const getActiveWorkspace = () => {
  const safe = resolveWorkspaceDir(currentWorkspace);
  if (!safe) {
    currentWorkspace = null;
  }
  return safe;
};

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
  if (value.length < 18) return false;
  const checks = [
    /(website|web app|landing page|mobile|ios|android|desktop|macos|windows|linux|watchos|wearos|smartwatch)/,
    /(stack|framework|language|tech|next|react|flutter|react native|expo|electron|tauri|vue|svelte|angular|xamarin|kotlin|swift|objective-c|java|rust|go|c#|c\+\+|unity|godot|qt|gtk|wpf|winui|uwp|swiftui)/,
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

  if (req.url?.startsWith('/credits')) {
    handleCredits(req, res);
    return;
  }

  if (req.url?.startsWith('/list')) {
    handleList(req, res);
    return;
  }

  if (req.url?.startsWith('/workspaces/select') && req.method === 'POST') {
    handleWorkspaceSelect(req, res);
    return;
  }

  if (req.url?.startsWith('/workspaces')) {
    handleWorkspaces(req, res);
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

  void (async () => {
    const profile = await getProfile();
    const payload = buildCreditsPayload(profile);
    if (payload) {
      ws.send(JSON.stringify({ type: 'credits', ...payload }));
    }
  })();

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
          path: workspace.path,
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
          void runCodexBuild(ws, currentWorkspace, latestSpec);
        } else {
          runCommand(ALLOWED_COMMANDS.build, ws);
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
          path: workspace.path,
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
        void runCodexBuild(ws, currentWorkspace, latestSpec);
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

      runCommand(command, ws);
    }

    if (payload.type === 'simulator') {
      const platform = String(payload.platform || '').toLowerCase();
      const url = typeof payload.url === 'string' ? payload.url : '';
      if (platform !== 'ios' && platform !== 'android') {
        ws.send(
          JSON.stringify({
            type: 'error',
            message: 'Simulator platform not supported. Use iOS or Android.',
          })
        );
        return;
      }
      void openInSimulator(ws, platform, url);
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

const runCommand = (command, ws) => {
  const cwd = getActiveWorkspace();
  if (!cwd) {
    ws.send(
      JSON.stringify({
        type: 'error',
        message: 'Workspace path is invalid. Start a new build or import a project first.',
      })
    );
    return;
  }
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

const normalizeUrl = (raw) => {
  if (!raw) return null;
  try {
    return new URL(raw);
  } catch {
    return null;
  }
};

const rewriteAndroidUrl = (raw) => {
  const url = normalizeUrl(raw);
  if (!url) return null;
  if (['localhost', '127.0.0.1', '::1'].includes(url.hostname)) {
    url.hostname = '10.0.2.2';
  }
  return url.toString();
};

const findAndroidBinary = (name) => {
  const roots = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    path.join(process.env.HOME || '', 'Library/Android/sdk'),
  ].filter(Boolean);
  for (const root of roots) {
    const candidate =
      name === 'emulator'
        ? path.join(root, 'emulator', 'emulator')
        : path.join(root, 'platform-tools', name);
    if (fs.existsSync(candidate)) return candidate;
  }
  return name;
};

const pickIosDevice = async () => {
  try {
    const { stdout } = await execFileAsync('xcrun', ['simctl', 'list', 'devices', 'available', '-j']);
    const data = JSON.parse(stdout);
    const all = Object.values(data.devices || {}).flat();
    const iphones = all.filter((device) => device.isAvailable && /iphone/i.test(device.name));
    const device = iphones[0] || all.find((item) => item.isAvailable);
    return device?.udid || null;
  } catch {
    return null;
  }
};

const listAndroidAvds = async (emulatorBin) => {
  try {
    const { stdout } = await execFileAsync(emulatorBin, ['-list-avds']);
    return stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
};

const openInSimulator = async (ws, platform, url) => {
  if (platform === 'ios') {
    const device = await pickIosDevice();
    if (!device) {
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'No iOS Simulator device found. Open Xcode and install a simulator first.',
        })
      );
      return;
    }
    try {
      ws.send(JSON.stringify({ type: 'log', line: 'Opening iOS Simulator...' }));
      await execFileAsync('xcrun', ['simctl', 'boot', device]).catch(() => null);
      await execFileAsync('open', ['-a', 'Simulator']);
      if (url) {
        await execFileAsync('xcrun', ['simctl', 'openurl', device, url]);
      }
      ws.send(JSON.stringify({ type: 'log', line: 'iOS Simulator launched.' }));
    } catch (error) {
      ws.send(
        JSON.stringify({
          type: 'error',
          message: `Failed to open iOS Simulator: ${error?.message || 'Unknown error'}`,
        })
      );
    }
    return;
  }

  if (platform === 'android') {
    const emulatorBin = findAndroidBinary('emulator');
    const adbBin = findAndroidBinary('adb');
    const avds = await listAndroidAvds(emulatorBin);
    if (!avds.length) {
      ws.send(
        JSON.stringify({
          type: 'error',
          message: 'No Android AVDs found. Create one in Android Studio first.',
        })
      );
      return;
    }
    ws.send(JSON.stringify({ type: 'log', line: `Launching Android emulator (${avds[0]})...` }));
    const child = spawn(emulatorBin, ['-avd', avds[0]], {
      detached: true,
      stdio: 'ignore',
    });
    child.unref();
    const androidUrl = rewriteAndroidUrl(url);
    if (androidUrl) {
      setTimeout(() => {
        spawn(adbBin, ['shell', 'am', 'start', '-a', 'android.intent.action.VIEW', '-d', androidUrl], {
          stdio: 'ignore',
        });
      }, 6000);
    }
    ws.send(JSON.stringify({ type: 'log', line: 'Android emulator launched.' }));
  }
};

const runCodexBuild = async (ws, cwd, specText) => {
  const workspace = resolveWorkspaceDir(cwd);
  if (!workspace) {
    currentWorkspace = null;
    ws.send(
      JSON.stringify({
        type: 'error',
        message: 'Workspace path is invalid. Start a new build or import a project first.',
      })
    );
    return;
  }
  const profile = supabase ? await ensureCreditsAvailable(ws) : null;
  if (supabase && !profile) {
    return;
  }
  const prompt = buildCodexPrompt(specText);
  const args = [
    'exec',
    '--skip-git-repo-check',
    '--full-auto',
    '--sandbox',
    'workspace-write',
    '-m',
    CODEX_MODEL,
    '-C',
    workspace,
  ];

  ws.send(
    JSON.stringify({
      type: 'log',
      line: 'Launching Omega Agent build...',
    })
  );

  const child = spawn(CODEX_BIN, args, {
    cwd: workspace,
    env: process.env,
    shell: false,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  activeProcess = child;
  activeProcessLabel = 'Omega Agent build';

  const usageState = {
    inputTokens: estimateTokens(prompt),
    outputTokens: 0,
    totalTokens: 0,
    outputChars: 0,
    estimated: true,
  };

  const trackUsage = (chunk) => {
    const text = chunk.toString();
    usageState.outputChars += text.length;
    const lines = text.split(/\r?\n/).filter(Boolean);
    lines.forEach((line) => {
      const usage = extractUsageFromLine(line);
      if (usage) {
        usageState.inputTokens = usage.inputTokens;
        usageState.outputTokens = usage.outputTokens;
        usageState.totalTokens = usage.totalTokens;
        usageState.estimated = false;
      }
    });
  };

  child.stdin.write(prompt);
  child.stdin.end();

  child.stdout.on('data', (chunk) => {
    trackUsage(chunk);
    emitLines(ws, chunk);
  });
  child.stderr.on('data', (chunk) => {
    trackUsage(chunk);
    emitLines(ws, chunk);
  });
  child.on('error', (error) => {
    ws.send(JSON.stringify({ type: 'error', message: error.message }));
  });
  child.on('close', async (code) => {
    activeProcess = null;
    activeProcessLabel = '';
    ws.send(JSON.stringify({ type: 'exit', code }));
    syncWorkspaceFiles(workspace);
    const outputTokens =
      usageState.outputTokens || Math.max(1, Math.ceil(usageState.outputChars / 4));
    const inputTokens = usageState.inputTokens || estimateTokens(prompt);
    const totalTokens =
      usageState.totalTokens || Math.max(1, inputTokens + outputTokens);
    const usage = {
      inputTokens,
      outputTokens,
      totalTokens,
    };
    const effectivePlan = profile?.plan || 'starter';
    const creditsUsed = Number(
      calculateCredits(usage, effectivePlan).toFixed(4)
    );
    lastUsageSnapshot = {
      inputTokens,
      outputTokens,
      credits: creditsUsed,
      estimated: usageState.estimated,
      at: new Date().toISOString(),
    };
    if (supabase && profile) {
      const updated = await updateCredits(-creditsUsed);
      if (updated) {
        const payload = buildCreditsPayload(updated, {
          inputTokens,
          outputTokens,
          credits: creditsUsed,
          estimated: usageState.estimated,
        });
        if (payload) {
          broadcastCredits(payload);
        }
        if (Number(updated.credits || 0) <= 0) {
          ws.send(
            JSON.stringify({
              type: 'chat',
              text: 'Out of credits. Upgrade your plan to keep building.',
            })
          );
        }
      }
    }
  });
};

const syncWorkspaceFiles = (cwd) => {
  const workspace = resolveWorkspaceDir(cwd);
  if (!workspace) {
    currentWorkspace = null;
    broadcast({
      type: 'log',
      line: 'File sync skipped: invalid workspace path.',
    });
    return;
  }
  try {
    const files = listFiles(workspace, workspace);
    broadcast({
      type: 'workspace',
      name: path.basename(workspace),
      path: workspace,
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
  const wantsReactNative = /react native|react-native|expo/i.test(spec);
  const wantsFlutter = /flutter/i.test(spec);
  const wantsWeb = /(website|web app|landing page|marketing site)/i.test(spec) || wantsNext;
  const wantsNativePlatform = /(mobile|ios|android|desktop|macos|windows|linux|watchos|wearos|smartwatch)/i.test(
    spec
  );
  const mentionsNonWebStack =
    /(xamarin|kotlin|swift|objective-c|java|rust|go|c#|c\+\+|unity|godot|qt|gtk|wpf|winui|uwp|swiftui|tauri|electron)/i.test(
      spec
    ) || wantsFlutter || wantsReactNative;

  if (!wantsWeb && (wantsNativePlatform || mentionsNonWebStack)) {
    return `
You are an expert software engineer. Build a clean, production-ready app project based on this request:

${spec}

Requirements:
- Build a real app project (not a marketing landing page).
- Use the exact tech stack requested by the user (if any). If multiple options are given, choose the most standard.
- Keep dependencies minimal and make sure the project can run locally.
- Include canonical entry files for the chosen stack (examples: Flutter -> pubspec.yaml + lib/main.dart; Android/Kotlin -> settings.gradle + app/build.gradle + app/src/main/AndroidManifest.xml + MainActivity.kt; SwiftUI -> Package.swift + Sources/App.swift; React Native -> App.tsx).
- If the request is small, generate the simplest working app that satisfies it.
- Do not output only HTML/CSS/JS. Always include the native project files for the requested stack.
- In addition to the native project, generate a fast web preview variant of the same UI so the builder can render it immediately.
  - If the stack is React Native, implement the preview in a React Native Web style.
  - If the stack is Flutter, implement the preview in a Flutter Web style.
  - For any other native stack, implement the preview in a React Native Web style.
  - Keep the preview self-contained (HTML/CSS/JS only, no build step required).
- Place the preview at /index.html so the live preview panel can render it.
- Include a short README with run instructions.
- In the README, note that /index.html is a fast preview and the native project is the source of truth.

Deliverable:
- Write the full project files into the current working directory.
- Do not ask questions. Proceed with sensible defaults.
`.trim();
  }

  const stack = wantsNext
    ? 'Next.js 15 App Router + TypeScript + Tailwind CSS'
    : wantsReact && !wantsReactNative
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
  safe = safe.replace(/gpt-5\.1-codex-max/gi, 'omega-agent');
  safe = safe.replace(/gpt-5\.1-codex-mini/gi, 'omega-agent');
  safe = safe.replace(/gpt-5\.2/gi, 'omega-agent');
  safe = safe.replace(/openai codex/gi, 'Omega Agent');
  safe = safe.replace(/\bcodex\b/gi, 'Omega Agent');
  return safe;
};

const estimateTokens = (text) => {
  if (!text) return 0;
  return Math.max(1, Math.ceil(String(text).length / 4));
};

const parseUsagePayload = (usage) => {
  if (!usage || typeof usage !== 'object') return null;
  const input =
    usage.input_tokens ??
    usage.inputTokens ??
    usage.prompt_tokens ??
    usage.promptTokens ??
    0;
  const output =
    usage.output_tokens ??
    usage.outputTokens ??
    usage.completion_tokens ??
    usage.completionTokens ??
    0;
  const total =
    usage.total_tokens ??
    usage.totalTokens ??
    (Number(input || 0) + Number(output || 0));
  if (!Number.isFinite(input) && !Number.isFinite(output) && !Number.isFinite(total)) return null;
  return {
    inputTokens: Number(input || 0),
    outputTokens: Number(output || 0),
    totalTokens: Number(total || 0),
  };
};

const extractUsageFromLine = (line) => {
  const trimmed = String(line || '').trim();
  if (!trimmed.startsWith('{')) return null;
  try {
    const data = JSON.parse(trimmed);
    const direct = parseUsagePayload(data);
    if (direct) return direct;
    const nested =
      parseUsagePayload(data.usage) ||
      parseUsagePayload(data.usage_summary) ||
      parseUsagePayload(data.usageSummary) ||
      parseUsagePayload(data.metrics?.usage);
    return nested || null;
  } catch {
    return null;
  }
};

const resolvePlanMeta = (plan) => PLAN_META[plan] || PLAN_META.starter;

const getProfile = async () => {
  if (!supabase || !DEFAULT_USER_ID) return null;
  const now = Date.now();
  if (cachedProfile && now - cachedProfileAt < 5000) {
    return cachedProfile;
  }
  const { data, error } = await supabase
    .from(PROFILE_TABLE)
    .select('id, credits, plan')
    .eq('id', DEFAULT_USER_ID)
    .single();
  if (error || !data) return null;
  const profile = {
    id: data.id,
    credits: Number(data.credits || 0),
    plan: data.plan || 'starter',
  };
  cachedProfile = profile;
  cachedProfileAt = now;
  return profile;
};

const updateCredits = async (delta) => {
  if (!supabase || !DEFAULT_USER_ID) return null;
  const profile = await getProfile();
  if (!profile) return null;
  const nextCredits = Math.max(0, Number(profile.credits || 0) + delta);
  const { data, error } = await supabase
    .from(PROFILE_TABLE)
    .update({ credits: nextCredits })
    .eq('id', DEFAULT_USER_ID)
    .select('id, credits, plan')
    .single();
  if (error || !data) return null;
  const updated = {
    id: data.id,
    credits: Number(data.credits || 0),
    plan: data.plan || profile.plan || 'starter',
  };
  cachedProfile = updated;
  cachedProfileAt = Date.now();
  return updated;
};

const calculateCredits = (usage, plan) => {
  const meta = resolvePlanMeta(plan);
  const agentMultiplier = AGENT_MULTIPLIERS[meta.agent] || 1;
  const autonomyMultiplier = AUTONOMY_MULTIPLIERS[meta.autonomy] || 1;
  const inputCredits = ((usage.inputTokens || 0) / 1_000_000) * CREDIT_RATE_INPUT;
  const outputCredits = ((usage.outputTokens || 0) / 1_000_000) * CREDIT_RATE_OUTPUT;
  return (inputCredits + outputCredits) * agentMultiplier * autonomyMultiplier;
};

const buildCreditsPayload = (profile, usage) => {
  if (!profile) return null;
  const meta = resolvePlanMeta(profile.plan);
  return {
    credits: profile.credits,
    plan: profile.plan,
    agent: meta.agent,
    autonomy: meta.autonomy,
    creditCap: meta.creditCap ?? null,
    usage,
    exhausted: Number(profile.credits || 0) <= 0,
  };
};

const broadcastCredits = (payload) => {
  if (!payload) return;
  broadcast({ type: 'credits', ...payload });
};

const ensureCreditsAvailable = async (ws) => {
  const profile = await getProfile();
  if (!profile) return null;
  if (Number(profile.credits || 0) <= 0) {
    const payload = buildCreditsPayload(profile);
    if (payload) {
      ws.send(JSON.stringify({ type: 'credits', ...payload }));
    }
    ws.send(
      JSON.stringify({
        type: 'chat',
        text: 'Out of credits. Upgrade your plan to keep building.',
      })
    );
    return null;
  }
  return profile;
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
    const mode = String(body?.mode || 'project');
    const profile = await getProfile();
    const meta = profile ? resolvePlanMeta(profile.plan || 'starter') : PLAN_META.core;
    if (profile && !meta.allowImport && mode !== 'attachments') {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Import is available on Core and above.');
      return;
    }
    const files = Array.isArray(body?.files) ? body.files : [];
    if (!files.length) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('No files provided');
      return;
    }

    const projectName = sanitizeName(body?.projectName || 'imported-project');
    const targetDir = path.join(WORKSPACE_ROOT_REAL, projectName);
    fs.mkdirSync(targetDir, { recursive: true });
    const workspaceDir = resolveWorkspaceDir(targetDir);
    if (!workspaceDir) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid workspace path');
      return;
    }

    let bytesWritten = 0;
    for (const file of files) {
      const rawPath = String(file?.path || '');
      const trimmedPath = rawPath.replace(/^([/\\\\])+/, '');
      const parts = trimmedPath.split(/[/\\\\]+/).filter(Boolean);
      if (!parts.length || parts.some((part) => part === '..')) {
        continue;
      }
      const safePath = parts.join(path.sep);
      const destination = path.resolve(path.join(workspaceDir, safePath));
      if (!isPathInside(destination, workspaceDir)) continue;
      const buffer = Buffer.from(String(file?.contentBase64 || ''), 'base64');
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, buffer);
      bytesWritten += buffer.length;
    }

    const listedFiles = listFiles(workspaceDir, workspaceDir);
    broadcast({
      type: 'log',
      line: `Imported ${files.length} files to ${workspaceDir} (${bytesWritten} bytes).`,
    });
    currentWorkspace = workspaceDir;
    broadcast({
      type: 'workspace',
      name: projectName,
      path: workspaceDir,
      files: listedFiles,
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, files: files.length }));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(error instanceof Error ? error.message : 'Import failed');
  }
};

const handleCredits = async (req, res) => {
  const auth = authorizeRequest(req);
  if (!auth.ok) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end(auth.message || 'Forbidden');
    return;
  }

  const profile = await getProfile();
  const meta = resolvePlanMeta(profile?.plan || 'starter');
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      credits: profile ? Number(profile.credits || 0) : null,
      plan: profile?.plan || 'starter',
      agent: meta.agent,
      autonomy: meta.autonomy,
      creditCap: meta.creditCap ?? null,
      usage: lastUsageSnapshot,
    })
  );
};

const listWorkspaces = () => {
  const entries = fs.readdirSync(WORKSPACE_ROOT_REAL, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => {
      const workspacePath = path.join(WORKSPACE_ROOT_REAL, entry.name);
      const stat = fs.statSync(workspacePath);
      return {
        name: entry.name,
        path: workspacePath,
        updatedAt: stat.mtime.toISOString(),
      };
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
};

const handleWorkspaces = (req, res) => {
  const auth = authorizeRequest(req);
  if (!auth.ok) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end(auth.message || 'Forbidden');
    return;
  }
  const workspaces = listWorkspaces();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ workspaces }));
};

const handleWorkspaceSelect = async (req, res) => {
  const auth = authorizeRequest(req);
  if (!auth.ok) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end(auth.message || 'Forbidden');
    return;
  }

  try {
    const body = await readJsonBody(req, 1024 * 1024);
    const rawPath = body?.path ? String(body.path) : '';
    const rawName = body?.name ? String(body.name) : '';
    const target = rawPath || (rawName ? path.join(WORKSPACE_ROOT_REAL, rawName) : '');
    const workspaceDir = resolveWorkspaceDir(target);
    if (!workspaceDir) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid workspace path');
      return;
    }

    currentWorkspace = workspaceDir;
    const files = listFiles(workspaceDir, workspaceDir);
    broadcast({
      type: 'workspace',
      name: path.basename(workspaceDir),
      path: workspaceDir,
      files,
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        ok: true,
        name: path.basename(workspaceDir),
        path: workspaceDir,
        files,
      })
    );
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(error instanceof Error ? error.message : 'Failed to select workspace');
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
    if (entry.isSymbolicLink()) continue;
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

const containsSymlink = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.next') {
      continue;
    }
    if (entry.isSymbolicLink()) return true;
    if (entry.isDirectory()) {
      if (containsSymlink(path.join(dir, entry.name))) return true;
    }
  }
  return false;
};

const resolveWorkspacePath = (requestPath) => {
  const workspace = getActiveWorkspace();
  if (!workspace) return null;
  const safePath = String(requestPath || '').replace(/^([/\\\\])+/, '');
  const parts = safePath.split(/[/\\\\]+/).filter(Boolean);
  if (!parts.length || parts.some((part) => part === '..')) return null;
  const fullPath = path.resolve(path.join(workspace, parts.join(path.sep)));
  if (!isPathInside(fullPath, workspace)) return null;
  if (!fs.existsSync(fullPath)) return null;
  try {
    const real = fs.realpathSync(fullPath);
    if (!isPathInside(real, workspace)) return null;
  } catch {
    return null;
  }
  return fullPath;
};

const handleList = (req, res) => {
  const auth = authorizeRequest(req);
  if (!auth.ok) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end(auth.message || 'Forbidden');
    return;
  }

  const workspace = getActiveWorkspace();
  if (!workspace) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No workspace active');
    return;
  }

  try {
    const files = listFiles(workspace, workspace);
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

  const workspace = getActiveWorkspace();
  if (!workspace) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('No workspace active');
    return;
  }

  if (containsSymlink(workspace)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Workspace contains symlinks. Remove them before downloading.');
    return;
  }

  const filename = `${path.basename(workspace)}.zip`;
  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-Disposition': `attachment; filename="${filename}"`,
  });

  const zip = spawn('zip', ['-r', '-', '.', '-x', 'node_modules/*', '.next/*', '.git/*'], {
    cwd: workspace,
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
  const dir = path.join(WORKSPACE_ROOT_REAL, name);
  fs.mkdirSync(dir, { recursive: true });
  const safeDir = resolveWorkspaceDir(dir);
  if (!safeDir) {
    throw new Error('Invalid workspace path.');
  }

  const specText = latestSpec || 'New project workspace.';
  fs.writeFileSync(path.join(safeDir, 'README.md'), 'Omega AI Builder workspace.');
  fs.writeFileSync(path.join(safeDir, 'spec.txt'), specText);

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

    fs.writeFileSync(path.join(safeDir, 'package.json'), JSON.stringify(packageJson, null, 2));
    fs.writeFileSync(path.join(safeDir, 'build.mjs'), buildScript);
    fs.writeFileSync(path.join(safeDir, 'index.html'), html);
  }

  const files = listFiles(safeDir, safeDir);
  return { path: safeDir, name, files };
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
