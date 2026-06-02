const DELIVERY_CITY = 'Cartagena';

const STORE = {
    name: 'Che Bolis — El del toque secreto',
    lat: 10.4236,
    lng: -75.548,
    city: DELIVERY_CITY,
    address: `Centro histórico, ${DELIVERY_CITY}, Colombia`,
};

const BASE_PRICE = 5000;

/** Combos Bolizada — límites y precio base por unidad */
const PLANS = {
    mini: {
        id: 'mini',
        name: 'Mini Bolizada',
        price: 5000,
        maxFlavors: 1,
        maxToppings: 2,
        toppingsIncluded: false,
    },
    doble: {
        id: 'doble',
        name: 'Bolizada doble',
        price: 8500,
        maxFlavors: 2,
        maxToppings: null,
        toppingsIncluded: true,
    },
    fiesta: {
        id: 'fiesta',
        name: 'Fiesta Bolizada',
        price: 12000,
        maxFlavors: 4,
        maxToppings: null,
        toppingsIncluded: true,
    },
};

function getPlan(planId) {
    return PLANS[planId] || PLANS.mini;
}

/** Sabores estrella del local (Cartagena) */
const FEATURED_FLAVOR_IDS = ['maracuya', 'mango', 'limon', 'coco', 'corozo'];

const FLAVOR_EMOJI = {
    maracuya: '🧃',
    mango: '🥭',
    limon: '🍋',
    coco: '🥥',
    corozo: '🍒',
    arequipe: '🍯',
    oreo: '🍪',
    chocolate: '🍫',
    'fresa-crema': '🍓',
    vainilla: '🍦',
    fresa: '🍓',
    uva: '🍇',
    'pie-limon': '🥧',
    chocobanano: '🍌',
    cafe: '☕',
    'tres-leches': '🥛',
    michelado: '🌶️',
};

const TOPPING_EMOJI = {
    'arequipe-top': '🍯',
    'leche-condensada': '🥛',
    'sirope-chocolate': '🍫',
    mermelada: '🍓',
    chamoy: '🌶️',
    'oreo-top': '🍪',
    mani: '🥜',
    barquillo: '🧇',
    'chispas-chocolate': '✨',
    granola: '🌾',
    'chispas-colores': '🌈',
    masmelos: '🍬',
    guayaba: '🍐',
    gomitas: '🐻',
    chantilly: '🍦',
};

const FEATURED_FLAVORS = [
    {
        id: 'maracuya',
        name: 'Maracuyá',
        tagline: 'Tropical, refrescante y llena de sabor.',
        theme: 'maracuya',
        emoji: FLAVOR_EMOJI.maracuya,
    },
    {
        id: 'mango',
        name: 'Mango biche',
        tagline: 'Dulce, cremoso y natural.',
        theme: 'mango',
        emoji: FLAVOR_EMOJI.mango,
    },
    {
        id: 'limon',
        name: 'Limón',
        tagline: 'Cítrico, refrescante y perfecto.',
        theme: 'limon',
        emoji: FLAVOR_EMOJI.limon,
    },
    {
        id: 'coco',
        name: 'Coco',
        tagline: 'Suave, cremoso y delicioso.',
        theme: 'coco',
        emoji: FLAVOR_EMOJI.coco,
    },
    {
        id: 'corozo',
        name: 'Corozo',
        tagline: 'Tradicional, único y lleno de sabor.',
        theme: 'corozo',
        emoji: FLAVOR_EMOJI.corozo,
    },
];

const FLAVOR_CATALOG = [
    {
        id: 'leche',
        title: 'Base de leche',
        icon: 'bi-cup-straw',
        items: [
            { id: 'arequipe', name: 'Arequipe' },
            { id: 'oreo', name: 'Oreo / Galleta' },
            { id: 'chocolate', name: 'Chocolate / Nutella' },
            { id: 'fresa-crema', name: 'Fresa con crema' },
            { id: 'vainilla', name: 'Vainilla' },
            { id: 'coco', name: 'Coco', featured: true },
        ],
    },
    {
        id: 'agua',
        title: 'Base de agua',
        icon: 'bi-droplet-fill',
        items: [
            { id: 'limon', name: 'Limón', featured: true },
            { id: 'mango', name: 'Mango biche', featured: true },
            { id: 'maracuya', name: 'Maracuyá / Parcha', featured: true },
            { id: 'corozo', name: 'Corozo', featured: true },
            { id: 'fresa', name: 'Fresa o Mora' },
            { id: 'uva', name: 'Uva' },
        ],
    },
    {
        id: 'gourmet',
        title: 'Gourmet y tendencias',
        icon: 'bi-stars',
        items: [
            { id: 'pie-limon', name: 'Pie de limón' },
            { id: 'chocobanano', name: 'Chocobanano' },
            { id: 'cafe', name: 'Café / Capuchino' },
            { id: 'tres-leches', name: 'Tres leches' },
            { id: 'michelado', name: 'Michelado / Chamoy' },
        ],
    },
];

