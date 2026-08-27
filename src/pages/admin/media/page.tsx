import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';

type Media = {
  id: string;
  name: string;
  url: string;
  type: string;
  created_at: string;
};

export default function AdminMedia() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    setLoading(true);
    setError('');
    try {
      const { data, error: supabaseError } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      if (supabaseError) throw supabaseError;
      setMedia((data ?? []) as Media[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `media/${fileName}`;

      const { error: uploadErr } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from('media').getPublicUrl(filePath);

      const { error: insertErr } = await supabase.from('media').insert({
        name: file.name,
        url: urlData.publicUrl,
        type: file.type.startsWith('image/') ? 'image' : 'document',
      });

      if (insertErr) throw insertErr;

      setUploadSuccess('File uploaded successfully!');
      e.target.value = '';
      await loadMedia();
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Make sure the "media" storage bucket exists in Supabase.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error: deleteError } = await supabase.from('media').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setDeleteConfirm(null);
      await loadMedia();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete media');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <i className="ri-loader-4-line animate-spin text-2xl text-primary-500"></i>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground-900 mb-1">Media Library</h2>
          <p className="text-sm text-foreground-500">{media.length} assets</p>
        </div>

        <label className="bg-primary-500 text-background-50 text-sm font-medium px-4 py-2.5 rounded-md hover:bg-primary-600 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2">
          <i className="ri-upload-line"></i>
          Upload File
          <input
            type="file"
            accept="image/*,.pdf,.xlsx,.csv"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="bg-accent-100 text-primary-500 text-sm px-4 py-3 rounded-md mb-4">
          {error}
          <button onClick={loadMedia} className="ml-3 underline cursor-pointer whitespace-nowrap">Retry</button>
        </div>
      )}

      {uploadError && (
        <div className="bg-accent-100 text-primary-500 text-sm px-4 py-3 rounded-md mb-4">{uploadError}</div>
      )}

      {uploadSuccess && (
        <div className="bg-secondary-100 text-secondary-700 text-sm px-4 py-3 rounded-md mb-4">{uploadSuccess}</div>
      )}

      {uploading && (
        <div className="flex items-center gap-3 text-sm text-foreground-500 mb-4">
          <i className="ri-loader-4-line animate-spin"></i>
          Uploading...
        </div>
      )}

      {media.length === 0 ? (
        <div className="bg-background-50 rounded-lg p-10 text-center">
          <span className="w-12 h-12 rounded-full bg-background-100 flex items-center justify-center mx-auto mb-3">
            <i className="ri-image-line text-2xl text-foreground-400"></i>
          </span>
          <p className="text-sm text-foreground-500">No media assets yet. Upload images or documents to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((item) => (
            <div key={item.id} className="bg-background-50 rounded-lg overflow-hidden group">
              {item.type === 'image' ? (
                <div className="aspect-square bg-background-200 relative">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      target.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                      target.parentElement!.innerHTML = '<i class="ri-image-line text-3xl text-foreground-400"></i>';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => setDeleteConfirm(item.id)}
                      className="bg-background-50/90 text-foreground-700 p-2 rounded-full hover:bg-background-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-delete-bin-line"></i>
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-square bg-background-200 flex items-center justify-center">
                  <span className="w-12 h-12 flex items-center justify-center">
                    <i className="ri-file-3-line text-3xl text-foreground-400"></i>
                  </span>
                </div>
              )}
              <div className="p-3">
                <p className="text-xs text-foreground-700 truncate font-medium" title={item.name}>{item.name}</p>
                <p className="text-[11px] text-foreground-400 mt-1">
                  {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background-50 rounded-lg w-full max-w-[380px] mx-4 p-6">
            <h3 className="text-base font-heading font-semibold text-foreground-900 mb-2">Delete Media?</h3>
            <p className="text-sm text-foreground-600 mb-6">This cannot be undone.</p>
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
    </div>
  );
}