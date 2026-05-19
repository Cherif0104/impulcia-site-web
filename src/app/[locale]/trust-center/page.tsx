export default async function TrustCenterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const blocks = [
    {
      title: isFr ? 'Politique sécurité' : 'Security policy',
      points: isFr
        ? [
            'Contrôles anti-abus sur les endpoints publics.',
            'Validation des entrées et séparation des environnements.',
            'Principe du moindre privilège pour les accès administratifs.',
          ]
        : [
            'Anti-abuse controls on public endpoints.',
            'Input validation and environment separation.',
            'Least-privilege principle for administrative access.',
          ],
    },
    {
      title: isFr ? 'Disponibilité & SLA' : 'Availability & SLA',
      points: isFr
        ? [
            'Supervision du service via endpoint de santé technique.',
            'Objectif de disponibilité 99.9% selon périmètre projet.',
            'Plan d’escalade incident défini avec le client.',
          ]
        : [
            'Service supervision through health endpoint monitoring.',
            '99.9% availability target depending on project scope.',
            'Incident escalation plan defined with each client.',
          ],
    },
    {
      title: isFr ? 'Support' : 'Support',
      points: isFr
        ? [
            'Support business par e-mail et WhatsApp Business.',
            'Fenêtre de support adaptée au contrat.',
            'Suivi des demandes et priorisation par criticité.',
          ]
        : [
            'Business support by email and WhatsApp Business.',
            'Support window aligned with contract terms.',
            'Ticket follow-up and priority by business criticality.',
          ],
    },
    {
      title: isFr ? 'FAQ Data & conformité' : 'Data & compliance FAQ',
      points: isFr
        ? [
            'Où sont hébergées les données ? Selon architecture contractuelle validée.',
            'Combien de temps les données leads sont conservées ? Selon base légale et finalité commerciale.',
            'Comment exercer ses droits RGPD ? Via contact@impulcia.com.',
          ]
        : [
            'Where is data hosted? According to validated contractual architecture.',
            'How long is lead data retained? According to legal basis and commercial purpose.',
            'How to exercise GDPR rights? Through contact@impulcia.com.',
          ],
    },
  ];

  return (
    <section className="py-24">
      <div className="section-container max-w-5xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
          {isFr ? 'Trust Center IMPULCIA' : 'IMPULCIA Trust Center'}
        </h1>
        <p className="text-brand-muted text-lg mb-10">
          {isFr
            ? 'Référentiel public de nos engagements sécurité, disponibilité, support et conformité.'
            : 'Public reference for our security, availability, support and compliance commitments.'}
        </p>
        <div className="grid md:grid-cols-2 gap-5">
          {blocks.map((block) => (
            <article
              key={block.title}
              className="glass-panel rounded-2xl border border-brand-border/50 p-6"
            >
              <h2 className="text-white text-lg font-semibold mb-4">{block.title}</h2>
              <ul className="space-y-2 text-sm text-brand-muted">
                {block.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="text-brand-accent mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
