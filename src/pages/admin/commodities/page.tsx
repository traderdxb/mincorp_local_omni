import { useState, useEffect, useRef } from 'react';
import supabase from '@/lib/supabase';
import RlsHelperModal from '../components/RlsHelperModal';
import SpecImportModal from './components/SpecImportModal';

type KeySpec = { label: string; value: string };
type DetailedSpec = { label: string; value: string; method: string };

type Commodity = {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  description: string;
  hero_image_url: string;
  card_image_url: string;
  key_specs: KeySpec[];
  applications: string[];
  detailed_specs: DetailedSpec[];
  created_at: string;
};

type CommodityForm = {
  slug: string;
  name: string;
  category: string;
  short_description: string;
  description: string;
  hero_image_url: string;
  card_image_url: string;
  key_specs: KeySpec[];
  applications: string[];
  detailed_specs: DetailedSpec[];
};

const emptyForm: CommodityForm = {
  slug: '',
  name: '',
  category: '',
  short_description: '',
  description: '',
  hero_image_url: '',
  card_image_url: '',
  key_specs: [],
  applications: [],
  detailed_specs: [],
};

const categories = [
  'Metals & Minerals',
  'Carbon & Coke',
  'Building Materials',
  'Industrial Minerals',
  'Agri & Chemicals',
  'FMCG & Trade',
];

