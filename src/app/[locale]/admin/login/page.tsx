'use client';

import { FormEvent, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const t = useTranslations('crm.admin');
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const password = new FormData(e.currentTarget).get('password');

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setLoading(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string; hint?: string } | null;
      const serverMessage = [body?.error, body?.hint].filter(Boolean).join(' — ');
      setError(
        serverMessage || (res.status === 401 ? t('invalidPassword') : t('loginUnavailable'))
      );
      return;
    }
    router.push(`/${locale}/admin`);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md glass-panel rounded-2xl p-8 border-brand-accent/20"
      >
        <h1 className="font-display text-2xl font-bold text-white mb-2">{t('login')}</h1>
        <p className="text-sm text-brand-muted mb-6">{t('title')}</p>
        <label className="block mb-4">
          <span className="text-xs text-brand-muted mb-1 block">{t('password')}</span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/50 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
          />
        </label>
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-brand-accent text-brand-navy font-semibold text-sm hover:bg-brand-accent-hover disabled:opacity-60"
        >
          {t('signIn')}
        </button>
      </form>
    </div>
  );
}
