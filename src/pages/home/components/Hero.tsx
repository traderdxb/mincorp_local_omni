import { useSiteContent } from '@/hooks/useSiteContent';
import { LinkButton } from '@/components/base/Button';

export default function Hero() {
  const { content } = useSiteContent('home_hero');
  const h = content.home_hero ?? {};

  const bgImage = h.background_image || 'https://readdy.ai/api/search-image?query=Massive%20global%20commodity%20cargo%20port%20terminal%20at%20blue%20hour%20with%20stacks%20of%20shipping%20containers%20iron%20ore%20piles%20and%20cranes%20under%20deep%20teal%20navy%20sky%20with%20warm%20amber%20accent%20lights%2C%20cinematic%20industrial%20photography%2C%20stylized%20editorial%20framing%2C%20clean%20professional%20B2B%20trading%20aesthetic%2C%20highly%20detailed%20atmospheric%20composition&width=1800&height=1000&seq=mincorp-hero-main-2026&orientation=landscape';

  return (
    <section className="relative w-full h-[720px] min-h-[600px] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Global commodity trading port"
          className="w-full h-full object-cover object-top"
        />
        {/* Dark gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/70 via-primary-950/55 to-primary-950/80" />
        {/* Teal color wash */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/40 via-transparent to-secondary-500/20" />
        {/* Subtle organic flame-like geometric shape */}
        <div
          className="absolute -right-24 top-1/3 w-[520px] h-[520px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, oklch(var(--accent-500)) 0%, transparent 60%)' }}
        />
        <div
          className="absolute -left-32 bottom-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-25"
          style={{ background: 'radial-gradient(circle, oklch(var(--secondary-500)) 0%, transparent 60%)' }}
        />
      </div>

      <div className="relative z-10 w-full">
        <div className="max-w-container mx-auto px-4 md:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-background-50/10 border border-background-50/20 backdrop-blur-sm rounded-[5px] px-3 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
              <span className="text-[12px] tracking-[0.15em] uppercase text-background-50 font-bold">
                {h.badge || 'Global Commodity Trading Partner'}
              </span>
            </div>

            <h1 className="text-background-50 font-light leading-tight tracking-tight text-[36px] md:text-[48px] lg:text-[55px] lg:leading-[62px]">
              {h.heading_line1 || 'Sourcing certainty for the'}<br />
              <span className="text-accent-500 font-normal">{h.heading_line2 || 'industries that build the world.'}</span>
            </h1>

            <p className="mt-6 max-w-2xl text-background-50/90 text-[15px] md:text-[16px] leading-[26px]">
              {h.description || 'From iron ore and metallurgical coke to cement, fertilizers, and FMCG staples — MinCorp Trading LLC delivers reliable, quality-assured commodity supply chains to industrial partners across five continents.'}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <LinkButton to="/commodities" variant="gold">
                {h.cta_primary || 'Explore Commodities'}
                <i className="ri-arrow-right-line text-[15px]" />
              </LinkButton>
              <LinkButton to="/contact" variant="ghost" className="!text-background-50 !border-background-50/60 hover:!bg-background-50/10">
                {h.cta_secondary || 'Request a Quote'}
              </LinkButton>
            </div>

            {/* Trust markers */}
            <div className="mt-14 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl">
              {[
                { value: h.stat1_value || '18+', label: h.stat1_label || 'Countries served' },
                { value: h.stat2_value || '2.4M+', label: h.stat2_label || 'MT traded annually' },
                { value: h.stat3_value || '140+', label: h.stat3_label || 'Global partners' },
              ].map((s) => (
                <div key={s.label} className="border-l-2 border-accent-500 pl-4">
                  <div className="text-background-50 text-[28px] md:text-[32px] font-bold leading-none">{s.value}</div>
                  <div className="text-background-50/70 text-[12px] tracking-[0.08em] uppercase mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-background-50/60">
        <span className="text-[11px] tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-background-50/40" />
      </div>
    </section>
  );
}