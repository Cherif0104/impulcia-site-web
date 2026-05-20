export { careersMetadata as generateMetadata } from '@/src/lib/seo/pages';

import { listJobOffers } from '@/src/lib/db';

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const offers = await listJobOffers({ publishedOnly: true });

  return (
    <div className="pt-24 pb-20 bg-[var(--page-bg)] text-[var(--text-main)]">
      <section className="section-container">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm dark:border-brand-border dark:bg-brand-panel/40">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            {isFr ? 'Carrieres' : 'Careers'}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl text-slate-900 dark:text-white">
            {isFr ? 'Rejoignez IMPULCIA AFRIQUE' : 'Join IMPULCIA AFRIQUE'}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Consultez les offres ouvertes pour renforcer nos equipes d ingenierie et delivery.'
              : 'Explore open roles across our engineering and delivery teams.'}
          </p>
        </div>
      </section>

      <section className="section-container mt-10">
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map((offer) => (
            <article key={offer.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-brand-border dark:bg-brand-panel/30">
              <p className="text-xs uppercase tracking-wider text-brand-accent">
                {offer.employment_type.replace('_', ' ')}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{offer.title}</h2>
              <p className="mt-1 text-sm text-brand-muted">
                {(offer.team || (isFr ? 'Equipe multi-projets' : 'Multi-project team')) +
                  ' - ' +
                  (offer.location || (isFr ? 'Dakar / Remote' : 'Dakar / Remote'))}
              </p>
              <p className="mt-4 text-sm text-slate-600 dark:text-brand-muted whitespace-pre-wrap">{offer.description}</p>
              <a
                href={`mailto:contact@impulcia.com?subject=${encodeURIComponent(`Application - ${offer.title}`)}`}
                className="inline-flex mt-4 rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-navy"
              >
                {isFr ? 'Postuler' : 'Apply'}
              </a>
            </article>
          ))}
        </div>
        {offers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-border p-8 text-sm text-brand-muted">
            {isFr
              ? 'Aucune offre publiee actuellement. Revenez bientot.'
              : 'No published offer at the moment. Check back soon.'}
          </div>
        ) : null}
      </section>
    </div>
  );
}