export default function AdminCommodities() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CommodityForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [showRlsModal, setShowRlsModal] = useState(false);
  const [showSpecImportModal, setShowSpecImportModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'specs' | 'detailed_specs'>('general');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');
  const [bulkImportMode, setBulkImportMode] = useState<'replace' | 'append'>('replace');
  const [bulkImportError, setBulkImportError] = useState('');
  const heroInputRef = useRef<HTMLInputElement | null>(null);
  const cardInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadCommodities();
  }, []);

  async function loadCommodities() {
    setLoading(true);
    setError('');
    try {
      const { data, error: supabaseError } = await supabase
        .from('commodities')
        .select('*')
        .order('created_at', { ascending: false });
      if (supabaseError) throw supabaseError;
      setCommodities((data ?? []) as Commodity[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load commodities');
    } finally {
      setLoading(false);
    }
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setActiveTab('general');
    setShowForm(true);
  }

  function openEditForm(c: Commodity) {
    setEditingId(c.id);
    setForm({
      slug: c.slug,
      name: c.name,
      category: c.category,
      short_description: c.short_description,
      description: c.description,
      hero_image_url: c.hero_image_url,
      card_image_url: c.card_image_url,
      key_specs: Array.isArray(c.key_specs) ? [...c.key_specs] : [],
      applications: Array.isArray(c.applications) ? [...c.applications] : [],
      detailed_specs: Array.isArray(c.detailed_specs) ? [...c.detailed_specs] : [],
    });
    setFormError('');
    setActiveTab('general');
    setShowForm(true);
  }

  async function handleImageUpload(field: 'hero_image_url' | 'card_image_url') {
    const inputRef = field === 'hero_image_url' ? heroInputRef : cardInputRef;
    const input = inputRef.current;
    if (!input?.files?.[0]) return;

    const file = input.files[0];
    setUploadingField(field);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `commodities/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from('media')
        .upload(fileName, file);

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
      const newUrl = urlData.publicUrl;

      setForm((prev) => ({ ...prev, [field]: newUrl }));
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Image upload failed. Make sure the media storage bucket exists.');
    } finally {
      setUploadingField(null);
      if (input) input.value = '';
    }
  }

  // --- Specs helpers ---

  function addKeySpec() {
    setForm((prev) => ({
      ...prev,
      key_specs: [...prev.key_specs, { label: '', value: '' }],
    }));
  }

  function updateKeySpec(index: number, field: 'label' | 'value', val: string) {
    setForm((prev) => {
      const updated = [...prev.key_specs];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, key_specs: updated };
    });
  }

  function removeKeySpec(index: number) {
    setForm((prev) => ({
      ...prev,
      key_specs: prev.key_specs.filter((_, i) => i !== index),
    }));
  }

  function addApplication() {
    setForm((prev) => ({
      ...prev,
      applications: [...prev.applications, ''],
    }));
  }

  function updateApplication(index: number, val: string) {
    setForm((prev) => {
      const updated = [...prev.applications];
      updated[index] = val;
      return { ...prev, applications: updated };
    });
  }

  function removeApplication(index: number) {
    setForm((prev) => ({
      ...prev,
      applications: prev.applications.filter((_, i) => i !== index),
    }));
  }

  // --- Detailed specs helpers ---

  function addDetailedSpec() {
    setForm((prev) => ({
      ...prev,
      detailed_specs: [...prev.detailed_specs, { label: '', value: '', method: '' }],
    }));
  }

  function updateDetailedSpec(index: number, field: 'label' | 'value' | 'method', val: string) {
    setForm((prev) => {
      const updated = [...prev.detailed_specs];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, detailed_specs: updated };
    });
  }

  function removeDetailedSpec(index: number) {
    setForm((prev) => ({
      ...prev,
      detailed_specs: prev.detailed_specs.filter((_, i) => i !== index),
    }));
  }

  function handleBulkImport() {
    setBulkImportError('');
    const text = bulkImportText.trim();
    if (!text) {
      setBulkImportError('Paste some data first.');
      return;
    }

    // Auto-detect delimiter: count tabs vs commas in first couple rows
    const sample = text.split('\n').slice(0, 3).join('\n');
    const tabCount = (sample.match(/\t/g) || []).length;
    const commaCount = (sample.match(/,/g) || []).length;
    const delimiter = tabCount >= commaCount ? '\t' : ',';

    // Parse rows
    const lines = text.split('\n').filter((l) => l.trim());
    const parsed: DetailedSpec[] = [];

    for (let i = 0; i < lines.length; i++) {
      const cols = lines[i].split(delimiter).map((c) => c.trim());
      // Allow 1–3 columns; missing columns default to empty string
      if (cols.length === 0 || (cols.length === 1 && !cols[0])) continue;
      parsed.push({
        label: cols[0] || '',
        value: cols[1] || '',
        method: cols[2] || '',
      });
    }

    if (parsed.length === 0) {
      setBulkImportError('No valid rows found. Check your formatting.');
      return;
    }

    setForm((prev) => ({
      ...prev,
      detailed_specs:
        bulkImportMode === 'replace'
          ? parsed
          : [...prev.detailed_specs, ...parsed],
    }));

    // Reset modal
    setShowBulkImport(false);
    setBulkImportText('');
    setBulkImportError('');
  }

  function generateUniqueSlug(baseName: string): string {
    const clean = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    let candidate = clean || `commodity-${Date.now()}`;
    const existingSlugs = new Set(commodities.map((c) => c.slug));
    if (editingId) {
      const current = commodities.find((c) => c.id === editingId);
      if (current) existingSlugs.delete(current.slug);
    }
    if (!existingSlugs.has(candidate)) return candidate;

    let counter = 2;
    while (existingSlugs.has(`${candidate}-${counter}`)) {
      counter++;
    }
    return `${candidate}-${counter}`;
  }

  function handleApplyImportedSpecs(
    detailedSpecs: DetailedSpec[],
    keySpecs: KeySpec[],
    metadata?: { title?: string; description?: string }
  ) {
    if (showForm) {
      setForm((prev) => {
        const title = prev.name || metadata?.title || '';
        return {
          ...prev,
          detailed_specs: detailedSpecs,
          key_specs: prev.key_specs.length > 0 ? prev.key_specs : keySpecs,
          name: title,
          slug: prev.slug || (title ? generateUniqueSlug(title) : prev.slug),
        };
      });
      setActiveTab('detailed_specs');
    } else {
      const suggestedName = metadata?.title || 'New Commodity';
      const slug = generateUniqueSlug(suggestedName);
      setEditingId(null);
      setForm({
        ...emptyForm,
        name: suggestedName,
        slug,
        category: categories[0] || 'Metals & Minerals',
        short_description: `High-grade ${suggestedName} specifications.`,
        description: `High-grade ${suggestedName} sourced and supplied according to international quality standards.`,
        hero_image_url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1600&auto=format&fit=crop&q=60',
        card_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60',
        detailed_specs: detailedSpecs,
        key_specs: keySpecs,
      });
      setFormError('');
      setActiveTab('detailed_specs');
      setShowForm(true);
    }
  }

  async function handleSave() {
    setFormError('');
    if (!form.slug?.trim() || !form.name?.trim() || !form.category?.trim()) {
      setFormError('Slug, name, and category are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        slug: form.slug.trim(),
        name: form.name.trim(),
        category: form.category.trim(),
        short_description: form.short_description?.trim() || '',
        description: form.description?.trim() || '',
        hero_image_url: form.hero_image_url?.trim() || '',
        card_image_url: form.card_image_url?.trim() || '',
        key_specs: Array.isArray(form.key_specs) ? form.key_specs : [],
        applications: Array.isArray(form.applications) ? form.applications : [],
        detailed_specs: Array.isArray(form.detailed_specs) ? form.detailed_specs : [],
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from('commodities')
          .update(payload)
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('commodities')
          .insert(payload);
        if (insertError) throw insertError;
      }
      setShowForm(false);
      await loadCommodities();
    } catch (err: unknown) {
      console.error('Error saving commodity:', err);
      let errorMsg = 'Failed to save commodity';
      const anyErr = err as Record<string, unknown> | null;
      if (typeof err === 'string') {
        errorMsg = err;
      } else if (anyErr?.message && typeof anyErr.message === 'string') {
        errorMsg = anyErr.message;
        if (anyErr.details && typeof anyErr.details === 'string') {
          errorMsg += `: ${anyErr.details}`;
        }
        if (anyErr.hint && typeof anyErr.hint === 'string') {
          errorMsg += ` (${anyErr.hint})`;
        }
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }

      setFormError(errorMsg);

      // Auto trigger RLS helper modal if permissions or policies blocked the query
      if (
        errorMsg.toLowerCase().includes('row-level security') ||
        errorMsg.toLowerCase().includes('violates') ||
        errorMsg.toLowerCase().includes('permission denied') ||
        anyErr?.code === '42501'
      ) {
        setShowRlsModal(true);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error: deleteError } = await supabase.from('commodities').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setDeleteConfirm(null);
      await loadCommodities();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete commodity';
      setError(msg);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="w-6 h-6 flex items-center justify-center">
          <i className="ri-loader-4-line animate-spin text-2xl text-primary-500"></i>
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground-900 mb-1">Commodities</h2>
          <p className="text-sm text-foreground-500">{commodities.length} commodities in catalog</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowRlsModal(true)}
            className="bg-background-50 hover:bg-background-200 border border-background-300 text-foreground-700 text-xs font-medium px-3 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            title="View or copy Supabase SQL setup script"
          >
            <span className="w-3.5 h-3.5 flex items-center justify-center text-primary-500">
              <i className="ri-shield-keyhole-line"></i>
            </span>
            Database Setup & RLS
          </button>
          <button
            onClick={() => setShowSpecImportModal(true)}
            className="bg-accent-500/15 hover:bg-accent-500/25 border border-accent-300 text-accent-800 text-xs sm:text-sm font-semibold px-3.5 py-2.5 rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 shadow-sm"
          >
            <span className="w-4 h-4 flex items-center justify-center text-accent-700">
              <i className="ri-file-upload-line text-base"></i>
            </span>
            Import Spec Sheet (Word / CSV)
          </button>
          <button
            onClick={openAddForm}
            className="bg-primary-500 text-background-50 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-md hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-add-line"></i>
            </span>
            Add Commodity
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-accent-100 text-accent-900 border border-accent-300 text-sm px-4 py-3 rounded-md mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-medium text-accent-950">{error}</p>
            {error.toLowerCase().includes('row-level security') && (
              <p className="text-xs text-accent-800 mt-0.5">
                Database write permissions (RLS) need to be configured in your Supabase SQL Editor.
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {error.toLowerCase().includes('row-level security') && (
              <button
                onClick={() => setShowRlsModal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-background-50 text-xs px-3 py-1.5 rounded font-medium transition-colors cursor-pointer"
              >
                Fix Database RLS
              </button>
            )}
            <button onClick={loadCommodities} className="text-xs font-semibold text-primary-600 hover:underline cursor-pointer whitespace-nowrap">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Commodities table */}
      <div className="bg-background-50 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-background-200 bg-background-100">
              <th className="text-left py-3 px-4 text-foreground-500 font-medium text-xs">Name</th>
              <th className="text-left py-3 px-4 text-foreground-500 font-medium text-xs">Slug</th>
              <th className="text-left py-3 px-4 text-foreground-500 font-medium text-xs">Category</th>
              <th className="text-left py-3 px-4 text-foreground-500 font-medium text-xs">Created</th>
              <th className="text-right py-3 px-4 text-foreground-500 font-medium text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {commodities.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-foreground-400">
                  No commodities yet. Click "Add Commodity" to create one.
                </td>
              </tr>
            ) : (
              commodities.map((c) => (
                <tr key={c.id} className="border-b border-background-100 hover:bg-background-100/50 transition-colors">
                  <td className="py-3 px-4 text-foreground-800 font-medium">{c.name}</td>
                  <td className="py-3 px-4 text-foreground-500 font-mono text-xs">{c.slug}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-secondary-100 text-secondary-700 text-xs px-2 py-0.5 rounded-full">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground-500 text-xs">
                    {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openEditForm(c)}
                      className="text-foreground-500 hover:text-primary-500 transition-colors cursor-pointer p-1 whitespace-nowrap"
                      title="Edit"
                    >
                      <span className="w-5 h-5 inline-flex items-center justify-center">
                        <i className="ri-edit-line"></i>
                      </span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(c.id)}
                      className="text-foreground-500 hover:text-accent-500 transition-colors cursor-pointer p-1 whitespace-nowrap ml-1"
                      title="Delete"
                    >
                      <span className="w-5 h-5 inline-flex items-center justify-center">
                        <i className="ri-delete-bin-line"></i>
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background-50 rounded-lg w-full max-w-[760px] mx-4 max-h-[85vh] overflow-hidden flex flex-col">
            {/* Header with tabs */}
            <div className="px-6 pt-4 border-b border-background-200">
              <div className="flex items-center justify-between mb-0">
                <h3 className="text-base font-heading font-semibold text-foreground-900">
                  {editingId ? 'Edit Commodity' : 'Add Commodity'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-foreground-400 hover:text-foreground-600 cursor-pointer whitespace-nowrap"
                >
                  <span className="w-6 h-6 flex items-center justify-center">
                    <i className="ri-close-line text-lg"></i>
                  </span>
                </button>
              </div>
              {/* Tabs */}
              <div className="flex gap-0 mt-3">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'general'
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-foreground-500 hover:text-foreground-700'
                  }`}
                >
                  <span className="w-4 h-4 inline-flex items-center justify-center mr-1.5">
                    <i className="ri-information-line"></i>
                  </span>
                  General
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'specs'
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-foreground-500 hover:text-foreground-700'
                  }`}
                >
                  <span className="w-4 h-4 inline-flex items-center justify-center mr-1.5">
                    <i className="ri-file-list-3-line"></i>
                  </span>
                  Key Specs
                  {(form.key_specs.length > 0 || form.applications.length > 0) && (
                    <span className="ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary-100 text-primary-600 text-[11px] font-bold">
                      {form.key_specs.length + form.applications.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('detailed_specs')}
                  className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'detailed_specs'
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-foreground-500 hover:text-foreground-700'
                  }`}
                >
                  <span className="w-4 h-4 inline-flex items-center justify-center mr-1.5">
                    <i className="ri-table-line"></i>
                  </span>
                  Detailed Specs
                  {form.detailed_specs.length > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary-100 text-primary-600 text-[11px] font-bold">
                      {form.detailed_specs.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto px-6 py-4 space-y-5">
              {formError && (
                <div className="text-sm bg-accent-100 text-accent-950 border border-accent-300 px-4 py-3 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{formError}</p>
                    {formError.toLowerCase().includes('row-level security') && (
                      <p className="text-xs text-accent-800 mt-0.5">
                        Your Supabase project needs RLS policies enabled for the commodities table.
                      </p>
                    )}
                  </div>
                  {formError.toLowerCase().includes('row-level security') && (
                    <button
                      type="button"
                      onClick={() => setShowRlsModal(true)}
                      className="bg-primary-500 hover:bg-primary-600 text-background-50 text-xs px-3 py-1.5 rounded font-medium transition-colors cursor-pointer shrink-0"
                    >
                      Fix Database RLS
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'general' && (
                <>
                  {/* Images row — Hero + Card side by side */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Hero image */}
                    <div>
                      <label className="block text-xs font-medium text-foreground-700 mb-1">Hero Image</label>
                      <div className="bg-background-100 rounded-md overflow-hidden">
                        <div className="aspect-[16/9] bg-background-200 relative group">
                          {form.hero_image_url ? (
                            <img
                              src={form.hero_image_url}
                              alt="Hero image preview"
                              className="w-full h-full object-cover object-top"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                if (target.parentElement) {
                                  target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                  target.parentElement.innerHTML = '<span class="flex items-center justify-center w-10 h-10"><i class="ri-image-line text-3xl text-foreground-400"></i></span>';
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="w-10 h-10 flex items-center justify-center">
                                <i className="ri-image-line text-3xl text-foreground-400"></i>
                              </span>
                            </div>
                          )}
                          {uploadingField === 'hero_image_url' && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="w-8 h-8 flex items-center justify-center">
                                <i className="ri-loader-4-line animate-spin text-2xl text-background-50"></i>
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="px-3 py-2.5 space-y-2">
                          <input
                            type="text"
                            value={form.hero_image_url}
                            onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })}
                            className="w-full bg-background-50 border border-background-200 rounded-md px-2.5 py-1.5 text-[12px] text-foreground-800 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-colors"
                            placeholder="Hero image URL"
                          />
                          <label className="flex items-center gap-1.5 text-[11px] font-medium text-foreground-500 cursor-pointer hover:text-primary-500 transition-colors whitespace-nowrap">
                            <span className="w-3.5 h-3.5 flex items-center justify-center">
                              <i className="ri-upload-line"></i>
                            </span>
                            Upload & Replace
                            <input
                              type="file"
                              accept="image/*"
                              ref={heroInputRef}
                              onChange={() => handleImageUpload('hero_image_url')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Card image */}
                    <div>
                      <label className="block text-xs font-medium text-foreground-700 mb-1">Card Image</label>
                      <div className="bg-background-100 rounded-md overflow-hidden">
                        <div className="aspect-[4/3] bg-background-200 relative group">
                          {form.card_image_url ? (
                            <img
                              src={form.card_image_url}
                              alt="Card image preview"
                              className="w-full h-full object-cover object-top"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                if (target.parentElement) {
                                  target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                  target.parentElement.innerHTML = '<span class="flex items-center justify-center w-10 h-10"><i class="ri-image-line text-3xl text-foreground-400"></i></span>';
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="w-10 h-10 flex items-center justify-center">
                                <i className="ri-image-line text-3xl text-foreground-400"></i>
                              </span>
                            </div>
                          )}
                          {uploadingField === 'card_image_url' && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="w-8 h-8 flex items-center justify-center">
                                <i className="ri-loader-4-line animate-spin text-2xl text-background-50"></i>
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="px-3 py-2.5 space-y-2">
                          <input
                            type="text"
                            value={form.card_image_url}
                            onChange={(e) => setForm({ ...form, card_image_url: e.target.value })}
                            className="w-full bg-background-50 border border-background-200 rounded-md px-2.5 py-1.5 text-[12px] text-foreground-800 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-colors"
                            placeholder="Card image URL"
                          />
                          <label className="flex items-center gap-1.5 text-[11px] font-medium text-foreground-500 cursor-pointer hover:text-primary-500 transition-colors whitespace-nowrap">
                            <span className="w-3.5 h-3.5 flex items-center justify-center">
                              <i className="ri-upload-line"></i>
                            </span>
                            Upload & Replace
                            <input
                              type="file"
                              accept="image/*"
                              ref={cardInputRef}
                              onChange={() => handleImageUpload('card_image_url')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground-700 mb-1">Name *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                        className="w-full px-3 py-2 text-sm border border-background-300 rounded-md bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                        placeholder="Iron Ore"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground-700 mb-1">Slug *</label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-background-300 rounded-md bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent font-mono text-xs"
                        placeholder="iron-ore"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground-700 mb-1">Category *</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-background-300 rounded-md bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="">Select category...</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground-700 mb-1">Short Description</label>
                    <textarea
                      value={form.short_description}
                      onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 text-sm border border-background-300 rounded-md bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
                      placeholder="Brief card summary..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground-700 mb-1">Full Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 text-sm border border-background-300 rounded-md bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
                      placeholder="Detailed commodity description..."
                    />
                  </div>
                </>
              )}
              {activeTab === 'specs' && (
                <>
                  {/* ---- Key Specs ---- */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="block text-xs font-semibold text-foreground-800">Key Specs</label>
                        <p className="text-[11px] text-foreground-500 mt-0.5">
                          Quick-reference specs shown in the hero bar on the detail page
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowSpecImportModal(true)}
                          className="text-xs font-semibold text-accent-800 bg-accent-500/15 hover:bg-accent-500/25 border border-accent-300 px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                        >
                          <span className="w-3.5 h-3.5 flex items-center justify-center text-accent-700">
                            <i className="ri-file-upload-line"></i>
                          </span>
                          Import Word / CSV
                        </button>
                        <button
                          onClick={addKeySpec}
                          className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                        >
                          <span className="w-3.5 h-3.5 flex items-center justify-center">
                            <i className="ri-add-line"></i>
                          </span>
                          Add Spec
                        </button>
                      </div>
                    </div>

                    {form.key_specs.length === 0 ? (
                      <div className="bg-background-100 rounded-md px-4 py-6 text-center text-sm text-foreground-400">
                        No key specs yet. Click "Add Spec" to define one.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {form.key_specs.map((spec, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-background-100 rounded-md px-3 py-2">
                            <span className="text-[11px] text-foreground-400 font-mono w-5 text-right shrink-0">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={spec.label}
                              onChange={(e) => updateKeySpec(idx, 'label', e.target.value)}
                              className="flex-1 px-2.5 py-1.5 text-[13px] border border-background-200 rounded-md bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                              placeholder="Label (e.g. Fe Content)"
                            />
                            <input
                              type="text"
                              value={spec.value}
                              onChange={(e) => updateKeySpec(idx, 'value', e.target.value)}
                              className="flex-1 px-2.5 py-1.5 text-[13px] border border-background-200 rounded-md bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent font-mono"
                              placeholder="Value (e.g. 58% - 65%)"
                            />
                            <button
                              onClick={() => removeKeySpec(idx)}
                              className="text-foreground-400 hover:text-accent-500 transition-colors cursor-pointer shrink-0"
                              title="Remove"
                            >
                              <span className="w-5 h-5 flex items-center justify-center">
                                <i className="ri-close-circle-line text-base"></i>
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-background-200"></div>

                  {/* ---- Applications ---- */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="block text-xs font-semibold text-foreground-800">Applications</label>
                        <p className="text-[11px] text-foreground-500 mt-0.5">
                          End-use applications shown on the detail page
                        </p>
                      </div>
                      <button
                        onClick={addApplication}
                        className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                      >
                        <span className="w-3.5 h-3.5 flex items-center justify-center">
                          <i className="ri-add-line"></i>
                        </span>
                        Add Application
                      </button>
                    </div>

                    {form.applications.length === 0 ? (
                      <div className="bg-background-100 rounded-md px-4 py-6 text-center text-sm text-foreground-400">
                        No applications yet. Click "Add Application" to define one.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {form.applications.map((app, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-background-100 rounded-md px-3 py-2">
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-500 text-background-50 text-[11px] font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={app}
                              onChange={(e) => updateApplication(idx, e.target.value)}
                              className="flex-1 px-2.5 py-1.5 text-[13px] border border-background-200 rounded-md bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                              placeholder="e.g. Steel manufacturing"
                            />
                            <button
                              onClick={() => removeApplication(idx)}
                              className="text-foreground-400 hover:text-accent-500 transition-colors cursor-pointer shrink-0"
                              title="Remove"
                            >
                              <span className="w-5 h-5 flex items-center justify-center">
                                <i className="ri-close-circle-line text-base"></i>
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
              {activeTab === 'detailed_specs' && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="block text-xs font-semibold text-foreground-800">Detailed Technical Specifications</label>
                        <p className="text-[11px] text-foreground-500 mt-0.5">
                          Full ISO/ASTM specs table with property, value, and test method
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowSpecImportModal(true)}
                          className="text-xs font-semibold text-accent-800 bg-accent-500/15 hover:bg-accent-500/25 border border-accent-300 px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                        >
                          <span className="w-3.5 h-3.5 flex items-center justify-center text-accent-700">
                            <i className="ri-file-upload-line"></i>
                          </span>
                          Import Word / CSV
                        </button>
                        <button
                          onClick={() => {
                            setBulkImportText('');
                            setBulkImportError('');
                            setShowBulkImport(true);
                          }}
                          className="text-xs font-medium text-foreground-500 hover:text-primary-500 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                        >
                          <span className="w-3.5 h-3.5 flex items-center justify-center">
                            <i className="ri-file-copy-line"></i>
                          </span>
                          Bulk Import
                        </button>
                        <button
                          onClick={addDetailedSpec}
                          className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1"
                        >
                          <span className="w-3.5 h-3.5 flex items-center justify-center">
                            <i className="ri-add-line"></i>
                          </span>
                          Add Row
                        </button>
                      </div>
                    </div>

                    {form.detailed_specs.length === 0 ? (
                      <div className="bg-background-100 rounded-md px-4 py-8 text-center">
                        <span className="w-10 h-10 inline-flex items-center justify-center mb-3">
                          <i className="ri-table-line text-3xl text-foreground-300"></i>
                        </span>
                        <p className="text-sm text-foreground-400 mb-1">No detailed specs yet</p>
                        <p className="text-[12px] text-foreground-300">
                          Add rows like Fe Content / ISO 2597-1 to build the specs table
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {/* Table-like header */}
                        <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-foreground-500 uppercase tracking-wider">
                          <span className="w-6 text-right shrink-0">#</span>
                          <span className="flex-1">Property</span>
                          <span className="flex-1">Typical Value</span>
                          <span className="flex-1">Test Method</span>
                          <span className="w-8 shrink-0"></span>
                        </div>
                        {form.detailed_specs.map((spec, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-background-100 rounded-md px-3 py-2">
                            <span className="text-[11px] text-foreground-400 font-mono w-6 text-right shrink-0">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <input
                              type="text"
                              value={spec.label}
                              onChange={(e) => updateDetailedSpec(idx, 'label', e.target.value)}
                              className="flex-1 px-2.5 py-1.5 text-[13px] border border-background-200 rounded-md bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent font-bold"
                              placeholder="e.g. Fe (Total)"
                            />
                            <input
                              type="text"
                              value={spec.value}
                              onChange={(e) => updateDetailedSpec(idx, 'value', e.target.value)}
                              className="flex-1 px-2.5 py-1.5 text-[13px] border border-background-200 rounded-md bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent font-mono"
                              placeholder="e.g. 58.0 – 65.0%"
                            />
                            <input
                              type="text"
                              value={spec.method}
                              onChange={(e) => updateDetailedSpec(idx, 'method', e.target.value)}
                              className="flex-1 px-2.5 py-1.5 text-[13px] border border-background-200 rounded-md bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-foreground-500"
                              placeholder="e.g. ISO 2597-1"
                            />
                            <button
                              onClick={() => removeDetailedSpec(idx)}
                              className="text-foreground-400 hover:text-accent-500 transition-colors cursor-pointer shrink-0"
                              title="Remove"
                            >
                              <span className="w-5 h-5 flex items-center justify-center">
                                <i className="ri-close-circle-line text-base"></i>
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-background-200 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-foreground-600 hover:text-foreground-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-primary-500 text-background-50 px-5 py-2 text-sm font-medium rounded-md hover:bg-primary-600 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
              >
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import modal */}
      {showBulkImport && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-background-50 rounded-lg w-full max-w-[600px] mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-heading font-semibold text-foreground-900">Bulk Import Detailed Specs</h3>
              <button
                onClick={() => setShowBulkImport(false)}
                className="text-foreground-400 hover:text-foreground-600 cursor-pointer whitespace-nowrap"
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-close-line text-lg"></i>
                </span>
              </button>
            </div>

            <p className="text-[13px] text-foreground-500 mb-4 leading-relaxed">
              Paste CSV or tab-separated data below. Each line should have:
              <br />
              <code className="inline-block bg-background-100 text-foreground-700 text-[12px] px-1.5 py-0.5 rounded mt-1 font-mono">
                Property, Typical Value, Test Method
              </code>
            </p>

            {/* Import mode */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[12px] text-foreground-600">Mode:</span>
              <button
                onClick={() => setBulkImportMode('replace')}
                className={`px-3 py-1.5 text-[12px] rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                  bulkImportMode === 'replace'
                    ? 'border-primary-500 bg-primary-100 text-primary-600 font-medium'
                    : 'border-background-200 text-foreground-500 hover:border-foreground-300'
                }`}
              >
                Replace all
              </button>
              <button
                onClick={() => setBulkImportMode('append')}
                className={`px-3 py-1.5 text-[12px] rounded-full border transition-colors cursor-pointer whitespace-nowrap ${
                  bulkImportMode === 'append'
                    ? 'border-primary-500 bg-primary-100 text-primary-600 font-medium'
                    : 'border-background-200 text-foreground-500 hover:border-foreground-300'
                }`}
              >
                Append
              </button>
              {form.detailed_specs.length > 0 && (
                <span className="text-[11px] text-foreground-400 ml-auto">
                  {form.detailed_specs.length} existing row{form.detailed_specs.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Example hint */}
            <details className="mb-3">
              <summary className="text-[11px] text-foreground-400 cursor-pointer hover:text-foreground-500 transition-colors whitespace-nowrap">
                Show example format
              </summary>
              <pre className="mt-2 bg-background-100 text-foreground-600 text-[11px] font-mono p-3 rounded-md overflow-x-auto leading-relaxed">
{`Fe (Total), 58.0 – 65.0%, ISO 2597-1
SiO₂, 2.0 – 5.5%, ISO 2598-1
Al₂O₃, 0.8 – 2.5%, ISO 2598-1
Phosphorus (P), ≤ 0.08%, ISO 2599
Sulfur (S), ≤ 0.05%, ISO 4689-2`}
              </pre>
            </details>

            <textarea
              value={bulkImportText}
              onChange={(e) => {
                setBulkImportText(e.target.value);
                setBulkImportError('');
              }}
              rows={10}
              className="w-full px-3 py-3 text-[13px] font-mono border border-background-300 rounded-md bg-background-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-y"
              placeholder={`Fe (Total), 58.0 – 65.0%, ISO 2597-1&#10;SiO₂, 2.0 – 5.5%, ISO 2598-1&#10;Al₂O₃, 0.8 – 2.5%, ISO 2598-1`}
            />

            {bulkImportError && (
              <div className="text-sm text-accent-700 bg-accent-100 px-4 py-2.5 rounded-md mt-3">{bulkImportError}</div>
            )}

            {/* Preview count */}
            {bulkImportText.trim() && !bulkImportError && (
              <div className="text-[12px] text-foreground-500 mt-2">
                <span className="w-4 h-4 inline-flex items-center justify-center mr-1">
                  <i className="ri-information-line"></i>
                </span>
                Detected {bulkImportText.trim().split('\n').filter((l) => l.trim()).length} row{bulkImportText.trim().split('\n').filter((l) => l.trim()).length !== 1 ? 's' : ''}
                {bulkImportMode === 'replace' && form.detailed_specs.length > 0 && (
                  <span className="text-accent-700"> — will replace {form.detailed_specs.length} existing row{form.detailed_specs.length !== 1 ? 's' : ''}</span>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowBulkImport(false)}
                className="px-4 py-2 text-sm font-medium text-foreground-600 hover:text-foreground-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                disabled={!bulkImportText.trim()}
                className="bg-primary-500 text-background-50 px-5 py-2 text-sm font-medium rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Import {bulkImportText.trim().split('\n').filter((l) => l.trim()).length || 0} Row{bulkImportText.trim().split('\n').filter((l) => l.trim()).length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background-50 rounded-lg w-full max-w-[400px] mx-4 p-6">
            <h3 className="text-base font-heading font-semibold text-foreground-900 mb-2">Delete Commodity?</h3>
            <p className="text-sm text-foreground-600 mb-6">
              This will permanently delete this commodity and all associated specs. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-foreground-600 hover:text-foreground-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="bg-accent-500 text-primary-500 px-5 py-2 text-sm font-medium rounded-md hover:bg-accent-600 transition-colors cursor-pointer whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <SpecImportModal
        isOpen={showSpecImportModal}
        onClose={() => setShowSpecImportModal(false)}
        onApplySpecs={handleApplyImportedSpecs}
        commodityName={form.name || 'Commodity'}
        existingDetailedSpecs={form.detailed_specs}
      />

      <RlsHelperModal isOpen={showRlsModal} onClose={() => setShowRlsModal(false)} />
    </div>
  );
}