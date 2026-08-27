import { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import supabase from '@/lib/supabase';

interface StaffUser {
  id: string;
  email: string;
  name: string;
  token: string;
}

interface StaffLoginResult {
  success: boolean;
  error?: string;
  staff?: StaffUser;
}

const STAFF_STORAGE_KEY = 'mincorp_staff_user';

function loadStoredStaff(): StaffUser | null {
  try {
    const stored = localStorage.getItem(STAFF_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [staffUser, setStaffUser] = useState<StaffUser | null>(loadStoredStaff);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        console.error('Session fetch error:', error.message);
      }
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
      }
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const staffSignIn = useCallback(async (email: string, password: string) => {
    let authSuccess = false;
    let authErrorMessage = '';

    // 1. Try standard Supabase Auth first (which sets session token with 'authenticated' role for RLS)
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!authError && authData.session) {
        authSuccess = true;
        const staff: StaffUser = {
          id: authData.user.id,
          email: authData.user.email || email,
          name: authData.user.user_metadata?.name || email.split('@')[0],
          token: authData.session.access_token,
        };
        localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff));
        setStaffUser(staff);
        setSession(authData.session);
        return;
      } else if (authError) {
        authErrorMessage = authError.message;
      }
    } catch {
      // Continue to RPC fallback
    }

    // 2. Fallback to verify_staff_login RPC if custom staff table is used
    try {
      const { data, error } = await supabase.rpc('verify_staff_login', {
        p_email: email,
        p_password: password,
      });

      if (!error && data) {
        const result = data as StaffLoginResult;
        if (result.success && result.staff) {
          localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(result.staff));
          setStaffUser(result.staff);
          return;
        }
      }
    } catch {
      // Ignore RPC error if Supabase auth already gave an error
    }

    if (!authSuccess) {
      throw new Error(authErrorMessage || 'Invalid email or password');
    }
  }, []);

  const signOut = useCallback(async () => {
    supabase.auth.signOut().catch(() => {});
    localStorage.removeItem(STAFF_STORAGE_KEY);
    setStaffUser(null);
  }, []);

  const isAuthenticated = !!session || !!staffUser;

  return { session, staffUser, loading, isAuthenticated, signIn, staffSignIn, signOut };
}