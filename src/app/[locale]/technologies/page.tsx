import { Link } from '@/src/lib/routing';
import ArchitectWhatsAppCta from '@/src/components/forms/ArchitectWhatsAppCta';

type StackBlock = {
  slug: string;
  category: string;
  description: string;
  tools: string[];
  useCases: string[];
};

export default async function TechnologiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const stacks: StackBlock[] = isFr
    ? [
        {
          slug: 'frontend',
          category: 'Front-end & experience',
          description: 'Interfaces performantes, accessibles et adaptees aux usages enterprise.',
          tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
          useCases: ['Portails clients', 'Extranet partenaires', 'Backoffice metier responsive'],
        },
        {
          slug: 'backend',
          category: 'Back-end & integration',
          description: 'Services metier robustes et interfacage fiable avec vos ecosystemes existants.',
          tools: ['Node.js', 'API REST', 'PostgreSQL', 'Supabase'],
          useCases: ['ERP modules', 'SIRH', 'Synchronisation CRM-comptabilite'],
        },
        {
          slug: 'data-cloud-security',
          category: 'Data, cloud & securite',
          description: 'Socle operationnel pour industrialiser les flux, la gouvernance et la resilience.',
          tools: ['Data modeling', 'Cloud operations', 'CI/CD', 'Security hardening'],
          useCases: ['Data marts KPI', 'Pipelines integration', 'PRA et monitoring proactif'],
        },
      ]
    : [
        {
          slug: 'frontend',
          category: 'Front-end & experience',
          description: 'High-performance, accessible interfaces tailored for enterprise users.',
          tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
          useCases: ['Customer portals', 'Partner extranets', 'Responsive business backoffice'],
        },
        {
          slug: 'backend',
          category: 'Back-end & integration',
          description: 'Robust business services and reliable integrations with existing ecosystems.',
          tools: ['Node.js', 'REST APIs', 'PostgreSQL', 'Supabase'],
          useCases: ['ERP modules', 'HRIS', 'CRM-accounting synchronization'],
        },
        {
          slug: 'data-cloud-security',
          category: 'Data, cloud & security',
          description: 'Operational foundations to scale flows, governance, and resilience.',
          tools: ['Data modeling', 'Cloud operations', 'CI/CD', 'Security hardening'],
          useCases: ['KPI data marts', 'Integration pipelines', 'Disaster recovery and proactive monitoring'],
        },
      ];

  const principles = isFr
    ? [
        'Selection technologique orientee valeur metier et maintenabilite long terme.',
        'Standards de qualite integres des la conception (tests, monitoring, securite).',
        'Architecture modulaire pour faciliter l evolution de vos plateformes.',
        'Documentation et transfer de connaissance systematiques.',
      ]
    : [
        'Technology choices driven by business value and long-term maintainability.',
        'Quality standards embedded from day one (testing, monitoring, security).',
        'Modular architecture to support continuous platform evolution.',
        'Systematic documentation and knowledge transfer.',
      ];

  return (
    <div className="pt-24 pb-20 bg-[var(--page-bg)] text-[var(--text-main)]">
      <section className="section-container">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm dark:border-brand-border dark:bg-brand-panel/40">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            {isFr ? 'Technologies' : 'Technologies'}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl text-slate-900 dark:text-white">
            {isFr ? 'Une stack moderne, pragmatique et orientee impact' : 'A modern, pragmatic, impact-driven technology stack'}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Nous combinons des technologies ouvertes et des bonnes pratiques d engineering pour livrer des plateformes fiables, evolutives et securisees.'
              : 'We combine open technologies and engineering best practices to deliver secure, scalable, and reliable business platforms.'}
          </p>
        </div>
      </section>

      <section className="section-container mt-10 grid gap-6 md:grid-cols-3">
        {stacks.map((stack) => (
          <article key={stack.category} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-brand-border dark:bg-brand-panel/30">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{stack.category}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-brand-muted">{stack.description}</p>
            <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-brand-panel/60">
              <div className="h-1.5 w-2/3 rounded-full bg-gradient-to-r from-brand-accent to-cyan-400" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {stack.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-900 dark:border-brand-border dark:bg-brand-navy/40 dark:text-slate-200"
                >
                  {tool}
                </span>
              ))}
            </div>
            <ul className="mt-4 space-y-1 text-xs text-slate-600 dark:text-brand-muted">
              {stack.useCases.map((useCase) => (
                <li key={useCase}>- {useCase}</li>
              ))}
            </ul>
            <a
              href={`/${locale}/technologies/${stack.slug}`}
              className="mt-4 inline-flex text-xs font-semibold text-brand-accent hover:text-brand-accent-hover"
            >
              {isFr ? 'En savoir plus' : 'Learn more'}
            </a>
          </article>
        ))}
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-brand-border dark:bg-brand-panel/30">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {isFr ? 'Principes d engineering' : 'Engineering principles'}
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {principles.map((principle) => (
              <li key={principle} className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-slate-700 dark:border-brand-border/70 dark:bg-brand-navy/40 dark:text-slate-200">
                {principle}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-brand-accent/30 bg-gradient-to-r from-cyan-50 to-blue-50 p-8 dark:from-brand-navy dark:to-brand-slate dark:bg-none">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {isFr ? 'Construire une architecture cible solide' : 'Build a solid target architecture'}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Nous vous aidons a arbitrer les choix technologiques selon vos contraintes de securite, budget, delais et croissance.'
              : 'We help your teams arbitrate technology decisions based on security, budget, timeline, and growth constraints.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ArchitectWhatsAppCta locale={locale as 'fr' | 'en'} source="technologies-page-cta" />
            <Link href="/services" locale={locale as 'fr' | 'en'} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-accent hover:text-brand-accent dark:border-brand-border dark:text-slate-100">
              {isFr ? 'Voir nos offres' : 'View service offerings'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
