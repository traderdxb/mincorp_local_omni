import { useState } from 'react';
import { useSiteContent } from '@/hooks/useSiteContent';

const defaultTestimonials = [
  {
    quote: 'MinCorp has been our reliable iron ore supplier for over three years. Consistent Fe grades, dependable moisture readings, and shipments that arrive when promised. They treat every load like it matters.',
    name: 'Rahul Khanna',
    role: 'Head of Procurement',
    company: 'Ganga Steel Pvt. Ltd.',
  },
  {
    quote: 'Their quality control process is what sets them apart. Every cargo comes with proper third-party inspection, and their team is quick to resolve any documentation issue that comes up.',
    name: 'Fatima Al-Rashid',
    role: 'Supply Chain Director',
    company: 'Emirates Cement Group',
  },
  {
    quote: 'We started with a single trial cargo of GBFS two years ago and now source most of our slag through MinCorp. They understand cement industry specs and never oversell what they cannot deliver.',
    name: 'Peter Okonkwo',
    role: 'Managing Director',
    company: 'Rift Valley Cement',
  },
];

const DEFAULT_AVATARS = [
  'https://readdy.ai/api/search-image?query=Professional%20south%20asian%20male%20procurement%20executive%20portrait%20in%20navy%20suit%20clean%20light%20studio%20background%20soft%20lighting%20corporate%20editorial%20photography%20confident%20warm%20expression&width=400&height=400&seq=mincorp-testimonial-1&orientation=squarish',
  'https://readdy.ai/api/search-image?query=Professional%20middle%20eastern%20female%20supply%20chain%20executive%20portrait%20wearing%20elegant%20hijab%20and%20blazer%20on%20clean%20light%20studio%20background%20soft%20diffuse%20lighting%20corporate%20editorial%20photography%20confident%20expression&width=400&height=400&seq=mincorp-testimonial-2&orientation=squarish',
  'https://readdy.ai/api/search-image?query=Professional%20african%20male%20cement%20industry%20executive%20portrait%20wearing%20dark%20suit%20on%20clean%20light%20studio%20background%20soft%20lighting%20corporate%20editorial%20photography%20confident%20warm%20expression&width=400&height=400&seq=mincorp-testimonial-3&orientation=squarish',
];

function getVal(c: Record<string, Record<string, string>> | undefined, section: string, key: string, fallback: string): string {
  return c?.[section]?.[key] || fallback;
}

export default function TestimonialSection() {
  const { content } = useSiteContent('home_testimonials');
  const [active, setActive] = useState(0);

  const sectionLabel = getVal(content, 'home_testimonials', 'section_label', 'Partner voices');
  const heading = getVal(content, 'home_testimonials', 'heading', 'Trusted across steel, cement, and agri.');
  const description = getVal(content, 'home_testimonials', 'description', 'Long-standing relationships with buyers who count on us for consistency.');

  const testimonials = [0, 1, 2].map((i) => ({
    quote: getVal(content, 'home_testimonials', `testimonial_${i}_quote`, defaultTestimonials[i].quote),
    name: getVal(content, 'home_testimonials', `testimonial_${i}_name`, defaultTestimonials[i].name),
    role: getVal(content, 'home_testimonials', `testimonial_${i}_role`, defaultTestimonials[i].role),
    company: getVal(content, 'home_testimonials', `testimonial_${i}_company`, defaultTestimonials[i].company),
    avatar: getVal(content, 'home_testimonials', `avatar_${i}`, DEFAULT_AVATARS[i]),
  }));

  const t = testimonials[active];

  return (
    <section className="bg-background-50 py-16 md:py-[100px]">
      <div className="max-w-container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-4">
            <div className="text-[12px] tracking-[0.2em] uppercase text-secondary-600 font-bold mb-4">
              {sectionLabel}
            </div>
            <h2 className="font-heading font-bold text-primary-500 text-[32px] md:text-[42px] leading-tight">
              {heading}
            </h2>
            <p className="mt-6 text-foreground-600 text-[15px] leading-[26px]">
              {description}
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="relative bg-background-100 rounded-[5px] p-8 md:p-12">
              <i className="ri-double-quotes-l text-accent-500 text-[64px] leading-none absolute top-4 left-6 opacity-40" />

              <p className="relative text-primary-500 text-[18px] md:text-[22px] leading-[32px] font-light">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-10 flex items-center gap-4 pt-6 border-t border-background-300/60">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-background-200">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex-1">
                  <div className="font-heading font-bold text-primary-500 text-[15px]">{t.name}</div>
                  <div className="text-foreground-600 text-[13px]">{t.role} &middot; {t.company}</div>
                </div>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`Show testimonial ${i + 1}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-[5px] cursor-pointer transition-colors ${
                        active === i ? 'bg-primary-500 text-accent-500' : 'bg-background-50 text-foreground-500 hover:bg-background-200'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}