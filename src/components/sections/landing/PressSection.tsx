'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function PressSection() {
  const t = useTranslations('landing.press');

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {t.raw('items').map((item: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <p className="text-gray-700">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

