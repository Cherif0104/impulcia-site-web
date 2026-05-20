'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import SectionHeading from '@/src/components/ui/SectionHeading';
import SectionVisual from './SectionVisual';

type AICapability = {
  name: string;
  description: string;
  product: string;
};

export default function AiCapabilitiesSection() {
  const t = useTranslations('enterprise.aiCapabilities');
  const locale = useLocale();
  const items = t.raw('items') as AICapability[];

  return (
    <section id="ai-capabilities" className="py-24 bg-brand-slate/20">
      <div className="section-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <SectionVisual
          visualKey="aiCapabilities"
          alt={locale === 'fr' ? "Cartographie des capacités IA par produit IMPULCIA" : 'IMPULCIA product AI capabilities map'}
          className="mb-8 aspect-[16/6]"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel rounded-2xl border border-brand-border/50 p-5"
            >
              <p className="text-xs uppercase tracking-wide text-brand-accent mb-2">{item.product}</p>
              <h3 className="text-white font-semibold mb-3">{item.name}</h3>
              <p className="text-sm text-brand-muted leading-relaxed">{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
