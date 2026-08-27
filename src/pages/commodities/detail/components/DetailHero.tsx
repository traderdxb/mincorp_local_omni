import { Link } from 'react-router-dom';

type KeySpec = { label: string; value: string };

type CommodityData = {
  slug: string;
  name: string;
  category: string;
  hero_image_url: string;
  short_description: string;
};

type Props = {
  commodity: CommodityData;
};

export default function DetailHero({ commodity }: Props) {
  return (
    <section className="relative h-[420px] md:h-[520px] flex items-end overflow-hidden">
      <img
        src={commodity.hero_image_url}
        alt={commodity.name}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/25" />

      <div className="relative z-10 w-full px-4 md:px-10 pb-12 md:pb-16 max-w-container mx-auto">
        <nav className="flex items-center gap-2 text-[13px] font-body text-background-50/70 mb-4">
          <Link to="/" className="hover:text-accent-500 transition-colors cursor-pointer">
            Home
          </Link>
          <i className="ri-arrow-right-s-line text-[15px]" />
          <Link to="/commodities" className="hover:text-accent-500 transition-colors cursor-pointer">
            Commodities
          </Link>
          <i className="ri-arrow-right-s-line text-[15px]" />
          <span className="text-background-50">{commodity.name}</span>
        </nav>

        <span className="inline-block bg-accent-500/90 text-primary-500 text-[11px] font-heading font-bold px-3 py-1 rounded-[3px] tracking-wide uppercase mb-3 whitespace-nowrap">
          {commodity.category}
        </span>

        <h1 className="font-heading font-light text-[36px] md:text-[55px] leading-[1.05] text-background-50 mb-3">
          {commodity.name}
        </h1>

        <p className="font-body text-[15px] md:text-[17px] text-background-50/85 max-w-[680px] leading-relaxed">
          {commodity.short_description}
        </p>
      </div>
    </section>
  );
}