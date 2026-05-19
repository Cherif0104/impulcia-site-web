# REPO STATUS

## Chemins actifs pour la production

- `src/app/[locale]/**`: pages publiques et admin du CRM.
- `src/app/api/leads/route.ts`: collecte lead.
- `src/app/api/consent/route.ts`: consentement cookies.
- `src/app/api/analytics/pageview/route.ts`: analytics consenti.
- `src/app/api/admin/health/route.ts`: health machine-friendly pour monitoring/alerting.
- `src/app/api/admin/**`: API backoffice CRM.
- `src/lib/anti-abuse.ts`: rate-limit distribue (Upstash en production).
- `src/lib/db/**`: persistance CRM.
- `public/locales/**`: i18n FR/EN actif.

## Chemins legacy / a surveiller

- `DEPANNAGE.md`: guide historique avec hypotheses obsoletes (versions Next/Node anciennes).
- `.htaccess` (supprime du repo): reliquat d'hebergement legacy Apache, non requis pour Next.js runtime actuel.
- Toute zone hors `src/app`, `src/lib`, `src/components`, `public/locales` doit etre consideree comme candidate legacy jusqu'a validation d'usage.

## Avancement concret (progressif, non destructif)

- Scan des endpoints `src/app/api/**` realise: endpoints publics sensibles identifies = `POST /api/leads`, `POST /api/consent`, `POST /api/analytics/pageview`.
- Politique "prod strict Upstash" confirmee sur tous les endpoints publics sensibles existants; pas d'autre endpoint public sensible detecte a ce stade.
- Endpoints admin proteges (`/api/admin/**`) exclus de l'anti-abus public par defaut, sauf besoin specifique.
- Signalisation perimetre actif renforcee via healthcheck operationnel (`scripts/health-check.mjs`) et documentation d'exploitation.
- Deplacement de code legacy evite tant que les references runtime/imports ne sont pas confirmees (strategie safe pour ne pas casser le CRM actif).

## Gouvernance docs (actif vs legacy)

- Documentation de gouvernance active: `docs/governance/CLEANUP_REPO.md`.
- Fichier racine `CLEANUP_REPO.md`: conservé comme point d'entree historique et redirection.

## Plan de suppression progressive (safe)

1. Inventorier les references runtime/imports vers les fichiers suspects legacy.
2. Marquer les candidats avec statut `legacy-candidate` en doc avant tout deplacement.
3. Deplacer d'abord les documents non executables vers `legacy/docs/` avec fichiers de redirection.
4. Sur un sprint suivant, supprimer uniquement les candidats sans references confirmees.
5. Revalider `typecheck`, `lint`, `build` et smoke test CRM avant chaque suppression.
