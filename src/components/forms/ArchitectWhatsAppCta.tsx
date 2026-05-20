'use client';

import { MouseEvent } from 'react';
import { buildWhatsAppUrl } from '@/src/lib/whatsapp';
import { getOrCreateSessionId } from '@/src/lib/session';
import { trackAnalyticsEvent } from '@/src/lib/analytics-events';

type Props = {
  locale: 'fr' | 'en';
  source: string;
  className?: string;
  label?: string;
};

export default function ArchitectWhatsAppCta({ locale, source, className = '', label }: Props) {
  const text =
    locale === 'fr'
      ? "Bonjour IMPULCIA AFRIQUE, je souhaite parler a un architecte systèmes d'information pour cadrer mon besoin."
      : 'Hello IMPULCIA AFRIQUE, I want to speak with an information systems architect to scope my project.';

  const href = buildWhatsAppUrl(text);
  const ctaLabel = label ?? (locale === 'fr' ? 'Parler a un architecte' : 'Talk to an architect');

  function handleClick(_event: MouseEvent<HTMLAnchorElement>) {
    const page = typeof window !== 'undefined' ? window.location.pathname : '/';
    const sessionId = getOrCreateSessionId();

    trackAnalyticsEvent({
      name: 'architect_whatsapp_click',
      category: 'cta',
      value: source,
      page,
      metadata: { source },
    });

    void fetch('/api/engagement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId,
      },
      body: JSON.stringify({
        action: 'architect_whatsapp_click',
        source,
        page,
        locale,
      }),
      keepalive: true,
    });
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-accent-hover ${className}`}
    >
      {ctaLabel}
    </a>
  );
}
