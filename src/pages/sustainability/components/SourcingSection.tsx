import { useSiteContent } from '@/hooks/useSiteContent';

const defaultPractices = [
  {
    icon: 'ri-check-double-line',
    title: 'Supplier Qualification',
    desc: 'Every new supplier undergoes a documented ESG assessment covering environmental permits, labor practices, community impact, and regulatory compliance before being added to our approved vendor list.',
  },
  {
    icon: 'ri-file-search-line',
    title: 'Chain of Custody',
    desc: 'We maintain complete chain-of-custody documentation for every shipment, enabling partners to trace commodity origins and verify compliance with their own sourcing policies.',
  },
  {
    icon: 'ri-bar-chart-box-line',
    title: 'Carbon Tracking',
    desc: 'Our logistics desk calculates estimated CO₂ per shipment route and prioritizes lower-carbon alternatives where commercially viable. We report this data to partners who include Scope 3 in their disclosures.',
  },
  {
    icon: 'ri-award-line',
    title: 'Certification Support',
    desc: 'We help suppliers obtain internationally recognized certifications — including ISO 14001, SA8000, and Fair Trade — by connecting them with accredited auditors and sharing best practices.',
  },
];

const ICONS = ['ri-check-double-line', 'ri-file-search-line', 'ri-bar-chart-box-line', 'ri-award-line'];

function getVal(c: Record<string, Record<string, string>> | undefined, section: string, key: string, fallback: string): string {
  return c?.[section]?.[key] || fallback;
}

export default function SourcingSection() {
  const { content } = useSiteContent('sustainability_sourcing');

  const heading = getVal(content, 'sustainability_sourcing', 'heading', 'Responsible Sourcing');
  const description = getVal(content, 'sustainability_sourcing', 'description', 'Every commodity we trade carries a story of where it came from and how it was produced. We make sure that story is one of responsibility and accountability.');
  const unTitle = getVal(content, 'sustainability_sourcing', 'un_compact_title', 'UN Global Compact — Participant Since 2023');
  const unDesc = getVal(content, 'sustainability_sourcing', 'un_compact_desc', 'MinCorp is a proud participant of the United Nations Global Compact, the world\'s largest corporate sustainability initiative. We align our strategies and operations with ten universal principles on human rights, labor, environment, and anti-corruption — and report our progress annually.');

  const practices = [0, 1, 2, 3].map((i) => ({
    icon: ICONS[i],
    title: getVal(content, 'sustainability_sourcing', `item_${i}_title`, defaultPractices[i].title),
    desc: getVal(content, 'sustainability_sourcing', `item_${i}_desc`, defaultPractices[i].desc),
  }));

  return (
    <section className="bg-background-100 py-16 md:py-24">
      <div className="max-w-container mx-auto px-4 md:px-10">
        <div className="text-center mb-14">
          <h2 className="text-[28px] md:text-[42px] leading-[1.1] font-bold text-primary-500">
            {heading}
          </h2>
          <p className="mt-4 text-[14px] leading-[23.8px] text-foreground-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {practices.map((p) => (
            <div
              key={p.title}
              className="flex items-start gap-5 bg-background-50 rounded-[5px] p-6 border border-background-200/70"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 8px' }}
            >
              <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-accent-500/20">
                <i className={`${p.icon} text-accent-500 text-[20px]`} />
              </div>
              <div>
                <h4 className="text-[17px] leading-[22px] font-bold text-primary-500 mb-2">{p.title}</h4>
                <p className="text-[14px] leading-[23.8px] text-foreground-600">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-background-50 rounded-[5px] p-8 border border-background-200/70"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 8px' }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-full bg-primary-500">
              <i className="ri-earth-line text-background-50 text-[24px]" />
            </div>
            <div>
              <h4 className="text-[17px] leading-[22px] font-bold text-primary-500 mb-2">
                {unTitle}
              </h4>
              <p className="text-[14px] leading-[23.8px] text-foreground-600">
                {unDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}