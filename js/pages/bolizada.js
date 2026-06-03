document.addEventListener('DOMContentLoaded', () => {
    const { loadOrder, saveOrder } = CheBolisOrder;
    const {
        FLAVOR_CATALOG,
        TOPPING_CATALOG,
        FLAVOR_LABELS,
        TOPPING_LABELS,
        TOPPING_PRICES,
        SHAPE_NAMES,
        PLANS,
        getPlan,
        planLimitsText,
        flavorStepHint,
        toppingStepHint,
        validateOrderForPlan,
        sanitizeOrder,
        formatCOP,
        calcTotal,
        flavorColor,
        chipIconHtml,
        iconHtml,
        FEATURED_FLAVORS,
        isFeaturedFlavor,
    } = CheBolisCore;

    const urlPlan = new URLSearchParams(window.location.search).get('plan');
    let order = sanitizeOrder(loadOrder());
    if (urlPlan && PLANS[urlPlan]) {
        order.plan = urlPlan;
        order = sanitizeOrder(order);
    }

    function persist() {
        order = sanitizeOrder(order);
        saveOrder(order);
    }

    function currentPlan() {
        return getPlan(order.plan);
    }

    function toppingPriceLabel(item) {
        const plan = currentPlan();
        if (plan.toppingsIncluded) return 'Incluido';
        const price = item.price ?? TOPPING_PRICES[item.id] ?? 0;
        return price ? `+${formatCOP(price)}` : 'Incluido';
    }

    function flavorChipHtml(item, featured = false) {
        const featClass = featured || isFeaturedFlavor(item.id) ? ' build-flavor-chip--fuerte' : '';
        const badge = featured
            ? '<span class="build-flavor-chip__badge"><i class="bi bi-star-fill"></i> Fuerte</span>'
            : '';
        const name = item.name || FLAVOR_LABELS[item.id] || item.id;
        return `
                        <button type="button" class="build-flavor-chip${featClass}" data-flavor="${item.id}" style="--flavor-color: ${flavorColor(item.id)}">
                            ${badge}
                            <span class="build-flavor-chip__check" aria-hidden="true"><i class="bi bi-check-lg"></i></span>
                            ${chipIconHtml(item, 'flavor', 'build-flavor-chip__icon')}
                            <span class="build-flavor-chip__name">${name}</span>
                        </button>`;
    }

    function renderCatalog() {
        const flavorsRoot = document.getElementById('flavors-catalog');
        const toppingsRoot = document.getElementById('toppings-catalog');
        if (!flavorsRoot || !toppingsRoot) return;

        try {
            const featuredBlock = `
            <div class="build-featured" id="build-featured-flavors">
                <div class="build-featured__head">
                    <span class="build-featured__badge"><i class="bi bi-star-fill" aria-hidden="true"></i> Los fuertes</span>
                    <p class="build-featured__desc">Los sabores estrella de Che Bolis — elige primero aquí</p>
                </div>
                <div class="build-flavor-list build-flavor-list--featured" role="group" aria-label="Sabores fuertes">
                    ${FEATURED_FLAVORS.map((f) => flavorChipHtml(f, true)).join('')}
                </div>
            </div>`;

            const catalogBlock = FLAVOR_CATALOG.map(
                (cat) => `
            <div class="build-group">
                <h3 class="build-group__title">${iconHtml(cat.icon, 'build-group__ico')}${cat.title}</h3>
                <div class="build-flavor-list" role="group" aria-label="${cat.title}">
                    ${cat.items
                        .filter((item) => !isFeaturedFlavor(item.id))
                        .map((item) => flavorChipHtml(item))
                        .join('')}
                </div>
            </div>`
            ).join('');

            flavorsRoot.innerHTML = featuredBlock + catalogBlock;

            toppingsRoot.innerHTML = TOPPING_CATALOG.map(
                (cat) => `
            <div class="build-group">
                <h3 class="build-group__title">${iconHtml(cat.icon, 'build-group__ico')}${cat.title}</h3>
                <div class="build-chip-grid build-chip-grid--toppings" role="group" aria-label="${cat.title}">
                    ${cat.items
                        .map(
                            (item) => `
                        <button type="button" class="build-topping-chip" data-topping="${item.id}">
                            ${chipIconHtml(item, 'topping', 'build-topping-chip__icon')}
                            <span class="build-topping-chip__body">
                                <span class="build-topping-chip__name">${item.name}</span>
                                <span class="build-topping-chip__price">${toppingPriceLabel(item)}</span>
                            </span>
                        </button>`
                        )
                        .join('')}
                </div>
            </div>`
            ).join('');
        } catch (err) {
            console.error('Error al cargar catálogo:', err);
            toppingsRoot.innerHTML =
                '<p class="build-catalog-error">No se pudo cargar toppings. Recarga la página.</p>';
        }

        if (window.CheBolisMotion) {
            window.CheBolisMotion.refresh(document.querySelector('main'));
        }
    }

    function shapeRadius(shape) {
        const map = {
            circle: '50%',
            star: '4px',
            heart: '50% 50% 50% 0',
            square: '8px',
            triangle: '0',
            hexagon: '20%',
        };
        return map[shape] || '50%';
    }

    function updatePlanUI() {
        const plan = currentPlan();
        document.querySelectorAll('.build-plan-opt').forEach((btn) => {
            const active = btn.dataset.plan === plan.id;
            btn.classList.toggle('is-active', active);
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        const notice = document.getElementById('build-plan-notice');
        if (notice) {
            const flavorCap =
                plan.maxFlavors != null
                    ? `${order.flavors.length}/${plan.maxFlavors} sabores`
                    : `${order.flavors.length} sabores`;
            const toppingCap =
                plan.maxToppings != null
                    ? `${order.toppings.length}/${plan.maxToppings} toppings`
                    : plan.toppingsIncluded
                      ? `${order.toppings.length} toppings (incl.)`
                      : `${order.toppings.length} toppings`;
            notice.textContent = `${plan.name} — ${flavorCap} · ${toppingCap} · ${formatCOP(plan.price)} c/u`;
        }
        const flavorsHint = document.getElementById('flavors-step-hint');
        if (flavorsHint) {
            flavorsHint.innerHTML = flavorStepHint(plan, order.flavors.length);
        }
        const toppingsHint = document.getElementById('toppings-step-hint');
        if (toppingsHint) {
            toppingsHint.innerHTML = toppingStepHint(plan, order.toppings.length);
        }
    }

    function updateSummaryText() {
        const plan = currentPlan();
        const shapeEl = document.getElementById('summary-shape');
        const planEl = document.getElementById('summary-plan');
        const flavorsEl = document.getElementById('summary-flavors');
        const toppingsEl = document.getElementById('summary-toppings');
        const qtyEl = document.getElementById('summary-qty');
        const totalEl = document.getElementById('bolizada-total');
        const qtyDisplay = document.getElementById('bolizada-qty-display');

        if (planEl) planEl.textContent = plan.name;
        if (shapeEl) shapeEl.textContent = SHAPE_NAMES[order.shape] || order.shape;
        if (flavorsEl) {
            flavorsEl.textContent = order.flavors.length
                ? order.flavors.map((f) => FLAVOR_LABELS[f] || f).join(', ')
                : '—';
        }
        if (toppingsEl) {
            toppingsEl.textContent = order.toppings.length
                ? order.toppings.map((t) => TOPPING_LABELS[t] || t).join(', ')
                : 'Ninguno';
        }
        if (qtyEl) qtyEl.textContent = String(order.quantity);
        if (qtyDisplay) qtyDisplay.textContent = String(order.quantity);
        if (totalEl) totalEl.textContent = formatCOP(calcTotal(order));

        const hiddenQty = document.getElementById('bolizada-qty');
        if (hiddenQty) hiddenQty.value = order.quantity;

        const minus = document.getElementById('qty-minus');
        const plus = document.getElementById('qty-plus');
        if (minus) minus.disabled = order.quantity <= 1;
        if (plus) plus.disabled = order.quantity >= 10;
    }

    function renderPreviewBalls() {
        const container = document.getElementById('bolizada-balls');
        if (!container) return;
        container.innerHTML = '';
        const count = Math.min(14, 3 + order.flavors.length * 2 + order.quantity);
        for (let i = 0; i < count; i++) {
            const flavor = order.flavors[i % order.flavors.length] || 'maracuya';
            const ball = document.createElement('div');
            ball.className = 'boli-ball';
            ball.style.background = flavorColor(flavor);
            ball.style.borderRadius = shapeRadius(order.shape);
            container.appendChild(ball);
        }
    }

    function canAddFlavor(id) {
        const plan = currentPlan();
        if (order.flavors.includes(id)) return true;
        if (plan.maxFlavors == null) return true;
        if (plan.maxFlavors === 1) return true;
        return order.flavors.length < plan.maxFlavors;
    }

    function canAddTopping(id) {
        const plan = currentPlan();
        if (order.toppings.includes(id)) return true;
        if (plan.maxToppings == null) return true;
        return order.toppings.length < plan.maxToppings;
    }

    function showLimitMessage(msg) {
        const notice = document.getElementById('build-plan-notice');
        if (notice) {
            notice.textContent = msg;
            notice.classList.add('is-warn');
            window.setTimeout(() => {
                notice.classList.remove('is-warn');
                updatePlanUI();
            }, 2200);
        }
    }

    function syncUIFromOrder() {
        const plan = currentPlan();
        /* Con 1 sabor (Mini) se cambia tocando otro, no bloqueando el resto */
        const blockNewFlavors =
            plan.maxFlavors != null &&
            plan.maxFlavors > 1 &&
            order.flavors.length >= plan.maxFlavors;
        const toppingsFull =
            plan.maxToppings != null && order.toppings.length >= plan.maxToppings;

        document.querySelectorAll('.build-shape').forEach((b) => {
            b.classList.toggle('is-active', b.dataset.shape === order.shape);
        });
        document.querySelectorAll('.build-flavor-chip').forEach((c) => {
            const id = c.dataset.flavor;
            const selected = order.flavors.includes(id);
            const blocked = !selected && blockNewFlavors;
            c.classList.toggle('is-active', selected);
            c.classList.toggle('is-disabled', blocked);
            c.disabled = blocked;
            c.setAttribute('aria-pressed', selected ? 'true' : 'false');
            c.setAttribute('aria-disabled', blocked ? 'true' : 'false');
        });
        document.querySelectorAll('.build-topping-chip').forEach((c) => {
            const id = c.dataset.topping;
            const selected = order.toppings.includes(id);
            const blocked = !selected && toppingsFull;
            c.classList.toggle('is-active', selected);
            c.classList.toggle('is-disabled', blocked);
            c.disabled = blocked;
            c.setAttribute('aria-pressed', selected ? 'true' : 'false');
            c.setAttribute('aria-disabled', blocked ? 'true' : 'false');
        });
        updatePlanUI();
        renderPreviewBalls();
        updateSummaryText();
    }

    function setPlan(planId) {
        if (!PLANS[planId] || order.plan === planId) return;
        const before = {
            flavors: order.flavors.length,
            toppings: order.toppings.length,
        };
        order.plan = planId;
        order = sanitizeOrder(order);
        const trimmed =
            before.flavors !== order.flavors.length || before.toppings !== order.toppings.length;
        persist();
        renderCatalog();
        syncUIFromOrder();
        if (trimmed) {
            showLimitMessage(
                `Ajustamos tu selección a lo permitido en ${currentPlan().name} (${planLimitsText(planId)}).`
            );
        }
        const params = new URLSearchParams(window.location.search);
        params.set('plan', planId);
        const qs = params.toString();
        window.history.replaceState(null, '', qs ? `bolizada.html?${qs}` : 'bolizada.html');
    }

    function toggleFlavor(id) {
        const plan = currentPlan();

        if (order.flavors.includes(id)) {
            if (order.flavors.length > 1) {
                order.flavors = order.flavors.filter((x) => x !== id);
            } else if (plan.maxFlavors === 1) {
                showLimitMessage('Toca otro sabor para cambiar el de tu combo.');
            }
            persist();
            syncUIFromOrder();
            return;
        }

        if (plan.maxFlavors === 1) {
            order.flavors = [id];
            persist();
            syncUIFromOrder();
            return;
        }

        if (!canAddFlavor(id)) {
            showLimitMessage(
                `Tu ${plan.name} permite hasta ${plan.maxFlavors} sabores. Quita uno para cambiar.`
            );
            return;
        }

        order.flavors.push(id);
        persist();
        syncUIFromOrder();
    }

    function toggleTopping(id) {
        const plan = currentPlan();

        if (order.toppings.includes(id)) {
            order.toppings = order.toppings.filter((x) => x !== id);
            persist();
            syncUIFromOrder();
            return;
        }

        if (!canAddTopping(id)) {
            const msg =
                plan.maxToppings != null
                    ? `Tu ${plan.name} permite hasta ${plan.maxToppings} toppings.`
                    : 'No puedes agregar más toppings con este combo.';
            showLimitMessage(msg);
            return;
        }

        order.toppings.push(id);
        persist();
        syncUIFromOrder();
    }

    document.querySelectorAll('.build-plan-opt').forEach((btn) => {
        btn.addEventListener('click', () => setPlan(btn.dataset.plan));
    });

    document.getElementById('flavors-catalog')?.addEventListener('click', (e) => {
        const chip = e.target.closest('.build-flavor-chip');
        if (!chip?.dataset.flavor || chip.disabled) return;
        e.preventDefault();
        toggleFlavor(chip.dataset.flavor);
    });

    document.getElementById('toppings-catalog')?.addEventListener('click', (e) => {
        const chip = e.target.closest('.build-topping-chip');
        if (!chip?.dataset.topping || chip.disabled) return;
        e.preventDefault();
        toggleTopping(chip.dataset.topping);
    });

    document.querySelectorAll('.build-shape').forEach((btn) => {
        btn.addEventListener('click', () => {
            order.shape = btn.dataset.shape;
            persist();
            syncUIFromOrder();
        });
    });

    function setQuantity(n) {
        order.quantity = Math.max(1, Math.min(10, n));
        persist();
        syncUIFromOrder();
    }

    document.getElementById('qty-minus')?.addEventListener('click', () => setQuantity(order.quantity - 1));
    document.getElementById('qty-plus')?.addEventListener('click', () => setQuantity(order.quantity + 1));

    document.getElementById('btn-confirm-order')?.addEventListener('click', () => {
        order = sanitizeOrder(order);
        const errors = validateOrderForPlan(order);
        if (errors.length) {
            alert(errors.join('\n'));
            syncUIFromOrder();
            return;
        }
        persist();
        window.location.href = 'domicilio.html';
    });

    renderCatalog();
    persist();
    syncUIFromOrder();
    if (window.CheBolisMotion) window.CheBolisMotion.refresh(document.querySelector('main'));
});
