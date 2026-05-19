'use client';

import { useTranslations } from 'next-intl';
import SectionHeading from '@/src/components/ui/SectionHeading';

export default function ChallengesSection() {
  const t = useTranslations('enterprise.challenges');
  const problems = t.raw('problems') as string[];
  const responses = t.raw('responses') as string[];

  return (
    <section id="challenges" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 via-transparent to-brand-accent/5" />
      <div className="section-container relative">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg font-semibold text-brand-gold mb-4">Les défis</h3>
            <ul className="space-y-3">
              {problems.map((p) => (
                <li key={p} className="flex gap-3 text-slate-300 text-sm">
                  <span className="text-red-400/80 shrink-0">×</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-brand-accent mb-4">Notre réponse</h3>
            <ul className="space-y-3">
              {responses.map((r) => (
                <li key={r} className="flex gap-3 text-slate-300 text-sm">
                  <span className="text-brand-accent shrink-0">✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
