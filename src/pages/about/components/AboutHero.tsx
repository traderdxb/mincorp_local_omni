import { useSiteContent } from '@/hooks/useSiteContent';

export default function AboutHero() {
  const { content } = useSiteContent('about_hero');
  const h = content.about_hero ?? {};

  const bgImage = h.background_image || 'https://readdy.ai/api/search-image?query=Global%20commodity%20trading%20port%20terminal%20at%20golden%20hour%20with%20massive%20cargo%20vessels%20loading%20bulk%20minerals%2C%20deep%20teal%20blue%20sky%20with%20dramatic%20warm%20clouds%2C%20cinematic%20industrial%20landscape%2C%20cranes%20silhouettes%20against%20sunset%2C%20professional%20corporate%20photography%2C%20clean%20and%20polished%20aesthetic%2C%20shallow%20depth%20of%20field%20on%20foreground%20container%20stacks&width=1600&height=900&seq=mincorp-about-hero&orientation=landscape';

  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="MinCorp global trade"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-primary-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/80 via-primary-950/50 to-transparent" />
      </div>

      <div className="relative max-w-container mx-auto px-4 md:px-10">
        <div className="max-w-2xl">
          <h1 className="font-heading font-light text-background-50 text-[36px] md:text-[48px] leading-tight">
            {h.heading || 'About MinCorp Trading'}
          </h1>
          <p className="mt-4 text-background-50/80 text-[15px] md:text-[16px] leading-[26px] max-w-xl">
            {h.description || 'A commodity trading house built on transparency, accountability, and decades of cross-border expertise.'}
          </p>
        </div>
      </div>
    </section>
  );
}