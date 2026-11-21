/* Página de detalle de producto */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var id = new URLSearchParams(location.search).get("id");
    var p = window.buscarProducto(id);
    if (!p) {
      document.getElementById("detalle").classList.add("oculto");
      document.getElementById("no-encontrado").classList.remove("oculto");
      return;
    }

    document.title = p.nombre + " · Tienda Andina";
    document.getElementById("migas-nombre").textContent = p.nombre;
    document.getElementById("detalle-miniatura").style.background = p.color;
    document.getElementById("detalle-sigla").textContent = p.sigla;
    document.getElementById("detalle-categoria").textContent = p.categoria;
    document.getElementById("detalle-nombre").textContent = p.nombre;
    document.getElementById("detalle-precio").textContent = window.formatoCOP(p.precio);
    document.getElementById("detalle-descripcion").textContent = p.descripcion;

    window.Analitica.evento("view_item", {
      currency: "COP",
      value: p.precio,
      items: [window.itemGA(p, 1, 0)]
    });

    document.getElementById("agregar").addEventListener("click", function () {
      var campo = document.getElementById("cantidad");
      var cantidad = Math.max(1, Math.min(10, parseInt(campo.value, 10) || 1));
      campo.value = cantidad;
      window.Carrito.agregar(p.id, cantidad);
      window.Analitica.evento("add_to_cart", {
        currency: "COP",
        value: p.precio * cantidad,
        items: [window.itemGA(p, cantidad, 0)]
      });
      document.getElementById("aviso").classList.remove("oculto");
    });
  });
})();
