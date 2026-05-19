'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import SectionHeading from '@/src/components/ui/SectionHeading';

export default function AboutImpulciaSection() {
  const t = useTranslations('enterprise.about');
  const points = t.raw('points') as string[];

  return (
    <section id="about" className="py-24">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              eyebrow={t('eyebrow')}
              title={t('title')}
              align="left"
            />
            <p className="text-brand-muted leading-relaxed -mt-8 mb-8">{t('body')}</p>
            <ul className="space-y-3">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-slate-300">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-gold shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel rounded-2xl p-8 border-brand-accent/20"
          >
            <p className="text-xs uppercase tracking-widest text-brand-accent mb-4">Studio digital</p>
            <div className="grid grid-cols-2 gap-4">
              {['Plateformes', 'ERP', 'Mobile', 'Cloud', 'Gouvernance', 'Data'].map((label) => (
                <div
                  key={label}
                  className="rounded-lg bg-brand-navy/60 border border-brand-border/50 p-4 text-center text-sm font-medium text-white"
                >
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
