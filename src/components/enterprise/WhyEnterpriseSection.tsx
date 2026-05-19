'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import SectionHeading from '@/src/components/ui/SectionHeading';

export default function WhyEnterpriseSection() {
  const t = useTranslations('enterprise.why');
  const items = t.raw('items') as { title: string; description: string }[];

  return (
    <section className="py-24 bg-brand-slate/20">
      <div className="section-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-6 rounded-xl border border-brand-border/50 bg-brand-panel/50 hover:border-brand-accent/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-accent/15 flex items-center justify-center text-brand-accent font-bold mb-4">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-brand-muted">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
