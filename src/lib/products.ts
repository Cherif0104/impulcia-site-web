export type ProductId = 'coya' | 'sentrajet' | 'patrimo' | 'sunugest' | 'mbourake';

export type LocalizedText = {
  fr: string;
  en: string;
};

export type ProductContent = {
  id: ProductId;
  name: string;
  tagline: LocalizedText;
  value: LocalizedText;
  features: LocalizedText[];
  useCases: LocalizedText[];
  proof: {
    metric: string;
    label: LocalizedText;
  };
};

export const productOrder: ProductId[] = ['coya', 'sentrajet', 'patrimo', 'sunugest', 'mbourake'];

export const productContent: Record<ProductId, ProductContent> = {
  coya: {
    id: 'coya',
    name: 'COYA ERP',
    tagline: {
      fr: 'ERP de gouvernance pour organisations africaines',
      en: 'Governance ERP for African organizations',
    },
    value: {
      fr: 'Pilotez finance, RH, logistique, projets et conformité dans une plateforme unifiée.',
      en: 'Run finance, HR, logistics, projects and compliance from one unified platform.',
    },
    features: [
      { fr: 'Gestion financière et budgétaire', en: 'Finance and budget control' },
      { fr: 'RH, contrats et évaluations', en: 'HR, contracts and performance reviews' },
      { fr: 'Workflows de validation hiérarchique', en: 'Hierarchical approval workflows' },
      { fr: 'GED et traçabilité documentaire', en: 'Document management and traceability' },
    ],
    useCases: [
      { fr: 'Ministères et institutions publiques', en: 'Ministries and public institutions' },
      { fr: 'ONG multi-projets et bailleurs', en: 'Multi-project NGOs and donors' },
      { fr: 'PME en structuration opérationnelle', en: 'SMEs scaling operations' },
    ],
    proof: {
      metric: '360°',
      label: { fr: 'Pilotage organisationnel intégré', en: 'Integrated organizational control' },
    },
  },
  sentrajet: {
    id: 'sentrajet',
    name: 'SenTrajet',
    tagline: {
      fr: 'Plateforme de mobilité et exploitation transport',
      en: 'Mobility and transport operations platform',
    },
    value: {
      fr: 'Suivez les trajets, optimisez les ressources et sécurisez les opérations terrain.',
      en: 'Track trips, optimize resources and secure field operations in real time.',
    },
    features: [
      { fr: 'Géolocalisation temps réel', en: 'Real-time geolocation' },
      { fr: 'Planification de trajets et missions', en: 'Trip and mission planning' },
      { fr: 'Suivi carburant et maintenance', en: 'Fuel and maintenance tracking' },
      { fr: 'Tableaux de bord d’exploitation', en: 'Operations dashboards' },
    ],
    useCases: [
      { fr: 'Opérateurs transport urbain', en: 'Urban transport operators' },
      { fr: 'Directions logistiques multi-sites', en: 'Multi-site logistics departments' },
      { fr: 'Flottes institutionnelles', en: 'Institutional fleets' },
    ],
    proof: {
      metric: '24/7',
      label: { fr: 'Supervision continue des trajets', en: 'Continuous trip supervision' },
    },
  },
  patrimo: {
    id: 'patrimo',
    name: 'Patrimo',
    tagline: {
      fr: 'Gestion immobilière et patrimoine',
      en: 'Real estate and asset management',
    },
    value: {
      fr: 'Centralisez vos actifs, baux et opérations de maintenance avec visibilité financière.',
      en: 'Centralize assets, leases and maintenance operations with financial visibility.',
    },
    features: [
      { fr: 'Inventaire des biens et sites', en: 'Property and site inventory' },
      { fr: 'Cycle de vie des baux', en: 'Lease lifecycle management' },
      { fr: 'Maintenance préventive et curative', en: 'Preventive and corrective maintenance' },
      { fr: 'Reporting patrimonial consolidé', en: 'Consolidated asset reporting' },
    ],
    useCases: [
      { fr: 'Foncières et opérateurs immobiliers', en: 'Real estate operators' },
      { fr: 'Groupes multi-filiales', en: 'Multi-subsidiary groups' },
      { fr: 'Patrimoine public et parapublic', en: 'Public and para-public assets' },
    ],
    proof: {
      metric: '+50',
      label: { fr: 'Actifs pilotables dans un référentiel unique', en: 'Manageable assets in a single registry' },
    },
  },
  sunugest: {
    id: 'sunugest',
    name: 'SunuGest',
    tagline: {
      fr: 'Back-office cloud et workflows métiers',
      en: 'Cloud back-office and business workflows',
    },
    value: {
      fr: 'Structurez les flux documentaires et processus internes pour accélérer l’exécution.',
      en: 'Structure document flows and internal processes to accelerate execution.',
    },
    features: [
      { fr: 'GED cloud sécurisée', en: 'Secure cloud DMS' },
      { fr: 'Workflows métiers configurables', en: 'Configurable business workflows' },
      { fr: 'Contrôle des accès par rôle', en: 'Role-based access control' },
      { fr: 'Historique et audit des actions', en: 'Action history and audit trail' },
    ],
    useCases: [
      { fr: 'Back-offices administratifs', en: 'Administrative back-offices' },
      { fr: 'Services partagés', en: 'Shared service centers' },
      { fr: 'Organisations en digitalisation documentaire', en: 'Organizations digitizing documents' },
    ],
    proof: {
      metric: '99.9%',
      label: { fr: 'Disponibilité cible des opérations cloud', en: 'Target cloud operations availability' },
    },
  },
  mbourake: {
    id: 'mbourake',
    name: 'Mbouraké',
    tagline: {
      fr: 'Plateforme services locaux et engagement communautaire',
      en: 'Local services and community engagement platform',
    },
    value: {
      fr: 'Reliez institutions, citoyens et prestataires via une expérience mobile simple.',
      en: 'Connect institutions, citizens and providers through a simple mobile experience.',
    },
    features: [
      { fr: 'Marketplace de services locaux', en: 'Local services marketplace' },
      { fr: 'Gestion des demandes citoyennes', en: 'Citizen request management' },
      { fr: 'Tableaux de bord d’impact', en: 'Impact dashboards' },
      { fr: 'Notifications et campagnes ciblées', en: 'Notifications and targeted campaigns' },
    ],
    useCases: [
      { fr: 'Collectivités territoriales', en: 'Local authorities' },
      { fr: 'Programmes de développement', en: 'Development programs' },
      { fr: 'Écosystèmes communautaires', en: 'Community ecosystems' },
    ],
    proof: {
      metric: '10+',
      label: { fr: 'Secteurs adressables par le modèle', en: 'Addressable sectors through the model' },
    },
  },
};
