/**
 * Envío del pedido a WhatsApp de Che Bolis (sin servidor).
 */
(function () {
    /** +57 300 4066736 */
    const WHATSAPP_PHONE = '573004066736';

    function normalizePhoneCO(raw) {
        const digits = String(raw || '').replace(/\D/g, '');
        if (digits.length === 10 && digits.startsWith('3')) return `57${digits}`;
        if (digits.length === 12 && digits.startsWith('57')) return digits;
        return digits;
    }

    function formatPhoneDisplay(digits) {
        if (digits.length === 12 && digits.startsWith('57')) {
            return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
        }
        return digits;
    }

    function isValidCustomerPhone(raw) {
        const n = normalizePhoneCO(raw);
        return n.length === 12 && n.startsWith('573');
    }

    function buildOrderMessage(order, orderId, customer) {
        const { getPlan, formatCOP, calcTotal, SHAPE_NAMES, FLAVOR_LABELS, TOPPING_LABELS } =
            CheBolisCore;

        const plan = getPlan(order.plan);
        const flavors = order.flavors.map((f) => FLAVOR_LABELS[f] || f).join(', ');
        const toppings = order.toppings.length
            ? order.toppings.map((t) => TOPPING_LABELS[t] || t).join(', ')
            : 'Ninguno';

        const lines = [
            '🍧 *Resumen de pedido — Che Bolis*',
            '',
            `*Pedido:* ${orderId}`,
            `*Combo:* ${plan.name}`,
            `*Forma:* ${SHAPE_NAMES[order.shape] || order.shape}`,
            `*Sabores:* ${flavors}`,
            `*Toppings:* ${toppings}`,
            `*Cantidad:* ${order.quantity}`,
            `*Total:* ${formatCOP(calcTotal(order))}`,
        ];

        if (order.address) {
            lines.push('', '*Dirección de entrega:*', order.address);
            if (order.deliveryCalculated && order.etaMinutes != null) {
                lines.push(
                    `*Tiempo est.:* ~${order.etaMinutes} min · ${order.distanceKm?.toFixed(1) ?? '—'} km`
                );
            }
        }

        if (customer?.name) {
            lines.push('', `*Cliente:* ${customer.name}`);
        }
        if (customer?.phone) {
            lines.push(`*WhatsApp cliente:* ${formatPhoneDisplay(normalizePhoneCO(customer.phone))}`);
        }

        lines.push('', '_Pedido desde la web Che Bolis_');
        return lines.join('\n');
    }

    function getWhatsAppUrl(order, orderId, customer) {
        const text = buildOrderMessage(order, orderId, customer);
        return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    }

    function openWhatsAppOrder(order, orderId, customer) {
        const url = getWhatsAppUrl(order, orderId, customer);
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    window.CheBolisWhatsApp = {
        WHATSAPP_PHONE,
        normalizePhoneCO,
        isValidCustomerPhone,
        buildOrderMessage,
        getWhatsAppUrl,
        openWhatsAppOrder,
    };
})();
