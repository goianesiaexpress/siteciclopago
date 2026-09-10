// =============================================
// apply-config.js - Aplica configurações ao site
// =============================================

(async function() {
  const c = await loadSiteConfig();
  if (!c) return;

  // Site
  document.title = c.site.title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = c.site.description;

  // Hero badge
  const heroBadge = document.querySelector('.hero-badge-animated span:last-child');
  if (heroBadge && c.hero) heroBadge.textContent = c.hero.badge;

  // Hero title
  const typewriter = document.getElementById('typewriter');
  if (typewriter && c.hero) typewriter.textContent = c.hero.titlePrefix;
  const highlight = document.querySelector('.hero-title .gradient-text');
  if (highlight && c.hero) highlight.textContent = c.hero.titleHighlight;

  // Hero subtitle
  const heroSub = document.querySelector('.hero-subtitle');
  if (heroSub && c.hero) heroSub.textContent = c.hero.subtitle;

  // Hero buttons
  const heroBtns = document.querySelector('.hero-buttons');
  if (heroBtns && c.hero) {
    const links = heroBtns.querySelectorAll('a');
    if (links[0]) {
      links[0].href = c.hero.ctaLink;
      const svg0 = links[0].querySelector('svg');
      links[0].textContent = '';
      if (svg0) links[0].appendChild(svg0);
      links[0].appendChild(document.createTextNode(' ' + c.hero.ctaText));
    }
    if (links[1]) {
      links[1].href = c.hero.secondaryLink;
      const svg1 = links[1].querySelector('svg');
      links[1].textContent = '';
      if (svg1) links[1].appendChild(svg1);
      links[1].appendChild(document.createTextNode(' ' + c.hero.secondaryText));
    }
  }

  // Hero badges
  if (c.hero && c.hero.badges) {
    const heroBadges = document.querySelectorAll('.hero-badges .badge');
    c.hero.badges.forEach((b, i) => {
      if (heroBadges[i]) {
        const svg = heroBadges[i].querySelector('svg');
        heroBadges[i].textContent = '';
        if (svg) heroBadges[i].appendChild(svg);
        heroBadges[i].appendChild(document.createTextNode(b.text));
      }
    });
  }

  // Metrics
  if (c.metrics && c.metrics.items) {
    const metricCards = document.querySelectorAll('.metric-card');
    c.metrics.items.forEach((m, i) => {
      if (metricCards[i]) {
        const counter = metricCards[i].querySelector('.counter');
        const desc = metricCards[i].querySelector('.metric-desc');
        const title = metricCards[i].querySelector('.metric-title');
        if (counter) {
          counter.setAttribute('data-target', m.value);
          counter.textContent = '0';
          // Sufixo fica como nó de texto após o span
          if (title) {
            // Remove sufixo anterior (texto após span)
            const suffixNode = title.childNodes[1];
            if (suffixNode && suffixNode.nodeType === 3) {
              suffixNode.textContent = m.suffix || '';
            } else if (m.suffix) {
              title.appendChild(document.createTextNode(m.suffix));
            }
          }
        }
        if (desc) desc.textContent = m.label;
      }
    });
  }

  // Features section
  if (c.features) {
    const featTag = document.querySelector('#recursos .section-tag');
    if (featTag) featTag.textContent = c.features.tag;
    const featTitle = document.querySelector('#recursos .section-title');
    if (featTitle) {
      featTitle.textContent = '';
      featTitle.appendChild(document.createTextNode(c.features.title + ' '));
      const span = document.createElement('span');
      span.className = 'gradient-text';
      span.textContent = c.features.titleHighlight;
      featTitle.appendChild(span);
    }
    const featSub = document.querySelector('#recursos .section-subtitle');
    if (featSub) featSub.textContent = c.features.subtitle;

    const featureCards = document.querySelectorAll('.feature-card');
    if (c.features.items) {
      c.features.items.forEach((f, i) => {
        if (featureCards[i]) {
          const h3 = featureCards[i].querySelector('h3');
          const p = featureCards[i].querySelector('p');
          if (h3) h3.textContent = f.title;
          if (p) p.textContent = f.desc;
        }
      });
    }
  }

  // How It Works
  if (c.howItWorks) {
    const hiwTag = document.querySelector('.how-it-works .section-tag');
    if (hiwTag) hiwTag.textContent = c.howItWorks.tag;
    const hiwTitle = document.querySelector('.how-it-works .section-title');
    if (hiwTitle) {
      hiwTitle.textContent = '';
      hiwTitle.appendChild(document.createTextNode(c.howItWorks.title + ' '));
      const span = document.createElement('span');
      span.className = 'gradient-text';
      span.textContent = c.howItWorks.titleHighlight;
      hiwTitle.appendChild(span);
    }
    const hiwSub = document.querySelector('.how-it-works .section-subtitle');
    if (hiwSub) hiwSub.textContent = c.howItWorks.subtitle;

    const hiwSteps = document.querySelectorAll('.hiw-step');
    if (c.howItWorks.steps) {
      c.howItWorks.steps.forEach((s, i) => {
        if (hiwSteps[i]) {
          const num = hiwSteps[i].querySelector('.hiw-step-number');
          const h3 = hiwSteps[i].querySelector('h3');
          const p = hiwSteps[i].querySelector('p');
          if (num) num.textContent = s.number;
          if (h3) h3.textContent = s.title;
          if (p) p.textContent = s.desc;
        }
      });
    }
  }

  // Download
  if (c.download) {
    const dlTitle = document.querySelector('.download-title');
    if (dlTitle) dlTitle.textContent = c.download.title;
    const dlSub = document.querySelector('.download-subtitle');
    if (dlSub) dlSub.textContent = c.download.subtitle;

    const dlBtn = document.querySelector('.download-btn');
    if (dlBtn) {
      // Garante link válido, fallback para APK padrão
      const link = c.download.btnLink && c.download.btnLink.trim() ? c.download.btnLink : './downloads/ciclopago.apk';
      dlBtn.href = link;
      dlBtn.setAttribute('download', '');
      dlBtn.style.pointerEvents = 'auto';
      dlBtn.style.opacity = '1';
      const svg = dlBtn.querySelector('svg');
      const badge = dlBtn.querySelector('.btn-badge');
      dlBtn.textContent = '';
      if (svg) dlBtn.appendChild(svg);
      dlBtn.appendChild(document.createTextNode(' ' + (c.download.btnText || 'Baixar CicloPago.apk') + ' '));
      if (badge) {
        badge.textContent = c.download.version || 'v1.0.4';
        dlBtn.appendChild(badge);
      }
    }

    const dlInfo = document.querySelectorAll('.download-info span:not(.dot-separator)');
    if (dlInfo[0]) dlInfo[0].textContent = c.download.versionLabel;
    if (dlInfo[1]) dlInfo[1].textContent = c.download.date;
    if (dlInfo[2]) dlInfo[2].textContent = c.download.compat;
  }

  // How to Install
  if (c.howToInstall) {
    const htwTag = document.querySelector('#como-instalar .section-tag');
    if (htwTag) htwTag.textContent = c.howToInstall.tag;
    const htwTitle = document.querySelector('#como-instalar .section-title');
    if (htwTitle) {
      htwTitle.textContent = '';
      htwTitle.appendChild(document.createTextNode(c.howToInstall.title + ' '));
      const span = document.createElement('span');
      span.className = 'gradient-text';
      span.textContent = c.howToInstall.titleHighlight;
      htwTitle.appendChild(span);
    }
    const htwSub = document.querySelector('#como-instalar .section-subtitle');
    if (htwSub) htwSub.textContent = c.howToInstall.subtitle;

    const htwSteps = document.querySelectorAll('.howto-step');
    if (c.howToInstall.steps) {
      c.howToInstall.steps.forEach((s, i) => {
        if (htwSteps[i]) {
          const num = htwSteps[i].querySelector('.step-number');
          const h3 = htwSteps[i].querySelector('h3');
          const p = htwSteps[i].querySelector('p');
          if (num) num.textContent = s.number;
          if (h3) h3.textContent = s.title;
          if (p) p.innerHTML = s.desc;
        }
      });
    }
  }

  // FAQ
  if (c.faq) {
    const faqTag = document.querySelector('#faq .section-tag');
    if (faqTag) faqTag.textContent = c.faq.tag;
    const faqTitle = document.querySelector('#faq .section-title');
    if (faqTitle) {
      faqTitle.textContent = '';
      faqTitle.appendChild(document.createTextNode(c.faq.title + ' '));
      const span = document.createElement('span');
      span.className = 'gradient-text';
      span.textContent = c.faq.titleHighlight;
      faqTitle.appendChild(span);
    }

    const faqItems = document.querySelectorAll('.faq-item');
    if (c.faq.items) {
      c.faq.items.forEach((f, i) => {
        if (faqItems[i]) {
          const q = faqItems[i].querySelector('.faq-question span');
          const a = faqItems[i].querySelector('.faq-answer p');
          if (q) q.textContent = f.question;
          if (a) a.textContent = f.answer;
        }
      });
    }
  }

  // Testimonials
  if (c.testimonials) {
    const testTag = document.querySelector('.testimonials .section-tag');
    if (testTag) testTag.textContent = c.testimonials.tag;
    const testTitle = document.querySelector('.testimonials .section-title');
    if (testTitle) {
      testTitle.textContent = '';
      testTitle.appendChild(document.createTextNode(c.testimonials.title + ' '));
      const span = document.createElement('span');
      span.className = 'gradient-text';
      span.textContent = c.testimonials.titleHighlight;
      testTitle.appendChild(span);
    }
    const testSub = document.querySelector('.testimonials .section-subtitle');
    if (testSub) testSub.textContent = c.testimonials.subtitle;

    const testCards = document.querySelectorAll('.testimonial-card');
    if (c.testimonials.items) {
      c.testimonials.items.forEach((t, i) => {
        if (testCards[i]) {
          const text = testCards[i].querySelector('.testimonial-text');
          const name = testCards[i].querySelector('.testimonial-author h4');
          const role = testCards[i].querySelector('.testimonial-author span');
          const avatar = testCards[i].querySelector('.testimonial-avatar');
          if (text) text.textContent = t.text;
          if (name) name.textContent = t.name;
          if (role) role.textContent = t.role;
          if (avatar) avatar.textContent = t.initials;
        }
      });
    }
  }

  // Footer
  if (c.footer) {
    const footDesc = document.querySelector('.footer-desc');
    if (footDesc) footDesc.textContent = c.footer.desc;
    const footCopyright = document.querySelector('.footer-bottom p');
    if (footCopyright) footCopyright.textContent = c.footer.copyright;

    const nlTitle = document.querySelector('.footer-newsletter h4');
    if (nlTitle) nlTitle.textContent = c.footer.newsletterTitle;
    const nlDesc = document.querySelector('.footer-newsletter > p');
    if (nlDesc) nlDesc.textContent = c.footer.newsletterDesc;
    const nlInput = document.querySelector('.newsletter-input');
    if (nlInput) nlInput.placeholder = c.footer.newsletterPlaceholder;
    const nlBtn = document.querySelector('.newsletter-btn');
    if (nlBtn) nlBtn.textContent = c.footer.newsletterBtn;
  }

  // Android Banner
  if (c.androidBanner) {
    const bannerSpan = document.querySelector('#androidBanner span');
    if (bannerSpan) bannerSpan.textContent = c.androidBanner.text;
    const bannerBtn = document.querySelector('#bannerDownloadBtn') || document.querySelector('#androidBanner .btn');
    if (bannerBtn) {
      bannerBtn.textContent = c.androidBanner.ctaText;
      // Baixar Agora deve baixar direto o APK, não só scroll
      const dlLink = (c.download && c.download.btnLink) ? c.download.btnLink : './downloads/ciclopago.apk';
      bannerBtn.href = dlLink;
      bannerBtn.setAttribute('download', '');
    }
  } else if (c.download) {
    // Mesmo sem banner config, garante que o botão do banner baixa o APK
    const bannerBtn = document.querySelector('#bannerDownloadBtn');
    if (bannerBtn) {
      const dlLink = c.download.btnLink || './downloads/ciclopago.apk';
      bannerBtn.href = dlLink;
      bannerBtn.setAttribute('download', '');
    }
  }
})();
