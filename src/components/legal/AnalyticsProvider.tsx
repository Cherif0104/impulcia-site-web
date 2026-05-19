'use client';

import { useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { CONSENT_STORAGE_KEY, hasAnalyticsConsent, parseConsent } from '@/src/lib/consent';
import { getOrCreateSessionId } from '@/src/lib/session';

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const locale = useLocale();
  const lastPath = useRef<string | null>(null);

  const track = useCallback((path: string) => {
    const prefs = parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
    if (!hasAnalyticsConsent(prefs)) return;
    if (lastPath.current === path) return;
    lastPath.current = path;

    void fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-analytics-consent': 'granted',
        'x-session-id': getOrCreateSessionId(),
      },
      body: JSON.stringify({
        page: path,
        locale,
        referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
      }),
    });
  }, [locale]);

  useEffect(() => {
    track(pathname);
  }, [pathname, track]);

  useEffect(() => {
    const onConsent = () => {
      lastPath.current = null;
      track(pathname);
    };
    window.addEventListener('impulcia-consent-updated', onConsent);
    return () => window.removeEventListener('impulcia-consent-updated', onConsent);
  }, [pathname, track]);

  return null;
}
