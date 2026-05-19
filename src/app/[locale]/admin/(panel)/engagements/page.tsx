import { getTranslations } from 'next-intl/server';
import { listEngagements } from '@/src/lib/db';

export default async function AdminEngagementsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ source?: string; action?: string; startDate?: string; endDate?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const t = await getTranslations('crm.admin.engagements');

  const engagements = await listEngagements({
    source: query.source,
    action: query.action,
    startDate: query.startDate,
    endDate: query.endDate,
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-6">{t('title')}</h1>
      <form className="grid md:grid-cols-5 gap-3 mb-6 glass-panel rounded-xl p-4 border border-brand-border/40">
        <input
          name="source"
          defaultValue={query.source ?? ''}
          placeholder={t('source')}
          className="rounded-lg border border-brand-border/60 bg-brand-panel/50 px-3 py-2 text-sm text-white"
        />
        <input
          name="action"
          defaultValue={query.action ?? ''}
          placeholder={t('action')}
          className="rounded-lg border border-brand-border/60 bg-brand-panel/50 px-3 py-2 text-sm text-white"
        />
        <input
          type="date"
          name="startDate"
          defaultValue={query.startDate ?? ''}
          className="rounded-lg border border-brand-border/60 bg-brand-panel/50 px-3 py-2 text-sm text-white"
        />
        <input
          type="date"
          name="endDate"
          defaultValue={query.endDate ?? ''}
          className="rounded-lg border border-brand-border/60 bg-brand-panel/50 px-3 py-2 text-sm text-white"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-accent text-brand-navy font-semibold px-4 py-2 text-sm"
        >
          {t('filter')}
        </button>
      </form>

      <div className="space-y-3">
        {engagements.map((entry) => (
          <article key={entry.id} className="glass-panel rounded-xl p-4 border border-brand-border/40">
            <div className="flex flex-wrap gap-2 text-xs text-brand-muted mb-2">
              <span className="text-brand-accent">{entry.channel}</span>
              <span>·</span>
              <span>{entry.action}</span>
              <span>·</span>
              <span>{entry.source}</span>
              <span>·</span>
              <span>{new Date(entry.created_at).toLocaleString(locale)}</span>
            </div>
            <p className="text-sm text-white">{entry.page}</p>
            {entry.details ? <p className="text-xs text-brand-muted mt-2 whitespace-pre-wrap">{entry.details}</p> : null}
          </article>
        ))}
        {engagements.length === 0 ? (
          <p className="text-sm text-brand-muted">{t('empty')}</p>
        ) : null}
      </div>
    </div>
  );
}

