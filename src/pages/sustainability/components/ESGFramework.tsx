import { useSiteContent } from '@/hooks/useSiteContent';

const defaultPillars = [
  {
    letter: 'E',
    title: 'Environmental',
    icon: 'ri-leaf-line',
    items: [
      'Carbon-aware logistics: we prioritize shorter shipping routes and fuel-efficient vessels to reduce Scope 3 emissions',
      'Supplier environmental screening: all producers are evaluated on waste management, water usage, and emissions',
      'Promoting sustainable materials: actively trading GBFS and other industrial by-products that reduce cement industry carbon footprint',
      'Paperless documentation: digital-first document management across all trading desks',
    ],
  },
  {
    letter: 'S',
    title: 'Social',
    icon: 'ri-group-line',
    items: [
      'Supplier code of conduct: all partners must comply with our standards on labor rights, workplace safety, and community relations',
      'Local employment: we prioritize hiring logistics and inspection talent from the communities where we operate',
      'Fair pricing: transparent pricing structures that ensure producers in developing markets receive equitable value',
      'Community investment: supporting education and infrastructure in key sourcing regions',
    ],
  },
  {
    letter: 'G',
    title: 'Governance',
    icon: 'ri-government-line',
    items: [
      'UN Global Compact signatory: committed to ten universally accepted principles on human rights, labor, environment, and anti-corruption',
      'ISO 9001:2015 certified quality management system with annual surveillance audits',
      'Anti-bribery and anti-corruption policy: zero-tolerance approach enforced across all jurisdictions',
      'Annual ESG reporting: transparent disclosure of sustainability metrics and progress to partners and stakeholders',
    ],
  },
];

const LETTERS = ['E', 'S', 'G'];
const ICONS = ['ri-leaf-line', 'ri-group-line', 'ri-government-line'];

function getVal(c: Record<string, Record<string, string>> | undefined, section: string, key: string, fallback: string): string {
  return c?.[section]?.[key] || fallback;
}

export default function ESGFramework() {
  const { content } = useSiteContent('sustainability_esg');

  const heading = getVal(content, 'sustainability_esg', 'heading', 'Our ESG Framework');
  const description = getVal(content, 'sustainability_esg', 'description', 'Environmental, Social, and Governance principles are embedded in every layer of our operations — not as an afterthought, but as a core business philosophy.');

  const esgPillars = [0, 1, 2].map((i) => {
    const itemsStr = getVal(content, 'sustainability_esg', `pillar_${i}_items`, defaultPillars[i].items.join('\n'));
    const items = itemsStr.split('\n').filter(Boolean);
    return {
      letter: LETTERS[i],
      title: getVal(content, 'sustainability_esg', `pillar_${i}_title`, defaultPillars[i].title),
      icon: ICONS[i],
      items: items.length > 0 ? items : defaultPillars[i].items,
    };
  });

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {esgPillars.map((pillar) => (
            <div
              key={pillar.letter}
              className="bg-background-50 rounded-[5px] p-7 border border-background-200/70"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 8px' }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-500 text-background-50">
                  <span className="text-[22px] leading-[24px] font-bold">{pillar.letter}</span>
                </div>
                <div>
                  <h3 className="text-[20px] leading-[24px] font-bold text-primary-500">{pillar.title}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <i className={`${pillar.icon} text-secondary-500 text-[14px]`} />
                    <span className="text-[12px] text-foreground-400">Pillar</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-4">
                {pillar.items.map((item) => (
                  <li key={item.slice(0, 40)} className="flex items-start gap-3">
                    <i className="ri-checkbox-circle-line text-secondary-500 mt-[3px] text-[16px] flex-shrink-0" />
                    <span className="text-[13px] leading-[22.1px] text-foreground-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}