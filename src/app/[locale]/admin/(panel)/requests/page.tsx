import { Suspense } from 'react';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import AdminRequestsFilters from '@/src/components/crm/AdminRequestsFilters';
import {
  createRequestInteraction,
  createServiceRequest,
  listOrganizations,
  listRequestInteractions,
  listServiceRequests,
  listWorkspaces,
  updateServiceRequestStatus,
} from '@/src/lib/db';
import { hasRequiredAdminRole } from '@/src/lib/admin-auth';
import {
  OPEN_REQUESTS_QUERY,
  REQUEST_PRIORITIES,
  REQUEST_STATUSES,
  requestPriorityLabel,
  requestStatusLabel,
} from '@/src/lib/crm-labels';
import type { RequestPriority, RequestStatus } from '@/src/types/crm';

function matchesSearch(
  request: { title: string; description?: string | null; created_by_email?: string | null },
  q: string
): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return [request.title, request.description ?? '', request.created_by_email ?? ''].some((field) =>
    field.toLowerCase().includes(needle)
  );
}

export default async function AdminRequestsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!(await hasRequiredAdminRole(['support', 'workspace_manager', 'org_admin', 'owner']))) {
    redirect(`/${locale}/admin`);
  }
  const query = await searchParams;
  const isFr = locale === 'fr';
  const t = await getTranslations('crm.admin.requests');

  const organizationId = typeof query.organizationId === 'string' ? query.organizationId.trim() : '';
  const workspaceId = typeof query.workspaceId === 'string' ? query.workspaceId.trim() : '';
  const statusRaw = typeof query.status === 'string' ? query.status.trim() : '';
  const openOnly = statusRaw === OPEN_REQUESTS_QUERY;
  const status =
    !openOnly && REQUEST_STATUSES.includes(statusRaw as RequestStatus)
      ? (statusRaw as RequestStatus)
      : undefined;
  const priority =
    typeof query.priority === 'string' &&
    REQUEST_PRIORITIES.includes(query.priority as RequestPriority)
      ? (query.priority as RequestPriority)
      : undefined;
  const q = typeof query.q === 'string' ? query.q.trim() : '';

  const filterValues = {
    organizationId,
    workspaceId,
    status: openOnly ? OPEN_REQUESTS_QUERY : statusRaw,
    priority: priority ?? '',
    q,
  };

  const [organizations, workspaces, requestsRaw] = await Promise.all([
    listOrganizations(),
    listWorkspaces(),
    listServiceRequests({
      organizationId: organizationId || undefined,
      workspaceId: workspaceId || undefined,
      status,
      priority,
    }),
  ]);

  let requests = openOnly ? requestsRaw.filter((item) => item.status !== 'done') : requestsRaw;
  if (q) {
    requests = requests.filter((item) => matchesSearch(item, q));
  }

  const interactionsEntries = await Promise.all(
    requests.map(async (request) => [request.id, await listRequestInteractions(request.id)] as const)
  );
  const interactionsByRequest = Object.fromEntries(interactionsEntries);

  async function createRequestAction(formData: FormData) {
    'use server';
    const workspaceId = String(formData.get('workspaceId') || '').trim();
    const organizationId = String(formData.get('organizationId') || '').trim();
    const title = String(formData.get('title') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const createdByEmail = String(formData.get('createdByEmail') || '').trim();
    const priority = String(formData.get('priority') || 'medium') as RequestPriority;
    if (!workspaceId || !organizationId || !title || !description) return;
    await createServiceRequest({
      workspaceId,
      organizationId,
      title,
      description,
      createdByEmail,
      priority,
    });
    revalidatePath(`/${locale}/admin/requests`);
  }

  async function updateStatusAction(formData: FormData) {
    'use server';
    const requestId = String(formData.get('requestId') || '').trim();
    const nextStatus = String(formData.get('status') || '').trim() as RequestStatus;
    if (!requestId || !REQUEST_STATUSES.includes(nextStatus)) return;
    await updateServiceRequestStatus(requestId, nextStatus);
    revalidatePath(`/${locale}/admin/requests`);
  }

  async function createInteractionAction(formData: FormData) {
    'use server';
    const requestId = String(formData.get('requestId') || '').trim();
    const body = String(formData.get('body') || '').trim();
    if (!requestId || !body) return;
    await createRequestInteraction({ requestId, authorType: 'staff', body });
    revalidatePath(`/${locale}/admin/requests`);
  }

  const statusOptions = REQUEST_STATUSES.map((item) => ({
    value: item,
    label: requestStatusLabel(item, isFr),
  }));
  const priorityOptions = REQUEST_PRIORITIES.map((item) => ({
    value: item,
    label: requestPriorityLabel(item, isFr),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">{t('title')}</h1>
        <p className="text-sm text-brand-muted mt-2">{t('subtitle')}</p>
      </div>

      <Suspense fallback={<div className="glass-panel rounded-xl p-5 text-sm text-brand-muted">{t('loadingFilters')}</div>}>
        <AdminRequestsFilters
          locale={locale}
          values={filterValues}
          organizations={organizations.map((o) => ({ id: o.id, name: o.name }))}
          workspaces={workspaces.map((w) => ({ id: w.id, name: w.name }))}
          statusOptions={statusOptions}
          priorityOptions={priorityOptions}
          labels={{
            title: t('filtersTitle'),
            allOrganizations: t('allOrganizations'),
            allWorkspaces: t('allWorkspaces'),
            allStatuses: t('allStatuses'),
            allPriorities: t('allPriorities'),
            openStatus: t('openStatus'),
            searchPlaceholder: t('searchPlaceholder'),
            apply: t('apply'),
            clear: t('clearFilters'),
            quickOpen: t('quickOpen'),
            quickAll: t('quickAll'),
          }}
        />
      </Suspense>

      {requests.length > 0 ? (
        <p className="text-xs text-brand-muted">
          {t('resultsCount', { count: requests.length })}
        </p>
      ) : null}

      <form action={createRequestAction} className="glass-panel rounded-xl border border-brand-border/50 p-5 space-y-3">
        <h2 className="text-white font-semibold">{t('createTitle')}</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <select name="organizationId" required className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white">
            <option value="">{t('organization')}</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <select name="workspaceId" required className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white">
            <option value="">{t('workspace')}</option>
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
          <input name="createdByEmail" placeholder={t('clientEmail')} className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
          <select name="priority" className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white">
            {REQUEST_PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {requestPriorityLabel(item, isFr)}
              </option>
            ))}
          </select>
        </div>
        <input name="title" required placeholder={t('titleField')} className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
        <textarea name="description" required rows={4} placeholder={t('description')} className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
        <button type="submit" className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy">
          {t('save')}
        </button>
      </form>

      <div className="space-y-4">
        {requests.map((request) => (
          <article key={request.id} className="glass-panel rounded-xl border border-brand-border/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-white font-semibold">{request.title}</h3>
                <p className="text-xs text-brand-muted mt-1">
                  {requestStatusLabel(request.status, isFr)} · {requestPriorityLabel(request.priority, isFr)} ·{' '}
                  {request.created_by_email ?? 'n/a'} ·{' '}
                  {workspaces.find((item) => item.id === request.workspace_id)?.name ?? request.workspace_id}
                </p>
              </div>
              <form action={updateStatusAction} className="flex flex-wrap items-center gap-2">
                <input type="hidden" name="requestId" value={request.id} />
                <select name="status" defaultValue={request.status} className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-xs text-white">
                  {REQUEST_STATUSES.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {requestStatusLabel(statusOption, isFr)}
                    </option>
                  ))}
                </select>
                <button type="submit" className="rounded-lg border border-brand-accent/40 px-3 py-2 text-xs text-brand-accent">
                  {t('updateStatus')}
                </button>
              </form>
            </div>
            <p className="text-sm text-slate-300 mt-3 whitespace-pre-wrap">{request.description}</p>
            <div className="mt-3 space-y-2">
              {(interactionsByRequest[request.id] ?? []).map((interaction) => (
                <p key={interaction.id} className="rounded-lg border border-brand-border/40 px-3 py-2 text-xs text-brand-muted">
                  <span className="text-brand-accent">{interaction.author_type}</span> · {interaction.body}
                </p>
              ))}
            </div>
            <form action={createInteractionAction} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="requestId" value={request.id} />
              <input name="body" placeholder={t('addInteraction')} className="flex-1 rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
              <button type="submit" className="rounded-lg border border-brand-border/60 px-3 py-2 text-xs text-brand-muted hover:text-white sm:shrink-0">
                {t('add')}
              </button>
            </form>
          </article>
        ))}
      </div>

      {requests.length === 0 ? (
        <p className="text-sm text-brand-muted">{t('empty')}</p>
      ) : null}
    </div>
  );
}
