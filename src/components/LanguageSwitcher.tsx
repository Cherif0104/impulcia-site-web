'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/src/lib/routing';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: 'fr' | 'en') => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  const btnClass = (active: boolean) =>
    `px-2.5 py-1 rounded-md text-xs font-semibold transition ${
      active
        ? 'bg-brand-accent text-brand-navy'
        : 'text-slate-600 hover:text-slate-900 border border-brand-border dark:text-brand-muted dark:hover:text-white'
    } ${isPending ? 'opacity-50' : ''}`;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => switchLocale('fr')}
        className={btnClass(locale === 'fr')}
        disabled={isPending}
      >
        FR
      </button>
      <button
        type="button"
        onClick={() => switchLocale('en')}
        className={btnClass(locale === 'en')}
        disabled={isPending}
      >
        EN
      </button>
    </div>
  );
}
