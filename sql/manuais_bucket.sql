-- =============================================
-- BUCKET 'manuais' NO SUPABASE STORAGE
-- Execute no Supabase SQL Editor
-- =============================================

-- 1. Criar bucket público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'manuais',
  'manuais',
  true,
  52428800,  -- 50MB
  ARRAY['application/pdf']::text[]
) ON CONFLICT (id) DO NOTHING;

-- 2. RLS: Leitura pública para qualquer um
CREATE POLICY "manuais public read"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'manuais');

-- 3. RLS: Upload apenas para SUPER_ADMIN
CREATE POLICY "manuais super_admin insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'manuais'
  AND (auth.jwt() -> 'app_metadata' ->> 'role' = 'SUPER_ADMIN')
);

-- 4. RLS: Update apenas para SUPER_ADMIN
CREATE POLICY "manuais super_admin update"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'manuais'
  AND (auth.jwt() -> 'app_metadata' ->> 'role' = 'SUPER_ADMIN')
)
WITH CHECK (
  bucket_id = 'manuais'
  AND (auth.jwt() -> 'app_metadata' ->> 'role' = 'SUPER_ADMIN')
);

-- 5. RLS: Delete apenas para SUPER_ADMIN
CREATE POLICY "manuais super_admin delete"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'manuais'
  AND (auth.jwt() -> 'app_metadata' ->> 'role' = 'SUPER_ADMIN')
);
