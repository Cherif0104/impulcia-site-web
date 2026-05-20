# Images a produire - Site Enterprise IMPULCIA

## Objectif

Renforcer la qualite visuelle B2B des pages enterprise avec des visuels coherents dark theme, tout en gardant des performances stables, des textes alternatifs clairs en francais et des noms de fichiers predictibles.

## Convention de nommage

- Format: `kebab-case`
- Dossier cible: `public/images/placeholders/`
- Format actuel: `svg` (placeholders brandes, legers, prets a remplacer par des rendus IA HD ulterieurs)

## Priorites de production

### P0 - A deployer immediatement

| Section | Fichier | Dimensions | Alt FR | Prompt source |
| --- | --- | --- | --- | --- |
| Hero enterprise | `hero-enterprise.svg` | 1600x900 | `Vision strategique de transformation SI pour les grandes organisations` | `Illustration hero B2B dark mode, transformation digitale en Afrique, dashboard moderne, accents teal et gold, style premium, sans personnes identifiables.` |
| Portefeuille produits | `products-portfolio.svg` | 1600x900 | `Panorama des solutions IMPULCIA et de leurs cas d'usage` | `Visualisation produit enterprise avec cartes modules, ton institutionnel, fond sombre, hierarchie claire, labels lisibles.` |
| Etudes de cas | `case-studies-impact.svg` | 1600x900 | `Synthese visuelle des cas clients et impacts mesurables` | `Grid de case studies B2B, focus impact KPI, style dark, contrastes eleves, design sobre.` |
| Defis et reponses | `challenges-response.svg` | 1600x900 | `Comparatif des defis operationnels et des reponses IMPULCIA` | `Split before/after pour transformation SI, colonne defis et colonne solutions, couleurs rouge discret et teal.` |
| Methodologie | `methodology-roadmap.svg` | 1600x900 | `Roadmap en cinq etapes pour le delivery de transformation` | `Roadmap 5 etapes enterprise, timeline horizontale, dark UI, style conseil strategie.` |

### P1 - Recommande (realise dans ce lot)

| Section | Fichier | Dimensions | Alt FR | Prompt source |
| --- | --- | --- | --- | --- |
| Modules ERP | `modules-landscape.svg` | 1600x900 | `Vue d'ensemble des modules ERP et de leurs interactions` | `Landscape modules ERP finance RH achats operations, architecture claire, design dark enterprise.` |
| Secteurs cibles | `industries-sectors.svg` | 1600x900 | `Cartographie des parcours sectoriels couverts par IMPULCIA` | `Matrice industries enterprise, cartes sectorielles, style professionnel minimal.` |
| Technologies | `technologies-stack.svg` | 1600x900 | `Architecture technologique interoperable et moderne` | `Tech stack enterprise en couches, connecteurs, couleurs marque teal gold, fond navy.` |
| ABM Grands Comptes | `abm-enterprise.svg` | 1200x675 | `Visuel de pilotage multi-filiales pour grands comptes` | `ABM enterprise card, multi subsidiaries, governance dashboard, dark premium.` |
| ABM Institutions | `abm-institution.svg` | 1200x675 | `Visuel de modernisation des services publics et transparence` | `ABM institution visual, public services digitization, traceability, dark UI.` |
| ABM Bailleurs | `abm-donor.svg` | 1200x675 | `Visuel de pilotage des programmes bailleurs et conformite` | `ABM donor visual, KPI program tracking, compliance reporting, dark mode.` |

### P2 - Backlog evolutif

| Section | Fichier suggere | Dimensions | Alt FR | Prompt source |
| --- | --- | --- | --- | --- |
| A propos / equipe | `about-team-trust.svg` | 1600x900 | `Equipe conseil et execution orientee resultat` | `Team credibility enterprise, trust and execution, editorial dark.` |
| Partenaires & ecosysteme | `partners-ecosystem.svg` | 1600x900 | `Ecosysteme de partenaires et references sectorielles` | `Partner ecosystem map, B2B logos context, subtle dark gradient.` |
| CTA final | `cta-diagnostic.svg` | 1600x900 | `Invitation a lancer un diagnostic de transformation` | `Call-to-action enterprise diagnostic, clean composition, high contrast.` |

## Fallback et robustesse

- Fallback global disponible: `visual-default.svg`
- Si un visuel est absent ou en erreur, les sections utilisent automatiquement ce fallback.
- Les alt texts restent explicites et orientes sens metier (pas de `image` generique).

## Notes de remplacement futur (IA HD)

- Les placeholders peuvent etre remplaces a fichier identique (meme nom) sans toucher au code.
- Conserver:
  - ratio (1600x900 ou 1200x675),
  - contraste sombre,
  - lisibilite en mobile,
  - style B2B sobre (sans surcharge decorative).
