'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function PartnersSection() {
  const t = useTranslations('landing.partners');

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex justify-center items-center gap-8 opacity-60">
          <div className="text-gray-400 text-sm">Logo Partenaire 1</div>
          <div className="text-gray-400 text-sm">Logo Partenaire 2</div>
          <div className="text-gray-400 text-sm">Logo Partenaire 3</div>
        </div>
      </div>
    </section>
  );
}

