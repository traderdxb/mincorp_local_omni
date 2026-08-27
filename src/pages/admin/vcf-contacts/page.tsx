import React, { useState, useRef } from 'react';
import { useVcfContacts } from '@/hooks/useVcfContacts';
import { type VcfContact, downloadVcfFile, parseVcfText } from '@/lib/vcf';
import QrCodeModal from '@/components/feature/QrCodeModal';
import supabase from '@/lib/supabase';

const DEPARTMENTS = [
  'Executive Leadership',
  'Trading Desk — Aggregates & Minerals',
  'Trading Desk — Industrial Commodities',
  'Shipping & Vessel Operations',
  'Quality Assurance & Inspection',
  'Trade Finance & Credit Risk',
  'Middle East & GCC Desk',
  'Asia-Pacific Desk',
  'General Enquiries',
];

export default function AdminVcfContactsPage() {
  const { contacts, loading, saving, addContact, updateContact, deleteContact, reorderContacts } = useVcfContacts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  
  // Modals state
  const [editingContact, setEditingContact] = useState<VcfContact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [qrContact, setQrContact] = useState<VcfContact | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<VcfContact>>({
    organization: 'MinCorp Trading LLC',
    country: 'United Arab Emirates',
    city: 'Dubai',
    address: '#304 Technic Building, Salah Al Din Road, Deira',
    website: 'https://mincorptrade.com',
    department: 'Trading Desk — Aggregates & Minerals',
    isActive: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingContact(null);
    setFormData({
      firstName: '',
      lastName: '',
      prefix: '',
      title: '',
      organization: 'MinCorp Trading LLC',
      department: 'Trading Desk — Aggregates & Minerals',
      email: '',
      workPhone: '+971 4 292 5900',
      cellPhone: '+971 50 ',
      address: '#304 Technic Building, Salah Al Din Road, Deira',
      city: 'Dubai',
      country: 'United Arab Emirates',
      website: 'https://mincorptrade.com',
      linkedin: '',
      specialties: '',
      bio: '',
      photoUrl: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (contact: VcfContact) => {
    setEditingContact(contact);
    setFormData({ ...contact });
    setIsModalOpen(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.title) {
      showNotification('Please fill in First Name, Last Name, Title, and Email', 'error');
      return;
    }

    try {
      if (editingContact) {
        await updateContact(editingContact.id, formData);
        showNotification('Contact updated successfully');
      } else {
        await addContact(formData as Omit<VcfContact, 'id'>);
        showNotification('New VCF contact added successfully');
      }
      setIsModalOpen(false);
    } catch {
      showNotification('Failed to save contact', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContact(id);
      setIsDeletingId(null);
      showNotification('Contact removed');
    } catch {
      showNotification('Failed to delete contact', 'error');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= contacts.length) return;

    const newArr = [...contacts];
    const [moved] = newArr.splice(index, 1);
    newArr.splice(targetIdx, 0, moved);
    await reorderContacts(newArr);
    showNotification('Order updated');
  };

  const handleVcfImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseVcfText(text);
        setEditingContact(null);
        setFormData((prev) => ({
          ...prev,
          ...parsed,
          firstName: parsed.firstName || prev.firstName || '',
          lastName: parsed.lastName || prev.lastName || '',
          email: parsed.email || prev.email || '',
          title: parsed.title || prev.title || '',
          workPhone: parsed.workPhone || prev.workPhone || '',
          cellPhone: parsed.cellPhone || prev.cellPhone || '',
        }));
        setIsModalOpen(true);
        showNotification('VCF file imported into form! Review and click Save.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `contact-photo-${Date.now()}.${ext}`;
      
      const { data, error: uploadErr } = await supabase.storage
        .from('media')
        .upload(`contacts/${fileName}`, file, { cacheControl: '3600', upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(data.path);

      setFormData((prev) => ({ ...prev, photoUrl: publicUrlData.publicUrl }));
      showNotification('Photo uploaded successfully');
    } catch (err: unknown) {
      showNotification(err instanceof Error ? err.message : 'Photo upload failed', 'error');
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleExportAll = () => {
    if (contacts.length === 0) return;
    const combined = contacts.map((c) => {
      const v = downloadVcfFile; // using helper
      return c;
    });
    // download each or download first
    contacts.forEach((c) => downloadVcfFile(c));
    showNotification(`Exported ${contacts.length} VCF cards`);
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = 
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.specialties || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'all' || c.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-heading font-bold text-foreground-900">Contact Cards & VCF Manager</h2>
            <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-2 py-0.5 rounded-full">
              {contacts.length} Contacts
            </span>
          </div>
          <p className="text-sm text-foreground-500 mt-1">
            Create, edit, and manage digital business cards (.vcf) for instant client downloads and QR code scanning.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleVcfImport}
            accept=".vcf,text/vcard"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-background-50 border border-background-300 hover:bg-background-200 text-foreground-700 text-xs font-medium px-3.5 py-2.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Import an existing .vcf file"
          >
            <i className="ri-file-upload-line text-sm"></i>
            Import .vcf
          </button>

          <button
            onClick={handleExportAll}
            className="bg-background-50 border border-background-300 hover:bg-background-200 text-foreground-700 text-xs font-medium px-3.5 py-2.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <i className="ri-download-2-line text-sm"></i>
            Export All (.vcf)
          </button>

          <button
            onClick={handleOpenAdd}
            className="bg-primary-500 hover:bg-primary-600 text-background-50 text-xs font-medium px-4 py-2.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <i className="ri-user-add-line text-sm"></i>
            Add New Contact
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`text-xs px-4 py-2.5 rounded-md font-medium flex items-center gap-2 ${
          statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
        }`}>
          <i className={statusMsg.type === 'success' ? 'ri-checkbox-circle-line' : 'ri-error-warning-line'}></i>
          {statusMsg.text}
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-background-50 rounded-lg p-4 border border-background-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, email, commodities, or department..."
            className="w-full pl-9 pr-4 py-2 bg-background-100 border border-background-200 rounded-md text-xs text-foreground-800 focus:outline-none focus:border-primary-500 focus:bg-background-50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-foreground-500 whitespace-nowrap">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-background-100 border border-background-200 rounded-md px-3 py-2 text-xs text-foreground-800 focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contact Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <i className="ri-loader-4-line animate-spin text-2xl text-primary-500"></i>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-background-50 rounded-lg border border-background-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-background-200 flex items-center justify-center mx-auto mb-3 text-foreground-400 text-xl">
            <i className="ri-contacts-book-2-line"></i>
          </div>
          <h3 className="text-sm font-bold text-foreground-900">No contact cards found</h3>
          <p className="text-xs text-foreground-500 mt-1 max-w-sm mx-auto">
            {searchQuery ? 'Try modifying your search or filter.' : 'Add your company executives, trading managers, and shipping agents.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 bg-primary-500 hover:bg-primary-600 text-background-50 text-xs font-medium px-4 py-2 rounded-md inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <i className="ri-add-line"></i>
            Create First Contact
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredContacts.map((contact, index) => {
            const fullName = [contact.prefix, contact.firstName, contact.lastName].filter(Boolean).join(' ');

            return (
              <div
                key={contact.id}
                className="bg-background-50 rounded-lg border border-background-200 hover:border-primary-300 transition-all flex flex-col justify-between overflow-hidden shadow-sm"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-background-200 overflow-hidden border border-background-300 shrink-0">
                        {contact.photoUrl ? (
                          <img
                            src={contact.photoUrl}
                            alt={fullName}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-700 font-bold text-sm">
                            {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground-950 font-heading">{fullName}</h4>
                        <p className="text-xs text-primary-600 font-medium">{contact.title}</p>
                        {contact.department && (
                          <span className="inline-block text-[10px] bg-background-200 text-foreground-600 px-2 py-0.5 rounded-full mt-1">
                            {contact.department}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="w-5 h-5 rounded hover:bg-background-200 text-foreground-400 hover:text-foreground-700 disabled:opacity-20 flex items-center justify-center text-xs cursor-pointer"
                        title="Move up"
                      >
                        <i className="ri-arrow-up-s-line"></i>
                      </button>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === filteredContacts.length - 1}
                        className="w-5 h-5 rounded hover:bg-background-200 text-foreground-400 hover:text-foreground-700 disabled:opacity-20 flex items-center justify-center text-xs cursor-pointer"
                        title="Move down"
                      >
                        <i className="ri-arrow-down-s-line"></i>
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 text-xs text-foreground-600 border-t border-background-200 pt-3">
                    <div className="flex items-center gap-2 truncate">
                      <i className="ri-mail-line text-foreground-400 shrink-0"></i>
                      <a href={`mailto:${contact.email}`} className="hover:text-primary-600 truncate">{contact.email}</a>
                    </div>
                    {contact.cellPhone && (
                      <div className="flex items-center gap-2">
                        <i className="ri-whatsapp-line text-green-600 shrink-0"></i>
                        <span>{contact.cellPhone}</span>
                      </div>
                    )}
                    {contact.workPhone && (
                      <div className="flex items-center gap-2">
                        <i className="ri-phone-line text-foreground-400 shrink-0"></i>
                        <span>{contact.workPhone}</span>
                      </div>
                    )}
                    {contact.specialties && (
                      <div className="pt-1.5 text-[11px] text-foreground-500 leading-relaxed">
                        <span className="font-semibold text-foreground-700">Specialties:</span> {contact.specialties}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="bg-background-100 px-4 py-2.5 border-t border-background-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => downloadVcfFile(contact)}
                      className="bg-primary-500 hover:bg-primary-600 text-background-50 text-[11px] font-medium px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                      title="Download vCard (.vcf)"
                    >
                      <i className="ri-download-2-line"></i>
                      .VCF
                    </button>
                    <button
                      onClick={() => setQrContact(contact)}
                      className="bg-background-50 border border-background-300 hover:bg-background-200 text-foreground-700 text-[11px] font-medium px-2.5 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer"
                      title="Show QR Code"
                    >
                      <i className="ri-qr-code-line text-primary-600"></i>
                      QR
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(contact)}
                      className="p-1.5 rounded hover:bg-background-200 text-foreground-600 hover:text-primary-600 text-xs transition-colors cursor-pointer"
                      title="Edit Contact"
                    >
                      <i className="ri-edit-line"></i>
                    </button>
                    <button
                      onClick={() => setIsDeletingId(contact.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-foreground-400 hover:text-red-600 text-xs transition-colors cursor-pointer"
                      title="Delete Contact"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-background-50 rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-background-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-background-200 mb-5">
              <div>
                <h3 className="text-base font-bold text-foreground-950 font-heading">
                  {editingContact ? 'Edit Contact Card' : 'Add New Contact Card'}
                </h3>
                <p className="text-xs text-foreground-500">
                  Fill in contact details to generate an RFC-standard vCard (.vcf) and QR Code
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-md text-foreground-400 hover:text-foreground-700 hover:bg-background-200 flex items-center justify-center cursor-pointer"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              {/* Photo & Basic Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="flex flex-col items-center justify-center p-4 bg-background-100 rounded-lg border border-dashed border-background-300">
                  <div className="w-20 h-20 rounded-full bg-background-200 overflow-hidden mb-3 border border-background-300">
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground-400 text-2xl">
                        <i className="ri-user-3-line"></i>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="text-[11px] bg-background-50 border border-background-300 hover:bg-background-200 text-foreground-700 px-3 py-1.5 rounded font-medium flex items-center gap-1 cursor-pointer"
                  >
                    {uploadingPhoto ? (
                      <>
                        <i className="ri-loader-4-line animate-spin"></i> Uploading...
                      </>
                    ) : (
                      <>
                        <i className="ri-camera-line"></i> Upload Photo
                      </>
                    )}
                  </button>
                  <input
                    type="text"
                    placeholder="Or enter Image URL"
                    value={formData.photoUrl || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, photoUrl: e.target.value }))}
                    className="mt-2 w-full text-[10px] bg-background-50 border border-background-200 rounded px-2 py-1 text-foreground-700"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-foreground-700 mb-1">Prefix</label>
                      <input
                        type="text"
                        placeholder="e.g. Capt., Dr."
                        value={formData.prefix || ''}
                        onChange={(e) => setFormData((p) => ({ ...p, prefix: e.target.value }))}
                        className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName || ''}
                        onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                        className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName || ''}
                        onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                        className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-foreground-700 mb-1">Job Title / Role *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Trading Manager"
                        value={formData.title || ''}
                        onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                        className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground-700 mb-1">Department</label>
                      <select
                        value={formData.department || 'Trading Desk — Aggregates & Minerals'}
                        onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
                        className="w-full bg-background-50 border border-background-300 rounded px-2.5 py-1.5 text-xs text-foreground-900"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-background-200">
                <div>
                  <label className="block text-xs font-medium text-foreground-700 mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="trading@mincorptrade.com"
                    value={formData.email || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-700 mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="+971 50 123 4567"
                    value={formData.cellPhone || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, cellPhone: e.target.value }))}
                    className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-700 mb-1">Office Landline</label>
                  <input
                    type="text"
                    placeholder="+971 4 292 5900"
                    value={formData.workPhone || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, workPhone: e.target.value }))}
                    className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground-700 mb-1">Organization / Company</label>
                  <input
                    type="text"
                    value={formData.organization || 'MinCorp Trading LLC'}
                    onChange={(e) => setFormData((p) => ({ ...p, organization: e.target.value }))}
                    className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900"
                  />
                </div>
              </div>

              {/* Commodities & Bio */}
              <div className="space-y-3 pt-2 border-t border-background-200">
                <div>
                  <label className="block text-xs font-medium text-foreground-700 mb-1">
                    Commodities / Specialties Handled
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gabbro Aggregates, Limestone, Armour Rock, Industrial Silica"
                    value={formData.specialties || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, specialties: e.target.value }))}
                    className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-700 mb-1">
                    Bio / Experience Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief background summary..."
                    value={formData.bio || ''}
                    onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                    className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-foreground-700 mb-1">Office Address</label>
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                      className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city || 'Dubai'}
                      onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                      className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.country || 'United Arab Emirates'}
                      onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))}
                      className="w-full bg-background-50 border border-background-300 rounded px-3 py-1.5 text-xs text-foreground-900"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-background-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-background-200 hover:bg-background-300 text-xs font-medium text-foreground-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-md bg-primary-500 hover:bg-primary-600 text-xs font-medium text-background-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i> Saving...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line"></i> Save VCF Contact
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background-50 rounded-lg max-w-sm w-full p-5 border border-background-200 text-center">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 text-lg">
              <i className="ri-delete-bin-line"></i>
            </div>
            <h4 className="text-sm font-bold text-foreground-950">Delete Contact Card?</h4>
            <p className="text-xs text-foreground-500 mt-1 mb-4">
              This contact card and its associated VCF download link will be removed.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setIsDeletingId(null)}
                className="px-3.5 py-1.5 bg-background-200 text-foreground-700 rounded text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(isDeletingId)}
                className="px-3.5 py-1.5 bg-red-600 text-white rounded text-xs font-medium cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <QrCodeModal
        contact={qrContact}
        isOpen={Boolean(qrContact)}
        onClose={() => setQrContact(null)}
      />
    </div>
  );
}
