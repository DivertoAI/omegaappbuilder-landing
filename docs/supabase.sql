-- Supabase schema for Omega Builder auth + project persistence

-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  workspace_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists projects_user_name_unique
  on public.projects (user_id, name);

alter table public.projects enable row level security;

create policy "Projects are readable by owner"
  on public.projects
  for select
  using (auth.uid() = user_id);

create policy "Projects are insertable by owner"
  on public.projects
  for insert
  with check (auth.uid() = user_id);

create policy "Projects are updatable by owner"
  on public.projects
  for update
  using (auth.uid() = user_id);

-- Optional trigger to keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row
  execute function public.touch_updated_at();

-- Profiles updates for auth + username lookup
alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists phone text;

create unique index if not exists profiles_username_unique
  on public.profiles (lower(username));
