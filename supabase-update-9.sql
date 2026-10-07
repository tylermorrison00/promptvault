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
