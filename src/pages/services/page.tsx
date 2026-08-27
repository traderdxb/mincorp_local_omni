import SiteLayout from '@/components/feature/SiteLayout';
import ServicesHero from './components/ServicesHero';
import ServicesGrid from './components/ServicesGrid';
import ServiceProcess from './components/ServiceProcess';
import WhyChooseUs from './components/WhyChooseUs';
import CtaSection from '@/pages/home/components/CtaSection';

export default function ServicesPage() {
  return (
    <SiteLayout>
      <ServicesHero />
      <ServicesGrid />
      <ServiceProcess />
      <WhyChooseUs />
      <CtaSection />
    </SiteLayout>
  );
}