'use client';

import { useCallback, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { CONSENT_STORAGE_KEY, DEFAULT_PREFERENCES, parseConsent } from '@/src/lib/consent';
import type { CookiePreferences } from '@/src/types/crm';
import { getOrCreateSessionId } from '@/src/lib/session';

type View = 'banner' | 'customize';

export default function CookieConsent() {
  const t = useTranslations('legal.cookie');
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<View>('banner');
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
    if (!stored) setVisible(true);
    else {
      setAnalytics(stored.analytics);
      setMarketing(stored.marketing);
    }
  }, []);

  const persist = useCallback(async (prefs: CookiePreferences) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent('impulcia-consent-updated', { detail: prefs }));
    setVisible(false);
    try {
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': getOrCreateSessionId() },
        body: JSON.stringify({ analytics: prefs.analytics, marketing: prefs.marketing }),
      });
    } catch {
      /* optional */
    }
  }, []);

  if (!visible) return null;

  return (
    <div role="dialog" aria-labelledby="cookie-title" className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-brand-border/80 bg-brand-slate/95 backdrop-blur-xl shadow-card p-6">
        <h2 id="cookie-title" className="font-display text-lg font-bold text-white mb-2">{t('title')}</h2>
        <p className="text-sm text-brand-muted mb-4 leading-relaxed">{t('description')}</p>
        {view === 'customize' && (
          <div className="space-y-4 mb-6 text-sm">
            <div className="flex justify-between gap-4 p-3 rounded-lg bg-brand-panel/60 border border-brand-border/50">
              <div>
                <p className="font-medium text-white">{t('essential')}</p>
                <p className="text-brand-muted text-xs mt-1">{t('essentialDesc')}</p>
              </div>
              <span className="text-brand-accent text-xs shrink-0">{t('alwaysOn')}</span>
            </div>
            <label className="flex justify-between gap-4 p-3 rounded-lg bg-brand-panel/60 border border-brand-border/50 cursor-pointer">
              <div>
                <p className="font-medium text-white">{t('analytics')}</p>
                <p className="text-brand-muted text-xs mt-1">{t('analyticsDesc')}</p>
              </div>
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 h-4 w-4 accent-brand-accent" />
            </label>
            <label className="flex justify-between gap-4 p-3 rounded-lg bg-brand-panel/60 border border-brand-border/50 cursor-pointer">
              <div>
                <p className="font-medium text-white">{t('marketing')}</p>
                <p className="text-brand-muted text-xs mt-1">{t('marketingDesc')}</p>
              </div>
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 h-4 w-4 accent-brand-accent" />
            </label>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {view === 'banner' ? (
            <>
              <button type="button" onClick={() => persist({ essential: true, analytics: true, marketing: true, timestamp: new Date().toISOString() })} className="px-4 py-2 rounded-lg bg-brand-accent text-brand-navy font-semibold text-sm hover:bg-brand-accent-hover transition">{t('acceptAll')}</button>
              <button type="button" onClick={() => persist({ ...DEFAULT_PREFERENCES, timestamp: new Date().toISOString() })} className="px-4 py-2 rounded-lg border border-brand-border text-slate-200 text-sm hover:border-brand-accent/50 transition">{t('rejectNonEssential')}</button>
              <button type="button" onClick={() => setView('customize')} className="px-4 py-2 rounded-lg text-brand-muted text-sm hover:text-white transition">{t('customize')}</button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => persist({ essential: true, analytics, marketing, timestamp: new Date().toISOString() })} className="px-4 py-2 rounded-lg bg-brand-accent text-brand-navy font-semibold text-sm hover:bg-brand-accent-hover transition">{t('save')}</button>
              <button type="button" onClick={() => setView('banner')} className="px-4 py-2 rounded-lg text-brand-muted text-sm hover:text-white transition">←</button>
            </>
          )}
        </div>
        <a
          href={`/${locale}/trust`}
          className="inline-block mt-3 text-xs text-brand-muted hover:text-brand-accent"
        >
          {t('policyLink')}
        </a>
      </div>
    </div>
  );
}
