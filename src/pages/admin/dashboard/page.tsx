import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import RlsHelperModal from '../components/RlsHelperModal';

type Stats = {
  totalCommodities: number;
  totalLeads: number;
  unreadLeads: number;
  totalMedia: number;
  recentLeads: { id: string; name: string; company: string; commodity_interest: string; created_at: string }[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRlsModal, setShowRlsModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Query individual tables safely
        const commoditiesRes = await supabase.from('commodities').select('id');
        const leadsRes = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        const mediaRes = await supabase.from('media').select('id');

        if (cancelled) return;

        // Check if there were critical schema errors
        const err = commoditiesRes.error || leadsRes.error || mediaRes.error;
        if (err) {
          throw new Error(err.message);
        }

        const leadsArr = (leadsRes.data ?? []) as any[];
        const recent = leadsArr.slice(0, 5).map((l) => ({
          id: l.id,
          name: l.name || `${l.first_name || ''} ${l.last_name || ''}`.trim() || 'Anonymous',
          company: l.company || '',
          commodity_interest: l.commodity_interest || '',
          created_at: l.created_at || new Date().toISOString(),
        }));

        setStats({
          totalCommodities: (commoditiesRes.data ?? []).length,
          totalLeads: leadsArr.length,
          unreadLeads: leadsArr.filter((l) => !l.is_read).length,
          totalMedia: (mediaRes.data ?? []).length,
          recentLeads: recent,
        });
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Failed to load dashboard data';
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

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
        <div className="bg-accent-100 text-accent-950 border border-accent-300 text-sm px-5 py-4 rounded-md mb-4 inline-block max-w-lg mx-auto text-left">
          <p className="font-semibold text-accent-900 mb-1">Database Schema Setup Required</p>
          <p className="text-xs text-accent-800 mb-3">{error}</p>
          <button
            onClick={() => setShowRlsModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-background-50 text-xs px-3.5 py-2 rounded font-medium transition-colors cursor-pointer"
          >
            Fix Database Schema & Tables
          </button>
        </div>
        <p className="text-xs text-foreground-400 mb-4">
          Please run the full schema script in your Supabase SQL Editor to create and seed all tables.
        </p>
        <RlsHelperModal isOpen={showRlsModal} onClose={() => setShowRlsModal(false)} />
      </div>
    );
  }

  const statCards = [
    { label: 'Commodities', value: stats?.totalCommodities ?? 0, icon: 'ri-stack-line', color: 'text-primary-500', bg: 'bg-primary-100' },
    { label: 'Total Leads', value: stats?.totalLeads ?? 0, icon: 'ri-mail-line', color: 'text-secondary-500', bg: 'bg-secondary-100' },
    { label: 'Unread Leads', value: stats?.unreadLeads ?? 0, icon: 'ri-mail-unread-line', color: statValue(stats?.unreadLeads) ? 'text-accent-500' : 'text-foreground-400', bg: 'bg-accent-100' },
    { label: 'Media Assets', value: stats?.totalMedia ?? 0, icon: 'ri-image-line', color: 'text-foreground-600', bg: 'bg-background-200' },
  ];

  function statValue(v: unknown): boolean {
    return typeof v === 'number' && v > 0;
  }

  return (
    <div>
      <h2 className="text-xl font-heading font-bold text-foreground-900 mb-1">Dashboard</h2>
      <p className="text-sm text-foreground-500 mb-6">Overview of your CMS content and activity</p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-background-50 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className={`w-10 h-10 rounded-md ${card.bg} flex items-center justify-center`}>
                <i className={`${card.icon} ${card.color} text-lg`}></i>
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground-900">{card.value}</p>
            <p className="text-xs text-foreground-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent leads */}
      <div className="bg-background-50 rounded-lg p-5">
        <h3 className="text-sm font-heading font-semibold text-foreground-900 mb-4">Recent Leads</h3>
        {stats?.recentLeads && stats.recentLeads.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-background-200">
                <th className="text-left py-2.5 px-3 text-foreground-500 font-medium text-xs">Name</th>
                <th className="text-left py-2.5 px-3 text-foreground-500 font-medium text-xs">Company</th>
                <th className="text-left py-2.5 px-3 text-foreground-500 font-medium text-xs">Interest</th>
                <th className="text-left py-2.5 px-3 text-foreground-500 font-medium text-xs">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-background-100 hover:bg-background-100/50 transition-colors">
                  <td className="py-2.5 px-3 text-foreground-800 font-medium">{lead.name}</td>
                  <td className="py-2.5 px-3 text-foreground-600">{lead.company || '—'}</td>
                  <td className="py-2.5 px-3 text-foreground-600">{lead.commodity_interest || '—'}</td>
                  <td className="py-2.5 px-3 text-foreground-500 text-xs">
                    {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-foreground-400 py-6 text-center">No leads yet. Leads from the contact form will appear here.</p>
        )}
      </div>
    </div>
  );
}