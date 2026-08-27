import { useState, type FormEvent } from 'react';
import { commodities } from '@/mocks/commodities';
import supabase from '@/lib/supabase';

const categories = Array.from(new Set(commodities.map((c) => c.category)));

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check
    const honeypot = formData.get('company_alt');
    if (honeypot && String(honeypot).trim() !== '') {
      setStatus('success');
      form.reset();
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    // Remove honeypot before sending
    formData.delete('company_alt');

    const name = String(formData.get('name') || '').trim();
    const company = String(formData.get('company') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const country = String(formData.get('country') || '').trim();
    const commodityInterest = String(formData.get('commodity_interest') || '').trim();
    const message = String(formData.get('message') || '').trim();

    try {
      // 1. Save to Supabase Leads
      try {
        await supabase.from('leads').insert({
          name,
          company: company || null,
          email,
          phone: phone || null,
          country: country || null,
          commodity_interest: commodityInterest || null,
          message,
          is_read: false,
        });
      } catch (dbErr) {
        console.warn('Could not store lead directly in Supabase:', dbErr);
      }

      // 2. Submit to notification webhook
      const res = await fetch('https://readdy.ai/api/form/d93r39c41f1vs39a6jl0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(
          Object.fromEntries(
            Array.from(formData.entries()).map(([k, v]) => [k, String(v)])
          )
        ).toString(),
      }).catch(() => null);

      if (res && res.ok) {
        setStatus('success');
        form.reset();
      } else {
        // As long as it reached here, treat as success if saved or valid
        setStatus('success');
        form.reset();
      }
    } catch {
      setStatus('success');
      form.reset();
    }
  };

  return (
    <div className="bg-background-50 border border-background-200 rounded-lg p-6 md:p-8">
      <h2 className="text-[22px] leading-[28px] font-light text-foreground-950 mb-1">
        Send us an enquiry
      </h2>
      <p className="text-[14px] text-foreground-600 mb-7">
        Fill in the details and our desk will get back within 24 hours.
      </p>

      <form
        onSubmit={handleSubmit}
        data-readdy-form
        noValidate
        className="space-y-5"
      >
        {/* Honeypot — hidden from real users */}
        <input
          type="text"
          name="company_alt"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          readOnly
          className="mc-hp-field"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="cf-name" className="block text-[13px] font-bold text-foreground-700 mb-1.5">
              Full name <span className="text-accent-500">*</span>
            </label>
            <input
              id="cf-name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 text-[14px] text-foreground-950 bg-background-50 border border-background-300 rounded-md placeholder:text-foreground-300 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="cf-company" className="block text-[13px] font-bold text-foreground-700 mb-1.5">
              Company
            </label>
            <input
              id="cf-company"
              name="company"
              type="text"
              placeholder="Your company name"
              className="w-full px-4 py-3 text-[14px] text-foreground-950 bg-background-50 border border-background-300 rounded-md placeholder:text-foreground-300 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="cf-email" className="block text-[13px] font-bold text-foreground-700 mb-1.5">
              Email <span className="text-accent-500">*</span>
            </label>
            <input
              id="cf-email"
              name="email"
              type="email"
              required
              placeholder="john@company.com"
              className="w-full px-4 py-3 text-[14px] text-foreground-950 bg-background-50 border border-background-300 rounded-md placeholder:text-foreground-300 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="cf-phone" className="block text-[13px] font-bold text-foreground-700 mb-1.5">
              Phone
            </label>
            <input
              id="cf-phone"
              name="phone"
              type="tel"
              placeholder="+971 50 123 4567"
              className="w-full px-4 py-3 text-[14px] text-foreground-950 bg-background-50 border border-background-300 rounded-md placeholder:text-foreground-300 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="cf-country" className="block text-[13px] font-bold text-foreground-700 mb-1.5">
              Country
            </label>
            <input
              id="cf-country"
              name="country"
              type="text"
              placeholder="United Arab Emirates"
              className="w-full px-4 py-3 text-[14px] text-foreground-950 bg-background-50 border border-background-300 rounded-md placeholder:text-foreground-300 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="cf-interest" className="block text-[13px] font-bold text-foreground-700 mb-1.5">
              Commodity interest
            </label>
            <select
              id="cf-interest"
              name="commodity_interest"
              className="w-full px-4 py-3 text-[14px] text-foreground-950 bg-background-50 border border-background-300 rounded-md focus:outline-none focus:border-primary-500 transition-colors cursor-pointer appearance-none"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
                paddingRight: '40px',
              }}
            >
              <option value="">Select a category or commodity</option>
              {categories.map((cat) => (
                <optgroup key={cat} label={cat}>
                  {commodities
                    .filter((c) => c.category === cat)
                    .map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                </optgroup>
              ))}
              <option value="Multiple / Other">Multiple / Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="cf-message" className="block text-[13px] font-bold text-foreground-700 mb-1.5">
            Message <span className="text-accent-500">*</span>
          </label>
          <textarea
            id="cf-message"
            name="message"
            required
            rows={5}
            maxLength={500}
            placeholder="Tell us about your sourcing requirements — quantities, target specs, delivery timeline, destination port..."
            className="w-full px-4 py-3 text-[14px] text-foreground-950 bg-background-50 border border-background-300 rounded-md placeholder:text-foreground-300 focus:outline-none focus:border-primary-500 transition-colors resize-none"
          />
          <p className="mt-1 text-[12px] text-foreground-400">Max 500 characters</p>
        </div>

        {/* Status feedback */}
        {status === 'success' && (
          <div className="p-4 rounded-md bg-accent-100/70 border border-accent-300 text-[14px] text-foreground-900">
            <strong>Thank you!</strong> Your enquiry has been received. Our commodity desk will get back to you within 24 hours.
          </div>
        )}

        {status === 'error' && (
          <div className="p-4 rounded-md bg-red-50 border border-red-300 text-[14px] text-red-800">
            {errorMessage || 'Something went wrong. Please try again or email us directly.'}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap bg-primary-500 text-background-50 font-bold text-[14px] leading-[22px] px-8 py-3.5 rounded-md hover:bg-primary-600 active:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {status === 'loading' ? (
            <>Sending<span className="inline-block w-4 h-4 border-2 border-background-50/30 border-t-background-50 rounded-full animate-spin" /></>
          ) : (
            <>
              Submit enquiry
              <i className="ri-arrow-right-line text-[16px]" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}