import { NextResponse } from 'next/server';
import { z } from 'zod';
import { omegaChatRequest } from '@/lib/omega-chat/client';

export const runtime = 'nodejs';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid login request.' }, { status: 400 });
  }

  const upstream = await omegaChatRequest({
    path: '/v1/auth/login',
    method: 'POST',
    body: parsed.data,
  });

  if (!upstream.ok) {
    return NextResponse.json({ error: upstream.error }, { status: upstream.status });
  }

  return NextResponse.json(upstream.data, { status: 200 });
}
