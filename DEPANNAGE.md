# Guide de dépannage - IMPULCIA

> Statut: legacy/historique. Se referer a `DEPLOIEMENT_CRM.md` et `REPO_STATUS.md` pour le runbook actif.

## Problème : Le serveur ne démarre pas sur le port 4174

### Solution 1 : Réinstallation complète

1. **Fermer tous les processus Node.js** :
   ```powershell
   Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

2. **Supprimer node_modules et package-lock.json** :
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force package-lock.json
   ```

3. **Réinstaller avec yarn (alternative à npm)** :
   ```powershell
   npm install -g yarn
   yarn install
   yarn dev
   ```

### Solution 2 : Utiliser une version plus récente de Next.js

Modifier `package.json` :
```json
"dependencies": {
  "next": "^15.0.0",
  ...
}
```

Puis :
```powershell
npm install --legacy-peer-deps
npm run dev
```

### Solution 3 : Utiliser un autre port

Modifier `package.json` :
```json
"scripts": {
  "dev": "next dev -p 3002",
  ...
}
```

### Solution 4 : Vérifier manuellement

1. Ouvrir un terminal PowerShell dans le dossier du projet
2. Exécuter : `npm run dev`
3. Vérifier les erreurs affichées dans la console

### Solution 5 : Utiliser Vite au lieu de Next.js (alternative)

Si Next.js continue de poser problème, on peut migrer vers Vite + React qui est plus simple à installer.

## Vérification

Pour vérifier si le serveur tourne :
```powershell
netstat -ano | findstr :4174
```

Si une ligne apparaît, le serveur tourne et le site est accessible sur :
- http://localhost:4174/fr
- http://localhost:4174/en

## ⚠️ Problème identifié

**Node.js v24.11.1 est trop récent** et peut causer des problèmes de compatibilité avec Next.js 14.

### Solution recommandée : Utiliser Node.js v20 LTS

1. **Installer Node.js v20 LTS** depuis https://nodejs.org/
2. Ou utiliser **nvm-windows** pour gérer plusieurs versions :
   ```powershell
   # Installer nvm-windows depuis https://github.com/coreybutler/nvm-windows
   nvm install 20
   nvm use 20
   ```
3. Puis réinstaller les dépendances :
   ```powershell
   npm install --legacy-peer-deps
   npm run dev
   ```

## Contact

Si le problème persiste, vérifier :
- Version de Node.js : `node --version` (recommandé : v18 LTS ou v20 LTS)
- Version de npm : `npm --version`
- Espace disque disponible
- Antivirus qui pourrait bloquer l'installation

