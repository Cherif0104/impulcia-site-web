export type Localized = {
  fr: string;
  en: string;
};

export type ExpertiseBlock = {
  id: string;
  title: Localized;
  summary: Localized;
  capabilities: Localized[];
};

export type TechItem = {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'devops' | 'cyber' | 'data';
  logo: string;
};

export type SectorItem = {
  id: string;
  name: Localized;
  focus: Localized;
};

export const expertiseBlocks: ExpertiseBlock[] = [
  {
    id: 'strategy-governance',
    title: { fr: "Strategie des systemes d'information", en: 'Information systems strategy' },
    summary: {
      fr: 'Cadrage cible, gouvernance des programmes et pilotage portefeuille.',
      en: 'Target architecture framing, program governance and portfolio steering.',
    },
    capabilities: [
      { fr: "Urbanisation des systemes d'information", en: 'Enterprise architecture mapping' },
      { fr: 'Feuille de route 12-24 mois', en: '12-24 month roadmap' },
      { fr: 'PMO de transformation', en: 'Transformation PMO' },
      { fr: 'Conduite du changement', en: 'Change management' },
    ],
  },
  {
    id: 'business-solutions',
    title: { fr: 'Solutions metiers et plateformes', en: 'Business solutions and platforms' },
    summary: {
      fr: 'ERP, CRM, SIRH, operations terrain et workflows metiers integres.',
      en: 'ERP, CRM, HRIS, field operations and integrated business workflows.',
    },
    capabilities: [
      { fr: 'ERP multi-entites', en: 'Multi-entity ERP' },
      { fr: 'CRM & force commerciale', en: 'CRM & sales operations' },
      { fr: 'SIRH et performance RH', en: 'HRIS and people performance' },
      { fr: 'Portails clients et partenaires', en: 'Client and partner portals' },
    ],
  },
  {
    id: 'data-ai',
    title: { fr: 'Data, BI et IA appliquee', en: 'Data, BI and applied AI' },
    summary: {
      fr: 'Collecte fiable, modeles decisionnels et automatisation intelligente.',
      en: 'Reliable data capture, decision models and intelligent automation.',
    },
    capabilities: [
      { fr: 'Data engineering ETL/ELT', en: 'ETL/ELT data engineering' },
      { fr: 'Dashboards executives', en: 'Executive dashboards' },
      { fr: 'Detection d anomalies', en: 'Anomaly detection' },
      { fr: 'Assistants metiers IA', en: 'AI business copilots' },
    ],
  },
  {
    id: 'platform-security',
    title: { fr: 'Cloud, DevOps et cybersecurite', en: 'Cloud, DevOps and cybersecurity' },
    summary: {
      fr: 'Infrastructures resilientes, MLOps/DevSecOps et securite operationnelle.',
      en: 'Resilient infrastructure, MLOps/DevSecOps and operational security.',
    },
    capabilities: [
      { fr: 'Architecture cloud hybride', en: 'Hybrid cloud architecture' },
      { fr: 'CI/CD et observabilite', en: 'CI/CD and observability' },
      { fr: 'IAM, SOC et hardening', en: 'IAM, SOC and hardening' },
      { fr: 'Plan de continuite', en: 'Business continuity planning' },
    ],
  },
];

export const technologyStack: TechItem[] = [
  { id: 'react', name: 'React', category: 'frontend', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'node', name: 'Node.js', category: 'backend', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'python', name: 'Python', category: 'backend', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'laravel', name: 'Laravel', category: 'backend', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'nestjs', name: 'NestJS', category: 'backend', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'redis', name: 'Redis', category: 'database', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'supabase', name: 'Supabase', category: 'database', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'aws', name: 'AWS', category: 'cloud', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'azure', name: 'Azure', category: 'cloud', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'gcp', name: 'Google Cloud', category: 'cloud', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'cloudflare', name: 'Cloudflare', category: 'cloud', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'docker', name: 'Docker', category: 'devops', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'github-actions', name: 'GitHub Actions', category: 'devops', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'terraform', name: 'Terraform', category: 'devops', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'owasp', name: 'OWASP', category: 'cyber', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'vault', name: 'HashiCorp Vault', category: 'cyber', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'wazuh', name: 'Wazuh', category: 'cyber', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'crowdsec', name: 'CrowdSec', category: 'cyber', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'power-bi', name: 'Power BI', category: 'data', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'metabase', name: 'Metabase', category: 'data', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'dbt', name: 'dbt', category: 'data', logo: '/images/technologies/tech-placeholder.svg' },
  { id: 'apache-airflow', name: 'Apache Airflow', category: 'data', logo: '/images/technologies/tech-placeholder.svg' },
];

export const technologyCategoryLabels: Record<TechItem['category'], Localized> = {
  frontend: { fr: 'Frontend', en: 'Frontend' },
  backend: { fr: 'Backend', en: 'Backend' },
  database: { fr: 'Bases de donnees', en: 'Databases' },
  cloud: { fr: 'Cloud', en: 'Cloud' },
  devops: { fr: 'DevOps', en: 'DevOps' },
  cyber: { fr: 'Cybersecurite', en: 'Cybersecurity' },
  data: { fr: 'Data & BI', en: 'Data & BI' },
};

export const sectorsCatalog: SectorItem[] = [
  {
    id: 'public',
    name: { fr: 'Institutions publiques', en: 'Public institutions' },
    focus: { fr: 'Dematerialisation, transparence, performance service public', en: 'Digitization, transparency, public service performance' },
  },
  {
    id: 'donors-ngos',
    name: { fr: 'ONG & bailleurs', en: 'NGOs & donors' },
    focus: { fr: 'Conformite, suivi budgetaire, reporting d impact', en: 'Compliance, budget tracking, impact reporting' },
  },
  {
    id: 'finance-insurance',
    name: { fr: 'Banque, assurance, microfinance', en: 'Banking, insurance, microfinance' },
    focus: { fr: 'Parcours client, risque, efficacite operationnelle', en: 'Customer journeys, risk, operational efficiency' },
  },
  {
    id: 'transport-logistics',
    name: { fr: 'Transport, aviation, logistique', en: 'Transport, aviation, logistics' },
    focus: { fr: 'Pilotage flotte, maintenance, operations en temps reel', en: 'Fleet control, maintenance, real-time operations' },
  },
  {
    id: 'health',
    name: { fr: 'Sante & protection sociale', en: 'Healthcare & social protection' },
    focus: { fr: 'Parcours patient, gestion structures, qualite de service', en: 'Patient journey, facility management, service quality' },
  },
  {
    id: 'education',
    name: { fr: 'Education & formation', en: 'Education & training' },
    focus: { fr: 'Digital campus, suivi pedagogique, gouvernance academique', en: 'Digital campus, learning analytics, academic governance' },
  },
  {
    id: 'energy-utilities',
    name: { fr: 'Energie & utilities', en: 'Energy & utilities' },
    focus: { fr: 'Maintenance infrastructures, intervention terrain, supervision', en: 'Infrastructure maintenance, field interventions, supervision' },
  },
  {
    id: 'real-estate',
    name: { fr: 'Immobilier & patrimoine', en: 'Real estate & assets' },
    focus: { fr: 'Gestion actifs, baux, maintenance et valorisation', en: 'Asset management, leasing, maintenance and valuation' },
  },
];

export const marqueeLabel = {
  fr: 'Defilement continu',
  en: 'Continuous marquee',
};
