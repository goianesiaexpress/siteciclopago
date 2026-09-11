-- =============================================
-- TABELA 'manuais' NO BANCO
-- Execute no Supabase SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS manuais (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  url_arquivo TEXT NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE manuais ENABLE ROW LEVEL SECURITY;

-- Leitura pública
CREATE POLICY "manuais public read"
ON manuais FOR SELECT TO public
USING (true);

-- Insert/Update/Delete apenas SUPER_ADMIN
CREATE POLICY "manuais super_admin all"
ON manuais FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'SUPER_ADMIN'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'SUPER_ADMIN'
  )
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_manuais_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER manuais_updated_at
  BEFORE UPDATE ON manuais
  FOR EACH ROW
  EXECUTE FUNCTION update_manuais_timestamp();

-- Inserir registro padrão do Ebook
INSERT INTO manuais (titulo, descricao, url_arquivo)
VALUES (
  'Guia do Gestor CicloPago',
  'Guia completo para gestores de consórcio com dicas, tutorial e melhores práticas.',
  'https://kgdobzyphonczgpjrlnc.supabase.co/storage/v1/object/public/manuais/Ciclo_Pago_Guia_de_Gestao_Com_Logos.pdf'
) ON CONFLICT DO NOTHING;
