import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '@/lib/supabase';

type CommodityRow = {
  slug: string;
  name: string;
  category: string;
  short_description: string;
  card_image_url: string;
};

type Props = {
  current: { slug: string; category: string };
};

export default function RelatedCommodities({ current }: Props) {
  const [related, setRelated] = useState<CommodityRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data } = await supabase
          .from('commodities')
          .select('slug, name, category, short_description, card_image_url')
          .eq('category', current.category)
          .neq('slug', current.slug)
          .limit(5);
        if (!cancelled && data) {
          setRelated(data as CommodityRow[]);
        }
      } catch {
        // silently fail — related section is auxiliary
      }
    }
    load();
    return () => { cancelled = true; };
  }, [current.slug, current.category]);

  if (related.length === 0) return null;

  return (
    <section className="py-[60px] md:py-[80px] px-4 md:px-10 bg-background-100">
      <div className="max-w-container mx-auto">
        <h2 className="font-heading font-bold text-[22px] md:text-[28px] text-foreground-950 leading-tight mb-3 text-center">
          More in {current.category}
        </h2>
        <p className="font-body text-[14px] text-foreground-500 text-center mb-10">
          Explore other commodities in this category
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[960px] mx-auto">
          {related.map((c) => (
            <Link
              key={c.slug}
              to={`/commodities/${c.slug}`}
              className="group flex items-center gap-4 p-4 bg-background-50 rounded-[5px] transition-all duration-300 hover:-translate-y-[2px] cursor-pointer"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 8px' }}
            >
              <div className="w-14 h-14 shrink-0 rounded-[5px] overflow-hidden">
                <img
                  src={c.card_image_url}
                  alt={c.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-heading font-bold text-[14px] text-foreground-950 group-hover:text-primary-500 transition-colors truncate">
                  {c.name}
                </span>
                <span className="font-body text-[12px] text-foreground-500 line-clamp-1">
                  {c.short_description}
                </span>
              </div>
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-500 text-background-50 text-[13px] shrink-0 ml-auto transition-transform group-hover:translate-x-[2px]">
                <i className="ri-arrow-right-line" />
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/commodities"
            className="inline-flex items-center gap-2 font-heading font-bold text-[14px] text-secondary-500 hover:text-primary-500 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-line" />
            Back to all commodities
          </Link>
        </div>
      </div>
    </section>
  );
}