-- =============================================
-- STORAGE APK - Permissivo para teste (qualquer um pode ler/escrever em apk)
-- Execute no SQL Editor para fazer upload funcionar imediatamente
-- Depois restrinja para SUPER_ADMIN
-- =============================================

-- Remove políticas antigas
DROP POLICY IF EXISTS "apk public read" ON storage.objects;
DROP POLICY IF EXISTS "apk authenticated insert" ON storage.objects;
DROP POLICY IF EXISTS "apk authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "apk authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "apk super_admin insert" ON storage.objects;
DROP POLICY IF EXISTS "apk super_admin update" ON storage.objects;
DROP POLICY IF EXISTS "apk super_admin delete" ON storage.objects;
DROP POLICY IF EXISTS "apk allow all" ON storage.objects;

-- Leitura pública irrestrita para apk
CREATE POLICY "apk allow all read"
ON storage.objects FOR SELECT
USING (bucket_id = 'apk');

-- Escrita irrestrita para apk (para teste, qualquer um pode enviar)
CREATE POLICY "apk allow all write"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'apk');

CREATE POLICY "apk allow all update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'apk')
WITH CHECK (bucket_id = 'apk');

CREATE POLICY "apk allow all delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'apk');

-- Verifica: deve permitir upload via anon/SUPER_ADMIN
