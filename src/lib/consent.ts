import type { CookiePreferences } from '@/src/types/crm';

export const CONSENT_STORAGE_KEY = 'impulcia_cookie_consent';

export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: '',
};

export function parseConsent(raw: string | null): CookiePreferences | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CookiePreferences;
    if (typeof parsed.essential !== 'boolean') return null;
    return {
      essential: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      timestamp: parsed.timestamp || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(prefs: CookiePreferences | null): boolean {
  return Boolean(prefs?.analytics);
}
