import { Link } from 'react-router-dom';
import { commodities } from '@/mocks/commodities';
import { useSiteContent } from '@/hooks/useSiteContent';

function getVal(c: Record<string, Record<string, string>> | undefined, section: string, key: string, fallback: string): string {
  return c?.[section]?.[key] || fallback;
}

export default function CommoditiesShowcase() {
  const { content } = useSiteContent('home_commodities_showcase');
  const featured = commodities.slice(0, 6);

  const sectionLabel = getVal(content, 'home_commodities_showcase', 'section_label', 'Featured commodities');
  const heading = getVal(content, 'home_commodities_showcase', 'heading', 'A curated portfolio across metals, minerals, energy & agri.');

  return (
    <section className="bg-background-100 py-16 md:py-[100px]">
      <div className="max-w-container mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="text-[12px] tracking-[0.2em] uppercase text-secondary-600 font-bold mb-4">
              {sectionLabel}
            </div>
            <h2 className="font-heading font-bold text-primary-500 text-[32px] md:text-[42px] leading-tight">
              {heading}
            </h2>
          </div>
          <Link
            to="/commodities"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-primary-500 hover:text-primary-600 whitespace-nowrap cursor-pointer"
          >
            Full catalog
            <i className="ri-arrow-right-line" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((c, idx) => (
            <Link
              key={c.slug}
              to={`/commodities/${c.slug}`}
              className="group relative overflow-hidden rounded-[5px] bg-background-50 flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 8px' }}
              data-product-shop
            >
              <div className="relative w-full h-56 overflow-hidden">
                <img
                  src={c.cardImage}
                  alt={`${c.name} product photo`}
                  title={`${c.name} — MinCorp Trading`}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 text-[11px] tracking-[0.12em] uppercase text-primary-500 bg-accent-500 px-2 py-1 rounded-[5px] font-bold">
                    {String(idx + 1).padStart(2, '0')} &middot; {c.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-heading font-bold text-primary-500 text-[20px] leading-[26px]">
                  {c.name}
                </h3>
                <p className="mt-2 text-foreground-600 text-[14px] leading-[23.8px] flex-1">
                  {c.shortDescription}
                </p>
                <div className="mt-5 pt-4 border-t border-background-200 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {c.keySpecs.slice(0, 2).map((s) => (
                      <span key={s.label} className="text-[11px] text-foreground-500 bg-background-100 px-2 py-1 rounded-[3px]">
                        {s.label}: <span className="text-primary-500 font-bold">{s.value}</span>
                      </span>
                    ))}
                  </div>
                  <i className="ri-arrow-right-line text-primary-500 group-hover:text-accent-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}