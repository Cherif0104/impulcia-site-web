export { aboutMetadata as generateMetadata } from '@/src/lib/seo/pages';

import { Link } from '@/src/lib/routing';
import ArchitectWhatsAppCta from '@/src/components/forms/ArchitectWhatsAppCta';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const pillars = isFr
    ? [
        {
          title: 'Vision',
          description:
            "Accélérer la performance des organisations africaines grâce à des systèmes d'information fiables, sécurisés et pilotables.",
        },
        {
          title: 'Positionnement',
          description:
            'Cabinet d ingénierie digitale B2B, orienté résultats métiers, gouvernance des données et excellence opérationnelle.',
        },
        {
          title: 'Méthode',
          description:
            'Cadrage, architecture, delivery Agile, conduite du changement, transfert de compétences et accompagnement long terme.',
        },
      ]
    : [
        {
          title: 'Vision',
          description:
            'Accelerate African organizations through reliable, secure and measurable information systems.',
        },
        {
          title: 'Positioning',
          description:
            'A B2B digital engineering firm focused on business outcomes, data governance and operational excellence.',
        },
        {
          title: 'Method',
          description:
            'Scoping, architecture, Agile delivery, change enablement, capability transfer and long-term support.',
        },
      ];

  const stats = isFr
    ? [
        'Equipe pluridisciplinaire (IT, produit, data, cybersécurite)',
        'Interventions Afrique de l Ouest et projets internationaux',
        'Engagement qualite: securite, conformite et continuite de service',
      ]
    : [
        'Cross-functional team (IT, product, data, cybersecurity)',
        'West Africa footprint with international delivery capabilities',
        'Quality commitment: security, compliance and service continuity',
      ];

  const managementMarkers = isFr
    ? [
        {
          title: 'Cap sur les objectifs (SMART)',
          description: 'Chaque mission demarre avec des objectifs precis, mesurables et dates de revue.',
        },
        {
          title: 'Pilotage des risques (SWOT + plan action)',
          description: 'Nous clarifions forces, faiblesses et menaces avant l execution pour reduire les surprises.',
        },
        {
          title: 'Cadence d execution Agile',
          description: 'Roadmap en sprints, revues frequentes et arbitrages rapides avec vos equipes metier.',
        },
        {
          title: 'Gouvernance type Prince2 pragmatique',
          description: 'Decision makers identifies, jalons explicites, gestion du changement et responsabilites claires.',
        },
      ]
    : [
        {
          title: 'Outcome focus (SMART)',
          description: 'Every engagement starts with specific, measurable goals and review checkpoints.',
        },
        {
          title: 'Risk steering (SWOT + action plan)',
          description: 'We map strengths, weaknesses, and threats before execution to reduce uncertainty.',
        },
        {
          title: 'Agile execution rhythm',
          description: 'Sprint-based roadmaps, frequent reviews, and fast business-IT arbitration loops.',
        },
        {
          title: 'Pragmatic Prince2-style governance',
          description: 'Clear decision owners, explicit milestones, change control, and accountability.',
        },
      ];

  return (
    <div className="pt-24 pb-20 bg-[var(--page-bg)] text-[var(--text-main)]">
      <section className="section-container">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm dark:border-brand-border dark:bg-brand-panel/40">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            {isFr ? 'A propos' : 'About'}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl text-slate-900 dark:text-white">
            {isFr ? 'IMPULCIA AFRIQUE, partenaire systèmes d\'information des organisations ambitieuses' : 'IMPULCIA AFRIQUE, information systems partner for ambitious organizations'}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Nous aidons directions générales, DSI et équipes métiers à transformer leurs enjeux opérationnels en plateformes robustes, intégrées et orientées performance.'
              : 'We help executive teams, CIO offices and business units convert operational challenges into robust, integrated and performance-driven platforms.'}
          </p>
        </div>
      </section>

      <section className="section-container mt-10 grid gap-6 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <article key={pillar.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-brand-border dark:bg-brand-panel/30">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{pillar.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-brand-muted">{pillar.description}</p>
          </article>
        ))}
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-brand-border dark:bg-brand-panel/30">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {isFr ? 'Ce qui nous différencie' : 'What sets us apart'}
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {stats.map((item) => (
              <li key={item} className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm text-slate-700 dark:border-brand-border/70 dark:bg-brand-navy/40 dark:text-slate-200">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-brand-border dark:bg-brand-panel/30">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {isFr ? 'Comment nous pilotons vos programmes' : 'How we run your programs'}
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Nous utilisons des standards de management reconnus, traduits en actions simples pour vos equipes (direction, operationnel, IT).'
              : 'We use recognized management standards and translate them into practical routines for executives, operations and IT teams.'}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {managementMarkers.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-200 p-4 dark:border-brand-border/60">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-brand-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-brand-accent/30 bg-gradient-to-r from-cyan-50 to-blue-50 p-8 dark:from-brand-navy dark:to-brand-slate dark:bg-none">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {isFr ? 'Echangeons sur votre feuille de route systèmes d\'information' : 'Let us discuss your information systems roadmap'}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Nous cadrons avec vous les priorités, les risques et les quick wins pour lancer un programme maîtrisé.'
              : 'We align priorities, risks and quick wins with your teams to launch a controlled transformation program.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ArchitectWhatsAppCta locale={locale as 'fr' | 'en'} source="about-page-hero" />
            <Link href="/contact" locale={locale as 'fr' | 'en'} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-accent hover:text-brand-accent dark:border-brand-border dark:text-slate-100">
              {isFr ? 'Demander un diagnostic' : 'Request a diagnostic'}
            </Link>
            <Link href="/services" locale={locale as 'fr' | 'en'} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-accent hover:text-brand-accent dark:border-brand-border dark:text-slate-100">
              {isFr ? 'Voir nos offres de services' : 'View service offerings'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
