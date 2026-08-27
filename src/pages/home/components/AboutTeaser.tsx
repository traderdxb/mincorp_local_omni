import { useSiteContent } from '@/hooks/useSiteContent';
import { LinkButton } from '@/components/base/Button';

export default function AboutTeaser() {
  const { content } = useSiteContent('home_about');
  const h = content.home_about ?? {};

  const sectionImage = h.image || 'https://readdy.ai/api/search-image?query=Modern%20B2B%20commodity%20trading%20professional%20team%20in%20a%20sleek%20office%20boardroom%20reviewing%20global%20supply%20chain%20maps%20on%20screens%20with%20deep%20teal%20navy%20color%20palette%20warm%20amber%20accent%20lighting%20clean%20editorial%20photography%20cinematic%20framing%20professional%20corporate%20atmosphere&width=1200&height=1300&seq=mincorp-about-teaser-2026&orientation=portrait';

  const highlights = [
    { icon: 'ri-focus-3-line', label: h.highlight1 || 'Client-first sourcing' },
    { icon: 'ri-scales-3-line', label: h.highlight2 || 'Transparent pricing' },
    { icon: 'ri-shield-star-line', label: h.highlight3 || 'Third-party verified QA' },
    { icon: 'ri-community-line', label: h.highlight4 || 'Long-term partnerships' },
  ];

  return (
    <section className="bg-background-50 py-16 md:py-[100px]">
      <div className="max-w-container mx-auto px-4 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative">
          <div className="relative rounded-[5px] overflow-hidden" style={{ boxShadow: 'rgba(0, 0, 0, 0.10) 0px 8px 24px' }}>
            <img
              src={sectionImage}
              alt="MinCorp trading desk"
              className="w-full h-[520px] object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 via-transparent to-transparent" />
          </div>

          {/* Floating card */}
          <div className="hidden md:block absolute -bottom-8 -right-8 bg-primary-500 text-background-50 p-6 rounded-[5px] w-64"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 12px 24px' }}
          >
            <div className="text-[42px] font-bold leading-none text-accent-500">{h.floating_card_value || '15+'}</div>
            <div className="text-[13px] mt-2 leading-[20px]">{h.floating_card_text || 'Years of combined experience in cross-border commodity trading'}</div>
          </div>
        </div>

        <div>
          <div className="text-[12px] tracking-[0.2em] uppercase text-secondary-600 font-bold mb-4">
            {h.section_label || 'About MinCorp'}
          </div>
          <h2 className="font-heading font-bold text-primary-500 text-[32px] md:text-[42px] leading-tight">
            {h.heading || 'A trading house grounded in accountability and long-term relationships.'}
          </h2>
          <p className="mt-6 text-foreground-600 text-[15px] leading-[26px]">
            {h.description1 || 'MinCorp Trading LLC was founded on a simple premise: that industrial buyers deserve a supply partner who answers the phone, explains the paperwork, and stands behind every shipment. We move commodities that keep steel mills, cement plants, and farms running — with clarity at every stage.'}
          </p>
          <p className="mt-4 text-foreground-600 text-[15px] leading-[26px]">
            {h.description2 || 'Headquartered in Dubai with sourcing desks across South Asia and East Africa, our team combines traders, logistics specialists, and quality engineers under one roof.'}
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {highlights.map((hl) => (
              <div key={hl.label} className="flex items-center gap-3 bg-background-100 rounded-[5px] px-4 py-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-[5px] bg-primary-500 text-accent-500">
                  <i className={`${hl.icon} text-[18px]`} />
                </div>
                <span className="text-[14px] font-bold text-primary-500">{hl.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <LinkButton to="/about" variant="primary">
              {h.btn_primary || 'Learn more about us'}
              <i className="ri-arrow-right-line" />
            </LinkButton>
            <LinkButton to="/services" variant="secondary">
              {h.btn_secondary || 'Our services'}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}