'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import OmegaTopNav from '@/components/layout/OmegaTopNav';
import { firebaseAuth, firestore } from '@/lib/firebaseClient';

type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
  questions?: string[];
};

type AgentStatus = 'connected' | 'offline' | 'error';
type ImportStatus = 'idle' | 'uploading' | 'success' | 'error';
type ImportMode = 'project' | 'attachments';
type PreviewMode = 'auto' | 'web' | 'mobile-android' | 'mobile-ios' | 'wearos' | 'watchos';
type TreeNode = {
  name: string;
  path: string;
  type: 'dir' | 'file';
  children?: TreeNode[];
};
type ProjectItem = {
  id: string;
  name: string;
  workspacePath?: string | null;
  updatedAt?: string | null;
};
type CreditsUsage = {
  inputTokens: number;
  outputTokens: number;
  credits: number;
  estimated?: boolean;
};
const FILE_TREE: string[] = [];
const INITIAL_LOGS: string[] = [];
const INITIAL_MESSAGES: ChatMessage[] = [];
const PLAN_META: Record<
  string,
  { label: string; agent: string; autonomy: string; creditCap?: number | null }
> = {
  starter: { label: 'Starter', agent: 'Omega 1', autonomy: 'Standard', creditCap: 0.25 },
  core: { label: 'Core', agent: 'Omega 2', autonomy: 'Advanced', creditCap: 25 },
  teams: { label: 'Teams', agent: 'Omega 3', autonomy: 'Advanced', creditCap: 40 },
  enterprise: { label: 'Enterprise', agent: 'Omega 3', autonomy: 'Elite', creditCap: null },
};
const formatCredits = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  if (value < 1) return value.toFixed(2);
  if (value < 100) return value.toFixed(1).replace(/\.0$/, '');
  return Math.round(value).toLocaleString();
};

