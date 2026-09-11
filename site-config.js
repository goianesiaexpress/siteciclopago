// =============================================
// site-config.js - Configuração do site
// Fallback local + integração Supabase
// =============================================

const SITE_CONFIG_DEFAULTS = {
  site: {
    title: "CicloPago - Gestão Inteligente de Consórcios",
    description: "Gerencie seus consórcios com inteligência. Acompanhe pagamentos, grupos, parcelas e progresso financeiro com segurança total.",
  },
  hero: {
    badge: "Novo v1.0.4 disponível • Apenas Android",
    titlePrefix: "A Gestão dos seus Consórcios na",
    titleHighlight: "Palma da sua Mão",
    subtitle: "Acompanhe pagamentos, grupos, parcelas e progresso financeiro com total segurança e criptografia de ponta. Exclusivo para dispositivos Android.",
    ctaText: "Baixar APK Grátis",
    ctaLink: "#download",
    secondaryText: "Ver Funcionalidades",
    secondaryLink: "#recursos",
    badges: [
      { text: "Apenas Android" },
      { text: "Android 11+" },
      { text: "100% Seguro" }
    ]
  },
  metrics: {
    items: [
      { value: 500, suffix: "+", label: "Usuários confiando no CicloPago para gestão inteligente." },
      { value: 98, suffix: "%", label: "Satisfação dos nossos usuários com o aplicativo." },
      { value: 10, suffix: "K+", label: "Downloads realizados desde o lançamento." }
    ]
  },
  features: {
    tag: "Recursos",
    title: "Tudo que você precisa para",
    titleHighlight: "gestão inteligente",
    subtitle: "Funcionalidades pensadas para simplificar o controle dos seus consórcios.",
    items: [
      { title: "Organização por Grupos", desc: "Agrupe cotas, membros e pagamentos com visualização em cards expansíveis e intuitivos." },
      { title: "Progresso Financeiro Circular", desc: "Gráficos circulares que mostram visualmente a porcentagem quitada de cada grupo." },
      { title: "Gestão de Participantes", desc: "Acompanhe em tempo real parcelas abertas, quitadas e em atraso de cada participante." },
      { title: "Contemplações e Histórico", desc: "Registre contemplações e mantenha o histórico financeiro de cada grupo organizado." },
      { title: "Painel Geral Simplificado", desc: "Dashboard intuitivo com visão consolidada de todos os seus investimentos em consórcio." },
      { title: "Segurança de Dados", desc: "Autenticação robusta e criptografia de dados para máxima proteção e segurança." }
    ]
  },
  howItWorks: {
    tag: "Como Funciona",
    title: "Simples, rápido e",
    titleHighlight: "intuitivo",
    subtitle: "Em apenas 3 passos você começa a gerenciar seus consórcios.",
    steps: [
      { number: "01", title: "Baixe o APK", desc: "Toque no botão de download e salve o arquivo no seu dispositivo." },
      { number: "02", title: "Instale com Segurança", desc: "Autorize a instalação e aguarde poucos segundos." },
      { number: "03", title: "Comece a Usar", desc: "Abra o app, crie sua conta e gerencie seus consórcios." }
    ]
  },
  download: {
    title: "Pronto para Organizar seus Consórcios?",
    subtitle: "Baixe o CicloPago agora e comece a gerenciar seus consórcios com inteligência. Disponível exclusivamente para Android.",
    btnText: "Baixar CicloPago.apk",
    btnLink: "https://kgdobzyphonczgpjrlnc.supabase.co/storage/v1/object/public/apk/ciclopago.apk?download=",
    version: "v1.0.4",
    versionLabel: "Versão Atual: 1.0.4",
    date: "Atualizado em Setembro de 2026",
    compat: "Apenas Android • Não disponível para iOS"
  },
  howToInstall: {
    tag: "Instalação",
    title: "Como Instalar o APK no",
    titleHighlight: "Android",
    subtitle: "Siga estes passos simples e tenha o CicloPago em segundos.",
    steps: [
      { number: "1", title: "Baixe o arquivo", desc: "Toque no botão de download acima. O arquivo <strong>ciclopago.apk</strong> será baixado para o seu dispositivo." },
      { number: "2", title: "Autorize a Instalação", desc: "Se solicitado, ative a opção <strong>\"Permitir desta fonte\"</strong> nas configurações do seu navegador ou galeria." },
      { number: "3", title: "Instale e Abra", desc: "Toque no arquivo baixado nas notificações e clique em <strong>\"Instalar\"</strong>. Prontinho, é só usar!" }
    ]
  },
  faq: {
    tag: "Dúvidas",
    title: "Perguntas",
    titleHighlight: "Frequentes",
    items: [
      { question: "Por que baixar o APK direto do site?", answer: "A instalação direta via APK garante atualizações rápidas, sem depender de lojas de aplicativos, com total controle sobre as versões e sem intermediários. Você sempre terá a versão mais recente do CicloPago." },
      { question: "O aplicativo é seguro?", answer: "Sim! O CicloPago utiliza autenticação segura e banco de dados criptografado, garantindo que seus dados estejam sempre protegidos com as melhores tecnologias de segurança." },
      { question: "Preciso de internet para usar?", answer: "O aplicativo sincroniza seus dados com a nuvem, garantindo que suas informações estejam sempre seguras e acessíveis. Para a melhor experiência, recomendamos conexão com a internet durante o uso." },
      { question: "Quais são os requisitos mínimos do sistema?", answer: "O CicloPago é exclusivo para Android 8.0 (Oreo) ou superior. Recomendamos pelo menos 2 GB de RAM. Não há versão para iOS — apenas dispositivos Android são compatíveis." },
      { question: "Funciona no iPhone (iOS)?", answer: "Não. O CicloPago é desenvolvido exclusivamente para o sistema Android. Usuários de iPhone não conseguem instalar o APK." }
    ]
  },
  testimonials: {
    tag: "Depoimentos",
    title: "O que nossos",
    titleHighlight: "usuários",
    subtitle: "Veja quem já está usando o CicloPago para gerenciar seus consórcios.",
    items: [
      { initials: "MC", name: "Marcos Costa", role: "Empresário, SP", text: "O CicloPago revolucionou minha gestão de consórcios. Agora consigo acompanhar tudo de forma simples e organizada. Recomendo demais!" },
      { initials: "AS", name: "Ana Silva", role: "Contadora, RJ", text: "Interface intuitiva e dados sempre atualizados. O melhor app que já usei para controlar meus consórcios. Nota 10!" },
      { initials: "RF", name: "Roberto Ferreira", role: "Advogado, MG", text: "Segurança e praticidade em um só lugar. O CicloPago me dá total controle sobre todos os meus consórcios. Simplesmente perfeito!" }
    ]
  },
  footer: {
    desc: "Gestão inteligente de consórcios. Organize, acompanhe e gerencie seus investimentos com segurança e simplicidade.",
    newsletterTitle: "Receba atualizações",
    newsletterDesc: "Fique por dentro das novidades e versões do CicloPago.",
    newsletterPlaceholder: "Seu melhor e-mail",
    newsletterBtn: "Inscrever",
    copyright: "© 2026 CicloPago Consórcios. Todos os direitos reservados."
  },
  androidBanner: {
    text: "📱 Detectamos que você está no Android! O download está otimizado para você.",
    ctaText: "Baixar Agora"
  },
  ebook: {
    title: "Guia do Gestor CicloPago",
    desc: "Baixe gratuitamente o ebook completo com tutorial, dicas e melhores práticas para gerenciar seus consórcios com eficiência.",
    btnText: "Baixar Ebook - Guia do Gestor (PDF)",
    label: "PDF • Gratuito • Atualizado 2026",
    url: "https://kgdobzyphonczgpjrlnc.supabase.co/storage/v1/object/public/manuais/Ciclo_Pago_Guia_de_Gestao_Com_Logos.pdf"
  }
};

