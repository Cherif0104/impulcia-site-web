export { patrimoMetadata as generateMetadata } from '@/src/lib/seo/pages';

import ProductSolutionPage from '@/src/components/enterprise/ProductSolutionPage';

export default async function PatrimoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ProductSolutionPage locale={locale} productId="patrimo" />;
}
