import SiteLayout from '@/components/feature/SiteLayout';
import ContactHero from './components/ContactHero';
import ContactForm from './components/ContactForm';
import ContactInfo from './components/ContactInfo';
import DirectContactsSection from './components/DirectContactsSection';

export default function ContactPage() {
  return (
    <SiteLayout>
      <ContactHero />

      <section className="py-14 md:py-20 px-4 md:px-10 bg-background-50">
        <div className="max-w-container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Form — occupies 3/5 */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Sidebar info — occupies 2/5 */}
            <div className="lg:col-span-2">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>

      {/* Direct VCF Contact Cards & QR Codes */}
      <DirectContactsSection />

      {/* CTA strip */}
      <div className="bg-primary-500 py-12 md:py-16 px-4 md:px-10">
        <div className="max-w-container mx-auto text-center">
          <h3 className="text-[22px] md:text-[28px] font-light text-background-50 mb-3">
            Need an urgent quote?
          </h3>
          <p className="text-[15px] text-background-50/80 max-w-[560px] mx-auto mb-7">
            Our trading desk is active across time zones. For time-sensitive enquiries, call us directly and speak to a commodity specialist within minutes.
          </p>
          <a
            href="tel:+97142925900"
            className="inline-flex items-center gap-2 whitespace-nowrap bg-accent-500 text-primary-500 font-bold text-[14px] leading-[22px] px-6 py-3 rounded-md hover:bg-accent-600 transition-colors cursor-pointer"
          >
            <i className="ri-phone-line text-[16px]" />
            (971) 4 292 5900
          </a>
        </div>
      </div>
    </SiteLayout>
  );
}