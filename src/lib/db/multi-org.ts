import { getSupabaseAdmin, isSupabaseConfigured } from '@/src/lib/supabase/server';
import { memoryStore, warnMemoryFallback } from '@/src/lib/db/memory-store';
import type {
  JobOffer,
  Membership,
  MembershipRole,
  Organization,
  OrganizationType,
  RequestInteraction,
  RequestPriority,
  RequestStatus,
  ServiceRequest,
  UserProfile,
  Workspace,
} from '@/src/types/crm';

function shouldUseMemory() {
  if (!isSupabaseConfigured()) warnMemoryFallback();
  return !isSupabaseConfigured();
}

export async function listOrganizations(): Promise<Organization[]> {
  if (shouldUseMemory()) return memoryStore.organizations.list();
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapOrganization);
}

export async function createOrganization(input: {
  name: string;
  slug: string;
  type: OrganizationType;
  parentOrgId?: string | null;
}): Promise<Organization> {
  const payload = {
    name: input.name.trim(),
    slug: input.slug.trim().toLowerCase(),
    type: input.type,
    parent_org_id: input.parentOrgId ?? null,
    active: true,
  };
  if (shouldUseMemory()) {
    return memoryStore.organizations.create({
      name: payload.name,
      slug: payload.slug,
      type: payload.type,
      parent_org_id: payload.parent_org_id,
      active: payload.active,
    });
  }
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase.from('organizations').insert(payload).select('*').single();
  if (error) throw new Error(error.message);
  return mapOrganization(data);
}

export async function listWorkspaces(organizationId?: string): Promise<Workspace[]> {
  if (shouldUseMemory()) return memoryStore.workspaces.list(organizationId);
  const supabase = getSupabaseAdmin()!;
  let query = supabase.from('workspaces').select('*').order('created_at', { ascending: false });
  if (organizationId) query = query.eq('organization_id', organizationId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapWorkspace);
}

export async function createWorkspace(input: {
  organizationId: string;
  name: string;
  slug: string;
  status?: Workspace['status'];
}): Promise<Workspace> {
  const payload = {
    organization_id: input.organizationId,
    name: input.name.trim(),
    slug: input.slug.trim().toLowerCase(),
    status: input.status ?? 'active',
  };
  if (shouldUseMemory()) {
    return memoryStore.workspaces.create(payload);
  }
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase.from('workspaces').insert(payload).select('*').single();
  if (error) throw new Error(error.message);
  return mapWorkspace(data);
}

export async function listUserProfiles(): Promise<UserProfile[]> {
  if (shouldUseMemory()) return memoryStore.userProfiles.list();
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase
    .from('users_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapUserProfile);
}

export async function createUserProfile(input: {
  email: string;
  displayName: string;
  roleHint?: string;
}): Promise<UserProfile> {
  const payload = {
    email: input.email.trim().toLowerCase(),
    display_name: input.displayName.trim(),
    role_hint: input.roleHint?.trim() || null,
  };
  if (shouldUseMemory()) {
    return memoryStore.userProfiles.create({
      email: payload.email,
      display_name: payload.display_name,
      role_hint: payload.role_hint,
    });
  }
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase.from('users_profiles').insert(payload).select('*').single();
  if (error) throw new Error(error.message);
  return mapUserProfile(data);
}

export async function updateUserProfile(
  id: string,
  patch: Partial<{ displayName: string; roleHint: string | null }>
): Promise<UserProfile | null> {
  const dbPatch: Record<string, unknown> = {};
  if (patch.displayName !== undefined) dbPatch.display_name = patch.displayName.trim();
  if (patch.roleHint !== undefined) dbPatch.role_hint = patch.roleHint;
  if (Object.keys(dbPatch).length === 0) return null;

  if (shouldUseMemory()) {
    return memoryStore.userProfiles.update(id, {
      display_name: dbPatch.display_name as string | undefined,
      role_hint: (dbPatch.role_hint as string | null | undefined) ?? undefined,
    });
  }

  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase
    .from('users_profiles')
    .update(dbPatch)
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapUserProfile(data) : null;
}

export async function listMemberships(): Promise<Membership[]> {
  if (shouldUseMemory()) return memoryStore.memberships.list();
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase
    .from('memberships')
    .select(
      '*, user_profile:users_profiles(*), organization:organizations(*), workspace:workspaces(*)'
    )
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapMembership);
}

