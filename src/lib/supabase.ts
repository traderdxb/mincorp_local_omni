import { createClient } from '@supabase/supabase-js';

export const supabaseUrl: string =
  (import.meta.env.VITE_PUBLIC_SUPABASE_URL as string) ||
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  'https://placeholder-project.supabase.co';

export const supabaseAnonKey: string =
  (import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'placeholder-anon-key';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl !== 'https://placeholder-project.supabase.co' &&
    !supabaseUrl.includes('placeholder') &&
    supabaseAnonKey &&
    supabaseAnonKey !== 'placeholder-anon-key' &&
    !supabaseAnonKey.includes('placeholder')
  );
};

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: async (input, init = {}) => {
      const headers = new Headers(init.headers);
      try {
        const stored = localStorage.getItem('mincorp_staff_user');
        const staff = stored ? JSON.parse(stored) : null;
        if (staff?.token) headers.set('x-staff-token', staff.token);
      } catch {
        // Ignore malformed local storage and send the request without a staff token.
      }
      return fetch(input, { ...init, headers });
    },
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

export default supabase;