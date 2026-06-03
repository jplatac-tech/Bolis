/** Menú móvil y tema — todas las páginas */
const RESPONSIVE_WIDTH = 1024;
let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH;

function toggleHeader() {
    const collapseHeaderItems = document.getElementById('collapsed-header-items');
    const collapseBtn = document.getElementById('collapse-btn');
    if (!collapseHeaderItems || !collapseBtn) return;

    if (isHeaderCollapsed) {
        collapseHeaderItems.classList.add('is-nav-open', 'max-lg:!tw-opacity-100');
        collapseHeaderItems.style.height = '';
        collapseBtn.classList.remove('bi-list');
        collapseBtn.classList.add('bi-x', 'max-lg:tw-fixed');
        collapseBtn.setAttribute('aria-expanded', 'true');
        collapseBtn.setAttribute('aria-label', 'Cerrar menú');
        isHeaderCollapsed = false;
        document.body.classList.add('modal-open');
        setTimeout(() => window.addEventListener('click', onHeaderClickOutside), 1);
    } else {
        collapseHeaderItems.classList.remove('is-nav-open', 'max-lg:!tw-opacity-100');
        collapseHeaderItems.style.height = '';
        collapseBtn.classList.remove('bi-x', 'max-lg:tw-fixed');
        collapseBtn.classList.add('bi-list');
        collapseBtn.setAttribute('aria-expanded', 'false');
        collapseBtn.setAttribute('aria-label', 'Abrir menú');
        isHeaderCollapsed = true;
        document.body.classList.remove('modal-open');
        window.removeEventListener('click', onHeaderClickOutside);
    }
}

function onHeaderClickOutside(e) {
    const collapseHeaderItems = document.getElementById('collapsed-header-items');
    if (collapseHeaderItems && !collapseHeaderItems.contains(e.target)) toggleHeader();
}

function responsive() {
    if (!isHeaderCollapsed && window.innerWidth < RESPONSIVE_WIDTH) toggleHeader();
    if (window.innerWidth >= RESPONSIVE_WIDTH) {
        const el = document.getElementById('collapsed-header-items');
        const collapseBtn = document.getElementById('collapse-btn');
        if (el) {
            el.style.height = '';
            el.classList.remove('is-nav-open', 'max-lg:!tw-opacity-100');
        }
        if (collapseBtn) {
            collapseBtn.classList.remove('bi-x', 'max-lg:tw-fixed');
            collapseBtn.classList.add('bi-list');
            collapseBtn.setAttribute('aria-expanded', 'false');
            collapseBtn.setAttribute('aria-label', 'Abrir menú');
        }
        document.body.classList.remove('modal-open');
        isHeaderCollapsed = true;
    }
}

function syncDarkClass() {
    const on = document.documentElement.classList.contains('tw-dark');
    document.body.classList.toggle('tw-dark', on);
    document.documentElement.style.colorScheme = on ? 'dark' : 'light';
}

function toggleMode() {
    document.documentElement.classList.toggle('tw-dark');
    syncDarkClass();
    updateToggleModeBtn();
}

function updateToggleModeBtn() {
    const icon = document.querySelector('#toggle-mode-icon');
    if (!icon) return;
    if (document.documentElement.classList.contains('tw-dark')) {
        icon.classList.replace('bi-sun', 'bi-moon');
        localStorage.setItem('color-mode', 'dark');
    } else {
        icon.classList.replace('bi-moon', 'bi-sun');
        localStorage.setItem('color-mode', 'light');
    }
}

if (localStorage.getItem('color-mode') === 'dark') {
    document.documentElement.classList.add('tw-dark');
} else {
    document.documentElement.classList.remove('tw-dark');
}
syncDarkClass();

function initSite() {
    updateToggleModeBtn();
    responsive();
    window.addEventListener('resize', responsive);

    document.querySelectorAll('.faq-accordion').forEach((acc) => {
        acc.addEventListener('click', () => {
            const faq = acc.closest('.faq');
            const open = faq?.classList.toggle('active');
            const icon = acc.querySelector('i');
            if (icon) {
                icon.classList.toggle('bi-plus', !open);
                icon.classList.toggle('bi-dash', !!open);
            }
        });
    });
}

window.toggleHeader = toggleHeader;
window.toggleMode = toggleMode;
window.initCheBolisSite = initSite;
