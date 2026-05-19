-- IMPULCIA AFRIQUE - Multi-organisation V1

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type text not null check (type in ('parent', 'client')),
  parent_org_id uuid references public.organizations(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_organizations_type on public.organizations(type);
create index if not exists idx_organizations_parent on public.organizations(parent_org_id);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null unique,
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists idx_workspaces_org on public.workspaces(organization_id);

create table if not exists public.users_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  display_name text not null,
  role_hint text,
  created_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_profile_id uuid not null references public.users_profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  role text not null check (
    role in (
      'owner',
      'org_admin',
      'workspace_manager',
      'project_manager',
      'engineer_fe',
      'engineer_be',
      'engineer_fullstack',
      'support',
      'viewer',
      'client'
    )
  ),
  created_at timestamptz not null default now(),
  constraint memberships_target_scope check (organization_id is not null or workspace_id is not null)
);

create index if not exists idx_memberships_profile on public.memberships(user_profile_id);
create index if not exists idx_memberships_org on public.memberships(organization_id);
create index if not exists idx_memberships_workspace on public.memberships(workspace_id);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'new' check (status in ('new', 'triaged', 'in_progress', 'blocked', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  created_by_email text,
  assigned_membership_id uuid references public.memberships(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_requests_workspace on public.requests(workspace_id);
create index if not exists idx_requests_status on public.requests(status);
create index if not exists idx_requests_priority on public.requests(priority);

create table if not exists public.request_interactions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  author_type text not null check (author_type in ('client', 'staff', 'system')),
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_request_interactions_request on public.request_interactions(request_id);

create table if not exists public.job_offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  location text,
  employment_type text not null check (employment_type in ('full_time', 'part_time', 'contract', 'internship')),
  team text,
  description text not null,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_job_offers_published on public.job_offers(published);

alter table public.organizations enable row level security;
alter table public.workspaces enable row level security;
alter table public.users_profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.requests enable row level security;
alter table public.request_interactions enable row level security;
alter table public.job_offers enable row level security;
