/** Chemins publics des médias (logos partenaires & produits) */
export const brandLogo = '/images/brand/impulcia.png';

const PRODUCT_FALLBACK = '/images/brand/impulcia-alt.png';
const PARTNER_FALLBACK = '/images/brand/impulcia-alt.png';

export const productLogos: Record<string, string> = {
  coya: '/images/products/coya.png',
  sentrajet: '/images/products/sentrajet.png',
  mbourake: '/images/products/mbourake.png',
  patrimo: '/images/products/patrimo.png',
  sunugest: '/images/products/sunugest.png',
};

export const partnerLogos: { id: string; name: string; src: string }[] = [
  { id: 'royal-air-maroc', name: 'Royal Air Maroc', src: '/images/partners/partner-1.png' },
  { id: 'air-senegal', name: 'Air Sénégal', src: '/images/partners/partner-2.png' },
  { id: 'bnm', name: 'Banque Nationale de Mauritanie', src: '/images/partners/partner-3.png' },
  { id: 'engie', name: 'ENGIE', src: '/images/partners/partner-4.png' },
  { id: 'ong-concept', name: 'ONG Concept', src: '/images/partners/partner-5.png' },
  { id: 'crea-amenagement', name: 'CREA Aménagement', src: '/images/partners/partner-6.png' },
  { id: 'cerip', name: 'CERIP Sénégal', src: '/images/partners/cerip.png' },
  { id: 'majorel', name: 'Majorel', src: '/images/partners/majorel.png' },
  { id: 'enedis', name: 'Enedis', src: '/images/partners/partner-7.png' },
  { id: 'ctm', name: 'CTM', src: '/images/partners/partner-8.png' },
  { id: 'selectra', name: 'Selectra', src: '/images/partners/partner-9.png' },
  { id: 'sitel-group', name: 'Sitel Group', src: '/images/partners/partner-10.png' },
];

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
