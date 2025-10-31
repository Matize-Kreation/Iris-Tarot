// Iris Tarot – Subtiler Partikel-Layer (helle & dunkle Punkte)
// - Retina-scharf via devicePixelRatio
// - sehr langsame Bewegung + sanftes Twinkle
// - respektiert prefers-reduced-motion
// - regeneriert Offscreen-Partikel

(() => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let width = 0, height = 0, running = true;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dichte: ca. 1 Partikel pro 16.000 px² (dezent), Grenzen:
    const density = 1 / 16000;
    const minCount = 60, maxCount = 180;

    let particles = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        adjustCount();
    }

    function rand(a, b) { return a + Math.random() * (b - a); }
    function choice(arr) { return arr[(Math.random() * arr.length) | 0]; }

    function makeParticle(origin = null) {
        // Sehr kleine Partikel, Mischfarben: Weiß / Schwarz in verschiedenen Alphas
        const white = Math.random() < 0.5;
        const baseAlpha = white ? rand(0.25, 0.65) : rand(0.18, 0.45);
        const r = rand(0.35, 1.15); // Radius in px (vor DPR)
        const speed = prefersReduced ? rand(0.01, 0.03) : rand(0.015, 0.06); // sehr langsam

        const p = {
            x: origin ? origin.x : rand(0, width),
            y: origin ? origin.y : rand(0, height),
            vx: rand(-speed, speed),
            vy: rand(-speed, speed),
            r,
            white,
            alpha: baseAlpha,
            twinklePhase: rand(0, Math.PI * 2),
            twinkleSpeed: rand(0.002, 0.006),
            drift: rand(0.0006, 0.002), // leichte Sinus-Drift
            life: 1, // fade-in
            born: performance.now()
        };
        return p;
    }

    function adjustCount() {
        const target = Math.max(minCount, Math.min(maxCount, Math.round(width * height * density)));
        if (particles.length < target) {
            for (let i = particles.length; i < target; i++) particles.push(makeParticle());
        } else if (particles.length > target) {
            particles.length = target;
        }
    }

    function step(t) {
        if (!running) return;

        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // sanfte Drift
            const driftX = Math.sin((t + i * 173) * p.drift) * 0.06;
            const driftY = Math.cos((t + i * 97) * p.drift) * 0.06;

            p.x += p.vx + driftX;
            p.y += p.vy + driftY;

            // Randbehandlung: sanftes Re-Spawnen
            if (p.x < -4 || p.x > width + 4 || p.y < -4 || p.y > height + 4) {
                // Respawn an gegenüberliegender Kante
                const edge = choice(['top', 'bottom', 'left', 'right']);
                if (edge === 'top') { p.x = rand(0, width); p.y = -2; }
                if (edge === 'bottom') { p.x = rand(0, width); p.y = height + 2; }
                if (edge === 'left') { p.x = -2; p.y = rand(0, height); }
                if (edge === 'right') { p.x = width + 2; p.y = rand(0, height); }
                p.vx = rand(-0.04, 0.04);
                p.vy = rand(-0.04, 0.04);
                p.life = 0; // fade-in neu
                p.twinklePhase = rand(0, Math.PI * 2);
            }

            // Twinkle (sehr fein)
            p.twinklePhase += p.twinkleSpeed;
            const twinkle = 0.6 + 0.4 * Math.sin(p.twinklePhase); // 0.2 Range
            const alpha = p.alpha * twinkle * (0.6 + 0.4 * p.life); // fade-in mit life

            // life (fade-in zu 1)
            p.life = Math.min(1, p.life + 0.01);

            // zeichnen
            // weicher Glanz: kleiner Kern + dezenter Glow
            const color = p.white ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;

            // Kern
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            // Glow (nur für weiße, ganz dezent)
            if (p.white) {
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(2.5, p.r * 4));
                const glowAlpha = Math.min(0.18, alpha * 0.25);
                g.addColorStop(0, `rgba(255,255,255,${glowAlpha})`);
                g.addColorStop(1, `rgba(255,255,255,0)`);
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(p.x, p.y, Math.max(2.5, p.r * 4), 0, Math.PI * 2);
                ctx.fill();
            }
        }

        requestAnimationFrame(step);
    }

    // Start/Stop bei Tab-Sichtbarkeit
    function onVisibility() {
        running = !document.hidden;
        if (running) requestAnimationFrame(step);
    }

    // Resize
    window.addEventListener('resize', () => {
        dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        resize();
    });

    document.addEventListener('visibilitychange', onVisibility, { passive: true });

    // Init
    resize();
    requestAnimationFrame(step);
})();
