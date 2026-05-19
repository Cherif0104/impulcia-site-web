'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import SectionHeading from '@/src/components/ui/SectionHeading';

export default function IndustriesEnterpriseSection() {
  const t = useTranslations('enterprise.sectors');
  const tPaths = useTranslations('enterprise.sectorPaths');
  const locale = useLocale();
  const isFr = locale === 'fr';
  const items = t.raw('items') as string[];
  const sectorPaths = tPaths.raw('items') as { id: string; name: string; description: string }[];

  return (
    <section id="industries" className="py-24">
      <div className="section-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
        <div className="flex flex-wrap justify-center gap-3">
          {items.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="px-5 py-3 rounded-xl glass-panel text-sm font-medium text-slate-200 hover:border-brand-accent/50 transition-colors cursor-default"
            >
              {item}
            </motion.span>
          ))}
        </div>

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
