-- Schema for the Publicly waitlist site.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
--
-- Access model: the site uses the public "anon" key in the browser. Row Level
-- Security lets anyone INSERT a submission but nobody read/update/delete via
-- that key. You view submissions in the Supabase dashboard (Table Editor).

-- ============ Startup waitlist ============
create table public.startup_waitlist (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  startup_name  text,
  website       text,
  building      text,
  stage         text,
  momentum      text,
  builder_types text[],
  budget        text,
  founder_email text
);

-- ============ Builder applications ============
create table public.builder_applications (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  name              text,
  email             text,
  location          text,
  content_style     text,
  technical_fluency text,
  portfolio         text,
  social_links      text,
  can_post          text,
  preferred_work    text[],
  availability      text,
  video_path        text
);

-- ============ Lock the tables down with RLS ============
alter table public.startup_waitlist     enable row level security;
alter table public.builder_applications enable row level security;

create policy "anon can submit startup waitlist"
  on public.startup_waitlist for insert to anon with check (true);

create policy "anon can submit builder application"
  on public.builder_applications for insert to anon with check (true);

-- ============ Storage bucket for intro videos ============
insert into storage.buckets (id, name, public)
values ('builder-videos', 'builder-videos', false)
on conflict (id) do nothing;

create policy "anon can upload builder videos"
  on storage.objects for insert to anon
  with check (bucket_id = 'builder-videos');
