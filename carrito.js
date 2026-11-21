/* Carrito de compras guardado en el navegador (localStorage) */
(function () {
  var CLAVE = "tiendaAndinaCarrito";
  var CLAVE_CUPON = "tiendaAndinaCupon";
  var CUPONES = { BIENVENIDA10: 0.10 };

  function leer() {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || []; } catch (e) { return []; }
  }
  function guardar(c) {
    try { localStorage.setItem(CLAVE, JSON.stringify(c)); } catch (e) { /* sin almacenamiento */ }
    actualizarContador();
  }
  function actualizarContador() {
    var n = leer().reduce(function (a, l) { return a + l.cantidad; }, 0);
    document.querySelectorAll("[data-contador-carrito]").forEach(function (el) { el.textContent = n; });
  }

  window.Carrito = {
    lineas: function () {
      return leer()
        .map(function (l) { return { producto: window.buscarProducto(l.id), cantidad: l.cantidad }; })
        .filter(function (l) { return l.producto && l.cantidad > 0; });
    },
    agregar: function (id, cantidad) {
      var c = leer();
      var l = c.find(function (x) { return x.id === id; });
      if (l) { l.cantidad += cantidad; } else { c.push({ id: id, cantidad: cantidad }); }
      guardar(c);
    },
    cambiar: function (id, cantidad) {
      var c = leer().map(function (x) { return x.id === id ? { id: id, cantidad: cantidad } : x; })
        .filter(function (x) { return x.cantidad > 0; });
      guardar(c);
    },
    quitar: function (id) {
      guardar(leer().filter(function (x) { return x.id !== id; }));
    },
    vaciar: function () {
      guardar([]);
      try { localStorage.removeItem(CLAVE_CUPON); } catch (e) { /* sin almacenamiento */ }
    },
    cupon: function () {
      try { return localStorage.getItem(CLAVE_CUPON) || ""; } catch (e) { return ""; }
    },
    aplicarCupon: function (codigo) {
      var c = String(codigo || "").trim().toUpperCase();
      if (!CUPONES[c]) { return false; }
      try { localStorage.setItem(CLAVE_CUPON, c); } catch (e) { /* sin almacenamiento */ }
      return true;
    },
    tasaDescuento: function () { return CUPONES[this.cupon()] || 0; },
    subtotal: function () {
      return this.lineas().reduce(function (a, l) { return a + l.producto.precio * l.cantidad; }, 0);
    },
    descuento: function () {
      var tasa = this.tasaDescuento();
      return this.lineas().reduce(function (a, l) { return a + Math.round(l.producto.precio * tasa) * l.cantidad; }, 0);
    },
    total: function () { return this.subtotal() - this.descuento(); },
    // Ítems con el formato que exige GA4
    itemsGA: function () {
      var tasa = this.tasaDescuento();
      var cupon = this.cupon();
      return this.lineas().map(function (l, i) { return window.itemGA(l.producto, l.cantidad, i, tasa, cupon); });
    }
  };

  window.itemGA = function (p, cantidad, indice, tasa, cupon) {
    var item = {
      item_id: p.id,
      item_name: p.nombre,
      item_brand: window.MARCA,
      item_category: p.categoria,
      price: p.precio,
      quantity: cantidad || 1,
      index: indice || 0
    };
    if (tasa) {
      // GA4: price = precio unitario con descuento; discount = descuento por unidad
      item.discount = Math.round(p.precio * tasa);
      item.price = p.precio - item.discount;
    }
    if (cupon) { item.coupon = cupon; }
    return item;
  };

  document.addEventListener("DOMContentLoaded", actualizarContador);
})();
