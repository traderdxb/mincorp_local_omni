import { useSiteContent } from '@/hooks/useSiteContent';

export default function SustainabilityHero() {
  const { content } = useSiteContent('sustainability_hero');
  const h = content.sustainability_hero ?? {};

  const bgImage = h.background_image || 'https://readdy.ai/api/search-image?query=Aerial%20view%20of%20green%20sustainable%20industrial%20landscape%20with%20renewable%20energy%20wind%20turbines%20and%20solar%20panels%20integrated%20into%20a%20modern%20port%20facility%2C%20deep%20teal%20blue%20sky%20with%20soft%20morning%20light%2C%20clean%20environmental%20corporate%20photography%2C%20cinematic%20wide%20angle%2C%20responsible%20industry%20aesthetic%2C%20eco%20conscious%20atmosphere%20with%20natural%20greenery%20bordering%20industrial%20structures&width=1600&height=900&seq=mincorp-sustainability-hero&orientation=landscape';

  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="MinCorp sustainability"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-primary-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-primary-950/50 to-transparent" />
      </div>

      <div className="relative max-w-container mx-auto px-4 md:px-10">
        <div className="max-w-2xl">
          <h1 className="font-heading font-light text-background-50 text-[36px] md:text-[48px] leading-tight">
            {h.heading || 'Sustainability'}
          </h1>
          <p className="mt-4 text-background-50/80 text-[15px] md:text-[16px] leading-[26px] max-w-xl">
            {h.description || 'Responsible sourcing, ethical supply chains, and a commitment to ESG principles.'}
          </p>
        </div>
      </div>
    </section>
  );
}