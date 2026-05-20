import { buildOrganizationJsonLd } from '@/src/lib/seo/json-ld';
import type { AppLocale } from '@/src/lib/seo/types';

export default function JsonLd({ locale }: { locale: AppLocale }) {
  const data = buildOrganizationJsonLd(locale);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
