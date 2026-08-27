import { useSiteContent } from '@/hooks/useSiteContent';

export default function CommoditiesHero() {
  const { content } = useSiteContent('commodities_hero');
  const h = content.commodities_hero ?? {};

  const bgImage = h.background_image || 'https://readdy.ai/api/search-image?query=Massive%20industrial%20port%20terminal%20with%20stacked%20bulk%20cargo%20containers%20and%20mineral%20piles%20under%20dramatic%20deep%20teal%20blue%20twilight%20sky%2C%20warm%20gold%20accent%20lighting%20from%20port%20cranes%2C%20cinematic%20wide%20angle%20professional%20photography%2C%20clean%20modern%20industrial%20commodity%20trading%20headquarters%20aesthetic%2C%20geometric%20composition%20with%20strong%20leading%20lines&width=1600&height=900&seq=mincorp-hero-commodities&orientation=landscape';

  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="MinCorp commodities trading"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-primary-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-primary-950/50 to-transparent" />
      </div>

      <div className="relative max-w-container mx-auto px-4 md:px-10">
        <div className="max-w-2xl">
          <h1 className="font-heading font-light text-background-50 text-[36px] md:text-[48px] leading-tight">
            {h.heading || 'Our Commodities'}
          </h1>
          <p className="mt-4 text-background-50/80 text-[15px] md:text-[16px] leading-[26px] max-w-xl">
            {h.description || 'Industrially essential raw materials, sourced from trusted origins and delivered to your specification.'}
          </p>
        </div>
      </div>
    </section>
  );
}