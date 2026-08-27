import { useSiteContent } from '@/hooks/useSiteContent';

const defaultSteps = [
  {
    step: '01',
    icon: 'ri-chat-3-line',
    title: 'Consult & Scope',
    desc: 'We start by understanding your specific requirements — commodity grade, volume, delivery timeline, target price, and any special certifications needed. Every inquiry gets a dedicated desk manager.',
  },
  {
    step: '02',
    icon: 'ri-search-eye-line',
    title: 'Source & Verify',
    desc: 'Our procurement team identifies the best-matched suppliers from our pre-qualified network. We arrange sample dispatch and independent third-party lab testing — you review the results before committing.',
  },
  {
    step: '03',
    icon: 'ri-shake-hands-line',
    title: 'Contract & Finance',
    desc: 'We finalize the supply contract with clear specifications, delivery terms (FOB/CIF), payment structure, and quality KPIs. Trade finance options are structured to match your working capital cycle.',
  },
  {
    step: '04',
    icon: 'ri-anchor-line',
    title: 'Ship & Track',
    desc: 'Cargo is loaded under independent surveyor supervision. You receive real-time vessel tracking, milestone updates, and full documentation before vessel arrival. We stay engaged until discharge is complete.',
  },
];

const ICONS = ['ri-chat-3-line', 'ri-search-eye-line', 'ri-shake-hands-line', 'ri-anchor-line'];
const STEP_NUMS = ['01', '02', '03', '04'];

function getVal(c: Record<string, Record<string, string>> | undefined, section: string, key: string, fallback: string): string {
  return c?.[section]?.[key] || fallback;
}

export default function ServiceProcess() {
  const { content } = useSiteContent('services_process');

  const heading = getVal(content, 'services_process', 'heading', 'How We Work');
  const description = getVal(content, 'services_process', 'description', 'A proven four-step process that takes you from inquiry to cargo delivery — transparent, structured, and built for repeat business.');

  const steps = [0, 1, 2, 3].map((i) => ({
    step: STEP_NUMS[i],
    icon: ICONS[i],
    title: getVal(content, 'services_process', `step_${i}_title`, defaultSteps[i].title),
    desc: getVal(content, 'services_process', `step_${i}_desc`, defaultSteps[i].desc),
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.step} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-[2px] bg-accent-500/20" />
              )}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-500 text-primary-500 mb-5">
                  <i className={`${s.icon} text-[22px]`} />
                </div>
                <span className="block text-[11px] leading-[14px] font-bold text-accent-500 tracking-widest mb-2">
                  {s.step}
                </span>
                <h4 className="text-[17px] leading-[22px] font-bold text-background-50 mb-3">{s.title}</h4>
                <p className="text-[13px] leading-[22.1px] text-background-300">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}