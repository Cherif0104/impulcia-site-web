import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { listLeads, listMessages, getAnalyticsSummary, listServiceRequests } from '@/src/lib/db';
import { OPEN_REQUESTS_QUERY } from '@/src/lib/crm-labels';

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const t = await getTranslations('crm.admin.dashboard');
  try {
    const [leads, messages, stats, requests] = await Promise.all([
      listLeads(),
      listMessages(),
      getAnalyticsSummary(),
      listServiceRequests(),
    ]);

    const openRequests = requests.filter((item) => item.status !== 'done').length;
    const requestsBase = `/${locale}/admin/requests`;

    const cards: { label: string; value: number; href?: string }[] = [
      { label: t('leadsCount'), value: leads.length },
      { label: t('messagesCount'), value: messages.length },
      {
        label: t('openRequests'),
        value: openRequests,
        href: `${requestsBase}?status=${OPEN_REQUESTS_QUERY}`,
      },
      { label: t('totalRequests'), value: requests.length, href: requestsBase },
      { label: t('pageViews'), value: stats.totalPageViews },
      { label: t('sessions'), value: stats.uniqueSessions },
    ];

    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-white mb-2">{t('welcome')}</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {cards.map((c) => {
            const inner = (
              <>
                <p className="text-xs text-brand-muted uppercase tracking-wider">{c.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{c.value}</p>
                {c.href ? (
                  <p className="mt-2 text-xs text-brand-accent group-hover:text-brand-accent-hover">
                    {isFr ? 'Voir la liste →' : 'View list →'}
                  </p>
                ) : null}
              </>
            );
            return c.href ? (
              <Link
                key={c.label}
                href={c.href}
                className="glass-panel rounded-xl p-5 border-brand-accent/10 block transition hover:border-brand-accent/40 group"
              >
                {inner}
              </Link>
            ) : (
              <div key={c.label} className="glass-panel rounded-xl p-5 border-brand-accent/10">
                {inner}
              </div>
            );
          })}
        </div>
        <div className="glass-panel rounded-xl p-6 mt-8 border border-brand-border/50">
          <h2 className="text-white font-semibold text-lg mb-3">
            {isFr ? 'Rituel mensuel de gouvernance éditoriale' : 'Monthly content governance ritual'}
          </h2>
          <ul className="grid md:grid-cols-2 gap-2 text-sm text-brand-muted">
            <li>• {isFr ? 'Audit Hero (test 5 secondes)' : 'Hero audit (5-second test)'}</li>
            <li>• {isFr ? 'Mise à jour des 3 preuves chiffrées' : 'Refresh top 3 proof metrics'}</li>
            <li>• {isFr ? 'Publication d’un nouveau contenu preuve' : 'Publish one new proof content asset'}</li>
            <li>• {isFr ? 'Contrôle conversion mobile/desktop' : 'Review mobile/desktop conversion path'}</li>
            <li>• {isFr ? 'Revue Trust/RGPD et incidents' : 'Trust/GDPR and incidents review'}</li>
            <li>• {isFr ? 'KPI visite→lead et lead→rendez-vous' : 'KPIs visit→lead and lead→meeting'}</li>
          </ul>
          <a
            href="/docs/governance/content-governance.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex mt-4 text-sm text-brand-accent hover:text-brand-accent-hover transition"
          >
            {isFr ? 'Ouvrir la checklist complète' : 'Open full checklist'}
          </a>
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <a
              href={`/${locale}/admin/management`}
              className="text-brand-accent hover:text-brand-accent-hover transition"
            >
              {isFr ? 'Ouvrir Management général' : 'Open General management'}
            </a>
            <a
              href="https://www.linkedin.com/company/impulcia-afrique/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent hover:text-brand-accent-hover transition"
            >
              {isFr ? 'Voir LinkedIn IMPULCIA' : 'View IMPULCIA LinkedIn'}
            </a>
          </div>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="glass-panel rounded-xl p-6 border border-red-500/30">
        <h1 className="font-display text-2xl font-bold text-white mb-2">{t('welcome')}</h1>
        <p className="text-sm text-red-300">
          Impossible de charger les données du dashboard pour le moment.
        </p>
      </div>
    );
  }
}
