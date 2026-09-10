// =============================================
// painel.js - Lógica do Painel de Administração
// =============================================

let config = {};
const toast = document.getElementById('toast');
const toastMsg = document.getElementById('toastMsg');

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupLoginForm();
  setupNavigation();
  setupSidebar();
  document.getElementById('btnSave').addEventListener('click', saveAll);
  document.getElementById('btnReset').addEventListener('click', resetConfig);
  document.getElementById('btnLogout').addEventListener('click', doLogout);
});

// =============================================
// AUTH
// =============================================

async function checkAuth() {
  const session = await DB.getSession();
  if (session) {
    const isSuper = await DB.isSuperAdmin();
    if (!isSuper) {
      await DB.logout();
      showLogin();
      document.getElementById('loginError').textContent = 'Acesso restrito: apenas SUPER_ADMIN (ciclopago@gmail.com) pode acessar o painel.';
      return;
    }
    showPanel(session.user.email);
  } else {
    showLogin();
  }
}

function showLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('panelWrapper').style.display = 'none';
}

function showPanel(email) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('panelWrapper').style.display = 'flex';
  document.getElementById('userEmail').textContent = email;
  loadAllFields();
}

function setupLoginForm() {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('btnLogin');
    const error = document.getElementById('loginError');

    btn.textContent = 'Entrando...';
    btn.disabled = true;
    error.textContent = '';
    error.style.display = 'block';

    try {
      const result = await DB.login(email, password);

      if (result.error) {
        error.textContent = result.error;
        btn.textContent = 'Entrar';
        btn.disabled = false;
        return;
      }

      // Verifica se é SUPER_ADMIN (único autorizado) com timeout de 8s
      let isSuper = false;
      try {
        const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000));
        isSuper = await Promise.race([DB.isSuperAdmin(), timeout]);
      } catch (err) {
        console.warn('isSuperAdmin falhou/timeout:', err);
        error.textContent = 'Erro ao verificar permissão SUPER_ADMIN. Tente novamente.';
        btn.textContent = 'Entrar';
        btn.disabled = false;
        return;
      }

      if (!isSuper) {
        try { await DB.logout(); } catch(_){}
        error.textContent = 'Acesso negado: apenas SUPER_ADMIN (ciclopago@gmail.com) pode acessar o painel. Seu usuário não tem permissão.';
        btn.textContent = 'Entrar';
        btn.disabled = false;
        return;
      }

      showPanel(result.user.email);
    } catch (err) {
      console.error('Erro inesperado no login:', err);
      error.textContent = 'Erro inesperado: ' + (err.message || err);
      btn.textContent = 'Entrar';
      btn.disabled = false;
    }
  });
}

async function doLogout() {
  await DB.logout();
  showLogin();
}

// =============================================
// NAVIGATION
// =============================================

function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const section = item.dataset.section;
      document.querySelectorAll('.panel-section').forEach(s => s.classList.remove('active'));
      document.getElementById('section-' + section).classList.add('active');
      closeSidebar();
    });
  });
}

function setupSidebar() {
  const toggle = document.getElementById('menuToggle');
  const close = document.getElementById('sidebarClose');
  toggle.addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
    const bd = document.querySelector('.sidebar-backdrop');
    if (bd) { bd.style.display = 'block'; setTimeout(() => bd.classList.add('show'), 10); }
  });
  close.addEventListener('click', closeSidebar);

  const backdrop = document.createElement('div');
  backdrop.className = 'sidebar-backdrop';
  backdrop.addEventListener('click', closeSidebar);
  document.body.appendChild(backdrop);
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  const bd = document.querySelector('.sidebar-backdrop');
  if (bd) { bd.classList.remove('show'); bd.style.display = 'none'; }
}

// =============================================
// TOAST
// =============================================

