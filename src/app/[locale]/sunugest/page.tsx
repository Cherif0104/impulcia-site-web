export { sunugestMetadata as generateMetadata } from '@/src/lib/seo/pages';

import ProductSolutionPage from '@/src/components/enterprise/ProductSolutionPage';

export default async function SunuGestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ProductSolutionPage locale={locale} productId="sunugest" />;
}
