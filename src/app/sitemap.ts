import type { MetadataRoute } from 'next';
import { routing } from '@/src/lib/routing';
import { getSiteUrl } from '@/src/lib/seo/config';
import {
  getAbsoluteUrl,
  getTechCategoryAbsoluteUrl,
  isTechCategorySlug,
} from '@/src/lib/seo/paths';
import { SITEMAP_ENTRIES } from '@/src/lib/seo/registry';
import type { AppLocale } from '@/src/lib/seo/types';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const item of SITEMAP_ENTRIES) {
    for (const locale of routing.locales) {
      const appLocale = locale as AppLocale;
      if (item.kind === 'pathname') {
        entries.push({
          url: getAbsoluteUrl(item.pathname, appLocale),
          lastModified,
          changeFrequency: item.pathname === '/' ? 'weekly' : 'monthly',
          priority: item.priority ?? 0.7,
          alternates: {
            languages: Object.fromEntries(
              routing.locales.map((l) => [
                l,
                getAbsoluteUrl(item.pathname, l as AppLocale),
              ])
            ),
          },
        });
      } else if (item.kind === 'tech' && isTechCategorySlug(item.slug)) {
        const slug = item.slug;
        entries.push({
          url: getTechCategoryAbsoluteUrl(appLocale, slug),
          lastModified,
          changeFrequency: 'monthly',
          priority: item.priority ?? 0.7,
          alternates: {
            languages: Object.fromEntries(
              routing.locales.map((l) => [
                l,
                getTechCategoryAbsoluteUrl(l as AppLocale, slug),
              ])
            ),
          },
        });
      }
    }
  }

  return entries;
}
