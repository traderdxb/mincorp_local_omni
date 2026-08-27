import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/supabase';

type SiteContentRow = {
  id: string;
  section: string;
  key: string;
  value: string;
  content_type: string;
  updated_at: string;
};

type ContentMap = Record<string, Record<string, string>>;

export function useSiteContent(section?: string) {
  const [content, setContent] = useState<ContentMap>({});
  const [rows, setRows] = useState<SiteContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let query = supabase.from('site_content').select('*').order('section').order('key');
      if (section) query = query.eq('section', section);
      const { data, error: err } = await query;
      if (err) throw err;
      const rowsData = (data ?? []) as SiteContentRow[];
      setRows(rowsData);
      const map: ContentMap = {};
      for (const r of rowsData) {
        if (!map[r.section]) map[r.section] = {};
        map[r.section][r.key] = r.value;
      }
      setContent(map);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load site content';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const saveRow = useCallback(async (id: string, value: string) => {
    setSaving(true);
    try {
      const { error: err } = await supabase
        .from('site_content')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (err) throw err;
      return true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to save';
      setError(msg);
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { content, rows, loading, error, saving, saveRow, refetch: fetchContent };
}