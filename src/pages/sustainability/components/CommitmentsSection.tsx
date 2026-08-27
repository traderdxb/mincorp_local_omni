import { useSiteContent } from '@/hooks/useSiteContent';

const defaultCommitments = [
  {
    icon: 'ri-road-map-line',
    title: '2030 Carbon Roadmap',
    desc: 'We are developing a structured roadmap to reduce our Scope 1, 2, and 3 emissions by 30% by 2030, with annual progress milestones and third-party verification.',
  },
  {
    icon: 'ri-hand-heart-line',
    title: 'Community Development Fund',
    desc: '1% of annual net profits is allocated to community projects in our key sourcing regions — including clean water infrastructure, school construction, and vocational training programs.',
  },
  {
    icon: 'ri-plant-line',
    title: 'Reforestation Partnership',
    desc: 'In partnership with local NGOs, MinCorp has committed to planting 50,000 trees by 2028 across degraded landscapes in Africa and South Asia where we source commodities.',
  },
  {
    icon: 'ri-shield-user-line',
    title: 'Supplier Empowerment Program',
    desc: 'We provide free training and capacity building to small and mid-sized suppliers in developing markets, helping them meet international ESG standards and access global markets.',
  },
  {
    icon: 'ri-recycle-line',
    title: 'Circular Economy Advocacy',
    desc: 'We actively promote industrial by-products — such as GBFS and fly ash — that replace virgin raw materials in construction, reducing landfill waste and carbon emissions.',
  },
  {
    icon: 'ri-file-chart-line',
    title: 'Transparent Reporting',
    desc: 'Annual ESG report published on our website with third-party audited metrics. Partners can request detailed environmental impact data for any shipment upon inquiry.',
  },
];

const ICONS = ['ri-road-map-line', 'ri-hand-heart-line', 'ri-plant-line', 'ri-shield-user-line', 'ri-recycle-line', 'ri-file-chart-line'];

function getVal(c: Record<string, Record<string, string>> | undefined, section: string, key: string, fallback: string): string {
  return c?.[section]?.[key] || fallback;
}

export default function CommitmentsSection() {
  const { content } = useSiteContent('sustainability_commitments');

  const heading = getVal(content, 'sustainability_commitments', 'heading', 'Future Commitments');
  const description = getVal(content, 'sustainability_commitments', 'description', 'Sustainability is a journey, not a destination. These are the concrete commitments we\'re making today to build a better trading ecosystem for tomorrow.');

  const commitments = [0, 1, 2, 3, 4, 5].map((i) => ({
    icon: ICONS[i],
    title: getVal(content, 'sustainability_commitments', `item_${i}_title`, defaultCommitments[i].title),
    desc: getVal(content, 'sustainability_commitments', `item_${i}_desc`, defaultCommitments[i].desc),
  }));

  return (
    <section className="bg-background-900 py-16 md:py-24">
      <div className="max-w-container mx-auto px-4 md:px-10">
        <div className="text-center mb-14">
          <h2 className="text-[28px] md:text-[42px] leading-[1.1] font-bold text-background-50">
            {heading}
          </h2>
          <p className="mt-4 text-[14px] leading-[23.8px] text-background-300 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commitments.map((c) => (
            <div
              key={c.title}
              className="bg-background-50/5 border border-background-50/10 rounded-[5px] p-6 hover:border-accent-500/30 transition-colors"
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-[5px] bg-accent-500/15 text-accent-500 mb-4">
                <i className={`${c.icon} text-[20px]`} />
              </div>
              <h4 className="text-[17px] leading-[22px] font-bold text-background-50 mb-3">{c.title}</h4>
              <p className="text-[13px] leading-[22.1px] text-background-300">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}