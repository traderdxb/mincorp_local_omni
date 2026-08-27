import SiteLayout from '@/components/feature/SiteLayout';
import AboutHero from './components/AboutHero';
import MissionSection from './components/MissionSection';
import AboutStats from './components/AboutStats';
import TimelineSection from './components/TimelineSection';
import LeadershipSection from './components/LeadershipSection';
import CtaSection from '@/pages/home/components/CtaSection';

export default function AboutPage() {
  return (
    <SiteLayout>
      <AboutHero />
      <MissionSection />
      <AboutStats />
      <TimelineSection />
      <LeadershipSection />
      <CtaSection />
    </SiteLayout>
  );
}