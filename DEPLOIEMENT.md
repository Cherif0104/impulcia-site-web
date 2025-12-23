# 🚀 Guide de Déploiement - IMPULCIA AFRIQUE

## 🌐 Domaine de Production

**URL principale** : `https://impulcia-afrique.com/`

### Configuration des URLs

Toutes les URLs canoniques et Open Graph ont été configurées pour utiliser le domaine `https://impulcia-afrique.com/` (sans www).

---

## 📋 Pages Disponibles

1. **Page d'accueil** : `https://impulcia-afrique.com/`
2. **Ingénierie** : `https://impulcia-afrique.com/ingenierie.html`
3. **Secteurs** : `https://impulcia-afrique.com/secteurs.html`
4. **IA & Automatisation** : `https://impulcia-afrique.com/ia-automatisation.html`
5. **Offres** : `https://impulcia-afrique.com/offres.html`
6. **Marketplace** : `https://impulcia-afrique.com/abonnements-catalogue.html`

---

## 🔄 Redirections Configurées

### Fichier `.htaccess`

Le fichier `.htaccess` a été créé avec les redirections suivantes :

1. **Redirection www → non-www** (301)
   - `https://www.impulcia-afrique.com/` → `https://impulcia-afrique.com/`

2. **Redirection HTTP → HTTPS** (301)
   - `http://impulcia-afrique.com/` → `https://impulcia-afrique.com/`

### Configuration Apache requise

- Module `mod_rewrite` activé
- Module `mod_deflate` activé (pour compression GZIP)
- Module `mod_expires` activé (pour cache des fichiers statiques)

---

## 📝 Meta Tags SEO Configurés

Toutes les pages principales incluent maintenant :

- ✅ **Canonical URL** : URL canonique unique pour chaque page
- ✅ **Open Graph** : Meta tags pour le partage sur réseaux sociaux
  - `og:type`
  - `og:locale` (fr_SN)
  - `og:site_name`
  - `og:title`
  - `og:description`
  - `og:url`
  - `og:image` (logo IMPULCIA)

---

## 🔗 Liens Internes

Tous les liens internes utilisent des chemins relatifs avec `/` :
- ✅ `/ingenierie.html`
- ✅ `/secteurs.html`
- ✅ `/ia-automatisation.html`
- ✅ `/offres.html`
- ✅ `/abonnements-catalogue.html`
- ✅ `/assets/logo-impulcia.jpg`
- ✅ `/style.css`
- ✅ `/main.js`

Ces chemins fonctionnent correctement avec le domaine de production.

---

## 📦 Structure des Assets

```
/
├── index.html
├── ingenierie.html
├── secteurs.html
├── ia-automatisation.html
├── offres.html
├── abonnements-catalogue.html
├── style.css
├── main.js
├── .htaccess
└── assets/
    ├── logo-impulcia.jpg
    └── hero-dashboard.png
```

---

## ✅ Checklist de Déploiement

- [x] URLs canoniques configurées
- [x] Open Graph tags ajoutés
- [x] Fichier `.htaccess` créé
- [x] Redirections www → non-www configurées
- [x] Redirections HTTP → HTTPS configurées
- [x] Compression GZIP activée
- [x] Cache des fichiers statiques configuré
- [x] Liens internes vérifiés
- [x] Meta tags SEO sur toutes les pages principales

---

## 🛠️ Optimisations Incluses

### Performance
- Compression GZIP pour fichiers texte, CSS, JS
- Cache des images et fichiers statiques (1 an)
- Cache des CSS/JS (1 mois)

### Sécurité
- Protection des fichiers sensibles (.htaccess, .log, .sql, etc.)
- Redirection HTTPS forcée

### SEO
- URLs canoniques uniques
- Meta descriptions optimisées
- Open Graph pour réseaux sociaux
- Structure sémantique HTML5

---

## 📧 Support

Pour toute question concernant le déploiement, consultez la documentation du serveur ou contactez l'équipe technique.

---

**Dernière mise à jour** : Décembre 2025
