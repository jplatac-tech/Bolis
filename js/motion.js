/**
 * Animaciones al scroll y refresco tras contenido dinámico (bolizada).
 */
(function () {
    const STAGGER_MS = 65;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const REVEAL_SELECTORS = [
        'main > section',
        'main .flow-header',
        'main .flow-card',
        'main .flow-guard',
        'main .build-plan-bar',
        'main .build-group',
        'main .build-plan-notice',
        'main .home-valor',
        'main .home-sabor',
        'main .home-pricing__card',
        'main .home-faq__box',
        'main .build-plan-opt',
        'main .build-flavor-chip',
        'main .build-topping-chip',
        'main .build-shape-opt',
        '.site-footer__brand',
    ];

    const HERO_IMMEDIATE = ['.home-hero__content', '.home-hero__visual'];

    let observer;

    function getObserver() {
        if (observer) return observer;
        if (reduced) return null;
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            { rootMargin: '0px 0px -5% 0px', threshold: 0.06 }
        );
        return observer;
    }

    function markReveal(el, delayMs) {
        if (!el || el.classList.contains('reveal')) return;
        el.classList.add('reveal');
        if (delayMs > 0) el.style.setProperty('--reveal-delay', `${delayMs}ms`);
        if (reduced) {
            el.classList.add('is-visible');
            return;
        }
        const io = getObserver();
        if (io) io.observe(el);
    }

    function staggerInContainer(container, itemSelector) {
        const items = container.querySelectorAll(itemSelector);
        items.forEach((item, index) => markReveal(item, index * STAGGER_MS));
    }

    function scopedSelector(selector, scope) {
        if (scope === document) return selector;
        if (selector === 'main > section') return ':scope > section';
        return selector.replace(/^main\s+/, '');
    }

    function applyReveals(root) {
        const scope = root && root !== document ? root : document;

        scope.querySelectorAll(scopedSelector('main > section', scope)).forEach((el, index) => {
            if (el.classList.contains('home-hero')) return;
            markReveal(el, index * STAGGER_MS);
        });

        REVEAL_SELECTORS.forEach((selector) => {
            if (selector === 'main > section') return;
            scope.querySelectorAll(scopedSelector(selector, scope)).forEach((el) => {
                if (scope !== document && !scope.contains(el)) return;
                const group = el.parentElement;
                if (!group) {
                    markReveal(el, 0);
                    return;
                }
                const peers = group.querySelectorAll(selector);
                const index = Array.from(peers).indexOf(el);
                markReveal(el, index * STAGGER_MS);
            });
        });

        scope.querySelectorAll('.home-valores__grid, .home-sabores__grid, .home-pricing__grid').forEach((grid) => {
            const childSel = grid.classList.contains('home-pricing__grid')
                ? '.home-pricing__card'
                : grid.classList.contains('home-sabores__grid')
                  ? '.home-sabor'
                  : '.home-valor';
            staggerInContainer(grid, childSel);
        });

        HERO_IMMEDIATE.forEach((sel, i) => {
            scope.querySelectorAll(scopedSelector(sel, scope)).forEach((el) => {
                markReveal(el, i * 80);
                el.classList.add('is-visible');
            });
        });
    }

    function boot() {
        document.documentElement.classList.add('motion-ready');
        applyReveals(document);
    }

    function refresh(root) {
        if (!root) {
            applyReveals(document);
            return;
        }
        applyReveals(root);
        if (!reduced) {
            root.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
                const io = getObserver();
                if (io) io.observe(el);
            });
        }
    }

    window.CheBolisMotion = { refresh, boot };

    document.addEventListener('che-bolis-layout-ready', boot, { once: true });
})();
