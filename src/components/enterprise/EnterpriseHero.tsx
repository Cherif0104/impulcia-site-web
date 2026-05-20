'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import Button from '@/src/components/ui/Button';
import WhatsAppButton from '@/src/components/forms/WhatsAppButton';
import { heroSlides, partnerLogos } from '@/src/lib/media';
import { trackAnalyticsEvent } from '@/src/lib/analytics-events';

type HeroSlide = {
  id: string;
  src: string;
  altFr: string;
  altEn: string;
  captionFr: string;
  captionEn: string;
};

export default function EnterpriseHero() {
  const t = useTranslations('enterprise.hero');
  const locale = useLocale();
  const tImpact = useTranslations('enterprise.impact');
  const impactItems = tImpact.raw('items') as { value: string; label: string }[];
  const proofLogos = partnerLogos.slice(0, 4);
  const isFr = locale === 'fr';
  const slides = useMemo<HeroSlide[]>(
    () => [
      {
        id: 'erp-enterprise-platform',
        src: heroSlides[0],
        altFr: "Slide ERP enterprise platform d'IMPULCIA",
        altEn: 'IMPULCIA ERP enterprise platform slide',
        captionFr: 'ERP Enterprise Platform',
        captionEn: 'ERP Enterprise Platform',
      },
      {
        id: 'crm-sales-intelligence',
        src: heroSlides[1],
        altFr: 'Slide CRM et intelligence commerciale',
        altEn: 'CRM and sales intelligence slide',
        captionFr: 'CRM & Sales Intelligence',
        captionEn: 'CRM & Sales Intelligence',
      },
      {
        id: 'sirh-hr-platform',
        src: heroSlides[2],
        altFr: 'Slide plateforme SIRH',
        altEn: 'HRIS platform slide',
        captionFr: 'SIRH / HR Platform',
        captionEn: 'HRIS / HR Platform',
      },
      {
        id: 'data-business-intelligence',
        src: heroSlides[3],
        altFr: 'Slide data et business intelligence',
        altEn: 'Data and business intelligence slide',
        captionFr: 'Data & Business Intelligence',
        captionEn: 'Data & Business Intelligence',
      },
      {
        id: 'cloud-infrastructure',
        src: heroSlides[4],
        altFr: 'Slide cloud et infrastructure',
        altEn: 'Cloud and infrastructure slide',
        captionFr: 'Cloud & Infrastructure',
        captionEn: 'Cloud & Infrastructure',
      },
      {
        id: 'mobile-ecosystem',
        src: heroSlides[5],
        altFr: 'Slide ecosystème mobile',
        altEn: 'Mobile ecosystem slide',
        captionFr: 'Mobile Ecosystem',
        captionEn: 'Mobile Ecosystem',
      },
    ],
    []
  );
  const [activeSlide, setActiveSlide] = useState(0);
  const [failedSlides, setFailedSlides] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[activeSlide];
  const currentSlideSrc = failedSlides[currentSlide.id] ? '/images/placeholders/hero-enterprise.svg' : currentSlide.src;

  const goNext = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const goPrev = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

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

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-brand-border/60 bg-brand-panel/40 aspect-[16/11] lg:aspect-[4/3]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0.25, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.25, scale: 0.99 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentSlideSrc}
                    alt={isFr ? currentSlide.altFr : currentSlide.altEn}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 620px"
                    className="object-cover"
                    onError={() => setFailedSlides((prev) => ({ ...prev, [currentSlide.id]: true }))}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>
              <button
                type="button"
                onClick={goPrev}
                aria-label={isFr ? 'Slide precedente' : 'Previous slide'}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-white/25 bg-black/35 text-white hover:bg-black/55 transition"
              >
                ←
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label={isFr ? 'Slide suivante' : 'Next slide'}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border border-white/25 bg-black/35 text-white hover:bg-black/55 transition"
              >
                →
              </button>
              <div className="absolute bottom-3 left-3 rounded-md bg-black/45 px-3 py-1 text-xs text-white/90 border border-white/15">
                {isFr ? currentSlide.captionFr : currentSlide.captionEn}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="Hero slides">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === activeSlide ? 'w-8 bg-brand-accent' : 'w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`${isFr ? 'Aller au slide' : 'Go to slide'} ${i + 1}`}
                  aria-current={i === activeSlide}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
