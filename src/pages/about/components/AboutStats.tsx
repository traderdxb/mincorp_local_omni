import { useSiteContent } from '@/hooks/useSiteContent';

const defaultStats = [
  { value: '15+', label: 'Years in Trading' },
  { value: '18+', label: 'Countries Served' },
  { value: '140+', label: 'Active Partners' },
  { value: '2.4M+', label: 'Metric Tonnes / Year' },
  { value: '9', label: 'Commodity Categories' },
  { value: 'ISO', label: '9001 Certified' },
];

function getVal(c: Record<string, Record<string, string>> | undefined, section: string, key: string, fallback: string): string {
  return c?.[section]?.[key] || fallback;
}

export default function AboutStats() {
  const { content } = useSiteContent('about_stats');

  const stats = [0, 1, 2, 3, 4, 5].map((i) => ({
    value: getVal(content, 'about_stats', `stat_${i}_value`, defaultStats[i].value),
    label: getVal(content, 'about_stats', `stat_${i}_label`, defaultStats[i].label),
  }));

  return (
    <section className="bg-background-100 py-14 md:py-20">
      <div className="max-w-container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[32px] md:text-[42px] leading-[1.1] font-bold text-primary-500">
                {s.value}
              </div>
              <div className="mt-2 text-[12px] leading-[18px] font-bold text-foreground-400 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}