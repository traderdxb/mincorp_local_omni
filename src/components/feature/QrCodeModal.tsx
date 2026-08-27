import React from 'react';
import { type VcfContact, generateVcfString, downloadVcfFile } from '@/lib/vcf';

type Props = {
  contact: VcfContact | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function QrCodeModal({ contact, isOpen, onClose }: Props) {
  if (!isOpen || !contact) return null;

  const fullName = [contact.prefix, contact.firstName, contact.lastName].filter(Boolean).join(' ');
  const vcfData = generateVcfString(contact);
  
  // Clean QR URL using standard data encoding
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=15&data=${encodeURIComponent(vcfData)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background-50 rounded-xl max-w-sm w-full p-6 shadow-2xl border border-background-200 text-center animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-background-200">
          <div className="flex items-center gap-2 text-left">
            <span className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              <i className="ri-qr-code-line text-lg"></i>
            </span>
            <div>
              <h3 className="text-sm font-bold text-foreground-950 font-heading">Digital Contact Card</h3>
              <p className="text-[11px] text-foreground-500">Scan to save to mobile address book</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md text-foreground-400 hover:text-foreground-700 hover:bg-background-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-lg border border-background-200 shadow-inner inline-block mx-auto mb-4">
          <img
            src={qrUrl}
            alt={`QR Code for ${fullName}`}
            className="w-48 h-48 mx-auto object-contain"
            loading="lazy"
          />
        </div>

        <div className="mb-4">
          <h4 className="text-base font-bold text-foreground-950">{fullName}</h4>
          <p className="text-xs text-primary-600 font-medium">{contact.title}</p>
          {contact.department && (
            <p className="text-[11px] text-foreground-500 mt-0.5">{contact.department}</p>
          )}
          <p className="text-[11px] text-foreground-400 mt-1">{contact.email} • {contact.cellPhone || contact.workPhone}</p>
        </div>

        <div className="space-y-2 pt-2 border-t border-background-200">
          <button
            onClick={() => downloadVcfFile(contact)}
            className="w-full bg-primary-500 hover:bg-primary-600 text-background-50 font-medium text-xs py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <i className="ri-download-2-line"></i>
            Download .vcf File Directly
          </button>
          <button
            onClick={onClose}
            className="w-full bg-background-200 hover:bg-background-300 text-foreground-700 font-medium text-xs py-2 px-4 rounded-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
