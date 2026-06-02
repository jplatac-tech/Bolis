/**
 * Carga header y footer desde partials/
 */
async function injectPartial(url, targetId) {
    const el = document.getElementById(targetId);
    if (!el) return;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(res.statusText);
        el.innerHTML = await res.text();
    } catch (err) {
        console.warn('Partial no cargado:', url, err);
        el.innerHTML = `<p class="tw-p-4 tw-text-red-600">No se pudo cargar esta sección. Recarga la página o contacta soporte.</p>`;
    }
}

function markActiveNav(activePage) {
    document.querySelectorAll('[data-nav]').forEach((link) => {
        if (link.dataset.nav === activePage) {
            link.classList.add('nav-active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const active = document.body.dataset.page || '';

    await Promise.all([
        injectPartial('partials/header.html', 'site-header'),
        injectPartial('partials/footer.html', 'site-footer'),
    ]);
    markActiveNav(active);

    if (!window.__cheBolisSiteLoaded) {
        await loadScript('js/site.js');
        window.__cheBolisSiteLoaded = true;
        if (typeof initCheBolisSite === 'function') initCheBolisSite();
    }
    document.dispatchEvent(new Event('che-bolis-layout-ready'));
});
