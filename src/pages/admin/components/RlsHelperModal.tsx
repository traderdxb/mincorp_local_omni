import { useState } from 'react';

interface RlsHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RLS_SQL_CODE = `-- MinCorp Trading LLC: Database Schema & Row-Level Security (RLS) Setup
-- Copy and run this in your Supabase Dashboard -> SQL Editor:

-- 1. Commodities Table Schema & Required Columns
CREATE TABLE IF NOT EXISTS public.commodities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT DEFAULT '',
  description TEXT DEFAULT '',
  hero_image_url TEXT DEFAULT '',
  card_image_url TEXT DEFAULT '',
  key_specs JSONB DEFAULT '[]'::jsonb,
  applications JSONB DEFAULT '[]'::jsonb,
  detailed_specs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure all JSONB and text columns exist even if created with an older schema
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS short_description TEXT DEFAULT '';
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS hero_image_url TEXT DEFAULT '';
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS card_image_url TEXT DEFAULT '';
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS key_specs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS applications JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.commodities ADD COLUMN IF NOT EXISTS detailed_specs JSONB DEFAULT '[]'::jsonb;

-- 2. Enable RLS with open policies for full Admin CRUD access
ALTER TABLE IF EXISTS public.commodities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All Commodities" ON public.commodities;
CREATE POLICY "Allow All Commodities" ON public.commodities FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS public.site_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All Site Content" ON public.site_content;
CREATE POLICY "Allow All Site Content" ON public.site_content FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS public.media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All Media" ON public.media;
CREATE POLICY "Allow All Media" ON public.media FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE IF EXISTS public.leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All Leads" ON public.leads;
CREATE POLICY "Allow All Leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- 3. Storage Bucket for uploaded images
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow All Storage Media" ON storage.objects;
CREATE POLICY "Allow All Storage Media" ON storage.objects FOR ALL USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');
`;

export default function RlsHelperModal({ isOpen, onClose }: RlsHelperModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(RLS_SQL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background-50 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-background-300">
        <div className="px-6 py-4 border-b border-background-200 flex items-center justify-between bg-background-100">
          <div className="flex items-center gap-2">
            <i className="ri-shield-keyhole-line text-xl text-primary-500" />
            <h3 className="font-heading font-semibold text-foreground-900 text-base">
              Fix Database Row-Level Security (RLS)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-foreground-400 hover:text-foreground-700 cursor-pointer p-1"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-sm text-foreground-600">
          <div className="bg-accent-50 border border-accent-200 rounded-md p-3 text-accent-900">
            <p className="font-medium mb-1">Why am I seeing &quot;violates row-level security policy&quot;?</p>
            <p className="text-xs leading-relaxed">
              In Supabase, PostgreSQL tables enforce Row-Level Security (RLS). If write policies are missing or restricted,
              inserting, updating, or deleting rows will be rejected by Supabase.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground-900 mb-2">How to apply the 1-minute fix:</h4>
            <ol className="list-decimal list-inside space-y-1 text-xs text-foreground-700">
              <li>Open your <strong>Supabase Dashboard</strong>.</li>
              <li>Click on <strong>SQL Editor</strong> in the left sidebar.</li>
              <li>Click <strong>New Query</strong>, paste the SQL below, and click <strong>Run</strong>.</li>
            </ol>
          </div>

          <div className="relative">
            <pre className="bg-background-900 text-foreground-100 p-4 rounded-md text-xs font-mono overflow-x-auto max-h-60">
              {RLS_SQL_CODE}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 bg-primary-500 hover:bg-primary-600 text-background-50 text-xs px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <i className={copied ? "ri-check-line" : "ri-file-copy-line"} />
              {copied ? "Copied!" : "Copy SQL"}
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-background-200 bg-background-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-background-200 hover:bg-background-300 text-foreground-800 rounded-md cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-background-50 font-medium rounded-md flex items-center gap-1.5 cursor-pointer"
          >
            <i className={copied ? "ri-check-line" : "ri-file-copy-line"} />
            {copied ? "Copied to Clipboard" : "Copy SQL Script"}
          </button>
        </div>
      </div>
    </div>
  );
}
