import { Link } from 'react-router-dom';
import { useSiteContent } from '@/hooks/useSiteContent';
import Logo from '@/components/base/Logo';
import { commodities } from '@/mocks/commodities';

export default function Footer() {
  const { content } = useSiteContent('footer');
  const f = content.footer ?? {};
  const { content: contactContent } = useSiteContent('contact_info');
  const ci = contactContent.contact_info ?? {};

  const year = new Date().getFullYear();
  return (
    <footer className="bg-background-900 text-background-50">
      {/* Upper CTA strip */}
      <div className="border-b border-background-50/10">
        <div className="max-w-container mx-auto px-4 md:px-10 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-[25px] leading-[27px] font-light text-background-50">
              Ready to source with confidence?
            </h3>
            <p className="mt-2 text-[14px] text-background-300">
              Talk to our commodity desk — quotes within 24 hours, worldwide.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 whitespace-nowrap bg-accent-500 text-primary-500 font-bold text-[14px] leading-[22px] px-6 py-3 rounded-[5px] hover:bg-accent-600 transition-colors cursor-pointer"
          >
            Contact the desk <i className="ri-send-plane-line" />
          </Link>
        </div>
      </div>

      <div className="max-w-container mx-auto px-4 md:px-10 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <Logo variant="light" />
          <p className="mt-6 text-[14px] leading-[23.8px] text-background-300 max-w-sm">
            {f.company_description || 'MinCorp Trading LLC — a global commodity trading house delivering quality-assured raw materials and industrial commodities to partners across six continents.'}
          </p>
          <div className="mt-6 flex items-center gap-3">
            {[
              { icon: 'ri-linkedin-fill', label: 'LinkedIn' },
              { icon: 'ri-mail-line', label: 'Email' },
              { icon: 'ri-whatsapp-line', label: 'WhatsApp' },
              { icon: 'ri-twitter-x-line', label: 'X' },
            ].map((s) => (
              <a
                key={s.icon}
                href="#"
                aria-label={s.label}
                rel="nofollow"
                className="w-10 h-10 flex items-center justify-center rounded-[5px] bg-background-50/5 border border-background-50/10 text-background-50 hover:bg-accent-500 hover:text-primary-500 transition-colors cursor-pointer"
              >
                <i className={`${s.icon} text-[16px]`} />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-[15px] leading-[24px] font-bold text-background-50 mb-4">Company</h4>
          <ul className="space-y-3">
            {[
              { to: '/about', label: 'About Us' },
              { to: '/services', label: 'Services' },
              { to: '/sustainability', label: 'Sustainability' },
              { to: '/contact', label: 'Contact' },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-[14px] leading-[22px] text-background-50/80 hover:text-accent-500 hover:underline cursor-pointer">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="text-[15px] leading-[24px] font-bold text-background-50 mb-4">Commodities</h4>
          <ul className="space-y-3">
            {commodities.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to={`/commodities/${c.slug}`} className="text-[14px] leading-[22px] text-background-50/80 hover:text-accent-500 hover:underline cursor-pointer">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/commodities" className="text-[14px] leading-[22px] text-accent-500 font-bold hover:underline cursor-pointer">
                View all →
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="text-[15px] leading-[24px] font-bold text-background-50 mb-4">Head Office</h4>
          <ul className="space-y-3 text-[14px] leading-[22px] text-background-50/80">
            <li className="flex items-start gap-3">
              <i className="ri-map-pin-2-line text-accent-500 mt-1" />
              <span>{ci.address || '#304 TECHNIC BUILDING, SALAH AL DIN ROAD, DEIRA, DUBAI\nUnited Arab Emirates'}</span>
            </li>
            <li className="flex items-start gap-3">
              <i className="ri-phone-line text-accent-500 mt-1" />
              <a href={`tel:${(ci.phone || '(971) 4 292 5900').replace(/[^\d+]/g, '')}`} className="hover:text-accent-500 cursor-pointer">{ci.phone || '(971) 4 292 5900'}</a>
            </li>
            <li className="flex items-start gap-3">
              <i className="ri-mail-line text-accent-500 mt-1" />
              <a href={`mailto:${ci.email || 'shipping@mincorp.ae'}`} className="hover:text-accent-500 cursor-pointer">{ci.email || 'shipping@mincorp.ae'}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background-50/10">
        <div className="max-w-container mx-auto px-4 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] leading-[18px] text-background-50/60">
            © {year} MinCorp Trading LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-[12px] text-background-50/60 hover:text-accent-500 cursor-pointer">Privacy</Link>
            <Link to="/terms" className="text-[12px] text-background-50/60 hover:text-accent-500 cursor-pointer">Terms</Link>
            <Link to="/admin/login" className="text-[12px] text-background-50/60 hover:text-accent-500 cursor-pointer">Staff Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}