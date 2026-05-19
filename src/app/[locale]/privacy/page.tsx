export default async function PrivacyPage({
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
          {isFr ? 'Politique de confidentialité' : 'Privacy Policy'}
        </h1>
        <div className="space-y-6 text-brand-muted leading-relaxed text-sm sm:text-base">
          <p>
            {isFr
              ? 'IMPULCIA AFRIQUE collecte uniquement les données nécessaires au traitement de vos demandes commerciales (formulaire, e-mail, interactions CRM).'
              : 'IMPULCIA AFRIQUE only collects data needed to process your commercial requests (form, email, CRM interactions).'}
          </p>
          <p>
            {isFr
              ? 'Les données sont utilisées pour vous recontacter, qualifier votre besoin et suivre la relation client. Elles ne sont ni revendues ni partagées hors sous-traitants techniques autorisés.'
              : 'Data is used to contact you back, qualify your needs and manage customer follow-up. It is not sold and is not shared outside authorized technical processors.'}
          </p>
          <p>
            {isFr
              ? 'Vous pouvez demander l’accès, la rectification ou la suppression de vos données à tout moment via contact@impulcia.com.'
              : 'You can request access, correction or deletion of your data at any time via contact@impulcia.com.'}
          </p>
          <p>
            <a href={`/${locale}/trust`} className="text-brand-accent underline underline-offset-4">
              {isFr ? 'Voir notre page Confiance & Sécurité' : 'View our Trust & Security page'}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
