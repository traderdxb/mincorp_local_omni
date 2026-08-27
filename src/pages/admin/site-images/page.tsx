import { useState, useEffect, useRef } from 'react';
import supabase from '@/lib/supabase';

type ContentRow = {
  id: string;
  section: string;
  key: string;
  value: string;
  content_type: string;
  updated_at: string;
};

type EditState = Record<string, string>;

const SECTION_GROUPS: { label: string; sections: string[] }[] = [
  { label: 'Homepage', sections: ['home_hero', 'home_about', 'home_cta', 'home_global_reach', 'home_testimonials'] },
  { label: 'About Page', sections: ['about_hero', 'about_leadership'] },
  { label: 'Commodities Page', sections: ['commodities_hero'] },
  { label: 'Services Page', sections: ['services_hero'] },
  { label: 'Sustainability Page', sections: ['sustainability_hero'] },
  { label: 'Contact Page', sections: ['contact_hero'] },
];

function formatSectionName(section: string): string {
  return section
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminSiteImages() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [edits, setEdits] = useState<EditState>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [globalMsg, setGlobalMsg] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data, error: err } = await supabase
          .from('site_content')
          .select('*')
          .eq('content_type', 'image_url')
          .order('section')
          .order('key');
        if (err) throw err;
        if (!cancelled) {
          const r = (data ?? []) as ContentRow[];
          setRows(r);
          setEdits(Object.fromEntries(r.map((row) => [row.id, row.value])));
          setExpanded(Object.fromEntries(SECTION_GROUPS.map((g) => [g.label, true])));
        }
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleSave = async (row: ContentRow) => {
    const newValue = edits[row.id];
    if (newValue === row.value) {
      setGlobalMsg('No changes to save');
      setTimeout(() => setGlobalMsg(''), 2500);
      return;
    }
    setSavingId(row.id);
    setGlobalMsg('');
    try {
      const { error: err } = await supabase
        .from('site_content')
        .update({ value: newValue, updated_at: new Date().toISOString() })
        .eq('id', row.id);
      if (err) throw err;
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, value: newValue, updated_at: new Date().toISOString() } : r)));
      setSavedId(row.id);
      setTimeout(() => setSavedId(null), 2000);
      setGlobalMsg('Image URL saved');
      setTimeout(() => setGlobalMsg(''), 2500);
    } catch (e: unknown) {
      setGlobalMsg(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSavingId(null);
    }
  };

  const handleUpload = async (row: ContentRow) => {
    const input = fileInputRefs.current[row.id];
    if (!input?.files?.[0]) return;

    const file = input.files[0];
    setUploadingId(row.id);
    setGlobalMsg('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `site-images/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
      const newUrl = urlData.publicUrl;

      const { error: updateErr } = await supabase
        .from('site_content')
        .update({ value: newUrl, updated_at: new Date().toISOString() })
        .eq('id', row.id);

      if (updateErr) throw updateErr;

      setEdits((prev) => ({ ...prev, [row.id]: newUrl }));
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, value: newUrl, updated_at: new Date().toISOString() } : r)));
      setGlobalMsg('Image uploaded and saved');
      setTimeout(() => setGlobalMsg(''), 2500);
    } catch (e: unknown) {
      setGlobalMsg(e instanceof Error ? e.message : 'Upload failed. Make sure the media storage bucket exists.');
    } finally {
      setUploadingId(null);
      if (input) input.value = '';
    }
  };

  const toggleSection = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

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
        <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-md mb-4 inline-block">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary-500 text-background-50 text-sm font-medium px-5 py-2.5 rounded-md hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground-900 mb-1">Site Images</h2>
          <p className="text-sm text-foreground-500">Manage background images, portraits, and visual assets across all pages</p>
        </div>
        {globalMsg && (
          <div className={`text-xs px-3 py-1.5 rounded-md font-medium whitespace-nowrap ${
            globalMsg.startsWith('Image') || globalMsg.startsWith('No changes')
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-600'
          }`}>
            {globalMsg}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {SECTION_GROUPS.map((group) => {
          const groupRows = rows.filter((r) => group.sections.includes(r.section));
          if (groupRows.length === 0) return null;
          const isOpen = expanded[group.label] !== false;

          return (
            <div key={group.label} className="bg-background-50 rounded-lg">
              <button
                onClick={() => toggleSection(group.label)}
                className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-background-100/50 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 flex items-center justify-center transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                    <i className="ri-arrow-right-s-line text-foreground-500"></i>
                  </span>
                  <h3 className="text-sm font-heading font-semibold text-foreground-900">{group.label}</h3>
                  <span className="text-[11px] text-foreground-400 bg-background-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {groupRows.length} images
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-0">
                  {group.sections.map((section) => {
                    const sectionRows = groupRows.filter((r) => r.section === section);
                    if (sectionRows.length === 0) return null;
                    return (
                      <div key={section} className="mt-4 first:mt-0">
                        <div className="text-[11px] uppercase tracking-wider text-foreground-400 font-medium mb-3 pl-1">
                          {formatSectionName(section)}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {sectionRows.map((row) => (
                            <div key={row.id} className="bg-background-100 rounded-md overflow-hidden">
                              {/* Image preview */}
                              <div className="aspect-[4/3] bg-background-200 relative group">
                                <img
                                  src={edits[row.id] ?? row.value}
                                  alt={formatKey(row.key)}
                                  className="w-full h-full object-cover object-top"
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    target.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                                    target.parentElement!.innerHTML = '<i class="ri-image-line text-4xl text-foreground-400"></i>';
                                  }}
                                />
                                <label className="absolute bottom-2 right-2 bg-background-50/90 text-foreground-700 px-2.5 py-1.5 rounded-md text-[11px] font-medium cursor-pointer hover:bg-background-50 transition-colors whitespace-nowrap">
                                  <i className="ri-upload-line mr-1"></i>
                                  Replace
                                  <input
                                    type="file"
                                    accept="image/*"
                                    ref={(el) => { fileInputRefs.current[row.id] = el; }}
                                    onChange={() => handleUpload(row)}
                                    className="hidden"
                                  />
                                </label>
                                {uploadingId === row.id && (
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="w-8 h-8 flex items-center justify-center">
                                      <i className="ri-loader-4-line animate-spin text-2xl text-background-50"></i>
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Details */}
                              <div className="p-3 space-y-2">
                                <label className="text-[11px] font-medium text-foreground-500 uppercase tracking-wide block">
                                  {formatKey(row.key)}
                                </label>
                                <input
                                  type="text"
                                  value={edits[row.id] ?? row.value}
                                  onChange={(e) => setEdits((prev) => ({ ...prev, [row.id]: e.target.value }))}
                                  className="w-full bg-background-50 border border-background-200 rounded-md px-2.5 py-1.5 text-[12px] text-foreground-800 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-colors"
                                  placeholder="Image URL"
                                />
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-foreground-400">
                                    {new Date(row.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                  <button
                                    onClick={() => handleSave(row)}
                                    disabled={savingId === row.id}
                                    className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                                      savedId === row.id
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-primary-500 text-background-50 hover:bg-primary-600'
                                    }`}
                                  >
                                    {savingId === row.id ? (
                                      <>
                                        <i className="ri-loader-4-line animate-spin"></i>
                                      </>
                                    ) : savedId === row.id ? (
                                      <>
                                        <i className="ri-check-line"></i>
                                        Saved
                                      </>
                                    ) : (
                                      <>
                                        <i className="ri-save-line"></i>
                                        Save
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}