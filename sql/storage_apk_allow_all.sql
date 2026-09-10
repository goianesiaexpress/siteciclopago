-- =============================================
-- STORAGE APK - Permissivo TOTAL para teste
-- Execute no SQL Editor
-- =============================================

-- Remove todas as políticas apk antigas
DROP POLICY IF EXISTS "apk public read" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all read" ON storage.objects;
DROP POLICY IF EXISTS "apk authenticated insert" ON storage.objects;
DROP POLICY IF EXISTS "apk super_admin insert" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all write" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all update" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all delete" ON storage.objects;
DROP POLICY IF EXISTS "apk authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "apk authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all" ON storage.objects;

-- Cria uma única política permissiva para todas as operações em apk
CREATE POLICY "apk allow all"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'apk')
WITH CHECK (bucket_id = 'apk');

-- Verifica se RLS está habilitado (deve estar)
-- SELECT relname, relrowsecurity FROM pg_class WHERE relname='objects' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname='storage');
