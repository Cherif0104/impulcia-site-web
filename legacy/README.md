# Legacy Area

Ce dossier est reserve a l'isolation progressive des artefacts non actifs en production.

Regles:

- Ne deplacer ici qu'un fichier clairement non utilise au runtime.
- Laisser un fichier de redirection a l'ancien emplacement pour eviter les liens casses.
- Revalider `npm run typecheck`, `npm run lint`, `npm run build` apres chaque deplacement.
