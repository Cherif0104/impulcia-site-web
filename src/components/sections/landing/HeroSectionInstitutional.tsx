'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useTheme } from '@/src/components/ThemeProvider';
import WhatsAppButton from '@/src/components/forms/WhatsAppButton';

export default function HeroSectionInstitutional() {
  const t = useTranslations('landing.hero');
  const { themeConfig } = useTheme();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${themeConfig.primary} 0%, ${themeConfig.accent} 100%)`
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: themeConfig.accent }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            {...fadeInUp}
            className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium"
          >
            Au Sénégal, en Afrique et dans le monde
          </motion.div>

          <motion.h1
            {...fadeInUp}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            {t('title')}
          </motion.h1>

          <motion.p
            {...fadeInUp}
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            {...fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <WhatsAppButton includeNumber={false} label={t('cta.secondary')} className="px-8 py-4 text-base justify-center" />
            <a
              href="/#contact"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {t('cta.primary')}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

