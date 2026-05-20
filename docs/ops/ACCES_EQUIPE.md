# Registre d'accès équipe — IMPULCIA

> Remplir les propriétaires réels. Ne pas committer de mots de passe dans ce fichier.

## Matrice des accès

| Service | URL / ressource | Propriétaire principal | Backup | Notes |
|---------|-----------------|------------------------|--------|-------|
| GitHub | `Cherif0104/impulcia-site-web` | _à renseigner_ | _à renseigner_ | Branch `main`, CI Actions |
| Vercel | Projet site + domaine | _à renseigner_ | _à renseigner_ | Env vars production |
| Supabase | Projet CRM / Postgres | _à renseigner_ | _à renseigner_ | Service role = secret critique |
| Upstash | Redis REST rate-limit | _à renseigner_ | _à renseigner_ | Obligatoire en prod |
| Registrar DNS | `impulcia-afrique.com` | _à renseigner_ | _à renseigner_ | Pointe vers Vercel |
| Sentry | Org / projet erreurs | _à renseigner_ | _à renseigner_ | Alertes 5xx + régressions |
| Resend (optionnel) | Emails transactionnels | _à renseigner_ | — | `RESEND_API_KEY` |

## Variables sensibles (Vercel Production)

| Variable | Rotation |
|----------|----------|
| `ADMIN_SECRET` | Annuelle / incident |
| `CLIENT_AUTH_SECRET` | Annuelle / incident (distinct de admin) |
| `SUPABASE_SERVICE_ROLE_KEY` | Selon politique Supabase |
| `UPSTASH_REDIS_REST_TOKEN` | Annuelle |
| `SENTRY_AUTH_TOKEN` | Annuelle |

## Procédure de relève

1. Transférer l'accès **Owner/Admin** sur GitHub, Vercel, Supabase
2. Partager les secrets via gestionnaire de mots de passe d'équipe (1Password, Bitwarden, etc.)
3. Vérifier `npm run health:check` sur la prod
4. Mettre à jour ce document avec les nouveaux noms

## Contacts incident

| Rôle | Nom | Contact |
|------|-----|---------|
| Tech lead | _à renseigner_ | |
| Ops / infra | _à renseigner_ | |
| Métier / produit | _à renseigner_ | |