const getAgentToken = () => process.env.NEXT_PUBLIC_LOCAL_AGENT_TOKEN || '';
const ADMIN_EMAIL = 'divertoai@gmail.com';

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
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentFolderInputRef = useRef<HTMLInputElement | null>(null);
  const chatInputRef = useRef<HTMLTextAreaElement | null>(null);
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
  const [isAttachmentDragging, setIsAttachmentDragging] = useState(false);
  const [workspaceLabel, setWorkspaceLabel] = useState('No workspace');
  const [hasWorkspace, setHasWorkspace] = useState(false);
  const [workspacePath, setWorkspacePath] = useState<string | null>(null);
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
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('auto');
  const [credits, setCredits] = useState<number | null>(null);
  const [planKey, setPlanKey] = useState('starter');
  const [agentLabel, setAgentLabel] = useState('Omega 1');
  const [autonomyLabel, setAutonomyLabel] = useState('Standard');
  const [creditCap, setCreditCap] = useState<number | null>(null);
  const [lastUsage, setLastUsage] = useState<CreditsUsage | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [workspaceNameDraft, setWorkspaceNameDraft] = useState('');
  const [renameStatus, setRenameStatus] = useState<'idle' | 'saving' | 'error' | 'success'>('idle');
  const [renameMessage, setRenameMessage] = useState('');
  const workspaceNameRef = useRef('');
  const userEmail = user?.email || '';
  const isAdminUser = Boolean(userEmail) && userEmail.toLowerCase() === ADMIN_EMAIL;
  const agentHeaders = useMemo(
    () => ({
      ...(agentToken ? { 'x-omega-token': agentToken } : {}),
      ...(userEmail ? { 'x-omega-user-email': userEmail } : {}),
    }),
    [agentToken, userEmail]
  );

  const resolveWorkspaceDisplayName = useCallback(
    (path?: string | null, fallback?: string) => {
      if (!path) return fallback || 'Workspace';
      const parts = path.split('/');
      return parts[parts.length - 1] || fallback || 'Workspace';
    },
    []
  );

  const requireAuth = useCallback(() => {
    if (user) return true;
    setShowAuthPrompt(true);
    return false;
  }, [user]);

  const runCommand = useCallback((command: string, payload?: { name?: string }) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setLogs((prev) => [...prev, 'Local agent not connected.'].slice(-200));
      return;
    }
    wsRef.current.send(JSON.stringify({ type: 'run', command, userEmail, ...payload }));
  }, [userEmail]);

  const requestWorkspaceCreation = useCallback(() => {
    const name = workspaceNameRef.current.trim();
    runCommand('new', name ? { name } : undefined);
  }, [runCommand]);

  const sendSimulatorRequest = useCallback(
    (platform: 'ios' | 'android', url: string) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        setLogs((prev) => [...prev, 'Local agent not connected.'].slice(-200));
        return;
      }
      wsRef.current.send(JSON.stringify({ type: 'simulator', platform, url, userEmail }));
    },
    [userEmail]
  );

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
    [agentHttpUrl, agentHeaders]
  );

  const downloadUrl = useMemo(() => {
    const url = new URL(agentHttpUrl);
    url.pathname = '/download';
    if (agentToken) {
      url.searchParams.set('token', agentToken);
    }
    return url.toString();
  }, [agentHttpUrl, agentToken]);

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
          headers: agentHeaders,
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

  const loadProjects = useCallback(async () => {
    if (!user) return;
    setProjectsLoading(true);
    try {
      const q = query(
        collection(firestore, 'projects'),
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const rows: ProjectItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as {
          name: string;
          workspacePath?: string | null;
          updatedAt?: { toDate?: () => Date } | string | null;
        };
        const updatedAtValue =
          typeof data.updatedAt === 'string'
            ? data.updatedAt
            : data.updatedAt?.toDate?.().toISOString();
        return {
          id: docSnap.id,
          name: data.name,
          workspacePath: data.workspacePath || null,
          updatedAt: updatedAtValue || null,
        };
      });
      setProjects(rows);
    } catch {
      // ignore
    } finally {
      setProjectsLoading(false);
    }
  }, [user]);

  const saveProject = useCallback(
    async (name: string, workspacePath: string) => {
      if (!user) return;
      try {
        const safeId = `${user.uid}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        const payload: Record<string, unknown> = {
          userId: user.uid,
          name,
          workspacePath,
          updatedAt: serverTimestamp(),
        };
        await setDoc(
          doc(firestore, 'projects', safeId),
          payload,
          { merge: true }
        );
        await loadProjects();
      } catch {
        // ignore project save failures
      }
    },
    [user, loadProjects]
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
          headers: agentHeaders,
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
    [agentHttpUrl, agentHeaders, buildPreviewUrl, loadFile]
  );

  const renameWorkspace = useCallback(async () => {
    if (!requireAuth()) return;
    if (!workspacePath) {
      setRenameStatus('error');
      setRenameMessage('No workspace selected.');
      return;
    }
    const nextName = workspaceNameDraft.trim();
    if (!nextName) {
      setRenameStatus('error');
      setRenameMessage('Enter a workspace name.');
      return;
    }
    try {
      setRenameStatus('saving');
      setRenameMessage('');
      const renameUrl = new URL(agentHttpUrl);
      renameUrl.pathname = '/workspaces/rename';
      const response = await fetch(renameUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...agentHeaders,
        },
        body: JSON.stringify({
          path: workspacePath,
          name: nextName,
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const payload = await response.json();
      const newName = payload?.name || nextName;
      const newPath = payload?.path || workspacePath;
      setWorkspaceLabel(newName);
      setWorkspacePath(newPath);
      setRenameStatus('success');
      setRenameMessage('Workspace renamed.');
      if (newPath) {
        await saveProject(newName, newPath);
      }
      await refreshFiles(undefined, true);
      void loadProjects();
      setTimeout(() => {
        setRenameStatus('idle');
        setRenameMessage('');
      }, 1500);
    } catch (error) {
      setRenameStatus('error');
      setRenameMessage(error instanceof Error ? error.message : 'Rename failed.');
    }
  }, [
    agentHttpUrl,
    agentHeaders,
    loadProjects,
    refreshFiles,
    requireAuth,
    saveProject,
    workspaceNameDraft,
    workspacePath,
  ]);

  const openProject = useCallback(
    async (project: ProjectItem) => {
      if (!requireAuth()) return;
      if (!project) return;
      try {
        const selectUrl = new URL(agentHttpUrl);
        selectUrl.pathname = '/workspaces/select';
        const response = await fetch(selectUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...agentHeaders,
          },
          body: JSON.stringify({
            path: project.workspacePath || undefined,
            name: project.name,
          }),
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const payload = await response.json();
          if (payload?.name) {
            const workspacePath = payload.path || project.workspacePath || null;
            const displayName = resolveWorkspaceDisplayName(workspacePath, payload.name);
            setWorkspaceLabel(displayName);
            setWorkspaceNameDraft(displayName);
            workspaceNameRef.current = displayName;
            setHasWorkspace(true);
            setWorkspacePath(workspacePath);
            if (Array.isArray(payload.files)) {
              setFileTree(payload.files);
            }
          await refreshFiles(undefined, true);
          if (project.workspacePath) {
            await saveProject(project.name, project.workspacePath);
          }
        }
      } catch (error) {
        setLogs((prev) => [
          ...prev,
          error instanceof Error ? `Project open failed: ${error.message}` : 'Project open failed.',
        ].slice(-200));
      }
    },
    [agentHttpUrl, agentHeaders, refreshFiles, requireAuth, resolveWorkspaceDisplayName, saveProject]
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
            path?: string;
            credits?: number;
            plan?: string;
            agent?: string;
            autonomy?: string;
            creditCap?: number | null;
            usage?: CreditsUsage;
            exhausted?: boolean;
          };

          if (msg.type === 'credits') {
            if (isAdminUser) {
              setPlanKey('enterprise');
              setCredits(null);
              setAgentLabel('Omega 3');
              setAutonomyLabel('Elite');
              setCreditCap(null);
              if (msg.usage) {
                setLastUsage(msg.usage);
              }
              return;
            }
            const nextPlan = msg.plan || 'starter';
            const meta = PLAN_META[nextPlan] || PLAN_META.starter;
            setPlanKey(nextPlan);
            setCredits(typeof msg.credits === 'number' ? msg.credits : null);
            setAgentLabel(msg.agent || meta.agent);
            setAutonomyLabel(msg.autonomy || meta.autonomy);
            setCreditCap(
              typeof msg.creditCap === 'number' || msg.creditCap === null
                ? msg.creditCap
                : meta.creditCap ?? null
            );
            if (msg.usage) {
              setLastUsage(msg.usage);
            }
            if (msg.exhausted) {
              setBuildStatus('Out of credits');
              setIsBuilding(false);
            }
            return;
          }

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
              requestWorkspaceCreation();
              setTimeout(() => runCommand('build'), 300);
            }
          }

          if (msg.type === 'workspace') {
            const name = typeof msg.name === 'string' ? msg.name : 'Workspace';
            const workspacePath = typeof msg.path === 'string' ? msg.path : null;
            const displayName = resolveWorkspaceDisplayName(workspacePath, name);
            setWorkspaceLabel(displayName);
            setWorkspaceNameDraft(displayName);
            workspaceNameRef.current = displayName;
            setWorkspacePath(workspacePath);
            if (Array.isArray(msg.files)) {
              setFileTree(msg.files);
            }
            setHasWorkspace(true);
            refreshFiles(undefined, true);
            if (workspacePath) {
              void saveProject(name, workspacePath);
            }
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
  }, [agentUrl, refreshFiles, requestWorkspaceCreation, runCommand, saveProject]);

  useEffect(() => {
    let cancelled = false;
    const loadCredits = async () => {
      if (isAdminUser) {
        setPlanKey('enterprise');
        setCredits(null);
        setAgentLabel('Omega 3');
        setAutonomyLabel('Elite');
        setCreditCap(null);
        return;
      }
      try {
        const response = await fetch('/api/credits', {
          cache: 'no-store',
        });
        if (!response.ok) return;
        const data = (await response.json()) as {
          credits?: number;
          plan?: string;
        };
        if (cancelled) return;
        const nextPlan = data.plan || 'starter';
        const meta = PLAN_META[nextPlan] || PLAN_META.starter;
        setPlanKey(nextPlan);
        setCredits(typeof data.credits === 'number' ? data.credits : null);
        setAgentLabel(meta.agent);
        setAutonomyLabel(meta.autonomy);
        setCreditCap(meta.creditCap ?? null);
      } catch {
        // Ignore credit fetch errors.
      }
    };
    loadCredits();
    return () => {
      cancelled = true;
    };
  }, [isAdminUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    void loadProjects();
  }, [user, loadProjects]);

  useEffect(() => {
    if (!user || !workspacePath || !workspaceLabel || !hasWorkspace) return;
    void saveProject(workspaceLabel, workspacePath);
  }, [user, workspaceLabel, workspacePath, hasWorkspace, saveProject]);

  useEffect(() => {
    let cancelled = false;
    const loadUsage = async () => {
      try {
        const response = await fetch('/api/credits/usage', { cache: 'no-store' });
        if (!response.ok) return;
        const data = (await response.json()) as { usage?: CreditsUsage };
        if (cancelled) return;
        if (data?.usage) {
          setLastUsage(data.usage);
        }
      } catch {
        // ignore usage fetch errors
      }
    };
    loadUsage();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const inputs = [uploadInputRef.current, attachmentFolderInputRef.current];
    inputs.forEach((input) => {
      if (!input) return;
      input.setAttribute('webkitdirectory', '');
      input.setAttribute('directory', '');
    });
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
    if (!requireAuth()) return;
    setWorkspaceLabel('New workspace');
    setMessages([]);
    setLogs([]);
    setFileTree([]);
    setDraft('');
    setImportStatus('idle');
    setImportMessage('');
    setIsDragging(false);
    setHasWorkspace(false);
    setWorkspacePath(null);
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
    setLastUsage(null);
    setWorkspaceNameDraft('');
    workspaceNameRef.current = '';
    setRenameStatus('idle');
    setRenameMessage('');
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'reset' }));
    }
  };

  const handleQuickAction = (action: string) => {
    if (!requireAuth()) return;
    if (action === 'new' && !hasPrompt) {
      setLogs((prev) => [
        ...prev,
        'Add your project details first (platform + stack) before creating a workspace.',
      ].slice(-200));
      return;
    }
    if (action === 'new') {
      requestWorkspaceCreation();
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

  const resizeChatInput = () => {
    const el = chatInputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const handleSend = () => {
    if (!requireAuth()) return;
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setHasPrompt(true);
    setDraft('');
    setTimeout(() => resizeChatInput(), 0);

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
    wsRef.current.send(JSON.stringify({ type: 'chat', text, userEmail }));
  };

  const handleOpenSimulator = (platform: 'ios' | 'android') => {
    if (!requireAuth()) return;
    const url = previewUrl || buildPreviewUrl('index.html');
    sendSimulatorRequest(platform, url);
  };

  // Appetize integration removed.

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

  const buildWorkspaceName = () =>
    `workspace-${new Date().toISOString().replace(/[:.]/g, '-')}`;

  const handleImportFiles = async (
    files: File[],
    options?: { mode?: ImportMode; pathPrefix?: string; projectName?: string }
  ) => {
    if (!requireAuth()) return;
    if (!files.length) return;
    const mode = options?.mode ?? 'project';
    setImportStatus('uploading');
    setImportMessage(mode === 'attachments' ? 'Uploading attachments...' : 'Uploading files...');

    try {
      const fallbackName = buildWorkspaceName();
      const rootName =
        files[0]?.webkitRelativePath?.split('/')?.[0] ||
        files[0]?.name?.split('/')?.[0] ||
        fallbackName;
      const targetName =
        options?.projectName ||
        (mode === 'attachments'
          ? hasWorkspaceRef.current && workspaceLabel !== 'No workspace'
            ? workspaceLabel
            : fallbackName
          : rootName);
      const rawPrefix = options?.pathPrefix ?? (mode === 'attachments' ? 'references' : '');
      const prefix = rawPrefix ? `${rawPrefix.replace(/\/+$/, '')}/` : '';

      const payloadFiles = await Promise.all(
        files.map(async (file) => ({
          path: `${prefix}${file.webkitRelativePath || file.name}`,
          contentBase64: await readFileAsBase64(file),
        }))
      );

      const importUrl = new URL(agentHttpUrl);
      importUrl.pathname = '/import';

      const response = await fetch(importUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...agentHeaders,
        },
        body: JSON.stringify({
          projectName: targetName,
          files: payloadFiles,
          mode,
          pathPrefix: rawPrefix || undefined,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Upload failed');
      }

      setImportStatus('success');
      setImportMessage(
        mode === 'attachments'
          ? 'Attachments uploaded successfully.'
          : 'Files uploaded successfully.'
      );
      if (!hasWorkspaceRef.current || mode !== 'attachments') {
        setWorkspaceLabel(targetName);
      }
      setHasWorkspace(true);
      setLogs((prev) => [...prev, 'Import complete. Files ready for updates.'].slice(-200));
      await refreshFiles(undefined, true);
    } catch (error) {
      setImportStatus('error');
      setImportMessage(error instanceof Error ? error.message : 'Upload failed.');
    }
  };

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (isFreePlan) {
      setImportStatus('error');
      setImportMessage('Import is available on Core and above.');
      event.target.value = '';
      return;
    }
    await handleImportFiles(files, { mode: 'project' });
    event.target.value = '';
  };

  const handleAttachmentInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    await handleImportFiles(files, { mode: 'attachments', pathPrefix: 'references' });
    event.target.value = '';
  };

  const handleAttachmentDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsAttachmentDragging(false);
    const files = Array.from(event.dataTransfer.files || []);
    await handleImportFiles(files, { mode: 'attachments', pathPrefix: 'references' });
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (planKey === 'starter') {
      setImportStatus('error');
      setImportMessage('Import is available on Core and above.');
      return;
    }
    const files = Array.from(event.dataTransfer.files || []);
    await handleImportFiles(files);
  };

  const planMeta = useMemo(() => PLAN_META[planKey] || PLAN_META.starter, [planKey]);
  const resolvedCreditCap = creditCap ?? planMeta.creditCap ?? null;
  const creditsValue = typeof credits === 'number' ? credits : null;
  const creditsDisplay = isAdminUser ? 'Unlimited' : formatCredits(creditsValue);
  const creditsRange = isAdminUser
    ? 'Unlimited'
    : resolvedCreditCap !== null
    ? `${creditsDisplay} / ${formatCredits(resolvedCreditCap)}`
    : creditsDisplay;
  const isFreePlan = planKey === 'starter';
  const upgradeUrl = '/pricing';

  const statusBadge =
    agentStatus === 'connected'
      ? 'bg-emerald-100 text-emerald-700'
      : agentStatus === 'error'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-slate-200 text-slate-600';

  const terminalStatus = activeCommand ? 'Running' : buildStatus;
  const terminalCommand = activeCommand || lastCommand || 'Idle';
  const highlightedLines = useMemo(() => {
    if (!selectedFile) return [''];
    const html = formatCode(fileContent || '', selectedFile);
    return html.split(/\r?\n/);
  }, [fileContent, selectedFile]);
  const resolvedPreviewMode = useMemo<PreviewMode>(() => {
    if (previewMode !== 'auto') return previewMode;
    const files = fileTree.map((file) => file.toLowerCase());
    const has = (value: string) => files.some((file) => file.includes(value));
    const isFlutter = has('pubspec.yaml') || has('lib/main.dart');
    const isAndroid =
      has('android/') || has('app/src/main') || has('build.gradle') || has('androidmanifest.xml');
    const isIOS =
      has('ios/') || has('.xcodeproj') || has('appdelegate.swift') || has('info.plist');
    const isWatchOS = has('watchos') || has('watchkit') || has('watch/extension');
    const isWearOS = has('wearos') || has('wear/') || has('wearable') || has('wearapp');
    if (isWatchOS) return 'watchos';
    if (isWearOS) return 'wearos';
    if (isIOS && !isAndroid) return 'mobile-ios';
    if (isAndroid && !isIOS) return 'mobile-android';
    if (isIOS && isAndroid) return 'mobile-ios';
    if (isFlutter) return 'mobile-android';
    return 'web';
  }, [previewMode, fileTree]);
  const previewLabelMap: Record<PreviewMode, string> = {
    auto: 'Auto',
    web: 'Web',
    'mobile-android': 'Android (S25 Ultra)',
    'mobile-ios': 'iOS (iPhone 17 Pro Max)',
    wearos: 'Wear OS (Round)',
    watchos: 'watchOS (Apple Watch Ultra)',
  };
  const previewModeLabel =
    previewMode === 'auto'
      ? `Auto (${previewLabelMap[resolvedPreviewMode]})`
      : previewLabelMap[previewMode];
  const isCompactPreview =
    resolvedPreviewMode === 'watchos' || resolvedPreviewMode === 'wearos';
  const activePreviewUrl = previewUrl;
  const previewBadge = previewUrl
    ? 'bg-emerald-100 text-emerald-700'
    : hasWorkspace
    ? 'bg-amber-100 text-amber-700'
    : 'bg-slate-100 text-slate-500';
  const previewPlaceholderCopy = (
    <div
      className="h-full w-full"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        className={`flex flex-col items-center justify-center gap-2 text-center ${
          isCompactPreview ? 'text-[10px] leading-tight max-w-[150px]' : 'text-xs max-w-[220px]'
        } text-slate-600`}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div className="rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm">
          <p className="font-semibold text-slate-700">No preview yet</p>
          <p className="mt-1 text-slate-500">
            Start a build or import a project to render a live preview.
          </p>
          <button
            type="button"
            onClick={() => {
              if (isFreePlan) return;
              uploadInputRef.current?.click();
            }}
            className={`mt-2 mx-auto block rounded-lg border font-semibold ${
              isCompactPreview ? 'px-2 py-1 text-[10px]' : 'px-3 py-1 text-[11px]'
            } ${
              isFreePlan
                ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Import project
          </button>
        </div>
      </div>
    </div>
  );
  const previewUnavailableCopy = (
    <div
      className="h-full w-full px-6"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className="rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 text-center text-xs text-slate-500 shadow-sm max-w-[240px]">
        Preview not available yet. Run a build to generate a preview file.
      </div>
    </div>
  );
  const previewShell = useMemo(
    () => ({
      outer: 'aspect-[16/9] w-full',
      frame: 'relative flex items-center justify-center rounded-xl border border-slate-200 bg-white',
    }),
    []
  );
  const renderSkinnedFrame = (
    frameSrc: string,
    screenStyle: React.CSSProperties,
    content: ReactNode,
    outerClassName = 'flex w-full justify-center',
    frameClassName = 'relative aspect-square w-full max-w-[240px]'
  ) => (
    <div className={outerClassName}>
      <div className={frameClassName}>
        <img
          src={frameSrc}
          alt="Device frame"
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
        <div
          className="absolute overflow-hidden bg-white"
          style={{
            ...screenStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
  const deviceSizes = {
    ios: { width: 428, height: 868, scale: 0.72 },
    android: { width: 380, height: 828, scale: 0.76 },
    watch: { width: 360, height: 380, scale: 0.9 },
  };

  const renderDeviceCssFrame = (
    deviceClass: string,
    size: { width: number; height: number; scale: number },
    content: ReactNode,
    extras: ReactNode
  ) => (
    <div className="flex w-full justify-center">
      <div
        className="flex items-start justify-center"
        style={{
          width: size.width * size.scale,
          height: size.height * size.scale,
        }}
      >
        <div
          className={`device ${deviceClass}`}
          style={{ transform: `scale(${size.scale})`, transformOrigin: 'top center' }}
        >
          <div className="device-frame">
            <div
              className="device-screen overflow-hidden bg-white"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {content}
            </div>
          </div>
          {extras}
        </div>
      </div>
    </div>
  );

  const renderPreviewShell = (content: ReactNode) => {
    if (resolvedPreviewMode === 'mobile-ios') {
      return renderDeviceCssFrame(
        'device-iphone-14-pro device-black',
        deviceSizes.ios,
        content,
        <>
          <div className="device-stripe" />
          <div className="device-header" />
          <div className="device-sensors" />
          <div className="device-btns" />
          <div className="device-power" />
          <div className="device-home" />
        </>
      );
    }
    if (resolvedPreviewMode === 'mobile-android') {
      return renderDeviceCssFrame(
        'device-galaxy-s8 device-blue',
        deviceSizes.android,
        content,
        <>
          <div className="device-stripe" />
          <div className="device-sensors" />
          <div className="device-btns" />
          <div className="device-power" />
        </>
      );
    }
    if (resolvedPreviewMode === 'watchos') {
      return renderDeviceCssFrame(
        'device-apple-watch-ultra',
        deviceSizes.watch,
        content,
        <>
          <div className="device-header" />
          <div className="device-btns" />
          <div className="device-stripe" />
          <div className="device-power" />
          <div className="device-home" />
        </>
      );
    }
    if (resolvedPreviewMode === 'wearos') {
      return renderSkinnedFrame(
        '/device-frames/wearos-flagship.svg',
        {
          top: '102px',
          bottom: '102px',
          left: '102px',
          right: '102px',
          borderRadius: '9999px',
        },
        content,
        'flex w-full justify-center',
        'relative aspect-square w-full max-w-[360px]'
      );
    }

    return (
      <div className={previewShell.outer}>
        <div className={`${previewShell.frame} h-full w-full overflow-hidden`}>{content}</div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <OmegaTopNav active="builder" variant="builder" />

      {showAuthPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-600">
                Sign in required
              </p>
              <button
                type="button"
                onClick={() => setShowAuthPrompt(false)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Continue with Omega</h2>
            <p className="mt-2 text-sm text-slate-600">
              Log in to start a build, save your workspace, and track credits.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:from-fuchsia-400 hover:to-indigo-400"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      )}

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
                Build. Edit. Deploy.
              </h1>
              <p className="mt-3 text-lg text-slate-700">
                Build websites, apps, and full products from a single prompt —{' '}
                <span className="font-semibold text-slate-900">with any tech stack that fits</span>.
              </p>
              <p className="mt-4 text-slate-600 text-lg">
                Web, mobile (iOS/Android), desktop (macOS/Windows/Linux), and wearable-ready builds
                with chat-guided specs, live previews, and production-grade output.
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Credits track Omega Agent usage across builds and previews. Higher tiers unlock deeper
                autonomy, longer runs, and multi-platform output. Pay-as-you-go is $1 per credit.
              </p>
              {isBuilding && (
                <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-fuchsia-200/70 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400/40" />
                    <span className="absolute h-4 w-4 rounded-full border border-indigo-400/70 animate-spin" />
                    <span className="relative h-2 w-2 rounded-full bg-fuchsia-500" />
                  </span>
                  Omega Agent is working
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-fuchsia-500">
                    Live
                    <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
                  </span>
                </div>
              )}
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
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Credits
                    </span>
                    <span className="font-semibold text-slate-700">{creditsRange}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Agent
                    </span>
                    <span className="font-semibold text-slate-700">{agentLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      Autonomy
                    </span>
                    <span className="font-semibold text-slate-700">{autonomyLabel}</span>
                  </div>
                </div>
                {lastUsage && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                    Last run: {formatCredits(lastUsage.credits)} credits • {lastUsage.inputTokens} in /{' '}
                    {lastUsage.outputTokens} out
                    {lastUsage.estimated ? ' (estimated)' : ''}
                  </div>
                )}
              </div>
              <div className="border-b border-slate-200 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Quick actions
                </p>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Workspace
                  </span>
                  <input
                    value={workspaceNameDraft}
                    onChange={(event) => {
                      const next = event.target.value;
                      setWorkspaceNameDraft(next);
                      workspaceNameRef.current = next;
                    }}
                    placeholder="Name this workspace"
                    className="flex-1 bg-transparent text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    { key: 'new', label: 'Rename workspace' },
                    { key: 'build', label: 'Rebuild with Omega Agent' },
                    { key: 'stop', label: 'Stop build' },
                    { key: 'lint', label: 'Run lint' },
                    { key: 'files', label: 'List files' },
                    { key: 'install', label: 'Install deps' },
                  ].map((action) => {
                    const disabled =
                      action.key === 'new'
                        ? !hasWorkspace
                        : action.key === 'stop'
                        ? !isBuilding
                        : !hasWorkspace || isBuilding;
                    return (
                      <button
                        key={action.key}
                        onClick={() => {
                          if (action.key === 'new') {
                            renameWorkspace();
                          } else {
                            handleQuickAction(action.key);
                          }
                        }}
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
                {renameMessage && (
                  <div
                    className={`mt-2 rounded-lg border px-2 py-1 text-[10px] ${
                      renameStatus === 'error'
                        ? 'border-rose-200 bg-rose-50 text-rose-600'
                        : renameStatus === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                        : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                  >
                    {renameMessage}
                  </div>
                )}
              </div>
              <div className="border-b border-slate-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Projects
                  </p>
                  <button
                    type="button"
                    onClick={() => loadProjects()}
                    className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500 hover:bg-slate-50"
                  >
                    Refresh
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {!user ? (
                    <p className="text-xs text-slate-500">
                      Sign in to view saved workspaces.
                    </p>
                  ) : projectsLoading ? (
                    <p className="text-xs text-slate-500">Loading projects…</p>
                  ) : projects.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      No saved projects yet. Start a build to create one.
                    </p>
                  ) : (
                    projects.slice(0, 5).map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-slate-700">{project.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {project.updatedAt
                              ? new Date(project.updatedAt).toLocaleString()
                              : '—'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openProject(project)}
                          className="rounded-full border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Open
                        </button>
                      </div>
                    ))
                  )}
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
                      <p className="mt-1 whitespace-pre-line">{message.text}</p>
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
                <div
                  className={`rounded-2xl border border-slate-200 bg-white p-3 transition ${
                    isAttachmentDragging ? 'border-fuchsia-300 bg-fuchsia-50/60' : ''
                  }`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsAttachmentDragging(true);
                  }}
                  onDragLeave={() => setIsAttachmentDragging(false)}
                  onDrop={handleAttachmentDrop}
                >
                  <div className="mb-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                    <span className="rounded-full bg-slate-100 px-2 py-1">Website</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Web app</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">iOS</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Android</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Desktop</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">Smartwatch</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">
                      {isFreePlan ? 'Import folder (Core+)' : 'Import folder'}
                    </span>
                  </div>
                  {isAttachmentDragging && (
                    <div className="mb-2 rounded-xl border border-dashed border-fuchsia-200 bg-white px-3 py-2 text-xs text-fuchsia-700">
                      Drop files to attach to this build.
                    </div>
                  )}
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsAttachmentMenuOpen((prev) => !prev)}
                        aria-label="Attach files"
                        title="Attach files or folders"
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                          <path d="M16.5 6.5v9a4.5 4.5 0 1 1-9 0V5.75a3.25 3.25 0 0 1 6.5 0v8.5a2 2 0 1 1-4 0V7h1.5v7.25a.5.5 0 0 0 1 0v-8.5a1.75 1.75 0 0 0-3.5 0V15.5a3 3 0 0 0 6 0v-9h1.5z" />
                        </svg>
                      </button>
                      {isAttachmentMenuOpen && (
                        <div className="absolute bottom-full left-0 mb-2 w-44 rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-600 shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAttachmentMenuOpen(false);
                              attachmentInputRef.current?.click();
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-slate-50"
                          >
                            <span className="text-slate-500">Upload files</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAttachmentMenuOpen(false);
                              attachmentFolderInputRef.current?.click();
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-slate-50"
                          >
                            <span className="text-slate-500">Upload folder</span>
                          </button>
                          <p className="px-2 pt-1 text-[10px] text-slate-400">
                            Images, video, pdf, docs, assets.
                          </p>
                        </div>
                      )}
                    </div>
                    <textarea
                      ref={chatInputRef}
                      value={draft}
                      rows={1}
                      onChange={(event) => {
                        setDraft(event.target.value);
                        resizeChatInput();
                      }}
                      onFocus={() => setIsAttachmentMenuOpen(false)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          if (!event.shiftKey) {
                            event.preventDefault();
                            handleSend();
                            resizeChatInput();
                          }
                        }
                      }}
                      onBlur={() => {
                        if (draft.trim()) setHasPrompt(true);
                      }}
                      placeholder="Describe your project or answer the guided questions..."
                      className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed max-h-40 overflow-y-auto"
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
                  <input
                    ref={attachmentInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleAttachmentInputChange}
                  />
                  <input
                    ref={attachmentFolderInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleAttachmentInputChange}
                  />
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
                      {activePreviewUrl ? 'Preview ready' : hasWorkspace ? 'Preview pending' : 'No preview'}
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
                      isFreePlan
                        ? 'border-slate-200 bg-slate-50/40'
                        : isDragging
                        ? 'border-fuchsia-300 bg-fuchsia-50'
                        : 'border-slate-300 bg-slate-50/70'
                    }`}
                    onDragOver={(event) => {
                      if (isFreePlan) return;
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
                      {isFreePlan && (
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>Import is available on Core and above.</span>
                          <Link
                            href={upgradeUrl}
                            className="inline-flex items-center rounded-full border border-fuchsia-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-fuchsia-600 hover:bg-fuchsia-50"
                          >
                            Upgrade plan
                          </Link>
                        </div>
                      )}
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
                      onClick={() => {
                        if (isFreePlan) return;
                        uploadInputRef.current?.click();
                      }}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                        isFreePlan
                          ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
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
                          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-500">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              Preview
                            </span>
                            <select
                              aria-label="Preview mode"
                              value={previewMode}
                              onChange={(event) => setPreviewMode(event.target.value as PreviewMode)}
                              className="bg-transparent text-[11px] font-semibold text-slate-600 focus:outline-none"
                            >
                              <option value="auto">Auto</option>
                              <option value="web">Web</option>
                              <option value="mobile-ios">iOS</option>
                              <option value="mobile-android">Android</option>
                              <option value="watchos">watchOS</option>
                              <option value="wearos">WearOS</option>
                            </select>
                          </div>
                          {(resolvedPreviewMode === 'mobile-ios' ||
                            resolvedPreviewMode === 'mobile-android') && (
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenSimulator(
                                  resolvedPreviewMode === 'mobile-ios' ? 'ios' : 'android'
                                )
                              }
                              className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-600 hover:bg-slate-100"
                            >
                              Open in Simulator
                            </button>
                          )}
                          <a
                            href={hasWorkspace ? downloadUrl : undefined}
                            aria-disabled={!hasWorkspace}
                            onClick={(event) => {
                              if (!hasWorkspace) {
                                event.preventDefault();
                              }
                            }}
                            className={`rounded-full px-3 py-1 font-semibold transition ${
                              hasWorkspace
                                ? 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                                : 'border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            Download source
                          </a>
                          <button
                            type="button"
                            onClick={() => setIsPreviewCollapsed((prev) => !prev)}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-500 hover:bg-slate-100"
                          >
                            {isPreviewCollapsed ? 'Show preview' : 'Hide preview'}
                          </button>
                          {activePreviewUrl && (
                            <a
                              href={activePreviewUrl}
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
                          <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span className="rounded-full bg-slate-100 px-2 py-1">
                              Mode: {previewModeLabel}
                            </span>
                            {resolvedPreviewMode !== 'web' && (
                              <span className="rounded-full bg-slate-100 px-2 py-1">
                                Native preview uses the generated storyboard. Run an emulator for full device preview.
                              </span>
                            )}
                          </div>
                          {activePreviewUrl ? (
                            renderPreviewShell(
                              <iframe
                                title="Live preview"
                                src={activePreviewUrl}
                                className="h-full w-full"
                              />
                            )
                          ) : fileTree.length === 0 ? (
                            renderPreviewShell(previewPlaceholderCopy)
                          ) : (
                            renderPreviewShell(previewUnavailableCopy)
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

    </main>
  );
}
