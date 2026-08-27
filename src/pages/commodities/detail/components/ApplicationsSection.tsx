type CommodityData = {
  name: string;
  description: string;
  applications: string[];
};

type Props = {
  commodity: CommodityData;
};

export default function ApplicationsSection({ commodity }: Props) {
  return (
    <section className="py-[60px] md:py-[80px] px-4 md:px-10 bg-background-50">
      <div className="max-w-container mx-auto">
        <div className="max-w-[960px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            {/* Description */}
            <div>
              <h2 className="font-heading font-bold text-[22px] md:text-[28px] text-foreground-950 leading-tight mb-5">
                About {commodity.name}
              </h2>
              <p className="font-body text-[14px] text-foreground-600 leading-[23.8px]">
                {commodity.description}
              </p>
            </div>

            {/* Applications */}
            <div>
              <h2 className="font-heading font-bold text-[22px] md:text-[28px] text-foreground-950 leading-tight mb-5">
                Applications
              </h2>
              {!Array.isArray(commodity.applications) || commodity.applications.length === 0 ? (
                <p className="font-body text-[14px] text-foreground-500 italic">
                  No applications listed yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {commodity.applications.map((app: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-background-100 rounded-[5px]"
                    >
                      <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary-500 text-background-50 text-[13px] shrink-0 mt-[1px]">
                        {idx + 1}
                      </span>
                      <span className="font-body text-[14px] text-foreground-700 leading-relaxed pt-[3px]">
                        {app}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}