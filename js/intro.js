// D:\Matize\Hobby Projekte\Iris-Tarot\Iris-Tarot-Website\js\intro.js
(function () {
    let initialized = false;

    function initIntroSection() {
        if (initialized) return;
        const root = document.querySelector('section#intro');
        if (!root) return;

        const moreBtn = root.querySelector('#intro-more-btn');
        const expand = root.querySelector('#intro-expand');
        const openBtn = root.querySelector('#gallery-open');
        const overlay = root.querySelector('#gi-overlay');
        const closeBtn = root.querySelector('#gi-close');
        const wrap = root.querySelector('#gi-wrap');
        const prevBtn = root.querySelector('#gi-prev');
        const nextBtn = root.querySelector('#gi-next');

        if (!openBtn || !overlay || !closeBtn || !wrap || !prevBtn || !nextBtn) return;

        // Mehr-Text
        function toggleExpand(e) {
            if (e) e.preventDefault();
            const open = expand.classList.toggle('open');
            expand.setAttribute('aria-hidden', String(!open));
            moreBtn.setAttribute('aria-expanded', String(open));
            if (open) expand.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        moreBtn && moreBtn.addEventListener('click', toggleExpand);

        // Overlay öffnen/schließen
        function trapFocus(e) {
            if (e.key !== 'Tab') return;
            const focusable = overlay.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }

        function keyHandler(ev) {
            if (ev.key === 'Escape') closeOverlay();
            if (ev.key === 'ArrowLeft') wrap.scrollBy({ left: -Math.round(wrap.clientWidth * 0.9), behavior: 'smooth' });
            if (ev.key === 'ArrowRight') wrap.scrollBy({ left: Math.round(wrap.clientWidth * 0.9), behavior: 'smooth' });
        }

        function openOverlay(e) {
            if (e) e.preventDefault();
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => { wrap.focus({ preventScroll: true }); });
            document.addEventListener('keydown', keyHandler);
            overlay.addEventListener('keydown', trapFocus);
        }

        function closeOverlay() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', keyHandler);
            overlay.removeEventListener('keydown', trapFocus);
            openBtn && openBtn.focus({ preventScroll: true });
        }

        openBtn.addEventListener('click', openOverlay);
        closeBtn.addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (ev) => { if (ev.target === overlay) closeOverlay(); });

        prevBtn.addEventListener('click', () => wrap.scrollBy({ left: -Math.round(wrap.clientWidth * 0.9), behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => wrap.scrollBy({ left: Math.round(wrap.clientWidth * 0.9), behavior: 'smooth' }));

        wrap.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                wrap.scrollBy({ left: e.deltaY, behavior: 'auto' });
            }
        }, { passive: false });

        initialized = true;
    }

    // 1) Direkt probieren
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIntroSection);
    } else {
        initIntroSection();
    }

    // 2) Falls Modul später nachgeladen wird: beobachten und einmalig initialisieren
    const mo = new MutationObserver(() => initIntroSection());
    mo.observe(document.body, { childList: true, subtree: true });
})();
