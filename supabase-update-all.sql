-- ============================================================
-- PromptVault: ALL pending updates in ONE go (7 + 8 + 9)
-- Supabase Dashboard > SQL Editor > New query mein POORA paste karke RUN dabao
-- Kuch remove mat karo — jaisa hai wesa chalao. Dobara chalana safe hai.
-- ============================================================

-- ============================================================
-- PromptVault update 7: prompt requests (table + upload bucket)
-- Supabase Dashboard > SQL Editor > New query mein paste karke RUN dabao
-- ============================================================

-- 1. Prompt requests table
create table if not exists prompt_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  req_text text not null,
  link text not null,
  file_url text not null,
  status text not null default 'pending' check (status in ('pending','done')),
  created_at timestamptz default now()
);
alter table prompt_requests enable row level security;

drop policy if exists "public insert prompt_requests" on prompt_requests;
create policy "public insert prompt_requests"
  on prompt_requests for insert to anon, authenticated with check (true);

drop policy if exists "admin select prompt_requests" on prompt_requests;
create policy "admin select prompt_requests"
  on prompt_requests for select to anon, authenticated
  using ((auth.jwt()->>'email') = 'talhamohsin216@gmail.com');

drop policy if exists "admin update prompt_requests" on prompt_requests;
create policy "admin update prompt_requests"
  on prompt_requests for update to anon, authenticated
  using ((auth.jwt()->>'email') = 'talhamohsin216@gmail.com')
  with check ((auth.jwt()->>'email') = 'talhamohsin216@gmail.com');

-- 2. Request screenshots/videos bucket (public read via unguessable links, no listing)
insert into storage.buckets (id, name, public)
values ('request-media', 'request-media', true)
on conflict (id) do update set public = true;

drop policy if exists "public upload request media" on storage.objects;
create policy "public upload request media"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'request-media');

drop policy if exists "public read request media" on storage.objects;
create policy "public read request media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'request-media');

-- PromptVault update 8: Pro early-access system
-- Run this in Supabase Dashboard > SQL Editor.
-- Adds the early_until timestamp: when set and in the future, a Pro prompt
-- stays Pro-only; after it passes, Basic members unlock it automatically.

alter table prompts add column if not exists early_until timestamptz;

-- PromptVault update 9: niches + tools pages
-- Run in Supabase Dashboard > SQL Editor.

-- 1. Niches table
create table if not exists niches (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'tiktok',
  why_text text,
  detail_text text,
  media_url text,
  media_type text,
  is_pro boolean not null default false,
  early_until timestamptz,
  tags text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz default now(),
  link_url text);
alter table niches enable row level security;
drop policy if exists "public select niches" on niches;
create policy "public select niches" on niches for select using (true);
drop policy if exists "admin insert niches" on niches;
create policy "admin insert niches" on niches for insert
  with check ((auth.jwt() ->> 'email') = 'talhamohsin216@gmail.com');
drop policy if exists "admin update niches" on niches;
create policy "admin update niches" on niches for update
  using ((auth.jwt() ->> 'email') = 'talhamohsin216@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'talhamohsin216@gmail.com');
drop policy if exists "admin delete niches" on niches;
create policy "admin delete niches" on niches for delete
  using ((auth.jwt() ->> 'email') = 'talhamohsin216@gmail.com');

-- 2. Tools table
create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'video',
  description text,
  url text,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  is_paid boolean not null default false,
  tags text[] not null default '{}'
);
alter table tools add column if not exists is_paid boolean not null default false;
alter table tools add column if not exists tags text[] not null default '{}';
alter table tools enable row level security;
drop policy if exists "public select tools" on tools;
create policy "public select tools" on tools for select using (true);
drop policy if exists "admin insert tools" on tools;
create policy "admin insert tools" on tools for insert
  with check ((auth.jwt() ->> 'email') = 'talhamohsin216@gmail.com');
drop policy if exists "admin update tools" on tools;
create policy "admin update tools" on tools for update
  using ((auth.jwt() ->> 'email') = 'talhamohsin216@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'talhamohsin216@gmail.com');
drop policy if exists "admin delete tools" on tools;
create policy "admin delete tools" on tools for delete
  using ((auth.jwt() ->> 'email') = 'talhamohsin216@gmail.com');


alter table niches add column if not exists link_url text;
