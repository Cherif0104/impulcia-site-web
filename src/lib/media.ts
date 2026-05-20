/** Chemins publics des médias (logos partenaires & produits) */
export const brandLogo = '/images/brand/impulcia.png';

const PRODUCT_FALLBACK = '/images/brand/impulcia-alt.png';
const PARTNER_FALLBACK = '/images/brand/impulcia-alt.png';
const PARTNER_PLACEHOLDER = '/images/partners/partner-placeholder.svg';

export const productLogos: Record<string, string> = {
  coya: '/images/products/coya.png',
  sentrajet: '/images/products/sentrajet.png',
  mbourake: '/images/products/mbourake.png',
  patrimo: '/images/products/patrimo.png',
  sunugest: '/images/products/sunugest.png',
};

export const partnerLogos: { id: string; name: string; src: string }[] = [
  { id: 'royal-air-maroc', name: 'Royal Air Maroc', src: '/images/partners/partner-6.png' },
  { id: 'air-senegal', name: 'Air Senegal', src: '/images/partners/partner-11.png' },
  { id: 'bnm', name: 'Banque Nationale de Mauritanie', src: '/images/partners/partner-1.png' },
  { id: 'engie', name: 'ENGIE', src: '/images/partners/partner-5.png' },
  { id: 'ong-concept', name: 'ONG Concept', src: '/images/partners/partner-2.png' },
  { id: 'crea-amenagement', name: 'CREA Amenagement', src: '/images/partners/partner-3.png' },
  { id: 'cerip', name: 'CERIP Senegal', src: '/images/partners/cerip.png' },
  { id: 'majorel', name: 'Majorel', src: '/images/partners/majorel.png' },
  { id: 'enedis', name: 'Enedis', src: '/images/partners/partner-4.png' },
  { id: 'ctm', name: 'CTM', src: '/images/partners/partner-9.png' },
  { id: 'selectra', name: 'Selectra', src: '/images/partners/partner-8.png' },
  { id: 'sitel-group', name: 'Sitel Group', src: '/images/partners/partner-12.png' },
  { id: 'senelec', name: 'SENELEC', src: PARTNER_PLACEHOLDER },
  { id: 'onfp', name: 'ONFP', src: PARTNER_PLACEHOLDER },
  { id: 'ministere-finances', name: 'Ministere des Finances', src: PARTNER_PLACEHOLDER },
  { id: 'city-transport', name: 'Urban Mobility Network', src: PARTNER_PLACEHOLDER },
  { id: 'regional-health', name: 'Regional Health Program', src: PARTNER_PLACEHOLDER },
  { id: 'energy-grid', name: 'Energy Grid Utility', src: PARTNER_PLACEHOLDER },
];

export const heroSlides = [
  '/images/hero/erp-enterprise-platform.png',
  '/images/hero/crm-sales-intelligence.png',
  '/images/hero/sirh-hr-platform.png',
  '/images/hero/data-business-intelligence.png',
  '/images/hero/cloud-infrastructure.png',
  '/images/hero/mobile-ecosystem.png',
] as const;

export const enterpriseSectionVisuals: Record<string, string> = {
  hero: '/images/placeholders/hero-enterprise.svg',
  products: '/images/placeholders/products-portfolio.svg',
  caseStudies: '/images/placeholders/case-studies-impact.svg',
  challenges: '/images/placeholders/challenges-response.svg',
  methodology: '/images/placeholders/methodology-roadmap.svg',
  modules: '/images/placeholders/modules-landscape.svg',
  industries: '/images/placeholders/industries-sectors.svg',
  technologies: '/images/placeholders/technologies-stack.svg',
  coya: '/images/placeholders/coya-overview.svg',
  expertise: '/images/placeholders/expertise-domains.svg',
  aiCapabilities: '/images/placeholders/ai-capabilities.svg',
  serviceOffer: '/images/placeholders/service-offer-landscape.svg',
  serviceAudit: '/images/placeholders/service-offer-landscape.svg',
  serviceScoping: '/images/placeholders/service-offer-landscape.svg',
  serviceArchitecture: '/images/placeholders/service-offer-landscape.svg',
  productSolution: '/images/placeholders/product-solution-canvas.svg',
  abmEnterprise: '/images/placeholders/abm-enterprise.svg',
  abmInstitution: '/images/placeholders/abm-institution.svg',
  abmDonor: '/images/placeholders/abm-donor.svg',
  default: '/images/placeholders/visual-default.svg',
};

function normalizeKey(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function getProductLogo(id: string): string | null {
  const normalized = normalizeKey(id);
  if (productLogos[normalized]) return productLogos[normalized];
  return null;
}

export function getPartnerLogoSrc(src?: string | null): string {
  if (src && src.trim()) return src;
  return PARTNER_FALLBACK;
}

export function getProductFallbackLogo(): string {
  return PRODUCT_FALLBACK;
}

export function getEnterpriseSectionVisual(key: string): string {
  return enterpriseSectionVisuals[key] ?? enterpriseSectionVisuals.default;
}
