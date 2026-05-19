import Image from 'next/image';
import { Link } from '@/src/lib/routing';
import { getProductLogo, getProductFallbackLogo } from '@/src/lib/media';
import { productContent, productOrder, type ProductId } from '@/src/lib/products';

function getProductHref(id: ProductId): '/coya' | '/sentrajet' | '/patrimo' | '/sunugest' | '/mbourake' {
  if (id === 'coya') return '/coya';
  if (id === 'sentrajet') return '/sentrajet';
  if (id === 'patrimo') return '/patrimo';
  if (id === 'sunugest') return '/sunugest';
  return '/mbourake';
}

export default function ProductSolutionPage({
  locale,
  productId,
}: {
  locale: string;
  productId: ProductId;
}) {
  const isFr = locale === 'fr';
  const product = productContent[productId];
  const logo = getProductLogo(product.id) ?? getProductFallbackLogo();

  return (
    <section className="py-24">
      <div className="section-container max-w-6xl">
        <div className="glass-panel rounded-3xl border border-brand-accent/30 p-8 md:p-12 mb-10">
          <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-white/95 p-2 flex items-center justify-center">
                <Image src={logo} alt={product.name} width={56} height={56} className="object-contain" />
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl text-white font-bold">{product.name}</h1>
                <p className="text-brand-accent text-sm mt-1">
                  {isFr ? product.tagline.fr : product.tagline.en}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/realisations"
                className="inline-flex items-center rounded-lg border border-brand-border px-4 py-2 text-sm text-brand-muted hover:text-white hover:border-brand-accent transition"
              >
                {isFr ? 'Voir la fiche solution' : 'View solution brief'}
              </Link>
            </div>
          </div>
          <p className="text-brand-muted text-lg leading-relaxed mt-6 max-w-3xl">
            {isFr ? product.value.fr : product.value.en}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <article className="glass-panel rounded-2xl border border-brand-border/50 p-6 lg:col-span-2">
            <h2 className="text-xl text-white font-semibold mb-4">
              {isFr ? 'Fonctionnalités clés' : 'Key capabilities'}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {product.features.map((feature) => (
                <li
                  key={feature.fr}
                  className="rounded-lg border border-brand-border/40 bg-brand-panel/40 px-3 py-2 text-sm text-brand-muted"
                >
                  {isFr ? feature.fr : feature.en}
                </li>
              ))}
            </ul>
          </article>
          <article className="glass-panel rounded-2xl border border-brand-border/50 p-6">
            <p className="text-xs uppercase tracking-wide text-brand-muted mb-2">
              {isFr ? 'Preuve business' : 'Business proof'}
            </p>
            <p className="text-4xl font-bold text-brand-accent">{product.proof.metric}</p>
            <p className="text-sm text-brand-muted mt-2">
              {isFr ? product.proof.label.fr : product.proof.label.en}
            </p>
          </article>
        </div>

        <div className="glass-panel rounded-2xl border border-brand-border/50 p-6 mb-10">
          <h2 className="text-xl text-white font-semibold mb-4">
            {isFr ? "Cas d'usage prioritaires" : 'Priority use cases'}
          </h2>
          <ul className="grid md:grid-cols-3 gap-3">
            {product.useCases.map((useCase) => (
              <li
                key={useCase.fr}
                className="rounded-lg border border-brand-border/40 bg-brand-panel/40 px-3 py-3 text-sm text-brand-muted"
              >
                {isFr ? useCase.fr : useCase.en}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel rounded-2xl border border-brand-accent/30 p-6 mb-10">
          <h2 className="text-xl text-white font-semibold mb-4">
            {isFr ? 'Accompagnement conseil autour de cette solution' : 'Consulting delivery around this solution'}
          </h2>
          <div className="grid md:grid-cols-3 gap-3 text-sm text-brand-muted">
            <div className="rounded-lg border border-brand-border/40 bg-brand-panel/40 px-4 py-3">
              <p className="text-white font-semibold mb-1">{isFr ? 'Vision' : 'Vision'}</p>
              <p>
                {isFr
                  ? 'Aligner la solution avec vos priorités métier, votre gouvernance et vos contraintes terrain.'
                  : 'Align the solution with your business priorities, governance and field constraints.'}
              </p>
            </div>
            <div className="rounded-lg border border-brand-border/40 bg-brand-panel/40 px-4 py-3">
              <p className="text-white font-semibold mb-1">{isFr ? 'Méthodologie' : 'Methodology'}</p>
              <p>
                {isFr
                  ? 'Diagnostic rapide, cadrage des lots de valeur, puis déploiement progressif avec conduite du changement.'
                  : 'Rapid diagnostic, value-stream scoping, then phased rollout with change management.'}
              </p>
            </div>
            <div className="rounded-lg border border-brand-border/40 bg-brand-panel/40 px-4 py-3">
              <p className="text-white font-semibold mb-1">
                {isFr ? "Étapes d'intervention" : 'Intervention steps'}
              </p>
              <p>
                {isFr
                  ? 'Audit initial, architecture cible, implémentation, adoption utilisateurs et amélioration continue.'
                  : 'Initial audit, target architecture, implementation, user adoption and continuous improvement.'}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl border border-brand-border/50 p-6">
          <h2 className="text-lg text-white font-semibold mb-4">
            {isFr ? 'Explorer les autres solutions' : 'Explore other solutions'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {productOrder
              .filter((id) => id !== productId)
              .map((id) => (
                <Link
                  key={id}
                  href={getProductHref(id)}
                  className="px-3 py-2 rounded-lg border border-brand-border text-sm text-brand-muted hover:text-white hover:border-brand-accent transition"
                >
                  {productContent[id].name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
