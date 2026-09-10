-- =============================================
-- STORAGE APK - Políticas SIMPLES (sem is_super_admin)
-- Execute no SQL Editor do Supabase
-- Permite qualquer usuário autenticado escrever em apk (para teste)
-- Depois restrinja para SUPER_ADMIN
-- =============================================

-- Leitura pública para apk
DROP POLICY IF EXISTS "apk public read" ON storage.objects;
CREATE POLICY "apk public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'apk');

-- Escrita para qualquer autenticado (temporário, para testar upload)
DROP POLICY IF EXISTS "apk super_admin insert" ON storage.objects;
DROP POLICY IF EXISTS "apk authenticated insert" ON storage.objects;
CREATE POLICY "apk authenticated insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'apk' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "apk super_admin update" ON storage.objects;
DROP POLICY IF EXISTS "apk authenticated update" ON storage.objects;
CREATE POLICY "apk authenticated update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'apk' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'apk' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "apk super_admin delete" ON storage.objects;
DROP POLICY IF EXISTS "apk authenticated delete" ON storage.objects;
CREATE POLICY "apk authenticated delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'apk' AND auth.role() = 'authenticated');

-- Para restringir depois para SUPER_ADMIN, use:
-- EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'SUPER_ADMIN')
-- ou
-- (auth.jwt() -> 'app_metadata' ->> 'role' = 'SUPER_ADMIN')
