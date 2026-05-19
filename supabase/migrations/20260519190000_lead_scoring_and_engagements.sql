alter table public.leads
  add column if not exists score int,
  add column if not exists priority text check (priority in ('low', 'medium', 'high', 'critical')),
  add column if not exists potential text check (potential in ('low', 'medium', 'high')),
  add column if not exists urgency text check (urgency in ('low', 'medium', 'high')),
  add column if not exists scoring_details text;

create index if not exists idx_leads_score on public.leads (score desc nulls last);
create index if not exists idx_leads_priority on public.leads (priority);

