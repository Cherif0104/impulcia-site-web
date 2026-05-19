import ProductSolutionPage from '@/src/components/enterprise/ProductSolutionPage';

export default async function SenTrajetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ProductSolutionPage locale={locale} productId="sentrajet" />;
}
