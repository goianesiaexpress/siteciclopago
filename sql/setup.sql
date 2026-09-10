-- =============================================
-- CICLOPAGO - SETUP DO SUPABASE
-- Execute este SQL no SQL Editor do Supabase
-- =============================================

-- Tabela principal de configuração do site
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para busca rápida por seção
CREATE INDEX IF NOT EXISTS idx_site_config_section ON site_config(section);

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_updated_at ON site_config;
CREATE TRIGGER trigger_updated_at
  BEFORE UPDATE ON site_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- RLS (Row Level Security)
-- =============================================
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Política de leitura: qualquer pessoa pode ler
CREATE POLICY "Leitura pública" ON site_config
  FOR SELECT
  USING (true);

-- Política de inserção: apenas usuários autenticados
CREATE POLICY "Inserir autenticado" ON site_config
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Política de atualização: apenas usuários autenticados
CREATE POLICY "Atualizar autenticado" ON site_config
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Política de exclusão: apenas usuários autenticados
CREATE POLICY "Excluir autenticado" ON site_config
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- =============================================
-- DADOS INICIAIS - Todas as seções do site
-- =============================================

INSERT INTO site_config (section, data) VALUES
('site', '{
  "title": "CicloPago - Gestão Inteligente de Consórcios",
  "description": "Gerencie seus consórcios com inteligência. Acompanhe pagamentos, grupos, parcelas e progresso financeiro com segurança total."
}'),
('hero', '{
  "badge": "Novo v1.0.4 disponível",
  "titlePrefix": "A Gestão dos seus Consórcios na",
  "titleHighlight": "Palma da sua Mão",
  "subtitle": "Acompanhe pagamentos, grupos, parcelas e progresso financeiro com total segurança e criptografia de ponta.",
  "ctaText": "Baixar APK Grátis",
  "ctaLink": "#download",
  "secondaryText": "Ver Funcionalidades",
  "secondaryLink": "#recursos",
  "badges": [
    {"text": "Android 8.0+"},
    {"text": "100% Seguro"},
    {"text": "Criptografia de Dados"}
  ]
}'),
('metrics', '{
  "items": [
    {"value": 500, "suffix": "+", "label": "Usuários confiando no CicloPago para gestão inteligente."},
    {"value": 98, "suffix": "%", "label": "Satisfação dos nossos usuários com o aplicativo."},
    {"value": 10, "suffix": "K+", "label": "Downloads realizados desde o lançamento."}
  ]
}'),
('features', '{
  "tag": "Recursos",
  "title": "Tudo que você precisa para",
  "titleHighlight": "gestão inteligente",
  "subtitle": "Funcionalidades pensadas para simplificar o controle dos seus consórcios.",
  "items": [
    {"title": "Organização por Grupos", "desc": "Agrupe cotas, membros e pagamentos com visualização em cards expansíveis e intuitivos."},
    {"title": "Progresso Financeiro Circular", "desc": "Gráficos circulares que mostram visualmente a porcentagem quitada de cada grupo."},
    {"title": "Gestão de Participantes", "desc": "Acompanhe em tempo real parcelas abertas, quitadas e em atraso de cada participante."},
    {"title": "Contemplações e Histórico", "desc": "Registre contemplações e mantenha o histórico financeiro de cada grupo organizado."},
    {"title": "Painel Geral Simplificado", "desc": "Dashboard intuitivo com visão consolidada de todos os seus investimentos em consórcio."},
    {"title": "Segurança de Dados", "desc": "Autenticação robusta e criptografia de dados para máxima proteção e segurança."}
  ]
}'),
('howItWorks', '{
  "tag": "Como Funciona",
  "title": "Simples, rápido e",
  "titleHighlight": "intuitivo",
  "subtitle": "Em apenas 3 passos você começa a gerenciar seus consórcios.",
  "steps": [
    {"number": "01", "title": "Baixe o APK", "desc": "Toque no botão de download e salve o arquivo no seu dispositivo."},
    {"number": "02", "title": "Instale com Segurança", "desc": "Autorize a instalação e aguarde poucos segundos."},
    {"number": "03", "title": "Comece a Usar", "desc": "Abra o app, crie sua conta e gerencie seus consórcios."}
  ]
}'),
('download', '{
  "title": "Pronto para Organizar seus Consórcios?",
  "subtitle": "Baixe o CicloPago agora e comece a gerenciar seus consórcios com inteligência.",
  "btnText": "Baixar CicloPago.apk",
  "btnLink": "./downloads/ciclopago.apk",
  "version": "v1.0.4",
  "versionLabel": "Versão Atual: 1.0.4",
  "date": "Atualizado em Setembro de 2026",
  "compat": "Compatível com Android"
}'),
('howToInstall', '{
  "tag": "Instalação",
  "title": "Como Instalar o APK no",
  "titleHighlight": "Android",
  "subtitle": "Siga estes passos simples e tenha o CicloPago em segundos.",
  "steps": [
    {"number": "1", "title": "Baixe o arquivo", "desc": "Toque no botão de download acima. O arquivo <strong>ciclopago.apk</strong> será baixado para o seu dispositivo."},
    {"number": "2", "title": "Autorize a Instalação", "desc": "Se solicitado, ative a opção <strong>\"Permitir desta fonte\"</strong> nas configurações do seu navegador ou galeria."},
    {"number": "3", "title": "Instale e Abra", "desc": "Toque no arquivo baixado nas notificações e clique em <strong>\"Instalar\"</strong>. Prontinho, é só usar!"}
  ]
}'),
('faq', '{
  "tag": "Dúvidas",
  "title": "Perguntas",
  "titleHighlight": "Frequentes",
  "items": [
    {"question": "Por que baixar o APK direto do site?", "answer": "A instalação direta via APK garante atualizações rápidas, sem depender de lojas de aplicativos, com total controle sobre as versões e sem intermediários. Você sempre terá a versão mais recente do CicloPago."},
    {"question": "O aplicativo é seguro?", "answer": "Sim! O CicloPago utiliza autenticação segura e banco de dados criptografado, garantindo que seus dados estejam sempre protegidos com as melhores tecnologias de segurança."},
    {"question": "Preciso de internet para usar?", "answer": "O aplicativo sincroniza seus dados com a nuvem, garantindo que suas informações estejam sempre seguras e acessíveis. Para a melhor experiência, recomendamos conexão com a internet durante o uso."},
    {"question": "Quais são os requisitos mínimos do sistema?", "answer": "O CicloPago é compatível com dispositivos Android 8.0 (Oreo) ou superior. Recomendamos pelo menos 2 GB de RAM para uma experiência fluida."}
  ]
}'),
('testimonials', '{
  "tag": "Depoimentos",
  "title": "O que nossos",
  "titleHighlight": "usuários",
  "subtitle": "Veja quem já está usando o CicloPago para gerenciar seus consórcios.",
  "items": [
    {"initials": "MC", "name": "Marcos Costa", "role": "Empresário, SP", "text": "O CicloPago revolucionou minha gestão de consórcios. Agora consigo acompanhar tudo de forma simples e organizada. Recomendo demais!"},
    {"initials": "AS", "name": "Ana Silva", "role": "Contadora, RJ", "text": "Interface intuitiva e dados sempre atualizados. O melhor app que já usei para controlar meus consórcios. Nota 10!"},
    {"initials": "RF", "name": "Roberto Ferreira", "role": "Advogado, MG", "text": "Segurança e praticidade em um só lugar. O CicloPago me dá total controle sobre todos os meus consórcios. Simplesmente perfeito!"}
  ]
}'),
('footer', '{
  "desc": "Gestão inteligente de consórcios. Organize, acompanhe e gerencie seus investimentos com segurança e simplicidade.",
  "newsletterTitle": "Receba atualizações",
  "newsletterDesc": "Fique por dentro das novidades e versões do CicloPago.",
  "newsletterPlaceholder": "Seu melhor e-mail",
  "newsletterBtn": "Inscrever",
  "copyright": "© 2026 CicloPago Consórcios. Todos os direitos reservados."
}'),
('androidBanner', '{
  "text": "📱 Detectamos que você está no Android! O download está otimizado para você.",
  "ctaText": "Baixar Agora"
}')
ON CONFLICT (section) DO NOTHING;

-- =============================================
-- Criar usuário admin (opcional)
-- Vá em Authentication > Users no Supabase
-- e crie um usuário com email/senha
-- =============================================
