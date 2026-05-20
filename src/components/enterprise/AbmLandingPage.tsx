import Button from '@/src/components/ui/Button';
import WhatsAppButton from '@/src/components/forms/WhatsAppButton';
import SectionVisual from './SectionVisual';

type AbmVariant = 'enterprise' | 'institution' | 'donor';

const variants = {
  enterprise: {
    fr: {
      title: 'Pour Grands Comptes',
      subtitle:
        'Accélérez vos programmes de transformation avec un partenaire capable de déployer ERP, gouvernance et data à l’échelle multi-entités.',
      proof: ['Pilotage multi-filiales', 'Intégration du système d\'information existant', 'Roadmap transformation 12-24 mois'],
    },
    en: {
      title: 'For Enterprise Accounts',
      subtitle:
        'Accelerate transformation programs with a partner able to deploy ERP, governance and data at multi-entity scale.',
      proof: ['Multi-subsidiary steering', 'Legacy system integration', '12-24 month transformation roadmap'],
    },
  },
  institution: {
    fr: {
      title: 'Pour Institutions Publiques',
      subtitle:
        'Structurez vos services, améliorez la transparence et sécurisez les décisions avec des systèmes numériques gouvernés.',
      proof: ['Traçabilité décisionnelle', 'Conformité administrative', 'Performance des services publics'],
    },
    en: {
      title: 'For Public Institutions',
      subtitle:
        'Structure services, improve transparency and secure decisions with governed digital systems.',
      proof: ['Decision traceability', 'Administrative compliance', 'Public service performance'],
    },
  },
  donor: {
    fr: {
      title: 'Pour Bailleurs & Programmes',
      subtitle:
        'Pilotez vos programmes avec des indicateurs fiables, une conformité renforcée et un reporting opérationnel rapide.',
      proof: ['KPI projets consolidés', 'Auditabilité des dépenses', 'Reporting bailleurs accéléré'],
    },
    en: {
      title: 'For Donors & Programs',
      subtitle:
        'Run your programs with reliable indicators, stronger compliance and fast operational reporting.',
      proof: ['Consolidated project KPIs', 'Spend auditability', 'Faster donor reporting'],
    },
  },
} as const;

export default function AbmLandingPage({
  locale,
  variant,
}: {
  locale: string;
  variant: AbmVariant;
}) {
  const isFr = locale === 'fr';
  const content = isFr ? variants[variant].fr : variants[variant].en;
  const visualKey =
    variant === 'enterprise' ? 'abmEnterprise' : variant === 'institution' ? 'abmInstitution' : 'abmDonor';

  return (
    <section className="py-24">
      <div className="section-container max-w-5xl">
        <div className="glass-panel rounded-3xl border border-brand-accent/30 p-10 md:p-14">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-brand-accent text-xs uppercase tracking-wider mb-3">
                {isFr ? 'Landing ciblée' : 'Targeted landing'}
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">{content.title}</h1>
              <p className="text-brand-muted text-lg leading-relaxed mb-8">{content.subtitle}</p>
              <div className="grid md:grid-cols-3 gap-3 mb-8">
                {content.proof.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-brand-border/50 bg-brand-panel/40 px-4 py-3 text-sm text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <SectionVisual
              visualKey={visualKey}
              alt={isFr ? `Visuel ${content.title} pour orientation stratégique` : `${content.title} strategy visual`}
              className="aspect-[16/10]"
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <WhatsAppButton
              includeNumber={false}
              label={isFr ? 'Contacter un expert' : 'Contact an expert'}
              prefillText={
                isFr
                  ? `Bonjour IMPULCIA, je souhaite un diagnostic ${content.title.toLowerCase()}.`
                  : `Hello IMPULCIA, I would like a diagnostic for ${content.title.toLowerCase()}.`
              }
            />
            <Button href={`/${locale}/#contact`} variant="secondary" size="md">
              {isFr ? 'Demander un diagnostic' : 'Request a diagnostic'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
