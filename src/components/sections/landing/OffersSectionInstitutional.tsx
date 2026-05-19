'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function OffersSectionInstitutional() {
  const t = useTranslations('landing.offers');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const poles = [
    {
      key: 'engineering',
      color: 'from-blue-600 to-blue-700'
    },
    {
      key: 'digital',
      color: 'from-cyan-600 to-cyan-700'
    },
    {
      key: 'infrastructure',
      color: 'from-green-600 to-green-700'
    },
    {
      key: 'consulting',
      color: 'from-purple-600 to-purple-700'
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {poles.map((pole, index) => {
            const poleData = t.raw(`poles.${pole.key}`);
            return (
              <motion.div
                key={pole.key}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className={`bg-gradient-to-r ${pole.color} text-white p-4 rounded-lg mb-6`}>
                  <h3 className="text-2xl font-bold">{poleData.title}</h3>
                </div>
                <ul className="space-y-3">
                  {poleData.items.map((item: string, itemIndex: number) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                      className="flex items-start"
                    >
                      <span className="text-blue-600 mr-2 mt-1">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

