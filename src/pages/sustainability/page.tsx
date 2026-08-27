import SiteLayout from '@/components/feature/SiteLayout';
import SustainabilityHero from './components/SustainabilityHero';
import ESGFramework from './components/ESGFramework';
import SourcingSection from './components/SourcingSection';
import CommitmentsSection from './components/CommitmentsSection';
import CtaSection from '@/pages/home/components/CtaSection';

export default function SustainabilityPage() {
  return (
    <SiteLayout>
      <SustainabilityHero />
      <ESGFramework />
      <SourcingSection />
      <CommitmentsSection />
      <CtaSection />
    </SiteLayout>
  );
}