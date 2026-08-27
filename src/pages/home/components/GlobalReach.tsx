import { useSiteContent } from '@/hooks/useSiteContent';

const defaultRegions = [
  { name: 'South Asia', ports: 'Mundra, Nhava Sheva, Chennai, Colombo' },
  { name: 'Middle East', ports: 'Jebel Ali, Sohar, Dammam' },
  { name: 'East Africa', ports: 'Mombasa, Dar es Salaam, Djibouti' },
  { name: 'South East Asia', ports: 'Singapore, Port Klang, Jakarta' },
  { name: 'North Africa', ports: 'Alexandria, Casablanca, Tunis' },
  { name: 'Europe', ports: 'Rotterdam, Antwerp, Piraeus' },
];

function getVal(c: Record<string, Record<string, string>> | undefined, section: string, key: string, fallback: string): string {
  return c?.[section]?.[key] || fallback;
}

export default function GlobalReach() {
  const { content } = useSiteContent('home_global_reach');

  const sectionLabel = getVal(content, 'home_global_reach', 'section_label', 'Global reach');
  const heading = getVal(content, 'home_global_reach', 'heading', 'Connected ports. Committed partners. Consistent delivery.');
  const description = getVal(content, 'home_global_reach', 'description', 'With active freight lanes across six trading regions, MinCorp maintains steady vessel schedules, warehouse capacity, and local agents at every key discharge port.');

  const mapImage = getVal(content, 'home_global_reach', 'map_image', 'https://readdy.ai/api/search-image?query=Stylized%20abstract%20world%20map%20visualization%20with%20glowing%20trade%20routes%20and%20amber%20gold%20accent%20nodes%20on%20deep%20teal%20navy%20background%2C%20flowing%20light%20lines%20connecting%20continents%20across%20ocean%2C%20minimalist%20editorial%20B2B%20aesthetic%2C%20cinematic%20detailed%20composition%2C%20geopolitical%20trading%20infographic%20style&width=1200&height=1200&seq=mincorp-global-map-2026&orientation=squarish');

  const regions = [0, 1, 2, 3, 4, 5].map((i) => ({
    name: getVal(content, 'home_global_reach', `region_${i}_name`, defaultRegions[i].name),
    ports: getVal(content, 'home_global_reach', `region_${i}_ports`, defaultRegions[i].ports),
  }));

  return (
    <section className="bg-background-100 py-16 md:py-[100px]">
      <div className="max-w-container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="text-[12px] tracking-[0.2em] uppercase text-secondary-600 font-bold mb-4">
              {sectionLabel}
            </div>
            <h2 className="font-heading font-bold text-primary-500 text-[32px] md:text-[42px] leading-tight">
              {heading}
            </h2>
            <p className="mt-6 text-foreground-600 text-[15px] leading-[26px] max-w-xl">
              {description}
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {regions.map((r) => (
                <div key={r.name} className="bg-background-50 rounded-[5px] p-4 border border-background-200">
                  <div className="flex items-center gap-2">
                    <i className="ri-map-pin-2-line text-accent-500 text-[16px]" />
                    <span className="font-heading font-bold text-primary-500 text-[15px]">{r.name}</span>
                  </div>
                  <p className="mt-2 text-[13px] text-foreground-600 leading-[20px]">{r.ports}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-[5px] overflow-hidden bg-primary-500"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 12px 32px' }}
            >
              <img
                src={mapImage}
                alt="MinCorp global trade routes"
                className="w-full h-[520px] object-cover object-top mix-blend-lighten opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-primary-950/40" />

              <div className="absolute top-8 left-8 bg-background-50 rounded-[5px] px-4 py-3">
                <div className="text-[10px] tracking-[0.15em] uppercase text-foreground-500">Active lanes</div>
                <div className="text-primary-500 font-bold text-[24px] leading-none mt-1">42</div>
              </div>
              <div className="absolute bottom-8 right-8 bg-accent-500 text-primary-500 rounded-[5px] px-4 py-3">
                <div className="text-[10px] tracking-[0.15em] uppercase font-bold">Response time</div>
                <div className="font-bold text-[24px] leading-none mt-1">&lt; 24h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}