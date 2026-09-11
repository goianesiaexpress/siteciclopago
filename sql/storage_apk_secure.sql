-- =============================================
-- STORAGE APK - Restrito para SUPER_ADMIN
-- Execute APÓS testar o upload com a versão permissiva
-- =============================================

DROP POLICY IF EXISTS "allow all storage" ON storage.objects;
DROP POLICY IF EXISTS "allow all" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all read" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all write" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all update" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all delete" ON storage.objects;
DROP POLICY IF EXISTS "apk read all" ON storage.objects;
DROP POLICY IF EXISTS "apk write all" ON storage.objects;
DROP POLICY IF EXISTS "apk update all" ON storage.objects;
DROP POLICY IF EXISTS "apk delete all" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all storage" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all storage anon" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all storage authenticated" ON storage.objects;

-- Leitura pública para apk
CREATE POLICY "apk public read"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'apk');

-- Escrita apenas para SUPER_ADMIN (via JWT app_metadata)
CREATE POLICY "apk super_admin write"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'apk' AND (auth.jwt() -> 'app_metadata' ->> 'role' = 'SUPER_ADMIN'));

CREATE POLICY "apk super_admin update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'apk' AND (auth.jwt() -> 'app_metadata' ->> 'role' = 'SUPER_ADMIN'))
WITH CHECK (bucket_id = 'apk' AND (auth.jwt() -> 'app_metadata' ->> 'role' = 'SUPER_ADMIN'));

CREATE POLICY "apk super_admin delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'apk' AND (auth.jwt() -> 'app_metadata' ->> 'role' = 'SUPER_ADMIN'));
