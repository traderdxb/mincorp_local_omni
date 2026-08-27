import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/supabase';
import { type VcfContact } from '@/lib/vcf';

export const DEFAULT_VCF_CONTACTS: VcfContact[] = [
  {
    id: 'contact-ceo',
    firstName: 'Ahmed',
    lastName: 'Al-Mansoori',
    organization: 'MinCorp Trading LLC',
    title: 'Managing Director & CEO',
    department: 'Executive Leadership',
    email: 'a.mansoori@mincorptrade.com',
    workPhone: '+971 4 292 5900',
    cellPhone: '+971 50 123 4567',
    address: '#304 Technic Building, Salah Al Din Road, Deira',
    city: 'Dubai',
    country: 'United Arab Emirates',
    website: 'https://mincorptrade.com',
    specialties: 'High-Volume Offtake Agreements, Quarry Joint Ventures, Sovereign Infrastructure Contracts',
    bio: 'Over 25 years of executive experience across international mining and bulk commodity supply chains in the Middle East and South Asia.',
    photoUrl: 'https://readdy.ai/api/search-image?query=Professional%20middle%20eastern%20male%20business%20executive%20in%20dark%20navy%20suit%20with%20warm%20confident%20expression%20against%20deep%20teal%20abstract%20gradient%20background%2C%20corporate%20portrait%20photography%2C%20soft%20studio%20lighting%2C%20clean%20minimal%20composition%2C%20polished%20and%20trustworthy%20aesthetic&width=400&height=500&seq=mincorp-leader-ceo&orientation=portrait',
    orderIndex: 1,
    isActive: true,
  },
  {
    id: 'contact-aggregates',
    firstName: 'Tariq',
    lastName: 'Al-Hashemi',
    organization: 'MinCorp Trading LLC',
    title: 'Senior Trading Manager — Aggregates & Minerals',
    department: 'Trading Desk',
    email: 'trading@mincorptrade.com',
    workPhone: '+971 4 292 5901',
    cellPhone: '+971 52 987 6543',
    address: '#304 Technic Building, Salah Al Din Road, Deira',
    city: 'Dubai',
    country: 'United Arab Emirates',
    website: 'https://mincorptrade.com',
    specialties: 'Gabbro (0-5mm, 5-10mm, 10-20mm, 20-40mm), Armour Rock (1-3T, 3-6T), High-Purity Limestone',
    bio: 'Leads FOB & CIF aggregate supply for major port breakwaters, land reclamation, and airport runway paving across the GCC and Indian subcontinent.',
    photoUrl: 'https://readdy.ai/api/search-image?query=Professional%20arab%20male%20commercial%20trader%20in%20formal%20business%20attire%20against%20studio%20background%2C%20corporate%20portrait%20photography%2C%20confident%20expression&width=400&height=500&seq=mincorp-trader-agg&orientation=portrait',
    orderIndex: 2,
    isActive: true,
  },
  {
    id: 'contact-shipping',
    firstName: 'Capt. Rajesh',
    lastName: 'Nambiar',
    organization: 'MinCorp Trading LLC',
    title: 'Head of Vessel Operations & Bulk Chartering',
    department: 'Shipping & Logistics',
    email: 'shipping@mincorptrade.com',
    workPhone: '+971 4 292 5902',
    cellPhone: '+971 55 456 7890',
    address: '#304 Technic Building, Salah Al Din Road, Deira',
    city: 'Dubai',
    country: 'United Arab Emirates',
    website: 'https://mincorptrade.com',
    specialties: 'Supramax, Ultramax & Panamax Charters, Flat-Top Barges, Stevedoring & Laytime Management',
    bio: 'Master Mariner with 20+ years coordinating ocean freight logistics across Fujairah, Salalah, Ras Al Khaimah, and Arabian Gulf load ports.',
    photoUrl: 'https://readdy.ai/api/search-image?query=Professional%20south%20asian%20male%20shipping%20executive%20in%20suit%20with%20confident%20expression%20against%20minimal%20background%2C%20corporate%20portrait&width=400&height=500&seq=mincorp-shipping-head&orientation=portrait',
    orderIndex: 3,
    isActive: true,
  },
  {
    id: 'contact-qa',
    firstName: 'Dr. Elena',
    lastName: 'Vasiliev',
    organization: 'MinCorp Trading LLC',
    title: 'Chief Quality Officer & Mineralogist',
    department: 'Quality Assurance & Testing',
    email: 'quality@mincorptrade.com',
    workPhone: '+971 4 292 5903',
    cellPhone: '+971 56 321 0987',
    address: '#304 Technic Building, Salah Al Din Road, Deira',
    city: 'Dubai',
    country: 'United Arab Emirates',
    website: 'https://mincorptrade.com',
    specialties: 'ASTM C127/C136 Testing, XRF Chemical Assays, Petrographic Examination, Soundness & LA Abrasion',
    bio: 'Materials scientist supervising third-party testing (SGS, Bureau Veritas, GeoChem) for all export shipments.',
    photoUrl: 'https://readdy.ai/api/search-image?query=Professional%20female%20engineer%20executive%20in%20smart%20blazer%20with%20warm%20confident%20expression%20against%20studio%20background%2C%20corporate%20portrait%20photography&width=400&height=500&seq=mincorp-qa-head&orientation=portrait',
    orderIndex: 4,
    isActive: true,
  },
];

