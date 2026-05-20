export { legalMetadata as generateMetadata } from '@/src/lib/seo/pages';

export default async function LegalPage({
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
          {isFr ? 'Mentions légales' : 'Legal Notice'}
        </h1>
        <div className="space-y-6 text-brand-muted leading-relaxed text-sm sm:text-base">
          <p>
            <strong className="text-white">IMPULCIA AFRIQUE</strong> — Dakar, Sénégal
          </p>
          <p>
            {isFr
              ? "Le site presente les offres de conception, creation et developpement de systemes d'information sur mesure de l'entreprise."
              : 'This website presents the company offerings for custom information systems design, build and deployment.'}
          </p>
          <p>
            {isFr
              ? 'Contact publication : contact@impulcia.com — WhatsApp Business : +221 78 832 40 69'
              : 'Publication contact: contact@impulcia.com — WhatsApp Business: +221 78 832 40 69'}
          </p>
          <p>
            <a href={`/${locale}/trust`} className="text-brand-accent underline underline-offset-4">
              {isFr ? 'Cadre Confiance & Sécurité' : 'Trust & Security framework'}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
