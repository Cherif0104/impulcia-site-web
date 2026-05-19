'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import ContactLeadForm from '@/src/components/forms/ContactLeadForm';
import Button from '@/src/components/ui/Button';

export default function EnterpriseCtaSection() {
  const t = useTranslations('enterprise.cta');
  const locale = useLocale();
  const isFr = locale === 'fr';

  return (
    <section id="contact" className="py-24">
      <div className="section-container">
        <div className="relative rounded-3xl overflow-hidden glass-panel border-brand-accent/30 p-10 md:p-16 mb-12 text-center">
          <div className="absolute inset-0 bg-hero-glow" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              {t('title')}
            </h2>
            <p className="text-brand-muted text-lg max-w-2xl mx-auto">{t('subtitle')}</p>
            <div className="grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto mt-8 text-left">
              <div className="rounded-xl border border-brand-border/50 bg-brand-panel/40 p-3">
                <p className="text-white text-sm font-semibold">
                  {isFr ? 'RGPD by design' : 'GDPR by design'}
                </p>
                <p className="text-brand-muted text-xs mt-1">
                  {isFr
                    ? 'Consentement, minimisation des données et traçabilité.'
                    : 'Consent, data minimization and full traceability.'}
                </p>
              </div>
              <div className="rounded-xl border border-brand-border/50 bg-brand-panel/40 p-3">
                <p className="text-white text-sm font-semibold">
                  {isFr ? 'Sécurité applicative' : 'Application security'}
                </p>
                <p className="text-brand-muted text-xs mt-1">
                  {isFr
                    ? 'Contrôles anti-abus, gouvernance d’accès et monitoring.'
                    : 'Abuse controls, access governance and continuous monitoring.'}
                </p>
              </div>
              <div className="rounded-xl border border-brand-border/50 bg-brand-panel/40 p-3">
                <p className="text-white text-sm font-semibold">
                  {isFr ? 'Support & disponibilité' : 'Support & availability'}
                </p>
                <p className="text-brand-muted text-xs mt-1">
                  {isFr
                    ? 'Exploitation continue avec engagements de service.'
                    : 'Continuous operations with service-level commitments.'}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button href={`/${locale}/trust`} variant="ghost" size="md">
                {isFr ? 'Voir Confiance & Sécurité' : 'View Trust & Security'}
              </Button>
            </div>
          </div>
        </div>
        <ContactLeadForm />
      </div>
    </section>
  );
}
