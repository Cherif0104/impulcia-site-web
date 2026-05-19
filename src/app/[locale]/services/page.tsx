import { Link } from '@/src/lib/routing';
import ArchitectWhatsAppCta from '@/src/components/forms/ArchitectWhatsAppCta';

type ServiceOffer = {
  code: 'BUILD' | 'RUN' | 'SCALE' | 'CARE';
  subtitle: string;
  bullets: string[];
  catalog: string[];
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const offers: ServiceOffer[] = isFr
    ? [
        {
          code: 'BUILD',
          subtitle: 'Concevoir et développer des solutions métier robustes',
          bullets: ['ERP, CRM, plateformes métier et portails clients', 'Architecture logicielle évolutive et gouvernance technique', 'Livraison Agile avec critères de qualité et sécurité'],
          catalog: ['Site vitrine premium', 'E-commerce / store', 'Marketplace multi-vendeurs', 'Modules ERP: SIRH, logistique, parc auto, planification terrain', 'Applications mobiles et PWA'],
        },
        {
          code: 'RUN',
          subtitle: 'Opérer vos actifs numériques avec des engagements clairs',
          bullets: ['Supervision, MCO et support utilisateurs', 'Gestion cloud, sauvegardes et continuité de service', 'Gestion proactive des incidents et reporting SLA'],
          catalog: ['Support N1/N2/N3', 'Administration cloud et base de donnees', 'SecOps et monitoring 24/7', 'Runbook operations et astreinte'],
        },
        {
          code: 'SCALE',
          subtitle: 'Industrialiser la donnée et accélérer la performance',
          bullets: ['Data platform, tableaux de bord décisionnels et KPI', 'Automatisation des workflows et cas d usage IA', 'Optimisation des coûts et capacité de montée en charge'],
          catalog: ['BI executives dashboards', 'Automatisation CRM et pipeline commercial', 'IA assistee pour service client', 'Optimisation FinOps / capacite'],
        },
        {
          code: 'CARE',
          subtitle: 'Renforcer durablement vos équipes et votre gouvernance',
          bullets: ['Roadmap de transformation et priorisation stratégique', 'Coaching des équipes produit, métier et IT', 'Plan de montée en compétences et conduite du changement'],
          catalog: ['PMO et gouvernance portefeuille', 'Academie interne (produit, data, securite)', 'Conduite du changement', 'Audit trimestriel de maturite'],
        },
      ]
    : [
        {
          code: 'BUILD',
          subtitle: 'Design and deliver robust business solutions',
          bullets: ['ERP, CRM, business platforms and client portals', 'Scalable software architecture and technical governance', 'Agile delivery with quality and security gates'],
          catalog: ['Corporate website', 'E-commerce store', 'Multi-vendor marketplace', 'ERP modules: HRIS, logistics, fleet, field planning', 'Mobile apps and PWA'],
        },
        {
          code: 'RUN',
          subtitle: 'Operate digital assets with clear commitments',
          bullets: ['Monitoring, maintenance and user support', 'Cloud operations, backup strategy and continuity planning', 'Proactive incident handling with SLA reporting'],
          catalog: ['L1/L2/L3 support', 'Cloud and database administration', 'SecOps and 24/7 monitoring', 'Operational runbooks and on-call'],
        },
        {
          code: 'SCALE',
          subtitle: 'Industrialize data and accelerate performance',
          bullets: ['Data platforms, executive dashboards and KPI frameworks', 'Workflow automation and AI use-case delivery', 'Cost optimization and scalability engineering'],
          catalog: ['Executive BI dashboards', 'CRM and sales pipeline automation', 'AI-assisted customer operations', 'FinOps and capacity optimization'],
        },
        {
          code: 'CARE',
          subtitle: 'Strengthen teams and governance over time',
          bullets: ['Transformation roadmap and strategic prioritization', 'Coaching for product, business and IT squads', 'Capability uplift and change management programs'],
          catalog: ['PMO and portfolio governance', 'Internal academy (product, data, security)', 'Change management plans', 'Quarterly maturity review'],
        },
      ];

  const selector = isFr
    ? [
        'BUILD: je lance ou je refonds une plateforme.',
        'RUN: je dois securiser et fiabiliser l exploitation.',
        'SCALE: je veux plus de performance par la data et l automatisation.',
        'CARE: je structure la gouvernance et la montee en competence.',
      ]
    : [
        'BUILD: I launch or rebuild a platform.',
        'RUN: I need reliable and secure operations.',
        'SCALE: I want performance through data and automation.',
        'CARE: I need stronger governance and capability building.',
      ];

  return (
    <div className="pt-24 pb-20 bg-[var(--page-bg)] text-[var(--text-main)]">
      <section className="section-container">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm dark:border-brand-border dark:bg-brand-panel/40">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            {isFr ? 'Offres de services' : 'Service offerings'}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl text-slate-900 dark:text-white">
            {isFr ? 'Build. Run. Scale. Care.' : 'Build. Run. Scale. Care.'}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Un modèle d intervention modulaire pour piloter vos programmes digitaux de bout en bout, de la conception à l exploitation.'
              : 'A modular operating model to execute your digital programs end-to-end, from design to operations.'}
          </p>
        </div>
      </section>

      <section className="section-container mt-10 grid gap-6 md:grid-cols-2">
        {offers.map((offer) => (
          <article key={offer.code} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-brand-border dark:bg-brand-panel/30">
            <span className="inline-flex rounded-md bg-cyan-100 px-3 py-1 text-xs font-bold tracking-wide text-cyan-800 dark:bg-brand-accent/20 dark:text-brand-accent">
              {offer.code}
            </span>
            <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{offer.subtitle}</h2>
            <ul className="mt-4 space-y-2">
              {offer.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 border-t border-slate-200 pt-4 dark:border-brand-border/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
                {isFr ? 'Catalogue' : 'Catalog'}
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-brand-muted">
                {offer.catalog.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-brand-border dark:bg-brand-panel/30">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {isFr ? 'Selection rapide de vos besoins' : 'Quick need selector'}
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {selector.map((item) => (
              <p key={item} className="rounded-xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm text-slate-700 dark:border-brand-border/70 dark:bg-brand-navy/40 dark:text-slate-200">
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-brand-accent/30 bg-gradient-to-r from-blue-50 to-cyan-50 p-8 dark:from-brand-navy dark:to-brand-slate dark:bg-none">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            {isFr ? 'Construisons votre trajectoire opérationnelle' : 'Build your operational trajectory'}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-brand-muted">
            {isFr
              ? 'Nous cadrons avec votre équipe un plan d action 90 jours priorisé selon vos enjeux de performance, de risque et de budget.'
              : 'We align your team on a prioritized 90-day plan built around performance, risk and budget constraints.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <ArchitectWhatsAppCta locale={locale as 'fr' | 'en'} source="services-page-cta" />
            <Link href="/contact" locale={locale as 'fr' | 'en'} className="rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-accent-hover">
              {isFr ? 'Demander un diagnostic' : 'Request a diagnostic'}
            </Link>
            <Link href="/expertise" locale={locale as 'fr' | 'en'} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-accent hover:text-brand-accent dark:border-brand-border dark:text-slate-100">
              {isFr ? 'Voir nos compétences' : 'Explore our expertise'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
