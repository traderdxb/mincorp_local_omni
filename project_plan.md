# MinCorp Trading Company — Website

## 1. Project Description
MinCorp Trading LLC is a B2B commodity trading company. This website is a corporate presence designed to build trust with potential partners and capture leads. It does NOT handle online transactions. A private admin/CMS section allows staff to manage content, images, and upload technical specifications (spreadsheets) for commodities.

**Target audience:** International B2B buyers, industrial partners, sourcing managers.
**Core value:** Establish credibility, showcase commodities range, provide transparent technical specs, capture qualified inquiries.

## 2. Page Structure

### Public
- `/` — Home
- `/about` — About Us
- `/commodities` — Commodities index (all categories)
- `/commodities/:slug` — Commodity detail page (with tech specs table)
- `/services` — Services / Capabilities
- `/sustainability` — Sustainability & responsibility
- `/contact` — Contact + lead capture form

### Admin (CMS)
- `/admin/login` — Staff login
- `/admin/dashboard` — Overview
- `/admin/commodities` — Manage commodities (add/edit/delete)
- `/admin/commodities/:id/specs` — Upload technical spec spreadsheets
- `/admin/media` — Manage image assets
- `/admin/leads` — View captured leads

## 3. Core Features
- [x] Design system per brand guide (Deep Teal / Gold / Roboto)
- [x] Public marketing site (home, about, services, sustainability)
- [x] Commodities catalog with detail pages
- [x] Technical specifications table (chemical composition, extraction date, etc.)
- [x] Contact / lead capture form
- [x] Admin authentication
- [x] Admin: manage commodities & content
- [x] Admin: upload spreadsheets → parse → store as tech specs
- [x] Admin: manage media library
- [x] Admin: view captured leads

## 4. Data Model (Supabase — future phase)

### commodities
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| slug | text | URL slug |
| name | text | Display name |
| category | text | Category |
| short_description | text | Card summary |
| description | text | Full description |
| hero_image_url | text | Hero image |
| gallery | jsonb | Additional images |
| created_at | timestamptz | |

### commodity_specs
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| commodity_id | uuid | FK |
| batch_ref | text | Batch or extraction reference |
| extraction_date | date | |
| composition | jsonb | Chemical composition rows |
| source_file | text | Uploaded spreadsheet URL |
| created_at | timestamptz | |

### leads
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| name | text | |
| company | text | |
| email | text | |
| phone | text | |
| country | text | |
| commodity_interest | text | |
| message | text | |
| created_at | timestamptz | |

### media
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| name | text | |
| url | text | Storage URL |
| type | text | image/document |
| created_at | timestamptz | |

## 5. Backend / Third-party Integration
- **Supabase**: required for Auth (admin), Database (commodities, specs, leads, media), Storage (images + spreadsheets). To be connected before Phase 4.
- **Form**: Contact form will use Readdy Form for lead capture (fallback if Supabase not yet connected).

## 6. Development Phase Plan

### Phase 1 — Foundation & Home *(in progress)*
- Design system implementation (colors, typography, base components)
- Shared Navigation + Footer components
- Home page (hero, capabilities, featured commodities, trust markers, CTA)

### Phase 2 — Core marketing pages *(completed)*
- About Us
- Services
- Sustainability

### Phase 3 — Commodities catalog
- Commodities index page
- Commodity detail template with tech specs table

### Phase 4 — Contact & lead capture
- Contact page with lead form (Readdy form integration)

### Phase 5 — Admin CMS (requires Supabase)
- Connect Supabase, set up schema + RLS + Storage buckets
- Admin auth + dashboard
- CRUD for commodities
- Spreadsheet parsing & tech specs upload
- Media library
- Leads viewer