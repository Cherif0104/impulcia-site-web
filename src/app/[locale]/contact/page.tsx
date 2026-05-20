export { contactMetadata as generateMetadata } from '@/src/lib/seo/pages';

import ContactLeadForm from '@/src/components/forms/ContactLeadForm';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return (
    <div className="pt-24 pb-20 bg-[var(--page-bg)] text-[var(--text-main)]">
      <section className="section-container">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm dark:border-brand-border dark:bg-brand-panel/40">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            {isFr ? 'Contact' : 'Contact'}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl text-slate-900 dark:text-white">
            {isFr ? 'Parlons de vos enjeux systèmes d\'information' : 'Let us discuss your information systems priorities'}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Formulaire unique: qualification rapide, stockage CRM et preparation d un relais WhatsApp pour une prise en charge commerciale/technique acceleree.'
              : 'Single form flow: quick qualification, CRM storage and WhatsApp handoff preparation for faster business and technical follow-up.'}
          </p>
        </div>
      </section>

      <section className="section-container mt-10">
        <div className="grid gap-6 md:grid-cols-3">
          {(isFr
            ? [
                { title: 'Qualification express', text: 'Mini-questionnaire projet, budget, delai, priorites.' },
                { title: 'CRM et suivi', text: 'Chaque soumission cree une entree exploitable cote backoffice.' },
                { title: 'Relance operationnelle', text: 'Lien WhatsApp structure + piste de rappel commercial.' },
              ]
            : [
                { title: 'Rapid qualification', text: 'Mini questionnaire on project, budget, timeline and priorities.' },
                { title: 'CRM tracking', text: 'Each submission creates an actionable backoffice entry.' },
                { title: 'Operational follow-up', text: 'Structured WhatsApp link + callback sales cue.' },
              ]
          ).map((card) => (
            <article key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-brand-border dark:bg-brand-panel/30">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">{card.title}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-brand-muted">{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-brand-accent/20 bg-white p-6 md:p-8 dark:border-brand-border dark:bg-brand-panel/20">
          <ContactLeadForm />
        </div>
      </section>
    </div>
  );
}
