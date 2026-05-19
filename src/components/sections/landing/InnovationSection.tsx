'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function InnovationSection() {
  const t = useTranslations('landing.innovation');

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            {t('text')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

