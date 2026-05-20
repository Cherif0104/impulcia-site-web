export { homeMetadata as generateMetadata } from '@/src/lib/seo/pages';

import EnterpriseHero from '@/src/components/enterprise/EnterpriseHero';
import ImpactSection from '@/src/components/enterprise/ImpactSection';
import AboutImpulciaSection from '@/src/components/enterprise/AboutImpulciaSection';
import ProductsSection from '@/src/components/enterprise/ProductsSection';
import CoyaErpSection from '@/src/components/enterprise/CoyaErpSection';
import ModulesSection from '@/src/components/enterprise/ModulesSection';
import ExpertiseDomainsSection from '@/src/components/enterprise/ExpertiseDomainsSection';
import IndustriesEnterpriseSection from '@/src/components/enterprise/IndustriesEnterpriseSection';
import TechnologiesSection from '@/src/components/enterprise/TechnologiesSection';
import AiCapabilitiesSection from '@/src/components/enterprise/AiCapabilitiesSection';
import PartnersSection from '@/src/components/enterprise/PartnersSection';
import CaseStudiesSection from '@/src/components/enterprise/CaseStudiesSection';
import ChallengesSection from '@/src/components/enterprise/ChallengesSection';
import MethodologySection from '@/src/components/enterprise/MethodologySection';
import DemoEnterpriseSection from '@/src/components/enterprise/DemoEnterpriseSection';
import EnterpriseCtaSection from '@/src/components/enterprise/EnterpriseCtaSection';

export default function HomePage() {
  return (
    <>
      <EnterpriseHero />
      <ImpactSection />
      <AboutImpulciaSection />
      <ProductsSection />
      <CoyaErpSection />
      <ModulesSection />
      <ExpertiseDomainsSection />
      <IndustriesEnterpriseSection />
      <TechnologiesSection />
      <AiCapabilitiesSection />
      <PartnersSection />
      <CaseStudiesSection />
      <ChallengesSection />
      <MethodologySection />
      <DemoEnterpriseSection />
      <EnterpriseCtaSection />
    </>
  );
}
