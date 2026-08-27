import { useState, useMemo, useEffect } from 'react';
import supabase from '@/lib/supabase';
import CommodityCard from './CommodityCard';
import { aggregatesCommodity } from '@/mocks/aggregates';
import { commodities as defaultCommodities } from '@/mocks/commodities';

type CommodityRow = {
  slug: string;
  name: string;
  category: string;
  short_description: string;
  card_image_url: string;
  key_specs: { label: string; value: string }[];
};

const mockCommodityRows: CommodityRow[] = defaultCommodities.map((c) => ({
  slug: c.slug,
  name: c.name,
  category: c.category,
  short_description: c.shortDescription,
  card_image_url: c.cardImage,
  key_specs: c.keySpecs,
}));

export default function CommoditiesGrid() {
  const [commodities, setCommodities] = useState<CommodityRow[]>(mockCommodityRows);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data, error: supabaseError } = await supabase
          .from('commodities')
          .select('slug, name, category, short_description, card_image_url, key_specs')
          .order('created_at', { ascending: true });
        if (cancelled) return;
        if (supabaseError) throw supabaseError;
        const rows = (data ?? []) as CommodityRow[];
        if (rows.length > 0) {
          if (!rows.some((commodity) => commodity.slug === aggregatesCommodity.slug)) {
            rows.push(aggregatesCommodity);
          }
          setCommodities(rows);
        }
      } catch {
        // Fallback to default mock commodities
        if (!cancelled) {
          setCommodities(mockCommodityRows);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const allCategories = useMemo(
    () => Array.from(new Set(commodities.map((c) => c.category))),
    [commodities],
  );
  const filterTabs = ['All', ...allCategories];

  const filtered = useMemo<CommodityRow[]>(() => {
    if (activeCategory === 'All') return commodities;
    return commodities.filter((c) => c.category === activeCategory);
  }, [activeCategory, commodities]);

  if (loading) {
    return (
      <section className="py-[60px] md:py-[80px] px-4 md:px-10 bg-background-100">
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 flex items-center justify-center">
            <i className="ri-loader-4-line animate-spin text-2xl text-primary-500"></i>
          </span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-[60px] md:py-[80px] px-4 md:px-10 bg-background-100">
        <div className="text-center py-20">
          <p className="text-foreground-600 text-sm mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary-500 text-sm underline cursor-pointer whitespace-nowrap"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[60px] md:py-[80px] px-4 md:px-10 bg-background-100">
      <div className="max-w-container mx-auto">
        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filterTabs.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[13px] font-heading font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary-500 text-background-50'
                  : 'bg-background-50 text-foreground-600 hover:text-primary-500 border border-background-200 hover:border-primary-500/30'
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <span className="ml-2 inline-block text-[11px] opacity-80">
                  {cat === 'All' ? commodities.length : commodities.filter((c) => c.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="font-body text-[13px] text-foreground-500 mb-8 text-center">
          Showing <strong className="text-foreground-700">{filtered.length}</strong> of{' '}
          <strong className="text-foreground-700">{commodities.length}</strong> commodities
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((commodity) => (
            <CommodityCard key={commodity.slug} commodity={commodity} />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-body text-foreground-500 text-[15px]">
              No commodities found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}