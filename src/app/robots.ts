import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/src/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/*/admin',
          '/*/admin/',
          '/*/portail-client/',
          '/*/client/',
          '/*/espace-client',
          '/*/client-space',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
