import { getTranslations } from 'next-intl/server';
import { getAnalyticsSummary } from '@/src/lib/db';

export default async function AdminAnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const t = await getTranslations('crm.admin.analytics');
  try {
    const stats = await getAnalyticsSummary();

    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-sm text-brand-muted mb-8">{t('placeholder')}</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="glass-panel rounded-xl p-5">
            <p className="text-xs text-brand-muted">{t('byPage')} (total)</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.totalPageViews}</p>
          </div>
          <div className="glass-panel rounded-xl p-5">
            <p className="text-xs text-brand-muted">{isFr ? 'Sessions' : 'Sessions'}</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.uniqueSessions}</p>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-white mb-4">
          {isFr ? 'Entonnoir de conversion' : 'Conversion funnel'}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-panel rounded-xl p-5">
            <p className="text-xs text-brand-muted">{isFr ? 'Clics CTA' : 'CTA clicks'}</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.funnel?.ctaClicks ?? 0}</p>
          </div>
          <div className="glass-panel rounded-xl p-5">
            <p className="text-xs text-brand-muted">
              {isFr ? 'Formulaires leads envoyés' : 'Lead forms submitted'}
            </p>
            <p className="text-2xl font-bold text-white mt-1">{stats.funnel?.formSubmits ?? 0}</p>
          </div>
          <div className="glass-panel rounded-xl p-5">
            <p className="text-xs text-brand-muted">{isFr ? 'Intentions de rendez-vous' : 'Meeting intents'}</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.funnel?.meetingsBooked ?? 0}</p>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-white mb-4">{t('byPage')}</h2>
        <ul className="space-y-2">
          {Object.entries(stats.byPage).map(([page, count]) => (
            <li
              key={page}
              className="flex justify-between glass-panel rounded-lg px-4 py-3 text-sm"
            >
              <span className="text-slate-300 truncate mr-4">{page}</span>
              <span className="text-brand-accent font-medium">{count}</span>
            </li>
          ))}
          {Object.keys(stats.byPage).length === 0 && (
            <li className="text-brand-muted text-sm">Aucune donnée analytics collectée.</li>
          )}
        </ul>
        <h2 className="text-lg font-semibold text-white mt-10 mb-4">{isFr ? 'Événements' : 'Events'}</h2>
        <ul className="space-y-2">
          {Object.entries(stats.eventsByName ?? {}).map(([name, count]) => (
            <li
              key={name}
              className="flex justify-between glass-panel rounded-lg px-4 py-3 text-sm"
            >
              <span className="text-slate-300 truncate mr-4">{name}</span>
              <span className="text-brand-accent font-medium">{count}</span>
            </li>
          ))}
          {Object.keys(stats.eventsByName ?? {}).length === 0 && (
            <li className="text-brand-muted text-sm">Aucun événement funnel collecté.</li>
          )}
        </ul>
        <h2 className="text-lg font-semibold text-white mt-10 mb-4">
          {isFr ? 'Entonnoir par canal' : 'Funnel by channel'}
        </h2>
        <ul className="space-y-2">
          {Object.entries(
            (stats.funnelByChannel ?? {}) as Record<
              string,
              { cta: number; forms: number; total: number; conversionRate: number }
            >
          ).map(([channel, values]) => (
            <li key={channel} className="glass-panel rounded-lg px-4 py-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">{channel}</span>
                <span className="text-brand-accent font-medium">{values.conversionRate}%</span>
              </div>
              <p className="text-xs text-brand-muted mt-1">
                CTA: {values.cta} · Forms: {values.forms} · Total: {values.total}
              </p>
            </li>
          ))}
          {Object.keys(stats.funnelByChannel ?? {}).length === 0 && (
            <li className="text-brand-muted text-sm">Aucune donnée de canal collectée.</li>
          )}
        </ul>
      </div>
    );
  } catch {
    return (
      <div className="glass-panel rounded-xl p-6 border border-red-500/30">
        <h1 className="font-display text-2xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-sm text-red-300">Erreur de chargement des analytics.</p>
      </div>
    );
  }
}
