# IMPULCIA Website + CRM

[![CI](https://github.com/Cherif0104/impulcia-site-web/actions/workflows/ci.yml/badge.svg)](https://github.com/Cherif0104/impulcia-site-web/actions/workflows/ci.yml)

Site web corporate multilingue (FR/EN) pour IMPULCIA - Ingénierie des solutions informatiques & management de projets numériques.

## 🚀 Technologies

- **Next.js 16** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **next-intl** - Internationalisation (i18n)
- **Framer Motion** - Animations
- **React** - Bibliothèque UI

## 📁 Structure du projet

```
impulcia-website/
├── public/
│   └── locales/          # Fichiers de traduction FR/EN
├── src/
│   ├── app/              # Pages Next.js
│   │   └── [locale]/     # Pages localisées
│   ├── components/        # Composants React
│   │   ├── sections/     # Sections de page
│   │   └── sections/landing/  # Sections landing institutionnelle
│   ├── lib/              # Utilitaires (i18n, routing, theme)
│   └── proxy.ts          # Proxy i18n (Next.js 16)
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement (stable sous Windows)
npm run dev

# Vérifier TypeScript
npm run typecheck

# Build de production
npm run build

# Démarrer en production
npm start
```

## 🌐 Langues

Le site supporte deux langues :
- **Français (fr)** - Langue par défaut
- **Anglais (en)**

Les URLs sont automatiquement préfixées par la locale : `/fr/` ou `/en/`

## 🎨 Variantes de thème

Trois variantes de thème disponibles :
- **Institutionnel** (par défaut) - Bleu profond, corporate
- **Startup** - Couleurs vives, dynamique
- **Corporate Premium** - Noir/blanc/or, élégant

## 📄 Pages

- `/` - Page d'accueil
- `/landing` - Landing page institutionnelle complète
- `/services` - Services & Solutions
- `/about` - À propos
- `/partnerships` - Partenariats
- `/contact` - Contact

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env.local` depuis `.env.example`.

Variables minimales (voir `.env.example`) :
- `ADMIN_SECRET` + `CLIENT_AUTH_SECRET` (distincts, >= 32 caractères en production)
- `ADMIN_ENFORCE_ROLES=true` en production
- `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (obligatoire en production)
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (obligatoire en production)
- `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` (recommandé en production)
- `NEXT_PUBLIC_APP_URL` — **obligatoire en production** pour les URL canoniques, le sitemap (`/sitemap.xml`), `robots.txt` et les balises Open Graph (ex. `https://impulcia-afrique.com`)

### SEO

- Métadonnées par page : `public/locales/{fr,en}/seo.json` + helpers `src/lib/seo/`
- Sitemap : `/sitemap.xml` — généré depuis `src/app/sitemap.ts`
- Robots : `/robots.txt` — admin et espaces client exclus de l’indexation
- JSON-LD `Organization` / `WebSite` injecté dans le layout `[locale]`

### Traductions

Les traductions sont dans `public/locales/[locale]/` :
- `common.json` - Textes communs
- `sections.json` - Sections principales
- `landing.json` - Landing page institutionnelle
- `homepage.json` - Page d'accueil
- `founder-story.json` - Storytelling fondateur
- `seo.json` - Titres et descriptions SEO par page

## 📝 Scripts

- `npm run dev` - Développement
- `npm run build` - Build production
- `npm run start` - Production
- `npm run lint` - Linter
- `npm run typecheck` - Verification TypeScript
- `npm run health:check` - Check operationnel `/api/admin/health` (exit non-0 si KO)
- `npm run smoke:api` - Tests smoke API (base URL optionnelle en argument)

## 🚀 Déploiement

Le site est prêt pour le déploiement sur :
- Vercel (recommandé)
- Netlify
- Tout hébergeur Node.js

## 📞 Contact

Pour toute question ou contribution, contactez l'équipe IMPULCIA.

## 📦 Exploitation CRM

Guide opérationnel complet: `DEPLOIEMENT_CRM.md`

Gouvernance nettoyage / zones actives vs legacy: `docs/governance/CLEANUP_REPO.md`

Etat du repository (actif vs legacy + plan): `REPO_STATUS.md`

Monitoring/alerting health (cron/uptime + seuils): voir section dediee dans `DEPLOIEMENT_CRM.md`

Continuité / PRA / accès équipe: `docs/ops/CONTINUITE.md`, `docs/ops/ACCES_EQUIPE.md`

---

© 2024 IMPULCIA. Tous droits réservés.

