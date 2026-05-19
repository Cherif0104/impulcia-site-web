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
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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
