/* ================================================================
   PORTFÓLIO — André Alves · Sigma Orbitek | script.js
   BUGS CORRIGIDOS:
   - Bug 9:  id "navToggle" → "menuCelu" (igual ao HTML)
   - Bug 10: '.nav-link' → '.men-link' (igual ao HTML/CSS)
   - Bug 11: variável "navLinks" → "menLinks" (ReferenceError corrigido)
================================================================ */

/* 1. STAR CANVAS */
function initStarCanvas() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const stars = [];
  for (let i = 0; i < 180; i++) {
    stars.push({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      radius:  Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.7 + 0.3,
      speed:   Math.random() * 0.3 + 0.1,
      phase:   Math.random() * Math.PI * 2,
    });
  }

  function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      const opacity = star.opacity * (0.5 + 0.5 * Math.sin(time * 0.001 * star.speed + star.phase));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 166, 35, ${opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

/* 2a. NAVBAR SCROLL */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

/* 2b. MENU MOBILE — Bug 9 e 10 corrigidos */
function initMobileMenu() {
  const toggle   = document.getElementById('menuCelu');   // ✅ corrigido
  const navLinks = document.getElementById('menLinks');   // ✅ corrigido
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  // ✅ Bug 10 corrigido: '.men-link' em vez de '.nav-link'
  navLinks.querySelectorAll('.men-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
    }
  });
}

/* 2c. LINK ATIVO — Bug 11 corrigido */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const menLinks  = document.querySelectorAll('.men-link');  // ✅ corrigido

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        menLinks.forEach(link => link.classList.remove('active'));  // ✅ corrigido
        const activeLink = document.querySelector(`.men-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/* 3. BOTÃO VOLTAR AO TOPO */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
}

/* 4. ANIMAÇÕES DE ENTRADA */
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.about-card, .skill-card, .project-card, .certificate-card, .contact-info, .contact-form-wrapper, .section-header'
  );

  elements.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  elements.forEach(el => observer.observe(el));

  document.querySelectorAll('.skills-grid, .projects-grid, .certificates-grid, .about-cards').forEach(grid => {
    Array.from(grid.children).forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.08}s`;
    });
  });
}

/* 5. FORMULÁRIO */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="ri-loader-4-line"></i> Enviando...';

    await new Promise(resolve => setTimeout(resolve, 2000));

    btn.innerHTML = '<i class="ri-check-line"></i> Mensagem enviada!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    form.reset();

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="ri-send-plane-line"></i> Enviar Mensagem';
      btn.style.background = '';
    }, 4000);
  });
}

/* 6. INICIALIZAÇÃO */
document.addEventListener('DOMContentLoaded', () => {
  initStarCanvas();
  initNavbarScroll();
  initMobileMenu();
  initActiveNavLink();
  initBackToTop();
  initScrollAnimations();
  initContactForm();

  console.log('%c Σ Sigma Orbitek — Portfolio loaded ✓ ', 'background: #F5A623; color: #050810; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
});