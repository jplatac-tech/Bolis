document.addEventListener('DOMContentLoaded', () => {
    const { loadOrder, saveOrder, clearOrder } = CheBolisOrder;
    const { formatCOP, calcTotal, getPlan, SHAPE_NAMES, FLAVOR_LABELS, TOPPING_LABELS, sanitizeOrder, validateOrderForPlan } =
        CheBolisCore;
    const { openWhatsAppOrder, getWhatsAppUrl } = CheBolisWhatsApp;

    let order = sanitizeOrder(loadOrder());

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

    document.getElementById('card-number')?.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
        e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
    });

    document.getElementById('card-exp')?.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
        e.target.value = v;
    });

    document.getElementById('card-cvv')?.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });

    document.getElementById('payment-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('card-name')?.value.trim();
        const card = document.getElementById('card-number')?.value.replace(/\s/g, '') || '';
        const exp = document.getElementById('card-exp')?.value.trim();
        const cvv = document.getElementById('card-cvv')?.value.trim();

        if (!name) {
            alert('Escribe el nombre en la tarjeta.');
            return;
        }

        if (card.length < 15) {
            alert('Ingresa un número de tarjeta válido.');
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(exp)) {
            alert('Ingresa la fecha de vencimiento (MM/AA).');
            return;
        }

        if (cvv.length < 3) {
            alert('Ingresa el CVV de la tarjeta.');
            return;
        }

        if (!order.deliveryCalculated || !order.address) {
            alert('Primero configura la dirección de entrega en Domicilio.');
            return;
        }

        order = sanitizeOrder(order);
        const planErrors = validateOrderForPlan(order);
        if (planErrors.length) {
            alert(`${planErrors.join('\n')}\n\nVuelve a Armar Bolizada.`);
            return;
        }

        order.customerName = name;
        saveOrder(order);

        const orderId = 'CB-' + Date.now().toString(36).toUpperCase();
        const customer = { name };

        openWhatsAppOrder(order, orderId, customer);

        document.getElementById('payment-form-wrap')?.classList.add('is-hidden');
        const success = document.getElementById('payment-success');
        success?.classList.add('is-visible');
        document.getElementById('payment-order-id').textContent = orderId;

        const resend = document.getElementById('btn-whatsapp-resend');
        if (resend) {
            resend.href = getWhatsAppUrl(order, orderId, customer);
        }

        clearOrder();
    });
});
