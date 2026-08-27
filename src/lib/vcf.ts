export type VcfContact = {
  id: string;
  firstName: string;
  lastName: string;
  prefix?: string;
  organization: string;
  title: string;
  department?: string;
  email: string;
  workPhone?: string;
  cellPhone?: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  linkedin?: string;
  photoUrl?: string;
  specialties?: string;
  bio?: string;
  orderIndex?: number;
  isActive?: boolean;
};

/**
 * Generates a valid RFC 2426 vCard (VCF 3.0) string for a contact.
 */
export function generateVcfString(contact: VcfContact): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
  ];

  const fullName = [contact.prefix, contact.firstName, contact.lastName].filter(Boolean).join(' ').trim() || 'MinCorp Contact';
  lines.push(`FN;CHARSET=UTF-8:${fullName}`);
  lines.push(`N;CHARSET=UTF-8:${contact.lastName || ''};${contact.firstName || ''};;;`);

  if (contact.organization) {
    lines.push(`ORG;CHARSET=UTF-8:${contact.organization}${contact.department ? `;${contact.department}` : ''}`);
  }

  if (contact.title) {
    lines.push(`TITLE;CHARSET=UTF-8:${contact.title}`);
  }

  if (contact.workPhone) {
    lines.push(`TEL;TYPE=WORK,VOICE:${contact.workPhone}`);
  }

  if (contact.cellPhone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${contact.cellPhone}`);
  }

  if (contact.email) {
    lines.push(`EMAIL;TYPE=PREF,INTERNET:${contact.email}`);
  }

  if (contact.address || contact.city || contact.country) {
    const street = contact.address || '';
    const city = contact.city || '';
    const country = contact.country || '';
    lines.push(`ADR;TYPE=WORK;CHARSET=UTF-8:;;${street};${city};;${country};`);
  }

  if (contact.website) {
    lines.push(`URL:${contact.website}`);
  }

  if (contact.linkedin) {
    lines.push(`X-SOCIALPROFILE;type=linkedin:${contact.linkedin}`);
  }

  const noteParts: string[] = [];
  if (contact.specialties) noteParts.push(`Commodities/Specialties: ${contact.specialties}`);
  if (contact.bio) noteParts.push(contact.bio);
  if (noteParts.length > 0) {
    lines.push(`NOTE;CHARSET=UTF-8:${noteParts.join(' \\n ')}`);
  }

  if (contact.photoUrl && contact.photoUrl.startsWith('http')) {
    lines.push(`PHOTO;VALUE=URI:${contact.photoUrl}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/**
 * Downloads a .vcf file directly in the user's browser.
 */
export function downloadVcfFile(contact: VcfContact): void {
  const vcfContent = generateVcfString(contact);
  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const filename = `${(contact.firstName + '_' + contact.lastName).replace(/\s+/g, '_') || 'contact'}.vcf`;
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parses raw .vcf text and returns a partial VcfContact object.
 */
export function parseVcfText(vcfText: string): Partial<VcfContact> {
  const contact: Partial<VcfContact> = {
    organization: 'MinCorp Trading LLC',
  };

  const lines = vcfText.replace(/\r\n /g, '').split(/\r\n|\r|\n/);

  for (const line of lines) {
    if (!line || !line.includes(':')) continue;
    const colonIdx = line.indexOf(':');
    const rawKey = line.substring(0, colonIdx).toUpperCase();
    const value = line.substring(colonIdx + 1).trim();

    if (rawKey.startsWith('FN')) {
      const parts = value.split(' ');
      if (parts.length > 1) {
        contact.firstName = parts[0];
        contact.lastName = parts.slice(1).join(' ');
      } else {
        contact.firstName = value;
      }
    } else if (rawKey.startsWith('N;') || rawKey === 'N') {
      const nameParts = value.split(';');
      if (nameParts[0]) contact.lastName = nameParts[0].trim();
      if (nameParts[1]) contact.firstName = nameParts[1].trim();
    } else if (rawKey.startsWith('ORG')) {
      const orgParts = value.split(';');
      contact.organization = orgParts[0]?.trim() || '';
      if (orgParts[1]) contact.department = orgParts[1].trim();
    } else if (rawKey.startsWith('TITLE')) {
      contact.title = value;
    } else if (rawKey.startsWith('TEL')) {
      if (rawKey.includes('CELL') || rawKey.includes('MOB') || !contact.workPhone) {
        contact.cellPhone = value;
      } else {
        contact.workPhone = value;
      }
    } else if (rawKey.startsWith('EMAIL')) {
      contact.email = value;
    } else if (rawKey.startsWith('ADR')) {
      const adrParts = value.split(';');
      if (adrParts[2]) contact.address = adrParts[2].trim();
      if (adrParts[3]) contact.city = adrParts[3].trim();
      if (adrParts[6]) contact.country = adrParts[6].trim();
    } else if (rawKey.startsWith('URL')) {
      contact.website = value;
    } else if (rawKey.startsWith('NOTE')) {
      contact.bio = value.replace(/\\n/g, '\n');
    }
  }

  return contact;
}
