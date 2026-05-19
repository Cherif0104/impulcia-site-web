'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Button from '@/src/components/ui/Button';
import WhatsAppButton from '@/src/components/forms/WhatsAppButton';
import CoyaDashboardMock from './CoyaDashboardMock';
import { partnerLogos } from '@/src/lib/media';
import { trackAnalyticsEvent } from '@/src/lib/analytics-events';

export default function EnterpriseHero() {
  const t = useTranslations('enterprise.hero');
  const locale = useLocale();
  const tImpact = useTranslations('enterprise.impact');
  const impactItems = tImpact.raw('items') as { value: string; label: string }[];
  const proofLogos = partnerLogos.slice(0, 4);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <motion.div className="absolute inset-0 bg-hero-glow" />
      <motion.div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />

      <motion.div className="section-container relative z-10">
        <motion.div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold text-xs font-semibold tracking-wide uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
              {t('badge')}
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-balance gradient-text mb-6">
              {t('title')}
            </h1>

            <p className="text-lg text-brand-muted leading-relaxed mb-4 max-w-xl">{t('subtitle')}</p>

            <p className="text-sm text-brand-accent/90 font-medium tracking-wide mb-8">{t('tags')}</p>
            <div className="flex flex-wrap gap-4 text-xs text-brand-muted mb-6">
              <a
                href={`/${locale}/for-enterprises`}
                className="hover:text-brand-accent transition"
                onClick={() =>
                  trackAnalyticsEvent({
                    name: 'abm_enterprise_variant_opened',
                    category: 'funnel',
                    value: 'enterprise',
                  })
                }
              >
                {locale === 'fr' ? 'Parcours Grands Comptes' : 'Enterprise pathway'}
              </a>
              <a
                href={`/${locale}/for-institutions`}
                className="hover:text-brand-accent transition"
                onClick={() =>
                  trackAnalyticsEvent({
                    name: 'abm_institution_variant_opened',
                    category: 'funnel',
                    value: 'institution',
                  })
                }
              >
                {locale === 'fr' ? 'Parcours Institutions' : 'Institution pathway'}
              </a>
              <a
                href={`/${locale}/for-donors`}
                className="hover:text-brand-accent transition"
                onClick={() =>
                  trackAnalyticsEvent({
                    name: 'abm_donor_variant_opened',
                    category: 'funnel',
                    value: 'donor',
                  })
                }
              >
                {locale === 'fr' ? 'Parcours Bailleurs' : 'Donor pathway'}
              </a>
            </div>

            <motion.div className="flex flex-wrap gap-3">
              <WhatsAppButton
                includeNumber={false}
                className="px-7 py-3.5 text-base"
                label={locale === 'fr' ? 'Contacter un expert' : 'Contact an expert'}
                onClick={() =>
                  trackAnalyticsEvent({
                    name: 'hero_primary_cta_clicked',
                    category: 'cta',
                    value: 'whatsapp',
                  })
                }
              />
              <Button
                href={`/${locale}/#contact`}
                variant="secondary"
                size="lg"
                onClick={() =>
                  trackAnalyticsEvent({
                    name: 'hero_secondary_cta_clicked',
                    category: 'cta',
                    value: 'contact-form',
                  })
                }
              >
                {locale === 'fr' ? 'Demander un diagnostic' : 'Request a diagnostic'}
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {impactItems.slice(0, 4).map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-brand-border/50 bg-brand-panel/40 px-3 py-2"
                >
                  <p className="text-lg font-bold text-white">{item.value}</p>
                  <p className="text-[11px] text-brand-muted">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-wider text-brand-muted mb-2">
                {t('cta.portfolio')}
              </p>
              <div className="flex items-center gap-3">
                {proofLogos.map((partner) => (
                  <div
                    key={partner.id}
                    className="h-10 w-24 rounded-md border border-brand-border/50 bg-white/95 px-2 flex items-center justify-center"
                    title={partner.name}
                  >
                    <Image
                      src={partner.src}
                      alt={partner.name}
                      width={72}
                      height={20}
                      className="max-h-5 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <CoyaDashboardMock />
        </motion.div>
      </motion.div>
    </section>
  );
}
