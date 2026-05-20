export { trustMetadata as generateMetadata } from '@/src/lib/seo/pages';

export default async function TrustSecurityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const sections = [
    {
      title: isFr ? 'Conformité RGPD' : 'GDPR compliance',
      items: isFr
        ? [
            'Gestion du consentement cookies (essentiel, analytics, marketing).',
            'Collecte minimale des données de leads et finalité explicite.',
            'Droits d’accès, correction et suppression via contact@impulcia.com.',
          ]
        : [
            'Cookie consent controls (essential, analytics, marketing).',
            'Lead data minimization with explicit processing purpose.',
            'Access, correction and deletion rights via contact@impulcia.com.',
          ],
    },
    {
      title: isFr ? 'Sécurité applicative' : 'Application security',
      items: isFr
        ? [
            'Protection anti-abus sur les endpoints publics (rate limiting, honeypot).',
            'Validation stricte des entrées côté API et journalisation des erreurs.',
            'Hygiène de développement orientée production multi-instances.',
          ]
        : [
            'Anti-abuse controls on public endpoints (rate limiting, honeypot).',
            'Strict API input validation and controlled error logging.',
            'Production-minded engineering for multi-instance deployments.',
          ],
    },
    {
      title: isFr ? 'Gouvernance & exploitation' : 'Governance & operations',
      items: isFr
        ? [
            'Pilotage des incidents et suivi de santé via endpoint technique.',
            'Traçabilité des interactions CRM (leads, consentements, analytics).',
            'Revue mensuelle de conversion, conformité et posture de confiance.',
          ]
        : [
            'Incident management and technical health endpoint monitoring.',
            'Traceability for CRM interactions (leads, consents, analytics).',
            'Monthly review of conversion, compliance and trust posture.',
          ],
    },
    {
      title: isFr ? 'Disponibilité & support' : 'Availability & support',
      items: isFr
        ? [
            'Architecture cloud évolutive adaptée aux organisations multi-sites.',
            'Support business via e-mail et WhatsApp Business.',
            'SLA définis selon le contexte projet et la criticité métier.',
          ]
        : [
            'Scalable cloud architecture for multi-site organizations.',
            'Business support through email and WhatsApp Business.',
            'SLA commitments adjusted to project context and business criticality.',
          ],
    },
  ];

  return (
    <section className="py-24">
      <div className="section-container max-w-5xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          {isFr ? 'Confiance & Sécurité' : 'Trust & Security'}
        </h1>
        <p className="text-brand-muted text-lg leading-relaxed mb-10 max-w-3xl">
          {isFr
            ? 'IMPULCIA applique une approche security-by-design et compliance-by-design pour garantir un cadre fiable à vos projets ERP, cloud et transformation digitale.'
            : 'IMPULCIA applies security-by-design and compliance-by-design to provide a reliable framework for your ERP, cloud and transformation initiatives.'}
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          {sections.map((section) => (
            <article
              key={section.title}
              className="glass-panel rounded-2xl border border-brand-border/50 p-6"
            >
              <h2 className="text-white text-lg font-semibold mb-4">{section.title}</h2>
              <ul className="space-y-2 text-sm text-brand-muted">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-brand-accent mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <a
            href={`/${locale}/trust-center`}
            className="text-sm text-brand-accent hover:text-brand-accent-hover transition"
          >
            {isFr ? 'Accéder au Trust Center étendu →' : 'Open extended Trust Center →'}
          </a>
        </div>
      </div>
    </section>
  );
}
