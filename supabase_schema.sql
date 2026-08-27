-- ==============================================================================
-- MinCorp Trading LLC — Complete Supabase Database Schema, Tables & Seed Data
-- ==============================================================================
-- Run this entire script in your Supabase Dashboard -> SQL Editor -> New Query -> Run
-- It will create all required tables (commodities, leads, media, site_content),
-- setup Row-Level Security (RLS) open policies, and seed all site content and products.
-- ==============================================================================

-- 1. Create Commodities Table
CREATE TABLE IF NOT EXISTS public.commodities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Aggregates',
    short_description TEXT DEFAULT '',
    description TEXT DEFAULT '',
    hero_image_url TEXT DEFAULT '',
    card_image_url TEXT DEFAULT '',
    key_specs JSONB DEFAULT '[]'::jsonb,
    applications JSONB DEFAULT '[]'::jsonb,
    detailed_specs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all expected columns exist on commodities
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Aggregates';
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS short_description TEXT DEFAULT '';
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS hero_image_url TEXT DEFAULT '';
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS card_image_url TEXT DEFAULT '';
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS key_specs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS applications JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS detailed_specs JSONB DEFAULT '[]'::jsonb;

-- 2. Create Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT,
    commodity_interest TEXT,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure leads has name and is_read columns
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS commodity_interest TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- 3. Create Media Table
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT DEFAULT 'image',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure media has name, url, type columns
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS url TEXT;
ALTER TABLE public.media ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'image';

-- 4. Create Site Content Table
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT DEFAULT '',
    content_type TEXT DEFAULT 'text',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(section, key)
);

-- Ensure site_content has correct columns
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS section TEXT;
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS key TEXT;
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS value TEXT DEFAULT '';
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'text';

-- ==============================================================================
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.commodities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All Commodities" ON public.commodities;
CREATE POLICY "Allow All Commodities" ON public.commodities FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All Leads" ON public.leads;
CREATE POLICY "Allow All Leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All Media" ON public.media;
CREATE POLICY "Allow All Media" ON public.media FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All Site Content" ON public.site_content;
CREATE POLICY "Allow All Site Content" ON public.site_content FOR ALL USING (true) WITH CHECK (true);

-- Storage Bucket Setup & Policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow All Storage Media" ON storage.objects;
CREATE POLICY "Allow All Storage Media" ON storage.objects FOR ALL USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

-- ==============================================================================
-- 6. SEED COMMODITIES
-- ==============================================================================

