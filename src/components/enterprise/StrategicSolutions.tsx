'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import SectionHeading from '@/src/components/ui/SectionHeading';

type Solution = {
  id: string;
  title: string;
  description: string;
  highlight?: boolean;
  features: string[];
};

export default function StrategicSolutions() {
  const t = useTranslations('enterprise.solutions');
  const items = t.raw('items') as Solution[];

  return (
    <section id="solutions" className="py-24 relative">
      <div className="section-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl p-6 border transition-all duration-300 hover:shadow-card-hover ${
                item.highlight
                  ? 'glass-panel border-brand-accent/40 shadow-glow md:col-span-2'
                  : 'bg-brand-slate/40 border-brand-border/50 hover:border-brand-accent/30'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed mb-4">{item.description}</p>
              <ul className="flex flex-wrap gap-2">
                {item.features.map((f) => (
                  <li
                    key={f}
                    className="text-xs px-2 py-1 rounded-md bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
