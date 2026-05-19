# Multi-organisation CRM V1

## Objectif

V1 introduit un socle multi-organisation pragmatique dans le CRM admin existant:

- une organisation mere peut piloter plusieurs organisations clientes;
- chaque client peut avoir un ou plusieurs workspaces;
- les demandes (tickets) et interactions sont rattachees a un workspace;
- les offres de recrutement sont gerees dans l admin puis exposees au site public.

## Modele de donnees V1

Migration: `supabase/migrations/20260519201000_multi_org_v1.sql`

Tables ajoutees:

- `organizations` (`type`: `parent|client`, `parent_org_id`)
- `workspaces` (espace client operationnel)
- `users_profiles` (profil collaborateur minimal)
- `memberships` (role + scope org/workspace)
- `requests` (tickets clients)
- `request_interactions` (journal de suivi)
- `job_offers` (publie/non publie)

## RBAC V1

- garde-fou role simple sur routes admin critiques via `hasRequiredAdminRole()`;
- role lu depuis cookie `impulcia_admin_role` (defaut `ADMIN_DEFAULT_ROLE`, sinon `owner`);
- enforcement active seulement si `ADMIN_ENFORCE_ROLES=true|1` (fallback permissif sinon).

Ce mecanisme est volontairement simple pour eviter une re-ecriture complete de l auth.

## Surface fonctionnelle livree

Admin:

- `Organizations`: liste + creation
- `Workspaces/Clients`: liste + creation
- `Demandes`: creation + mise a jour statut + ajout interaction
- `Equipe & roles`: visualisation memberships + affectation role
- `Recrutement`: creation, publication/depublication, suppression d offres

Public:

- page `Careers` (`/[locale]/careers`) affichant les offres publiees.

API V1:

- admin `organizations`, `workspaces`, `requests`, `memberships`, `job-offers`
- public `POST /api/requests` (anti-abuse) et `GET /api/job-offers`

## Limites connues (phase suivante)

- pas encore de portail client authentifie par workspace;
- pas de policies RLS fines par membre/workspace (tables en RLS activees, policies a definir);
- pas de workflow complet ticketing (SLA, notifications, pieces jointes, timeline enrichie);
- pas de permissions dynamiques par ressource (matrice role/permission avancee).
