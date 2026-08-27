import { useSiteContent } from '@/hooks/useSiteContent';

export default function CapabilitiesSection() {
  const { content } = useSiteContent('home_capabilities');
  const h = content.home_capabilities ?? {};

  const capabilities = [
    { icon: 'ri-ship-line', title: h.cap1_title || 'Global Logistics', description: h.cap1_desc || 'End-to-end supply chain management with freight, port handling, and documentation across major shipping routes.' },
    { icon: 'ri-shield-check-line', title: h.cap2_title || 'Quality Assurance', description: h.cap2_desc || 'SGS, Intertek, and CIQ third-party inspections. Full traceability from mine or plant to destination port.' },
    { icon: 'ri-line-chart-line', title: h.cap3_title || 'Market Intelligence', description: h.cap3_desc || 'Live market benchmarks, index-linked pricing, and hedging support for volume buyers and long-term contracts.' },
    { icon: 'ri-file-shield-line', title: h.cap4_title || 'Trade Finance', description: h.cap4_desc || 'Confirmed LCs, SBLC, DLC, and open-account structures with leading trade banks and export credit agencies.' },
    { icon: 'ri-earth-line', title: h.cap5_title || 'Multi-Origin Sourcing', description: h.cap5_desc || 'Diversified supplier base across India, UAE, Oman, Indonesia, Turkey, and Africa for supply resilience.' },
    { icon: 'ri-file-text-line', title: h.cap6_title || 'Compliance & Docs', description: h.cap6_desc || 'Full KYC, phytosanitary certification, certificate of origin, and destination-specific documentation.' },
  ];

  return (
    <section className="bg-background-50 py-16 md:py-[100px]">
      <div className="max-w-container mx-auto px-4 md:px-10">
        <div className="max-w-3xl">
          <div className="text-[12px] tracking-[0.2em] uppercase text-secondary-600 font-bold mb-4">
            {h.section_label || 'What we do'}
          </div>
          <h2 className="font-heading font-bold text-primary-500 text-[32px] md:text-[42px] leading-tight">
            {h.heading || 'Trading capabilities built on trust, executed with precision.'}
          </h2>
          <p className="mt-6 text-foreground-600 text-[15px] leading-[26px] max-w-2xl">
            {h.description || 'MinCorp acts as a strategic sourcing partner rather than a transactional broker. Every trade is backed by rigorous QA, transparent pricing, and dependable logistics.'}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((c) => (
            <article
              key={c.title}
              className="group bg-background-50 border border-background-200 rounded-[5px] p-6 transition-all duration-300 hover:border-primary-500 hover:-translate-y-1"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.06) 0px 2px 8px' }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-[5px] bg-primary-500 text-background-50 group-hover:bg-accent-500 group-hover:text-primary-500 transition-colors">
                <i className={`${c.icon} text-[22px]`} />
              </div>
              <h3 className="mt-5 font-heading font-bold text-primary-500 text-[15px] leading-[24px]">
                {c.title}
              </h3>
              <p className="mt-3 text-foreground-600 text-[14px] leading-[23.8px]">
                {c.description}
              </p>
              <div className="mt-6 pt-4 border-t border-background-200 flex items-center justify-between">
                <span className="text-[12px] tracking-[0.15em] uppercase text-foreground-500">Learn more</span>
                <i className="ri-arrow-right-line text-primary-500 group-hover:text-accent-500 group-hover:translate-x-1 transition-all" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}