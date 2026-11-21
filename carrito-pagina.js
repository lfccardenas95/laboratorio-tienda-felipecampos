/* Página del carrito */
(function () {
  var C;

  function pintar() {
    var lineas = C.lineas();
    var vacio = lineas.length === 0;
    document.getElementById("vacio").classList.toggle("oculto", !vacio);
    document.getElementById("con-productos").classList.toggle("oculto", vacio);
    if (vacio) { return; }

    var cuerpo = document.getElementById("lineas");
    cuerpo.innerHTML = "";
    lineas.forEach(function (l) {
      var p = l.producto;
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td class="col-producto"><span class="punto" style="background:' + p.color + '"></span><span class="nombre"></span></td>' +
        '<td class="precio-unit"></td>' +
        '<td><input type="number" min="0" max="10" class="cantidad"></td>' +
        '<td class="subtotal"></td>' +
        '<td><button type="button" class="enlace-boton">Quitar</button></td>';
      tr.querySelector(".nombre").textContent = p.nombre;
      tr.querySelector(".precio-unit").textContent = window.formatoCOP(p.precio);
      tr.querySelector(".subtotal").textContent = window.formatoCOP(p.precio * l.cantidad);
      var campo = tr.querySelector(".cantidad");
      campo.value = l.cantidad;

      campo.addEventListener("change", function () {
        var nueva = Math.max(0, Math.min(10, parseInt(campo.value, 10) || 0));
        var diferencia = nueva - l.cantidad;
        if (diferencia === 0) { return; }
        var tasa = C.tasaDescuento();
        var item = window.itemGA(p, Math.abs(diferencia), 0, tasa, C.cupon());
        C.cambiar(p.id, nueva);
        window.Analitica.evento(diferencia > 0 ? "add_to_cart" : "remove_from_cart", {
          currency: "COP",
          value: item.price * Math.abs(diferencia),
          items: [item]
        });
        pintar();
      });

      tr.querySelector(".enlace-boton").addEventListener("click", function () {
        var item = window.itemGA(p, l.cantidad, 0, C.tasaDescuento(), C.cupon());
        C.quitar(p.id);
        window.Analitica.evento("remove_from_cart", {
          currency: "COP",
          value: item.price * l.cantidad,
          items: [item]
        });
        pintar();
      });
      cuerpo.appendChild(tr);
    });

    document.getElementById("r-subtotal").textContent = window.formatoCOP(C.subtotal());
    document.getElementById("r-descuento").textContent = C.descuento() ? "−" + window.formatoCOP(C.descuento()) : window.formatoCOP(0);
    document.getElementById("r-total").textContent = window.formatoCOP(C.total());
    var msg = document.getElementById("mensaje-cupon");
    if (C.cupon()) { msg.textContent = "Cupón " + C.cupon() + " aplicado."; msg.className = "mensaje-cupon ok"; }
  }

  document.addEventListener("DOMContentLoaded", function () {
    C = window.Carrito;
    pintar();

    if (C.lineas().length) {
      var params = { currency: "COP", value: C.total(), items: C.itemsGA() };
      if (C.cupon()) { params.coupon = C.cupon(); }
      window.Analitica.evento("view_cart", params);
    }

    document.getElementById("form-cupon").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var codigo = document.getElementById("codigo-cupon").value;
      var msg = document.getElementById("mensaje-cupon");
      if (C.aplicarCupon(codigo)) {
        pintar();
      } else {
        msg.textContent = "Cupón no válido.";
        msg.className = "mensaje-cupon error";
      }
    });
  });
})();
