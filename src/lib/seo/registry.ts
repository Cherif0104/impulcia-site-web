import type { PathnameKey, SeoPageKey, SitemapEntry } from './types';

/** Maps SEO page keys to next-intl pathname keys (when applicable). */
export const SEO_PAGE_PATHNAME: Partial<Record<SeoPageKey, PathnameKey>> = {
  home: '/',
  about: '/about',
  expertise: '/expertise',
  technologies: '/technologies',
  services: '/services',
  partnerships: '/partnerships',
  contact: '/contact',
  coya: '/coya',
  sentrajet: '/sentrajet',
  patrimo: '/patrimo',
  sunugest: '/sunugest',
  mbourake: '/mbourake',
  forEnterprises: '/for-enterprises',
  forInstitutions: '/for-institutions',
  forDonors: '/for-donors',
  realisations: '/realisations',
  auditSi: '/audit-si',
  cadrageProjet: '/cadrage-projet',
  architecteSi: '/architecte-si',
  trust: '/trust',
  trustCenter: '/trust-center',
  careers: '/careers',
  privacy: '/privacy',
  cookies: '/cookies',
  legal: '/legal',
  landing: '/landing',
  clientLogin: '/client/login',
  clientSpace: '/client-space',
};

const TECH_SEO_BY_SLUG: Record<string, SeoPageKey> = {
  frontend: 'techFrontend',
  backend: 'techBackend',
  'data-cloud-security': 'techDataCloudSecurity',
};

/** Public URLs included in sitemap.xml */
export const SITEMAP_ENTRIES: SitemapEntry[] = [
  { kind: 'pathname', pathname: '/', priority: 1 },
  { kind: 'pathname', pathname: '/about', priority: 0.8 },
  { kind: 'pathname', pathname: '/expertise', priority: 0.8 },
  { kind: 'pathname', pathname: '/technologies', priority: 0.8 },
  { kind: 'tech', slug: 'frontend', seoPage: 'techFrontend', priority: 0.7 },
  { kind: 'tech', slug: 'backend', seoPage: 'techBackend', priority: 0.7 },
  { kind: 'tech', slug: 'data-cloud-security', seoPage: 'techDataCloudSecurity', priority: 0.7 },
  { kind: 'pathname', pathname: '/services', priority: 0.8 },
  { kind: 'pathname', pathname: '/partnerships', priority: 0.7 },
  { kind: 'pathname', pathname: '/contact', priority: 0.8 },
  { kind: 'pathname', pathname: '/coya', priority: 0.85 },
  { kind: 'pathname', pathname: '/sentrajet', priority: 0.8 },
  { kind: 'pathname', pathname: '/patrimo', priority: 0.8 },
  { kind: 'pathname', pathname: '/sunugest', priority: 0.8 },
  { kind: 'pathname', pathname: '/mbourake', priority: 0.8 },
  { kind: 'pathname', pathname: '/for-enterprises', priority: 0.75 },
  { kind: 'pathname', pathname: '/for-institutions', priority: 0.75 },
  { kind: 'pathname', pathname: '/for-donors', priority: 0.75 },
  { kind: 'pathname', pathname: '/realisations', priority: 0.8 },
  { kind: 'pathname', pathname: '/audit-si', priority: 0.8 },
  { kind: 'pathname', pathname: '/cadrage-projet', priority: 0.8 },
  { kind: 'pathname', pathname: '/architecte-si', priority: 0.8 },
  { kind: 'pathname', pathname: '/trust', priority: 0.7 },
  { kind: 'pathname', pathname: '/trust-center', priority: 0.7 },
  { kind: 'pathname', pathname: '/careers', priority: 0.6 },
  { kind: 'pathname', pathname: '/privacy', priority: 0.3 },
  { kind: 'pathname', pathname: '/cookies', priority: 0.3 },
  { kind: 'pathname', pathname: '/legal', priority: 0.3 },
];

export function getTechSeoPageKey(slug: string): SeoPageKey | null {
  return TECH_SEO_BY_SLUG[slug] ?? null;
}
