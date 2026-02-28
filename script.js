/* ============================================================
   VoiceFlow AI — Landing Page Interactions
   • Waveform Canvas animation
   • Intersection Observer for scroll reveals
   • Counter animations
   • Smooth scroll + sticky nav
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initWaveCanvas();
    initScrollReveal();
    initCounters();
});

/* =====================
   NAVBAR
   ===================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('navBurger');
    const links = document.getElementById('navLinks');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Mobile menu
    if (burger && links) {
        burger.addEventListener('click', () => {
            links.classList.toggle('open');
            const spans = burger.querySelectorAll('span');
            burger.classList.toggle('active');
        });

        // Close on link click
        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => links.classList.remove('open'));
        });
    }
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu
        const links = document.getElementById('navLinks');
        if (links) links.classList.remove('open');
    }
}

/* =====================
   WAVEFORM CANVAS
   ===================== */
function initWaveCanvas() {
    const canvas = document.getElementById('waveCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Wave parameters
    const waves = [
        { freq: 0.012, amp: 45, speed: 0.025, color: 'rgba(139, 92, 246, 0.5)', width: 2.5 },
        { freq: 0.018, amp: 35, speed: 0.032, color: 'rgba(6, 214, 160, 0.4)', width: 2 },
        { freq: 0.025, amp: 25, speed: 0.018, color: 'rgba(236, 72, 153, 0.3)', width: 1.5 },
        { freq: 0.008, amp: 55, speed: 0.015, color: 'rgba(59, 130, 246, 0.25)', width: 2 },
        { freq: 0.030, amp: 18, speed: 0.040, color: 'rgba(139, 92, 246, 0.2)', width: 1 },
    ];

    // Floating particles
    const particles = Array.from({ length: 40 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() > 0.5 ? 260 : 160, // violet or cyan
    }));

    function draw() {
        const w = canvas.getBoundingClientRect().width;
        const h = canvas.getBoundingClientRect().height;
        const cx = w / 2;
        const cy = h / 2;

        ctx.clearRect(0, 0, w, h);

        // Background radial glow
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.45);
        glow.addColorStop(0, 'rgba(139, 92, 246, 0.06)');
        glow.addColorStop(0.5, 'rgba(6, 214, 160, 0.03)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        // Draw particles
        particles.forEach(p => {
            p.y -= p.speed * 0.003;
            if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }

            const px = p.x * w;
            const py = p.y * h;
            const wobble = Math.sin(time * 2 + p.x * 10) * 3;

            ctx.beginPath();
            ctx.arc(px + wobble, py, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity})`;
            ctx.fill();
        });

        // Draw waves
        waves.forEach(wave => {
            ctx.beginPath();
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = wave.width;
            ctx.lineCap = 'round';

            for (let x = 0; x <= w; x += 2) {
                const y = cy
                    + Math.sin(x * wave.freq + time * wave.speed * 60) * wave.amp
                    + Math.sin(x * wave.freq * 0.5 + time * wave.speed * 30) * wave.amp * 0.4;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });

        // Center bright dot
        const pulseR = 4 + Math.sin(time * 3) * 2;
        const dotGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseR * 8);
        dotGlow.addColorStop(0, 'rgba(139, 92, 246, 0.6)');
        dotGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = dotGlow;
        ctx.fillRect(cx - pulseR * 8, cy - pulseR * 8, pulseR * 16, pulseR * 16);

        ctx.beginPath();
        ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = '#8b5cf6';
        ctx.fill();

        time += 0.016;
        animationId = requestAnimationFrame(draw);
    }

    draw();
}

/* =====================
   SCROLL REVEAL
   ===================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');

    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve — keep it for re-entry if needed
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* =====================
   COUNTER ANIMATIONS
   ===================== */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    // Check existing text for prefix/suffix hints
    const existingText = el.textContent;
    const hasPercent = existingText.includes('%');

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        if (hasPercent) {
            el.textContent = current + '%';
        } else if (suffix) {
            el.textContent = current + suffix;
        } else {
            el.textContent = current;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* Expose scrollToSection globally */
window.scrollToSection = scrollToSection;

/* =====================
   WAITLIST FORM
   ===================== */
function handleWaitlist(e) {
    e.preventDefault();
    const email = document.getElementById('waitlistEmail').value;
    const form = document.getElementById('waitlistForm');
    const success = document.getElementById('waitlistSuccess');
    const btn = document.getElementById('waitlistBtn');

    // Disable button
    btn.disabled = true;
    btn.textContent = 'Joining...';

    // Simulate a short delay for UX (no real backend yet)
    setTimeout(() => {
        // Hide form, show success
        form.style.display = 'none';
        success.style.display = 'block';

        // Also open mailto as a backup to actually capture the email
        window.location.href = `mailto:founder@voiceflowai.space?subject=VoiceFlow AI Waitlist&body=Hi! I'd like to join the VoiceFlow AI waitlist.%0A%0AMy email: ${encodeURIComponent(email)}`;
    }, 800);
}

window.handleWaitlist = handleWaitlist;
