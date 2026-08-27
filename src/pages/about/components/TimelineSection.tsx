import { useSiteContent } from '@/hooks/useSiteContent';

const defaultMilestones = [
  { year: '2009', title: 'Founded in Dubai', desc: 'MinCorp Trading LLC established in Business Bay, Dubai — starting with a focus on ferrous metals and minerals for the GCC construction boom.' },
  { year: '2012', title: 'Expanded to Asia-Pacific', desc: 'Opened sourcing offices in India and China. Began trading iron ore, coke, and refractories for Asian steel mills.' },
  { year: '2015', title: 'Added Agri & FMCG', desc: 'Diversified into agricultural commodities — fertilizers, sugar, rice, and edible oils. Launched dedicated agri-desk.' },
  { year: '2017', title: 'ISO 9001 Certified', desc: 'Achieved ISO 9001:2015 certification for quality management systems across trading operations and logistics.' },
  { year: '2020', title: '100th Partner Milestone', desc: 'Crossed 100 active trading partners across 18 countries. Launched digital document management for supply chain transparency.' },
  { year: '2023', title: 'Sustainability Charter', desc: 'Published first ESG report. Joined UN Global Compact. Committed to responsible sourcing and carbon-aware logistics.' },
  { year: '2025', title: '2.4M MT Annual Volume', desc: 'Reached 2.4 million metric tonnes in annual trading volume. Strengthened African and Latin American supply chains.' },
];

function getVal(c: Record<string, Record<string, string>> | undefined, section: string, key: string, fallback: string): string {
  return c?.[section]?.[key] || fallback;
}

export default function TimelineSection() {
  const { content } = useSiteContent('about_timeline');

  const heading = getVal(content, 'about_timeline', 'heading', 'Our Journey');
  const description = getVal(content, 'about_timeline', 'description', 'From a single-desk operation to a global commodity trading house — every milestone reflects our commitment to growth, reliability, and partnership.');

  const milestones = [0, 1, 2, 3, 4, 5, 6].map((i) => ({
    year: getVal(content, 'about_timeline', `milestone_${i}_year`, defaultMilestones[i].year),
    title: getVal(content, 'about_timeline', `milestone_${i}_title`, defaultMilestones[i].title),
    desc: getVal(content, 'about_timeline', `milestone_${i}_desc`, defaultMilestones[i].desc),
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

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-accent-500/30 md:-translate-x-px" />

          <div className="flex flex-col gap-10">
            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={m.year} className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="absolute left-4 md:left-1/2 top-1 w-3 h-3 rounded-full bg-accent-500 -translate-x-1/2 z-10" />
                  <div className="hidden md:block md:w-1/2" />
                  <div className={`ml-10 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="inline-block bg-background-50/5 border border-background-50/10 rounded-[5px] p-5 md:p-6">
                      <span className="text-accent-500 text-[20px] leading-[24px] font-bold">{m.year}</span>
                      <h4 className="mt-2 text-[15px] leading-[24px] font-bold text-background-50">{m.title}</h4>
                      <p className="mt-2 text-[13px] leading-[22.1px] text-background-300">{m.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}