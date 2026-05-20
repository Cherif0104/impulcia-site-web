import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  createMembership,
  createUserProfile,
  listMemberships,
  listOrganizations,
  listUserProfiles,
  listWorkspaces,
} from '@/src/lib/db';
import { hasRequiredAdminRole } from '@/src/lib/admin-auth';
import {
  createClientActionToken,
  createSupabaseRecoveryLink,
  ensureSupabaseClientUser,
  readClientAuthMeta,
  setClientCredentials,
} from '@/src/lib/client-auth';

const ROLES = [
  'owner',
  'org_admin',
  'workspace_manager',
  'project_manager',
  'engineer_fe',
  'engineer_be',
  'engineer_fullstack',
  'support',
  'viewer',
  'client',
] as const;

export default async function AdminTeamPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  if (!(await hasRequiredAdminRole(['workspace_manager', 'org_admin', 'owner']))) {
    redirect(`/${locale}/admin`);
  }
  const isFr = locale === 'fr';
  const [memberships, users, organizations, workspaces] = await Promise.all([
    listMemberships(),
    listUserProfiles(),
    listOrganizations(),
    listWorkspaces(),
  ]);
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'http://localhost:4174';
  const notice = typeof query.notice === 'string' ? query.notice : '';
  const accessLink = typeof query.accessLink === 'string' ? query.accessLink : '';

  const clientAccounts = users
    .map((user) => {
      const scopedMemberships = memberships.filter(
        (membership) => membership.role === 'client' && membership.user_profile_id === user.id
      );
      if (scopedMemberships.length === 0) return null;
      const auth = readClientAuthMeta(user.role_hint);
      return {
        user,
        auth,
        memberships: scopedMemberships,
      };
    })
    .filter(Boolean) as Array<{
    user: (typeof users)[number];
    auth: ReturnType<typeof readClientAuthMeta>;
    memberships: (typeof memberships)[number][];
  }>;

  async function createMembershipAction(formData: FormData) {
    'use server';
    const userProfileId = String(formData.get('userProfileId') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const displayName = String(formData.get('displayName') || '').trim();
    const role = String(formData.get('role') || 'viewer') as (typeof ROLES)[number];
    const organizationId = String(formData.get('organizationId') || '').trim() || undefined;
    const workspaceId = String(formData.get('workspaceId') || '').trim() || undefined;
    if (!ROLES.includes(role)) return;

    let resolvedUserProfileId = userProfileId;
    if (!resolvedUserProfileId) {
      if (!email || !displayName) return;
      const profile = await createUserProfile({ email, displayName });
      resolvedUserProfileId = profile.id;
    }
    await createMembership({
      userProfileId: resolvedUserProfileId,
      organizationId,
      workspaceId,
      role,
    });
    revalidatePath(`/${locale}/admin/team`);
  }

  async function createClientAccountAction(formData: FormData) {
    'use server';
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const displayName = String(formData.get('displayName') || '').trim();
    const organizationId = String(formData.get('organizationId') || '').trim();
    const workspaceId = String(formData.get('workspaceId') || '').trim();
    const initialPassword = String(formData.get('initialPassword') || '').trim();
    if (!email || !displayName || !organizationId || !workspaceId) return;

    const allUsers = await listUserProfiles();
    const existingUser = allUsers.find((item) => item.email.toLowerCase() === email);
    const user =
      existingUser ??
      (await createUserProfile({
        email,
        displayName,
      }));

    const allMemberships = await listMemberships();
    const alreadyScoped = allMemberships.some(
      (item) =>
        item.user_profile_id === user.id &&
        item.role === 'client' &&
        item.organization_id === organizationId &&
        item.workspace_id === workspaceId
    );
    if (!alreadyScoped) {
      await createMembership({
        userProfileId: user.id,
        organizationId,
        workspaceId,
        role: 'client',
      });
    }

    await setClientCredentials(user.id, {
      status: initialPassword.length >= 8 ? 'active' : 'pending',
      plainPassword: initialPassword.length >= 8 ? initialPassword : undefined,
    });
    await ensureSupabaseClientUser({
      email: user.email,
      displayName: user.display_name,
      password: initialPassword.length >= 8 ? initialPassword : undefined,
    });

    const token = createClientActionToken(user.email, 'activate');
    const localLink = `${baseUrl}/${locale}/client/login?mode=activate&token=${encodeURIComponent(token)}`;
    const supabaseInvite =
      (await createSupabaseRecoveryLink({
        email: user.email,
        type: 'invite',
        redirectTo: `${baseUrl}/${locale}/client/login`,
      })) || null;
    const finalLink = supabaseInvite || localLink;
    const params = new URLSearchParams({
      notice: isFr ? 'Compte client créé.' : 'Client account created.',
      accessLink: finalLink,
    });
    revalidatePath(`/${locale}/admin/team`);
    redirect(`/${locale}/admin/team?${params.toString()}`);
  }

  async function clientAccountAction(formData: FormData) {
    'use server';
    const userProfileId = String(formData.get('userProfileId') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const action = String(formData.get('action') || '').trim();
    if (!userProfileId || !email || !action) return;

    const allMemberships = await listMemberships();
    const hasClientScope = allMemberships.some(
      (item) => item.user_profile_id === userProfileId && item.role === 'client'
    );
    if (!hasClientScope) return;

    let message = '';
    let generatedLink = '';
    if (action === 'activate') {
      await setClientCredentials(userProfileId, { status: 'active' });
      message = isFr ? 'Compte client activé.' : 'Client account activated.';
    } else if (action === 'disable') {
      await setClientCredentials(userProfileId, { status: 'disabled' });
      message = isFr ? 'Compte client désactivé.' : 'Client account disabled.';
    } else if (action === 'access_link') {
      const token = createClientActionToken(email, 'activate');
      const localLink = `${baseUrl}/${locale}/client/login?mode=activate&token=${encodeURIComponent(token)}`;
      const supabaseInvite =
        (await createSupabaseRecoveryLink({
          email,
          type: 'invite',
          redirectTo: `${baseUrl}/${locale}/client/login`,
        })) || null;
      generatedLink = supabaseInvite || localLink;
      message = isFr ? 'Lien d activation généré.' : 'Activation link generated.';
    } else if (action === 'reset_link') {
      const token = createClientActionToken(email, 'reset');
      const localLink = `${baseUrl}/${locale}/client/login?mode=reset&token=${encodeURIComponent(token)}`;
      const supabaseRecovery =
        (await createSupabaseRecoveryLink({
          email,
          type: 'recovery',
          redirectTo: `${baseUrl}/${locale}/client/login`,
        })) || null;
      generatedLink = supabaseRecovery || localLink;
      message = isFr ? 'Lien de réinitialisation généré.' : 'Reset link generated.';
    } else {
      return;
    }

    revalidatePath(`/${locale}/admin/team`);
    const params = new URLSearchParams({
      notice: message,
      ...(generatedLink ? { accessLink: generatedLink } : {}),
    });
    redirect(`/${locale}/admin/team?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">{isFr ? 'Equipe & roles' : 'Team & roles'}</h1>
        <p className="text-sm text-brand-muted mt-2">
          {isFr
            ? 'Visualisation des membres et de leur perimetre d intervention.'
            : 'View members and their intervention scope.'}
        </p>
      </div>

      {notice ? (
        <div className="rounded-xl border border-brand-accent/40 bg-brand-accent/10 p-4 text-sm text-brand-accent">
          {notice}
          {accessLink ? (
            <div className="mt-2">
              <a
                href={accessLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline break-all"
              >
                {accessLink}
              </a>
            </div>
          ) : null}
        </div>
      ) : null}

      <form
        action={createClientAccountAction}
        className="glass-panel rounded-xl border border-brand-border/50 p-5 space-y-3"
      >
        <h2 className="text-white font-semibold">
          {isFr ? 'Comptes portail client (admin-managed)' : 'Client portal accounts (admin-managed)'}
        </h2>
        <p className="text-xs text-brand-muted">
          {isFr
            ? 'Pas d inscription publique: seuls les admins créent et activent les comptes.'
            : 'No public signup: only admins create and activate accounts.'}
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            required
            name="displayName"
            placeholder={isFr ? 'Nom affichage client' : 'Client display name'}
            className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
          />
          <input
            required
            name="email"
            type="email"
            placeholder="client@domain.com"
            className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
          />
          <select
            required
            name="organizationId"
            className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
          >
            <option value="">{isFr ? 'Organisation cliente' : 'Client organization'}</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <select
            required
            name="workspaceId"
            className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
          >
            <option value="">{isFr ? 'Workspace client' : 'Client workspace'}</option>
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
          <input
            name="initialPassword"
            type="password"
            minLength={8}
            placeholder={isFr ? 'Mot de passe initial (optionnel)' : 'Initial password (optional)'}
            className="md:col-span-2 rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
          />
        </div>
        <button type="submit" className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy">
          {isFr ? 'Créer le compte client' : 'Create client account'}
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-brand-border/60">
        <table className="w-full text-sm">
          <thead className="bg-brand-slate text-brand-muted text-left">
            <tr>
              <th className="px-4 py-3">{isFr ? 'Compte client' : 'Client account'}</th>
              <th className="px-4 py-3">{isFr ? 'Statut accès' : 'Access status'}</th>
              <th className="px-4 py-3">{isFr ? 'Périmètre' : 'Scope'}</th>
              <th className="px-4 py-3">{isFr ? 'Actions' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {clientAccounts.map((account) => (
              <tr key={account.user.id} className="border-t border-brand-border/40">
                <td className="px-4 py-3 text-slate-200">
                  <div className="font-medium">{account.user.display_name}</div>
                  <div className="text-xs text-brand-muted">{account.user.email}</div>
                </td>
                <td className="px-4 py-3 text-brand-accent">
                  {account.auth.status}
                  <span className="ml-2 text-xs text-brand-muted">
                    {account.auth.hasPassword
                      ? isFr
                        ? 'mot de passe défini'
                        : 'password set'
                      : isFr
                      ? 'mot de passe absent'
                      : 'password missing'}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-muted">
                  {account.memberships.map((membership) => membership.workspace?.name ?? membership.workspace_id).join(', ')}
                </td>
                <td className="px-4 py-3">
                  <form action={clientAccountAction} className="flex flex-wrap gap-2">
                    <input type="hidden" name="userProfileId" value={account.user.id} />
                    <input type="hidden" name="email" value={account.user.email} />
                    <button
                      type="submit"
                      name="action"
                      value="activate"
                      className="rounded-md border border-brand-border/60 px-2 py-1 text-xs text-brand-muted hover:text-white"
                    >
                      {isFr ? 'Activer' : 'Activate'}
                    </button>
                    <button
                      type="submit"
                      name="action"
                      value="disable"
                      className="rounded-md border border-brand-border/60 px-2 py-1 text-xs text-brand-muted hover:text-white"
                    >
                      {isFr ? 'Désactiver' : 'Disable'}
                    </button>
                    <button
                      type="submit"
                      name="action"
                      value="access_link"
                      className="rounded-md border border-brand-border/60 px-2 py-1 text-xs text-brand-muted hover:text-white"
                    >
                      {isFr ? 'Lien accès' : 'Access link'}
                    </button>
                    <button
                      type="submit"
                      name="action"
                      value="reset_link"
                      className="rounded-md border border-brand-border/60 px-2 py-1 text-xs text-brand-muted hover:text-white"
                    >
                      {isFr ? 'Lien reset' : 'Reset link'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clientAccounts.length === 0 ? (
          <p className="p-6 text-sm text-brand-muted">
            {isFr ? 'Aucun compte client configuré.' : 'No client account configured.'}
          </p>
        ) : null}
      </div>

      <form action={createMembershipAction} className="glass-panel rounded-xl border border-brand-border/50 p-5 space-y-3">
        <h2 className="text-white font-semibold">{isFr ? 'Affecter un role' : 'Assign role'}</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <select name="userProfileId" className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white">
            <option value="">{isFr ? 'Nouveau profil (remplir email + nom)' : 'New profile (fill email + name)'}</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.display_name} - {user.email}
              </option>
            ))}
          </select>
          <select name="role" defaultValue="viewer" className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white">
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <input name="email" placeholder="email@domain.com" className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
          <input name="displayName" placeholder={isFr ? 'Nom affichage' : 'Display name'} className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
          <select name="organizationId" className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white">
            <option value="">{isFr ? 'Organisation (optionnel)' : 'Organization (optional)'}</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <select name="workspaceId" className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white">
            <option value="">{isFr ? 'Workspace (optionnel)' : 'Workspace (optional)'}</option>
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy">
          {isFr ? 'Affecter' : 'Assign'}
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-brand-border/60">
        <table className="w-full text-sm">
          <thead className="bg-brand-slate text-brand-muted text-left">
            <tr>
              <th className="px-4 py-3">{isFr ? 'Membre' : 'Member'}</th>
              <th className="px-4 py-3">{isFr ? 'Role' : 'Role'}</th>
              <th className="px-4 py-3">{isFr ? 'Organisation' : 'Organization'}</th>
              <th className="px-4 py-3">{isFr ? 'Workspace' : 'Workspace'}</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((membership) => (
              <tr key={membership.id} className="border-t border-brand-border/40">
                <td className="px-4 py-3 text-slate-200">
                  {membership.user_profile?.display_name ?? membership.user_profile_id}
                </td>
                <td className="px-4 py-3 text-brand-accent">{membership.role}</td>
                <td className="px-4 py-3 text-brand-muted">
                  {membership.organization?.name ?? membership.organization_id ?? '—'}
                </td>
                <td className="px-4 py-3 text-brand-muted">
                  {membership.workspace?.name ?? membership.workspace_id ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {memberships.length === 0 ? (
          <p className="p-6 text-sm text-brand-muted">{isFr ? 'Aucun membre affecte.' : 'No assigned member.'}</p>
        ) : null}
      </div>
    </div>
  );
}
