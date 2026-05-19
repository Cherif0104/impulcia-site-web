'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import SectionHeading from '@/src/components/ui/SectionHeading';
import { getPartnerLogoSrc, partnerLogos } from '@/src/lib/media';

function PartnerLogoCard({ name, src }: { name: string; src: string }) {
  const [imgSrc, setImgSrc] = useState(getPartnerLogoSrc(src));

  return (
    <div
      className="group flex items-center justify-center h-24 px-4 rounded-xl glass-panel border-brand-border/40 hover:border-brand-accent/30 transition-all"
      title={name}
    >
      <Image
        src={imgSrc}
        alt={name}
        width={120}
        height={48}
        className="max-h-12 w-auto object-contain opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
        onError={() => setImgSrc('/images/brand/impulcia-alt.png')}
      />
    </div>
  );
}

export default function PartnersSection() {
  const t = useTranslations('enterprise.partners');
  const locale = useLocale();

  return (
    <section id="partners" className="py-24">
      <div className="section-container">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {partnerLogos.map((partner) => (
            <PartnerLogoCard key={partner.id} name={partner.name} src={partner.src} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href={`/${locale}/realisations`}
            className="text-sm text-brand-accent hover:text-brand-accent-hover transition"
          >
            {locale === 'fr' ? 'Voir les études de cas détaillées' : 'View detailed case studies'}
          </a>
        </div>
      </div>
    </section>
  );
}
