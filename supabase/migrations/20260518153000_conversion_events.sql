create table if not exists conversion_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  name text not null,
  category text not null check (category in ('cta', 'form', 'funnel')),
  page text not null,
  value text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists conversion_events_session_idx on conversion_events (session_id);
create index if not exists conversion_events_name_idx on conversion_events (name);
create index if not exists conversion_events_created_idx on conversion_events (created_at desc);
