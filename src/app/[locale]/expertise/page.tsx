export { expertiseMetadata as generateMetadata } from '@/src/lib/seo/pages';

import { Link } from '@/src/lib/routing';
import ContactLeadForm from '@/src/components/forms/ContactLeadForm';
import ArchitectWhatsAppCta from '@/src/components/forms/ArchitectWhatsAppCta';

type ExpertiseDomain = {
  title: string;
  description: string;
  capabilities: string[];
  useCases: string[];
};

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const domains: ExpertiseDomain[] = isFr
    ? [
        {
          title: 'Architecture systèmes d\'information & urbanisation',
          description:
            'Cadrage d architectures cibles, rationalisation applicative et alignement des priorites business/IT.',
          capabilities: ['Audit du patrimoine applicatif', 'Schemas d integration API-first', 'Roadmap de modernisation progressive'],
          useCases: ['Refonte systèmes d\'information multi-entites', 'Urbanisation ERP + CRM', 'Plan de convergence filiales'],
        },
        {
          title: 'Delivery de plateformes metier',
          description:
            'Conception et livraison de solutions critiques (ERP, CRM, portails) avec gouvernance produit et qualite continue.',
          capabilities: ['Product discovery et specification', 'Developpement full-stack securise', 'Pilotage des releases et adoption utilisateur'],
          useCases: ['Marketplace B2B/B2C', 'SIRH et workflows RH', 'Applications terrain mobiles / PWA'],
        },
        {
          title: 'Data, IA et pilotage de performance',
          description:
            'Structuration des donnees et mise en place d indicateurs executives pour accelerer la prise de decision.',
          capabilities: ['Data pipelines et tableaux de bord KPI', 'Automatisation des workflows', 'Cas d usage IA metier pragmatiques'],
          useCases: ['Cockpit direction generale', 'Scoring et priorisation leads', 'Automatisation du reporting multi-sites'],
        },
      ]
    : [
        {
          title: 'Information systems architecture & enterprise design',
          description:
            'Target architecture design, application landscape rationalization, and alignment between business and IT priorities.',
          capabilities: ['Application portfolio assessment', 'API-first integration blueprints', 'Progressive modernization roadmap'],
          useCases: ['Multi-entity information systems redesign', 'ERP and CRM urbanization', 'Subsidiary convergence plans'],
        },
        {
          title: 'Business platform delivery',
          description:
            'Design and delivery of mission-critical platforms (ERP, CRM, portals) with product governance and quality discipline.',
          capabilities: ['Product discovery and specifications', 'Secure full-stack engineering', 'Release orchestration and user adoption'],
          useCases: ['B2B/B2C marketplace', 'HRIS and HR workflows', 'Field mobile apps / PWA'],
        },
        {
          title: 'Data, AI and performance steering',
          description:
            'Data foundations and executive-level measurement frameworks to improve operational and strategic decisions.',
          capabilities: ['Data pipelines and KPI dashboards', 'Workflow automation', 'Pragmatic business AI use cases'],
          useCases: ['Executive cockpit', 'Lead scoring and qualification', 'Multi-site reporting automation'],
        },
      ];

  const outcomes = isFr
    ? [
        'Visibilite claire sur les priorites systèmes d\'information a 12-24 mois',
        'Reduction du risque projet grace a un cadrage robuste',
        'Acceleration du time-to-value sur les initiatives digitales',
        'Montee en maturite des equipes metier et IT',
      ]
    : [
        'Clear information systems priorities for the next 12-24 months',
        'Lower delivery risk through robust scoping',
        'Faster time-to-value across digital initiatives',
        'Stronger business and IT team maturity',
      ];

  const operatingModel = isFr
    ? [
        {
          stage: 'Discovery',
          detail: 'Ateliers de cadrage, SWOT, objectifs SMART et priorisation du backlog.',
        },
        {
          stage: 'Blueprint',
          detail: 'Architecture cible, plan de gouvernance, lotissement Build/Run/Scale/Care.',
        },
        {
          stage: 'Execution',
          detail: 'Sprints Scrum, comites de pilotage, indicateurs qualite/securite.',
        },
        {
          stage: 'Adoption',
          detail: 'Formation utilisateurs, conduite du changement et transfert de competences.',
        },
      ]
    : [
        {
          stage: 'Discovery',
          detail: 'Scoping workshops, SWOT, SMART goals and backlog prioritization.',
        },
        {
          stage: 'Blueprint',
          detail: 'Target architecture, governance plan, Build/Run/Scale/Care workstreams.',
        },
        {
          stage: 'Execution',
          detail: 'Scrum sprints, steering committees, quality and security indicators.',
        },
        {
          stage: 'Adoption',
          detail: 'User training, change enablement and capability transfer.',
        },
      ];

  return (
    <div className="pt-24 pb-20 bg-[var(--page-bg)] text-[var(--text-main)]">
      <section className="section-container">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm dark:border-brand-border dark:bg-brand-panel/40">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            {isFr ? 'Competences' : 'Expertise'}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl text-slate-900 dark:text-white">
            {isFr ? 'Des expertises combinees pour des transformations reussies' : 'Combined expertise for successful transformations'}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Nos equipes croisent strategie systèmes d\'information, execution produit et excellence operationnelle pour transformer vos objectifs en resultats mesurables.'
              : 'Our teams combine information systems strategy, product execution, and operational excellence to turn your priorities into measurable outcomes.'}
          </p>
        </div>
      </section>

      <section className="section-container mt-10 grid gap-6 lg:grid-cols-3">
        {domains.map((domain) => (
          <article key={domain.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-brand-border dark:bg-brand-panel/30">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{domain.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-brand-muted">{domain.description}</p>
            <ul className="mt-4 space-y-2">
              {domain.capabilities.map((capability) => (
                <li key={capability} className="flex gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-slate-200 pt-4 dark:border-brand-border/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
                {isFr ? 'Cas d usage frequents' : 'Common use cases'}
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-brand-muted">
                {domain.useCases.map((caseItem) => (
                  <li key={caseItem}>- {caseItem}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-brand-border dark:bg-brand-panel/30">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {isFr ? 'Parcours a la carte' : 'A la carte engagement paths'}
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Vous pouvez activer une seule brique (audit, cadrage, delivery, run) ou un programme complet selon votre maturite.'
              : 'You can activate one workstream only (audit, scoping, delivery, run) or a full program depending on your maturity.'}
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {operatingModel.map((item) => (
              <article key={item.stage} className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 dark:border-brand-border/70 dark:bg-brand-navy/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">{item.stage}</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-brand-border dark:bg-brand-panel/30">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {isFr ? 'Resultats attendus' : 'Expected outcomes'}
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {outcomes.map((outcome) => (
              <p key={outcome} className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm text-slate-700 dark:border-brand-border/70 dark:bg-brand-navy/40 dark:text-slate-200">
                {outcome}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-brand-accent/30 bg-gradient-to-r from-cyan-50 to-blue-50 p-8 dark:from-brand-navy dark:to-brand-slate dark:bg-none">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {isFr ? 'Evaluer votre maturite systèmes d\'information' : 'Assess your information systems maturity'}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Nous proposons un diagnostic cible pour identifier vos leviers de performance et prioriser les chantiers critiques.'
              : 'We provide a targeted diagnostic to identify your performance levers and prioritize critical workstreams.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ArchitectWhatsAppCta locale={locale as 'fr' | 'en'} source="expertise-page-cta" />
            <Link href="/contact" locale={locale as 'fr' | 'en'} className="rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-accent-hover">
              {isFr ? 'Demander un diagnostic' : 'Request a diagnostic'}
            </Link>
            <Link href="/technologies" locale={locale as 'fr' | 'en'} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-accent hover:text-brand-accent dark:border-brand-border dark:text-slate-100">
              {isFr ? 'Voir nos technologies' : 'View technologies'}
            </Link>
          </div>
        </div>
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-brand-accent/20 bg-white p-6 md:p-8 dark:border-brand-border dark:bg-brand-panel/20">
          <ContactLeadForm mode="diagnostic" source="expertise-diagnostic" />
        </div>
      </section>
    </div>
  );
}
