/* =========================================
   ACADEMIA PERFORMANCE — script.js
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. LOADER ──────────────────────────────────────────────────────────────
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            // Aciona animações iniciais
            animateOnScroll();
            animateCounters();
        }, 1500);
        document.body.style.overflow = 'hidden';
    }


    // ─── 2. CUSTOM CURSOR ────────────────────────────────────────────────────────
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top  = mouseY + 'px';
        });

        // Follower com lag suave
        function followCursor() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            follower.style.left = followerX + 'px';
            follower.style.top  = followerY + 'px';
            requestAnimationFrame(followCursor);
        }
        followCursor();

        // Aumenta cursor em elementos interativos
        const interactivos = document.querySelectorAll('a, button, .beneficio-card, .card, .aval-card');
        interactivos.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.style.transform = 'translate(-50%, -50%) scale(2.2)';
                follower.style.borderColor = 'rgba(255, 90, 31, 0.8)';
                cursor.style.opacity = '0';
            });
            el.addEventListener('mouseleave', () => {
                follower.style.transform = 'translate(-50%, -50%) scale(1)';
                follower.style.borderColor = 'rgba(255, 90, 31, 0.5)';
                cursor.style.opacity = '1';
            });
        });
    }


    // ─── 3. HEADER SCROLL ────────────────────────────────────────────────────────
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });


    // ─── 4. MENU MOBILE ──────────────────────────────────────────────────────────
    const menuToggle  = document.getElementById('menu-toggle');
    const mobileMenu  = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        const isOpen = mobileMenu.classList.toggle('open');
        menuToggle.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    }

    menuToggle?.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuToggle.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
    });

    // Fechar menu ao clicar fora
    mobileMenu?.addEventListener('click', (e) => {
        if (e.target === mobileMenu) toggleMenu();
    });


    // ─── 5. SMOOTH SCROLL ────────────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    // ─── 6. REVEAL ON SCROLL ────────────────────────────────────────────────────
    function animateOnScroll() {
        const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        elements.forEach(el => observer.observe(el));
    }


    // ─── 7. CONTADORES ANIMADOS ──────────────────────────────────────────────────
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const observerCounter = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el     = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    const duration = 1800;
                    const start = performance.now();

                    function update(now) {
                        const elapsed  = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Easing out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(eased * target);
                        if (progress < 1) requestAnimationFrame(update);
                        else el.textContent = target;
                    }
                    requestAnimationFrame(update);
                    observerCounter.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observerCounter.observe(c));
    }


    // ─── 8. WHATSAPP — BOTÕES COMPRAR ────────────────────────────────────────────
    const NUMERO_WHATSAPP = "5564992203213"; // 🔴 SUBSTITUA AQUI pelo número real

    document.querySelectorAll('.btn-buy').forEach(botao => {
        botao.addEventListener('click', function () {
            const plano    = this.getAttribute('data-plano');
            const msg      = `Olá! Vim pelo site da Academia Performance e gostaria de saber mais sobre o *${plano}*. Como faço para me matricular?`;
            const encoded  = encodeURIComponent(msg);
            const url      = `https://wa.me/${NUMERO_WHATSAPP}?text=${encoded}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        });
    });


    // ─── 9. HORÁRIO DE FUNCIONAMENTO ─────────────────────────────────────────────
    function verificarHorario() {
        const agora     = new Date();
        const dia       = agora.getDay();   // 0 Dom … 6 Sáb
        const hora      = agora.getHours();
        const minutos   = agora.getMinutes();
        const totalMin  = hora * 60 + minutos;

        let aberta = false;

        // Seg–Sex: 05:00–22:00  →  300–1320 min
        if (dia >= 1 && dia <= 5 && totalMin >= 300 && totalMin < 1320) aberta = true;
        // Sáb: 08:00–12:00  →  480–720 min
        if (dia === 6 && totalMin >= 480 && totalMin < 720) aberta = true;

        const badge = document.getElementById('status-academia');
        if (!badge) return;

        if (aberta) {
            badge.innerHTML = '<i class="fas fa-door-open"></i> ABERTA AGORA';
            badge.style.color       = '#25D366';
            badge.style.borderColor = '#25D366';
        } else {
            badge.innerHTML = '<i class="fas fa-door-closed"></i> FECHADA AGORA';
            badge.style.color       = '#ff4d4d';
            badge.style.borderColor = '#ff4d4d';
        }
        badge.style.border = `1px solid`;
    }

    verificarHorario();
    setInterval(verificarHorario, 60_000);


    // ─── 10. ACTIVE NAV LINK POR SCROLL ──────────────────────────────────────────
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const id     = entry.target.getAttribute('id');
                const active = document.querySelector(`.nav-link[href="#${id}"]`);
                active?.classList.add('active');
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));


    // ─── 11. PARALLAX SUTIL NO HERO ──────────────────────────────────────────────
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        if (!heroContent) return;
        const scrollY = window.pageYOffset;
        heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
        heroContent.style.opacity   = 1 - (scrollY / 600);
    }, { passive: true });

});