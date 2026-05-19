import { Link } from '@/src/lib/routing';

type Detail = {
  title: string;
  summary: string;
  points: string[];
};

const CONTENT: Record<string, { fr: Detail; en: Detail }> = {
  frontend: {
    fr: {
      title: 'Front-end et experience utilisateur',
      summary:
        'Nous construisons des interfaces rapides, lisibles et orientees conversion pour utilisateurs non techniques et experts.',
      points: [
        'Design system coherent, responsive mobile-first',
        'Parcours conversion simplifie (diagnostic, contact, WhatsApp)',
        'Accessibilite et performance web mesurees',
      ],
    },
    en: {
      title: 'Front-end and user experience',
      summary:
        'We build fast, readable interfaces focused on conversion for both non-technical and advanced users.',
      points: [
        'Consistent responsive design system',
        'Simplified conversion paths (diagnostic, contact, WhatsApp)',
        'Measured accessibility and web performance',
      ],
    },
  },
  backend: {
    fr: {
      title: 'Back-end et integration',
      summary:
        'Nous mettons en place des services metier robustes et des integrations API pour ERP, CRM et outils tiers.',
      points: [
        'Architecture modulaire pour evolutivite',
        'API securisees et observabilite des flux',
        'Integration progressive sans rupture d exploitation',
      ],
    },
    en: {
      title: 'Back-end and integration',
      summary:
        'We build robust business services and API integrations for ERP, CRM and third-party systems.',
      points: [
        'Modular architecture for long-term scalability',
        'Secure APIs with integration observability',
        'Progressive integration without operational disruption',
      ],
    },
  },
  'data-cloud-security': {
    fr: {
      title: 'Data, cloud et securite',
      summary:
        'Nous structurons vos donnees, renforcons la fiabilite cloud et appliquons des standards de securite concrets.',
      points: [
        'Modeles data orientes pilotage KPI',
        'Supervision, sauvegarde et plans de reprise',
        'Hardening, gouvernance des acces et conformite',
      ],
    },
    en: {
      title: 'Data, cloud and security',
      summary:
        'We structure your data, improve cloud reliability and implement practical security standards.',
      points: [
        'KPI-oriented data modeling',
        'Monitoring, backup and recovery plans',
        'Hardening, access governance and compliance',
      ],
    },
  },
};

export default async function TechnologyCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const isFr = locale === 'fr';
  const detail = CONTENT[category]?.[isFr ? 'fr' : 'en'];

  if (!detail) {
    return (
      <div className="pt-24 pb-20 bg-[var(--page-bg)] text-[var(--text-main)]">
        <section className="section-container">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-brand-border dark:bg-brand-panel/30">
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
              {isFr ? 'Categorie introuvable' : 'Category not found'}
            </h1>
            <Link
              href="/technologies"
              locale={locale as 'fr' | 'en'}
              className="mt-4 inline-flex text-sm font-semibold text-brand-accent hover:text-brand-accent-hover"
            >
              {isFr ? 'Retour aux technologies' : 'Back to technologies'}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[var(--page-bg)] text-[var(--text-main)]">
      <section className="section-container">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm dark:border-brand-border dark:bg-brand-panel/40">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            {isFr ? 'Technologies' : 'Technologies'}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-slate-900 dark:text-white">{detail.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-brand-muted">{detail.summary}</p>
        </div>
      </section>

      <section className="section-container mt-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-brand-border dark:bg-brand-panel/30">
          <ul className="space-y-3">
            {detail.points.map((point) => (
              <li key={point} className="flex gap-2 text-sm text-slate-700 dark:text-slate-200">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/technologies"
            locale={locale as 'fr' | 'en'}
            className="mt-6 inline-flex rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-accent hover:text-brand-accent dark:border-brand-border dark:text-slate-100"
          >
            {isFr ? 'Retour aux categories' : 'Back to categories'}
          </Link>
        </div>
      </section>
    </div>
  );
}
