import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createWorkspace, listOrganizations, listWorkspaces } from '@/src/lib/db';
import { hasRequiredAdminRole } from '@/src/lib/admin-auth';

export default async function AdminWorkspacesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(await hasRequiredAdminRole(['workspace_manager', 'org_admin', 'owner']))) {
    redirect(`/${locale}/admin`);
  }
  const isFr = locale === 'fr';
  const [organizations, workspaces] = await Promise.all([listOrganizations(), listWorkspaces()]);

  async function createWorkspaceAction(formData: FormData) {
    'use server';
    const organizationId = String(formData.get('organizationId') || '').trim();
    const name = String(formData.get('name') || '').trim();
    const slug = String(formData.get('slug') || '').trim().toLowerCase();
    if (!organizationId || !name || !slug) return;
    await createWorkspace({ organizationId, name, slug, status: 'active' });
    revalidatePath(`/${locale}/admin/workspaces`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">
          {isFr ? 'Workspaces / Clients' : 'Workspaces / Clients'}
        </h1>
        <p className="text-sm text-brand-muted mt-2">
          {isFr
            ? 'Chaque client dispose de son espace de demandes.'
            : 'Each client gets a dedicated request workspace.'}
        </p>
      </div>

      <form action={createWorkspaceAction} className="glass-panel rounded-xl border border-brand-border/50 p-5">
        <h2 className="text-white font-semibold mb-4">{isFr ? 'Ajouter un workspace' : 'Add workspace'}</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <select
            name="organizationId"
            required
            className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
          >
            <option value="">{isFr ? 'Organisation' : 'Organization'}</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <input name="name" required placeholder={isFr ? 'Nom workspace' : 'Workspace name'} className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
          <input name="slug" required placeholder="slug" className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
          <button type="submit" className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy">
            {isFr ? 'Creer' : 'Create'}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-brand-border/60">
        <table className="w-full text-sm">
          <thead className="bg-brand-slate text-brand-muted text-left">
            <tr>
              <th className="px-4 py-3">{isFr ? 'Workspace' : 'Workspace'}</th>
              <th className="px-4 py-3">{isFr ? 'Organisation' : 'Organization'}</th>
              <th className="px-4 py-3">{isFr ? 'Statut' : 'Status'}</th>
            </tr>
          </thead>
          <tbody>
            {workspaces.map((workspace) => (
              <tr key={workspace.id} className="border-t border-brand-border/40">
                <td className="px-4 py-3 text-slate-200">{workspace.name}</td>
                <td className="px-4 py-3 text-brand-muted">
                  {organizations.find((item) => item.id === workspace.organization_id)?.name ?? workspace.organization_id}
                </td>
                <td className="px-4 py-3 text-brand-accent">{workspace.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {workspaces.length === 0 ? (
          <p className="p-6 text-sm text-brand-muted">{isFr ? 'Aucun workspace.' : 'No workspace yet.'}</p>
        ) : null}
      </div>
    </div>
  );
}
