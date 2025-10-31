/* init-leather.js
   Versucht mehrere mögliche Pfade zur Ledertextur und nimmt den ersten funktionierenden.
   Fügt #leather-bg als erstes Body-Child ein und injiziert die zugehörigen CSS-Regeln.
   Anpassbar: die Liste `candidatePaths` erweitern / anpassen.
*/

(function () {
    // Kandidaten-Pfade (relativ zum Webroot / zur Seite). Reihenfolge = Priorität.
    const candidatePaths = [
        'images/leather/leather-texture.jpg',
        'images/leather.jpg',
        'assets/img/leather.jpg',
        'assets/images/leather/leather-texture.jpg',
        '/images/leather/leather-texture.jpg',
        '/assets/img/leather.jpg',
        'https://via.placeholder.com/64' // als Debug/Platzhalter (am Ende)
    ];

    // DEBUG = true zeigt Console-Logs
    const DEBUG = false;
    function log(...args) { if (DEBUG) console.log('[leather]', ...args); }

    let chosenUrl = null;
    let stylesInjected = false;

    function injectStyles(url) {
        if (stylesInjected) return;
        stylesInjected = true;

        const css = `
/* Leder-Hintergrund-Layer */
#leather-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-color: #0b0b0b;
    background-image: url("${url}");
    background-repeat: repeat;
    background-size: auto 100%;
    background-position: center center;
    opacity: 1;
    transition: opacity .32s ease;
}

/* Content über dem Background sicherstellen */
body > *:not(#leather-bg) {
    position: relative;
    z-index: 1;
}

@media (prefers-reduced-motion: reduce) {
    #leather-bg { transition: none; }
}
`;
        const style = document.createElement('style');
        style.id = 'leather-bg-styles';
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
        log('injected styles for', url);
    }

    function ensureLeatherBG() {
        if (!chosenUrl) {
            // Falls noch kein Bild gewählt (z. B. Script vor Ergebnis), setze placeholder transparent
            chosenUrl = '';
            injectStyles(chosenUrl);
        } else {
            injectStyles(chosenUrl);
        }

        let bg = document.getElementById('leather-bg');
        if (!bg) {
            bg = document.createElement('div');
            bg.id = 'leather-bg';
            bg.setAttribute('role', 'presentation');
            const first = document.body.firstChild || null;
            document.body.insertBefore(bg, first);
            log('leather-bg element inserted');
        } else {
            log('leather-bg already present');
        }

        // Leichter Schutz: nur wenn nötig inline position/z-index setzen
        Array.from(document.body.children).forEach(el => {
            if (el.id === 'leather-bg') return;
            const cs = getComputedStyle(el);
            if (cs.position === 'static' && !el.style.position) el.style.position = 'relative';
            if ((!el.style.zIndex || Number.isNaN(Number(el.style.zIndex)) || Number(el.style.zIndex) <= 0) && !el.hasAttribute('data-leather-original-z')) {
                // markieren, falls wir verändern, damit man es später erkennen kann
                el.setAttribute('data-leather-original-z', el.style.zIndex || '');
                if (!el.style.zIndex) el.style.zIndex = 1;
            }
        });
    }

    function testPath(path) {
        return new Promise((resolve) => {
            const img = new Image();
            let settled = false;
            const onSuccess = () => { if (settled) return; settled = true; resolve({ ok: true, path }); };
            const onFail = () => { if (settled) return; settled = true; resolve({ ok: false, path }); };
            img.onload = onSuccess;
            img.onerror = onFail;
            // small timeout in case of very slow network (not strictly necessary)
            const t = setTimeout(() => {
                if (settled) return;
                settled = true;
                // fallback: treat as fail
                resolve({ ok: false, path });
            }, 3000);
            img.src = path;
        });
    }

    async function findAndApply() {
        for (let i = 0; i < candidatePaths.length; i++) {
            const p = candidatePaths[i];
            log('testing', p);
            try {
                // eslint-disable-next-line no-await-in-loop
                const res = await testPath(p);
                if (res.ok) {
                    chosenUrl = p;
                    log('chosen leather texture:', chosenUrl);
                    injectStyles(chosenUrl);
                    ensureLeatherBG();
                    return;
                } else {
                    log('not found:', p);
                }
            } catch (err) {
                console.warn('[leather] Fehler beim Testen von', p, err);
            }
        }

        // Wenn keiner gefunden wurde, injizieren wir eine dezente Farbfläche als Fallback
        chosenUrl = '';
        injectStyles(chosenUrl);
        ensureLeatherBG();
        console.warn('[leather] Keine Ledertextur gefunden in Kandidatenpfaden; benutze Farb-Fallback.');
    }

    // Start: sobald DOM bereit
    function start() {
        // Beginne Suche, aber zeige Layer sofort (mit leerer URL), damit DOM-Struktur gesetzt ist
        ensureLeatherBG();
        findAndApply();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    // Beobachter für nachträgliche DOM-Änderungen
    const mo = new MutationObserver(() => {
        // Falls bg entfernt wurde oder neu eingefügt werden muss
        ensureLeatherBG();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
})();