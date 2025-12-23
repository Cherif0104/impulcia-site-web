# ✅ CHECKLIST DE DÉPLOIEMENT - Résolution des erreurs 404

## 🔍 Diagnostic des erreurs 404

Les pages suivantes retournent une erreur 404 :
- ❌ `/ingenierie.html`
- ❌ `/secteurs.html`
- ❌ `/ia-automatisation.html`
- ❌ `/offres.html`
- ❌ `/abonnements-catalogue.html`

## 📋 Vérifications à effectuer

### 1. Vérifier que les fichiers sont déployés

Assurez-vous que tous ces fichiers sont présents sur le serveur dans le répertoire racine :

```
/
├── index.html ✅
├── ingenierie.html ✅
├── secteurs.html ✅
├── ia-automatisation.html ✅
├── offres.html ✅
├── abonnements-catalogue.html ✅
├── style.css ✅
├── main.js ✅
├── .htaccess ✅
└── assets/
    ├── logo-impulcia.jpg ✅
    └── hero-dashboard.png ✅
```

### 2. Vérifier les permissions des fichiers

Sur un serveur Linux/Apache, les fichiers doivent avoir les permissions suivantes :
```bash
chmod 644 *.html
chmod 644 *.css
chmod 644 *.js
chmod 755 assets/
chmod 644 assets/*
```

### 3. Vérifier la configuration du serveur

#### Si hébergement Apache (O2SWITCH, Hostinger, etc.)

1. **Vérifier que mod_rewrite est activé**
   - Le fichier `.htaccess` doit être dans le répertoire racine
   - Vérifier dans le panneau d'administration que `mod_rewrite` est activé

2. **Vérifier le répertoire de déploiement**
   - Les fichiers doivent être dans le répertoire `public_html/` ou `www/` ou `htdocs/`
   - Vérifier le chemin exact dans votre panneau d'hébergement

3. **Tester l'accès direct**
   - Essayer d'accéder directement : `https://impulcia-afrique.com/ingenierie.html`
   - Si ça fonctionne, le problème vient des liens
   - Si ça ne fonctionne pas, le fichier n'est pas déployé

#### Si hébergement Netlify

1. **Utiliser le fichier `_redirects`**
   - Le fichier `_redirects` doit être dans le répertoire racine
   - Netlify le détectera automatiquement

2. **Vérifier le build**
   - Dans Netlify, vérifier que tous les fichiers HTML sont dans le dossier de build

#### Si hébergement Vercel

1. **Utiliser le fichier `vercel.json`**
   - Le fichier `vercel.json` doit être dans le répertoire racine
   - Vercel le détectera automatiquement

### 4. Vérifier les chemins des liens

Tous les liens dans `index.html` utilisent des chemins absolus avec `/` :
- ✅ `/ingenierie.html`
- ✅ `/secteurs.html`
- ✅ `/ia-automatisation.html`
- ✅ `/offres.html`
- ✅ `/abonnements-catalogue.html`

Ces chemins sont corrects pour un déploiement en production.

## 🔧 Solutions selon l'hébergeur

### Solution 1 : O2SWITCH / Apache classique

1. **Uploader tous les fichiers HTML** via FTP/SFTP dans le répertoire `public_html/`
2. **Vérifier que `.htaccess` est présent** et lisible
3. **Tester l'accès direct** à chaque fichier
4. **Vérifier les logs d'erreur** dans le panneau d'administration

### Solution 2 : Netlify

1. **Connecter le dépôt GitHub** à Netlify
2. **Configurer le build** :
   - Build command : (laisser vide pour site statique)
   - Publish directory : `/` (racine)
3. **Vérifier que `_redirects` est déployé**

### Solution 3 : Vercel

1. **Connecter le dépôt GitHub** à Vercel
2. **Vérifier que `vercel.json` est présent**
3. **Déployer automatiquement**

## 🚨 Actions immédiates

1. **Vérifier via FTP/SFTP** que tous les fichiers HTML sont bien présents sur le serveur
2. **Tester l'accès direct** à chaque URL :
   - `https://impulcia-afrique.com/ingenierie.html`
   - `https://impulcia-afrique.com/secteurs.html`
   - `https://impulcia-afrique.com/ia-automatisation.html`
   - `https://impulcia-afrique.com/offres.html`
   - `https://impulcia-afrique.com/abonnements-catalogue.html`
3. **Vérifier les logs d'erreur** du serveur pour voir pourquoi les fichiers ne sont pas trouvés
4. **Contacter le support de l'hébergeur** si le problème persiste

## 📝 Notes importantes

- Les fichiers existent bien dans le dépôt Git
- Les liens dans le code sont corrects
- Le problème est probablement au niveau du déploiement ou de la configuration serveur
- Si vous utilisez un CDN (Cloudflare), vérifier aussi la configuration là-bas

---

**Dernière mise à jour** : Décembre 2025
