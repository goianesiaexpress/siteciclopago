-- =============================================
-- STORAGE APK - Políticas para bucket apk
-- Execute no SQL Editor do Supabase
-- =============================================

-- Bucket apk já criado via API (public: true)
-- Políticas para storage.objects

-- Leitura pública para apk
DROP POLICY IF EXISTS "apk public read" ON storage.objects;
CREATE POLICY "apk public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'apk');

-- Escrita apenas para SUPER_ADMIN
DROP POLICY IF EXISTS "apk super_admin insert" ON storage.objects;
CREATE POLICY "apk super_admin insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'apk' AND public.is_super_admin());

DROP POLICY IF EXISTS "apk super_admin update" ON storage.objects;
CREATE POLICY "apk super_admin update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'apk' AND public.is_super_admin())
WITH CHECK (bucket_id = 'apk' AND public.is_super_admin());

DROP POLICY IF EXISTS "apk super_admin delete" ON storage.objects;
CREATE POLICY "apk super_admin delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'apk' AND public.is_super_admin());

-- Verifica
-- SELECT * FROM storage.buckets WHERE id='apk';
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename='objects' AND schemaname='storage';
