import React, { useState } from 'react';
import { useVcfContacts } from '@/hooks/useVcfContacts';
import { type VcfContact, downloadVcfFile } from '@/lib/vcf';
import QrCodeModal from '@/components/feature/QrCodeModal';

export default function DirectContactsSection() {
  const { contacts, loading } = useVcfContacts();
  const [selectedQrContact, setSelectedQrContact] = useState<VcfContact | null>(null);

  const activeContacts = contacts.filter((c) => c.isActive !== false);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <i className="ri-loader-4-line animate-spin text-2xl text-primary-500"></i>
      </div>
    );
  }

  if (activeContacts.length === 0) return null;

  return (
    <section className="bg-background-100 py-16 md:py-20 border-t border-background-200">
      <div className="max-w-container mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100/70 border border-primary-200 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <i className="ri-contacts-book-2-line"></i>
              Key Personnel & Desks
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary-500">
              Direct Trading Desks & Digital Business Cards
            </h2>
            <p className="text-sm md:text-base text-foreground-600 mt-2 max-w-2xl">
              Connect directly with our commodity leads, bulk chartering specialists, and quality inspectors. Download their digital vCard (.vcf) directly to your mobile or Outlook contacts.
            </p>
          </div>

          <div className="text-xs text-foreground-500 flex items-center gap-2 bg-background-50 px-3.5 py-2 rounded-lg border border-background-200 shrink-0">
            <i className="ri-smartphone-line text-primary-500 text-base"></i>
            <span>Scan QR code or click .vcf to save instantly</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeContacts.map((contact) => {
            const fullName = [contact.prefix, contact.firstName, contact.lastName].filter(Boolean).join(' ');

            return (
              <div
                key={contact.id}
                className="bg-background-50 rounded-xl border border-background-200 hover:border-primary-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  {/* Avatar & Department */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-14 h-14 rounded-full bg-background-200 overflow-hidden border-2 border-primary-100 shrink-0">
                      {contact.photoUrl ? (
                        <img
                          src={contact.photoUrl}
                          alt={fullName}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold text-base">
                          {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-heading font-bold text-foreground-950 truncate">
                        {fullName}
                      </h3>
                      <p className="text-xs text-accent-700 font-medium truncate mt-0.5">
                        {contact.title}
                      </p>
                      {contact.department && (
                        <span className="inline-block text-[10px] text-foreground-500 bg-background-200/80 px-2 py-0.5 rounded-full mt-1 truncate max-w-full">
                          {contact.department}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Direct Contact Links */}
                  <div className="space-y-2 pt-3 border-t border-background-200 text-xs text-foreground-600">
                    <div className="flex items-center gap-2 truncate">
                      <i className="ri-mail-line text-primary-500 shrink-0"></i>
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:text-primary-600 truncate hover:underline"
                        title={contact.email}
                      >
                        {contact.email}
                      </a>
                    </div>

                    {contact.cellPhone && (
                      <div className="flex items-center gap-2">
                        <i className="ri-whatsapp-line text-green-600 shrink-0 text-sm"></i>
                        <a
                          href={`https://wa.me/${contact.cellPhone.replace(/[^\d]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-green-700 font-medium"
                        >
                          {contact.cellPhone}
                        </a>
                      </div>
                    )}

                    {contact.workPhone && (
                      <div className="flex items-center gap-2">
                        <i className="ri-phone-line text-foreground-400 shrink-0"></i>
                        <a href={`tel:${contact.workPhone.replace(/[^\d+]/g, '')}`} className="hover:text-foreground-900">
                          {contact.workPhone}
                        </a>
                      </div>
                    )}

                    {contact.specialties && (
                      <div className="pt-2 text-[11px] text-foreground-500 line-clamp-2 leading-relaxed">
                        <span className="font-semibold text-foreground-700">Specialties:</span> {contact.specialties}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="bg-background-100/90 px-4 py-3 border-t border-background-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => downloadVcfFile(contact)}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-background-50 text-xs font-semibold py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <i className="ri-download-2-line text-xs"></i>
                    Save .VCF Card
                  </button>
                  <button
                    onClick={() => setSelectedQrContact(contact)}
                    className="bg-background-50 border border-background-300 hover:bg-background-200 text-foreground-800 text-xs py-2 px-3 rounded-md flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Scan QR Code with mobile phone"
                  >
                    <i className="ri-qr-code-line text-primary-600 text-sm"></i>
                    QR
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <QrCodeModal
        contact={selectedQrContact}
        isOpen={Boolean(selectedQrContact)}
        onClose={() => setSelectedQrContact(null)}
      />
    </section>
  );
}
