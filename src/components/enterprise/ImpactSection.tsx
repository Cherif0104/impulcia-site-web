'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function ImpactSection() {
  const t = useTranslations('enterprise.impact');
  const items = t.raw('items') as { value: string; label: string }[];

  return (
    <section className="py-12 border-y border-brand-border/40 bg-brand-slate/40">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-bold text-brand-accent">{item.value}</p>
              <p className="text-sm text-brand-muted mt-1">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
