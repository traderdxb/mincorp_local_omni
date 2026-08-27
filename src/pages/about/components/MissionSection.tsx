import { useSiteContent } from '@/hooks/useSiteContent';

export default function MissionSection() {
  const { content } = useSiteContent('about_mission');
  const h = content.about_mission ?? {};

  const pillars = [
    {
      icon: 'ri-eye-line',
      title: h.vision_title || 'Our Vision',
      body: h.vision_body || 'To be the most trusted B2B commodity trading partner globally — recognized for transparency, operational excellence, and sustainable practices that create lasting value for every partner in the supply chain.',
    },
    {
      icon: 'ri-flag-2-line',
      title: h.mission_title || 'Our Mission',
      body: h.mission_body || 'We simplify complex cross-border commodity trade by delivering consistent quality, competitive pricing, and reliable logistics — empowering industrial buyers to focus on their core business while we handle sourcing and delivery.',
    },
    {
      icon: 'ri-scales-3-line',
      title: h.values_title || 'Our Values',
      body: h.values_body || 'Integrity in every negotiation. Transparency in every specification. Accountability in every shipment. We believe long-term partnerships are built on trust — not shortcuts.',
    },
  ];

  return (
    <section className="bg-background-50 py-16 md:py-24">
      <div className="max-w-container mx-auto px-4 md:px-10">
        <div className="text-center mb-14">
          <h2 className="text-[28px] md:text-[42px] leading-[1.1] font-bold text-primary-500">
            {h.heading || 'Why We Exist'}
          </h2>
          <p className="mt-4 text-[14px] leading-[23.8px] text-foreground-600 max-w-2xl mx-auto">
            {h.description || 'Commodity trading is complex. Cross-border logistics, quality verification, regulatory compliance, and price volatility create friction at every step. MinCorp exists to remove that friction.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="bg-background-50 rounded-[5px] p-8 border border-background-200/70 hover:border-primary-500/20 transition-colors"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 8px' }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-[5px] bg-primary-500 text-background-50 mb-5">
                <i className={`${p.icon} text-[20px]`} />
              </div>
              <h3 className="text-[18px] leading-[24px] font-bold text-primary-500 mb-3">
                {p.title}
              </h3>
              <p className="text-[14px] leading-[23.8px] text-foreground-600">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}