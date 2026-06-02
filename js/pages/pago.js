document.addEventListener('DOMContentLoaded', () => {
    const { loadOrder, clearOrder } = CheBolisOrder;
    const { formatCOP, calcTotal, getPlan, SHAPE_NAMES, FLAVOR_LABELS, TOPPING_LABELS } = CheBolisCore;
    const order = loadOrder();

    if (!order.flavors?.length) {
        document.getElementById('pago-guard')?.classList.add('is-visible');
        return;
    }

    document.getElementById('recap-plan').textContent = getPlan(order.plan).name;
    document.getElementById('recap-shape').textContent = SHAPE_NAMES[order.shape] || order.shape;
    document.getElementById('recap-flavors').textContent = order.flavors
        .map((f) => FLAVOR_LABELS[f] || f)
        .join(', ');
    document.getElementById('recap-toppings').textContent = order.toppings.length
        ? order.toppings.map((t) => TOPPING_LABELS[t] || t).join(', ')
        : 'Ninguno';
    document.getElementById('recap-qty').textContent = String(order.quantity);
    document.getElementById('pay-order-total').textContent = formatCOP(calcTotal(order));

    const del = document.getElementById('pago-delivery-info');
    if (del && order.deliveryCalculated && order.address) {
        del.hidden = false;
        del.innerHTML = `<i class="bi bi-truck"></i> <strong>Entrega:</strong> ${order.address} · ~${order.etaMinutes} min · ${order.distanceKm?.toFixed(1)} km`;
    }

    document.getElementById('payment-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const card = document.getElementById('card-number')?.value.replace(/\s/g, '');
        const name = document.getElementById('card-name')?.value.trim();

        if (!name || !card || card.length < 13) {
            alert('Completa los datos de tu tarjeta para continuar.');
            return;
        }

        document.getElementById('payment-form-wrap')?.classList.add('is-hidden');
        const success = document.getElementById('payment-success');
        success?.classList.add('is-visible');
        document.getElementById('payment-order-id').textContent =
            'CB-' + Date.now().toString(36).toUpperCase();
        clearOrder();
    });

    document.getElementById('card-number')?.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
        e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
    });
});
