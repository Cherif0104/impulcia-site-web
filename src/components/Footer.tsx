'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/src/lib/routing';

const productLinks = [
  { label: 'COYA ERP', href: '/coya' },
  { label: 'SenTrajet', href: '/sentrajet' },
  { label: 'Patrimo', href: '/patrimo' },
  { label: 'SunuGest', href: '/sunugest' },
  { label: 'Mbouraké', href: '/mbourake' },
];

const companyLinks = [
  { key: 'about', href: '/about' },
  { key: 'expertise', href: '/expertise' },
  { key: 'technologies', href: '/technologies' },
  { key: 'serviceOffers', href: '/services' },
  { key: 'partners', href: '/partnerships' },
  { key: 'contact', href: '/contact' },
] as const;

export default function Footer() {
  const t = useTranslations('common');
  const locale = useLocale() as 'fr' | 'en';

  return (
    <footer className="border-t border-brand-border/50 bg-white text-slate-900 dark:bg-brand-slate dark:text-slate-100">
      <div className="section-container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <p className="font-display text-xl font-bold text-slate-900 mb-2 dark:text-white">{t('site.name')}</p>
            <p className="text-brand-accent text-sm font-medium mb-3">{t('site.tagline')}</p>
            <p className="text-brand-muted text-sm leading-relaxed max-w-md mb-4">
              {t('footer.description')}
            </p>
            <p className="text-sm text-slate-400">{t('site.location')}</p>
            <p className="text-xs text-brand-muted mt-4 italic">{t('footer.madeIn')}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 dark:text-white">
              {t('footer.product')}
            </h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('/') ? (
                    <a href={`/${locale}${link.href}`} className="text-sm text-slate-600 hover:text-brand-accent transition dark:text-slate-300">
                      {link.label}
                    </a>
                  ) : (
                    <a href={link.href} className="text-sm text-slate-600 hover:text-brand-accent transition dark:text-slate-300">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 dark:text-white">
              {t('footer.company')}
            </h4>
            <ul className="space-y-2 mb-6">
              <li>
                <Link
                  href="/trust"
                  locale={locale}
                  className="text-sm text-brand-muted hover:text-brand-accent transition"
                >
                  {locale === 'fr' ? 'Confiance & Sécurité' : 'Trust & Security'}
                </Link>
              </li>
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} locale={locale} className="text-sm text-slate-600 hover:text-brand-accent transition dark:text-slate-300">
                    {t(`nav.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 dark:text-white">Contact</h4>
            <ul className="space-y-2 text-sm text-brand-muted">
              <li>
                <a href="mailto:contact@impulcia.com" className="hover:text-brand-accent">
                  contact@impulcia.com
                </a>
              </li>
              <li>Dakar, Sénégal</li>
              <li>
                <a
                  href="https://www.linkedin.com/company/impulcia-afrique/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-accent"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/221788324069"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-accent"
                >
                  WhatsApp Business
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-brand-muted">{t('footer.copyright')}</p>
          <div className="flex flex-wrap gap-6 text-sm text-brand-muted">
            <Link href="/legal" locale={locale} className="hover:text-brand-accent transition">
              {t('footer.legal')}
            </Link>
            <Link href="/privacy" locale={locale} className="hover:text-brand-accent transition">
              {t('footer.privacy')}
            </Link>
            <Link href="/trust" locale={locale} className="hover:text-brand-accent transition">
              Trust & Security
            </Link>
            <Link href="/cookies" locale={locale} className="hover:text-brand-accent transition">
              {t('footer.docs')}
            </Link>
            <Link href="/contact" locale={locale} className="hover:text-brand-accent transition">
              {t('footer.support')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
