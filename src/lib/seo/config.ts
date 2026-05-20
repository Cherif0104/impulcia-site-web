/** Canonical site origin for metadata, sitemap and robots. */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (url) return url.replace(/\/$/, '');
  return 'http://localhost:4174';
}

export const SITE_NAME = 'IMPULCIA AFRIQUE';

export const DEFAULT_OG_IMAGE_PATH = '/images/brand/impulcia.png';

export const LINKEDIN_URL =
  'https://www.linkedin.com/company/impulcia-afrique/posts/?feedView=all';