function showToast(msg, isError) {
  toastMsg.textContent = msg;
  toast.classList.add('show');
  if (isError) toast.style.background = '#ef4444';
  else toast.style.background = '';
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function setSyncStatus(text) {
  document.getElementById('syncStatus').textContent = text;
}

// =============================================
// LOAD
// =============================================

async function loadAllFields() {
  setSyncStatus('Carregando...');
  config = await loadSiteConfig();
  setSyncStatus('Salvo');

  setText('cfg-site-title', config.site?.title);
  setText('cfg-site-description', config.site?.description);

  setText('cfg-hero-badge', config.hero?.badge);
  setText('cfg-hero-titlePrefix', config.hero?.titlePrefix);
  setText('cfg-hero-titleHighlight', config.hero?.titleHighlight);
  setText('cfg-hero-subtitle', config.hero?.subtitle);
  setText('cfg-hero-ctaText', config.hero?.ctaText);
  setText('cfg-hero-ctaLink', config.hero?.ctaLink);
  setText('cfg-hero-secondaryText', config.hero?.secondaryText);
  setText('cfg-hero-secondaryLink', config.hero?.secondaryLink);

  setText('cfg-features-tag', config.features?.tag);
  setText('cfg-features-subtitle', config.features?.subtitle);
  setText('cfg-features-title', config.features?.title);
  setText('cfg-features-titleHighlight', config.features?.titleHighlight);

  setText('cfg-hiw-tag', config.howItWorks?.tag);
  setText('cfg-hiw-subtitle', config.howItWorks?.subtitle);
  setText('cfg-hiw-title', config.howItWorks?.title);
  setText('cfg-hiw-titleHighlight', config.howItWorks?.titleHighlight);

  setText('cfg-download-title', config.download?.title);
  setText('cfg-download-subtitle', config.download?.subtitle);
  setText('cfg-download-btnText', config.download?.btnText);
  setText('cfg-download-btnLink', config.download?.btnLink);
  setText('cfg-download-version', config.download?.version);
  setText('cfg-download-versionLabel', config.download?.versionLabel);
  setText('cfg-download-date', config.download?.date);
  setText('cfg-download-compat', config.download?.compat);

  setText('cfg-htw-tag', config.howToInstall?.tag);
  setText('cfg-htw-subtitle', config.howToInstall?.subtitle);
  setText('cfg-htw-title', config.howToInstall?.title);
  setText('cfg-htw-titleHighlight', config.howToInstall?.titleHighlight);

  setText('cfg-faq-tag', config.faq?.tag);
  setText('cfg-faq-titleHighlight', config.faq?.titleHighlight);

  setText('cfg-test-tag', config.testimonials?.tag);
  setText('cfg-test-subtitle', config.testimonials?.subtitle);
  setText('cfg-test-title', config.testimonials?.title);
  setText('cfg-test-titleHighlight', config.testimonials?.titleHighlight);

  setText('cfg-footer-desc', config.footer?.desc);
  setText('cfg-footer-newsletterTitle', config.footer?.newsletterTitle);
  setText('cfg-footer-newsletterDesc', config.footer?.newsletterDesc);
  setText('cfg-footer-newsletterPlaceholder', config.footer?.newsletterPlaceholder);
  setText('cfg-footer-newsletterBtn', config.footer?.newsletterBtn);
  setText('cfg-footer-copyright', config.footer?.copyright);

  setText('cfg-banner-text', config.androidBanner?.text);
  setText('cfg-banner-ctaText', config.androidBanner?.ctaText);

  renderHeroBadges();
  renderMetrics();
  renderFeatures();
  renderHiwSteps();
  renderHtwSteps();
  renderFaq();
  renderTestimonials();
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

function getText(id) {
  return document.getElementById(id)?.value || '';
}

// =============================================
// SAVE
// =============================================

async function saveAll() {
  setSyncStatus('Salvando...');

  config.site = {
    title: getText('cfg-site-title'),
    description: getText('cfg-site-description')
  };

  config.hero = {
    badge: getText('cfg-hero-badge'),
    titlePrefix: getText('cfg-hero-titlePrefix'),
    titleHighlight: getText('cfg-hero-titleHighlight'),
    subtitle: getText('cfg-hero-subtitle'),
    ctaText: getText('cfg-hero-ctaText'),
    ctaLink: getText('cfg-hero-ctaLink'),
    secondaryText: getText('cfg-hero-secondaryText'),
    secondaryLink: getText('cfg-hero-secondaryLink'),
    badges: config.hero?.badges || []
  };

  config.metrics = {
    items: config.metrics?.items || []
  };

  config.features = {
    tag: getText('cfg-features-tag'),
    subtitle: getText('cfg-features-subtitle'),
    title: getText('cfg-features-title'),
    titleHighlight: getText('cfg-features-titleHighlight'),
    items: config.features?.items || []
  };

  config.howItWorks = {
    tag: getText('cfg-hiw-tag'),
    subtitle: getText('cfg-hiw-subtitle'),
    title: getText('cfg-hiw-title'),
    titleHighlight: getText('cfg-hiw-titleHighlight'),
    steps: config.howItWorks?.steps || []
  };

  config.download = {
    title: getText('cfg-download-title'),
    subtitle: getText('cfg-download-subtitle'),
    btnText: getText('cfg-download-btnText'),
    btnLink: getText('cfg-download-btnLink'),
    version: getText('cfg-download-version'),
    versionLabel: getText('cfg-download-versionLabel'),
    date: getText('cfg-download-date'),
    compat: getText('cfg-download-compat')
  };

  config.howToInstall = {
    tag: getText('cfg-htw-tag'),
    subtitle: getText('cfg-htw-subtitle'),
    title: getText('cfg-htw-title'),
    titleHighlight: getText('cfg-htw-titleHighlight'),
    steps: config.howToInstall?.steps || []
  };

  config.faq = {
    tag: getText('cfg-faq-tag'),
    titleHighlight: getText('cfg-faq-titleHighlight'),
    title: 'Perguntas',
    items: config.faq?.items || []
  };

  config.testimonials = {
    tag: getText('cfg-test-tag'),
    subtitle: getText('cfg-test-subtitle'),
    title: getText('cfg-test-title'),
    titleHighlight: getText('cfg-test-titleHighlight'),
    items: config.testimonials?.items || []
  };

  config.footer = {
    desc: getText('cfg-footer-desc'),
    newsletterTitle: getText('cfg-footer-newsletterTitle'),
    newsletterDesc: getText('cfg-footer-newsletterDesc'),
    newsletterPlaceholder: getText('cfg-footer-newsletterPlaceholder'),
    newsletterBtn: getText('cfg-footer-newsletterBtn'),
    copyright: getText('cfg-footer-copyright')
  };

  config.androidBanner = {
    text: getText('cfg-banner-text'),
    ctaText: getText('cfg-banner-ctaText')
  };

  // Verifica SUPER_ADMIN antes de salvar
  const isSuper = await DB.isSuperAdmin();
  if (!isSuper) {
    setSyncStatus('Erro');
    showToast('Apenas SUPER_ADMIN pode salvar. Faça login com ciclopago@gmail.com', true);
    return;
  }

  const ok = await saveSiteConfig(config);
  if (!ok) {
    setSyncStatus('Erro');
    showToast('Falha ao salvar no Supabase. Verifique permissão SUPER_ADMIN.', true);
    return;
  }
  setSyncStatus('Salvo');
  showToast('Alterações salvas no Supabase!');
}

async function resetConfig() {
  if (!confirm('Tem certeza? Todas as alterações serão restauradas para o padrão.')) return;
  config = await resetSiteConfig();
  loadAllFields();
  showToast('Configurações restauradas!');
}

// =============================================
// HERO BADGES
// =============================================

function renderHeroBadges() {
  const container = document.getElementById('hero-badges-list');
  container.innerHTML = '';
  if (!config.hero?.badges) return;
  config.hero.badges.forEach((b, i) => {
    container.innerHTML += `
      <div class="editable-item">
        <div class="editable-item-header">
          <span class="editable-item-title">Badge ${i + 1}</span>
          <button class="btn-remove-item" onclick="removeHeroBadge(${i})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <input type="text" class="form-input" value="${escapeHtml(b.text)}" onchange="config.hero.badges[${i}].text=this.value">
      </div>`;
  });
}

function addHeroBadge() {
  if (!config.hero) config.hero = {};
  if (!config.hero.badges) config.hero.badges = [];
  config.hero.badges.push({ text: 'Novo Badge' });
  renderHeroBadges();
}

function removeHeroBadge(i) {
  config.hero.badges.splice(i, 1);
  renderHeroBadges();
}

// =============================================
// METRICS
// =============================================

function renderMetrics() {
  const container = document.getElementById('metrics-list');
  container.innerHTML = '';
  if (!config.metrics?.items) return;
  config.metrics.items.forEach((m, i) => {
    container.innerHTML += `
      <div class="editable-item">
        <div class="editable-item-header">
          <span class="editable-item-title">Métrica ${i + 1}</span>
          <button class="btn-remove-item" onclick="removeMetric(${i})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Valor</label>
            <input type="text" class="form-input" value="${escapeHtml(m.value)}" onchange="config.metrics.items[${i}].value=this.value">
          </div>
          <div class="form-group">
            <label>Sufixo</label>
            <input type="text" class="form-input" value="${escapeHtml(m.suffix)}" onchange="config.metrics.items[${i}].suffix=this.value">
          </div>
        </div>
        <div class="form-group">
          <label>Descrição</label>
          <input type="text" class="form-input" value="${escapeHtml(m.label)}" onchange="config.metrics.items[${i}].label=this.value">
        </div>
      </div>`;
  });
}

function addMetric() {
  if (!config.metrics) config.metrics = { items: [] };
  config.metrics.items.push({ value: 0, suffix: '', label: 'Nova métrica' });
  renderMetrics();
}

function removeMetric(i) {
  config.metrics.items.splice(i, 1);
  renderMetrics();
}

// =============================================
// FEATURES
// =============================================

function renderFeatures() {
  const container = document.getElementById('features-list');
  container.innerHTML = '';
  if (!config.features?.items) return;
  config.features.items.forEach((f, i) => {
    container.innerHTML += `
      <div class="editable-item">
        <div class="editable-item-header">
          <span class="editable-item-title">Recurso ${i + 1}</span>
          <button class="btn-remove-item" onclick="removeFeature(${i})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="form-group">
          <label>Título</label>
          <input type="text" class="form-input" value="${escapeHtml(f.title)}" onchange="config.features.items[${i}].title=this.value">
        </div>
        <div class="form-group">
          <label>Descrição</label>
          <input type="text" class="form-input" value="${escapeHtml(f.desc)}" onchange="config.features.items[${i}].desc=this.value">
        </div>
      </div>`;
  });
}

function addFeature() {
  if (!config.features) config.features = { items: [] };
  config.features.items.push({ title: 'Novo Recurso', desc: 'Descrição do recurso' });
  renderFeatures();
}

function removeFeature(i) {
  config.features.items.splice(i, 1);
  renderFeatures();
}

// =============================================
// HOW IT WORKS STEPS
// =============================================

function renderHiwSteps() {
  const container = document.getElementById('hiw-steps-list');
  container.innerHTML = '';
  if (!config.howItWorks?.steps) return;
  config.howItWorks.steps.forEach((s, i) => {
    container.innerHTML += `
      <div class="editable-item">
        <div class="editable-item-header">
          <span class="editable-item-title">Passo ${s.number}</span>
          <button class="btn-remove-item" onclick="removeHiwStep(${i})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Número</label>
            <input type="text" class="form-input" value="${escapeHtml(s.number)}" onchange="config.howItWorks.steps[${i}].number=this.value">
          </div>
          <div class="form-group">
            <label>Título</label>
            <input type="text" class="form-input" value="${escapeHtml(s.title)}" onchange="config.howItWorks.steps[${i}].title=this.value">
          </div>
        </div>
        <div class="form-group">
          <label>Descrição</label>
          <input type="text" class="form-input" value="${escapeHtml(s.desc)}" onchange="config.howItWorks.steps[${i}].desc=this.value">
        </div>
      </div>`;
  });
}

function addHiwStep() {
  if (!config.howItWorks) config.howItWorks = { steps: [] };
  const n = config.howItWorks.steps.length + 1;
  config.howItWorks.steps.push({ number: String(n).padStart(2,'0'), title: 'Novo Passo', desc: 'Descrição do passo' });
  renderHiwSteps();
}

function removeHiwStep(i) {
  config.howItWorks.steps.splice(i, 1);
  renderHiwSteps();
}

// =============================================
// HOW TO INSTALL STEPS
// =============================================

function renderHtwSteps() {
  const container = document.getElementById('htw-steps-list');
  container.innerHTML = '';
  if (!config.howToInstall?.steps) return;
  config.howToInstall.steps.forEach((s, i) => {
    container.innerHTML += `
      <div class="editable-item">
        <div class="editable-item-header">
          <span class="editable-item-title">Passo ${s.number}</span>
          <button class="btn-remove-item" onclick="removeHtwStep(${i})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Número</label>
            <input type="text" class="form-input" value="${escapeHtml(s.number)}" onchange="config.howToInstall.steps[${i}].number=this.value">
          </div>
          <div class="form-group">
            <label>Título</label>
            <input type="text" class="form-input" value="${escapeHtml(s.title)}" onchange="config.howToInstall.steps[${i}].title=this.value">
          </div>
        </div>
        <div class="form-group">
          <label>Descrição (pode usar HTML: &lt;strong&gt;)</label>
          <textarea class="form-textarea" rows="2" onchange="config.howToInstall.steps[${i}].desc=this.value">${escapeHtml(s.desc)}</textarea>
        </div>
      </div>`;
  });
}

function addHtwStep() {
  if (!config.howToInstall) config.howToInstall = { steps: [] };
  const n = config.howToInstall.steps.length + 1;
  config.howToInstall.steps.push({ number: String(n), title: 'Novo Passo', desc: 'Descrição do passo' });
  renderHtwSteps();
}

function removeHtwStep(i) {
  config.howToInstall.steps.splice(i, 1);
  renderHtwSteps();
}

// =============================================
// FAQ
// =============================================

function renderFaq() {
  const container = document.getElementById('faq-list');
  container.innerHTML = '';
  if (!config.faq?.items) return;
  config.faq.items.forEach((f, i) => {
    container.innerHTML += `
      <div class="editable-item">
        <div class="editable-item-header">
          <span class="editable-item-title">Pergunta ${i + 1}</span>
          <button class="btn-remove-item" onclick="removeFaq(${i})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="form-group">
          <label>Pergunta</label>
          <input type="text" class="form-input" value="${escapeHtml(f.question)}" onchange="config.faq.items[${i}].question=this.value">
        </div>
        <div class="form-group">
          <label>Resposta</label>
          <textarea class="form-textarea" rows="3" onchange="config.faq.items[${i}].answer=this.value">${escapeHtml(f.answer)}</textarea>
        </div>
      </div>`;
  });
}

function addFaqItem() {
  if (!config.faq) config.faq = { items: [] };
  config.faq.items.push({ question: 'Nova pergunta?', answer: 'Resposta da pergunta.' });
  renderFaq();
}

function removeFaq(i) {
  config.faq.items.splice(i, 1);
  renderFaq();
}

// =============================================
// TESTIMONIALS
// =============================================

function renderTestimonials() {
  const container = document.getElementById('testimonials-list');
  container.innerHTML = '';
  if (!config.testimonials?.items) return;
  config.testimonials.items.forEach((t, i) => {
    container.innerHTML += `
      <div class="editable-item">
        <div class="editable-item-header">
          <span class="editable-item-title">Depoimento ${i + 1}</span>
          <button class="btn-remove-item" onclick="removeTestimonial(${i})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Iniciais</label>
            <input type="text" class="form-input" value="${escapeHtml(t.initials)}" onchange="config.testimonials.items[${i}].initials=this.value">
          </div>
          <div class="form-group">
            <label>Nome</label>
            <input type="text" class="form-input" value="${escapeHtml(t.name)}" onchange="config.testimonials.items[${i}].name=this.value">
          </div>
        </div>
        <div class="form-group">
          <label>Cargo/Local</label>
          <input type="text" class="form-input" value="${escapeHtml(t.role)}" onchange="config.testimonials.items[${i}].role=this.value">
        </div>
        <div class="form-group">
          <label>Texto do Depoimento</label>
          <textarea class="form-textarea" rows="2" onchange="config.testimonials.items[${i}].text=this.value">${escapeHtml(t.text)}</textarea>
        </div>
      </div>`;
  });
}

function addTestimonial() {
  if (!config.testimonials) config.testimonials = { items: [] };
  config.testimonials.items.push({ initials: 'XX', name: 'Nome', role: 'Cargo, UF', text: 'Depoimento...' });
  renderTestimonials();
}

function removeTestimonial(i) {
  config.testimonials.items.splice(i, 1);
  renderTestimonials();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
