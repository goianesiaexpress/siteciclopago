-- =============================================
-- STORAGE APK - Políticas CORRIGIDAS (sem is_super_admin)
-- Execute no SQL Editor do Supabase
-- Erro anterior: function public.is_super_admin() does not exist
-- Usa verificação direta em public.users
-- =============================================

-- Leitura pública para apk
DROP POLICY IF EXISTS "apk public read" ON storage.objects;
CREATE POLICY "apk public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'apk');

-- Escrita apenas para SUPER_ADMIN (verificação direta)
DROP POLICY IF EXISTS "apk super_admin insert" ON storage.objects;
CREATE POLICY "apk super_admin insert"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'apk' AND
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'SUPER_ADMIN')
);

DROP POLICY IF EXISTS "apk super_admin update" ON storage.objects;
CREATE POLICY "apk super_admin update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'apk' AND
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'SUPER_ADMIN')
)
WITH CHECK (
  bucket_id = 'apk' AND
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'SUPER_ADMIN')
);

DROP POLICY IF EXISTS "apk super_admin delete" ON storage.objects;
CREATE POLICY "apk super_admin delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'apk' AND
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'SUPER_ADMIN')
);

-- Verifica
-- SELECT policyname, cmd FROM pg_policies WHERE tablename='objects' AND schemaname='storage' AND policyname LIKE 'apk%';
