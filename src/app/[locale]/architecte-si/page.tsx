import ServiceOfferPage from '@/src/components/enterprise/ServiceOfferPage';

export default async function ArchitecteSiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return (
    <ServiceOfferPage
      locale={locale}
      eyebrow={isFr ? 'Architecte SI' : 'IS architect'}
      title={isFr ? 'Échangez avec un architecte SI senior' : 'Talk with a senior IS architect'}
      subtitle={
        isFr
          ? "Un échange orienté décision pour valider vos options d'architecture, vos arbitrages make/buy et votre stratégie d'intégration."
          : 'A decision-oriented session to validate architecture options, make-or-buy choices and your integration strategy.'
      }
      vision={
        isFr
          ? "Sécuriser vos décisions d'architecture pour soutenir la performance business, la conformité et l'évolutivité du SI."
          : 'Secure architecture decisions that sustain business performance, compliance and IS scalability.'
      }
      methodology={
        isFr
          ? "Nous menons une revue ciblée de l'existant, confrontons plusieurs scénarios et recommandons une trajectoire techniquement robuste."
          : 'We run a focused current-state review, compare scenarios and recommend a technically robust trajectory.'
      }
      interventionSteps={
        isFr
          ? [
              'Analyse de votre architecture actuelle et de vos flux critiques',
              'Comparaison des scénarios build, buy ou hybridation',
              'Arbitrage sécurité, résilience, intégration et coûts',
              'Production de notes de décision pour comité de pilotage',
            ]
          : [
              'Assessment of current architecture and critical flows',
              'Comparison of build, buy or hybrid scenarios',
              'Trade-off on security, resilience, integration and cost',
              'Decision notes prepared for steering committee',
            ]
      }
      highlights={
        isFr
          ? [
              'Revue de votre cible applicative et de vos flux',
              'Arbitrages build, buy ou hybridation produits',
              'Scénarios cloud, sécurité, résilience et SLA',
              'Notes de décision pour comité projet',
            ]
          : [
              'Review of your target application landscape and flows',
              'Build, buy or hybrid product arbitrations',
              'Cloud, security, resilience and SLA scenarios',
              'Decision notes for project steering committee',
            ]
      }
      outcomes={
        isFr
          ? [
              'Décisions techniques alignées avec vos enjeux métier',
              'Réduction des risques d’impasse d’architecture',
              "Accélération de la phase d'exécution",
            ]
          : [
              'Technical decisions aligned with business priorities',
              'Reduced architecture dead-end risks',
              'Faster transition into execution phase',
            ]
      }
    />
  );
}
