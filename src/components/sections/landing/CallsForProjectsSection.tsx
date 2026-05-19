'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/src/lib/routing';
import { motion } from 'framer-motion';

export default function CallsForProjectsSection() {
  const t = useTranslations('landing.callsForProjects');

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('subtitle')}
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {t.raw('types').map((type: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                {type}
              </motion.div>
            ))}
          </div>

          <Link
            href="/partnerships"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}

