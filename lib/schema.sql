-- LabX Canvas — Supabase Schema
-- Run this in your Supabase SQL editor

-- Clients table (one row per client website)
create table public.clients (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  name        text not null,           -- "Furutec Electrical"
  slug        text unique not null,    -- "furutec"
  industry    text,                    -- "manufacturing", "food", "legal" etc
  created_at  timestamptz default now()
);

-- Site state table (stores the full STATE object per client)
create table public.site_states (
  id          uuid default gen_random_uuid() primary key,
  client_id   uuid references public.clients(id) on delete cascade unique,
  state       jsonb not null default '{}',
  updated_at  timestamptz default now()
);

-- RLS: enable row level security
alter table public.clients    enable row level security;
alter table public.site_states enable row level security;

-- Clients: users can only see their own client row
create policy "clients: own row only"
  on public.clients for all
  using (auth.uid() = user_id);

-- Site states: users can only access their own client's state
create policy "site_states: own client only"
  on public.site_states for all
  using (
    client_id in (
      select id from public.clients where user_id = auth.uid()
    )
  );

-- Auto-update updated_at on site_states
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_site_state_updated
  before update on public.site_states
  for each row execute procedure public.handle_updated_at();
