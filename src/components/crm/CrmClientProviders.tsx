'use client';

import CookieConsent from '@/src/components/legal/CookieConsent';
import AnalyticsProvider from '@/src/components/legal/AnalyticsProvider';

export default function CrmClientProviders() {
  return (
    <>
      <AnalyticsProvider />
      <CookieConsent />
    </>
  );
}
