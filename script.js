/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║  PORTFÓLIO — André Alves · Sigma Orbitek | script.js            ║
  ╚══════════════════════════════════════════════════════════════════╝
*/

/* 1. STAR CANVAS */
function initStarCanvas() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const stars = [];
    for (let i = 0; i < 180; i++) {
        stars.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.3, opacity: Math.random() * 0.7 + 0.3,
            speed: Math.random() * 0.3 + 0.1, phase: Math.random() * Math.PI * 2
        });
    }
    function animate(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => {
            const op = s.opacity * (0.5 + 0.5 * Math.sin(time * 0.001 * s.speed + s.phase));
            ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245,166,35,${op})`; ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

/* 2. NAVBAR */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));
}

function initMobileMenu() {
    const toggle = document.getElementById('menuCelu');
    const nav = document.getElementById('menLinks');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.querySelectorAll('.men-link').forEach(l => l.addEventListener('click', () => {
        nav.classList.remove('open'); toggle.classList.remove('open');
    }));
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !nav.contains(e.target)) {
            nav.classList.remove('open'); toggle.classList.remove('open');
        }
    });
}

function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.men-link');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                const a = document.querySelector(`.men-link[href="#${entry.target.id}"]`);
                if (a) a.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    sections.forEach(s => obs.observe(s));
}

/* 3. VOLTAR AO TOPO */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
}

/* 4. ANIMAÇÕES */
function initScrollAnimations() {
    const els = document.querySelectorAll(
        '.about-card,.skill-card,.project-card,.certificate-card,.contact-info,.contact-form-wrapper,.section-header'
    );
    els.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(30px)'; el.style.transition = 'opacity 0.6s ease,transform 0.6s ease'; });
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    document.querySelectorAll('.skills-grid,.projects-grid,.certificates-grid,.about-cards').forEach(grid => {
        Array.from(grid.children).forEach((c, i) => c.style.transitionDelay = `${i * 0.08}s`);
    });
}

/* ================================================================
   5. FORMULÁRIO COM EMAILJS
   
   AULA: Como funciona?
   emailjs.send() recebe 3 argumentos:
     1. serviceId   → qual conta de email usar (seu Gmail)
     2. templateId  → qual template usar (o que você criou)
     3. params      → objeto com os dados que preenchem o template
   
   Os nomes dos params precisam ser IDÊNTICOS às variáveis
   do template. Ex: template tem {{from_name}} → params.from_name
================================================================ */
const EMAILJS = {
    publicKey: '4_0cnrPKUDfEuFcVK',
    serviceId: 'service_j1thuml',
    templateId: 'template_ewlph4s',
};

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Inicializa o EmailJS com sua Public Key
    emailjs.init(EMAILJS.publicKey);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');

        // Lê os valores do formulário
        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const subject = form.querySelector('[name="subject"]')?.value.trim() || 'Contato via portfólio';
        const message = form.querySelector('[name="message"]').value.trim();

        // Validação
        if (!name || !email || !message) {
            feedback(btn, 'error', '<i class="ri-error-warning-line"></i> Preencha todos os campos');
            return;
        }

        // Loading
        btn.disabled = true;
        btn.innerHTML = '<i class="ri-loader-4-line"></i> Enviando...';

        try {
            // Envia via EmailJS
            // Os nomes aqui devem ser iguais às variáveis {{}} no template
            await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
            });

            feedback(btn, 'success', '<i class="ri-check-line"></i> Mensagem enviada!');
            form.reset();

        } catch (err) {
            console.error('EmailJS error:', err);
            feedback(btn, 'error', '<i class="ri-error-warning-line"></i> Erro ao enviar. Tente novamente.');
        }
    });
}

function feedback(btn, type, html) {
    btn.innerHTML = html;
    btn.style.background = type === 'success'
        ? 'linear-gradient(135deg, #10b981, #059669)'
        : 'linear-gradient(135deg, #ef4444, #dc2626)';
    btn.disabled = type === 'success';
    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="ri-send-plane-line"></i> Enviar Mensagem';
        btn.style.background = '';
    }, 4000);
}

/* 6. INIT */
document.addEventListener('DOMContentLoaded', () => {
    initStarCanvas();
    initNavbarScroll();
    initMobileMenu();
    initActiveNavLink();
    initBackToTop();
    initScrollAnimations();
    initContactForm();
    console.log('%c Σ Sigma Orbitek — Portfolio loaded ✓ ', 'background:#F5A623;color:#050810;font-weight:bold;padding:4px 8px;border-radius:4px;');
});