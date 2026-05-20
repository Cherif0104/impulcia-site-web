'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ClientLoginPage() {
  const locale = useLocale();
  const isFr = locale === 'fr';
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const mode = searchParams.get('mode') === 'reset' ? 'reset' : 'activate';
  const hasToken = token.length > 0;
  const redirectTo = useMemo(() => `/${locale}/client-space`, [locale]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loginAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');

    const response = await fetch('/api/client/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(
        body?.error ||
          (isFr ? 'Connexion refusée. Vérifiez vos identifiants.' : 'Login denied. Check your credentials.')
      );
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  async function passwordAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') || '');
    const confirmPassword = String(form.get('confirmPassword') || '');
    if (password.length < 8) {
      setLoading(false);
      setError(isFr ? 'Mot de passe trop court (8 caractères minimum).' : 'Password is too short (min 8 chars).');
      return;
    }
    if (password !== confirmPassword) {
      setLoading(false);
      setError(isFr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }

    const response = await fetch('/api/client/auth/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error || (isFr ? 'Lien invalide ou expiré.' : 'Invalid or expired link.'));
      return;
    }
    setSuccess(
      isFr
        ? 'Mot de passe enregistré. Vous pouvez maintenant vous connecter.'
        : 'Password saved. You can now sign in.'
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-panel rounded-2xl p-8 border-brand-accent/20">
        <h1 className="font-display text-2xl font-bold text-white mb-2">
          {isFr ? 'Portail client IMPULCIA' : 'IMPULCIA client portal'}
        </h1>
        <p className="text-sm text-brand-muted mb-6">
          {isFr
            ? 'Accès réservé aux comptes clients créés par les administrateurs.'
            : 'Access is restricted to client accounts provisioned by administrators.'}
        </p>

        {hasToken ? (
          <form onSubmit={passwordAction} className="space-y-4">
            <p className="text-xs text-brand-accent">
              {mode === 'reset'
                ? isFr
                  ? 'Réinitialisation du mot de passe'
                  : 'Password reset'
                : isFr
                ? 'Activation du compte'
                : 'Account activation'}
            </p>
            <label className="block">
              <span className="text-xs text-brand-muted mb-1 block">{isFr ? 'Nouveau mot de passe' : 'New password'}</span>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/50 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs text-brand-muted mb-1 block">
                {isFr ? 'Confirmer le mot de passe' : 'Confirm password'}
              </span>
              <input
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/50 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-brand-accent text-brand-navy font-semibold text-sm hover:bg-brand-accent-hover disabled:opacity-60"
            >
              {isFr ? 'Enregistrer le mot de passe' : 'Save password'}
            </button>
          </form>
        ) : (
          <form onSubmit={loginAction} className="space-y-4">
            <label className="block">
              <span className="text-xs text-brand-muted mb-1 block">{isFr ? 'Email client' : 'Client email'}</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/50 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs text-brand-muted mb-1 block">{isFr ? 'Mot de passe' : 'Password'}</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-brand-border/60 bg-brand-panel/50 px-4 py-2.5 text-sm text-white focus:border-brand-accent focus:outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-brand-accent text-brand-navy font-semibold text-sm hover:bg-brand-accent-hover disabled:opacity-60"
            >
              {isFr ? 'Se connecter' : 'Sign in'}
            </button>
          </form>
        )}

        {error ? <p className="text-sm text-red-400 mt-4">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-400 mt-4">{success}</p> : null}
      </div>
    </div>
  );
}
