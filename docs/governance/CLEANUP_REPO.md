# Nettoyage et gouvernance du repository

## Perimetre actif (a ne pas casser)

- Homepage enterprise active (contenu marketing principal)
- CRM phase 1: admin, leads, messages, faq, consent, analytics
- API publiques actives: `/api/leads`, `/api/consent`, `/api/analytics/pageview`
- i18n actif (FR/EN) via `next-intl` et `src/proxy.ts`

## Zones techniques non metier (artefacts)

Ces fichiers ne doivent pas etre commités:

- Builds et cache Next.js (`.next/`)
- Caches outils (`.cache/`, `.turbo/`)
- Fichiers temporaires (`tmp/`, `temp/`)
- Logs (`*.log`, `npm-debug.log*`, `yarn-error.log*`, etc.)
- Fichiers d'environnement locaux (`.env`, `.env*.local`)

## Regles de contribution

- Ne pas melanger cleanup technique et evolutions fonctionnelles CRM dans le meme lot.
- Tout changement d'infra (rate-limit, proxy, config) doit conserver les routes CRM existantes.
- Ajouter toute nouvelle zone legacy dans un dossier explicite (`legacy/` ou `archive/`) avec un README local.
- Avant merge: executer `npm run typecheck`, `npm run lint`, `npm run build`.

## Politique legacy

- Ne supprimer un fichier legacy que s'il est clairement hors runtime actif et non reference.
- Si un doute existe, isoler/documenter au lieu de supprimer.
