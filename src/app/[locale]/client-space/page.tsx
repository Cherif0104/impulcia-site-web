export { clientSpaceMetadata as generateMetadata } from '@/src/lib/seo/pages';

import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ClientShell from '@/src/components/crm/ClientShell';
import {
  REQUEST_PRIORITIES,
  REQUEST_STATUSES,
  interactionAuthorLabel,
  requestPriorityLabel,
  requestStatusLabel,
} from '@/src/lib/crm-labels';
import {
  createRequestInteraction,
  createServiceRequest,
  listOrganizations,
  listRequestInteractions,
  listServiceRequests,
  listWorkspaces,
} from '@/src/lib/db';
import { CLIENT_COOKIE, readClientSession } from '@/src/lib/client-auth';
import type { RequestStatus } from '@/src/types/crm';

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
    REQUEST_STATUSES.includes(query.status as RequestStatus)
      ? (query.status as RequestStatus)
      : '';

  const [organizations, workspaces] = await Promise.all([listOrganizations(), listWorkspaces()]);
  const allowedWorkspaces = workspaces.filter((item) => session.workspaceIds.includes(item.id));
  const allowedOrganizations = organizations.filter((item) => session.organizationIds.includes(item.id));
  const workspaceId = allowedWorkspaces.some((item) => item.id === requestedWorkspaceId)
    ? requestedWorkspaceId
    : allowedWorkspaces[0]?.id || '';
  const selectedWorkspace = workspaceId ? workspaces.find((item) => item.id === workspaceId) : null;

  const allClientRequests = workspaceId
    ? await listServiceRequests({
        workspaceId,
        createdByEmail: session.email,
      })
    : [];

  const requests = status
    ? allClientRequests.filter((item) => item.status === status)
    : allClientRequests;

  const interactionsEntries = await Promise.all(
    requests.map(async (request) => [request.id, await listRequestInteractions(request.id)] as const)
  );
  const interactionsByRequest = Object.fromEntries(interactionsEntries);

  const openCount = allClientRequests.filter((item) => item.status !== 'done').length;
  const inProgressCount = allClientRequests.filter((item) => item.status === 'in_progress').length;
  const doneCount = allClientRequests.filter((item) => item.status === 'done').length;

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

  const logoutButton = (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-lg border border-brand-border/60 px-3 py-1.5 text-xs text-brand-muted hover:text-white transition"
      >
        {isFr ? 'Déconnexion' : 'Sign out'}
      </button>
    </form>
  );

  if (allowedWorkspaces.length === 0) {
    return (
      <ClientShell locale={locale} email={session.email} logoutAction={logoutButton}>
        <div className="glass-panel rounded-2xl border border-brand-border/50 p-8 text-center">
          <h1 className="font-display text-2xl font-bold text-white">
            {isFr ? 'Espace non configuré' : 'Workspace not configured'}
          </h1>
          <p className="mt-4 text-sm text-brand-muted">
            {isFr
              ? 'Votre compte client n’est associé à aucun espace de travail. Contactez votre interlocuteur IMPULCIA pour activer l’accès.'
              : 'Your client account is not linked to any workspace yet. Contact your IMPULCIA representative to enable access.'}
          </p>
        </div>
      </ClientShell>
    );
  }

  return (
    <ClientShell locale={locale} email={session.email} logoutAction={logoutButton}>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            {isFr ? 'Espace client' : 'Client workspace'}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">
            {isFr ? 'Demandes et suivi' : 'Requests and tracking'}
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            {isFr
              ? 'Déposez vos demandes, suivez leurs statuts et échangez avec l’équipe delivery.'
              : 'Submit requests, track statuses and interact with the delivery team.'}
          </p>
          {selectedWorkspace ? (
            <p className="mt-2 text-xs text-brand-muted">
              {isFr ? 'Espace actif :' : 'Active workspace:'}{' '}
              <span className="text-white">{selectedWorkspace.name}</span>
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: isFr ? 'Demandes ouvertes' : 'Open requests',
              value: openCount,
            },
            {
              label: isFr ? 'En cours' : 'In progress',
              value: inProgressCount,
            },
            {
              label: isFr ? 'Terminées' : 'Completed',
              value: doneCount,
            },
          ].map((card) => (
            <div key={card.label} className="glass-panel rounded-xl border border-brand-border/50 p-5">
              <p className="text-xs text-brand-muted uppercase tracking-wider">{card.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
            </div>
          ))}
        </div>

        <form
          method="get"
          action={`/${locale}/client-space`}
          className="glass-panel rounded-xl border border-brand-border/50 p-5"
        >
          <h2 className="text-lg font-semibold text-white">
            {isFr ? 'Filtrer mes demandes' : 'Filter my requests'}
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <select
              name="workspaceId"
              defaultValue={workspaceId}
              required
              className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
            >
              {allowedWorkspaces.map((workspace) => (
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
                  {requestStatusLabel(item, isFr)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy"
            >
              {isFr ? 'Afficher' : 'Show'}
            </button>
          </div>
          {status ? (
            <Link
              href={`/${locale}/client-space?workspaceId=${workspaceId}`}
              className="inline-block mt-3 text-xs text-brand-accent hover:text-brand-accent-hover"
            >
              {isFr ? 'Réinitialiser le filtre statut' : 'Clear status filter'}
            </Link>
          ) : null}
        </form>

        <form
          action={createClientRequestAction}
          className="glass-panel rounded-xl border border-brand-border/50 p-5 space-y-3"
        >
          <h2 className="text-lg font-semibold text-white">{isFr ? 'Nouvelle demande' : 'New request'}</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <select
              name="workspaceId"
              required
              defaultValue={workspaceId}
              className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
            >
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
              className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
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
              className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
            >
              {REQUEST_PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {requestPriorityLabel(item, isFr)}
                </option>
              ))}
            </select>
          </div>
          <input
            name="title"
            required
            placeholder={isFr ? 'Titre de la demande' : 'Request title'}
            className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
          />
          <textarea
            name="description"
            required
            rows={4}
            placeholder={isFr ? 'Décrivez votre besoin' : 'Describe your need'}
            className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
          />
          <button type="submit" className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy">
            {isFr ? 'Envoyer la demande' : 'Submit request'}
          </button>
        </form>

        <div className="space-y-4">
          {requests.map((request) => (
            <article
              key={request.id}
              className="glass-panel rounded-xl border border-brand-border/50 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-white">{request.title}</h3>
                  <p className="text-xs text-brand-muted mt-1">
                    {requestStatusLabel(request.status, isFr)} ·{' '}
                    {requestPriorityLabel(request.priority, isFr)} ·{' '}
                    {new Date(request.updated_at).toLocaleString(isFr ? 'fr-FR' : 'en-GB')}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    request.status === 'done'
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : request.status === 'blocked'
                        ? 'bg-red-500/15 text-red-300'
                        : 'bg-brand-accent/15 text-brand-accent'
                  }`}
                >
                  {requestStatusLabel(request.status, isFr)}
                </span>
              </div>
              {request.description ? (
                <p className="mt-3 text-sm text-slate-300 whitespace-pre-wrap">{request.description}</p>
              ) : null}

              <div className="mt-4 space-y-2">
                {(interactionsByRequest[request.id] ?? []).map((interaction) => (
                  <p
                    key={interaction.id}
                    className="rounded-lg border border-brand-border/40 bg-brand-panel/20 px-3 py-2 text-sm text-slate-200"
                  >
                    <span className="font-semibold text-brand-accent">
                      {interactionAuthorLabel(interaction.author_type, isFr)}
                    </span>
                    {' — '}
                    {interaction.body}
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
                  className="flex-1 rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
                />
                <button
                  type="submit"
                  className="rounded-lg border border-brand-border/60 px-3 py-2 text-xs text-brand-muted hover:text-white transition"
                >
                  {isFr ? 'Commenter' : 'Comment'}
                </button>
              </form>
            </article>
          ))}
        </div>

        {workspaceId && requests.length === 0 ? (
          <div className="glass-panel rounded-xl border border-dashed border-brand-border/60 p-8 text-center">
            <p className="text-sm text-brand-muted">
              {status
                ? isFr
                  ? 'Aucune demande ne correspond à ce filtre.'
                  : 'No request matches this filter.'
                : isFr
                  ? 'Vous n’avez pas encore de demande sur cet espace. Utilisez le formulaire ci-dessus pour en créer une.'
                  : 'You have no requests on this workspace yet. Use the form above to create one.'}
            </p>
          </div>
        ) : null}
      </div>
    </ClientShell>
  );
}
