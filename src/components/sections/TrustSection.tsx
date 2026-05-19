'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function TrustSection() {
  const t = useTranslations('sections.trust');

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {t.raw('badges').map((badge: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-gray-700 font-medium">{badge}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

