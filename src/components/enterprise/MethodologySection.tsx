'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import SectionHeading from '@/src/components/ui/SectionHeading';

export default function MethodologySection() {
  const t = useTranslations('enterprise.methodology');
  const steps = t.raw('steps') as { title: string; description: string }[];

  return (
    <section id="methodology" className="py-24 bg-brand-slate/20">
      <div className="section-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
        <div className="grid md:grid-cols-5 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative p-5 rounded-xl glass-panel border-brand-border/50"
            >
              <span className="text-3xl font-bold text-brand-accent/30 absolute top-3 right-4">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-sm font-semibold text-white mb-2 pr-8">{step.title}</h3>
              <p className="text-xs text-brand-muted">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