const TOPPING_CATALOG = [
    {
        id: 'salsas',
        title: 'Salsas y jarabes',
        icon: 'bi-droplet',
        items: [
            { id: 'arequipe-top', name: 'Arequipe', price: 700 },
            { id: 'leche-condensada', name: 'Leche condensada', price: 700 },
            { id: 'sirope-chocolate', name: 'Sirope de chocolate', price: 800 },
            { id: 'mermelada', name: 'Mermelada fresa o mora', price: 600 },
            { id: 'chamoy', name: 'Chamoy', price: 600 },
        ],
    },
    {
        id: 'crocantes',
        title: 'Crocantes y galletas',
        icon: 'bi-grid-3x3-gap-fill',
        items: [
            { id: 'oreo-top', name: 'Oreo triturado', price: 700 },
            { id: 'mani', name: 'Maní troceado', price: 500 },
            { id: 'barquillo', name: 'Barquillos', price: 600 },
            { id: 'chispas-chocolate', name: 'Chispas de chocolate', price: 600 },
            { id: 'granola', name: 'Granola', price: 500 },
        ],
    },
    {
        id: 'dulces',
        title: 'Dulces y golosinas',
        icon: 'bi-balloon-heart-fill',
        items: [
            { id: 'chispas-colores', name: 'Chispas de colores', price: 500 },
            { id: 'masmelos', name: 'Bombones / masmelos', price: 600 },
            { id: 'guayaba', name: 'Dulce de guayaba', price: 500 },
            { id: 'gomitas', name: 'Gomitas', price: 600 },
        ],
    },
    {
        id: 'cremas',
        title: 'Cremas',
        icon: 'bi-cloud-fill',
        items: [{ id: 'chantilly', name: 'Crema chantilly', price: 800 }],
    },
];

const FLAVOR_COLORS = {
    arequipe: '#c68b3f',
    oreo: '#4e342e',
    chocolate: '#5d4037',
    'fresa-crema': '#e91e63',
    vainilla: '#f9a825',
    coco: '#8d6e63',
    limon: '#43a047',
    mango: '#ff9800',
    maracuya: '#7b1fa2',
    corozo: '#c62828',
    fresa: '#d81b60',
    uva: '#6a1b9a',
    'pie-limon': '#aed581',
    chocobanano: '#795548',
    cafe: '#4e342e',
    'tres-leches': '#d4a574',
    michelado: '#ff5722',
};

const FLAVOR_ICONS = {};
const TOPPING_ICONS = {};

const TOPPING_PRICES = {};
TOPPING_CATALOG.forEach((cat) => {
    cat.items.forEach((item) => {
        TOPPING_PRICES[item.id] = item.price;
        if (item.icon) TOPPING_ICONS[item.id] = item.icon;
    });
});

const FLAVOR_LABELS = {};
FLAVOR_CATALOG.forEach((cat) => {
    cat.items.forEach((item) => {
        FLAVOR_LABELS[item.id] = item.name;
        if (item.icon) FLAVOR_ICONS[item.id] = item.icon;
    });
});

const TOPPING_LABELS = {};
TOPPING_CATALOG.forEach((cat) => {
    cat.items.forEach((item) => {
        TOPPING_LABELS[item.id] = item.name;
        if (item.icon) TOPPING_ICONS[item.id] = item.icon;
    });
});

const VALID_FLAVOR_IDS = new Set(Object.keys(FLAVOR_COLORS));
const VALID_TOPPING_IDS = new Set(Object.keys(TOPPING_PRICES));

const SHAPE_NAMES = {
    circle: 'Círculo',
    star: 'Estrella',
    heart: 'Corazón',
    square: 'Cuadrado',
    triangle: 'Triángulo',
    hexagon: 'Hexágono',
};

const SHAPE_ICONS = {
    circle: 'bi-circle',
    star: 'bi-star-fill',
    heart: 'bi-heart-fill',
    square: 'bi-square-fill',
    triangle: 'bi-triangle-fill',
    hexagon: 'bi-hexagon-fill',
};

/** Migra pedidos guardados con ids antiguos */
const LEGACY_FLAVOR_MAP = {};
const LEGACY_TOPPING_MAP = {
    jarabe: 'sirope-chocolate',
    chispas: 'chispas-colores',
    coco: 'granola',
    lechera: 'leche-condensada',
};

function formatCOP(n) {
    return '$' + n.toLocaleString('es-CO');
}

function normalizeFlavorId(id) {
    if (VALID_FLAVOR_IDS.has(id)) return id;
    return LEGACY_FLAVOR_MAP[id] || null;
}

function normalizeToppingId(id) {
    if (VALID_TOPPING_IDS.has(id)) return id;
    return LEGACY_TOPPING_MAP[id] || null;
}

