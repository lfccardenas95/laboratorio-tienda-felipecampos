/* Página de inicio: catálogo y promoción */
(function () {
  var LISTA = { item_list_id: "catalogo_principal", item_list_name: "Catálogo principal" };
  var PROMO = {
    promotion_id: "BIENVENIDA10",
    promotion_name: "10 % de bienvenida",
    creative_name: "banner_bienvenida",
    creative_slot: "inicio_superior"
  };

  function itemDeLista(p, i) {
    return Object.assign(window.itemGA(p, 1, i), LISTA);
  }

  function tarjeta(p, i) {
    var art = document.createElement("article");
    art.className = "tarjeta";
    art.innerHTML =
      '<a class="tarjeta-enlace" href="producto.html?id=' + p.id + '">' +
        '<div class="miniatura" style="background:' + p.color + '"><span>' + p.sigla + "</span></div>" +
        '<p class="categoria"></p><h3></h3><p class="precio"></p>' +
      "</a>" +
      '<button type="button" class="boton">Agregar al carrito</button>';
    art.querySelector(".categoria").textContent = p.categoria;
    art.querySelector("h3").textContent = p.nombre;
    art.querySelector(".precio").textContent = window.formatoCOP(p.precio);

    art.querySelector(".tarjeta-enlace").addEventListener("click", function (ev) {
      ev.preventDefault();
      window.Analitica.eventoYIr("select_item", Object.assign({ items: [itemDeLista(p, i)] }, LISTA),
        "producto.html?id=" + encodeURIComponent(p.id));
    });

    art.querySelector(".boton").addEventListener("click", function (ev) {
      window.Carrito.agregar(p.id, 1);
      window.Analitica.evento("add_to_cart", {
        currency: "COP",
        value: p.precio,
        items: [itemDeLista(p, i)]
      });
      ev.target.textContent = "Agregado";
      setTimeout(function () { ev.target.textContent = "Agregar al carrito"; }, 1200);
    });
    return art;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var grilla = document.getElementById("catalogo");
    window.PRODUCTOS.forEach(function (p, i) { grilla.appendChild(tarjeta(p, i)); });

    window.Analitica.evento("view_item_list", Object.assign({
      items: window.PRODUCTOS.map(itemDeLista)
    }, LISTA));

    var destacado = window.itemGA(window.PRODUCTOS[0], 1, 0);
    window.Analitica.evento("view_promotion", Object.assign({ items: [destacado] }, PROMO));

    document.getElementById("usar-cupon").addEventListener("click", function () {
      window.Carrito.aplicarCupon("BIENVENIDA10");
      window.Analitica.eventoYIr("select_promotion", Object.assign({ items: [destacado] }, PROMO), "carrito.html");
    });
  });
})();
