'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/src/components/ui/SectionHeading';
import SectionVisual from './SectionVisual';

type Tab = { id: string; label: string; items: string[] };

export default function ModulesSection() {
  const t = useTranslations('enterprise.modules');
  const tabs = t.raw('tabs') as Tab[];
  const [active, setActive] = useState(tabs[0]?.id ?? 'finance');
  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <section id="modules" className="py-24">
      <div className="section-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active === tab.id
                  ? 'bg-brand-accent text-brand-navy'
                  : 'bg-brand-panel border border-brand-border text-brand-muted hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-panel rounded-2xl p-8 max-w-3xl mx-auto"
          >
            <SectionVisual
              visualKey="modules"
              alt="Paysage fonctionnel des modules ERP"
              className="mb-6 aspect-[16/8]"
              sizes="(max-width: 1024px) 100vw, 768px"
            />
            <h3 className="text-2xl font-bold text-white mb-6 text-center">{current?.label}</h3>
            <ul className="grid sm:grid-cols-2 gap-3">
              {current?.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-brand-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
