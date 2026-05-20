export { cookiesMetadata as generateMetadata } from '@/src/lib/seo/pages';

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return (
    <section className="py-24">
      <div className="section-container max-w-4xl">
        <h1 className="font-display text-4xl font-bold text-white mb-6">
          {isFr ? 'Politique cookies' : 'Cookie Policy'}
        </h1>
        <div className="space-y-6 text-brand-muted leading-relaxed text-sm sm:text-base">
          <p>
            {isFr
              ? 'Les cookies essentiels sont toujours actifs pour assurer le fonctionnement technique du site (session, sécurité).'
              : 'Essential cookies are always active to ensure technical operation of the website (session, security).'}
          </p>
          <p>
            {isFr
              ? 'Les cookies analytiques et marketing sont activés uniquement avec votre consentement explicite via la bannière de consentement.'
              : 'Analytics and marketing cookies are enabled only with your explicit consent through the consent banner.'}
          </p>
          <p>
            {isFr
              ? 'Vous pouvez modifier vos préférences à tout moment en supprimant vos cookies navigateur puis en revenant sur le site.'
              : 'You can update your preferences at any time by clearing browser cookies and revisiting the website.'}
          </p>
        </div>
      </div>
    </section>
  );
}
