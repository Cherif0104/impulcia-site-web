import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createOrganization, listOrganizations } from '@/src/lib/db';
import { hasRequiredAdminRole } from '@/src/lib/admin-auth';

export default async function AdminOrganizationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(await hasRequiredAdminRole(['org_admin', 'owner']))) {
    redirect(`/${locale}/admin`);
  }
  const isFr = locale === 'fr';
  const organizations = await listOrganizations();

  async function createOrganizationAction(formData: FormData) {
    'use server';
    const name = String(formData.get('name') || '').trim();
    const slug = String(formData.get('slug') || '').trim().toLowerCase();
    const type = String(formData.get('type') || 'client') === 'parent' ? 'parent' : 'client';
    const parentOrgId = String(formData.get('parentOrgId') || '').trim() || undefined;
    if (!name || !slug) return;
    await createOrganization({ name, slug, type, parentOrgId });
    revalidatePath(`/${locale}/admin/organizations`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">
          {isFr ? 'Organizations' : 'Organizations'}
        </h1>
        <p className="text-sm text-brand-muted mt-2">
          {isFr
            ? 'Structure mere/client pour piloter les comptes.'
            : 'Parent/client structure to manage accounts.'}
        </p>
      </div>

      <form action={createOrganizationAction} className="glass-panel rounded-xl border border-brand-border/50 p-5">
        <h2 className="text-white font-semibold mb-4">{isFr ? 'Ajouter une organisation' : 'Add organization'}</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <input name="name" required placeholder={isFr ? 'Nom' : 'Name'} className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
          <input name="slug" required placeholder="slug" className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white" />
          <select name="type" className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white">
            <option value="parent">{isFr ? 'Mere' : 'Parent'}</option>
            <option value="client">{isFr ? 'Client' : 'Client'}</option>
          </select>
          <button type="submit" className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy">
            {isFr ? 'Creer' : 'Create'}
          </button>
        </div>
        <input
          name="parentOrgId"
          placeholder={isFr ? 'ID organisation mere (optionnel)' : 'Parent organization ID (optional)'}
          className="mt-3 w-full rounded-lg border border-brand-border/60 bg-brand-panel/30 px-3 py-2 text-sm text-white"
        />
      </form>

      <div className="overflow-x-auto rounded-xl border border-brand-border/60">
        <table className="w-full text-sm">
          <thead className="bg-brand-slate text-brand-muted text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Parent</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org.id} className="border-t border-brand-border/40">
                <td className="px-4 py-3 text-slate-200">{org.name}</td>
                <td className="px-4 py-3 text-brand-accent">{org.type}</td>
                <td className="px-4 py-3 text-brand-muted">{org.parent_org_id ?? '—'}</td>
                <td className="px-4 py-3 text-brand-muted">{org.active ? 'active' : 'inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {organizations.length === 0 ? (
          <p className="p-6 text-sm text-brand-muted">{isFr ? 'Aucune organisation.' : 'No organization yet.'}</p>
        ) : null}
      </div>
    </div>
  );
}
