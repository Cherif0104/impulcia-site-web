'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

export default function TrustSectionInstitutional() {
  const t = useTranslations('landing.trust');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: 5, label: t('stats.years'), suffix: '+' },
    { value: 50, label: t('stats.projects'), suffix: '+' },
    { value: 30, label: t('stats.clients'), suffix: '+' },
    { value: 3, label: t('stats.countries'), suffix: '+' }
  ];

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {isInView && (
                  <CountUpAnimation
                    end={stat.value}
                    suffix={stat.suffix}
                  />
                )}
              </div>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {t.raw('clientTypes').map((type: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
              className="px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {type}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUpAnimation({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  return <>{count}{suffix}</>;
}

