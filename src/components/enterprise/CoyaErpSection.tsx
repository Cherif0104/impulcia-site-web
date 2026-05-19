'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import SectionHeading from '@/src/components/ui/SectionHeading';

export default function CoyaErpSection() {
  const t = useTranslations('enterprise.coya');
  const pillars = t.raw('pillars') as { title: string; description: string }[];
  const capabilities = t.raw('capabilities') as string[];

  return (
    <section id="coya" className="py-24 relative bg-brand-slate/30">
      <div className="absolute inset-0 bg-hero-glow opacity-50" />
      <div className="section-container relative">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -12 : 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
              <p className="text-brand-muted text-sm">{p.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {capabilities.map((cap) => (
            <span
              key={cap}
              className="px-4 py-2 rounded-full border border-brand-border bg-brand-panel text-sm text-slate-200"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
