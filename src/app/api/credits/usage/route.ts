import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const buildLocalAgentUrl = () => {
  const explicit =
    process.env.LOCAL_AGENT_HTTP ||
    process.env.NEXT_PUBLIC_LOCAL_AGENT_HTTP ||
    '';
  if (explicit) return explicit.replace(/\/$/, '');

  const wsUrl = process.env.NEXT_PUBLIC_LOCAL_AGENT_WS || '';
  if (wsUrl) {
    try {
      const url = new URL(wsUrl);
      url.protocol = url.protocol === 'wss:' ? 'https:' : 'http:';
      return url.toString().replace(/\/$/, '');
    } catch {
      // ignore
    }
  }
  return 'http://localhost:8787';
};

export async function GET() {
  const agentUrl = `${buildLocalAgentUrl()}/credits`;
  const token = process.env.LOCAL_AGENT_TOKEN || '';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const response = await fetch(agentUrl, {
      headers: token ? { 'x-omega-token': token } : undefined,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ usage: null }, { status: 200 });
    }
    const data = await response.json();
    return NextResponse.json({ usage: data?.usage || null });
  } catch {
    return NextResponse.json({ usage: null }, { status: 200 });
  }
}
