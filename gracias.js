/* Página de confirmación: evento purchase (una sola vez por pedido) */
(function () {
  var CLAVE = "tiendaAndinaPedido";

  document.addEventListener("DOMContentLoaded", function () {
    var pedido = null;
    try { pedido = JSON.parse(sessionStorage.getItem(CLAVE)); } catch (e) { pedido = null; }

    if (!pedido || pedido.enviado) {
      document.getElementById("sin-pedido").classList.remove("oculto");
      return;
    }

    var params = {
      transaction_id: pedido.transaction_id,
      affiliation: "Tienda Andina (simulación)",
      currency: "COP",
      value: pedido.value,
      shipping: pedido.shipping,
      tipo_cliente: pedido.tipo_cliente,
      items: pedido.items
    };
    if (pedido.coupon) { params.coupon = pedido.coupon; }
    window.Analitica.tipoCliente(pedido.tipo_cliente);
    window.Analitica.evento("purchase", params);

    // Evita enviar el mismo pedido dos veces si se recarga la página
    pedido.enviado = true;
    try { sessionStorage.setItem(CLAVE, JSON.stringify(pedido)); } catch (e) { /* sin almacenamiento */ }
    window.Carrito.vaciar();

    document.getElementById("c-id").textContent = pedido.transaction_id;
    document.getElementById("c-valor").textContent = window.formatoCOP(pedido.value);
    document.getElementById("c-envio").textContent = pedido.shipping ? window.formatoCOP(pedido.shipping) : "Gratis";
    document.getElementById("c-destino").textContent = pedido.pais + " (" + pedido.tipo_cliente + ")";
    document.getElementById("c-pago").textContent = pedido.payment_type;
    document.getElementById("c-total").textContent = window.formatoCOP(pedido.value + pedido.shipping);
    document.getElementById("confirmacion").classList.remove("oculto");
  });
})();
