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

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('projects')
    .select('id, name, workspace_path, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects: data || [] });
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body?.name || '').trim();
  const workspacePath = body?.path ? String(body.path) : null;
  if (!name) {
    return NextResponse.json({ error: 'Missing project name' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('projects')
    .upsert(
      {
        user_id: user.id,
        name,
        workspace_path: workspacePath,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,name' }
    )
    .select('id, name, workspace_path, updated_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data });
}