function sanitizeOrder(order) {
    const plan = getPlan(order.plan);
    let flavors = [...new Set((order.flavors || []).map(normalizeFlavorId).filter(Boolean))];
    let toppings = [...new Set((order.toppings || []).map(normalizeToppingId).filter(Boolean))];

    if (!flavors.length) flavors = ['maracuya'];
    if (plan.maxFlavors != null && flavors.length > plan.maxFlavors) {
        flavors = flavors.slice(0, plan.maxFlavors);
    }
    if (plan.maxToppings != null && toppings.length > plan.maxToppings) {
        toppings = toppings.slice(0, plan.maxToppings);
    }

    return {
        ...order,
        plan: plan.id,
        flavors,
        toppings,
    };
}

function calcTotal(order) {
    const plan = getPlan(order.plan);
    let total = plan.price * (order.quantity || 1);
    if (!plan.toppingsIncluded) {
        (order.toppings || []).forEach((t) => {
            total += (TOPPING_PRICES[t] || 0) * (order.quantity || 1);
        });
    }
    return total;
}

function planLimitsText(planId) {
    const plan = getPlan(planId);
    const parts = [];
    parts.push(
        plan.maxFlavors === 1 ? '1 sabor' : `hasta ${plan.maxFlavors} sabores`
    );
    if (plan.maxToppings != null) {
        parts.push(`hasta ${plan.maxToppings} toppings`);
    } else if (plan.toppingsIncluded) {
        parts.push('toppings incluidos');
    }
    return parts.join(' · ');
}

function orderSummaryText(order) {
    const plan = getPlan(order.plan);
    const flavorText = order.flavors.map((f) => FLAVOR_LABELS[f] || f).join(', ');
    const topText = order.toppings.length
        ? order.toppings.map((t) => TOPPING_LABELS[t] || t).join(', ')
        : 'ninguno';
    return `${order.quantity}× ${plan.name} (${SHAPE_NAMES[order.shape] || order.shape}) · ${flavorText} · toppings: ${topText}`;
}

function flavorColor(id) {
    return FLAVOR_COLORS[id] || '#e91e8c';
}

function flavorEmoji(id) {
    return FLAVOR_EMOJI[id] || null;
}

function toppingEmoji(id) {
    return TOPPING_EMOJI[id] || null;
}

function flavorIcon(id) {
    return FLAVOR_ICONS[id] || 'bi-circle-fill';
}

function toppingIcon(id) {
    return TOPPING_ICONS[id] || 'bi-plus-circle';
}

function shapeIcon(shape) {
    return SHAPE_ICONS[shape] || 'bi-circle';
}

function emojiHtml(emoji, extraClass = '') {
    if (!emoji) return '';
    return `<span class="chip-emoji${extraClass ? ` ${extraClass}` : ''}" aria-hidden="true">${emoji}</span>`;
}

function iconHtml(iconClass, extraClass = '') {
    if (!iconClass) return '';
    const cls = iconClass.startsWith('bi-') ? iconClass : `bi-${iconClass}`;
    return `<i class="bi ${cls}${extraClass ? ` ${extraClass}` : ''}" aria-hidden="true"></i>`;
}

/** Icono visual de chip: emoji si existe, si no Bootstrap Icons */
function chipIconHtml(item, kind = 'flavor', extraClass = '') {
    const emoji =
        item.emoji || (kind === 'flavor' ? flavorEmoji(item.id) : toppingEmoji(item.id));
    if (emoji) return emojiHtml(emoji, extraClass);
    const iconClass =
        item.icon || (kind === 'flavor' ? flavorIcon(item.id) : toppingIcon(item.id));
    return iconHtml(iconClass, extraClass);
}

function isFeaturedFlavor(id) {
    return FEATURED_FLAVOR_IDS.includes(id);
}

window.CheBolisCore = {
    DELIVERY_CITY,
    STORE,
    PLANS,
    FEATURED_FLAVOR_IDS,
    FEATURED_FLAVORS,
    isFeaturedFlavor,
    getPlan,
    planLimitsText,
    BASE_PRICE,
    FLAVOR_CATALOG,
    TOPPING_CATALOG,
    TOPPING_PRICES,
    FLAVOR_COLORS,
    FLAVOR_LABELS,
    TOPPING_LABELS,
    FLAVOR_EMOJI,
    TOPPING_EMOJI,
    FLAVOR_ICONS,
    TOPPING_ICONS,
    SHAPE_NAMES,
    SHAPE_ICONS,
    formatCOP,
    calcTotal,
    orderSummaryText,
    sanitizeOrder,
    flavorColor,
    flavorEmoji,
    toppingEmoji,
    flavorIcon,
    toppingIcon,
    shapeIcon,
    emojiHtml,
    iconHtml,
    chipIconHtml,
};
