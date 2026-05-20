export { clientSpaceMetadata as generateMetadata } from '@/src/lib/seo/pages';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  createRequestInteraction,
  createServiceRequest,
  listOrganizations,
  listRequestInteractions,
  listServiceRequests,
  listWorkspaces,
} from '@/src/lib/db';
import { CLIENT_COOKIE, readClientSession } from '@/src/lib/client-auth';

export default async function ClientSpacePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const isFr = locale === 'fr';
  const session = await readClientSession();
  if (!session) {
    redirect(`/${locale}/client/login`);
  }

  const requestedWorkspaceId = typeof query.workspaceId === 'string' ? query.workspaceId.trim() : '';
  const status =
    typeof query.status === 'string' &&
    ['new', 'triaged', 'in_progress', 'blocked', 'done'].includes(query.status)
      ? query.status
      : '';

  const [organizations, workspaces] = await Promise.all([listOrganizations(), listWorkspaces()]);
  const allowedWorkspaces = workspaces.filter((item) => session.workspaceIds.includes(item.id));
  const allowedOrganizations = organizations.filter((item) => session.organizationIds.includes(item.id));
  const workspaceId = allowedWorkspaces.some((item) => item.id === requestedWorkspaceId)
    ? requestedWorkspaceId
    : allowedWorkspaces[0]?.id || '';
  const selectedWorkspace = workspaceId ? workspaces.find((item) => item.id === workspaceId) : null;
  const email = session.email;

  const requests =
    workspaceId
      ? await listServiceRequests({
          workspaceId,
          status: (status || undefined) as 'new' | 'triaged' | 'in_progress' | 'blocked' | 'done' | undefined,
          createdByEmail: email,
        })
      : [];

  const interactionsEntries = await Promise.all(
    requests.map(async (request) => [request.id, await listRequestInteractions(request.id)] as const)
  );
  const interactionsByRequest = Object.fromEntries(interactionsEntries);

  async function createClientRequestAction(formData: FormData) {
    'use server';
    const currentSession = await readClientSession();
    if (!currentSession) return;
    const workspaceIdValue = String(formData.get('workspaceId') || '').trim();
    const organizationIdValue = String(formData.get('organizationId') || '').trim();
    const title = String(formData.get('title') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const priorityRaw = String(formData.get('priority') || 'medium');
    const priority =
      priorityRaw === 'low' || priorityRaw === 'high' || priorityRaw === 'critical' ? priorityRaw : 'medium';

    if (
      !workspaceIdValue ||
      !organizationIdValue ||
      !title ||
      !description ||
      !currentSession.workspaceIds.includes(workspaceIdValue) ||
      !currentSession.organizationIds.includes(organizationIdValue)
    ) {
      return;
    }

    await createServiceRequest({
      workspaceId: workspaceIdValue,
      organizationId: organizationIdValue,
      title,
      description,
      createdByEmail: currentSession.email,
      priority,
    });
    redirect(`/${locale}/client-space?workspaceId=${workspaceIdValue}`);
  }

  async function createClientInteractionAction(formData: FormData) {
    'use server';
    const currentSession = await readClientSession();
    if (!currentSession) return;
    const requestId = String(formData.get('requestId') || '').trim();
    const workspaceIdValue = String(formData.get('workspaceId') || '').trim();
    const body = String(formData.get('body') || '').trim();
    if (!requestId || !workspaceIdValue || !body || !currentSession.workspaceIds.includes(workspaceIdValue)) return;

    const existing = await listServiceRequests({
      workspaceId: workspaceIdValue,
      createdByEmail: currentSession.email,
    });
    if (!existing.some((item) => item.id === requestId)) return;

    await createRequestInteraction({
      requestId,
      authorType: 'client',
      body,
    });
    redirect(`/${locale}/client-space?workspaceId=${workspaceIdValue}`);
  }

  async function logoutAction() {
    'use server';
    const cookieStore = await cookies();
    cookieStore.set(CLIENT_COOKIE, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    redirect(`/${locale}/client/login`);
  }

  return (
    <div className="pt-24 pb-20 bg-[var(--page-bg)] text-[var(--text-main)]">
      <section className="section-container space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-brand-border dark:bg-brand-panel/40">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            {isFr ? 'Espace client' : 'Client workspace'}
          </p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-xs text-brand-muted">{session.email}</p>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-brand-border/60 px-3 py-1.5 text-xs text-brand-muted hover:text-white"
              >
                {isFr ? 'Déconnexion' : 'Sign out'}
              </button>
            </form>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold text-slate-900 dark:text-white">
            {isFr ? 'Demandes et suivi de mission' : 'Requests and mission tracking'}
          </h1>
          <p className="mt-4 text-sm text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Déposez vos demandes, suivez leurs statuts et échangez avec l équipe delivery.'
              : 'Submit requests, track statuses and interact with the delivery team.'}
          </p>
        </div>

        <form className="rounded-2xl border border-brand-border/60 bg-white p-5 dark:bg-brand-panel/30">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isFr ? 'Filtrer mon espace' : 'Filter my workspace'}
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <select
              name="workspaceId"
              defaultValue={workspaceId}
              required
              className="rounded-lg border border-brand-border/60 bg-brand-panel/10 px-3 py-2 text-sm text-slate-800 dark:text-white"
            >
              <option value="">{isFr ? 'Sélectionner un espace' : 'Select workspace'}</option>
              {allowedWorkspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
            <select
              name="status"
              defaultValue={status}
              className="rounded-lg border border-brand-border/60 bg-brand-panel/10 px-3 py-2 text-sm text-slate-800 dark:text-white"
            >
              <option value="">{isFr ? 'Tous les statuts' : 'All statuses'}</option>
              <option value="new">new</option>
              <option value="triaged">triaged</option>
              <option value="in_progress">in_progress</option>
              <option value="blocked">blocked</option>
              <option value="done">done</option>
            </select>
            <button
              type="submit"
              className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy"
            >
              {isFr ? 'Afficher' : 'Show'}
            </button>
          </div>
        </form>

        <form
          action={createClientRequestAction}
          className="rounded-2xl border border-brand-border/60 bg-white p-5 space-y-3 dark:bg-brand-panel/30"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isFr ? 'Nouvelle demande' : 'New request'}
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            <select
              name="workspaceId"
              required
              defaultValue={workspaceId}
              className="rounded-lg border border-brand-border/60 bg-brand-panel/10 px-3 py-2 text-sm text-slate-800 dark:text-white"
            >
              <option value="">{isFr ? 'Workspace' : 'Workspace'}</option>
              {allowedWorkspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
            <select
              name="organizationId"
              required
              defaultValue={selectedWorkspace?.organization_id ?? ''}
              className="rounded-lg border border-brand-border/60 bg-brand-panel/10 px-3 py-2 text-sm text-slate-800 dark:text-white"
            >
              <option value="">{isFr ? 'Organisation' : 'Organization'}</option>
              {allowedOrganizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </select>
            <select
              name="priority"
              defaultValue="medium"
              className="rounded-lg border border-brand-border/60 bg-brand-panel/10 px-3 py-2 text-sm text-slate-800 dark:text-white"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
              <option value="critical">critical</option>
            </select>
          </div>
          <input
            name="title"
            required
            placeholder={isFr ? 'Titre de la demande' : 'Request title'}
            className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/10 px-3 py-2 text-sm text-slate-800 dark:text-white"
          />
          <textarea
            name="description"
            required
            rows={4}
            placeholder={isFr ? 'Décrivez votre besoin' : 'Describe your need'}
            className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/10 px-3 py-2 text-sm text-slate-800 dark:text-white"
          />
          <button type="submit" className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy">
            {isFr ? 'Envoyer la demande' : 'Submit request'}
          </button>
        </form>

        <div className="space-y-4">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-2xl border border-brand-border/60 bg-white p-5 shadow-sm dark:bg-brand-panel/20"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{request.title}</h3>
                  <p className="text-xs text-brand-muted mt-1">
                    {request.status} · {request.priority} · {new Date(request.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {request.description ? (
                <p className="mt-3 text-sm text-slate-600 dark:text-brand-muted whitespace-pre-wrap">
                  {request.description}
                </p>
              ) : null}

              <div className="mt-4 space-y-2">
                {(interactionsByRequest[request.id] ?? []).map((interaction) => (
                  <p
                    key={interaction.id}
                    className="rounded-lg border border-brand-border/40 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
                  >
                    <span className="font-semibold">{interaction.author_type}</span> — {interaction.body}
                  </p>
                ))}
              </div>

              <form action={createClientInteractionAction} className="mt-4 flex gap-2">
                <input type="hidden" name="requestId" value={request.id} />
                <input type="hidden" name="workspaceId" value={workspaceId} />
                <input
                  name="body"
                  required
                  placeholder={isFr ? 'Ajouter un commentaire' : 'Add comment'}
                  className="flex-1 rounded-lg border border-brand-border/60 bg-brand-panel/10 px-3 py-2 text-sm text-slate-800 dark:text-white"
                />
                <button
                  type="submit"
                  className="rounded-lg border border-brand-border/60 px-3 py-2 text-xs text-brand-muted hover:text-white"
                >
                  {isFr ? 'Commenter' : 'Comment'}
                </button>
              </form>
            </article>
          ))}
        </div>

        {workspaceId && requests.length === 0 ? (
          <p className="text-sm text-brand-muted">
            {isFr ? 'Aucune demande trouvée pour ce filtre.' : 'No request found for this filter.'}
          </p>
        ) : null}
      </section>
    </div>
  );
}
