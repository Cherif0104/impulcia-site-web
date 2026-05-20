export { landingMetadata as generateMetadata } from '@/src/lib/seo/pages';

import HeroSectionInstitutional from '@/src/components/sections/landing/HeroSectionInstitutional';
import TrustSectionInstitutional from '@/src/components/sections/landing/TrustSectionInstitutional';
import AboutSection from '@/src/components/sections/landing/AboutSection';
import OffersSectionInstitutional from '@/src/components/sections/landing/OffersSectionInstitutional';
import WhySection from '@/src/components/sections/landing/WhySection';
import CaseStudiesSection from '@/src/components/sections/landing/CaseStudiesSection';
import GovernanceSection from '@/src/components/sections/landing/GovernanceSection';
import RGPDComplianceSection from '@/src/components/sections/landing/RGPDComplianceSection';
import InnovationSection from '@/src/components/sections/landing/InnovationSection';
import PartnersSection from '@/src/components/sections/landing/PartnersSection';
import CallsForProjectsSection from '@/src/components/sections/landing/CallsForProjectsSection';
import PressSection from '@/src/components/sections/landing/PressSection';
import ContactSectionInstitutional from '@/src/components/sections/landing/ContactSectionInstitutional';

export default function LandingInstitutionalPage() {
  return (
    <>
      <HeroSectionInstitutional />
      <TrustSectionInstitutional />
      <AboutSection />
      <OffersSectionInstitutional />
      <WhySection />
      <CaseStudiesSection />
      <GovernanceSection />
      <RGPDComplianceSection />
      <InnovationSection />
      <PartnersSection />
      <CallsForProjectsSection />
      <PressSection />
      <ContactSectionInstitutional />
    </>
  );
}

