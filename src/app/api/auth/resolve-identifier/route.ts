import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json();
  const raw = String(body?.identifier || '').trim().toLowerCase();
  if (!raw) {
    return NextResponse.json({ error: 'Missing identifier' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('email, phone, username')
    .eq('username', raw)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    email: data.email || null,
    phone: data.phone || null,
    username: data.username || null,
  });
}