// =============================================
// Funções de acesso aos dados
// =============================================

let _cachedConfig = null;

async function loadSiteConfig() {
  // Se já tem cache, retorna
  if (_cachedConfig) return _cachedConfig;

  // Tenta buscar do Supabase
  if (typeof DB !== 'undefined') {
    try {
      const dbConfig = await DB.getAll();
      if (dbConfig && Object.keys(dbConfig).length > 0) {
        _cachedConfig = mergeConfig(SITE_CONFIG_DEFAULTS, dbConfig);
        return _cachedConfig;
      }
    } catch (e) {
      console.warn('Supabase indisponível, usando fallback local:', e);
    }
  }

  // Fallback: tenta localStorage
  const saved = localStorage.getItem('siteConfig');
  if (saved) {
    try {
      _cachedConfig = JSON.parse(saved);
      return _cachedConfig;
    } catch (e) {}
  }

  // Retorna padrão
  _cachedConfig = SITE_CONFIG_DEFAULTS;
  return _cachedConfig;
}

async function saveSiteConfig(config) {
  _cachedConfig = config;

  // Salva no Supabase (apenas SUPER_ADMIN consegue via RLS)
  let ok = true;
  if (typeof DB !== 'undefined') {
    try {
      ok = await DB.saveAll(config);
      if (!ok) console.warn('Supabase saveAll retornou false (RLS SUPER_ADMIN?)');
    } catch (e) {
      console.warn('Erro ao salvar no Supabase:', e);
      ok = false;
    }
  }

  // Também salva no localStorage como backup
  localStorage.setItem('siteConfig', JSON.stringify(config));
  return ok;
}

async function resetSiteConfig() {
  _cachedConfig = SITE_CONFIG_DEFAULTS;
  localStorage.removeItem('siteConfig');

  if (typeof DB !== 'undefined') {
    try {
      await DB.saveAll(SITE_CONFIG_DEFAULTS);
    } catch (e) {}
  }

  return SITE_CONFIG_DEFAULTS;
}

function mergeConfig(defaults, overrides) {
  const result = JSON.parse(JSON.stringify(defaults));
  for (const key in overrides) {
    if (overrides[key] !== null && typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
      result[key] = mergeConfig(result[key] || {}, overrides[key]);
    } else {
      result[key] = overrides[key];
    }
  }
  return result;
}

function clearConfigCache() {
  _cachedConfig = null;
}
