import { useSiteContent } from '@/hooks/useSiteContent';

export default function ContactInfo() {
  const { content } = useSiteContent('contact_info');
  const h = content.contact_info ?? {};

  return (
    <div className="space-y-8">
      {/* Office card */}
      <div className="bg-background-50 border border-background-200 rounded-lg p-6 md:p-8">
        <h3 className="text-[16px] font-bold text-foreground-950 mb-5">
          <i className="ri-building-4-line text-primary-500 mr-2" />
          {h.heading || 'Contact Details'}
        </h3>

        <ul className="space-y-5">
          <li className="flex items-start gap-4">
            <span className="w-10 h-10 flex items-center justify-center rounded-md bg-primary-100/60 shrink-0">
              <i className="ri-map-pin-2-line text-primary-500 text-[18px]" />
            </span>
            <div>
              <p className="text-[14px] font-bold text-foreground-950">{h.address_label || 'Our Office'}</p>
              <p className="text-[14px] text-foreground-600 mt-0.5 whitespace-pre-line">
                {h.address || '#304 TECHNIC BUILDING, SALAH AL DIN ROAD, DEIRA, DUBAI, United Arab Emirates'}
              </p>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <span className="w-10 h-10 flex items-center justify-center rounded-md bg-primary-100/60 shrink-0">
              <i className="ri-phone-line text-primary-500 text-[18px]" />
            </span>
            <div>
              <p className="text-[14px] font-bold text-foreground-950">{h.phone_label || 'Phone'}</p>
              <a
                href={`tel:${(h.phone || '(971) 4 292 5900').replace(/[^\d+]/g, '')}`}
                className="text-[14px] text-foreground-600 hover:text-primary-500 transition-colors cursor-pointer"
              >
                {h.phone || '(971) 4 292 5900'}
              </a>
            </div>
          </li>

          <li className="flex items-start gap-4">
            <span className="w-10 h-10 flex items-center justify-center rounded-md bg-primary-100/60 shrink-0">
              <i className="ri-mail-line text-primary-500 text-[18px]" />
            </span>
            <div>
              <p className="text-[14px] font-bold text-foreground-950">{h.email_label || 'Email'}</p>
              <a
                href={`mailto:${h.email || 'shipping@mincorp.ae'}`}
                className="text-[14px] text-foreground-600 hover:text-primary-500 transition-colors cursor-pointer"
              >
                {h.email || 'shipping@mincorp.ae'}
              </a>
            </div>
          </li>
        </ul>
      </div>

      {/* Regional presence */}
      <div className="bg-background-50 border border-background-200 rounded-lg p-6 md:p-8">
        <h3 className="text-[16px] font-bold text-foreground-950 mb-5">
          <i className="ri-global-line text-primary-500 mr-2" />
          Regional Desks
        </h3>

        <ul className="space-y-4">
          {[
            { city: 'Singapore', region: 'Asia-Pacific', phone: '+65 6 234 5678' },
            { city: 'Istanbul', region: 'Turkey & MENA', phone: '+90 212 345 6789' },
            { city: 'Mumbai', region: 'South Asia', phone: '+91 22 3456 7890' },
          ].map((desk) => (
            <li key={desk.city} className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent-500 shrink-0" />
              <div>
                <p className="text-[14px] font-bold text-foreground-950">{desk.city}</p>
                <p className="text-[12px] text-foreground-500">{desk.region} — {desk.phone}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Map */}
      <div className="rounded-lg overflow-hidden border border-background-200">
        <div className="h-[280px] w-full">
          <iframe
            title="Mincorp Trading LLC location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.675765979507!2d55.3163447!3d25.2706226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d23b3838be5%3A0xbd456d9f2a1ffaa7!2sMincorp%20Trading%20LLC!5e0!3m2!1sen!2sae!4v1710000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="bg-background-100 px-4 py-2.5 flex items-center justify-between border-t border-background-200 text-xs">
          <span className="text-foreground-600 font-medium flex items-center gap-1.5">
            <i className="ri-map-pin-2-fill text-primary-500" />
            Mincorp Trading LLC — Dubai, UAE
          </span>
          <a
            href="https://www.google.com/maps/place/Mincorp+Trading+LLC/@25.2705069,55.3185426,3a,146.4y,90t/data=!3m7!1e2!3m5!1sCIHM0ogKEICAgICumO7FzwE!2e10!3e12!7i600!8i415!4m7!3m6!1s0x3e5f5d23b3838be5:0xbd456d9f2a1ffaa7!8m2!3d25.2706226!4d55.3185334!10e5!16s%2Fg%2F11t53bkdtp?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDgyMy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-500 hover:text-primary-600 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            View on Google Maps
            <i className="ri-external-link-line" />
          </a>
        </div>
      </div>
    </div>
  );
}