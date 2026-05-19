import Link from 'next/link';
import { redirect } from 'next/navigation';
import { hasRequiredAdminRole } from '@/src/lib/admin-auth';

const LINKEDIN_URL = 'https://www.linkedin.com/company/impulcia-afrique/posts/?feedView=all';

export default async function AdminManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(await hasRequiredAdminRole(['org_admin', 'owner']))) {
    redirect(`/${locale}/admin`);
  }
  const isFr = locale === 'fr';
  const base = `/${locale}/admin`;

  const quickActions = [
    { href: `${base}/leads`, labelFr: 'Traiter les leads entrants', labelEn: 'Process inbound leads' },
    { href: `${base}/engagements`, labelFr: 'Analyser les engagements', labelEn: 'Analyze engagements' },
    { href: `${base}/messages`, labelFr: 'Suivre la boîte messages', labelEn: 'Monitor message inbox' },
    { href: `${base}/analytics`, labelFr: 'Analyser le funnel CTA', labelEn: 'Analyze CTA funnel' },
    { href: `${base}/faq`, labelFr: 'Mettre à jour la FAQ', labelEn: 'Update FAQ' },
    { href: `/${locale}/realisations`, labelFr: 'Vérifier la page réalisations', labelEn: 'Review case studies page' },
    { href: `/${locale}/cadrage-projet`, labelFr: 'Contrôler l’offre cadrage', labelEn: 'Review scoping offer page' },
  ];

  const managementSections = isFr
    ? [
        {
          title: 'Pilotage commercial',
          points: [
            'Vue hebdomadaire des leads nouveaux / qualifies / gagnes',
            'Suivi des demandes audit SI, cadrage projet et architecte SI',
            'Routine de relance sous 24h sur chaque lead prioritaire',
          ],
        },
        {
          title: 'Pilotage contenu & marque',
          points: [
            'Alignement des CTA avec les offres metier publiees',
            'Mise a jour mensuelle des realisations et preuves business',
            'Publication continue sur LinkedIn IMPULCIA AFRIQUE',
          ],
        },
        {
          title: 'Pilotage operationnel',
          points: [
            'Revue des incidents de conversion et pages a faible performance',
            'Controle de la coherence FR/EN sur pages business',
            'Priorisation des evolutions backlog site + CRM',
          ],
        },
      ]
    : [
        {
          title: 'Commercial management',
          points: [
            'Weekly view of new / qualified / won leads',
            'Tracking IS audit, project scoping and IS architect requests',
            '24h follow-up routine for high-priority leads',
          ],
        },
        {
          title: 'Content & brand management',
          points: [
            'CTA alignment with published business offers',
            'Monthly refresh of case studies and proof points',
            'Ongoing publishing on IMPULCIA AFRIQUE LinkedIn',
          ],
        },
        {
          title: 'Operational management',
          points: [
            'Review conversion incidents and low-performing pages',
            'Check FR/EN consistency across business pages',
            'Prioritize website + CRM backlog iterations',
          ],
        },
      ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-white mb-2">
        {isFr ? 'Management general' : 'General management'}
      </h1>
      <p className="text-sm text-brand-muted mb-8">
        {isFr
          ? 'Espace de pilotage global pour coordonner activite commerciale, contenu et gouvernance du site.'
          : 'Global control space to coordinate commercial activity, content and website governance.'}
      </p>

      <div className="glass-panel rounded-xl border border-brand-border/50 p-6 mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-white font-semibold text-lg">
            {isFr ? 'Raccourcis management' : 'Management shortcuts'}
          </h2>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-accent hover:text-brand-accent-hover transition"
          >
            {isFr ? 'Ouvrir LinkedIn IMPULCIA' : 'Open IMPULCIA LinkedIn'}
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-lg border border-brand-border/60 bg-brand-panel/30 px-4 py-3 text-sm text-brand-muted hover:text-white hover:border-brand-accent/50 transition"
            >
              {isFr ? action.labelFr : action.labelEn}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {managementSections.map((section) => (
          <article key={section.title} className="glass-panel rounded-xl border border-brand-border/50 p-5">
            <h3 className="text-white font-semibold mb-3">{section.title}</h3>
            <ul className="space-y-2 text-sm text-brand-muted">
              {section.points.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
