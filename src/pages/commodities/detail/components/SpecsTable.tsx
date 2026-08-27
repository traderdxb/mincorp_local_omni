type DetailedSpec = { label: string; value: string; method?: string };

type Props = {
  specs: DetailedSpec[];
};

export default function SpecsTable({ specs }: Props) {
  return (
    <section className="py-[60px] md:py-[80px] px-4 md:px-10 bg-background-100">
      <div className="max-w-container mx-auto">
        <div className="max-w-[960px] mx-auto">
          <h2 className="font-heading font-bold text-[28px] md:text-[36px] text-foreground-950 leading-tight mb-3 text-center">
            Technical Specifications
          </h2>
          <p className="font-body text-[14px] text-foreground-500 text-center mb-10 max-w-[520px] mx-auto leading-relaxed">
            Typical values based on recent shipments. Certificates of analysis are provided for every consignment with third-party inspection data.
          </p>

          {specs.length === 0 ? (
            <div className="bg-background-50 rounded-[5px] px-6 py-16 text-center">
              <span className="w-12 h-12 inline-flex items-center justify-center mb-4">
                <i className="ri-file-text-line text-4xl text-foreground-300"></i>
              </span>
              <p className="text-sm text-foreground-400">
                Detailed specifications are being updated. Contact our desk for current specs.
              </p>
            </div>
          ) : (
            <div
              className="bg-background-50 rounded-[5px] overflow-hidden"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 8px' }}
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary-500">
                    <th className="font-heading font-bold text-[12px] text-background-50 uppercase tracking-wider px-6 py-4 w-8">
                      #
                    </th>
                    <th className="font-heading font-bold text-[12px] text-background-50 uppercase tracking-wider px-6 py-4">
                      Property
                    </th>
                    <th className="font-heading font-bold text-[12px] text-background-50 uppercase tracking-wider px-6 py-4">
                      Typical Value
                    </th>
                    <th className="font-heading font-bold text-[12px] text-background-50 uppercase tracking-wider px-6 py-4 hidden sm:table-cell">
                      Test Method
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {specs.map((spec, idx) => (
                    <tr
                      key={spec.label + idx}
                      className={`border-b border-background-200 transition-colors hover:bg-background-50 ${
                        idx % 2 === 1 ? 'bg-background-50/60' : 'bg-background-50'
                      }`}
                    >
                      <td className="px-6 py-4 text-[13px] text-foreground-400 font-body">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-foreground-900 font-body font-bold">
                        {spec.label}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-primary-500 font-heading font-bold">
                        {spec.value}
                      </td>
                      <td className="px-6 py-4 text-[12px] text-foreground-400 font-body hidden sm:table-cell">
                        {spec.method || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="font-body text-[12px] text-foreground-400 mt-4 text-center">
            Specifications are typical and may vary by origin, batch, and season. Contact our desk for live specs on current available lots.
          </p>
        </div>
      </div>
    </section>
  );
}