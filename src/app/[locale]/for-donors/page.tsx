import AbmLandingPage from '@/src/components/enterprise/AbmLandingPage';

export default async function ForDonorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <AbmLandingPage locale={locale} variant="donor" />;
}
