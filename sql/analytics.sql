-- =============================================
-- ANALYTICS - Rastreamento de visitas e online
-- Execute no SQL Editor do Supabase
-- =============================================

-- Tabela de visitas (total)
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  path TEXT NOT NULL DEFAULT '/',
  user_agent TEXT,
  ip TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_site_visits_created ON site_visits(created_at);
CREATE INDEX IF NOT EXISTS idx_site_visits_session ON site_visits(session_id);

-- Tabela de presença online (heartbeat)
CREATE TABLE IF NOT EXISTS online_presence (
  session_id TEXT PRIMARY KEY,
  path TEXT DEFAULT '/',
  user_agent TEXT,
  last_seen TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_online_last_seen ON online_presence(last_seen);

-- RLS
ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_presence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "visits insert anon" ON site_visits;
CREATE POLICY "visits insert anon" ON site_visits FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "visits select anon" ON site_visits;
CREATE POLICY "visits select anon" ON site_visits FOR SELECT USING (true);

DROP POLICY IF EXISTS "online upsert anon" ON online_presence;
CREATE POLICY "online upsert anon" ON online_presence FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "online update anon" ON online_presence;
CREATE POLICY "online update anon" ON online_presence FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "online select anon" ON online_presence;
CREATE POLICY "online select anon" ON online_presence FOR SELECT USING (true);
DROP POLICY IF EXISTS "online delete anon" ON online_presence;
CREATE POLICY "online delete anon" ON online_presence FOR DELETE USING (true);

-- Função para total de visitas
CREATE OR REPLACE FUNCTION get_total_visits()
RETURNS BIGINT AS $$
  SELECT COUNT(*)::BIGINT FROM site_visits;
$$ LANGUAGE sql SECURITY DEFINER;

-- Função para online agora (últimos 2 minutos)
CREATE OR REPLACE FUNCTION get_online_count()
RETURNS BIGINT AS $$
  SELECT COUNT(*)::BIGINT FROM online_presence WHERE last_seen > now() - interval '2 minutes';
$$ LANGUAGE sql SECURITY DEFINER;

-- Habilita Realtime para online_presence (para presence via DB polling, opcional)
-- No Dashboard: Database -> Realtime -> habilite online_presence

-- Limpeza automática de sessões antigas (opcional, roda manualmente ou via cron)
-- DELETE FROM online_presence WHERE last_seen < now() - interval '10 minutes';
