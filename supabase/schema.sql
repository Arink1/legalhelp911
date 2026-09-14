-- LegalHelp911 schema. Run this once in the Supabase SQL editor.
--
-- Every table is prefixed lh911_ so this can share a Supabase project with
-- other apps (OnlyDials, ArinHealthAgent) without any chance of collision.
-- Safe to re-run: every statement is idempotent.

-- ---------------------------------------------------------------------------
-- Lead intake (homepage "Get my free case review" form)
-- ---------------------------------------------------------------------------
create table if not exists public.lh911_leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  phone       text not null,
  email       text,
  case_type   text not null,
  description text,
  consent     boolean not null default false,
  source      text not null default 'legalhelp911.com',
  status      text not null default 'new' -- new | contacted | sold | dead
);

-- Lock the table down. The API inserts with the service role key, which
-- bypasses RLS, so no anon/authenticated policies are needed. With RLS on
-- and no policies, the public anon key cannot read leads at all.
alter table public.lh911_leads enable row level security;

create index if not exists lh911_leads_created_at_idx
  on public.lh911_leads (created_at desc);
create index if not exists lh911_leads_status_idx
  on public.lh911_leads (status);

-- ---------------------------------------------------------------------------
-- News articles (AI-drafted weekly, reviewed before publishing).
-- All reads and writes go through the service role key server-side, so RLS
-- is enabled with no public policies.
-- ---------------------------------------------------------------------------
create table if not exists public.lh911_posts (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  slug          text not null unique,
  title         text not null,
  excerpt       text not null default '',
  content       text not null default '',
  category      text not null default 'News',
  read_minutes  int  not null default 4,
  published     boolean not null default false,
  published_at  timestamptz not null default now()
);

create index if not exists lh911_posts_published_at_idx
  on public.lh911_posts (published_at desc);

alter table public.lh911_posts enable row level security;

-- ---------------------------------------------------------------------------
-- Privileges. Only the server-side service role touches these tables. The
-- anon/authenticated roles are deliberately granted nothing, so even if the
-- public anon key leaked it could not read a single lead.
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on public.lh911_leads to service_role;
grant select, insert, update, delete on public.lh911_posts to service_role;

-- If the project was created with "Automatically expose new tables" on,
-- Supabase grants the browser-facing roles access to every new table. Leads
-- must never be reachable with the publishable/anon key, so strip that.
-- No-op when they hold nothing already.
revoke all on public.lh911_leads from anon, authenticated;
revoke all on public.lh911_posts from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Newsletter sign-ups (footer "Get legal tips by email" modal).
-- Written by app/api/newsletter/route.ts with the service role key.
-- ---------------------------------------------------------------------------
create table if not exists public.lh911_subscribers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null unique,
  source      text not null default 'legalhelp911.com',
  unsubscribed_at timestamptz
);

alter table public.lh911_subscribers enable row level security;
grant select, insert, update, delete on public.lh911_subscribers to service_role;
revoke all on public.lh911_subscribers from anon, authenticated;
