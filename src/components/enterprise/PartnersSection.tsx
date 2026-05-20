'use client';

import { useLocale, useTranslations } from 'next-intl';
import SectionHeading from '@/src/components/ui/SectionHeading';
import AsyncMarqueeRows from '@/src/components/enterprise/AsyncMarqueeRows';
import { partnerLogos } from '@/src/lib/media';

export default function PartnersSection() {
  const t = useTranslations('enterprise.partners');
  const locale = useLocale();
  const isFr = locale === 'fr';
  const rows = [
    { id: 'partners-row-1', direction: 'left' as const, durationSec: 34, items: partnerLogos.slice(0, 8).map((item) => ({ id: item.id, label: item.name, src: item.src, subtitle: isFr ? 'Compte enterprise' : 'Enterprise account' })) },
    { id: 'partners-row-2', direction: 'right' as const, durationSec: 29, items: partnerLogos.slice(6, 14).map((item) => ({ id: item.id, label: item.name, src: item.src, subtitle: isFr ? 'Programme institutionnel' : 'Institutional program' })) },
    { id: 'partners-row-3', direction: 'left' as const, durationSec: 41, items: partnerLogos.slice(10).concat(partnerLogos.slice(0, 4)).map((item) => ({ id: item.id, label: item.name, src: item.src, subtitle: isFr ? 'Projet multi-pays' : 'Multi-country delivery' })) },
  ];

  return (
    <section id="partners" className="py-24">
      <div className="section-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <article className="glass-panel rounded-xl border border-brand-border/50 p-4">
            <p className="text-xs uppercase tracking-wide text-brand-muted mb-1">{isFr ? 'Ecosysteme' : 'Ecosystem'}</p>
            <p className="text-2xl font-semibold text-white">{partnerLogos.length}+</p>
            <p className="text-sm text-brand-muted">{isFr ? 'References actives' : 'Active references'}</p>
          </article>
          <article className="glass-panel rounded-xl border border-brand-border/50 p-4">
            <p className="text-xs uppercase tracking-wide text-brand-muted mb-1">{isFr ? 'Couverture' : 'Coverage'}</p>
            <p className="text-2xl font-semibold text-white">4</p>
            <p className="text-sm text-brand-muted">{isFr ? 'Zones geographiques' : 'Geographic zones'}</p>
          </article>
          <article className="glass-panel rounded-xl border border-brand-border/50 p-4">
            <p className="text-xs uppercase tracking-wide text-brand-muted mb-1">{isFr ? 'Execution' : 'Execution'}</p>
            <p className="text-2xl font-semibold text-white">24/7</p>
            <p className="text-sm text-brand-muted">{isFr ? 'Support programmes critiques' : 'Critical program support'}</p>
          </article>
        </div>
        <AsyncMarqueeRows rows={rows} locale={locale} />
        <div className="mt-8 text-center">
          <a
            href={`/${locale}/realisations`}
            className="text-sm text-brand-accent hover:text-brand-accent-hover transition"
          >
            {locale === 'fr' ? 'Voir les études de cas détaillées' : 'View detailed case studies'}
          </a>
        </div>
      </div>
    </section>
  );
}
