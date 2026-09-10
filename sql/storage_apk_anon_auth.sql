-- Permite anon e authenticated explicitamente
DROP POLICY IF EXISTS "allow all storage" ON storage.objects;
CREATE POLICY "allow all storage anon"
ON storage.objects FOR ALL TO anon
USING (true) WITH CHECK (true);
CREATE POLICY "allow all storage authenticated"
ON storage.objects FOR ALL TO authenticated
USING (true) WITH CHECK (true);
-- Verifica
-- SELECT policyname, roles FROM pg_policies WHERE schemaname='storage' AND tablename='objects';
