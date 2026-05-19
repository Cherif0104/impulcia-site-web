import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
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

const REQUEST_STATUSES = ['new', 'triaged', 'in_progress', 'blocked', 'done'] as const;

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
  const organizationId = typeof query.organizationId === 'string' ? query.organizationId.trim() : '';
  const workspaceId = typeof query.workspaceId === 'string' ? query.workspaceId.trim() : '';
  const status =
    typeof query.status === 'string' &&
    ['new', 'triaged', 'in_progress', 'blocked', 'done'].includes(query.status)
      ? query.status
      : '';

  const [organizations, workspaces, requests] = await Promise.all([
    listOrganizations(),
    listWorkspaces(),
    listServiceRequests({
      organizationId: organizationId || undefined,
      workspaceId: workspaceId || undefined,
      status: (status || undefined) as 'new' | 'triaged' | 'in_progress' | 'blocked' | 'done' | undefined,
    }),
  ]);
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
    const priority = String(formData.get('priority') || 'medium') as 'low' | 'medium' | 'high' | 'critical';
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
    const status = String(formData.get('status') || '').trim() as
      | 'new'
      | 'triaged'
      | 'in_progress'
      | 'blocked'
      | 'done';
    if (!requestId || !REQUEST_STATUSES.includes(status)) return;
    await updateServiceRequestStatus(requestId, status);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">{isFr ? 'Demandes clients' : 'Client requests'}</h1>
        <p className="text-sm text-brand-muted mt-2">
          {isFr
            ? 'Suivi des tickets, statuts et interactions operationnelles.'
            : 'Track tickets, statuses and operational interactions.'}
        </p>
      </div>

      <form className="glass-panel rounded-xl border border-brand-border/50 p-5">
        <h2 className="text-white font-semibold mb-4">{isFr ? 'Filtres multi-organisation' : 'Multi-organization filters'}</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <select
            name="organizationId"
            defaultValue={organizationId}
            className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
          >
            <option value="">{isFr ? 'Toutes les organisations' : 'All organizations'}</option>
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </select>
          <select
            name="workspaceId"
            defaultValue={workspaceId}
            className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
          >
            <option value="">{isFr ? 'Tous les workspaces' : 'All workspaces'}</option>
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={status}
            className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
          >
            <option value="">{isFr ? 'Tous les statuts' : 'All statuses'}</option>
            {REQUEST_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy">
            {isFr ? 'Filtrer' : 'Filter'}
          </button>
        </div>
      </form>

      <form action={createRequestAction} className="glass-panel rounded-xl border border-brand-border/50 p-5 space-y-3">
        <h2 className="text-white font-semibold">{isFr ? 'Creer une demande' : 'Create request'}</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <select name="organizationId" required className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white">
            <option value="">{isFr ? 'Organisation' : 'Organization'}</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <select name="workspaceId" required className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white">
            <option value="">{isFr ? 'Workspace' : 'Workspace'}</option>
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
          <input name="createdByEmail" placeholder={isFr ? 'Email client' : 'Client email'} className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
          <select name="priority" className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white">
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
            <option value="critical">critical</option>
          </select>
        </div>
        <input name="title" required placeholder={isFr ? 'Titre' : 'Title'} className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
        <textarea name="description" required rows={4} placeholder={isFr ? 'Description' : 'Description'} className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
        <button type="submit" className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy">
          {isFr ? 'Enregistrer' : 'Save'}
        </button>
      </form>

      <div className="space-y-4">
        {requests.map((request) => (
          <article key={request.id} className="glass-panel rounded-xl border border-brand-border/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-white font-semibold">{request.title}</h3>
                <p className="text-xs text-brand-muted mt-1">
                  {request.priority} · {request.created_by_email ?? 'n/a'} ·{' '}
                  {workspaces.find((item) => item.id === request.workspace_id)?.name ?? request.workspace_id}
                </p>
              </div>
              <form action={updateStatusAction} className="flex items-center gap-2">
                <input type="hidden" name="requestId" value={request.id} />
                <select name="status" defaultValue={request.status} className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-xs text-white">
                  {REQUEST_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button type="submit" className="rounded-lg border border-brand-accent/40 px-3 py-2 text-xs text-brand-accent">
                  {isFr ? 'Mettre a jour' : 'Update'}
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
            <form action={createInteractionAction} className="mt-4 flex gap-2">
              <input type="hidden" name="requestId" value={request.id} />
              <input name="body" placeholder={isFr ? 'Ajouter une interaction' : 'Add interaction'} className="flex-1 rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
              <button type="submit" className="rounded-lg border border-brand-border/60 px-3 py-2 text-xs text-brand-muted hover:text-white">
                {isFr ? 'Ajouter' : 'Add'}
              </button>
            </form>
          </article>
        ))}
      </div>

      {requests.length === 0 ? (
        <p className="text-sm text-brand-muted">{isFr ? 'Aucune demande pour le moment.' : 'No request yet.'}</p>
      ) : null}
    </div>
  );
}
