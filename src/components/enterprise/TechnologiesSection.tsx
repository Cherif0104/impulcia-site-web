'use client';

import { useTranslations } from 'next-intl';
import SectionHeading from '@/src/components/ui/SectionHeading';

export default function TechnologiesSection() {
  const t = useTranslations('enterprise.technologies');
  const items = t.raw('items') as string[];

  return (
    <section id="technologies" className="py-24 bg-brand-slate/30">
      <div className="section-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
        <div className="flex flex-wrap justify-center gap-3">
          {items.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-lg border border-brand-border/60 bg-brand-navy/50 text-sm font-mono text-slate-300 hover:border-brand-accent/50 hover:text-brand-accent transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
