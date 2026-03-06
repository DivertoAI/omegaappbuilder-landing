import { NextResponse } from 'next/server';
import { z } from 'zod';
import { omegaChatRequest } from '@/lib/omega-chat/client';

export const runtime = 'nodejs';

const schema = z.object({
  sessionToken: z.string().min(16),
  planId: z.enum(['omega_limited_9999', 'omega_limited_29999', 'omega_unlimited_49999']),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payment request.' }, { status: 400 });
  }

  const upstream = await omegaChatRequest({
    path: '/v1/payments/create',
    method: 'POST',
    token: parsed.data.sessionToken,
    body: {
      plan_id: parsed.data.planId,
    },
  });

  if (!upstream.ok) {
    return NextResponse.json({ error: upstream.error }, { status: upstream.status });
  }

  return NextResponse.json(upstream.data, { status: 200 });
}
