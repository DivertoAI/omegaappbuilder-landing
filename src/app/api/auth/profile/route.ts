import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const getUserFromRequest = async (request: Request) => {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
};

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const usernameRaw = String(body?.username || '').trim();
  const username = usernameRaw ? usernameRaw.toLowerCase() : null;
  const email = String(body?.email || user.email || '').trim() || null;
  const phone = String(body?.phone || user.phone || '').trim() || null;
  const defaultCredits = Number(process.env.OMEGA_STARTER_CREDITS || '0.25');

  if (username) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user.id)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }
  }

  const { data: current } = await supabase
    .from('profiles')
    .select('id, credits, plan')
    .eq('id', user.id)
    .maybeSingle();

  const payload = {
    id: user.id,
    username,
    email,
    phone,
    plan: current?.plan || 'starter',
    credits: typeof current?.credits === 'number' ? current.credits : defaultCredits,
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select('id, username, email, phone, plan, credits')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
