import { LinkButton } from '@/components/base/Button';
import { useSiteContent } from '@/hooks/useSiteContent';

const defaultServices = [
  {
    icon: 'ri-global-line',
    title: 'Multi-Origin Sourcing',
    desc: 'We source commodities from verified suppliers across 18+ countries. Our procurement teams conduct on-site audits, sample testing, and background verification before onboarding any producer — ensuring consistent quality from origin to destination.',
    highlights: ['Pre-qualified supplier network', 'On-site producer audits', 'Multi-origin price arbitrage'],
  },
  {
    icon: 'ri-ship-2-line',
    title: 'Logistics & Shipping',
    desc: 'Full freight management — bulk vessels, breakbulk, and containerized cargo. We handle chartering, freight negotiation, port operations, documentation, customs clearance, and end-to-end cargo tracking with real-time updates.',
    highlights: ['Bulk & container shipping', 'Customs & documentation', 'Real-time cargo tracking'],
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Quality Assurance',
    desc: 'Independent third-party inspection and testing at loading and discharge ports. Full documentation package including SGS/Intertek certificates, moisture analysis, and chemical composition reports — delivered before payment release.',
    highlights: ['SGS / Intertek testing', 'Pre-shipment inspection', 'Full lab documentation'],
  },
  {
    icon: 'ri-bank-line',
    title: 'Trade Finance',
    desc: 'Flexible payment structures including LC at sight, usance LC, and deferred payment terms. We work with major international banks to provide creditworthy buyers with competitive financing for bulk commodity purchases.',
    highlights: ['LC & usance facilities', 'Structured trade finance', 'Multi-bank relationships'],
  },
  {
    icon: 'ri-line-chart-line',
    title: 'Market Intelligence',
    desc: 'Weekly commodity price reports, supply-demand analytics, and regulatory updates for your target markets. Our research desk provides actionable insights to help you time purchases and negotiate from a position of knowledge.',
    highlights: ['Weekly price reports', 'Supply-demand analytics', 'Regulatory monitoring'],
  },
  {
    icon: 'ri-file-text-line',
    title: 'Compliance & Documentation',
    desc: 'Complete document management — certificates of origin, phytosanitary certificates, fumigation, halal certification, radiation-free certificates, and any country-specific import documentation required by your customs authority.',
    highlights: ['Full document packages', 'Country-specific compliance', 'Digital record keeping'],
  },
];

const ICONS = ['ri-global-line', 'ri-ship-2-line', 'ri-shield-check-line', 'ri-bank-line', 'ri-line-chart-line', 'ri-file-text-line'];

function getVal(c: Record<string, Record<string, string>> | undefined, section: string, key: string, fallback: string): string {
  return c?.[section]?.[key] || fallback;
}

export default function ServicesGrid() {
  const { content } = useSiteContent('services_grid');

  const heading = getVal(content, 'services_grid', 'heading', 'Our Capabilities');
  const description = getVal(content, 'services_grid', 'description', 'Six integrated service pillars that work together to deliver seamless commodity procurement — from supplier selection to cargo delivery at your port.');
  const btnText = getVal(content, 'services_grid', 'btn_text', 'Discuss your requirements');

  const services = [0, 1, 2, 3, 4, 5].map((i) => ({
    icon: ICONS[i],
    title: getVal(content, 'services_grid', `item_${i}_title`, defaultServices[i].title),
    desc: getVal(content, 'services_grid', `item_${i}_desc`, defaultServices[i].desc),
    highlights: (getVal(content, 'services_grid', `item_${i}_highlights`, defaultServices[i].highlights.join('\n')) || '').split('\n').filter(Boolean),
  }));

  return (
    <section className="bg-background-50 py-16 md:py-24">
      <div className="max-w-container mx-auto px-4 md:px-10">
        <div className="text-center mb-14">
          <h2 className="text-[28px] md:text-[42px] leading-[1.1] font-bold text-primary-500">
            {heading}
          </h2>
          <p className="mt-4 text-[14px] leading-[23.8px] text-foreground-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-background-50 rounded-[5px] p-6 md:p-7 border border-background-200/70 hover:border-primary-500/20 transition-colors"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 8px' }}
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-[5px] bg-primary-500 text-background-50 mb-5">
                <i className={`${s.icon} text-[18px]`} />
              </div>
              <h3 className="text-[18px] leading-[24px] font-bold text-primary-500 mb-3">{s.title}</h3>
              <p className="text-[14px] leading-[23.8px] text-foreground-600 mb-4">{s.desc}</p>
              <ul className="space-y-2">
                {s.highlights.map((h: string) => (
                  <li key={h} className="flex items-start gap-2 text-[12px] leading-[18px] text-foreground-500">
                    <i className="ri-check-line text-secondary-500 mt-[2px] text-[14px]" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <LinkButton to="/contact" variant="gold">
            {btnText}
            <i className="ri-arrow-right-line text-[15px]" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}