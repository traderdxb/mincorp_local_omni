import aggregatesCardImage from '@/assets/images/aggregates_card_1787761817223.jpg';
import aggregatesHeroImage from '@/assets/images/aggregates_hero_1787761831250.jpg';

export type LocalCommodity = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  description: string;
  hero_image_url: string;
  card_image_url: string;
  key_specs: { label: string; value: string }[];
  applications: string[];
  detailed_specs: { label: string; value: string; method?: string }[];
};

export const aggregatesCommodity: LocalCommodity = {
  id: 'local-aggregates',
  slug: 'aggregates',
  name: 'Aggregates',
  category: 'Building Materials',
  short_description: 'Consistent fine, coarse, subbase, roadbase, and wet mix aggregates for major construction and infrastructure projects.',
  description: 'MinCorp supplies graded aggregates for asphalt, concrete, highways, airports, and other civil infrastructure applications. Available sizes and blends are matched to project requirements and supported by recognized ASTM, BS, UAE municipality, DOT Abu Dhabi, RTA Dubai, and highway agency standards.',
  hero_image_url: aggregatesHeroImage,
  card_image_url: aggregatesCardImage,
  key_specs: [
    { label: 'Size Range', value: '0–5 mm to 0–50 mm' },
    { label: 'Products', value: 'Fine / Coarse / Roadbase / Wet Mix' },
    { label: 'Standards', value: 'ASTM / BS / UAE specs' },
  ],
  applications: [
    'Asphalt production',
    'Concrete production',
    'Roads and highways',
    'Airports and runways',
    'Pavement Concrete Construction (PCC)',
    'Dams and reservoirs',
    'Wet Mix Macadam',
    'Filter material',
    'Mass concrete',
    'Hard stand areas and car parks',
    'Filling material',
    'Shotcrete concrete',
  ],
  detailed_specs: [
    { label: 'Fine Aggregate', value: '0–5 mm; classified crushed sand (<3% filler); crushed sand (9%–11% filler)', method: 'ASTM C33/C33M-08; ASTM D1073; BS 882; Abu Dhabi & Al Ain Municipality specs' },
    { label: 'Crushed (Coarse) Aggregate', value: '5–10 mm, 10–20 mm, 20–25 mm, 20–32 mm, 20–37.5 mm, 20–42 mm', method: 'DOT Abu Dhabi; RTA Dubai; all international standards' },
    { label: 'Subbase & Roadbase', value: '0–42 mm; 0–50 mm', method: 'BS 13285-2003; ASTM D1241; Highway Works Vol. 1-800; UAE municipality specs' },
    { label: 'Wet Mix', value: '0–42 mm', method: 'BS 13285-2003; ASTM D1241; DOT Abu Dhabi; RTA Dubai; highway agency standard' },
  ],
};
