'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import WhatsAppButton from '@/src/components/forms/WhatsAppButton';
import { trackAnalyticsEvent } from '@/src/lib/analytics-events';
import { getDeterministicCtaVariant, type CtaVariant } from '@/src/lib/ab-testing';

export default function HeroSection() {
  const t = useTranslations('sections.hero');
  const [variant, setVariant] = useState<CtaVariant>('A');

  useEffect(() => {
    const selected = getDeterministicCtaVariant();
    setVariant(selected);
    trackAnalyticsEvent({
      name: 'hero_cta_variant_exposed',
      category: 'cta',
      value: selected,
      metadata: { variant: selected, page: window.location.pathname },
    });
  }, []);

  const diagnosticLabel = t('cta.primary');
  const expertLabel = t('cta.secondary');
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 text-white py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium"
          >
            {t('location')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            {t('headline')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto"
          >
            {t('subheadline')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {variant === 'A' ? (
              <>
                <a
                  href="/#contact"
                  className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                  onClick={() =>
                    trackAnalyticsEvent({
                      name: 'hero_diagnostic_cta_clicked',
                      category: 'cta',
                      value: variant,
                      metadata: { variant, page: window.location.pathname },
                    })
                  }
                >
                  {diagnosticLabel}
                </a>
                <WhatsAppButton
                  includeNumber={false}
                  label={expertLabel}
                  className="px-8 py-4 text-base justify-center"
                  onClick={() =>
                    trackAnalyticsEvent({
                      name: 'hero_contact_expert_cta_clicked',
                      category: 'cta',
                      value: variant,
                      metadata: { variant, page: window.location.pathname },
                    })
                  }
                />
              </>
            ) : (
              <>
                <WhatsAppButton
                  includeNumber={false}
                  label={expertLabel}
                  className="px-8 py-4 text-base justify-center"
                  onClick={() =>
                    trackAnalyticsEvent({
                      name: 'hero_contact_expert_cta_clicked',
                      category: 'cta',
                      value: variant,
                      metadata: { variant, page: window.location.pathname },
                    })
                  }
                />
                <a
                  href="/#contact"
                  className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                  onClick={() =>
                    trackAnalyticsEvent({
                      name: 'hero_diagnostic_cta_clicked',
                      category: 'cta',
                      value: variant,
                      metadata: { variant, page: window.location.pathname },
                    })
                  }
                >
                  {diagnosticLabel}
                </a>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

