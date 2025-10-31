// Liste der Module (HTML-Fragment-Dateien) die in #app geladen werden
const MODULES = [
    "nav.html",
    "hero.html",
    "intro.html",
    "order.html",
    "cards.html",
    "artist.html",
    "legal.html",
    "footer.html"
];

// Lädt Module aus /modules/ in den #app Container
async function loadModules() {
    const app = document.getElementById("app");
    if (!app) return;

    for (const file of MODULES) {
        try {
            const res = await fetch(`./modules/${file}?v=${Date.now()}`);
            if (!res.ok) throw new Error(`${file} nicht gefunden (${res.status})`);
            const html = await res.text();
            const wrap = document.createElement("section");
            wrap.innerHTML = html;
            app.appendChild(wrap);
        } catch (err) {
            console.error(err);
            const errEl = document.createElement("div");
            errEl.style.padding = "1rem";
            errEl.style.color = "salmon";
            errEl.textContent = `Fehler beim Laden von ${file}`;
            app.appendChild(errEl);
        }
    }

    // Initialisiere UI-Logik nachdem alle Module im DOM sind
    initNavEnhancements();
    initHeroGlintOnce();
    initIntroInteractions();
    initLegalToggle();
}

/* Basic nav smooth scroll */
function initNavEnhancements() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener("click", e => {
            const id = a.getAttribute("href").slice(1);
            const el = document.getElementById(id);
            if (!el) return;
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

/* Hero glint */
function initHeroGlintOnce() {
    const title = document.querySelector(".hero-title");
    if (!title) return;
    title.classList.add("metal-once");
    title.addEventListener("animationend", (e) => {
        if (e.animationName === "metalPass") title.classList.remove("metal-once");
    });
}

/* Intro interactions (optional) */
function initIntroInteractions() {
    const moreBtn = document.getElementById("intro-more-btn");
    const expandEl = document.getElementById("intro-expand");
    if (moreBtn && expandEl) {
        moreBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const willOpen = !expandEl.classList.contains("open");
            expandEl.classList.toggle("open", willOpen);
            expandEl.setAttribute("aria-hidden", String(!willOpen));
            moreBtn.setAttribute("aria-expanded", String(willOpen));
            if (willOpen) expandEl.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }
}

/* Legal Toggle */
function initLegalToggle() {
    const toggle = document.querySelector('.legal-toggle');
    const body = document.getElementById('legal-body');
    if (!toggle || !body) return;

    function open() {
        body.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        const full = body.scrollHeight;
        body.style.maxHeight = full + 'px';
    }

    function close() {
        body.style.maxHeight = body.scrollHeight + 'px';
        requestAnimationFrame(() => {
            body.setAttribute('aria-hidden', 'true');
            toggle.setAttribute('aria-expanded', 'false');
            body.style.maxHeight = '0px';
        });
    }

    body.style.maxHeight = '0px';
    body.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) close(); else open();
    });

    toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle.click();
        }
    });

    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !body.contains(e.target)) {
            if (toggle.getAttribute('aria-expanded') === 'true') close();
        }
    });
}

document.addEventListener("DOMContentLoaded", loadModules);