const STORAGE_KEY = 'mincorp_vcf_contacts_cache';

export function useVcfContacts() {
  const [contacts, setContacts] = useState<VcfContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Try reading from public.site_content where section = 'vcf_contacts'
      const { data, error: err } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'vcf_contacts')
        .eq('key', 'contacts_list');

      if (!err && data && data.length > 0 && data[0].value) {
        try {
          const parsed = JSON.parse(data[0].value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setContacts(parsed);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            setLoading(false);
            return;
          }
        } catch {
          // JSON parsing fallback
        }
      }

      // 2. Try localStorage cache
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setContacts(parsed);
            setLoading(false);
            return;
          }
        } catch {
          // Ignore
        }
      }

      // 3. Fallback to defaults
      setContacts(DEFAULT_VCF_CONTACTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_VCF_CONTACTS));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load contacts');
      setContacts(DEFAULT_VCF_CONTACTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const saveContacts = async (updatedContacts: VcfContact[]): Promise<boolean> => {
    setSaving(true);
    setError('');
    try {
      const jsonValue = JSON.stringify(updatedContacts);
      setContacts(updatedContacts);
      localStorage.setItem(STORAGE_KEY, jsonValue);

      // Save to Supabase site_content (section: 'vcf_contacts', key: 'contacts_list')
      const { error: upsertErr } = await supabase
        .from('site_content')
        .upsert(
          {
            section: 'vcf_contacts',
            key: 'contacts_list',
            value: jsonValue,
            content_type: 'json',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'section,key' }
        );

      if (upsertErr) {
        console.warn('Could not persist to Supabase site_content, stored locally:', upsertErr);
      }

      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save contacts');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const addContact = async (contact: Omit<VcfContact, 'id'>): Promise<boolean> => {
    const newContact: VcfContact = {
      ...contact,
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      orderIndex: contacts.length + 1,
      isActive: true,
    };
    const updated = [...contacts, newContact];
    return saveContacts(updated);
  };

  const updateContact = async (id: string, updates: Partial<VcfContact>): Promise<boolean> => {
    const updated = contacts.map((c) => (c.id === id ? { ...c, ...updates } : c));
    return saveContacts(updated);
  };

  const deleteContact = async (id: string): Promise<boolean> => {
    const updated = contacts.filter((c) => c.id !== id);
    return saveContacts(updated);
  };

  const reorderContacts = async (newOrder: VcfContact[]): Promise<boolean> => {
    const updated = newOrder.map((c, idx) => ({ ...c, orderIndex: idx + 1 }));
    return saveContacts(updated);
  };

  return {
    contacts,
    loading,
    error,
    saving,
    saveContacts,
    addContact,
    updateContact,
    deleteContact,
    reorderContacts,
    refetch: fetchContacts,
  };
}
