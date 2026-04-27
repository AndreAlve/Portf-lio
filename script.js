/*
  ╔══════════════════════════════════════════════════════════════════╗
  ║  PORTFÓLIO — André Alves · Sigma Orbitek                        ║
  ║  script.js                                                       ║
  ╠══════════════════════════════════════════════════════════════════╣
  ║  AULA: Organização do JavaScript                                 ║
  ║  Dividimos em funções com responsabilidade única.               ║
  ║  Cada função faz UMA coisa só — isso é código limpo.            ║
  ╚══════════════════════════════════════════════════════════════════╝

  ÍNDICE:
  1. Star Canvas (animação de estrelas no hero)
  2. Navbar (scroll, mobile, links ativos)
  3. Botão voltar ao topo
  4. Animações de entrada (Intersection Observer)
  5. Formulário de contato
  6. Inicialização
*/


/* ================================================================
   1. STAR CANVAS — Fundo de estrelas animado
   
   AULA: O que é um Canvas?
   É um elemento HTML onde você pode desenhar usando JavaScript.
   Pensa como uma folha em branco onde o JS é o pincel.
================================================================ */
function initStarCanvas() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');  // "contexto 2D" = modo de desenho

    // Deixa o canvas do tamanho exato da janela
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Cria um array de estrelas com posições e velocidades aleatórias
    const stars = [];
    const STAR_COUNT = 180;

    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,      // posição horizontal aleatória
            y: Math.random() * canvas.height,     // posição vertical aleatória
            radius: Math.random() * 1.5 + 0.3,         // tamanho entre 0.3 e 1.8
            opacity: Math.random() * 0.7 + 0.3,         // transparência entre 0.3 e 1
            speed: Math.random() * 0.3 + 0.1,         // velocidade de piscar
            phase: Math.random() * Math.PI * 2,       // fase inicial do piscar
        });
    }

    // Função que desenha um frame — chamada 60x por segundo
    function animate(time) {
        // Limpa o canvas a cada frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Desenha cada estrela
        stars.forEach(star => {
            // Oscila a opacidade usando Math.sin (cria o efeito de piscar)
            const opacity = star.opacity * (0.5 + 0.5 * Math.sin(time * 0.001 * star.speed + star.phase));

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(245, 166, 35, ${opacity})`;
            ctx.fill();
        });

        // Pede o próximo frame
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}


/* ================================================================
   2. NAVBAR
================================================================ */

// 2a. Efeito de scroll: adiciona sombra quando o usuário rola
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// 2b. Menu mobile: abre/fecha ao clicar no hamburguer
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menlinks = document.getElementById('menlinks');
    if (!toggle || !menlinks) return;

    toggle.addEventListener('click', () => {
        const isOpen = menlinks.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    // Fecha o menu ao clicar em qualquer link
    menlinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menlinks.classList.remove('open');
            toggle.classList.remove('open');
        });
    });

    // Fecha ao clicar fora do menu
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menlinks.contains(e.target)) {
            menlinks.classList.remove('open');
            toggle.classList.remove('open');
        }
    });
}

// 2c. Link ativo: destaca o link da seção visível na tela
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const menlinks = document.querySelectorAll('.nav-link');

    // Intersection Observer: detecta qual seção está visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove "active" de todos os links
                navLinks.forEach(link => link.classList.remove('active'));

                // Adiciona "active" no link que corresponde à seção visível
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, {
        rootMargin: '-40% 0px -40% 0px', // Considera visível quando está no centro da tela
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
}


/* ================================================================
   3. BOTÃO VOLTAR AO TOPO
================================================================ */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
}


/* ================================================================
   4. ANIMAÇÕES DE ENTRADA
   
   AULA: O que é Intersection Observer?
   É uma API moderna do JavaScript que te diz quando um elemento
   aparece (ou sai) na área visível do navegador (viewport).
   
   Usamos isso para animar os elementos quando o usuário
   chega neles fazendo scroll — em vez de animar tudo de uma vez.
================================================================ */
function initScrollAnimations() {
    // Adiciona classe "animate" em todos os elementos que queremos animar
    const animatableSelectors = [
        '.about-card',
        '.skill-card',
        '.project-card',
        '.certificate-card',
        '.contact-info',
        '.contact-form-wrapper',
        '.section-header',
    ];

    const elements = document.querySelectorAll(animatableSelectors.join(', '));

    // CSS base para o estado inicial (invisível, levemente abaixo)
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Observer que anima quando o elemento fica visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Para de observar após animar
            }
        });
    }, {
        rootMargin: '0px 0px -60px 0px', // Anima um pouco antes de entrar totalmente
        threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));

    // Animação em cascata (stagger) para cards em grid
    document.querySelectorAll('.skills-grid, .projects-grid, .certificates-grid, .about-cards').forEach(grid => {
        const cards = grid.children;
        Array.from(cards).forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.08}s`;
        });
    });
}


/* ================================================================
   5. FORMULÁRIO DE CONTATO
   
   AULA: Por enquanto, vamos apenas mostrar um feedback visual.
   Na aula de integração com backend, conectaremos a um
   serviço real (EmailJS, Formspree, ou API própria).
================================================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();  // Impede o comportamento padrão (recarregar página)

        const btn = form.querySelector('button[type="submit"]');

        // Estado de carregamento
        btn.disabled = true;
        btn.innerHTML = '<i class="ri-loader-4-line"></i> Enviando...';

        // Simulação de envio (2 segundos)
        // TODO: Substituir por integração real na Aula de Backend
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Sucesso
        btn.innerHTML = '<i class="ri-check-line"></i> Mensagem enviada!';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        form.reset();

        // Volta ao estado normal após 4 segundos
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="ri-send-plane-line"></i> Enviar mensagem';
            btn.style.background = '';
        }, 4000);
    });
}


/* ================================================================
   6. INICIALIZAÇÃO
   
   AULA: Por que esperar o 'DOMContentLoaded'?
   O JavaScript pode rodar antes de o HTML terminar de carregar.
   Esse evento garante que TODO o HTML foi lido antes de
   o JS começar a procurar por elementos.
   
   Analogia: você não arruma uma casa que ainda está sendo
   construída. Espera terminar, depois arruma.
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initStarCanvas();
    initNavbarScroll();
    initMobileMenu();
    initActiveNavLink();
    initBackToTop();
    initScrollAnimations();
    initContactForm();

    // Log de confirmação (só aparece no console do navegador — F12)
    console.log('%c Σ Sigma Orbitek — Portfolio loaded ', 'background: #00D4FF; color: #050810; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
});