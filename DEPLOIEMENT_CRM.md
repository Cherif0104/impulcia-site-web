# Deploiement CRM IMPULCIA

## Variables d'environnement requises

Copier `.env.example` vers `.env.local` puis renseigner:

- `ADMIN_SECRET` (obligatoire): secret admin pour `/fr/admin` et `/en/admin`
- `NEXT_PUBLIC_SUPABASE_URL` (recommande en production)
- `SUPABASE_SERVICE_ROLE_KEY` (recommande en production)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optionnel si service role absent)
- `UPSTASH_REDIS_REST_URL` (obligatoire en production pour anti-abus distribue)
- `UPSTASH_REDIS_REST_TOKEN` (obligatoire en production pour anti-abus distribue)

Sans variables Supabase, le CRM bascule en memoire (non persistant).
Sans variables Upstash:

- en dev/local: fallback memoire autorise
- en production: tout endpoint public sensible avec anti-abus exige Upstash; sinon reponse `503` explicite pour eviter un anti-abus non distribue (actuellement: `/api/leads`, `/api/consent`, `/api/analytics/pageview`)

## Commandes fiables (Windows inclus)

Depuis `D:\DEV & DEVOPS\IMPULCIA AFRIQUE`:

- Dev stable (sans Turbopack): `npm run dev`
- Dev Turbopack (debug uniquement): `npm run dev:turbopack`
- Verification types: `npm run typecheck`
- Build production: `npm run build`
- Start production: `npm run start`

Les scripts utilisent `node ./node_modules/next/dist/bin/next` pour eviter les problemes de resolution de chemin sous Windows avec un dossier contenant `&`.

## Acces admin

- URL: `http://localhost:4174/fr/admin/login` (ou `/en/admin/login`)
- Mot de passe: valeur de `ADMIN_SECRET`
- Session admin stockee en cookie `httpOnly` (`impulcia_admin_session`)

## Checklist mise en production

- [ ] Variables d'environnement configurees (surtout `ADMIN_SECRET`)
- [ ] `npm run typecheck` passe sans erreur
- [ ] `npm run build` passe sans erreur
- [ ] Pages legales accessibles: `/fr/legal`, `/fr/privacy`, `/fr/cookies`
- [ ] Formulaire lead envoie bien vers `/api/leads`
- [ ] Consentement cookies sauvegarde via `/api/consent`
- [ ] `UPSTASH_REDIS_REST_*` configurees en production (obligatoire)
- [ ] Verifier `GET /api/admin/health` retourne `antiAbuse.provider=upstash` et `ok=true`
- [ ] Dashboard admin charge sans erreur (`/fr/admin`)
- [ ] Limitation anti-abus activee sur endpoints publics (429 observe apres spam test)

## Monitoring / alerting operationnel

Health endpoint machine-friendly:

- URL: `GET /api/admin/health`
- Critere de sante: HTTP `< 400` **et** `ok === true`
- Reponse attendue: `status`, `code`, `antiAbuse`, `checks`, `checkedAt`

Script de verification:

- Local: `npm run health:check`
- Cible explicite: `npm run health:check -- https://votre-domaine/api/admin/health`
- Variable optionnelle: `HEALTHCHECK_URL=https://votre-domaine/api/admin/health npm run health:check`

Exemple cron (toutes les 2 minutes):

```bash
*/2 * * * * cd /app && npm run health:check -- https://votre-domaine/api/admin/health || echo "ALERTE: healthcheck KO"
```

Seuils d'alerte recommandes:

- Alerte warning: 2 echecs consecutifs (env. 4 minutes si cron 2 min)
- Alerte critique: 5 echecs consecutifs ou HTTP `>= 500`
- Escalade immediate si payload indique `antiAbuse.provider=memory` en production
