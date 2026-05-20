# Continuité d'exploitation — IMPULCIA

## Objectifs

- **RTO** (délai de reprise) cible : 4 h
- **RPO** (perte de données max) cible : 24 h  
  À valider avec le métier selon criticité CRM.

## Composants critiques

| Composant | Rôle | Reprise |
|-----------|------|---------|
| Vercel | Hébergement Next.js | Rollback deploy ou redeploy commit stable |
| Supabase | Persistance CRM | Restore backup / PITR |
| Upstash | Rate-limit distribué | Recréer instance + mettre à jour env Vercel |
| DNS / domaine | `impulcia-afrique.com` | Registrar + Vercel domains |
| Sentry | Erreurs & alertes | Console Sentry + intégration email/Slack |
| GitHub | Source de vérité code | `main` sur `Cherif0104/impulcia-site-web` |

## Healthcheck

```bash
npm run health:check -- https://impulcia-afrique.com/api/admin/health
```

Critères en production (`ok: true`, HTTP 200) :

- `antiAbuse.provider` = `upstash`
- `persistence.provider` = `supabase`
- `envHealth.ok` = `true`

Cron recommandé (toutes les 2 min) via UptimeRobot, Better Stack ou cron système :

```bash
*/2 * * * * cd /app && npm run health:check -- https://impulcia-afrique.com/api/admin/health || echo "ALERTE health KO"
```

Seuils :

- Warning : 2 échecs consécutifs
- Critique : 5 échecs ou HTTP >= 500
- Escalade immédiate si `persistence.provider=memory` en prod

## Sentry — alertes recommandées

1. Taux d'erreurs 5xx > 1 % sur 15 min
2. Spike sur transactions `POST /api/leads`
3. Nouvelle issue après deploy (régression)
4. Issue non résolue > 24 h sur routes `/api/admin/*`

Variables Vercel : `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`.

## Procédure incident (runbook)

1. Confirmer l'incident : healthcheck + site public + Sentry
2. Consulter les logs Vercel (dernier deploy, erreurs runtime)
3. Si régression deploy : **Rollback** vers le déploiement précédent (Vercel → Deployments)
4. Si base de données : vérifier statut Supabase, puis restore si nécessaire
5. Si rate-limit : vérifier Upstash (quota, token, URL)
6. Communiquer statut interne + horodatage de reprise
7. Post-mortem léger : cause, correctif, action préventive

## Sauvegarde & restauration

### Supabase

- Activer les backups automatiques / PITR selon le plan
- Export manuel mensuel (schéma + données critiques : `leads`, `messages`, `organizations`, etc.)
- Test trimestriel : restaurer sur un **projet staging** et exécuter `npm run health:check` + smoke admin

### Secrets

- Inventaire dans [ACCES_EQUIPE.md](./ACCES_EQUIPE.md)
- Rotation annuelle ou après incident : `ADMIN_SECRET`, `CLIENT_AUTH_SECRET`, clés Supabase service role, Upstash

### Code

- Branche `main` protégée, CI verte avant merge
- Tags de release optionnels pour chaque mise en prod majeure

## Validation post-deploy

```bash
npm run typecheck
npm run build
npm run smoke:api -- https://impulcia-afrique.com
npm run health:check -- https://impulcia-afrique.com/api/admin/health
```

Checklist manuelle :

- [ ] Formulaire lead (`/api/leads`)
- [ ] Login admin `/fr/admin/login`
- [ ] Pages légales `/fr/legal`, `/fr/privacy`, `/fr/cookies`

## CI/CD

GitHub Actions : `.github/workflows/ci.yml` — lint, typecheck, build, smoke API.

En cas d'échec CI : ne pas merger ; corriger avant deploy Vercel.
