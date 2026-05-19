'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/src/lib/routing';
import { motion } from 'framer-motion';

export default function StartupActSection() {
  const t = useTranslations('sections.startupAct');

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 to-cyan-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {t.raw('items').map((item: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold mb-3">
                {item.title}
              </h3>
              <p className="text-blue-100">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/partnerships"
            className="inline-block bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}

