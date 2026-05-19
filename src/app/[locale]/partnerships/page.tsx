import { Link } from '@/src/lib/routing';
import ContactLeadForm from '@/src/components/forms/ContactLeadForm';

export default async function PartnershipsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const models = isFr
    ? [
        {
          title: 'Partenariat technologique',
          description: 'Co-construction de plateformes, gouvernance technique partagée et feuille de route produit.',
        },
        {
          title: 'Partenariat delivery',
          description: 'Renfort d équipes, pilotage lots projets et engagements de qualité sur résultats.',
        },
        {
          title: 'Partenariat institutionnel',
          description: 'Appui à la digitalisation des programmes publics, ONG et bailleurs avec cadre de conformité.',
        },
      ]
    : [
        {
          title: 'Technology partnership',
          description: 'Joint platform design, shared technical governance and product roadmap ownership.',
        },
        {
          title: 'Delivery partnership',
          description: 'Team augmentation, workstream leadership and quality commitments tied to outcomes.',
        },
        {
          title: 'Institutional partnership',
          description: 'Support for digital public programs, NGOs and donor initiatives under compliance constraints.',
        },
      ];

  const workflow = isFr
    ? [
        'Qualification du besoin (formulaire + scoring commercial)',
        'Validation business/technique et mode operatoire',
        'Proposition de collaboration avec jalons et KPI',
        'Activation WhatsApp + suivi CRM pour rappel commercial',
      ]
    : [
        'Need qualification (form + business scoring)',
        'Business/technical validation and operating model',
        'Partnership proposal with milestones and KPIs',
        'WhatsApp activation + CRM follow-up for sales call back',
      ];

  return (
    <div className="pt-24 pb-20 bg-[var(--page-bg)] text-[var(--text-main)]">
      <section className="section-container">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm dark:border-brand-border dark:bg-brand-panel/40">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            {isFr ? 'Partenaires' : 'Partners'}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl text-slate-900 dark:text-white">
            {isFr ? 'Construire des alliances durables autour de la transformation digitale' : 'Building durable alliances for digital transformation'}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Nous collaborons avec entreprises, institutions et intégrateurs pour livrer des impacts mesurables, sécurisés et alignés sur les objectifs métier.'
              : 'We collaborate with enterprises, institutions and integrators to deliver measurable, secure and business-aligned outcomes.'}
          </p>
        </div>
      </section>

      <section className="section-container mt-10 grid gap-6 md:grid-cols-3">
        {models.map((model) => (
          <article key={model.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-brand-border dark:bg-brand-panel/30">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{model.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-brand-muted">{model.description}</p>
          </article>
        ))}
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-brand-border dark:bg-brand-panel/30">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {isFr ? 'Processus de collaboration' : 'Collaboration process'}
          </h2>
          <ol className="mt-6 grid gap-3 md:grid-cols-4">
            {workflow.map((step, index) => (
              <li key={step} className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-slate-700 dark:border-brand-border/70 dark:bg-brand-navy/40 dark:text-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">Step {index + 1}</p>
                <p className="mt-2">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-brand-accent/30 bg-gradient-to-r from-cyan-50 to-blue-50 p-8 dark:from-brand-navy dark:to-brand-slate dark:bg-none">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {isFr ? 'Proposer une collaboration' : 'Discuss a partnership'}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Partagez vos priorités, nous revenons avec une proposition de collaboration structurée et des jalons concrets.'
              : 'Share your priorities and we will come back with a structured partnership proposal and concrete milestones.'}
          </p>
          <p className="mt-4 text-xs text-slate-500 dark:text-brand-muted">
            {isFr
              ? 'Le formulaire ci-dessous enregistre automatiquement votre demande dans le CRM, prepare un message WhatsApp structure et declenche une piste de rappel.'
              : 'The form below automatically records your request in CRM, prepares a structured WhatsApp message and creates a callback lead.'}
          </p>
        </div>
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-brand-accent/20 bg-white p-6 md:p-8 dark:border-brand-border dark:bg-brand-panel/20">
          <ContactLeadForm mode="partner" source="partnership-page-form" />
        </div>
      </section>

      <section className="section-container mt-10">
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" locale={locale as 'fr' | 'en'} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-accent hover:text-brand-accent dark:border-brand-border dark:text-slate-100">
            {isFr ? 'Parler a un expert' : 'Talk to an expert'}
          </Link>
          <Link href="/realisations" locale={locale as 'fr' | 'en'} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-accent hover:text-brand-accent dark:border-brand-border dark:text-slate-100">
            {isFr ? 'Voir nos realisations' : 'View case studies'}
          </Link>
        </div>
      </section>
    </div>
  );
}
