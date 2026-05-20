'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import SectionHeading from '@/src/components/ui/SectionHeading';
import SectionVisual from './SectionVisual';

type CaseStudy = {
  id: string;
  sector: string;
  context: string;
  problem: string;
  solution: string;
  impact: string;
};

export default function CaseStudiesSection() {
  const t = useTranslations('enterprise.caseStudies');
  const locale = useLocale();
  const isFr = locale === 'fr';
  const studies = t.raw('items') as CaseStudy[];

  return (
    <section id="case-studies" className="py-24 bg-brand-slate/20">
      <div className="section-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <SectionVisual
          visualKey="caseStudies"
          alt={isFr ? "Schéma d'impacts de cas clients IMPULCIA" : 'IMPULCIA case studies impact visual'}
          className="mb-8 aspect-[16/6]"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="grid lg:grid-cols-3 gap-6">
          {studies.map((study, i) => (
            <motion.article
              key={study.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel rounded-2xl border border-brand-border/50 p-6"
            >
              <p className="text-xs uppercase tracking-wide text-brand-accent mb-4">{study.sector}</p>
              <div className="space-y-3 text-sm">
                <p className="text-slate-300">
                  <span className="font-semibold text-white">{isFr ? 'Contexte:' : 'Context:'}</span>{' '}
                  {study.context}
                </p>
                <p className="text-slate-300">
                  <span className="font-semibold text-white">{isFr ? 'Problème:' : 'Problem:'}</span>{' '}
                  {study.problem}
                </p>
                <p className="text-slate-300">
                  <span className="font-semibold text-white">{isFr ? 'Solution:' : 'Solution:'}</span>{' '}
                  {study.solution}
                </p>
                <p className="text-brand-accent">
                  <span className="font-semibold">{isFr ? 'Impact:' : 'Impact:'}</span> {study.impact}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
