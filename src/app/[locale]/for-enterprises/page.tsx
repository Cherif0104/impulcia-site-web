export { forEnterprisesMetadata as generateMetadata } from '@/src/lib/seo/pages';

import AbmLandingPage from '@/src/components/enterprise/AbmLandingPage';

export default async function ForEnterprisesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <AbmLandingPage locale={locale} variant="enterprise" />;
}
