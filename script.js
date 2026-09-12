/* ========================================
   CICLOPAGO LANDING PAGE - SCRIPTS
   Premium Effects v5.0 - Mobile Optimized
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ======= LOADING SCREEN =======
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      document.body.style.overflow = 'auto';
      initAnimations();
    }, 1800);
  } else {
    initAnimations();
  }

  function initAnimations() {
    // ======= TYPEWRITER EFFECT =======
    const typewriter = document.getElementById('typewriter');
    if (typewriter) {
      setTimeout(() => {
        typewriter.classList.add('typing');
      }, 500);
    }

    // ======= HERO PARALLAX ON SCROLL =======
    const heroParallax = document.getElementById('heroParallax');
    if (heroParallax && window.innerWidth > 768) {
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        heroParallax.style.transform = `translateY(${scrolled * 0.3}px)`;
      });
    }
  }

  // ======= SCROLL FADE-IN ANIMATIONS =======
  const fadeElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeElements.forEach(el => observer.observe(el));

  // ======= HEADER SCROLL EFFECT =======
  const header = document.getElementById('header');
  let lastScrollY = 0;
  let scrollTicking = false;

  // ======= SCROLL PROGRESS INDICATOR =======
  const scrollProgress = document.getElementById('scrollProgress');

  // ======= BACK TO TOP BUTTON =======
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        // Header scroll
        if (header) {
          header.classList.toggle('scrolled', currentScrollY > 50);
          if (window.innerWidth <= 768) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              header.style.transform = 'translateY(-100%)';
            } else {
              header.style.transform = 'translateY(0)';
            }
          }
        }
        lastScrollY = currentScrollY;

        // Scroll progress
        if (scrollProgress && scrollHeight > 0) {
          scrollProgress.style.width = ((scrollTop / scrollHeight) * 100) + '%';
        }

        // Back to top
        if (backToTop) {
          backToTop.classList.toggle('visible', window.scrollY > 500);
        }

        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ======= MOBILE MENU TOGGLE =======
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isActive = navLinks.classList.contains('active');
      navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', !isActive);
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'auto' : 'hidden';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // ======= FAQ ACCORDION =======
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all items with smooth animation
      faqItems.forEach(i => {
        if (i !== item) {
          i.classList.remove('active');
          i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        
        // Scroll into view on mobile
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      }
    });
  });

  // ======= ANDROID DEVICE DETECTION =======
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isAndroid = /android/i.test(ua);
  const androidBanner = document.getElementById('androidBanner');
  const closeBanner = document.getElementById('closeBanner');

  if (isAndroid && androidBanner) {
    androidBanner.style.display = 'block';
    document.body.style.paddingBottom = '70px';
    window.addEventListener('resize', function cleanupPadding() {
      if (window.innerWidth > 768 || !isAndroid) {
        document.body.style.paddingBottom = '0';
        window.removeEventListener('resize', cleanupPadding);
      }
    });
  }

  if (closeBanner) {
    closeBanner.addEventListener('click', () => {
      androidBanner.style.display = 'none';
      document.body.style.paddingBottom = '0';
    });
  }

  // ======= 3D PHONE TILT ON MOUSE MOVE (Desktop) =======
  const phone3d = document.getElementById('phone3d');
  if (phone3d && window.innerWidth > 768) {
    const heroSection = document.querySelector('.hero');
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 15;
      targetY = -y * 10;
    });

    heroSection.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    function animatePhone() {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      const distance = Math.abs(targetX - currentX) + Math.abs(targetY - currentY);
      if (distance > 0.01) {
        phone3d.style.animationPlayState = 'paused';
        phone3d.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg) translateY(0)`;
      } else if (targetX === 0 && targetY === 0) {
        phone3d.style.animationPlayState = 'running';
        phone3d.style.transform = '';
      }

      requestAnimationFrame(animatePhone);
    }
    requestAnimationFrame(animatePhone);
  }

  // ======= PARTICLES SYSTEM (Desktop only for performance) =======
  const canvas = document.getElementById('particlesCanvas');
  if (canvas && window.innerWidth > 768) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;
        this.opacity = 0.1 + Math.sin(this.pulse) * 0.2;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 208, 88, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 20000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(52, 208, 88, ${0.08 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connectParticles();
      animationId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // Pause when not visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationId) animateParticles();
        } else {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      });
    });
    heroObserver.observe(document.querySelector('.hero'));
  }

  // ======= COUNTER ANIMATION =======
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };

        updateCounter();
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ======= RIPPLE EFFECT ON BUTTONS (Touch optimized) =======
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ======= ENHANCED MAGNETIC BUTTON EFFECT (Desktop) =======
  if (window.innerWidth > 768) {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.02)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  }

  // ======= 3D TILT ON CARDS (Desktop) =======
  if (window.innerWidth > 768) {
    document.querySelectorAll('.feature-card, .metric-card, .testimonial-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
      });
    });
  }

  // ======= SCROLL PROGRESS INDICATOR =======
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      scrollProgress.style.width = progress + '%';
    });
  }

  // ======= BACK TO TOP BUTTON =======
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ======= SMOOTH SCROLL FOR ANCHOR LINKS =======
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      let target = null;
      try { target = document.querySelector(href); } catch (err) { return; }
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ======= CURSOR GLOW EFFECT (Desktop) =======
  if (window.innerWidth > 768) {
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }

  // ======= HOW IT WORKS STEPS ANIMATION =======
  const hiwSteps = document.querySelectorAll('.hiw-step');
  const hiwObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 200);
      }
    });
  }, { threshold: 0.3 });

  hiwSteps.forEach(step => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(30px)';
    step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    hiwObserver.observe(step);
  });

  // ======= NEWSLETTER FORM INTERACTION =======
  const newsletterInput = document.querySelector('.newsletter-input');
  const newsletterBtn = document.querySelector('.newsletter-btn');

  if (newsletterBtn && newsletterInput) {
    newsletterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (newsletterInput.value.includes('@')) {
        newsletterBtn.textContent = 'Em breve!';
        newsletterBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        newsletterInput.value = '';
        setTimeout(() => {
          newsletterBtn.textContent = 'Inscrever';
          newsletterBtn.style.background = '';
        }, 3000);
      } else {
        newsletterInput.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        setTimeout(() => {
          newsletterInput.style.borderColor = '';
        }, 1500);
      }
    });
  }

  // ======= TOUCH HINT FOR MOBILE =======
  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
  }

  // ======= RESIZE HANDLER =======
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recalculate if needed
      window.dispatchEvent(new Event('optimizedResize'));
    }, 250);
  });

});
