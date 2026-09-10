-- =============================================
-- STORAGE APK - Final permissivo (anon + authenticated)
-- Execute no SQL Editor
-- =============================================

-- Remove todas
DROP POLICY IF EXISTS "apk public read" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all read" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all write" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all update" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all delete" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all" ON storage.objects;
DROP POLICY IF EXISTS "apk authenticated insert" ON storage.objects;
DROP POLICY IF EXISTS "apk authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "apk authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "apk super_admin insert" ON storage.objects;
DROP POLICY IF EXISTS "apk super_admin update" ON storage.objects;
DROP POLICY IF EXISTS "apk super_admin delete" ON storage.objects;

-- Leitura para todos
CREATE POLICY "apk read all"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'apk');

-- Escrita para anon e authenticated (para teste, SUPER_ADMIN está em authenticated)
CREATE POLICY "apk write all"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'apk');

CREATE POLICY "apk update all"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'apk')
WITH CHECK (bucket_id = 'apk');

CREATE POLICY "apk delete all"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'apk');

-- Verifica
-- SELECT policyname, cmd, roles FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname LIKE 'apk%';
