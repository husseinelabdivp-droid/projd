-- ClipForge AI — initial schema

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free','pro','agency')),
  credits int not null default 5,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  original_video_url text,
  thumbnail_url text,
  duration numeric,
  content_type text check (content_type in ('gaming','twitch','youtube','podcast','other')),
  requested_clip_count int default 5,
  status text not null default 'uploading'
    check (status in ('uploading','processing','analyzing','generating_clips','completed','failed')),
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_projects_user_id on projects(user_id);

create table if not exists clips (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  start_time numeric not null,
  end_time numeric not null,
  score numeric,
  hook_score numeric,
  entertainment_score numeric,
  emotion_score numeric,
  context_score numeric,
  shareability_score numeric,
  hook text,
  title text,
  description text,
  hashtags text[],
  caption_style text default 'classic'
    check (caption_style in ('classic','bold','gaming','minimal')),
  status text not null default 'pending'
    check (status in ('pending','rendering','completed','failed')),
  output_url text,
  thumbnail_url text,
  created_at timestamptz not null default now()
);
create index if not exists idx_clips_project_id on clips(project_id);

create table if not exists processing_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  clip_id uuid references clips(id) on delete cascade,
  type text not null check (type in
    ('extract_audio','transcribe','detect_clips','render_clip','generate_captions')),
  status text not null default 'queued'
    check (status in ('queued','running','completed','failed')),
  progress int not null default 0,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_jobs_project_id on processing_jobs(project_id);
create index if not exists idx_jobs_status on processing_jobs(status);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text,
  plan text not null check (plan in ('free','pro','agency')),
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);
create unique index if not exists idx_subs_user_id on subscriptions(user_id);

-- Row Level Security
alter table profiles enable row level security;
alter table projects enable row level security;
alter table clips enable row level security;
alter table processing_jobs enable row level security;
alter table subscriptions enable row level security;

create policy "profiles_self_select" on profiles for select using (id = auth.uid());
create policy "profiles_self_update" on profiles for update using (id = auth.uid());

create policy "projects_owner_all" on projects for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "clips_via_project_select" on clips for select using (
  exists (select 1 from projects where projects.id = clips.project_id and projects.user_id = auth.uid())
);
create policy "clips_via_project_update" on clips for update using (
  exists (select 1 from projects where projects.id = clips.project_id and projects.user_id = auth.uid())
);

create policy "jobs_via_project_select" on processing_jobs for select using (
  exists (select 1 from projects where projects.id = processing_jobs.project_id and projects.user_id = auth.uid())
);

create policy "subscriptions_self_select" on subscriptions for select using (user_id = auth.uid());

-- Auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
