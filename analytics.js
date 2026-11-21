/* =====================================================================
   Medición con Google Analytics 4 (gtag.js) + monitor de eventos
   No necesitas editar este archivo: el ID se configura en js/config.js
   ===================================================================== */
(function () {
  var cfg = window.TIENDA_CONFIG || {};
  var id = String(cfg.GA_MEASUREMENT_ID || "").trim().toUpperCase();
  var activa = /^G-[A-Z0-9]{4,}$/.test(id) && id !== "G-XXXXXXXXXX";

  // ---- Etiqueta de Google (gtag.js) -----------------------------------
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };

  if (activa) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.gtag("js", new Date());
    var conf = {};
    if (cfg.DEBUG_MODE) { conf.debug_mode = true; }
    window.gtag("config", id, conf); // envía page_view automáticamente
  }

  // ---- Registro local para el monitor de eventos -----------------------
  var LOG = "tiendaAndinaEventos";
  var ORIGEN = "tiendaAndinaOrigen";
  var PANEL = "tiendaAndinaPanel";

  function leer(clave, porDefecto) {
    try { var v = JSON.parse(sessionStorage.getItem(clave)); return v === null ? porDefecto : v; }
    catch (e) { return porDefecto; }
  }
  function escribir(clave, valor) {
    try { sessionStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento */ }
  }

  // Guarda la fuente de la primera página de la visita (parámetros UTM)
  (function capturarOrigen() {
    if (leer(ORIGEN, null)) { return; }
    var q = new URLSearchParams(location.search);
    var origen = {
      source: q.get("utm_source") || "",
      medium: q.get("utm_medium") || "",
      campaign: q.get("utm_campaign") || "",
      referrer: document.referrer ? new URL(document.referrer).hostname : ""
    };
    escribir(ORIGEN, origen);
  })();

  function fmt(n) { return typeof n === "number" ? window.formatoCOP(n) : ""; }

  function resumir(nombre, p) {
    var items = p.items || [];
    var primero = items[0] ? items[0].item_name : "";
    switch (nombre) {
      case "page_view": return location.pathname.replace(/^\//, "") || "index.html";
      case "view_item_list": return items.length + " productos · " + (p.item_list_name || "");
      case "select_item": return primero;
      case "view_item": return primero + " · " + fmt(p.value);
      case "add_to_cart":
      case "remove_from_cart": return primero + " × " + (items[0] ? items[0].quantity : 1) + " · " + fmt(p.value);
      case "view_cart": return items.length + " productos · " + fmt(p.value);
      case "view_promotion":
      case "select_promotion": return p.promotion_name || "";
      case "begin_checkout": return fmt(p.value) + (p.coupon ? " · cupón " + p.coupon : "");
      case "add_shipping_info": return p.shipping_tier + " · " + fmt(p.value);
      case "add_payment_info": return p.payment_type + " · " + fmt(p.value);
      case "purchase": return p.transaction_id + " · " + fmt(p.value);
      default: return "";
    }
  }

  function registrar(nombre, p) {
    var log = leer(LOG, []);
    log.push({ t: Date.now(), nombre: nombre, resumen: resumir(nombre, p || {}) });
    escribir(LOG, log.slice(-40));
    pintar();
  }

  // ---- API que usan las páginas de la tienda ---------------------------
  window.Analitica = {
    activa: activa,
    id: id,
    evento: function (nombre, params) {
      var p = Object.assign({}, params || {});
      if (activa) { window.gtag("event", nombre, p); }
      registrar(nombre, p);
    },
    // Envía el evento y luego navega (da tiempo a que el evento salga)
    eventoYIr: function (nombre, params, url) {
      var fuera = false;
      function ir() { if (!fuera) { fuera = true; location.href = url; } }
      var p = Object.assign({}, params || {});
      registrar(nombre, p);
      if (activa) {
        p.event_callback = ir;
        p.event_timeout = 1000;
        window.gtag("event", nombre, p);
        setTimeout(ir, 1200);
      } else {
        setTimeout(ir, 150);
      }
    },
    tipoCliente: function (tipo) {
      if (activa) { window.gtag("set", "user_properties", { tipo_cliente: tipo }); }
    }
  };

  // ---- Nuevo visitante: borra las cookies de GA4 y el estado local ----
  function nuevoVisitante() {
    var host = location.hostname;
    var partes = host.split(".");
    var dominios = ["", host, "." + host];
    for (var i = 1; i < partes.length - 1; i++) { dominios.push("." + partes.slice(i).join(".")); }
    document.cookie.split(";").forEach(function (c) {
      var n = c.split("=")[0].trim();
      if (n.indexOf("_ga") === 0) {
        dominios.forEach(function (d) {
          document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
        });
      }
    });
    try {
      localStorage.removeItem("tiendaAndinaCarrito");
      localStorage.removeItem("tiendaAndinaCupon");
      sessionStorage.clear();
    } catch (e) { /* sin almacenamiento */ }
    location.href = "index.html";
  }

  // ---- Monitor de eventos (panel flotante) ------------------------------
  var panel;
  function pintar() {
    if (!panel) { return; }
    var lista = panel.querySelector(".monitor-lista");
    var log = leer(LOG, []).slice(-12).reverse();
    lista.innerHTML = "";
    if (!log.length) {
      lista.innerHTML = '<li class="monitor-vacio">Aún no hay eventos.</li>';
      return;
    }
    log.forEach(function (e) {
      var li = document.createElement("li");
      var hora = new Date(e.t).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
      li.innerHTML = '<span class="monitor-hora"></span><code class="monitor-evento"></code><span class="monitor-detalle"></span>';
      li.querySelector(".monitor-hora").textContent = hora;
      li.querySelector(".monitor-evento").textContent = e.nombre;
      li.querySelector(".monitor-detalle").textContent = e.resumen;
      lista.appendChild(li);
    });
  }

  function crearPanel() {
    panel = document.createElement("aside");
    panel.className = "monitor";
    panel.setAttribute("aria-label", "Monitor de eventos de GA4");
    var origen = leer(ORIGEN, {});
    var fuente = origen.source
      ? origen.source + " / " + (origen.medium || "(sin medio)") + (origen.campaign ? " · " + origen.campaign : "")
      : (origen.referrer ? "referencia: " + origen.referrer : "directo (sin UTM)");
    panel.innerHTML =
      '<div class="monitor-cabecera">' +
        '<strong>Monitor de eventos GA4</strong>' +
        '<button type="button" class="monitor-plegar" aria-expanded="true">Ocultar</button>' +
      "</div>" +
      '<div class="monitor-cuerpo">' +
        '<p class="monitor-estado"></p>' +
        '<p class="monitor-origen"></p>' +
        '<ol class="monitor-lista"></ol>' +
        '<button type="button" class="monitor-nuevo">Simular nuevo visitante</button>' +
      "</div>";
    var estado = panel.querySelector(".monitor-estado");
    if (activa) {
      estado.textContent = "Conectado a " + id + (cfg.DEBUG_MODE ? " · modo depuración" : "");
      estado.classList.add("ok");
    } else {
      estado.textContent = "Sin ID de medición: los eventos solo se muestran aquí. Edita js/config.js.";
      estado.classList.add("alerta");
    }
    panel.querySelector(".monitor-origen").textContent = "Origen de la visita: " + fuente;
    var cuerpo = panel.querySelector(".monitor-cuerpo");
    var boton = panel.querySelector(".monitor-plegar");
    function aplicar(abierto) {
      cuerpo.hidden = !abierto;
      panel.classList.toggle("plegado", !abierto);
      document.body.classList.toggle("con-monitor", abierto);
      boton.textContent = abierto ? "Ocultar" : "Mostrar";
      boton.setAttribute("aria-expanded", String(abierto));
      try { localStorage.setItem(PANEL, abierto ? "1" : "0"); } catch (e) { /* sin almacenamiento */ }
    }
    var guardado = null;
    try { guardado = localStorage.getItem(PANEL); } catch (e) { /* sin almacenamiento */ }
    aplicar(guardado !== "0");
    boton.addEventListener("click", function () { aplicar(cuerpo.hidden); });
    panel.querySelector(".monitor-nuevo").addEventListener("click", nuevoVisitante);
    document.body.appendChild(panel);
    pintar();
  }

  document.addEventListener("DOMContentLoaded", function () {
    registrar("page_view", {});
    crearPanel();
  });
})();
