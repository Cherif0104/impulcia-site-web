import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, getSiteUrl } from './config';
import {
  getAbsoluteUrl,
  getPathnameLanguageAlternates,
  getTechCategoryAbsoluteUrl,
  getTechCategoryLanguageAlternates,
  getTechCategoryPath,
  getLocalePath,
  type TechCategorySlug,
} from './paths';
import { SEO_PAGE_PATHNAME } from './registry';
import type { AppLocale, PathnameKey, SeoPageKey } from './types';

export type CreatePageMetadataOptions = {
  locale: string;
  page: SeoPageKey;
  /** Override canonical path (absolute URL without using pathname map) */
  canonicalPath?: string;
  languageAlternates?: Record<string, string>;
  robots?: Metadata['robots'];
};

function normalizeLocale(locale: string): AppLocale {
  return locale === 'en' ? 'en' : 'fr';
}

function formatTitle(pageTitle: string, siteName: string): string {
  return `${pageTitle} | ${siteName}`;
}

export function getMetadataBase(): URL {
  return new URL(getSiteUrl());
}

export async function createPageMetadata(
  options: CreatePageMetadataOptions
): Promise<Metadata> {
  const locale = normalizeLocale(options.locale);
  const t = await getTranslations({ locale, namespace: 'seo' });
  const siteName = t('site.name');

  const pageTitle = t(`pages.${options.page}.title`);
  const pageDescription = t(`pages.${options.page}.description`);
  const title = formatTitle(pageTitle, siteName);

  const pathname = SEO_PAGE_PATHNAME[options.page];
  let canonical: string;
  let languages: Record<string, string>;

  if (options.canonicalPath && options.languageAlternates) {
    canonical = options.canonicalPath.startsWith('http')
      ? options.canonicalPath
      : `${getSiteUrl()}${options.canonicalPath}`;
    languages = options.languageAlternates;
  } else if (pathname) {
    canonical = getAbsoluteUrl(pathname, locale);
    languages = getPathnameLanguageAlternates(pathname);
  } else {
    canonical = `${getSiteUrl()}${getLocalePath('/', locale)}`;
    languages = getPathnameLanguageAlternates('/');
  }

  const ogLocale = locale === 'fr' ? 'fr_FR' : 'en_US';
  const ogAlternateLocale = locale === 'fr' ? 'en_US' : 'fr_FR';

  return {
    title,
    description: pageDescription,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description: pageDescription,
      url: canonical,
      locale: ogLocale,
      alternateLocale: [ogAlternateLocale],
      images: [
        {
          url: DEFAULT_OG_IMAGE_PATH,
          width: 512,
          height: 512,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: pageDescription,
      images: [DEFAULT_OG_IMAGE_PATH],
    },
    ...(options.robots ? { robots: options.robots } : {}),
  };
}

export async function createTechCategoryMetadata(
  locale: string,
  slug: TechCategorySlug,
  page: SeoPageKey
): Promise<Metadata> {
  const normalized = normalizeLocale(locale);
  const canonicalPath = getTechCategoryPath(normalized, slug);
  return createPageMetadata({
    locale: normalized,
    page,
    canonicalPath,
    languageAlternates: getTechCategoryLanguageAlternates(slug),
  });
}

export async function createSiteDefaultsMetadata(locale: string): Promise<Metadata> {
  const normalized = normalizeLocale(locale);
  const t = await getTranslations({ locale: normalized, namespace: 'seo' });

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: t('site.defaultTitle'),
      template: t('site.titleTemplate'),
    },
    description: t('site.defaultDescription'),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: normalized === 'fr' ? 'fr_FR' : 'en_US',
      images: [{ url: DEFAULT_OG_IMAGE_PATH, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export async function createNoindexMetadata(locale: string, page: SeoPageKey): Promise<Metadata> {
  return createPageMetadata({
    locale,
    page,
    robots: { index: false, follow: false },
  });
}

export function createAdminNoindexMetadata(): Metadata {
  return {
    robots: { index: false, follow: false },
  };
}

export function resolvePathnameFromPage(page: SeoPageKey): PathnameKey | undefined {
  return SEO_PAGE_PATHNAME[page];
}
