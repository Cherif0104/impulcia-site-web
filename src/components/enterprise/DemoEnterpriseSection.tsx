'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import SectionHeading from '@/src/components/ui/SectionHeading';
import Button from '@/src/components/ui/Button';
import WhatsAppButton from '@/src/components/forms/WhatsAppButton';
import CoyaDashboardMock from './CoyaDashboardMock';

export default function DemoEnterpriseSection() {
  const t = useTranslations('enterprise.demo');
  const locale = useLocale();
  const features = t.raw('features') as string[];

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent" />
      <div className="section-container relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading
              eyebrow={t('eyebrow')}
              title={t('title')}
              subtitle={t('subtitle')}
              align="left"
            />
            <ul className="space-y-3 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-slate-300">
                  <span className="text-brand-accent">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <WhatsAppButton
                includeNumber={false}
                label={locale === 'fr' ? 'Contacter un expert' : 'Contact an expert'}
                className="px-7 py-3.5 text-base"
              />
              <Button href={`/${locale}/#contact`} variant="secondary" size="lg">
                {locale === 'fr' ? 'Demander un diagnostic' : 'Request a diagnostic'}
              </Button>
            </div>
          </div>
          <CoyaDashboardMock />
        </div>
      </div>
    </section>
  );
}
