import SiteLayout from '@/components/feature/SiteLayout';
import Hero from '@/pages/home/components/Hero';
import CapabilitiesSection from '@/pages/home/components/CapabilitiesSection';
import CommoditiesShowcase from '@/pages/home/components/CommoditiesShowcase';
import AboutTeaser from '@/pages/home/components/AboutTeaser';
import ProcessSection from '@/pages/home/components/ProcessSection';
import GlobalReach from '@/pages/home/components/GlobalReach';
import TestimonialSection from '@/pages/home/components/TestimonialSection';
import CtaSection from '@/pages/home/components/CtaSection';

export default function Home() {
  return (
    <SiteLayout>
      <Hero />
      <CapabilitiesSection />
      <CommoditiesShowcase />
      <AboutTeaser />
      <ProcessSection />
      <GlobalReach />
      <TestimonialSection />
      <CtaSection />
    </SiteLayout>
  );
}