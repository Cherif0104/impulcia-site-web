import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { listLeads } from '@/src/lib/db';

export default async function AdminLeadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('crm.admin.leads');
  const tStatus = await getTranslations('crm.admin.status');
  try {
    const leads = await listLeads();

    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-white mb-6">{t('title')}</h1>
        <div className="overflow-x-auto rounded-xl border border-brand-border/60">
          <table className="w-full text-sm">
            <thead className="bg-brand-slate text-brand-muted text-left">
              <tr>
                <th className="px-4 py-3">{t('name')}</th>
                <th className="px-4 py-3">{t('email')}</th>
                <th className="px-4 py-3">{t('score')}</th>
                <th className="px-4 py-3">{t('priority')}</th>
                <th className="px-4 py-3">{t('phone')}</th>
                <th className="px-4 py-3">{t('status')}</th>
                <th className="px-4 py-3">{t('date')}</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-brand-border/40 hover:bg-brand-panel/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/${locale}/admin/leads/${lead.id}`}
                      className="text-brand-accent hover:underline"
                    >
                      {lead.first_name} {lead.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{lead.email}</td>
                  <td className="px-4 py-3 text-brand-accent font-semibold">{lead.score ?? 0}</td>
                  <td className="px-4 py-3 text-slate-300">{lead.priority ?? 'medium'}</td>
                  <td className="px-4 py-3 text-slate-400">{lead.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs bg-brand-accent/10 text-brand-accent">
                      {tStatus(lead.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-brand-muted">
                    {new Date(lead.created_at).toLocaleDateString(locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 && (
            <p className="p-8 text-center text-brand-muted text-sm">
              Aucun lead pour le moment.
            </p>
          )}
        </div>
      </div>
    );
  } catch {
    return (
      <div className="glass-panel rounded-xl p-6 border border-red-500/30">
        <h1 className="font-display text-2xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-sm text-red-300">Erreur de chargement des leads.</p>
      </div>
    );
  }
}
