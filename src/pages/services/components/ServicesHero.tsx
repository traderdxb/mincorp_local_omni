import { useSiteContent } from '@/hooks/useSiteContent';

export default function ServicesHero() {
  const { content } = useSiteContent('services_hero');
  const h = content.services_hero ?? {};

  const bgImage = h.background_image || 'https://readdy.ai/api/search-image?query=Modern%20logistics%20and%20supply%20chain%20operations%20center%20with%20digital%20screens%20showing%20global%20shipping%20routes%2C%20clean%20corporate%20environment%20with%20warm%20teal%20and%20amber%20ambient%20lighting%2C%20professional%20team%20monitoring%20operations%2C%20polished%20industrial%20aesthetic%2C%20cinematic%20wide%20angle%20photography&width=1600&height=900&seq=mincorp-services-hero&orientation=landscape';

  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="MinCorp services and logistics"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-primary-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-primary-950/50 to-transparent" />
      </div>

      <div className="relative max-w-container mx-auto px-4 md:px-10">
        <div className="max-w-2xl">
          <h1 className="font-heading font-light text-background-50 text-[36px] md:text-[48px] leading-tight">
            {h.heading || 'Our Services'}
          </h1>
          <p className="mt-4 text-background-50/80 text-[15px] md:text-[16px] leading-[26px] max-w-xl">
            {h.description || 'End-to-end commodity supply chain solutions from origin to destination.'}
          </p>
        </div>
      </div>
    </section>
  );
}