export async function createMembership(input: {
  userProfileId: string;
  organizationId?: string;
  workspaceId?: string;
  role: MembershipRole;
}): Promise<Membership> {
  const payload = {
    user_profile_id: input.userProfileId,
    organization_id: input.organizationId ?? null,
    workspace_id: input.workspaceId ?? null,
    role: input.role,
  };
  if (shouldUseMemory()) return memoryStore.memberships.create(payload);
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase
    .from('memberships')
    .insert(payload)
    .select(
      '*, user_profile:users_profiles(*), organization:organizations(*), workspace:workspaces(*)'
    )
    .single();
  if (error) throw new Error(error.message);
  return mapMembership(data);
}

type ServiceRequestFilters = {
  workspaceId?: string;
  organizationId?: string;
  status?: RequestStatus;
  createdByEmail?: string;
};

export async function listServiceRequests(
  filters?: string | ServiceRequestFilters
): Promise<ServiceRequest[]> {
  const resolvedFilters: ServiceRequestFilters =
    typeof filters === 'string' ? { workspaceId: filters } : filters ?? {};
  if (shouldUseMemory()) {
    return memoryStore.requests.list(resolvedFilters.workspaceId);
  }
  const supabase = getSupabaseAdmin()!;
  let query = supabase
    .from('requests')
    .select('*')
    .order('updated_at', { ascending: false });
  if (resolvedFilters.workspaceId) query = query.eq('workspace_id', resolvedFilters.workspaceId);
  if (resolvedFilters.organizationId) query = query.eq('organization_id', resolvedFilters.organizationId);
  if (resolvedFilters.status) query = query.eq('status', resolvedFilters.status);
  if (resolvedFilters.createdByEmail) {
    query = query.eq('created_by_email', resolvedFilters.createdByEmail.trim().toLowerCase());
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapServiceRequest);
}

export async function getServiceRequest(id: string): Promise<ServiceRequest | null> {
  if (shouldUseMemory()) {
    return memoryStore.requests.list().find((request) => request.id === id) ?? null;
  }
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase.from('requests').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapServiceRequest(data) : null;
}

export async function createServiceRequest(input: {
  workspaceId: string;
  organizationId: string;
  title: string;
  description?: string;
  priority?: RequestPriority;
  createdByEmail?: string;
}): Promise<ServiceRequest> {
  const payload = {
    workspace_id: input.workspaceId,
    organization_id: input.organizationId,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    priority: input.priority ?? 'medium',
    status: 'new' as RequestStatus,
    created_by_email: input.createdByEmail?.trim().toLowerCase() || null,
    assigned_membership_id: null,
  };
  if (shouldUseMemory()) return memoryStore.requests.create(payload);
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase.from('requests').insert(payload).select('*').single();
  if (error) throw new Error(error.message);
  return mapServiceRequest(data);
}

export async function updateServiceRequestStatus(
  id: string,
  status: RequestStatus
): Promise<ServiceRequest | null> {
  if (shouldUseMemory()) return memoryStore.requests.updateStatus(id, status);
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase
    .from('requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapServiceRequest(data) : null;
}

export async function listRequestInteractions(requestId: string): Promise<RequestInteraction[]> {
  if (shouldUseMemory()) return memoryStore.requestInteractions.list(requestId);
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase
    .from('request_interactions')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapInteraction);
}

export async function createRequestInteraction(input: {
  requestId: string;
  authorType: RequestInteraction['author_type'];
  body: string;
}): Promise<RequestInteraction> {
  const payload = {
    request_id: input.requestId,
    author_type: input.authorType,
    body: input.body.trim(),
  };
  if (shouldUseMemory()) return memoryStore.requestInteractions.create(payload);
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase
    .from('request_interactions')
    .insert(payload)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return mapInteraction(data);
}

export async function listJobOffers(options?: { publishedOnly?: boolean }): Promise<JobOffer[]> {
  const publishedOnly = options?.publishedOnly ?? false;
  if (shouldUseMemory()) return memoryStore.jobOffers.list(publishedOnly);
  const supabase = getSupabaseAdmin()!;
  let query = supabase.from('job_offers').select('*').order('updated_at', { ascending: false });
  if (publishedOnly) query = query.eq('published', true);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapJobOffer);
}

