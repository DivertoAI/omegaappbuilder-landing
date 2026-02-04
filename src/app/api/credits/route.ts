import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const authHeader = request.headers.get('authorization') || '';
  const bearer = authHeader.replace('Bearer ', '').trim();
  let userId = url.searchParams.get('userId') || process.env.OMEGA_DEFAULT_USER_ID;

  if (bearer) {
    const { data } = await supabase.auth.getUser(bearer);
    if (data?.user?.id) {
      userId = data.user.id;
    }
  }

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, credits, plan')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message || 'Profile not found' }, { status: 500 });
  }

  return NextResponse.json({
    id: data.id,
    credits: Number(data.credits || 0),
    plan: data.plan || 'starter',
  });
}
