'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/src/lib/routing';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

const navPages = [
  { key: 'about', href: '/about' },
  { key: 'expertise', href: '/expertise' },
  { key: 'technologies', href: '/technologies' },
  { key: 'serviceOffers', href: '/services' },
  { key: 'partners', href: '/partnerships' },
  { key: 'contact', href: '/contact' },
] as const;

export default function Header() {
  const t = useTranslations('common');
  const locale = useLocale() as 'fr' | 'en';
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-brand-border/50 bg-white/90 backdrop-blur-xl dark:bg-brand-navy/85">
      <div className="section-container flex items-center justify-between h-16 lg:h-[4.5rem]">
        <Link href="/" className="flex flex-col leading-tight group">
          <span className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-accent transition dark:text-white">
            {t('site.name')}
          </span>
          <span className="text-[10px] text-slate-500 tracking-wider uppercase hidden sm:block dark:text-brand-muted">
            {t('site.tagline')}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {navPages.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              locale={locale}
              className="text-sm text-slate-700 hover:text-brand-accent transition dark:text-slate-300"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          className="lg:hidden p-2 text-slate-900 dark:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-brand-border/40 bg-white px-4 py-4 space-y-3 dark:bg-brand-slate/95">
          {navPages.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              locale={locale}
              className="block text-slate-700 hover:text-brand-accent py-2 dark:text-slate-300"
              onClick={() => setOpen(false)}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
