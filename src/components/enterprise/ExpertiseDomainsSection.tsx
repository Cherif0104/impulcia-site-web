'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import SectionHeading from '@/src/components/ui/SectionHeading';
import { expertiseBlocks } from '@/src/lib/enterprise-taxonomy';
import SectionVisual from './SectionVisual';

export default function ExpertiseDomainsSection() {
  const t = useTranslations('enterprise.expertise');
  const locale = useLocale();
  const isFr = locale === 'fr';
  const solutionsGroups = t.raw('solutions') as { title: string; items: string[] }[];

  return (
    <section id="expertise" className="py-24">
      <div className="section-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <SectionVisual
          visualKey="expertise"
          alt={
            locale === 'fr'
              ? "Panorama visuel des domaines d'intervention IMPULCIA"
              : 'Visual panorama of IMPULCIA intervention domains'
          }
          className="mb-8 aspect-[16/6]"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {expertiseBlocks.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="p-5 rounded-xl border border-brand-border/50 bg-brand-panel/40 hover:border-brand-gold/40 transition-colors"
            >
              <h3 className="text-sm font-semibold text-white mb-2">{isFr ? item.title.fr : item.title.en}</h3>
              <p className="text-xs text-brand-muted leading-relaxed mb-3">{isFr ? item.summary.fr : item.summary.en}</p>
              <details className="group">
                <summary className="text-xs text-brand-accent cursor-pointer select-none">
                  {isFr ? 'Voir les capacites' : 'View capabilities'}
                </summary>
                <ul className="mt-3 space-y-2">
                  {item.capabilities.map((capability) => (
                    <li key={capability.fr} className="text-xs text-brand-muted flex gap-2">
                      <span className="text-brand-accent">•</span>
                      <span>{isFr ? capability.fr : capability.en}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </motion.div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          {solutionsGroups.map((group) => (
            <article key={group.title} className="glass-panel rounded-xl border border-brand-border/50 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="px-3 py-1.5 rounded-lg border border-brand-border/60 bg-brand-navy/50 text-xs text-brand-muted">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
