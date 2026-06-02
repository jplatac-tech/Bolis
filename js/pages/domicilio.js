let map = null;
let routeLayer = null;
let destMarker = null;

document.addEventListener('DOMContentLoaded', () => {
    const { loadOrder, saveOrder } = CheBolisOrder;
    const { STORE, getPlan, SHAPE_NAMES, formatCOP, calcTotal, FLAVOR_LABELS, TOPPING_LABELS } = CheBolisCore;
    let order = loadOrder();

    if (!order.flavors?.length) {
        document.getElementById('domicilio-guard')?.classList.add('is-visible');
    }

    renderOrderMini(order, SHAPE_NAMES, formatCOP, calcTotal);

    const addressInput = document.getElementById('delivery-address');
    if (addressInput && order.address) addressInput.value = order.address;

    initMap(STORE);

    if (order.deliveryCalculated) {
        enablePaymentButton();
        if (order.etaMinutes != null) {
            document.getElementById('delivery-eta').textContent = `${order.etaMinutes} min`;
        }
        if (order.distanceKm != null) {
            document.getElementById('delivery-distance').textContent = `${order.distanceKm.toFixed(1)} km`;
        }
        setStatus('Ruta guardada. Puedes continuar al pago o cambiar la dirección.', 'ok');
    }

    document.getElementById('btn-calc-route')?.addEventListener('click', () =>
        calculateDelivery(order, saveOrder, STORE)
    );

    document.getElementById('btn-go-payment')?.addEventListener('click', () => {
        if (!order.deliveryCalculated) {
            alert('Primero calcula la ruta con tu dirección.');
            return;
        }
        window.location.href = 'pago.html';
    });
});

function renderOrderMini(order, SHAPE_NAMES, formatCOP, calcTotal) {
    const el = document.getElementById('domicilio-order-mini');
    if (!el || !order.flavors?.length) return;

    const flavors = order.flavors.map((f) => FLAVOR_LABELS[f] || f).join(', ');
    const tops =
        order.toppings.length > 0
            ? order.toppings.map((t) => TOPPING_LABELS[t] || t).join(', ')
            : 'sin toppings';

    const planName = getPlan(order.plan).name;
    el.innerHTML = `<strong>Tu pedido:</strong> ${order.quantity}× ${planName} · ${SHAPE_NAMES[order.shape] || order.shape} · ${flavors} · ${tops} · <strong>${formatCOP(calcTotal(order))}</strong>`;
}

function setStatus(text, type) {
    const statusEl = document.getElementById('delivery-status');
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.className = 'flow-status';
    if (type === 'ok') statusEl.classList.add('flow-status--ok');
    else if (type === 'warn') statusEl.classList.add('flow-status--warn');
    else statusEl.classList.add('flow-status--muted');
}

function enablePaymentButton() {
    const btnPay = document.getElementById('btn-go-payment');
    if (btnPay) btnPay.disabled = false;
}

function initMap(STORE) {
    const mapEl = document.getElementById('delivery-map');
    if (!mapEl || typeof L === 'undefined') return;

    map = L.map('delivery-map', { scrollWheelZoom: false }).setView([STORE.lat, STORE.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
    }).addTo(map);

    const storeIcon = L.divIcon({
        className: 'store-marker',
        html: '<div style="background:#e91e8c;color:#fff;padding:5px 10px;border-radius:8px;font-weight:800;font-size:11px;box-shadow:0 2px 8px rgba(0,0,0,.2);">Che Bolis</div>',
        iconSize: [72, 28],
        iconAnchor: [36, 28],
    });

    L.marker([STORE.lat, STORE.lng], { icon: storeIcon })
        .addTo(map)
        .bindPopup(`<b>${STORE.name}</b><br>${STORE.address}`);

    setTimeout(() => map.invalidateSize(), 200);
}

async function calculateDelivery(order, saveOrder, STORE) {
    const addressInput = document.getElementById('delivery-address');

    if (!addressInput?.value.trim()) {
        setStatus('Escribe tu dirección de entrega.', 'warn');
        return;
    }

    setStatus('Calculando ruta...', 'muted');

    let dest = await geocodeAddress(addressInput.value.trim());

    if (!dest) {
        const jitter = () => (Math.random() - 0.5) * 0.08;
        dest = {
            lat: STORE.lat + jitter(),
            lng: STORE.lng + jitter(),
            display: addressInput.value.trim(),
        };
        setStatus('Dirección registrada. Mostramos una ruta estimada en el mapa.', 'ok');
    } else {
        setStatus('Ruta lista hacia tu zona.', 'ok');
    }

    const km = haversineKm(STORE.lat, STORE.lng, dest.lat, dest.lng);
    const minutes = estimateDeliveryMinutes(km);

    document.getElementById('delivery-eta').textContent = `${minutes} min`;
    document.getElementById('delivery-distance').textContent = `${km.toFixed(1)} km`;

    if (map) {
        if (routeLayer) map.removeLayer(routeLayer);
        if (destMarker) map.removeLayer(destMarker);

        routeLayer = L.polyline(generateRoutePoints([STORE.lat, STORE.lng], [dest.lat, dest.lng]), {
            color: '#e91e8c',
            weight: 5,
            opacity: 0.9,
            dashArray: '10, 8',
        }).addTo(map);

        destMarker = L.marker([dest.lat, dest.lng])
            .addTo(map)
            .bindPopup(`<b>Tu entrega</b><br>${dest.display}`);

        map.fitBounds(routeLayer.getBounds().pad(0.12));
        setTimeout(() => map.invalidateSize(), 100);
    }

    order.address = addressInput.value.trim();
    order.deliveryCalculated = true;
    order.etaMinutes = minutes;
    order.distanceKm = km;
    saveOrder(order);
    enablePaymentButton();
}

function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function generateRoutePoints(from, to, steps = 24) {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        pts.push([
            from[0] + (to[0] - from[0]) * t + Math.sin(t * Math.PI) * 0.002,
            from[1] + (to[1] - from[1]) * t + Math.cos(t * Math.PI * 2) * 0.001,
        ]);
    }
    return pts;
}

function estimateDeliveryMinutes(km) {
    return Math.round(15 + km * 4 + Math.random() * 5);
}

async function geocodeAddress(query) {
    const url =
        'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
        encodeURIComponent(`${query}, ${CheBolisCore.DELIVERY_CITY}, Colombia`);
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    const data = await res.json();
    if (data?.[0]) {
        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            display: data[0].display_name,
        };
    }
    return null;
}