INSERT INTO public.commodities (slug, name, category, short_description, description, hero_image_url, card_image_url, key_specs, detailed_specs, applications)
VALUES
(
  'gabbro-aggregates',
  'Gabbro Aggregates',
  'Aggregates',
  'High-strength crushed igneous rock aggregates for heavy-duty concrete, asphalt, and marine armouring.',
  'MinCorp supplies premium Fujairah and Oman Gabbro aggregates engineered for high-specification infrastructure projects across the GCC and Indian Ocean markets.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  '[{"label":"Specific Gravity","value":"2.75 - 2.95"},{"label":"Water Absorption","value":"< 0.8%"},{"label":"Flakiness Index","value":"< 20%"},{"label":"LA Abrasion","value":"< 16%"}]'::jsonb,
  '[{"label":"Specific Gravity (SSD)","value":"2.82","method":"ASTM C127"},{"label":"Water Absorption","value":"0.65%","method":"ASTM C127"},{"label":"Aggregate Crushing Value","value":"14.2%","method":"BS 812"},{"label":"Soundness (MgSO4)","value":"2.1%","method":"ASTM C88"}]'::jsonb,
  '["High-strength ready-mix concrete","Airport runways & highway wearing courses","Pre-stressed concrete elements","Marine breakwaters & armour rock"]'::jsonb
),
(
  'limestone-aggregates',
  'Limestone Aggregates',
  'Aggregates',
  'Crushed high-purity calcium carbonate stone for general construction, base course, and ready-mix.',
  'High-purity limestone aggregate extracted from premier quarries in the UAE and Oman, offering consistent gradation and strict quality control.',
  'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
  '[{"label":"CaCO3 Content","value":"> 96%"},{"label":"Specific Gravity","value":"2.60 - 2.70"},{"label":"Water Absorption","value":"< 1.5%"},{"label":"LA Abrasion","value":"< 24%"}]'::jsonb,
  '[{"label":"Calcium Carbonate (CaCO3)","value":"97.4%","method":"XRF"},{"label":"Specific Gravity","value":"2.68","method":"ASTM C127"},{"label":"Water Absorption","value":"1.1%","method":"ASTM C127"}]'::jsonb,
  '["Road base & sub-base layer compaction","Commercial and residential ready-mix concrete","Concrete masonry block manufacture","Filler stone & asphalt batching"]'::jsonb
),
(
  'crushed-rock-sand',
  'Manufactured & Crushed Rock Sand',
  'Aggregates',
  'High-grade 0-5mm manufactured crushed sand as an eco-friendly river sand alternative with zero silt contamination.',
  'VSI (Vertical Shaft Impactor) manufactured sand with cubical particle shape and balanced fines distribution for optimal concrete workability.',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  '[{"label":"Gradation Size","value":"0 - 5 mm"},{"label":"Fines Passing 75µm","value":"< 5.0%"},{"label":"Specific Gravity","value":"2.70 - 2.85"},{"label":"Silt / Clay Content","value":"Zero Nil"}]'::jsonb,
  '[{"label":"Fineness Modulus","value":"2.80","method":"ASTM C136"},{"label":"Water Absorption","value":"1.2%","method":"ASTM C128"}]'::jsonb,
  '["Structural concrete ready-mix","Dry mortar & plastering applications","Interlocking paving blocks & precast elements","Bedding sand for utilities"]'::jsonb
),
(
  'silica-sand',
  'Industrial Silica Sand',
  'Industrial Minerals',
  'High-purity quartz sand with >99% SiO2 content for glass making, water filtration, foundries, and coatings.',
  'Washed, classified, and dried silica sand processed to tight mesh specifications with low iron and moisture content.',
  'https://images.unsplash.com/photo-1599818496387-34d3f441502b?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1599818496387-34d3f441502b?auto=format&fit=crop&w=800&q=80',
  '[{"label":"SiO2 Content","value":"> 99.2%"},{"label":"Fe2O3 Content","value":"< 0.025%"},{"label":"Moisture Content","value":"< 0.2%"},{"label":"Mesh Sizing","value":"16-30 / 30-60 / 60-120"}]'::jsonb,
  '[{"label":"Silicon Dioxide (SiO2)","value":"99.45%","method":"XRF"},{"label":"Ferric Oxide (Fe2O3)","value":"0.018%","method":"Spectroscopy"}]'::jsonb,
  '["Float and container glass production","Foundry moulding & precision casting","Potable & industrial water filtration media","Specialty epoxy coatings and mortars"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  hero_image_url = EXCLUDED.hero_image_url,
  card_image_url = EXCLUDED.card_image_url,
  key_specs = EXCLUDED.key_specs,
  detailed_specs = EXCLUDED.detailed_specs,
  applications = EXCLUDED.applications;

-- ==============================================================================
-- 7. SEED SITE CONTENT & IMAGES
-- ==============================================================================

INSERT INTO public.site_content (section, key, value, content_type)
VALUES
-- Homepage Hero
('home_hero', 'badge', 'Global Commodity Trading Partner', 'text'),
('home_hero', 'heading_line1', 'Sourcing certainty for the', 'text'),
('home_hero', 'heading_line2', 'industries that build the world.', 'text'),
('home_hero', 'description', 'From iron ore and metallurgical coke to aggregates, cement, fertilizers, and industrial minerals — MinCorp Trading LLC delivers reliable, quality-assured commodity supply chains to industrial partners across five continents.', 'text'),
('home_hero', 'cta_primary', 'Explore Commodities', 'text'),
('home_hero', 'cta_secondary', 'Request a Quote', 'text'),
('home_hero', 'background_image', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=80', 'image_url'),

-- Homepage About
('home_about', 'badge', 'Who We Are', 'text'),
('home_about', 'heading', 'Bridging Source & Scale in Global Bulk Commodities', 'text'),
('home_about', 'description', 'Headquartered in Dubai, UAE, MinCorp Trading LLC operates at the intersection of resource extraction, international shipping logistics, and industrial end-use. We eliminate supply volatility with direct mine contracts and vessel chartering.', 'text'),
('home_about', 'image', 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80', 'image_url'),

-- Homepage CTA
('home_cta', 'heading', 'Ready to Secure Your Commodity Supply Line?', 'text'),
('home_cta', 'description', 'Connect with our international desk in Dubai for spot cargoes, long-term offtake agreements, and custom port-of-destination pricing.', 'text'),
('home_cta', 'button_text', 'Initiate Enquiry', 'text'),
('home_cta', 'background_image', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80', 'image_url'),

-- About Hero
('about_hero', 'badge', 'About MinCorp', 'text'),
('about_hero', 'title', 'Built on Reliability, Scaled for Global Industry', 'text'),
('about_hero', 'description', 'MinCorp Trading LLC connects premier mining concessions and industrial processors with high-demand manufacturing and infrastructure sectors worldwide.', 'text'),
('about_hero', 'hero_image', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80', 'image_url'),

-- Commodities Hero
('commodities_hero', 'badge', 'Product Portfolio', 'text'),
('commodities_hero', 'title', 'Bulk Commodities & Construction Minerals', 'text'),
('commodities_hero', 'description', 'Certified metallurgical coke, iron ore, gabbro aggregates, limestone, industrial silica sand, and essential minerals tailored for heavy industries.', 'text'),
('commodities_hero', 'hero_image', 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1600&q=80', 'image_url'),

-- Services Hero
('services_hero', 'badge', 'End-to-End Trading', 'text'),
('services_hero', 'title', 'Integrated Supply Chain & Trading Solutions', 'text'),
('services_hero', 'description', 'From mine-mouth procurement to chartering bulk carriers and structured trade financing, MinCorp handles end-to-end commodity logistics.', 'text'),
('services_hero', 'hero_image', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80', 'image_url'),

-- Sustainability Hero
('sustainability_hero', 'badge', 'Responsible Sourcing', 'text'),
('sustainability_hero', 'title', 'Committed to Ethical & Sustainable Mining Trade', 'text'),
('sustainability_hero', 'description', 'Prioritizing low-carbon logistics routes, certified quarry concessions, and strict ESG compliance standards across all sourcing operations.', 'text'),
('sustainability_hero', 'hero_image', 'https://images.unsplash.com/photo-1599818496387-34d3f441502b?auto=format&fit=crop&w=1600&q=80', 'image_url'),

-- Contact Hero & Info
('contact_hero', 'badge', 'Get in Touch', 'text'),
('contact_hero', 'title', 'Contact Our Global Trading Desk', 'text'),
('contact_hero', 'description', 'Speak directly with our commodity trading specialists in Dubai for tenders, pricing indications, and technical specifications.', 'text'),
('contact_hero', 'hero_image', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80', 'image_url'),
('contact_info', 'email', 'trading@mincorptrade.com', 'text'),
('contact_info', 'phone', '+971 4 234 5678', 'text'),
('contact_info', 'address', 'Office 402, Trade Centre Tower, Sheikh Zayed Road, Dubai, UAE', 'text'),
('contact_info', 'hours', 'Mon - Fri: 08:00 - 18:00 (GST)', 'text'),

-- Footer
('footer', 'tagline', 'Global bulk commodity trading and supply chain partner, delivering certified minerals and metals worldwide.', 'text'),
('footer', 'copyright', '© 2026 MinCorp Trading LLC. All rights reserved.', 'text')

ON CONFLICT (section, key) DO UPDATE SET
  value = EXCLUDED.value,
  content_type = EXCLUDED.content_type,
  updated_at = NOW();

-- 8. Seed Sample Lead and Media
INSERT INTO public.leads (name, company, email, phone, country, commodity_interest, message, is_read)
VALUES
('Ahmed Al Mansoori', 'Emirates Infra Construction', 'ahmed@emiratesinfra.ae', '+971 50 456 7890', 'UAE', 'Gabbro Aggregates', 'Requesting FOB quotation for 80,000 MT 20mm Gabbro aggregate for Ras Al Khaimah port delivery.', false),
('Vikram Sharma', 'Coastal ReadyMix Ltd', 'v.sharma@coastalreadymix.in', '+91 98200 12345', 'India', 'Crushed Rock Sand', 'Looking for monthly supply of 30,000 MT 0-5mm manufactured sand CIF Nhava Sheva port.', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.media (name, url, type)
VALUES
('Gabbro Aggregates Quarry High Res', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', 'image'),
('Limestone Aggregate Stockpile', 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80', 'image'),
('Bulk Carrier Loading Mineral Cargo', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80', 'image')
ON CONFLICT DO NOTHING;
