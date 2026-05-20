import { DEFAULT_OG_IMAGE_PATH, LINKEDIN_URL, SITE_NAME, getSiteUrl } from './config';
import type { AppLocale } from './types';

export function buildOrganizationJsonLd(locale: AppLocale) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
        logo: `${siteUrl}${DEFAULT_OG_IMAGE_PATH}`,
        sameAs: [LINKEDIN_URL],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Dakar',
          addressRegion: locale === 'fr' ? 'Région de Dakar' : 'Dakar Region',
          addressCountry: 'SN',
        },
        areaServed: [
          { '@type': 'City', name: 'Dakar' },
          {
            '@type': 'Country',
            name: locale === 'fr' ? 'Sénégal' : 'Senegal',
          },
          {
            '@type': 'Place',
            name: locale === 'fr' ? "Afrique de l'Ouest" : 'West Africa',
          },
          {
            '@type': 'Place',
            name: locale === 'fr' ? 'Afrique' : 'Africa',
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: ['fr', 'en'],
      },
    ],
  };
}
