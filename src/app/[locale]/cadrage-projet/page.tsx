import ServiceOfferPage from '@/src/components/enterprise/ServiceOfferPage';

export default async function CadrageProjetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return (
    <ServiceOfferPage
      locale={locale}
      eyebrow={isFr ? 'Cadrage projet' : 'Project scoping'}
      title={
        isFr ? 'Alignez votre projet SI avec vos priorités métier' : 'Align your IS project with business priorities'
      }
      subtitle={
        isFr
          ? "Nous structurons votre besoin en trajectoire exécutable: objectifs, périmètre, budget, gouvernance et plan de déploiement."
          : 'We turn your needs into an executable trajectory: objectives, scope, budget, governance and rollout plan.'
      }
      vision={
        isFr
          ? "Créer une vision SI partagée entre métiers, DSI et direction générale pour engager un programme réaliste et pilotable."
          : 'Build a shared IS vision across business, IT and leadership to launch a realistic, governable program.'
      }
      methodology={
        isFr
          ? 'Nous combinons ateliers de décision, analyse terrain et priorisation par valeur pour traduire les enjeux en feuille de route exécutable.'
          : 'We combine decision workshops, field analysis and value-based prioritization to turn strategic needs into an executable roadmap.'
      }
      interventionSteps={
        isFr
          ? [
              'Ateliers de cadrage avec sponsors et équipes clés',
              'Cartographie des processus, contraintes et dépendances',
              'Priorisation des lots de valeur et des quick wins',
              'Formalisation de la roadmap, gouvernance et indicateurs',
            ]
          : [
              'Scoping workshops with sponsors and key teams',
              'Mapping of processes, constraints and dependencies',
              'Prioritization of value streams and quick wins',
              'Roadmap, governance and KPI formalization',
            ]
      }
      highlights={
        isFr
          ? [
              'Ateliers parties prenantes et cadrage des objectifs',
              'Cartographie des processus et des irritants opérationnels',
              'Priorisation des lots de valeur à 90 jours / 12 mois',
              'Modèle de gouvernance et indicateurs de pilotage',
            ]
          : [
              'Stakeholder workshops and objective framing',
              'Process and operational pain-point mapping',
              'Value stream prioritization across 90 days / 12 months',
              'Governance model and steering KPIs',
            ]
      }
      outcomes={
        isFr
          ? [
              'Vision SI partagée entre directions métier et IT',
              'Roadmap validée avec dépendances techniques clarifiées',
              'Réduction du risque de dérive coût / délai en exécution',
            ]
          : [
              'Shared IS vision between business and IT leaders',
              'Validated roadmap with clarified technical dependencies',
              'Lower cost and timeline drift risk during execution',
            ]
      }
    />
  );
}
