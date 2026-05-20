import type { Metadata } from 'next';
import {
  createNoindexMetadata,
  createPageMetadata,
  createTechCategoryMetadata,
} from './metadata';
import { getTechSeoPageKey } from './registry';
import { isTechCategorySlug } from './paths';
import type { SeoPageKey } from './types';

type PageParams = { params: Promise<{ locale: string }> };
type TechPageParams = { params: Promise<{ locale: string; category: string }> };

function pageMetadata(page: SeoPageKey) {
  return async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const { locale } = await params;
    return createPageMetadata({ locale, page });
  };
}

function noindexPageMetadata(page: SeoPageKey) {
  return async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const { locale } = await params;
    return createNoindexMetadata(locale, page);
  };
}

export const homeMetadata = pageMetadata('home');
export const aboutMetadata = pageMetadata('about');
export const expertiseMetadata = pageMetadata('expertise');
export const technologiesMetadata = pageMetadata('technologies');
export const servicesMetadata = pageMetadata('services');
export const partnershipsMetadata = pageMetadata('partnerships');
export const contactMetadata = pageMetadata('contact');
export const coyaMetadata = pageMetadata('coya');
export const sentrajetMetadata = pageMetadata('sentrajet');
export const patrimoMetadata = pageMetadata('patrimo');
export const sunugestMetadata = pageMetadata('sunugest');
export const mbourakeMetadata = pageMetadata('mbourake');
export const forEnterprisesMetadata = pageMetadata('forEnterprises');
export const forInstitutionsMetadata = pageMetadata('forInstitutions');
export const forDonorsMetadata = pageMetadata('forDonors');
export const realisationsMetadata = pageMetadata('realisations');
export const auditSiMetadata = pageMetadata('auditSi');
export const cadrageProjetMetadata = pageMetadata('cadrageProjet');
export const architecteSiMetadata = pageMetadata('architecteSi');
export const trustMetadata = pageMetadata('trust');
export const trustCenterMetadata = pageMetadata('trustCenter');
export const careersMetadata = pageMetadata('careers');
export const privacyMetadata = pageMetadata('privacy');
export const cookiesMetadata = pageMetadata('cookies');
export const legalMetadata = pageMetadata('legal');
export const landingMetadata = noindexPageMetadata('landing');
export const clientLoginMetadata = noindexPageMetadata('clientLogin');
export const clientSpaceMetadata = noindexPageMetadata('clientSpace');

export async function techCategoryMetadata({ params }: TechPageParams): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isTechCategorySlug(category)) {
    return createPageMetadata({ locale, page: 'technologies' });
  }
  const seoPage = getTechSeoPageKey(category);
  if (!seoPage) {
    return createPageMetadata({ locale, page: 'technologies' });
  }
  return createTechCategoryMetadata(locale, category, seoPage);
}
