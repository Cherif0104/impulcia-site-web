'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import SectionHeading from '@/src/components/ui/SectionHeading';
import AsyncMarqueeRows from '@/src/components/enterprise/AsyncMarqueeRows';
import { sectorsCatalog } from '@/src/lib/enterprise-taxonomy';
import SectionVisual from './SectionVisual';

export default function IndustriesEnterpriseSection() {
  const t = useTranslations('enterprise.sectors');
  const tPaths = useTranslations('enterprise.sectorPaths');
  const locale = useLocale();
  const isFr = locale === 'fr';
  const sectorPaths = tPaths.raw('items') as { id: string; name: string; description: string }[];
  const marqueeRows = [
    {
      id: 'sectors-row-1',
      direction: 'left' as const,
      durationSec: 28,
      items: sectorsCatalog.map((sector) => ({
        id: sector.id,
        label: isFr ? sector.name.fr : sector.name.en,
        subtitle: isFr ? sector.focus.fr : sector.focus.en,
      })),
    },
    {
      id: 'sectors-row-2',
      direction: 'right' as const,
      durationSec: 34,
      items: sectorsCatalog
        .slice()
        .reverse()
        .map((sector) => ({
          id: `rev-${sector.id}`,
          label: isFr ? sector.name.fr : sector.name.en,
          subtitle: isFr ? 'Parcours metier' : 'Business pathway',
        })),
    },
  ];

  return (
    <section id="industries" className="py-24">
      <div className="section-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
        <SectionVisual
          visualKey="industries"
          alt={isFr ? 'Carte des parcours sectoriels couverts par IMPULCIA' : 'Industry pathways covered by IMPULCIA'}
          className="mb-8 aspect-[16/6]"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {sectorsCatalog.map((sector, i) => (
            <motion.article
              key={sector.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="glass-panel rounded-xl border border-brand-border/50 p-4"
            >
              <h3 className="text-sm font-semibold text-white">{isFr ? sector.name.fr : sector.name.en}</h3>
              <p className="text-xs text-brand-muted mt-2 leading-relaxed">{isFr ? sector.focus.fr : sector.focus.en}</p>
            </motion.article>
          ))}
        </div>
        <AsyncMarqueeRows rows={marqueeRows} locale={locale} />

        <div className="mt-12">
          <SectionHeading eyebrow={tPaths('eyebrow')} title={tPaths('title')} />
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {sectorPaths.map((sector, i) => (
              <motion.article
                key={sector.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel rounded-xl border border-brand-border/50 p-4"
              >
                <h3 className="text-sm font-semibold text-white">{sector.name}</h3>
                <p className="text-xs text-brand-muted mt-2 mb-3 leading-relaxed">{sector.description}</p>
                <a
                  href={`/${locale}/realisations`}
                  className="text-xs text-brand-accent hover:text-brand-accent-hover transition"
                >
                  {isFr ? 'Voir le parcours →' : 'View pathway →'}
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
