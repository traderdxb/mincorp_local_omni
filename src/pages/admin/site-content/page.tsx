import React, { useState, useEffect, useRef } from 'react';
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
  { label: 'Homepage', sections: ['home_hero', 'home_about', 'home_capabilities', 'home_cta', 'home_process', 'home_testimonials', 'home_global_reach', 'home_commodities_showcase'] },
  { label: 'About Page', sections: ['about_hero', 'about_mission', 'about_stats', 'about_leadership', 'about_timeline'] },
  { label: 'Commodities Page', sections: ['commodities_hero'] },
  { label: 'Services Page', sections: ['services_hero', 'services_grid', 'services_process', 'services_why_us'] },
  { label: 'Sustainability Page', sections: ['sustainability_hero', 'sustainability_commitments', 'sustainability_esg', 'sustainability_sourcing'] },
  { label: 'Contact Page', sections: ['contact_hero', 'contact_info'] },
  { label: 'Footer & Company Info', sections: ['footer', 'company_info'] },
  { label: 'Custom & Other Sections', sections: [] },
];

const CONTENT_TYPES = [
  { value: 'text', label: 'Single-line Text / Heading' },
  { value: 'textarea', label: 'Long Body Text / Paragraphs' },
  { value: 'image_url', label: 'Image URL / Banner' },
  { value: 'email', label: 'Email Address' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'url', label: 'Web Link / URL' },
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

export default function AdminSiteContent() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [edits, setEdits] = useState<EditState>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [globalMsg, setGlobalMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');

  // Add / Delete Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingRow, setDeletingRow] = useState<ContentRow | null>(null);
  const [uploadingRowId, setUploadingRowId] = useState<string | null>(null);

  // New field form state
  const [newSection, setNewSection] = useState('home_hero');
  const [customSectionName, setCustomSectionName] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState('text');
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  const imageUploadRef = useRef<HTMLInputElement>(null);
  const activeImageRowRef = useRef<string | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setGlobalMsg({ text, type });
    setTimeout(() => setGlobalMsg(null), 3000);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data, error: err } = await supabase
          .from('site_content')
          .select('*')
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
      showToast('No changes to save');
      return;
    }
    setSavingId(row.id);
    try {
      const { error: err } = await supabase
        .from('site_content')
        .update({ value: newValue, updated_at: new Date().toISOString() })
        .eq('id', row.id);
      if (err) throw err;
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, value: newValue, updated_at: new Date().toISOString() } : r)));
      setSavedId(row.id);
      setTimeout(() => setSavedId(null), 2000);
      showToast('Content saved successfully');
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Save failed', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveAllModified = async () => {
    const modifiedRows = rows.filter((r) => edits[r.id] !== undefined && edits[r.id] !== r.value);
    if (modifiedRows.length === 0) {
      showToast('All fields are up to date');
      return;
    }

    setSavingId('all');
    try {
      for (const row of modifiedRows) {
        await supabase
          .from('site_content')
          .update({ value: edits[row.id], updated_at: new Date().toISOString() })
          .eq('id', row.id);
      }
      setRows((prev) =>
        prev.map((r) => (edits[r.id] !== undefined ? { ...r, value: edits[r.id], updated_at: new Date().toISOString() } : r))
      );
      showToast(`Saved all ${modifiedRows.length} modified fields!`);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Failed to save all fields', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (row: ContentRow) => {
    try {
      const { error: err } = await supabase.from('site_content').delete().eq('id', row.id);
      if (err) throw err;
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      setDeletingRow(null);
      showToast(`Deleted field "${row.key}"`);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Delete failed', 'error');
    }
  };

  const handleAddNewField = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSection = newSection === '__custom__' ? customSectionName.trim().toLowerCase().replace(/\s+/g, '_') : newSection;
    const finalKey = newKey.trim().toLowerCase().replace(/\s+/g, '_');

    if (!finalSection || !finalKey) {
      showToast('Section and Key are required', 'error');
      return;
    }

    setIsSubmittingNew(true);
    try {
      const { data, error: err } = await supabase
        .from('site_content')
        .insert({
          section: finalSection,
          key: finalKey,
          value: newValue,
          content_type: newType,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (err) throw err;

      const inserted = data as ContentRow;
      setRows((prev) => [...prev, inserted]);
      setEdits((prev) => ({ ...prev, [inserted.id]: inserted.value }));
      setIsAddModalOpen(false);
      setNewKey('');
      setNewValue('');
      showToast(`New content field "${finalKey}" created successfully!`);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Failed to add content field', 'error');
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const triggerImageUpload = (rowId: string) => {
    activeImageRowRef.current = rowId;
    imageUploadRef.current?.click();
  };

  const handleImageUploaded = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const rowId = activeImageRowRef.current;
    if (!file || !rowId) return;

    setUploadingRowId(rowId);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `content-images/${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${ext}`;
      
      const { data, error: uploadErr } = await supabase.storage
        .from('media')
        .upload(path, file, { cacheControl: '3600', upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: pubUrl } = supabase.storage.from('media').getPublicUrl(data.path);
      const url = pubUrl.publicUrl;

      setEdits((prev) => ({ ...prev, [rowId]: url }));
      
      // Auto save
      await supabase
        .from('site_content')
        .update({ value: url, updated_at: new Date().toISOString() })
        .eq('id', rowId);

      setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, value: url } : r)));
      showToast('Image uploaded and set as field value!');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Image upload failed', 'error');
    } finally {
      setUploadingRowId(null);
      if (imageUploadRef.current) imageUploadRef.current.value = '';
    }
  };

  const toggleSection = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const expandAll = () => {
    setExpanded(Object.fromEntries(SECTION_GROUPS.map((g) => [g.label, true])));
  };

  const collapseAll = () => {
    setExpanded(Object.fromEntries(SECTION_GROUPS.map((g) => [g.label, false])));
  };

  // Known sections list for dropdown
  const allKnownSections = Array.from(new Set(rows.map((r) => r.section)));

  // Filtered rows
  const filteredRows = rows.filter((r) => {
    const matchesSearch = 
      r.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.value.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || r.content_type === typeFilter;
    
    let matchesGroup = true;
    if (selectedGroup !== 'all') {
      const g = SECTION_GROUPS.find((grp) => grp.label === selectedGroup);
      if (g) {
        matchesGroup = g.sections.length > 0 
          ? g.sections.includes(r.section)
          : !SECTION_GROUPS.slice(0, -1).some((other) => other.sections.includes(r.section));
      }
    }

    return matchesSearch && matchesType && matchesGroup;
  });

  const modifiedCount = rows.filter((r) => edits[r.id] !== undefined && edits[r.id] !== r.value).length;

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
    <div className="space-y-6">
      {/* Hidden File Input for Image Uploads */}
      <input
        type="file"
        ref={imageUploadRef}
        onChange={handleImageUploaded}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-heading font-bold text-foreground-900">Universal Site Content CMS</h2>
            <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-2.5 py-0.5 rounded-full">
              {rows.length} Total Fields
            </span>
          </div>
          <p className="text-sm text-foreground-500 mt-1">
            Edit, add, or delete any copy, long body paragraphs, banner images, emails, and phone numbers across all pages.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {modifiedCount > 0 && (
            <button
              onClick={handleSaveAllModified}
              disabled={savingId === 'all'}
              className="bg-accent-500 hover:bg-accent-600 text-primary-950 font-bold text-xs px-4 py-2.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm animate-pulse"
            >
              <i className="ri-save-3-line text-sm"></i>
              Save All Changes ({modifiedCount})
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary-500 hover:bg-primary-600 text-background-50 text-xs font-medium px-4 py-2.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <i className="ri-add-circle-line text-sm"></i>
            Add Content Field
          </button>
        </div>
      </div>

      {globalMsg && (
        <div className={`text-xs px-4 py-2.5 rounded-md font-medium flex items-center gap-2 ${
          globalMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          <i className={globalMsg.type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'}></i>
          {globalMsg.text}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-background-50 rounded-lg p-4 border border-background-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all content by key name, text value, or section..."
            className="w-full pl-9 pr-4 py-2 bg-background-100 border border-background-200 rounded-md text-xs text-foreground-800 focus:outline-none focus:border-primary-500 focus:bg-background-50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="bg-background-100 border border-background-200 rounded-md px-3 py-2 text-xs text-foreground-800 focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Page Groups</option>
            {SECTION_GROUPS.map((g) => (
              <option key={g.label} value={g.label}>{g.label}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-background-100 border border-background-200 rounded-md px-3 py-2 text-xs text-foreground-800 focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Content Types</option>
            <option value="text">Single-line Text</option>
            <option value="textarea">Long Body Text / Paragraphs</option>
            <option value="image_url">Images & Banners</option>
            <option value="email">Emails</option>
            <option value="phone">Phones</option>
          </select>

          <div className="flex items-center gap-1 border-l border-background-300 pl-2">
            <button
              onClick={expandAll}
              className="p-2 text-xs text-foreground-600 hover:text-foreground-900 rounded hover:bg-background-200"
              title="Expand All"
            >
              <i className="ri-expand-vertical-line"></i>
            </button>
            <button
              onClick={collapseAll}
              className="p-2 text-xs text-foreground-600 hover:text-foreground-900 rounded hover:bg-background-200"
              title="Collapse All"
            >
              <i className="ri-collapse-vertical-line"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Groups */}
      <div className="space-y-4">
        {SECTION_GROUPS.map((group) => {
          let groupRows = filteredRows.filter((r) => {
            if (group.sections.length > 0) {
              return group.sections.includes(r.section);
            }
            // Custom sections catch-all
            return !SECTION_GROUPS.slice(0, -1).some((g) => g.sections.includes(r.section));
          });

          if (groupRows.length === 0) return null;
          const isOpen = expanded[group.label] !== false;

          // Unique sections in this group
          const uniqueSections = Array.from(new Set(groupRows.map((r) => r.section)));

          return (
            <div key={group.label} className="bg-background-50 rounded-lg border border-background-200 overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection(group.label)}
                className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-background-100/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 flex items-center justify-center transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                    <i className="ri-arrow-right-s-line text-foreground-500"></i>
                  </span>
                  <h3 className="text-sm font-heading font-bold text-foreground-900">{group.label}</h3>
                  <span className="text-[11px] text-foreground-500 bg-background-200 px-2.5 py-0.5 rounded-full font-medium">
                    {groupRows.length} fields
                  </span>
                </div>

                <div className="text-xs text-foreground-400 font-normal">
                  {isOpen ? 'Click to collapse' : 'Click to expand'}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-6 space-y-6 border-t border-background-200/60 pt-4">
                  {uniqueSections.map((section) => {
                    const sectionRows = groupRows.filter((r) => r.section === section);
                    if (sectionRows.length === 0) return null;

                    return (
                      <div key={section} className="bg-background-100/70 rounded-lg p-4 border border-background-200">
                        <div className="flex items-center justify-between mb-3 border-b border-background-200 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground-800 font-heading">
                              {formatSectionName(section)}
                            </h4>
                            <span className="text-[10px] text-foreground-400 font-mono">({section})</span>
                          </div>

                          <span className="text-[10px] text-foreground-400">
                            {sectionRows.length} items
                          </span>
                        </div>

                        <div className="space-y-3.5">
                          {sectionRows.map((row) => {
                            const isModified = edits[row.id] !== undefined && edits[row.id] !== row.value;
                            const isImage = row.content_type === 'image_url' || row.key.includes('image') || row.key.includes('portrait');
                            const isTextarea = row.content_type === 'textarea' || (row.value && row.value.length > 90);

                            return (
                              <div
                                key={row.id}
                                className={`bg-background-50 rounded-md p-3.5 border transition-all ${
                                  isModified ? 'border-accent-400 shadow-sm' : 'border-background-200 hover:border-background-300'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3 mb-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <label className="text-xs font-bold text-foreground-900 tracking-wide">
                                      {formatKey(row.key)}
                                    </label>
                                    <span className="text-[10px] text-foreground-400 font-mono bg-background-100 px-1.5 py-0.5 rounded">
                                      {row.key}
                                    </span>
                                    <span className="text-[10px] uppercase font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                                      {row.content_type || 'text'}
                                    </span>
                                    {isModified && (
                                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded animate-pulse">
                                        Unsaved Changes
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {isImage && (
                                      <button
                                        type="button"
                                        onClick={() => triggerImageUpload(row.id)}
                                        disabled={uploadingRowId === row.id}
                                        className="text-[11px] bg-background-200 hover:bg-background-300 text-foreground-700 font-medium px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors"
                                        title="Upload and replace image"
                                      >
                                        {uploadingRowId === row.id ? (
                                          <>
                                            <i className="ri-loader-4-line animate-spin"></i> Uploading
                                          </>
                                        ) : (
                                          <>
                                            <i className="ri-upload-cloud-line"></i> Upload Image
                                          </>
                                        )}
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleSave(row)}
                                      disabled={savingId === row.id || !isModified}
                                      className={`flex items-center gap-1 text-[11px] font-medium px-3 py-1 rounded whitespace-nowrap transition-colors cursor-pointer ${
                                        savedId === row.id
                                          ? 'bg-green-100 text-green-700'
                                          : isModified
                                          ? 'bg-primary-500 text-background-50 hover:bg-primary-600 shadow-sm'
                                          : 'bg-background-200 text-foreground-400 cursor-not-allowed opacity-60'
                                      }`}
                                    >
                                      {savingId === row.id ? (
                                        <>
                                          <i className="ri-loader-4-line animate-spin"></i>
                                          Saving
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

                                    <button
                                      onClick={() => setDeletingRow(row)}
                                      className="p-1 rounded text-foreground-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                      title="Delete this field"
                                    >
                                      <i className="ri-delete-bin-line text-xs"></i>
                                    </button>
                                  </div>
                                </div>

                                {/* Input Editor Body */}
                                {isImage ? (
                                  <div className="space-y-2">
                                    <div className="flex gap-3 items-center">
                                      {edits[row.id] && (
                                        <div className="w-16 h-12 rounded bg-background-200 overflow-hidden border border-background-300 shrink-0">
                                          <img
                                            src={edits[row.id]}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              (e.target as HTMLElement).style.display = 'none';
                                            }}
                                          />
                                        </div>
                                      )}
                                      <input
                                        type="text"
                                        value={edits[row.id] ?? row.value}
                                        onChange={(e) => setEdits((prev) => ({ ...prev, [row.id]: e.target.value }))}
                                        placeholder="https://... image URL or click 'Upload Image'"
                                        className="flex-1 bg-background-100 border border-background-200 rounded px-3 py-1.5 text-xs text-foreground-800 focus:outline-none focus:border-primary-500 focus:bg-background-50 transition-colors font-mono"
                                      />
                                    </div>
                                  </div>
                                ) : isTextarea ? (
                                  <div>
                                    <textarea
                                      value={edits[row.id] ?? row.value}
                                      onChange={(e) => setEdits((prev) => ({ ...prev, [row.id]: e.target.value }))}
                                      className="w-full bg-background-100 border border-background-200 rounded px-3 py-2 text-xs text-foreground-800 focus:outline-none focus:border-primary-500 focus:bg-background-50 resize-y min-h-[90px] transition-colors leading-relaxed"
                                      rows={4}
                                      placeholder="Enter paragraph or rich body text..."
                                    />
                                    <div className="flex justify-between items-center text-[10px] text-foreground-400 mt-1">
                                      <span>Supports multiline line breaks & paragraphs</span>
                                      <span>{(edits[row.id] ?? row.value).length} characters</span>
                                    </div>
                                  </div>
                                ) : (
                                  <input
                                    type={row.content_type === 'email' ? 'email' : 'text'}
                                    value={edits[row.id] ?? row.value}
                                    onChange={(e) => setEdits((prev) => ({ ...prev, [row.id]: e.target.value }))}
                                    className="w-full bg-background-100 border border-background-200 rounded px-3 py-1.5 text-xs text-foreground-800 focus:outline-none focus:border-primary-500 focus:bg-background-50 transition-colors"
                                  />
                                )}

                                <div className="flex items-center justify-between text-[10px] text-foreground-400 mt-2">
                                  <span>
                                    Updated: {new Date(row.updated_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  {row.content_type === 'email' && edits[row.id] && (
                                    <a href={`mailto:${edits[row.id]}`} className="text-primary-600 hover:underline">
                                      Test Email Link ↗
                                    </a>
                                  )}
                                  {row.content_type === 'phone' && edits[row.id] && (
                                    <a href={`tel:${edits[row.id]}`} className="text-primary-600 hover:underline">
                                      Test Phone Call ↗
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
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

      {/* Add New Field Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background-50 rounded-xl max-w-lg w-full p-6 shadow-2xl border border-background-200">
            <div className="flex items-center justify-between pb-3 border-b border-background-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground-950 font-heading">Add New Content Field</h3>
                <p className="text-xs text-foreground-500">Add custom text, body copy, image banners, or contact entries</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-md text-foreground-400 hover:text-foreground-700 hover:bg-background-200 flex items-center justify-center cursor-pointer"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAddNewField} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-foreground-700 mb-1">Target Section *</label>
                <select
                  value={newSection}
                  onChange={(e) => setNewSection(e.target.value)}
                  className="w-full bg-background-100 border border-background-300 rounded px-3 py-2 text-xs text-foreground-900 focus:outline-none focus:border-primary-500"
                >
                  {allKnownSections.map((s) => (
                    <option key={s} value={s}>{formatSectionName(s)} ({s})</option>
                  ))}
                  <option value="__custom__">+ Create New Custom Section...</option>
                </select>
              </div>

              {newSection === '__custom__' && (
                <div>
                  <label className="block text-xs font-medium text-foreground-700 mb-1">Custom Section Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. custom_announcements, partner_portal"
                    value={customSectionName}
                    onChange={(e) => setCustomSectionName(e.target.value)}
                    className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900 font-mono"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground-700 mb-1">Field Key *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. direct_hotline, ceo_quote"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-700 mb-1">Content Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-background-100 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900 focus:outline-none"
                  >
                    {CONTENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground-700 mb-1">Initial Value / Content *</label>
                {newType === 'textarea' ? (
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter initial body text..."
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full bg-background-50 border border-background-300 rounded px-3 py-2 text-xs text-foreground-900 leading-relaxed"
                  />
                ) : (
                  <input
                    type="text"
                    required
                    placeholder={newType === 'image_url' ? 'https://... image link' : 'Enter value...'}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-background-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded bg-background-200 hover:bg-background-300 text-xs font-medium text-foreground-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="px-4 py-1.5 rounded bg-primary-500 hover:bg-primary-600 text-xs font-medium text-background-50 flex items-center gap-1 cursor-pointer"
                >
                  {isSubmittingNew ? 'Adding...' : 'Add Field'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background-50 rounded-lg max-w-sm w-full p-5 border border-background-200 text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 text-lg">
              <i className="ri-delete-bin-line"></i>
            </div>
            <h4 className="text-sm font-bold text-foreground-950">Delete Content Field?</h4>
            <p className="text-xs text-foreground-500 mt-1 mb-4">
              Are you sure you want to remove <span className="font-mono font-bold text-foreground-800">"{deletingRow.key}"</span> from <span className="font-bold text-foreground-800">{deletingRow.section}</span>?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setDeletingRow(null)}
                className="px-3.5 py-1.5 bg-background-200 text-foreground-700 rounded text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingRow)}
                className="px-3.5 py-1.5 bg-red-600 text-white rounded text-xs font-medium cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
