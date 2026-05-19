import ServiceOfferPage from '@/src/components/enterprise/ServiceOfferPage';

export default async function AuditSiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return (
    <ServiceOfferPage
      locale={locale}
      eyebrow={isFr ? 'Audit SI' : 'IS audit'}
      title={isFr ? "Mesurez la maturité de votre système d'information" : 'Measure your information system maturity'}
      subtitle={
        isFr
          ? "Nous auditons l'existant (processus, architecture, sécurité, données, gouvernance) pour identifier les risques et gains rapides."
          : 'We assess your current landscape (processes, architecture, security, data, governance) to identify risks and quick wins.'
      }
      vision={
        isFr
          ? "Établir une base factuelle fiable pour prioriser vos investissements SI et réduire les zones de risque."
          : 'Establish a reliable fact base to prioritize IS investments and reduce risk exposure.'
      }
      methodology={
        isFr
          ? "Nous croisons analyses techniques, revue organisationnelle et entretiens métiers pour livrer un diagnostic orienté décision."
          : 'We combine technical analysis, organizational review and business interviews to deliver a decision-ready diagnostic.'
      }
      interventionSteps={
        isFr
          ? [
              "Collecte des données et entretiens des parties prenantes clés",
              'Évaluation des processus, architecture, sécurité et qualité des données',
              'Qualification des risques et estimation des impacts business',
              "Restitution d'un plan de remédiation priorisé et chiffré",
            ]
          : [
              'Data collection and interviews with key stakeholders',
              'Assessment of processes, architecture, security and data quality',
              'Risk qualification and business impact estimation',
              'Delivery of a prioritized and costed remediation plan',
            ]
      }
      highlights={
        isFr
          ? [
              'Diagnostic de performance applicative et opérationnelle',
              'Évaluation cybersécurité, conformité et continuité',
              'Analyse de qualité des données et interopérabilité',
              'Recommandations priorisées par impact business',
            ]
          : [
              'Application and operational performance diagnostic',
              'Security, compliance and continuity assessment',
              'Data quality and interoperability analysis',
              'Business-impact-prioritized recommendations',
            ]
      }
      outcomes={
        isFr
          ? [
              'Rapport décisionnel orienté comité de direction',
              'Plan de remédiation chiffré et séquencé',
              'Base solide pour cadrage et déploiement',
            ]
          : [
              'Executive-ready decision report',
              'Costed and phased remediation plan',
              'Solid baseline for scoping and implementation',
            ]
      }
    />
  );
}
