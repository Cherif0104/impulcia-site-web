'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/src/lib/routing';
import { motion } from 'framer-motion';

interface OfferCardProps {
  title: string;
  subtitle: string;
  description: string;
  items: string[];
  cta: string;
  color: 'blue' | 'cyan' | 'green' | 'purple';
}

function OfferCard({ title, subtitle, description, items, cta, color }: OfferCardProps) {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    cyan: 'from-cyan-600 to-cyan-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all">
      <div className={`bg-gradient-to-r ${colorClasses[color]} text-white p-4 rounded-lg mb-6`}>
        <h3 className="text-3xl font-bold mb-2">{title}</h3>
        <p className="text-blue-100 font-medium">{subtitle}</p>
      </div>

      <p className="text-gray-700 mb-6">{description}</p>

      <ul className="space-y-3 mb-6">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            <span className="text-gray-700">{item}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/services"
        className={`inline-block bg-gradient-to-r ${colorClasses[color]} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
      >
        {cta}
      </Link>
    </div>
  );
}

export default function OffersSection() {
  const t = useTranslations('sections.offers');

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <OfferCard
            title={t('build.title')}
            subtitle={t('build.subtitle')}
            description={t('build.description')}
            items={t.raw('build.items')}
            cta={t('build.cta')}
            color="blue"
          />
          <OfferCard
            title={t('run.title')}
            subtitle={t('run.subtitle')}
            description={t('run.description')}
            items={t.raw('run.items')}
            cta={t('run.cta')}
            color="cyan"
          />
          <OfferCard
            title={t('scale.title')}
            subtitle={t('scale.subtitle')}
            description={t('scale.description')}
            items={t.raw('scale.items')}
            cta={t('scale.cta')}
            color="green"
          />
          <OfferCard
            title={t('care.title')}
            subtitle={t('care.subtitle')}
            description={t('care.description')}
            items={t.raw('care.items')}
            cta={t('care.cta')}
            color="purple"
          />
        </div>
      </div>
    </section>
  );
}

