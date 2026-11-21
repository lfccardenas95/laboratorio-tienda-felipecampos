/* Página de pago: envío (add_shipping_info) y pago (add_payment_info) */
(function () {
  var PAISES = ["Colombia", "Estados Unidos", "México", "España", "Chile", "Perú", "Ecuador", "Canadá"];
  var TARIFAS = {
    Nacional: { "Estándar": 12000, "Express": 25000 },
    Internacional: { "Estándar": 95000, "Express": 160000 }
  };
  var ENVIO_GRATIS_NACIONAL = 150000; // envío estándar gratis en Colombia desde este valor

  var C, envio = null;

  function tipoCliente() {
    return document.getElementById("pais").value === "Colombia" ? "Nacional" : "Internacional";
  }
  function tipoEnvio() {
    return document.querySelector('input[name="envio"]:checked').value;
  }
  function costoEnvio(tipo, servicio) {
    if (tipo === "Nacional" && servicio === "Estándar" && C.total() >= ENVIO_GRATIS_NACIONAL) { return 0; }
    return TARIFAS[tipo][servicio];
  }
  function baseParams() {
    var p = { currency: "COP", value: C.total(), items: C.itemsGA() };
    if (C.cupon()) { p.coupon = C.cupon(); }
    return p;
  }

  function pintarResumen() {
    var lista = document.getElementById("lista-resumen");
    lista.innerHTML = "";
    C.lineas().forEach(function (l) {
      var li = document.createElement("li");
      li.textContent = l.cantidad + " × " + l.producto.nombre;
      lista.appendChild(li);
    });
    var tipo = tipoCliente();
    document.querySelectorAll("[data-costo]").forEach(function (el) {
      var c = costoEnvio(tipo, el.getAttribute("data-costo"));
      el.textContent = c === 0 ? "Gratis" : window.formatoCOP(c);
    });
    var costo = costoEnvio(tipo, tipoEnvio());
    document.getElementById("r-subtotal").textContent = window.formatoCOP(C.subtotal());
    document.getElementById("r-descuento").textContent = C.descuento() ? "−" + window.formatoCOP(C.descuento()) : window.formatoCOP(0);
    document.getElementById("r-envio").textContent = costo === 0 ? "Gratis" : window.formatoCOP(costo);
    document.getElementById("r-total").textContent = window.formatoCOP(C.total() + costo);
  }

  document.addEventListener("DOMContentLoaded", function () {
    C = window.Carrito;
    if (!C.lineas().length) {
      document.getElementById("vacio").classList.remove("oculto");
      document.getElementById("pasos").classList.add("oculto");
      return;
    }

    var selector = document.getElementById("pais");
    PAISES.forEach(function (p) {
      var op = document.createElement("option");
      op.value = p; op.textContent = p;
      selector.appendChild(op);
    });
    selector.addEventListener("change", pintarResumen);
    document.querySelectorAll('input[name="envio"]').forEach(function (r) { r.addEventListener("change", pintarResumen); });
    pintarResumen();

    window.Analitica.evento("begin_checkout", baseParams());

    document.getElementById("paso-envio").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var tipo = tipoCliente();
      var servicio = tipoEnvio();
      envio = {
        pais: selector.value,
        tipo_cliente: tipo,
        servicio: servicio,
        tier: tipo + " - " + servicio,
        costo: costoEnvio(tipo, servicio)
      };
      window.Analitica.tipoCliente(tipo);
      window.Analitica.evento("add_shipping_info", Object.assign(baseParams(), { shipping_tier: envio.tier }));

      document.getElementById("paso-pago").classList.remove("bloqueado");
      document.getElementById("medios-pago").disabled = false;
      document.getElementById("pagar").disabled = false;
      document.getElementById("paso-pago").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    document.getElementById("paso-pago").addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!envio) { return; }
      var pago = document.querySelector('input[name="pago"]:checked').value;
      var pedido = {
        transaction_id: "TA-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random() * 1000),
        value: C.total(),
        shipping: envio.costo,
        coupon: C.cupon(),
        items: C.itemsGA(),
        pais: envio.pais,
        tipo_cliente: envio.tipo_cliente,
        shipping_tier: envio.tier,
        payment_type: pago,
        enviado: false
      };
      try { sessionStorage.setItem("tiendaAndinaPedido", JSON.stringify(pedido)); } catch (e) { /* sin almacenamiento */ }
      window.Analitica.eventoYIr("add_payment_info", Object.assign(baseParams(), { payment_type: pago }), "gracias.html");
    });
  });
})();
