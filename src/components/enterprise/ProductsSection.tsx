'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import SectionHeading from '@/src/components/ui/SectionHeading';
import Button from '@/src/components/ui/Button';
import { getProductFallbackLogo, getProductLogo } from '@/src/lib/media';
import { trackAnalyticsEvent } from '@/src/lib/analytics-events';
import SectionVisual from './SectionVisual';

type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  flagship?: boolean;
};

export default function ProductsSection() {
  const t = useTranslations('enterprise.products');
  const locale = useLocale();
  const items = t.raw('items') as Product[];

  return (
    <section id="products" className="py-24 bg-brand-slate/20">
      <div className="section-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <SectionVisual
          visualKey="products"
          alt={locale === 'fr' ? 'Vue du portefeuille de solutions IMPULCIA' : 'IMPULCIA product portfolio overview'}
          className="mb-8 aspect-[16/6]"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((product, i) => {
            const logoSrc = getProductLogo(product.id);

            return (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`group rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-card-hover ${
                  product.flagship
                    ? 'xl:col-span-2 glass-panel border-brand-accent/40 shadow-glow'
                    : 'bg-brand-panel/60 border-brand-border/50 hover:border-brand-accent/30'
                }`}
              >
                <div className="p-6 pb-4 flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-xl bg-white/95 flex items-center justify-center overflow-hidden shrink-0">
                    {logoSrc ? (
                      <Image
                        src={logoSrc || getProductFallbackLogo()}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-brand-navy font-bold text-lg">{product.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                    <p className="text-brand-accent text-sm">{product.tagline}</p>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <p className="text-brand-muted text-sm leading-relaxed mb-4">{product.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs px-2 py-1 rounded-md bg-brand-accent/10 text-brand-accent border border-brand-accent/20"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="grid gap-2 mb-4 rounded-xl border border-brand-border/50 bg-brand-panel/40 p-3 text-xs">
                    <p className="text-white">
                      <span className="text-brand-accent font-semibold">{locale === 'fr' ? 'Vision:' : 'Vision:'}</span>{' '}
                      {locale === 'fr'
                        ? `Aligner ${product.name} aux enjeux opérationnels et métiers prioritaires.`
                        : `Align ${product.name} with your highest-priority business and operations goals.`}
                    </p>
                    <p className="text-white">
                      <span className="text-brand-accent font-semibold">
                        {locale === 'fr' ? 'Méthodologie:' : 'Methodology:'}
                      </span>{' '}
                      {locale === 'fr'
                        ? 'Diagnostic court, cadrage orienté valeur puis déploiement progressif.'
                        : 'Short diagnostic, value-driven scoping, then phased rollout.'}
                    </p>
                    <p className="text-white">
                      <span className="text-brand-accent font-semibold">
                        {locale === 'fr' ? "Étapes d'intervention:" : 'Intervention steps:'}
                      </span>{' '}
                      {locale === 'fr'
                        ? 'Audit, architecture cible, mise en oeuvre, adoption et amélioration continue.'
                        : 'Audit, target architecture, implementation, adoption and continuous improvement.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      href={`/${locale}/${product.id}`}
                      variant="secondary"
                      size="md"
                      onClick={() =>
                        trackAnalyticsEvent({
                          name: 'product_card_case_study_clicked',
                          category: 'cta',
                          value: product.id,
                        })
                      }
                    >
                      {locale === 'fr' ? 'Voir le cas d’usage' : 'View use case'}
                    </Button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
