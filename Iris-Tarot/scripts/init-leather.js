/* Inject #leather-bg als erstes Kindelement von <body> – garantiert sichtbar */
(function () {
    function ensureLeatherBG() {
        if (!document.getElementById('leather-bg')) {
            const bg = document.createElement('div');
            bg.id = 'leather-bg';
            document.body.insertBefore(bg, document.body.firstChild || null);
        }
        // Sicherheitsnetz: sorge dafür, dass Hauptinhalt über z-index:0 liegt
        Array.from(document.body.children).forEach(el => {
            if (el.id !== 'leather-bg') {
                const cs = getComputedStyle(el);
                if (cs.position === 'static') el.style.position = 'relative';
                if (!el.style.zIndex) el.style.zIndex = 1;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureLeatherBG);
    } else {
        ensureLeatherBG();
    }

    // Nachträgliche DOM-Änderungen (Module/Fetch) auffangen:
    const mo = new MutationObserver(() => {
        ensureLeatherBG();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
})();
