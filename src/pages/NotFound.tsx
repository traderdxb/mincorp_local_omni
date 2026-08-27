import { Link } from 'react-router-dom';
import SiteLayout from '@/components/feature/SiteLayout';

export default function NotFound() {
  return (
    <SiteLayout>
      <section className="min-h-[70vh] flex items-center justify-center bg-background-50 py-24 px-4 pt-32">
        <div className="text-center max-w-lg">
          <div className="text-accent-500 font-bold text-[80px] leading-none">404</div>
          <h1 className="mt-4 font-heading font-light text-primary-500 text-[32px] md:text-[42px] leading-tight">
            This page couldn't be found
          </h1>
          <p className="mt-4 text-foreground-600 text-[15px] leading-[26px]">
            The link may be outdated or the page has been moved. Head back home or explore our commodity catalog.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary-500 text-background-50 font-bold text-[14px] px-6 py-3 rounded-[5px] hover:bg-primary-600 cursor-pointer"
            >
              <i className="ri-home-line" /> Home
            </Link>
            <Link
              to="/commodities"
              className="inline-flex items-center gap-2 bg-transparent text-primary-500 border-2 border-primary-500 font-bold text-[14px] px-6 py-3 rounded-[5px] hover:bg-background-100 cursor-pointer"
            >
              Commodities
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}