import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';

type Lead = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  commodity_interest: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    setError('');
    try {
      const { data, error: supabaseError } = await supabase
        .from('leads')
        .select('id,name,company,email,phone,country,commodity_interest,message,is_read,created_at')
        .order('created_at', { ascending: false });
      if (supabaseError) throw supabaseError;
      setLeads((data ?? []) as Lead[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(lead: Lead) {
    if (lead.is_read) return;
    try {
      await supabase.from('leads').update({ is_read: true }).eq('id', lead.id);
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, is_read: true } : l)));
    } catch {
      // Silently fail — not critical
    }
  }

  function openLead(lead: Lead) {
    setSelectedLead(lead);
    markAsRead(lead);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <i className="ri-loader-4-line animate-spin text-2xl text-primary-500"></i>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-accent-100 text-primary-500 text-sm px-4 py-3 rounded-md mb-4 inline-block">
          {error}
        </div>
        <br />
        <button onClick={loadLeads} className="bg-primary-500 text-background-50 text-sm font-medium px-5 py-2.5 rounded-md hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground-900 mb-1">Leads</h2>
          <p className="text-sm text-foreground-500">{leads.length} total inquiries</p>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="bg-background-50 rounded-lg p-10 text-center">
          <span className="w-12 h-12 rounded-full bg-background-100 flex items-center justify-center mx-auto mb-3">
            <i className="ri-mail-line text-2xl text-foreground-400"></i>
          </span>
          <p className="text-sm text-foreground-500">No leads yet. Leads from the contact form will appear here.</p>
        </div>
      ) : (
        <div className="bg-background-50 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-background-200 bg-background-100">
                <th className="text-left py-3 px-4 text-foreground-500 font-medium text-xs">Status</th>
                <th className="text-left py-3 px-4 text-foreground-500 font-medium text-xs">Name</th>
                <th className="text-left py-3 px-4 text-foreground-500 font-medium text-xs">Company</th>
                <th className="text-left py-3 px-4 text-foreground-500 font-medium text-xs">Interest</th>
                <th className="text-left py-3 px-4 text-foreground-500 font-medium text-xs">Country</th>
                <th className="text-left py-3 px-4 text-foreground-500 font-medium text-xs">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => openLead(lead)}
                  className={`border-b border-background-100 hover:bg-background-100/50 transition-colors cursor-pointer ${
                    !lead.is_read ? 'bg-primary-50' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    {!lead.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary-500 inline-block"></span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-foreground-800 font-medium">{lead.name}</td>
                  <td className="py-3 px-4 text-foreground-600">{lead.company || '—'}</td>
                  <td className="py-3 px-4 text-foreground-600">{lead.commodity_interest || '—'}</td>
                  <td className="py-3 px-4 text-foreground-500">{lead.country || '—'}</td>
                  <td className="py-3 px-4 text-foreground-500 text-xs">
                    {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead detail modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background-50 rounded-lg w-full max-w-[560px] mx-4 max-h-[85vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-background-200 flex items-center justify-between">
              <h3 className="text-base font-heading font-semibold text-foreground-900">Lead Detail</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-foreground-400 hover:text-foreground-600 cursor-pointer whitespace-nowrap"
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-close-line text-lg"></i>
                </span>
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-foreground-400 mb-0.5">Name</p>
                  <p className="text-sm text-foreground-900 font-medium">{selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground-400 mb-0.5">Company</p>
                  <p className="text-sm text-foreground-900">{selectedLead.company || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground-400 mb-0.5">Email</p>
                  <p className="text-sm text-foreground-900">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground-400 mb-0.5">Phone</p>
                  <p className="text-sm text-foreground-900">{selectedLead.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground-400 mb-0.5">Country</p>
                  <p className="text-sm text-foreground-900">{selectedLead.country || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground-400 mb-0.5">Commodity Interest</p>
                  <p className="text-sm text-foreground-900">{selectedLead.commodity_interest || '—'}</p>
                </div>
              </div>

              {selectedLead.message && (
                <div>
                  <p className="text-xs text-foreground-400 mb-1">Message</p>
                  <p className="text-sm text-foreground-700 bg-background-100 rounded-md p-3 whitespace-pre-wrap">
                    {selectedLead.message}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-foreground-400 mb-0.5">Submitted</p>
                <p className="text-sm text-foreground-600">
                  {new Date(selectedLead.created_at).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-background-200 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="bg-primary-500 text-background-50 px-5 py-2 text-sm font-medium rounded-md hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}