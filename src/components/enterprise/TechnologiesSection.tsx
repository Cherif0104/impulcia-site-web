'use client';

import { useLocale, useTranslations } from 'next-intl';
import SectionHeading from '@/src/components/ui/SectionHeading';
import AsyncMarqueeRows from '@/src/components/enterprise/AsyncMarqueeRows';
import { technologyCategoryLabels, technologyStack } from '@/src/lib/enterprise-taxonomy';
import SectionVisual from './SectionVisual';

export default function TechnologiesSection() {
  const t = useTranslations('enterprise.technologies');
  const locale = useLocale();
  const isFr = locale === 'fr';
  const grouped = Object.entries(
    technologyStack.reduce<Record<string, typeof technologyStack>>((acc, item) => {
      const key = item.category;
      acc[key] = acc[key] ? [...acc[key], item] : [item];
      return acc;
    }, {})
  ) as [keyof typeof technologyCategoryLabels, typeof technologyStack][];
  const marqueeRows = [
    { id: 'technologies-row-1', direction: 'left' as const, durationSec: 30, items: technologyStack.slice(0, 10).map((item) => ({ id: item.id, label: item.name, src: item.logo, subtitle: isFr ? 'Stack produit' : 'Product stack' })) },
    { id: 'technologies-row-2', direction: 'right' as const, durationSec: 35, items: technologyStack.slice(8, 20).map((item) => ({ id: item.id, label: item.name, src: item.logo, subtitle: isFr ? 'Plateforme data' : 'Data platform' })) },
    { id: 'technologies-row-3', direction: 'left' as const, durationSec: 40, items: technologyStack.slice(16).concat(technologyStack.slice(0, 6)).map((item) => ({ id: item.id, label: item.name, src: item.logo, subtitle: isFr ? 'Ops & cyber' : 'Ops & security' })) },
  ];

  return (
    <section id="technologies" className="py-24 bg-brand-slate/30">
      <div className="section-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
        <SectionVisual
          visualKey="technologies"
          alt="Architecture technologique moderne et interopérable"
          className="mb-8 aspect-[16/6]"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="grid lg:grid-cols-2 gap-4 mb-8">
          {grouped.map(([key, items]) => (
            <article key={key} className="glass-panel rounded-xl border border-brand-border/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                {isFr ? technologyCategoryLabels[key].fr : technologyCategoryLabels[key].en}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.slice(0, 6).map((tech) => (
                  <span
                    key={tech.id}
                    className="px-3 py-1.5 rounded-lg border border-brand-border/60 bg-brand-navy/55 text-xs text-slate-300"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <AsyncMarqueeRows rows={marqueeRows} locale={locale} />
      </div>
    </section>
  );
}
