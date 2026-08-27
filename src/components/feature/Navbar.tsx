import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from '@/components/base/Logo';
import { LinkButton } from '@/components/base/Button';
import { commodities } from '@/mocks/commodities';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Commodities', to: '/commodities', hasDropdown: true },
  { label: 'Services', to: '/services' },
  { label: 'Sustainability', to: '/sustainability' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';
  // Always solid white, no more transparent hero overlay
  const isTransparent = false;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent ? 'bg-transparent' : 'bg-background-50 border-b border-background-200'
      }`}
      style={isTransparent ? {} : { boxShadow: 'rgba(0, 0, 0, 0.06) 0px 2px 8px' }}
    >
      <div className="max-w-container mx-auto flex items-center justify-between h-[72px] px-4 md:px-10">
        <Logo variant={isTransparent ? 'light' : 'dark'} />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <div
              key={item.to}
              className="relative"
              onMouseEnter={() => item.hasDropdown && setDropdownOpen(true)}
              onMouseLeave={() => item.hasDropdown && setDropdownOpen(false)}
            >
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [
                    'relative text-[14px] leading-[22px] font-normal transition-colors cursor-pointer py-2',
                    isTransparent ? 'text-background-50 hover:text-accent-500' : 'text-foreground-600 hover:text-primary-500',
                    isActive
                      ? isTransparent
                        ? 'text-accent-500'
                        : 'text-primary-500 border-b-[3px] border-accent-500'
                      : '',
                  ].join(' ')
                }
              >
                {item.label}
                {item.hasDropdown && (
                  <i className="ri-arrow-down-s-line ml-1 text-[16px] align-middle" />
                )}
              </NavLink>

              {item.hasDropdown && dropdownOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[340px]"
                >
                  <div className="bg-background-50 border border-background-300 rounded-[5px] py-2 grid grid-cols-1"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.10) 0px 4px 12px' }}
                  >
                    {commodities.map((c) => (
                      <Link
                        key={c.slug}
                        to={`/commodities/${c.slug}`}
                        className="flex items-center justify-between px-4 py-3 text-[14px] text-foreground-600 hover:bg-background-100 hover:text-primary-500 transition-colors cursor-pointer"
                      >
                        <span>{c.name}</span>
                        <span className="text-[11px] text-foreground-400">{c.category}</span>
                      </Link>
                    ))}
                    <Link
                      to="/commodities"
                      className="mt-1 mx-4 my-2 text-center text-[13px] font-bold text-primary-500 border-t border-background-200 pt-3 hover:text-primary-600 cursor-pointer"
                    >
                      View all commodities <i className="ri-arrow-right-line align-middle" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:block">
          <LinkButton to="/contact" variant="gold">
            Request Quote
            <i className="ri-arrow-right-line text-[15px]" />
          </LinkButton>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className={`lg:hidden w-11 h-11 flex items-center justify-center rounded-md cursor-pointer ${
            isTransparent ? 'text-background-50' : 'text-primary-500'
          }`}
          aria-label="Toggle navigation menu"
        >
          <i className={`text-2xl ${mobileOpen ? 'ri-close-line' : 'ri-menu-line'}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-background-50 border-t border-background-200">
          <div className="px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `py-3 px-3 text-[14px] font-bold cursor-pointer rounded-md ${
                    isActive ? 'text-primary-500 bg-background-100' : 'text-foreground-600 hover:text-primary-500'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-3">
              <LinkButton to="/contact" variant="gold" className="w-full">
                Request Quote
                <i className="ri-arrow-right-line text-[15px]" />
              </LinkButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}