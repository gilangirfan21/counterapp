-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).
-- Safe to re-run: table uses `if not exists`, policies are dropped and
-- recreated so tweaking this script and running it again won't error out.

create extension if not exists pgcrypto;

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  date date not null,
  description text,
  category text default 'personal',
  color text default '#378ADD',
  unit text default 'days',
  pinned boolean default false,
  created_at timestamptz default now()
);

alter table events enable row level security;

drop policy if exists "events_select_own" on events;
create policy "events_select_own" on events
  for select using (auth.uid() = user_id);

drop policy if exists "events_insert_own" on events;
create policy "events_insert_own" on events
  for insert with check (auth.uid() = user_id);

drop policy if exists "events_update_own" on events;
create policy "events_update_own" on events
  for update using (auth.uid() = user_id);

drop policy if exists "events_delete_own" on events;
create policy "events_delete_own" on events
  for delete using (auth.uid() = user_id);
