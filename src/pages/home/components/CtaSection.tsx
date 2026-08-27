import { useSiteContent } from '@/hooks/useSiteContent';
import { LinkButton } from '@/components/base/Button';

export default function CtaSection() {
  const { content } = useSiteContent('home_cta');
  const h = content.home_cta ?? {};

  const bgImage = h.background_image || 'https://readdy.ai/api/search-image?query=Vast%20stylized%20industrial%20cargo%20port%20at%20night%20with%20warm%20amber%20golden%20accent%20lights%20and%20deep%20teal%20navy%20atmosphere%2C%20containers%20and%20cranes%20silhouettes%2C%20cinematic%20editorial%20photography%2C%20soft%20haze%2C%20premium%20B2B%20trading%20aesthetic%2C%20clean%20architectural%20composition&width=1800&height=900&seq=mincorp-cta-bg-2026&orientation=landscape';

  return (
    <section className="relative py-16 md:py-[100px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="MinCorp global logistics"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-primary-950/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/70 to-primary-500/50" />
      </div>

      <div className="relative max-w-container mx-auto px-4 md:px-10">
        <div className="max-w-3xl">
          <h2 className="font-heading font-light text-background-50 text-[32px] md:text-[42px] leading-tight">
            {h.heading || 'Ready to source with confidence?'}
          </h2>
          <p className="mt-4 text-background-50/80 text-[15px] md:text-[16px] leading-[26px]">
            {h.description || 'Tell us what you need. Our commodity desk delivers competitive quotes within 24 hours.'}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <LinkButton to="/contact" variant="gold">
              {h.btn_text || 'Contact Our Desk'}
              <i className="ri-arrow-right-line" />
            </LinkButton>
            <LinkButton to="/commodities" variant="ghost" className="!text-background-50 !border-background-50/60 hover:!bg-background-50/10">
              Browse commodities
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}