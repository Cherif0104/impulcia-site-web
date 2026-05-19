'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function CaseStudiesSection() {
  const t = useTranslations('landing.caseStudies');
  const [currentIndex, setCurrentIndex] = useState(0);
  const cases = t.raw('cases');

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative h-96">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 h-full"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {cases[currentIndex].title}
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold text-gray-700">Contexte :</span>
                    <p className="text-gray-600">{cases[currentIndex].context}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Problème :</span>
                    <p className="text-gray-600">{cases[currentIndex].problem}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Solution :</span>
                    <p className="text-gray-600">{cases[currentIndex].solution}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Résultat :</span>
                    <p className="text-gray-600 font-semibold text-blue-600">
                      {cases[currentIndex].result}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            {cases.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

