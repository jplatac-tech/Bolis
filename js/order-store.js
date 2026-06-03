/**
 * Estado del pedido compartido entre páginas (sessionStorage)
 */
const ORDER_KEY = 'che_bolis_order';

const DEFAULT_ORDER = {
    plan: 'mini',
    shape: 'circle',
    flavors: ['maracuya'],
    toppings: [],
    quantity: 1,
    address: '',
    deliveryCalculated: false,
    etaMinutes: null,
    distanceKm: null,
    customerName: '',
    customerPhone: '',
};

function loadOrder() {
    try {
        const raw = sessionStorage.getItem(ORDER_KEY);
        const merged = raw ? { ...DEFAULT_ORDER, ...JSON.parse(raw) } : { ...DEFAULT_ORDER };
        if (window.CheBolisCore?.sanitizeOrder) {
            return CheBolisCore.sanitizeOrder(merged);
        }
        return merged;
    } catch {
        return { ...DEFAULT_ORDER };
    }
}

function saveOrder(order) {
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

function clearOrder() {
    sessionStorage.removeItem(ORDER_KEY);
}

window.CheBolisOrder = { loadOrder, saveOrder, clearOrder, DEFAULT_ORDER };
