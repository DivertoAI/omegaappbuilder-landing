import { NextResponse } from 'next/server';
import { z } from 'zod';
import { omegaChatRequest } from '@/lib/omega-chat/client';

export const runtime = 'nodejs';

const schema = z.object({
  sessionToken: z.string().min(16),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Missing session token.' }, { status: 400 });
  }

  const upstream = await omegaChatRequest({
    path: '/v1/account',
    method: 'GET',
    token: parsed.data.sessionToken,
  });

  if (!upstream.ok) {
    return NextResponse.json({ error: upstream.error }, { status: upstream.status });
  }

  return NextResponse.json(upstream.data, { status: 200 });
}
