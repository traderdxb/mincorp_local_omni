import aggregatesCardImage from '@/assets/images/aggregates_card_1787761817223.jpg';
import aggregatesHeroImage from '@/assets/images/aggregates_hero_1787761831250.jpg';

export type Commodity = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  cardImage: string;
  keySpecs: { label: string; value: string }[];
  applications: string[];
};

export const commodities: Commodity[] = [
  {
    slug: 'aggregates',
    name: 'Aggregates',
    category: 'Building Materials',
    shortDescription: 'Consistent fine, coarse, subbase, roadbase, and wet mix aggregates for major construction and infrastructure projects.',
    description: 'MinCorp supplies graded aggregates for asphalt, concrete, highways, airports, and other civil infrastructure applications. Available sizes and blends are matched to project requirements and supported by recognized ASTM, BS, UAE municipality, DOT Abu Dhabi, RTA Dubai, and highway agency standards.',
    heroImage: aggregatesHeroImage,
    cardImage: aggregatesCardImage,
    keySpecs: [
      { label: 'Size Range', value: '0–5 mm to 0–50 mm' },
      { label: 'Products', value: 'Fine / Coarse / Roadbase / Wet Mix' },
      { label: 'Standards', value: 'ASTM / BS / UAE specs' },
    ],
    applications: ['Asphalt production', 'Concrete production', 'Roads and highways', 'Airports and runways', 'Pavement Concrete Construction (PCC)', 'Dams and reservoirs'],
  },
  {
    slug: 'iron-ore',
    name: 'Iron Ore',
    category: 'Metals & Minerals',
    shortDescription: 'High-grade hematite and magnetite iron ore fines and lumps sourced from certified mines.',
    description: 'MinCorp supplies premium iron ore in fines and lump form with Fe content ranging from 58% to 65%. Consistent quality, verified moisture levels, and reliable shipment schedules make our iron ore a preferred choice for steel mills and integrated foundries across Asia and the Middle East.',
    heroImage: 'https://readdy.ai/api/search-image?query=Industrial%20iron%20ore%20mining%20site%20with%20rich%20reddish%20brown%20ore%20piles%2C%20heavy%20mining%20trucks%20in%20background%2C%20cinematic%20golden%20hour%20light%2C%20clean%20industrial%20photography%2C%20deep%20teal%20sky%2C%20professional%20commodity%20trading%20aesthetic%2C%20highly%20detailed%20texture%20of%20mineral%20ore&width=1600&height=900&seq=mincorp-hero-iron-ore&orientation=landscape',
    cardImage: 'https://readdy.ai/api/search-image?query=Close%20up%20of%20high%20grade%20iron%20ore%20lumps%20with%20reddish%20brown%20mineral%20texture%20on%20clean%20light%20studio%20background%2C%20professional%20product%20photography%2C%20soft%20diffuse%20light%2C%20industrial%20commodity%20trading%20catalog%20aesthetic%2C%20crisp%20detail%20and%20mineral%20surface&width=800&height=600&seq=mincorp-card-iron-ore&orientation=landscape',
    keySpecs: [
      { label: 'Fe Content', value: '58% - 65%' },
      { label: 'Form', value: 'Fines / Lump' },
      { label: 'Moisture', value: '< 8%' },
    ],
    applications: ['Steel manufacturing', 'Sinter feed', 'Blast furnace charge'],
  },
  {
    slug: 'metallurgical-coke',
    name: 'Metallurgical Coke',
    category: 'Carbon & Coke',
    shortDescription: 'Low-ash, high-CSR metallurgical coke for blast furnaces and foundries.',
    description: 'Our metallurgical coke is produced from carefully blended coking coals and rigorously tested for CSR, CRI, ash, and sulfur. Grade options tailored to blast furnace, foundry, and ferro-alloy applications.',
    heroImage: 'https://readdy.ai/api/search-image?query=Massive%20industrial%20coke%20plant%20at%20dusk%20with%20towering%20chimneys%20emitting%20soft%20steam%2C%20warm%20amber%20lights%20and%20deep%20teal%20blue%20evening%20sky%2C%20metallurgical%20facility%20aesthetic%2C%20clean%20architectural%20framing%2C%20cinematic%20industrial%20photography&width=1600&height=900&seq=mincorp-hero-coke&orientation=landscape',
    cardImage: 'https://readdy.ai/api/search-image?query=Close%20up%20of%20black%20metallurgical%20coke%20chunks%20with%20detailed%20porous%20texture%20on%20clean%20light%20gray%20studio%20background%2C%20professional%20commodity%20product%20photography%2C%20soft%20directional%20light%2C%20catalog%20aesthetic&width=800&height=600&seq=mincorp-card-coke&orientation=landscape',
    keySpecs: [
      { label: 'Ash', value: '< 12.5%' },
      { label: 'CSR', value: '> 60%' },
      { label: 'Sulfur', value: '< 0.75%' },
    ],
    applications: ['Blast furnace', 'Foundry', 'Ferro-alloys'],
  },
  {
    slug: 'gbfs',
    name: 'GBFS',
    category: 'Building Materials',
    shortDescription: 'Granulated Blast Furnace Slag for cement grinding and green construction.',
    description: 'Granulated Blast Furnace Slag (GBFS) is a valuable supplementary cementitious material. Our GBFS meets IS 12089 and comparable international standards, offering excellent glass content and reactivity for slag cement production.',
    heroImage: 'https://readdy.ai/api/search-image?query=Large%20industrial%20granulated%20blast%20furnace%20slag%20storage%20yard%20with%20conveyors%20and%20light%20gray%20material%20piles%2C%20soft%20overcast%20light%2C%20clean%20industrial%20aesthetic%2C%20deep%20teal%20metal%20structures%2C%20professional%20commodity%20photography&width=1600&height=900&seq=mincorp-hero-gbfs&orientation=landscape',
    cardImage: 'https://readdy.ai/api/search-image?query=Close%20up%20of%20fine%20granulated%20blast%20furnace%20slag%20with%20pale%20gray%20crystalline%20texture%20on%20clean%20white%20studio%20background%2C%20professional%20product%20photography%2C%20soft%20studio%20light%2C%20industrial%20catalog%20aesthetic&width=800&height=600&seq=mincorp-card-gbfs&orientation=landscape',
    keySpecs: [
      { label: 'Glass Content', value: '> 90%' },
      { label: 'Moisture', value: '< 10%' },
      { label: 'Basicity', value: '> 1.0' },
    ],
    applications: ['Slag cement', 'Ground granulated blast slag', 'Green concrete'],
  },
  {
    slug: 'gypsum',
    name: 'Natural Gypsum',
    category: 'Building Materials',
    shortDescription: 'High-purity natural gypsum for cement, plaster, and agriculture.',
    description: 'Natural gypsum with purity above 85%, low chloride and moisture. Available in lump and powder form, suitable for cement retarders, plaster of Paris, wallboard, and soil amendment applications.',
    heroImage: 'https://readdy.ai/api/search-image?query=Vast%20natural%20gypsum%20quarry%20under%20soft%20morning%20light%20with%20pale%20cream%20and%20white%20stone%20terraces%2C%20clean%20professional%20industrial%20photography%2C%20deep%20teal%20sky%2C%20cinematic%20framing%2C%20mineral%20mining%20aesthetic&width=1600&height=900&seq=mincorp-hero-gypsum&orientation=landscape',
    cardImage: 'https://readdy.ai/api/search-image?query=Close%20up%20of%20natural%20gypsum%20rock%20lumps%20with%20crystalline%20white%20texture%20on%20clean%20light%20studio%20background%2C%20professional%20mineral%20product%20photography%2C%20soft%20diffuse%20light%2C%20commodity%20catalog%20aesthetic&width=800&height=600&seq=mincorp-card-gypsum&orientation=landscape',
    keySpecs: [
      { label: 'CaSO4·2H2O', value: '> 85%' },
      { label: 'Moisture', value: '< 6%' },
      { label: 'Chloride', value: '< 0.05%' },
    ],
    applications: ['Cement retarder', 'Plaster', 'Wallboard', 'Soil amendment'],
  },
  {
    slug: 'china-clay',
    name: 'China Clay (Kaolin)',
    category: 'Industrial Minerals',
    shortDescription: 'Processed kaolin with high brightness for ceramics, paper, and paint.',
    description: 'Refined kaolin with brightness up to 85+, controlled particle size, and low iron content. Ideal for ceramics, coated paper, paints, rubber, and cosmetics manufacturing.',
    heroImage: 'https://readdy.ai/api/search-image?query=Industrial%20kaolin%20china%20clay%20processing%20plant%20with%20pristine%20white%20mineral%20piles%20and%20soft%20industrial%20structures%2C%20deep%20teal%20metal%20elements%2C%20clean%20professional%20photography%2C%20natural%20diffuse%20daylight%2C%20mineral%20processing%20aesthetic&width=1600&height=900&seq=mincorp-hero-clay&orientation=landscape',
    cardImage: 'https://readdy.ai/api/search-image?query=Close%20up%20of%20processed%20china%20clay%20kaolin%20powder%20heap%20with%20bright%20clean%20white%20texture%20on%20light%20studio%20background%2C%20professional%20mineral%20product%20photography%2C%20soft%20light%2C%20industrial%20catalog%20aesthetic&width=800&height=600&seq=mincorp-card-clay&orientation=landscape',
    keySpecs: [
      { label: 'Brightness', value: '80 - 88' },
      { label: 'Al2O3', value: '> 34%' },
      { label: 'Fe2O3', value: '< 1.5%' },
    ],
    applications: ['Ceramics', 'Paper coating', 'Paint', 'Rubber'],
  },
  {
    slug: 'cement',
    name: 'Portland Cement',
    category: 'Building Materials',
    shortDescription: 'OPC 43/53 and PPC cement, bulk and bagged, ex-works or CIF.',
    description: 'Ordinary Portland Cement (OPC) 43 and 53 grade, and Portland Pozzolana Cement (PPC), meeting BIS and ASTM standards. Available in bulk vessels and 50 kg bags with third-party inspection.',
    heroImage: 'https://readdy.ai/api/search-image?query=Modern%20cement%20plant%20with%20tall%20silos%20under%20deep%20teal%20blue%20sky%20at%20sunset%2C%20warm%20accent%20lighting%2C%20clean%20professional%20industrial%20photography%2C%20architectural%20geometric%20composition%2C%20heavy%20industry%20aesthetic&width=1600&height=900&seq=mincorp-hero-cement&orientation=landscape',
    cardImage: 'https://readdy.ai/api/search-image?query=Close%20up%20of%20fine%20gray%20portland%20cement%20powder%20with%20smooth%20texture%20on%20clean%20light%20studio%20background%20next%20to%20a%20stacked%20cement%20bag%2C%20professional%20product%20photography%2C%20soft%20light%2C%20industrial%20catalog&width=800&height=600&seq=mincorp-card-cement&orientation=landscape',
    keySpecs: [
      { label: 'Grade', value: 'OPC 43 / 53, PPC' },
      { label: 'Compressive Str.', value: '43 - 53 MPa' },
      { label: 'Packing', value: '50 kg / Bulk' },
    ],
    applications: ['Ready-mix concrete', 'Precast', 'Infrastructure'],
  },
  {
    slug: 'petcoke',
    name: 'Petroleum Coke',
    category: 'Carbon & Coke',
    shortDescription: 'Fuel-grade and calcined petroleum coke for cement kilns and aluminum smelting.',
    description: 'Petroleum coke sourced from major refineries with sulfur options ranging from 3% to 6.5%. Fuel-grade petcoke for cement and power generation; calcined petcoke for aluminum anodes.',
    heroImage: 'https://readdy.ai/api/search-image?query=Petroleum%20refinery%20complex%20at%20dusk%20with%20warm%20amber%20lights%2C%20black%20petcoke%20storage%20yard%20in%20foreground%2C%20deep%20teal%20evening%20sky%2C%20cinematic%20industrial%20photography%2C%20clean%20professional%20energy%20sector%20aesthetic&width=1600&height=900&seq=mincorp-hero-petcoke&orientation=landscape',
    cardImage: 'https://readdy.ai/api/search-image?query=Close%20up%20of%20black%20petroleum%20coke%20granular%20chunks%20with%20detailed%20texture%20on%20clean%20light%20studio%20background%2C%20professional%20industrial%20product%20photography%2C%20soft%20light%2C%20commodity%20catalog%20aesthetic&width=800&height=600&seq=mincorp-card-petcoke&orientation=landscape',
    keySpecs: [
      { label: 'Sulfur', value: '3.0 - 6.5%' },
      { label: 'Grade', value: 'Fuel / Calcined' },
      { label: 'GCV', value: '> 8,000 kcal/kg' },
    ],
    applications: ['Cement kilns', 'Power generation', 'Aluminum smelting'],
  },
  {
    slug: 'fertilizers',
    name: 'Fertilizers',
    category: 'Agri & Chemicals',
    shortDescription: 'Urea, DAP, MOP, and NPK blends for global agricultural markets.',
    description: 'Bulk fertilizer trading of Urea (prilled/granular), DAP, MOP, and specialty NPK blends. Supported by port logistics, phytosanitary certifications, and third-party lab testing.',
    heroImage: 'https://readdy.ai/api/search-image?query=Golden%20agricultural%20field%20at%20sunrise%20with%20fertilizer%20bags%20stacked%20neatly%20in%20foreground%2C%20warm%20amber%20accent%20lighting%2C%20clean%20professional%20agri%20photography%2C%20deep%20teal%20morning%20sky%2C%20cinematic%20framing%2C%20commodity%20trading%20aesthetic&width=1600&height=900&seq=mincorp-hero-fertilizer&orientation=landscape',
    cardImage: 'https://readdy.ai/api/search-image?query=Close%20up%20of%20white%20granular%20urea%20fertilizer%20prills%20heap%20with%20detailed%20texture%20on%20clean%20light%20studio%20background%2C%20professional%20agricultural%20product%20photography%2C%20soft%20light%2C%20commodity%20catalog%20aesthetic&width=800&height=600&seq=mincorp-card-fertilizer&orientation=landscape',
    keySpecs: [
      { label: 'Products', value: 'Urea, DAP, MOP, NPK' },
      { label: 'Form', value: 'Prilled / Granular' },
      { label: 'Purity', value: '> 46% N (Urea)' },
    ],
    applications: ['Field crops', 'Horticulture', 'Plantations'],
  },
  {
    slug: 'fmcg',
    name: 'FMCG Products',
    category: 'FMCG & Trade',
    shortDescription: 'Sugar, edible oils, rice, and packaged staples for wholesale export.',
    description: 'Bulk and containerized shipments of sugar (ICUMSA 45 & 150), refined edible oils, non-basmati rice, and other packaged staples. Complete documentation, halal certification, and end-to-end logistics.',
    heroImage: 'https://readdy.ai/api/search-image?query=Large%20cargo%20port%20terminal%20with%20stacked%20containers%20and%20FMCG%20export%20shipments%20under%20deep%20teal%20blue%20sky%20at%20sunset%2C%20warm%20accent%20highlights%2C%20clean%20professional%20logistics%20photography%2C%20cinematic%20framing%2C%20global%20trade%20aesthetic&width=1600&height=900&seq=mincorp-hero-fmcg&orientation=landscape',
    cardImage: 'https://readdy.ai/api/search-image?query=Assortment%20of%20FMCG%20export%20staples%20including%20white%20sugar%20crystals%20in%20jute%20sack%20and%20rice%20grains%20on%20clean%20light%20studio%20background%2C%20professional%20commodity%20product%20photography%2C%20soft%20light%2C%20catalog%20aesthetic&width=800&height=600&seq=mincorp-card-fmcg&orientation=landscape',
    keySpecs: [
      { label: 'Sugar', value: 'ICUMSA 45 / 150' },
      { label: 'Rice', value: 'IR 64, PR 11' },
      { label: 'Oils', value: 'Refined Palm, Soy' },
    ],
    applications: ['Wholesale distribution', 'Retail packaging', 'Food service'],
  },
];