'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
  questions?: string[];
};

type AgentStatus = 'connected' | 'offline' | 'error';
type ImportStatus = 'idle' | 'uploading' | 'success' | 'error';
type TreeNode = {
  name: string;
  path: string;
  type: 'dir' | 'file';
  children?: TreeNode[];
};

const FILE_TREE: string[] = [];
const INITIAL_LOGS: string[] = [];
const INITIAL_MESSAGES: ChatMessage[] = [];

const getAgentToken = () => process.env.NEXT_PUBLIC_LOCAL_AGENT_TOKEN || '';

export default function AiBuilderClient() {
  const calendlyUrl = 'https://calendly.com/hello-omegaappbuilder/30min';
  const agentToken = useMemo(getAgentToken, []);
  const agentUrl = useMemo(() => {
    const fromEnv = process.env.NEXT_PUBLIC_LOCAL_AGENT_WS;
    if (fromEnv) {
      return agentToken ? `${fromEnv}?token=${agentToken}` : fromEnv;
    }
    if (typeof window === 'undefined') {
      return 'ws://localhost:8787';
    }
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname || 'localhost';
    return `${protocol}://${host}:8787`;
  }, [agentToken]);
  const agentHttpUrl = useMemo(() => {
    const url = new URL(agentUrl);
    url.protocol = url.protocol === 'wss:' ? 'https:' : 'http:';
    return url.toString().replace(/\/$/, '');
  }, [agentUrl]);
  const wsRef = useRef<WebSocket | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const selectedFileRef = useRef<string | null>(null);
  const openFilesRef = useRef<string[]>([]);
  const stopRequestedRef = useRef(false);

  const [agentStatus, setAgentStatus] = useState<AgentStatus>('offline');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);
  const [fileTree, setFileTree] = useState<string[]>(FILE_TREE);
  const [draft, setDraft] = useState('');
  const [importStatus, setImportStatus] = useState<ImportStatus>('idle');
  const [importMessage, setImportMessage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [workspaceLabel, setWorkspaceLabel] = useState('No workspace');
  const [hasWorkspace, setHasWorkspace] = useState(false);
  const hasWorkspaceRef = useRef(hasWorkspace);
  const [hasPrompt, setHasPrompt] = useState(messages.length > 0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStatus, setBuildStatus] = useState('Idle');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [fileError, setFileError] = useState('');
  const [fileLoading, setFileLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [activeCommand, setActiveCommand] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);
  const [stopRequested, setStopRequested] = useState(false);

  const runCommand = useCallback((command: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setLogs((prev) => [...prev, 'Local agent not connected.'].slice(-200));
      return;
    }
    wsRef.current.send(JSON.stringify({ type: 'run', command }));
  }, []);

  const buildPreviewUrl = useCallback(
    (path: string) => {
      const preview = new URL(agentHttpUrl);
      preview.pathname = '/preview';
      preview.searchParams.set('path', path);
      if (agentToken) {
        preview.searchParams.set('token', agentToken);
      }
      return preview.toString();
    },
    [agentHttpUrl, agentToken]
  );

  const loadFile = useCallback(
    async (path: string) => {
      setSelectedFile(path);
      setFileContent('');
      setFileError('');
      setFileLoading(true);
      setOpenFiles((prev) => (prev.includes(path) ? prev : [...prev, path]));

      try {
        const fileUrl = new URL(agentHttpUrl);
        fileUrl.pathname = '/file';
        fileUrl.searchParams.set('path', path);

        const response = await fetch(fileUrl.toString(), {
          headers: {
            ...(agentToken ? { 'x-omega-token': agentToken } : {}),
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Failed to load file');
        }

        const text = await response.text();
        setFileContent(text);
      } catch (error) {
        setFileError(error instanceof Error ? error.message : 'Failed to load file');
      } finally {
        setFileLoading(false);
      }
    },
    [agentHttpUrl, agentToken]
  );

  const closeFileTab = (path: string) => {
    const nextTabs = openFilesRef.current.filter((item) => item !== path);
    setOpenFiles(nextTabs);
    if (selectedFileRef.current === path) {
      const fallback = nextTabs[nextTabs.length - 1];
      if (fallback) {
        loadFile(fallback);
      } else {
        setSelectedFile(null);
        setFileContent('');
        setFileError('');
      }
    }
  };

  const formatCode = (code: string, filePath: string | null) => {
    const ext = filePath?.split('.').pop()?.toLowerCase() || '';
    const escape = (value: string) =>
      value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    let html = escape(code);

    if (ext === 'html' || ext === 'htm') {
      html = html.replace(
        /(&lt;!--[\s\S]*?--&gt;)/g,
        '<span class="text-rose-300">$1</span>'
      );
      html = html.replace(
        /(&lt;[^&]*&gt;)/g,
        '<span class="text-sky-300">$1</span>'
      );
      html = html.replace(
        /("[^"]*"|'[^']*')/g,
        '<span class="text-amber-200">$1</span>'
      );
      return html;
    }

    const commentRegex = new RegExp('(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/.*$)', 'gm');
    const stringRegex = new RegExp(
      "(\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*'|`(?:\\\\.|[^`\\\\])*`)",
      'g'
    );
    const numberRegex = new RegExp('\\b(\\d+(?:\\.\\d+)?)\\b', 'g');

    html = html.replace(commentRegex, '<span class="text-slate-500">$1</span>');
    html = html.replace(stringRegex, '<span class="text-amber-200">$1</span>');
    html = html.replace(numberRegex, '<span class="text-violet-300">$1</span>');

    const keywords = [
      'const',
      'let',
      'var',
      'function',
      'return',
      'export',
      'import',
      'default',
      'class',
      'extends',
      'new',
      'if',
      'else',
      'for',
      'while',
      'switch',
      'case',
      'break',
      'async',
      'await',
      'try',
      'catch',
      'throw',
      'true',
      'false',
      'null',
      'undefined',
      'type',
      'interface',
      'public',
      'private',
      'protected',
      'readonly',
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    html = html.replace(keywordRegex, '<span class="text-sky-300">$1</span>');
    return html;
  };

  const refreshFiles = useCallback(
    async (preferFile?: string, force = false) => {
      if (!hasWorkspaceRef.current && !force) return;
      try {
        const listUrl = new URL(agentHttpUrl);
        listUrl.pathname = '/list';

        const response = await fetch(listUrl.toString(), {
          headers: {
            ...(agentToken ? { 'x-omega-token': agentToken } : {}),
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Failed to list files');
        }

        const data = await response.json();
        const rawFiles = Array.isArray(data?.files) ? (data.files as unknown[]) : [];
        const files = rawFiles.filter((file): file is string => typeof file === 'string');
        setFileTree(files);

        const preserved = preferFile || selectedFileRef.current;
        const defaultPreview =
          files.find((file) => file.toLowerCase().endsWith('index.html')) ||
          files.find((file) => file.toLowerCase().endsWith('.html')) ||
          '';

        if (defaultPreview) {
          setPreviewUrl(buildPreviewUrl(defaultPreview));
        } else {
          setPreviewUrl('');
        }

        const nextFile =
          (preserved && files.includes(preserved) ? preserved : '') ||
          defaultPreview ||
          files.find((file) => !file.endsWith('/')) ||
          '';

        if (nextFile) {
          await loadFile(nextFile);
        } else {
          setSelectedFile(null);
          setFileContent('');
        }
      } catch (error) {
        setLogs((prev) => [
          ...prev,
          error instanceof Error ? `File sync failed: ${error.message}` : 'File sync failed.',
        ].slice(-200));
      }
    },
    [agentHttpUrl, agentToken, buildPreviewUrl, loadFile]
  );

  const fileTreeNodes = useMemo(() => {
    const root: TreeNode = { name: 'root', path: '', type: 'dir', children: [] };
    const ensureChild = (parent: TreeNode, segment: string, path: string, type: 'dir' | 'file') => {
      if (!parent.children) parent.children = [];
      let child = parent.children.find((node) => node.name === segment && node.type === type);
      if (!child) {
        child = { name: segment, path, type, children: type === 'dir' ? [] : undefined };
        parent.children.push(child);
      }
      return child;
    };

    const addPath = (item: string) => {
      if (!item) return;
      const isDir = item.endsWith('/');
      const trimmed = item.replace(/\/$/, '');
      const segments = trimmed.split('/').filter(Boolean);
      let current = root;
      segments.forEach((segment, index) => {
        const isLast = index === segments.length - 1;
        const nodeType: 'dir' | 'file' = isLast ? (isDir ? 'dir' : 'file') : 'dir';
        const nodePath = segments.slice(0, index + 1).join('/') + (nodeType === 'dir' ? '/' : '');
        current = ensureChild(current, segment, nodePath, nodeType);
      });
    };

    fileTree.forEach((item) => addPath(item));

    const sortNodes = (nodes?: TreeNode[]) => {
      if (!nodes) return;
      nodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'dir' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      nodes.forEach((node) => sortNodes(node.children));
    };

    sortNodes(root.children);
    return root.children || [];
  }, [fileTree]);

  useEffect(() => {
    setExpandedFolders((prev) => {
      const next = { ...prev };
      fileTreeNodes.forEach((node) => {
        if (node.type === 'dir' && !(node.path in next)) {
          next[node.path] = true;
        }
      });
      return next;
    });
  }, [fileTreeNodes]);

  useEffect(() => {
    let cancelled = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (cancelled) return;
      const ws = new WebSocket(agentUrl);
      wsRef.current = ws;

      ws.onopen = () => setAgentStatus('connected');
      ws.onclose = () => {
        setAgentStatus('offline');
        if (!cancelled) {
          reconnectTimer = setTimeout(connect, 1500);
        }
      };
      ws.onerror = () => {
        setAgentStatus('error');
        try {
          ws.close();
        } catch {
          // ignore
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string) as {
            type?: string;
            line?: string;
            text?: string;
            questions?: string[];
            status?: AgentStatus;
            code?: number;
            message?: string;
            name?: string;
            files?: string[];
            autoStart?: boolean;
          };

          if (msg.type === 'status' && msg.status) {
            setAgentStatus(msg.status);
            return;
          }

          if (msg.type === 'log' && typeof msg.line === 'string') {
            const line = msg.line;
            setLogs((prev) => [...prev, line].slice(-200));
            if (line.startsWith('$ ')) {
              setActiveCommand(line);
              setLastCommand(line);
            }
            setIsBuilding(true);
            setBuildStatus('Building');
            return;
          }

          if (msg.type === 'exit') {
            setLogs((prev) => [...prev, `Process exited with code ${msg.code ?? '0'}`].slice(-200));
            setIsBuilding(false);
            setBuildStatus(stopRequestedRef.current ? 'Stopped' : 'Complete');
            setActiveCommand('');
            setStopRequested(false);
            refreshFiles(undefined, true);
            return;
          }

          if (msg.type === 'error' && msg.message) {
            setLogs((prev) => [...prev, `Agent error: ${msg.message}`].slice(-200));
            setIsBuilding(false);
            setBuildStatus('Error');
            setActiveCommand('');
            setStopRequested(false);
            return;
          }

          if (msg.type === 'chat' && typeof msg.text === 'string') {
            const text = msg.text;
            const questions = Array.isArray(msg.questions) ? msg.questions : undefined;
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', text, questions },
            ]);
            setHasPrompt(true);
          }

          if (msg.type === 'ready') {
            const text = typeof msg.text === 'string' ? msg.text : 'Specs captured. Ready to build.';
            setMessages((prev) => [...prev, { role: 'assistant', text }]);
            setHasPrompt(true);
            setBuildStatus('Queued');
            if (msg.autoStart && !hasWorkspaceRef.current) {
              runCommand('new');
              setTimeout(() => runCommand('build'), 300);
            }
          }

          if (msg.type === 'workspace') {
            const name = typeof msg.name === 'string' ? msg.name : 'Workspace';
            setWorkspaceLabel(name);
            if (Array.isArray(msg.files)) {
              setFileTree(msg.files);
            }
            setHasWorkspace(true);
            refreshFiles(undefined, true);
          }
        } catch {
          setLogs((prev) => [...prev, 'Agent message could not be parsed.'].slice(-200));
        }
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [agentUrl, refreshFiles, runCommand]);

  useEffect(() => {
    const input = uploadInputRef.current;
    if (input) {
      input.setAttribute('webkitdirectory', '');
      input.setAttribute('directory', '');
    }
  }, []);

  useEffect(() => {
    hasWorkspaceRef.current = hasWorkspace;
  }, [hasWorkspace]);

  useEffect(() => {
    selectedFileRef.current = selectedFile;
  }, [selectedFile]);

  useEffect(() => {
    openFilesRef.current = openFiles;
  }, [openFiles]);

  useEffect(() => {
    stopRequestedRef.current = stopRequested;
  }, [stopRequested]);

  useEffect(() => {
    if (!hasWorkspace || !isBuilding) return undefined;
    const interval = setInterval(() => {
      refreshFiles(undefined, true);
    }, 2000);
    return () => clearInterval(interval);
  }, [hasWorkspace, isBuilding, refreshFiles]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTree = (nodes: TreeNode[], depth = 0) =>
    nodes.map((node) => {
      const isDir = node.type === 'dir';
      const isOpen = expandedFolders[node.path] ?? false;
      const isActive = selectedFile === node.path;
      const extension = node.name.includes('.') ? node.name.split('.').pop() || '' : '';
      const accent =
        extension === 'html'
          ? 'bg-sky-400'
          : extension === 'md'
          ? 'bg-violet-400'
          : extension === 'json'
          ? 'bg-amber-400'
          : extension === 'js' || extension === 'ts'
          ? 'bg-emerald-400'
          : 'bg-slate-500';

      return (
        <div key={node.path}>
          <button
            type="button"
            onClick={() => {
              if (isDir) {
                toggleFolder(node.path);
              } else {
                loadFile(node.path);
              }
            }}
            className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left transition ${
              isDir
                ? 'text-slate-200 hover:bg-slate-900'
                : isActive
                ? 'bg-slate-800 text-white'
                : 'hover:bg-slate-900'
            }`}
            style={{ paddingLeft: `${Math.min(depth * 12 + 8, 48)}px` }}
          >
            {isDir ? (
              <svg
                viewBox="0 0 16 16"
                className={`h-3 w-3 text-slate-400 transition ${isOpen ? 'rotate-90' : ''}`}
                aria-hidden="true"
              >
                <path
                  d="M6 4.5 10 8 6 11.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <span className={`h-2 w-2 rounded-full ${accent}`} />
            )}
            <span className="truncate">{node.name}</span>
          </button>
          {isDir && isOpen && node.children?.length ? (
            <div>{renderTree(node.children, depth + 1)}</div>
          ) : null}
        </div>
      );
    });

  const handleStartBuild = () => {
    setWorkspaceLabel(`Workspace ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`);
    setMessages([]);
    setLogs([]);
    setFileTree([]);
    setDraft('');
    setImportStatus('idle');
    setImportMessage('');
    setIsDragging(false);
    setHasWorkspace(false);
    setHasPrompt(false);
    setIsBuilding(false);
    setBuildStatus('Idle');
    setSelectedFile(null);
    setFileContent('');
    setFileError('');
    setPreviewUrl('');
    setActiveCommand('');
    setLastCommand('');
    setOpenFiles([]);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'reset' }));
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'new' && !hasPrompt) {
      setLogs((prev) => [
        ...prev,
        'Add your project details first (platform + stack) before creating a workspace.',
      ].slice(-200));
      return;
    }
    if (action === 'build') {
      setBuildStatus('Building');
      setIsBuilding(true);
      setActiveCommand(`$ ${action}`);
    }
    if (action === 'stop') {
      setBuildStatus('Stopping');
      setStopRequested(true);
      setActiveCommand('$ stop');
    }
    runCommand(action);
    if (action === 'files') {
      refreshFiles();
    }
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setHasPrompt(true);
    setDraft('');

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Local agent is offline. Start the local agent to continue.',
        },
      ]);
      return;
    }
    wsRef.current.send(JSON.stringify({ type: 'chat', text }));
  };

  const readFileAsBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || '');
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = () => reject(reader.error || new Error('Failed to read file.'));
      reader.readAsDataURL(file);
    });

  const handleImportFiles = async (files: File[]) => {
    if (!files.length) return;
    setImportStatus('uploading');
    setImportMessage('Uploading project folder...');

    try {
      const rootName =
        files[0]?.webkitRelativePath?.split('/')?.[0] ||
        files[0]?.name?.split('/')?.[0] ||
        'imported-project';

      const payloadFiles = await Promise.all(
        files.map(async (file) => ({
          path: file.webkitRelativePath || file.name,
          contentBase64: await readFileAsBase64(file),
        }))
      );

      const importUrl = new URL(agentHttpUrl);
      importUrl.pathname = '/import';

      const response = await fetch(importUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(agentToken ? { 'x-omega-token': agentToken } : {}),
        },
        body: JSON.stringify({
          projectName: rootName,
          files: payloadFiles,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Upload failed');
      }

      setImportStatus('success');
      setImportMessage('Project folder imported successfully.');
      setWorkspaceLabel(rootName);
      setHasWorkspace(true);
      setLogs((prev) => [...prev, 'Import complete. Project ready for updates.'].slice(-200));
      await refreshFiles(undefined, true);
    } catch (error) {
      setImportStatus('error');
      setImportMessage(error instanceof Error ? error.message : 'Upload failed.');
    }
  };

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    await handleImportFiles(files);
    event.target.value = '';
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files || []);
    await handleImportFiles(files);
  };

  const statusBadge =
    agentStatus === 'connected'
      ? 'bg-emerald-100 text-emerald-700'
      : agentStatus === 'error'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-slate-200 text-slate-600';

  const previewBadge = previewUrl
    ? 'bg-emerald-100 text-emerald-700'
    : hasWorkspace
    ? 'bg-amber-100 text-amber-700'
    : 'bg-slate-100 text-slate-500';

  const terminalStatus = activeCommand ? 'Running' : buildStatus;
  const terminalCommand = activeCommand || lastCommand || 'Idle';
  const highlightedLines = useMemo(() => {
    if (!selectedFile) return [''];
    const html = formatCode(fileContent || '', selectedFile);
    return html.split(/\r?\n/);
  }, [fileContent, selectedFile]);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Omega logo" width={32} height={32} priority />
              <span className="font-semibold tracking-tight">
                Omega — AI Agents • 3D Web • Apps
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#builder" className="hover:text-fuchsia-600">Builder</a>
              <a href="#workflow" className="hover:text-fuchsia-600">Workflow</a>
              <a href="#contact" className="hover:text-fuchsia-600">Contact</a>
            </nav>
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Credits</p>
                  <p className="text-sm font-semibold text-slate-900">6,420</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Tier</p>
                  <p className="text-sm font-semibold text-slate-900">Growth</p>
                </div>
                <button className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50">
                  Manage
                </button>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white text-sm font-semibold">
                  DS
                </span>
                <div className="text-left">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">Account</p>
                  <p className="text-sm font-semibold text-slate-900">Diverto Studio</p>
                </div>
                <button className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50">
                  Settings
                </button>
              </div>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-xl px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
              >
                Book a Call
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="lg:hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Credits</p>
              <p className="text-sm font-semibold text-slate-900">6,420</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Tier</p>
              <p className="text-sm font-semibold text-slate-900">Growth</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white text-sm font-semibold">
              DS
            </span>
            <div className="text-left">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Account</p>
              <p className="text-sm font-semibold text-slate-900">Diverto Studio</p>
            </div>
          </div>
        </div>
        <a
          href={calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white"
        >
          Book a Call
        </a>
      </div>

      <section id="builder" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute -top-24 -left-20 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-fuchsia-100 to-indigo-100 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-indigo-100 to-sky-100 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
                Omega AI Builder
              </p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
                Build websites, apps, and full products from a single prompt — with any tech stack that fits.
              </h1>
              <p className="mt-4 text-slate-600 text-lg">
                Web, mobile (iOS/Android), desktop (macOS/Windows/Linux), and wearable-ready builds
                with chat-guided specs, live previews, and production-grade output.
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Credits + subscription based. Higher tiers unlock higher-reasoning models for deeper
                architecture and planning.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleStartBuild}
                className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-medium text-white shadow-md transition hover:from-fuchsia-400 hover:to-indigo-400"
              >
                Start a new build
              </button>
              <a
                href={calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Book a live demo
              </a>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[320px_1fr] min-h-[70vh]">
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Build chat</p>
                  <p className="text-xs text-slate-500">Guided setup for any product</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusBadge}`}
                >
                  {agentStatus === 'connected' ? 'Live' : 'Offline'}
                </span>
              </div>
              <div className="border-b border-slate-200 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      Status: {buildStatus}
                    </span>
                    {isBuilding && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Building
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setLogs([])}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 hover:bg-slate-50"
                    >
                      Clear logs
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAction('stop')}
                      disabled={!isBuilding}
                      className={`rounded-lg border px-2 py-1 text-[10px] font-semibold transition ${
                        isBuilding
                          ? 'border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100'
                          : 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      Stop build
                    </button>
                  </div>
                </div>
              </div>
              <div className="border-b border-slate-200 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Quick actions
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    { key: 'new', label: 'Create workspace' },
                    { key: 'build', label: 'Rebuild with Omega Agent' },
                    { key: 'stop', label: 'Stop build' },
                    { key: 'lint', label: 'Run lint' },
                    { key: 'files', label: 'List files' },
                    { key: 'install', label: 'Install deps' },
                  ].map((action) => {
                    const disabled =
                      action.key === 'new'
                        ? !hasPrompt
                        : action.key === 'stop'
                        ? !isBuilding
                        : !hasWorkspace || isBuilding;
                    return (
                      <button
                        key={action.key}
                        onClick={() => handleQuickAction(action.key)}
                        disabled={disabled}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                          disabled
                            ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex-1 space-y-4 px-4 py-5 text-sm text-slate-700 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-500">
                    {hasWorkspace
                      ? 'Workspace ready. Describe your project to start building.'
                      : hasPrompt
                      ? 'Prompt received. Click “Create workspace” to generate the project.'
                      : 'New project created. Share the platform + stack to enable workspace creation.'}
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={
                        message.role === 'assistant'
                          ? 'rounded-2xl bg-fuchsia-50/70 p-3'
                          : 'rounded-2xl bg-slate-50 p-3'
                      }
                    >
                      <div className="flex items-center gap-2">
                        <p
                          className={
                            message.role === 'assistant'
                              ? 'text-xs font-semibold text-fuchsia-700'
                              : 'text-xs font-semibold text-slate-500'
                          }
                        >
                          {message.role === 'assistant' ? 'Omega AI' : 'You'}
                        </p>
                      </div>
                      <p className="mt-1">{message.text}</p>
                      {message.questions && (
                        <div className="mt-3 space-y-2 text-xs text-slate-600">
                          {message.questions.map((question) => (
                            <p key={question}>{question}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-slate-200 px-4 py-4 mt-auto">
                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="mb-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                    <span className="rounded-full bg-slate-100 px-2 py-1">Website</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Web app</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">iOS</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Android</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Desktop</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Smartwatch</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Import folder</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                    <input
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleSend();
                        }
                      }}
                      onBlur={() => {
                        if (draft.trim()) setHasPrompt(true);
                      }}
                      placeholder="Describe your project or answer the guided questions..."
                      className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                      aria-label="Message Omega AI"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      aria-label="Send message"
                      className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-indigo-500 p-2 text-white shadow-sm hover:from-fuchsia-400 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!draft.trim()}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                        <path d="M3.4 20.6 21 12 3.4 3.4 2.5 10l10 2-10 2 .9 6.6z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                      Project: {workspaceLabel}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${previewBadge}`}>
                      {previewUrl ? 'Preview ready' : hasWorkspace ? 'Preview pending' : 'No preview'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full border border-slate-200 px-2 py-1">Web</span>
                    <span className="rounded-full border border-slate-200 px-2 py-1">iOS</span>
                    <span className="rounded-full border border-slate-200 px-2 py-1">Android</span>
                    <span className="rounded-full border border-slate-200 px-2 py-1">Desktop</span>
                  </div>
                </div>
                <div className="border-b border-slate-200 px-4 py-3">
                  <div
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed px-4 py-3 text-sm text-slate-600 transition ${
                      isDragging
                        ? 'border-fuchsia-300 bg-fuchsia-50'
                        : 'border-slate-300 bg-slate-50/70'
                    }`}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                  >
                    <div>
                      <p className="font-semibold text-slate-900">Import an existing project</p>
                      <p className="text-xs text-slate-500">
                        Drop your project folder to finish or modify it. We will map the structure and continue the build.
                      </p>
                      {importMessage && (
                        <p
                          className={`mt-2 text-xs font-semibold ${
                            importStatus === 'success'
                              ? 'text-emerald-600'
                              : importStatus === 'error'
                              ? 'text-rose-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {importMessage}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => uploadInputRef.current?.click()}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Upload folder
                    </button>
                    <input
                      ref={uploadInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileInputChange}
                    />
                  </div>
                </div>
                <div className="grid gap-0 xl:grid-cols-[240px_1fr]">
                  <aside className="border-r border-slate-200 bg-slate-950 text-slate-100">
                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
                        Explorer
                      </p>
                      <span className="text-[10px] text-slate-500">Workspace</span>
                    </div>
                    {isBuilding && (
                      <div className="px-4 py-2 border-b border-slate-800">
                        <div className="flex items-center gap-3 text-[11px] text-slate-300">
                          <span className="relative flex h-6 w-6 items-center justify-center">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400/50" />
                            <span className="absolute h-4 w-4 rounded-full border border-fuchsia-400/60 animate-spin" />
                            <span className="relative h-2 w-2 rounded-full bg-fuchsia-400" />
                          </span>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-100">
                              Omega Agent is generating files
                            </p>
                            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                              <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-sky-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Files
                    </div>
                    <div className="px-2 pb-4 space-y-1 text-xs text-slate-200 font-mono">
                      {fileTree.length === 0 ? (
                        <p className="px-2 text-slate-500">No files yet</p>
                      ) : (
                        renderTree(fileTreeNodes)
                      )}
                    </div>
                  </aside>
                  <div className="flex flex-col">
                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Live Preview
                        </p>
                        <div className="flex items-center gap-2 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setIsPreviewCollapsed((prev) => !prev)}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-500 hover:bg-slate-100"
                          >
                            {isPreviewCollapsed ? 'Show preview' : 'Hide preview'}
                          </button>
                          {previewUrl && (
                            <a
                              href={previewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white hover:bg-slate-800"
                            >
                              Fullscreen
                            </a>
                          )}
                        </div>
                      </div>
                      {isBuilding && (
                        <div className="mt-3 rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 shadow-sm">
                          <div className="flex items-center gap-3 text-[11px] text-slate-600">
                            <span className="relative flex h-5 w-5 items-center justify-center">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400/40" />
                              <span className="absolute h-4 w-4 rounded-full border border-indigo-400/70 animate-spin" />
                              <span className="relative h-2 w-2 rounded-full bg-fuchsia-500" />
                            </span>
                            <div className="flex-1">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                Omega Agent working
                              </p>
                              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                                <div className="h-full w-3/4 animate-pulse rounded-full bg-gradient-to-r from-fuchsia-500 via-indigo-400 to-sky-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {!isPreviewCollapsed && (
                        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
                          {previewUrl ? (
                            <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
                              <iframe
                                title="Live preview"
                                src={previewUrl}
                                className="h-full w-full"
                              />
                            </div>
                          ) : fileTree.length === 0 ? (
                            <div className="aspect-[16/9] w-full rounded-xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white flex flex-col items-center justify-center gap-2 text-center text-xs text-slate-400 px-6">
                              <p className="font-semibold text-slate-500">No preview yet</p>
                              <p>Start a build or import a project to render a live preview.</p>
                            <button
                              type="button"
                              onClick={() => uploadInputRef.current?.click()}
                              className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                            >
                              Import project
                            </button>
                          </div>
                          ) : (
                            <div className="aspect-[16/9] w-full rounded-xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center text-xs text-slate-400">
                              Preview not available yet. Run a build to generate a preview file.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="border-b border-slate-800 bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Editor
                    </div>
                    {openFiles.length > 0 && (
                      <div className="border-b border-slate-800 bg-slate-950 px-2 py-2">
                        <div className="flex flex-wrap gap-2">
                          {openFiles.map((file) => (
                            <button
                              key={file}
                              type="button"
                              onClick={() => loadFile(file)}
                              className={`group inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-[11px] font-semibold transition ${
                                selectedFile === file
                                  ? 'border-fuchsia-400 bg-slate-900 text-white'
                                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              <span className="truncate">{file.split('/').pop() || file}</span>
                              <span
                                role="button"
                                aria-label={`Close ${file}`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  closeFileTab(file);
                                }}
                                className="rounded-full px-1 text-slate-500 hover:text-white"
                              >
                                ×
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex-1 bg-slate-950 px-4 py-4 font-mono text-xs text-slate-100 overflow-y-auto max-h-[340px]">
                      {fileTree.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 px-4 py-6 text-center text-xs text-slate-400">
                          <p className="font-semibold text-slate-300">No files yet</p>
                          <p className="mt-1">Start a build to generate files in this workspace.</p>
                        </div>
                      ) : fileLoading ? (
                        <p className="text-slate-400">Loading file...</p>
                      ) : fileError ? (
                        <p className="text-rose-300">{fileError}</p>
                      ) : selectedFile ? (
                        <div className="grid grid-cols-[auto_1fr] gap-4">
                          <div className="select-none text-right text-[10px] text-slate-500">
                            {highlightedLines.map((_, index) => (
                              <div key={`line-${index}`} className="leading-5">
                                {index + 1}
                              </div>
                            ))}
                          </div>
                          <div className="text-slate-200">
                            {highlightedLines.map((line, index) => (
                              <div
                                key={`code-${index}`}
                                className="leading-5 whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: line || ' ' }}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-400">Select a file to view its contents.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Build terminal</p>
                    <p className="text-xs text-slate-500">omega-builder@latest</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                      Status: {terminalStatus}
                    </span>
                    {activeCommand && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Running
                      </span>
                    )}
                  </div>
                </div>
                <div className="border-b border-slate-900 bg-slate-950 px-4 py-2 text-[11px] text-slate-400 font-mono">
                  {terminalCommand}
                </div>
                <div className="bg-slate-950 px-4 py-4 font-mono text-xs text-emerald-200 space-y-2 min-h-[220px] max-h-[320px] overflow-y-auto">
                  {logs.length === 0 ? (
                    <p className="text-slate-500">Waiting for build logs…</p>
                  ) : (
                    logs.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section id="workflow" className="py-16 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: 'Describe the product',
                description:
                  'Share the product goal, audience, and platforms (web, mobile, desktop, wearable).',
              },
              {
                title: 'Pick stack + architecture',
                description:
                  'Choose preferred frameworks or let the AI recommend the best fit.',
              },
              {
                title: 'Generate + ship',
                description:
                  'Get clean code, previews, and a deploy-ready build in one workspace.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                name: 'Starter',
                detail: 'Lower reasoning model',
                credits: '2,000 credits / mo',
                notes: 'Great for simple websites and MVPs.',
              },
              {
                name: 'Growth',
                detail: 'Balanced reasoning model',
                credits: '8,000 credits / mo',
                notes: 'Best for full web apps and mobile builds.',
              },
              {
                name: 'Elite',
                detail: 'Highest reasoning model',
                credits: '20,000 credits / mo',
                notes: 'Ideal for complex systems and multi-platform products.',
              },
            ].map((tier) => (
              <div key={tier.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">{tier.name}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{tier.detail}</p>
                <p className="mt-2 text-sm text-slate-600">{tier.credits}</p>
                <p className="mt-4 text-sm text-slate-500">{tier.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-slate-50/60 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-bold text-slate-900">Start your build</h2>
              <p className="mt-3 text-slate-600">
                Share your product, goals, and timeline. We will map the build scope, confirm your
                content needs, and send a clear delivery plan.
              </p>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-600">
                  You will receive a quick audit of your current site and a build outline within 48 hours.
                </p>
              </div>
            </div>

            <form
              className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 grid gap-3 shadow-sm"
              method="POST"
              action="/api/lead?redirect=/thank-you"
            >
              <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" />
              <input type="hidden" name="service" value="ai_builder" />

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="grid gap-1 text-sm">
                  <span className="text-slate-700">Name</span>
                  <input
                    className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    placeholder="Your name"
                    name="name"
                    required
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-slate-700">Email</span>
                  <input
                    className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    type="email"
                    placeholder="you@company.com"
                    name="email"
                    required
                  />
                </label>
              </div>

              <label className="grid gap-1 text-sm">
                <span className="text-slate-700">Company</span>
                <input
                  className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="Company"
                  name="company"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="text-slate-700">Website/App URL</span>
                <input
                  className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="https://example.com"
                  name="url"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="text-slate-700">Goal (30 days)</span>
                <textarea
                  className="rounded-xl bg-white border border-slate-300 px-4 py-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 min-h-[120px]"
                  placeholder="What should the AI builder help you ship?"
                  name="message"
                />
              </label>

              <button
                className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 font-medium text-white hover:from-fuchsia-400 hover:to-indigo-400 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500"
                aria-label="Send builder request"
              >
                Send Builder Request
              </button>

              <p className="text-xs text-slate-500">
                Submitting this form adds you to our updates. You can opt out anytime.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
