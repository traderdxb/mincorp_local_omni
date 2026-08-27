import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { isSupabaseConfigured, supabaseUrl } from '@/lib/supabase';

export default function AdminLoginPage() {
  const { staffUser, staffSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showConfigHelp, setShowConfigHelp] = useState(!isSupabaseConfigured());

  if (staffUser) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await staffSignIn(email, password);
    } catch (err: unknown) {
      console.error('Staff login error:', err);
      let message = 'Invalid email or password';
      if (err && typeof err === 'object') {
        const e = err as Record<string, unknown>;
        if (typeof e.message === 'string') message = e.message;
        else if (typeof e.error_description === 'string') message = e.error_description;
        else if (typeof e.error === 'string') message = e.error;
        else if (typeof e.msg === 'string') message = e.msg;
        else if (typeof e.statusText === 'string') message = e.statusText;
      }

      if (message.toLowerCase().includes('failed to fetch') || message.toLowerCase().includes('networkerror') || !isSupabaseConfigured()) {
        message = 'Unable to connect to Supabase (Failed to fetch). If deployed on Netlify, please verify that your Supabase Environment Variables are added in Netlify Site Configuration and redeploy.';
        setShowConfigHelp(true);
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-100 py-12 px-4">
      <div className="w-full max-w-[460px]">
        <div className="bg-background-50 rounded-lg p-8 shadow-sm border border-background-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-heading font-bold text-foreground-900 mb-2">
              Admin Portal
            </h1>
            <p className="text-sm text-foreground-500">
              MinCorp Trading LLC — Staff Access Only
            </p>
          </div>

          {!isSupabaseConfigured() && (
            <div className="mb-6 bg-accent-50 border border-accent-300 rounded-md p-4 text-xs text-accent-950">
              <div className="flex items-center gap-1.5 font-semibold text-accent-900 mb-1">
                <i className="ri-error-warning-fill text-accent-600 text-sm" />
                Missing Supabase Environment Variables
              </div>
              <p className="text-accent-800 leading-relaxed mb-2">
                Your deployment is using placeholder Supabase credentials. In Netlify, navigate to:
              </p>
              <p className="font-mono bg-background-50/80 p-2 rounded border border-accent-200 text-[11px] mb-2 text-foreground-900">
                <strong>Site configuration</strong> → <strong>Environment variables</strong><br />
                • VITE_PUBLIC_SUPABASE_URL<br />
                • VITE_PUBLIC_SUPABASE_ANON_KEY
              </p>
              <p className="text-[11px] text-accent-700">
                Then trigger a fresh <strong>Clear cache and deploy site</strong>.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 text-sm border border-background-300 rounded-md bg-background-50 text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-colors"
                placeholder="staff@mincorp.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 text-sm border border-background-300 rounded-md bg-background-50 text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-accent-100 text-accent-950 text-xs px-4 py-3 rounded-md border border-accent-300 leading-relaxed">
                <p className="font-semibold text-accent-900 mb-1">Login Error</p>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-500 text-background-50 font-heading font-bold text-sm px-6 py-3 rounded-md hover:bg-primary-600 active:bg-primary-700 disabled:opacity-60 transition-colors cursor-pointer whitespace-nowrap"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="ri-loader-4-line animate-spin"></i>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {showConfigHelp && (
            <div className="mt-6 pt-4 border-t border-background-200 text-xs text-foreground-500">
              <span className="font-medium text-foreground-700">Active URL:</span>{' '}
              <code className="text-[11px] bg-background-100 px-1.5 py-0.5 rounded text-foreground-800 break-all">
                {supabaseUrl}
              </code>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-foreground-400 mt-6">
          Authorized personnel only. Access is monitored and logged.
        </p>
      </div>
    </div>
  );
}