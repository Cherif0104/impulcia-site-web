import Button from '@/src/components/ui/Button';
import WhatsAppButton from '@/src/components/forms/WhatsAppButton';

const frCases = [
  {
    title: 'Gouvernance multi-entités pour institution publique',
    challenge: 'Validation lente, reporting fragmenté, faible traçabilité des décisions.',
    impact: 'Cycle de validation réduit de 38% et consolidation décisionnelle en temps réel.',
  },
  {
    title: 'Pilotage opérationnel transport et mobilité',
    challenge: 'Visibilité partielle des trajets, incidents et coûts terrain.',
    impact: 'Réduction de 22% des écarts de trajets et meilleure ponctualité de service.',
  },
  {
    title: 'Conformité bailleurs et reporting programmes',
    challenge: 'Difficulté à relier dépenses, livrables et KPI contractuels.',
    impact: 'Temps de consolidation divisé par 2 avec meilleure fiabilité des rapports.',
  },
];

const enCases = [
  {
    title: 'Multi-entity governance for public institutions',
    challenge: 'Slow approvals, fragmented reporting and low decision traceability.',
    impact: '38% faster validation cycle with real-time executive consolidation.',
  },
  {
    title: 'Operational steering for transport and mobility',
    challenge: 'Partial visibility on trips, incidents and field costs.',
    impact: '22% reduction in trip deviations and stronger service punctuality.',
  },
  {
    title: 'Donor compliance and program reporting',
    challenge: 'Hard to connect spending, deliverables and contractual KPIs.',
    impact: '2x faster reporting consolidation with improved report reliability.',
  },
];

export default async function RealisationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const cases = isFr ? frCases : enCases;

  return (
    <section className="py-24">
      <div className="section-container max-w-6xl">
        <div className="glass-panel rounded-3xl border border-brand-accent/30 p-8 md:p-12 mb-8">
          <p className="text-xs uppercase tracking-wider text-brand-accent mb-3">
            {isFr ? 'Réalisations' : 'Case studies'}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            {isFr ? 'Des références SI orientées résultats' : 'IS references focused on outcomes'}
          </h1>
          <p className="text-brand-muted text-lg leading-relaxed max-w-3xl">
            {isFr
              ? 'Chaque mission IMPULCIA relie architecture, exécution et performance métier. Voici des exemples de livrables concrets et de gains obtenus.'
              : 'Each IMPULCIA mission connects architecture, execution and business performance. Here are concrete deliveries and measurable gains.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {cases.map((item) => (
            <article key={item.title} className="glass-panel rounded-2xl border border-brand-border/50 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">{item.title}</h2>
              <p className="text-sm text-brand-muted mb-3">{item.challenge}</p>
              <p className="text-sm text-brand-accent">{item.impact}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <WhatsAppButton
            includeNumber={false}
            label={isFr ? 'Contacter un expert' : 'Contact an expert'}
            prefillText={
              isFr
                ? 'Bonjour IMPULCIA, je souhaite discuter de nos besoins et demander un diagnostic.'
                : 'Hello IMPULCIA, I would like to discuss our needs and request a diagnostic.'
            }
          />
          <Button href={`/${locale}/#contact`} variant="secondary" size="md">
            {isFr ? 'Demander un diagnostic' : 'Request a diagnostic'}
          </Button>
        </div>
      </div>
    </section>
  );
}
