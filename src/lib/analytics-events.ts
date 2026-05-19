'use client';

import { getOrCreateSessionId } from '@/src/lib/session';
import { CONSENT_STORAGE_KEY, hasAnalyticsConsent, parseConsent } from '@/src/lib/consent';

type EventPayload = {
  name: string;
  category: 'cta' | 'form' | 'funnel';
  page?: string;
  value?: string;
  metadata?: Record<string, string>;
};

export function trackAnalyticsEvent(payload: EventPayload) {
  try {
    const prefs = parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
    if (!hasAnalyticsConsent(prefs)) return;

    void fetch('/api/analytics/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-analytics-consent': 'granted',
        'x-session-id': getOrCreateSessionId(),
      },
      body: JSON.stringify({
        ...payload,
        page: payload.page || window.location.pathname,
      }),
    });
  } catch {
    // No-op on client analytics failures
  }
}
