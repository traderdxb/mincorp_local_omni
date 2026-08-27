import SiteLayout from '@/components/feature/SiteLayout';
import { LinkButton } from '@/components/base/Button';
import CommoditiesHero from './components/CommoditiesHero';
import CommoditiesGrid from './components/CommoditiesGrid';

export default function CommoditiesPage() {
  return (
    <SiteLayout>
      <CommoditiesHero />
      <CommoditiesGrid />

      {/* CTA */}
      <section className="py-[60px] md:py-[80px] px-4 md:px-10 bg-primary-500">
        <div className="max-w-container mx-auto text-center">
          <h2 className="font-heading font-light text-[28px] md:text-[42px] text-background-50 leading-tight mb-4">
            Ready to source with confidence?
          </h2>
          <p className="font-body text-[15px] text-background-50/80 max-w-[560px] mx-auto mb-8 leading-relaxed">
            Tell us your commodity, grade, volume, and destination — we&rsquo;ll respond with a competitive quote within 24 hours.
          </p>
          <LinkButton to="/contact" variant="gold">
            Request a Quote
            <i className="ri-arrow-right-line text-[15px]" />
          </LinkButton>
        </div>
      </section>
    </SiteLayout>
  );
}