export async function createJobOffer(input: {
  title: string;
  slug: string;
  location?: string;
  employmentType: JobOffer['employment_type'];
  team?: string;
  description: string;
  published?: boolean;
}): Promise<JobOffer> {
  const published = input.published === true;
  const payload = {
    title: input.title.trim(),
    slug: input.slug.trim().toLowerCase(),
    location: input.location?.trim() || null,
    employment_type: input.employmentType,
    team: input.team?.trim() || null,
    description: input.description.trim(),
    published,
    published_at: published ? new Date().toISOString() : null,
  };
  if (shouldUseMemory()) {
    return memoryStore.jobOffers.create(payload);
  }
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase.from('job_offers').insert(payload).select('*').single();
  if (error) throw new Error(error.message);
  return mapJobOffer(data);
}

export async function updateJobOffer(
  id: string,
  patch: Partial<{
    title: string;
    slug: string;
    location: string;
    employmentType: JobOffer['employment_type'];
    team: string;
    description: string;
    published: boolean;
  }>
): Promise<JobOffer | null> {
  const dbPatch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (patch.title !== undefined) dbPatch.title = patch.title.trim();
  if (patch.slug !== undefined) dbPatch.slug = patch.slug.trim().toLowerCase();
  if (patch.location !== undefined) dbPatch.location = patch.location.trim() || null;
  if (patch.employmentType !== undefined) dbPatch.employment_type = patch.employmentType;
  if (patch.team !== undefined) dbPatch.team = patch.team.trim() || null;
  if (patch.description !== undefined) dbPatch.description = patch.description.trim();
  if (patch.published !== undefined) {
    dbPatch.published = patch.published;
    dbPatch.published_at = patch.published ? new Date().toISOString() : null;
  }
  if (shouldUseMemory()) return memoryStore.jobOffers.update(id, dbPatch as Partial<JobOffer>);
  const supabase = getSupabaseAdmin()!;
  const { data, error } = await supabase
    .from('job_offers')
    .update(dbPatch)
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapJobOffer(data) : null;
}

export async function deleteJobOffer(id: string): Promise<boolean> {
  if (shouldUseMemory()) return memoryStore.jobOffers.delete(id);
  const supabase = getSupabaseAdmin()!;
  const { error } = await supabase.from('job_offers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

function mapOrganization(row: Record<string, unknown>): Organization {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    type: row.type as OrganizationType,
    parent_org_id: (row.parent_org_id as string | null) ?? null,
    active: Boolean(row.active),
    created_at: String(row.created_at),
  };
}

function mapWorkspace(row: Record<string, unknown>): Workspace {
  return {
    id: String(row.id),
    organization_id: String(row.organization_id),
    name: String(row.name),
    slug: String(row.slug),
    status: row.status as Workspace['status'],
    created_at: String(row.created_at),
  };
}

function mapUserProfile(row: Record<string, unknown>): UserProfile {
  return {
    id: String(row.id),
    email: String(row.email),
    display_name: String(row.display_name),
    role_hint: (row.role_hint as string | null) ?? null,
    created_at: String(row.created_at),
  };
}

function mapMembership(row: Record<string, unknown>): Membership {
  return {
    id: String(row.id),
    user_profile_id: String(row.user_profile_id),
    organization_id: (row.organization_id as string | null) ?? null,
    workspace_id: (row.workspace_id as string | null) ?? null,
    role: row.role as MembershipRole,
    created_at: String(row.created_at),
    user_profile: row.user_profile ? mapUserProfile(row.user_profile as Record<string, unknown>) : null,
    organization: row.organization ? mapOrganization(row.organization as Record<string, unknown>) : null,
    workspace: row.workspace ? mapWorkspace(row.workspace as Record<string, unknown>) : null,
  };
}

function mapServiceRequest(row: Record<string, unknown>): ServiceRequest {
  return {
    id: String(row.id),
    workspace_id: String(row.workspace_id),
    organization_id: String(row.organization_id),
    title: String(row.title),
    description: (row.description as string | null) ?? null,
    status: row.status as RequestStatus,
    priority: row.priority as RequestPriority,
    created_by_email: (row.created_by_email as string | null) ?? null,
    assigned_membership_id: (row.assigned_membership_id as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapInteraction(row: Record<string, unknown>): RequestInteraction {
  return {
    id: String(row.id),
    request_id: String(row.request_id),
    author_type: row.author_type as RequestInteraction['author_type'],
    body: String(row.body),
    created_at: String(row.created_at),
  };
}

function mapJobOffer(row: Record<string, unknown>): JobOffer {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    location: (row.location as string | null) ?? null,
    employment_type: row.employment_type as JobOffer['employment_type'],
    team: (row.team as string | null) ?? null,
    description: String(row.description),
    published: Boolean(row.published),
    published_at: (row.published_at as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}
