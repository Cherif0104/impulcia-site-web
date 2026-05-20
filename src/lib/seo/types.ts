import type { routing } from '@/src/lib/routing';

export type AppLocale = (typeof routing.locales)[number];

/** Keys in public/locales/{locale}/seo.json under pages.* */
export type SeoPageKey =
  | 'home'
  | 'about'
  | 'expertise'
  | 'technologies'
  | 'techFrontend'
  | 'techBackend'
  | 'techDataCloudSecurity'
  | 'services'
  | 'partnerships'
  | 'contact'
  | 'coya'
  | 'sentrajet'
  | 'patrimo'
  | 'sunugest'
  | 'mbourake'
  | 'forEnterprises'
  | 'forInstitutions'
  | 'forDonors'
  | 'realisations'
  | 'auditSi'
  | 'cadrageProjet'
  | 'architecteSi'
  | 'trust'
  | 'trustCenter'
  | 'careers'
  | 'privacy'
  | 'cookies'
  | 'legal'
  | 'landing'
  | 'clientLogin'
  | 'clientSpace';

/** Internal pathname keys used by next-intl routing.pathnames */
export type PathnameKey = keyof typeof routing.pathnames;

export type SitemapEntry =
  | { kind: 'pathname'; pathname: PathnameKey; priority?: number }
  | { kind: 'tech'; slug: string; seoPage: SeoPageKey; priority?: number };
