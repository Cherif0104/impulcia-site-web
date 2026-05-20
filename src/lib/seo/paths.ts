import { routing } from '@/src/lib/routing';
import { getSiteUrl } from './config';
import type { AppLocale, PathnameKey } from './types';

const TECH_CATEGORY_SLUGS = ['frontend', 'backend', 'data-cloud-security'] as const;

export type TechCategorySlug = (typeof TECH_CATEGORY_SLUGS)[number];

export function isTechCategorySlug(slug: string): slug is TechCategorySlug {
  return (TECH_CATEGORY_SLUGS as readonly string[]).includes(slug);
}

/** Localized path segment(s) without locale prefix, always leading with `/`. */
export function getLocalizedPath(pathname: PathnameKey, locale: AppLocale): string {
  if (pathname === '/') return '';
  const entry = routing.pathnames[pathname];
  if (typeof entry === 'string') return entry;
  const segment = entry[locale];
  return segment;
}

export function getLocalePath(pathname: PathnameKey, locale: AppLocale): string {
  const segment = getLocalizedPath(pathname, locale);
  return `/${locale}${segment}`;
}

export function getAbsoluteUrl(pathname: PathnameKey, locale: AppLocale): string {
  return `${getSiteUrl()}${getLocalePath(pathname, locale)}`;
}

export function getTechCategoryPath(locale: AppLocale, slug: TechCategorySlug): string {
  const base = getLocalizedPath('/technologies', locale);
  return `/${locale}${base}/${slug}`;
}

export function getTechCategoryAbsoluteUrl(locale: AppLocale, slug: TechCategorySlug): string {
  return `${getSiteUrl()}${getTechCategoryPath(locale, slug)}`;
}

/** hreflang map for a pathname-based page */
export function getPathnameLanguageAlternates(pathname: PathnameKey): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of routing.locales) {
    alternates[locale] = getAbsoluteUrl(pathname, locale);
  }
  return alternates;
}

export function getTechCategoryLanguageAlternates(
  slug: TechCategorySlug
): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of routing.locales) {
    alternates[locale] = getTechCategoryAbsoluteUrl(locale, slug);
  }
  return alternates;
}

export { TECH_CATEGORY_SLUGS };
