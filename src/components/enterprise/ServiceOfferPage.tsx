import Image from 'next/image';
import Button from '@/src/components/ui/Button';
import WhatsAppButton from '@/src/components/forms/WhatsAppButton';
import { getEnterpriseSectionVisual } from '@/src/lib/media';

type ServiceOfferPageProps = {
  locale: string;
  visualKey?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  vision: string;
  methodology: string;
  interventionSteps: string[];
  highlights: string[];
  outcomes: string[];
};

export default function ServiceOfferPage({
  locale,
  visualKey = 'serviceOffer',
  eyebrow,
  title,
  subtitle,
  vision,
  methodology,
  interventionSteps,
  highlights,
  outcomes,
}: ServiceOfferPageProps) {
  const isFr = locale === 'fr';

  return (
    <section className="py-24">
      <div className="section-container max-w-6xl">
        <div className="glass-panel rounded-3xl border border-brand-accent/30 p-8 md:p-12 mb-8">
          <p className="text-xs uppercase tracking-wider text-brand-accent mb-3">{eyebrow}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
          <p className="text-brand-muted text-lg leading-relaxed max-w-3xl">{subtitle}</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <WhatsAppButton
              includeNumber={false}
              label={isFr ? 'Contacter un expert' : 'Contact an expert'}
              prefillText={
                isFr
                  ? `Bonjour IMPULCIA, je souhaite ${title.toLowerCase()} et demander un diagnostic.`
                  : `Hello IMPULCIA, I would like support on ${title.toLowerCase()} and request a diagnostic.`
              }
            />
            <Button href={`/${locale}/#contact`} variant="secondary" size="md">
              {isFr ? 'Demander un diagnostic' : 'Request a diagnostic'}
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-brand-border/50 bg-brand-panel/40 aspect-[16/6] mb-8">
          <Image
            src={getEnterpriseSectionVisual(visualKey)}
            alt={
              isFr
                ? `Illustration de l'offre ${title}`
                : `${title} service offer illustration`
            }
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/30 via-transparent to-transparent" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <article className="glass-panel rounded-2xl border border-brand-border/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {isFr ? 'Ce que nous activons' : 'What we activate'}
            </h2>
            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="text-sm text-brand-muted flex gap-2">
                  <span className="text-brand-accent">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="glass-panel rounded-2xl border border-brand-border/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {isFr ? 'Résultats attendus' : 'Expected outcomes'}
            </h2>
            <ul className="space-y-3">
              {outcomes.map((item) => (
                <li key={item} className="text-sm text-brand-muted flex gap-2">
                  <span className="text-brand-accent">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <article className="glass-panel rounded-2xl border border-brand-border/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">{isFr ? 'Vision' : 'Vision'}</h2>
            <p className="text-sm text-brand-muted leading-relaxed">{vision}</p>
          </article>

          <article className="glass-panel rounded-2xl border border-brand-border/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {isFr ? 'Méthodologie' : 'Methodology'}
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">{methodology}</p>
          </article>

          <article className="glass-panel rounded-2xl border border-brand-border/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {isFr ? "Étapes d'intervention" : 'Intervention steps'}
            </h2>
            <ol className="space-y-2">
              {interventionSteps.map((step, idx) => (
                <li key={step} className="text-sm text-brand-muted flex gap-2">
                  <span className="text-brand-accent font-semibold">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </article>
        </div>
      </div>
    </section>
  );
}
