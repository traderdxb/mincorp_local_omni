import { useSiteContent } from '@/hooks/useSiteContent';

export default function ContactHero() {
  const { content } = useSiteContent('contact_hero');
  const h = content.contact_hero ?? {};

  const bgImage = h.background_image || 'https://readdy.ai/api/search-image?query=Modern%20corporate%20office%20meeting%20room%20with%20large%20windows%20overlooking%20city%20skyline%20at%20sunset%2C%20warm%20ambient%20lighting%2C%20minimalist%20furniture%2C%20professional%20atmosphere%2C%20soft%20bokeh%20background%2C%20clean%20architectural%20lines%2C%20warm%20golden%20and%20teal%20accents&width=1600&height=900&seq=contact-hero-2026&orientation=landscape';

  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="MinCorp contact"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-primary-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-primary-950/50 to-transparent" />
      </div>

      <div className="relative max-w-container mx-auto px-4 md:px-10">
        <div className="max-w-2xl">
          <h1 className="font-heading font-light text-background-50 text-[36px] md:text-[48px] leading-tight">
            {h.heading || 'Contact Us'}
          </h1>
          <p className="mt-4 text-background-50/80 text-[15px] md:text-[16px] leading-[26px] max-w-xl">
            {h.description || 'Reach out to our commodity desk. We respond within 24 hours.'}
          </p>
        </div>
      </div>
    </section>
  );
}