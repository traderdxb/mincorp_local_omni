import { useSiteContent } from '@/hooks/useSiteContent';

const defaultReasons = [
  {
    icon: 'ri-user-star-line',
    title: 'Dedicated Desk Manager',
    desc: 'Every client gets a single point of contact who understands your business, your specs, and your timeline. No bouncing between departments — one person, end-to-end accountability.',
  },
  {
    icon: 'ri-timer-flash-line',
    title: 'Quote in 24 Hours',
    desc: 'We commit to delivering competitive price quotes within one business day. Speed matters in commodity markets, and our pre-qualified supplier network makes fast, accurate quoting possible.',
  },
  {
    icon: 'ri-shield-flash-line',
    title: 'Payment Protection',
    desc: 'All transactions are backed by LC terms from major international banks. Your payment is only released after independent quality verification at the load port.',
  },
  {
    icon: 'ri-global-line',
    title: '18-Country Reach',
    desc: 'Active supply chains across Asia, Africa, the Middle East, Europe, and Latin America. Wherever your demand is, we likely already have a reliable supply route.',
  },
  {
    icon: 'ri-file-copy-2-line',
    title: 'Full Documentation',
    desc: 'Every shipment comes with a complete document package — Certificate of Origin, SGS/Intertek inspection, bill of lading, packing list, and any country-specific certificates.',
  },
  {
    icon: 'ri-recycle-line',
    title: 'Sustainability Tracked',
    desc: 'We track carbon intensity per shipment route, prioritize suppliers with environmental certifications, and provide ESG data to partners who require it for their own reporting.',
  },
];

const ICONS = ['ri-user-star-line', 'ri-timer-flash-line', 'ri-shield-flash-line', 'ri-global-line', 'ri-file-copy-2-line', 'ri-recycle-line'];

function getVal(c: Record<string, Record<string, string>> | undefined, section: string, key: string, fallback: string): string {
  return c?.[section]?.[key] || fallback;
}

export default function WhyChooseUs() {
  const { content } = useSiteContent('services_why_us');

  const heading = getVal(content, 'services_why_us', 'heading', 'Why Partner With MinCorp');
  const description = getVal(content, 'services_why_us', 'description', 'In commodity trading, the difference between a good deal and a great partnership comes down to trust, speed, and reliability. Here\'s what sets us apart.');

  const reasons = [0, 1, 2, 3, 4, 5].map((i) => ({
    icon: ICONS[i],
    title: getVal(content, 'services_why_us', `item_${i}_title`, defaultReasons[i].title),
    desc: getVal(content, 'services_why_us', `item_${i}_desc`, defaultReasons[i].desc),
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="flex items-start gap-4 bg-background-50 rounded-[5px] p-5 border border-background-200/70">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-[5px] bg-secondary-500/10 text-secondary-500">
                <i className={`${r.icon} text-[18px]`} />
              </div>
              <div>
                <h4 className="text-[15px] leading-[22px] font-bold text-primary-500 mb-1">{r.title}</h4>
                <p className="text-[13px] leading-[22.1px] text-foreground-600">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}