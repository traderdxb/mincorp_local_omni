import { Link } from 'react-router-dom';

type CommodityRow = {
  slug: string;
  name: string;
  category: string;
  short_description: string;
  card_image_url: string;
  key_specs: { label: string; value: string }[];
};

type Props = {
  commodity: CommodityRow;
};

export default function CommodityCard({ commodity }: Props) {
  return (
    <Link
      to={`/commodities/${commodity.slug}`}
      className="group block bg-background-50 rounded-[5px] overflow-hidden transition-all duration-300 hover:-translate-y-[3px] cursor-pointer"
      style={{ boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 8px' }}
    >
      {/* Image */}
      <div className="relative w-full h-[220px] overflow-hidden">
        <img
          src={commodity.card_image_url}
          alt={commodity.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-primary-500/85 text-background-50 text-[11px] font-heading font-bold px-3 py-1 rounded-[3px] tracking-wide uppercase whitespace-nowrap">
            {commodity.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="font-heading font-bold text-[17px] text-foreground-950 leading-snug group-hover:text-primary-500 transition-colors">
          {commodity.name}
        </h3>

        <p className="font-body text-[13px] text-foreground-600 leading-relaxed line-clamp-2">
          {commodity.short_description}
        </p>

        {/* Key specs */}
        {Array.isArray(commodity.key_specs) && commodity.key_specs.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {commodity.key_specs.slice(0, 3).map((spec) => (
              <span
                key={spec.label}
                className="inline-flex items-center gap-1.5 text-[12px] text-foreground-500 font-body bg-background-100 px-2.5 py-1 rounded-[3px] whitespace-nowrap"
              >
                <span className="w-1 h-1 rounded-full bg-secondary-500 inline-block" />
                <span className="font-bold">{spec.label}:</span>
                {spec.value}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-background-200 mt-1">
          <span className="font-body text-[13px] text-secondary-500 font-bold">
            View details
          </span>
          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-500 text-background-50 text-[14px] transition-transform group-hover:translate-x-[3px]">
            <i className="ri-arrow-right-line" />
          </span>
        </div>
      </div>
    </Link>
  );
}