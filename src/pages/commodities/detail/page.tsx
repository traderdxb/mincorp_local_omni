import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '@/lib/supabase';
import SiteLayout from '@/components/feature/SiteLayout';
import { LinkButton } from '@/components/base/Button';
import DetailHero from './components/DetailHero';
import SpecsTable from './components/SpecsTable';
import ApplicationsSection from './components/ApplicationsSection';
import RelatedCommodities from './components/RelatedCommodities';
import NotFound from '@/pages/NotFound';
import { aggregatesCommodity } from '@/mocks/aggregates';
import { commodities as defaultCommodities } from '@/mocks/commodities';

type KeySpec = { label: string; value: string };
type DetailedSpec = { label: string; value: string; method?: string };

type CommodityData = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  description: string;
  hero_image_url: string;
  card_image_url: string;
  key_specs: KeySpec[];
  applications: string[];
  detailed_specs: DetailedSpec[];
};

function findMockCommodity(slug: string): CommodityData | null {
  if (slug === aggregatesCommodity.slug) return aggregatesCommodity;
  const found = defaultCommodities.find((c) => c.slug === slug);
  if (!found) return null;
  return {
    id: `mock-${found.slug}`,
    slug: found.slug,
    name: found.name,
    category: found.category,
    short_description: found.shortDescription,
    description: found.description,
    hero_image_url: found.heroImage,
    card_image_url: found.cardImage,
    key_specs: found.keySpecs,
    applications: found.applications,
    detailed_specs: found.keySpecs.map((s) => ({ label: s.label, value: s.value })),
  };
}

export default function CommodityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [commodity, setCommodity] = useState<CommodityData | null | undefined>(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    async function load() {
      try {
        const { data, error: supabaseError } = await supabase
          .from('commodities')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        if (cancelled) return;
        if (supabaseError) throw supabaseError;
        const localCommodity = findMockCommodity(slug);
        setCommodity((data ?? localCommodity) as CommodityData | null);
      } catch {
        if (cancelled) return;
        const localCommodity = findMockCommodity(slug);
        if (localCommodity) {
          setCommodity(localCommodity);
        } else {
          setError('Failed to load commodity');
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  // Still loading
  if (commodity === undefined && !error) {
    return (
      <SiteLayout>
        <div className="flex items-center justify-center py-32">
          <span className="w-8 h-8 flex items-center justify-center">
            <i className="ri-loader-4-line animate-spin text-2xl text-primary-500"></i>
          </span>
        </div>
      </SiteLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <SiteLayout>
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <p className="text-foreground-600 text-sm mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary-500 text-sm underline cursor-pointer whitespace-nowrap"
          >
            Retry
          </button>
        </div>
      </SiteLayout>
    );
  }

  if (!commodity) return <NotFound />;

  return (
    <SiteLayout>
      <DetailHero commodity={commodity} />

      {/* Quick key specs bar */}
      {Array.isArray(commodity.key_specs) && commodity.key_specs.length > 0 && (
        <section className="py-6 px-4 md:px-10 bg-primary-500">
          <div className="max-w-container mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {commodity.key_specs.map((spec) => (
              <div key={spec.label} className="flex items-center gap-2">
                <span className="font-body text-[12px] text-background-50/70 uppercase tracking-wider">
                  {spec.label}
                </span>
                <span className="font-heading font-bold text-[15px] text-background-50">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <ApplicationsSection commodity={commodity} />
      <SpecsTable specs={Array.isArray(commodity.detailed_specs) ? commodity.detailed_specs : []} />
      <RelatedCommodities current={commodity} />

      {/* Inquiry CTA */}
      <section className="py-[60px] md:py-[80px] px-4 md:px-10 bg-primary-500">
        <div className="max-w-container mx-auto text-center">
          <h2 className="font-heading font-light text-[28px] md:text-[42px] text-background-50 leading-tight mb-4">
            Interested in {commodity.name}?
          </h2>
          <p className="font-body text-[15px] text-background-50/80 max-w-[560px] mx-auto mb-8 leading-relaxed">
            Tell us your grade, volume, destination port, and timeline — our desk will respond with pricing and availability within 24 hours.
          </p>
          <LinkButton to="/contact" variant="gold">
            Enquire Now
            <i className="ri-arrow-right-line text-[15px]" />
          </LinkButton>
        </div>
      </section>
    </SiteLayout>
  );
}