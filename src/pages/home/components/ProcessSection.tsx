const steps = [
  {
    number: '01',
    icon: 'ri-chat-check-line',
    title: 'Consult & scope',
    text: 'Share your specifications, volumes, and destination. Our desk responds within 24 hours with sourcing options.',
  },
  {
    number: '02',
    icon: 'ri-file-search-line',
    title: 'Sample & verify',
    text: 'We arrange samples, third-party lab tests, and mine or plant visits so you buy with full technical confidence.',
  },
  {
    number: '03',
    icon: 'ri-truck-line',
    title: 'Contract & ship',
    text: 'Transparent contracts, LC-friendly terms, and monitored shipments. Weekly status updates until arrival.',
  },
  {
    number: '04',
    icon: 'ri-repeat-line',
    title: 'Long-term supply',
    text: 'From the first spot cargo to annual off-take agreements — we build supply plans that scale with your operation.',
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-background-900 text-background-50 py-16 md:py-[100px] relative overflow-hidden">
      {/* Decorative accents */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, oklch(var(--secondary-500)) 0%, transparent 60%)' }} />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, oklch(var(--accent-500)) 0%, transparent 60%)' }} />

      <div className="relative max-w-container mx-auto px-4 md:px-10">
        <div className="max-w-3xl">
          <div className="text-[12px] tracking-[0.2em] uppercase text-accent-500 font-bold mb-4">
            How we work
          </div>
          <h2 className="font-heading font-bold text-background-50 text-[32px] md:text-[42px] leading-tight">
            A predictable trading process, from first enquiry to repeat shipments.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div key={s.number} className="relative">
              <div className="bg-background-50/5 border border-background-50/10 rounded-[5px] p-6 h-full">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 flex items-center justify-center rounded-[5px] bg-accent-500 text-primary-500">
                    <i className={`${s.icon} text-[20px]`} />
                  </div>
                  <span className="font-mono text-[24px] text-accent-500/60 font-bold">{s.number}</span>
                </div>
                <h3 className="mt-6 font-heading font-bold text-background-50 text-[18px] leading-[24px]">
                  {s.title}
                </h3>
                <p className="mt-3 text-background-50/70 text-[14px] leading-[23.8px]">
                  {s.text}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 z-10 w-6 h-6 flex items-center justify-center">
                  <i className="ri-arrow-right-line text-accent-500 text-[20px]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}