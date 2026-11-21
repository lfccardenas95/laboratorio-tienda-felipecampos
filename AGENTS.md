# Reglas para agentes de IA (Antigravity, Claude, Cursor u otros)

Este proyecto es la tienda ficticia de un **laboratorio de Google Analytics 4 (GA4)**.
Puedes cambiar libremente la marca, los productos, los textos, los colores y el diseño.
**No rompas el contrato de medición**: si lo cambias, el laboratorio deja de funcionar.

## Arquitectura (no cambiar)

- Solo HTML, CSS y JavaScript puros. Sin frameworks, sin npm, sin paso de compilación.
  Vercel lo publica como sitio estático (Framework Preset: Other).
- `index.html` debe seguir en la raíz. Páginas: `index.html`, `producto.html?id=…`, `carrito.html`,
  `checkout.html`, `gracias.html`.
- `js/config.js` es el único archivo donde se configura el ID de medición (`GA_MEASUREMENT_ID`)
  y `DEBUG_MODE`. No muevas el ID a otro archivo ni lo escribas en el HTML.
- Orden de carga en cada página: `config.js`, `productos.js`, `carrito.js`, `analytics.js`, y luego el script de la página.
- Todos los eventos se envían con `window.Analitica.evento(nombre, params)` o
  `window.Analitica.eventoYIr(nombre, params, url)` cuando el clic cambia de página.
  Nunca llames `gtag('event', …)` directamente desde las páginas.

## Contrato de medición (no cambiar nombres ni parámetros)

Todos los eventos llevan `currency: "COP"`. Los ítems se construyen con `window.itemGA()`
(item_id, item_name, item_brand, item_category, price, quantity, index; con cupón: price con descuento,
discount por unidad y coupon).

| Evento | Cuándo | Parámetros clave |
| --- | --- | --- |
| view_item_list | Al cargar el catálogo | item_list_id, item_list_name, items |
| view_promotion | Al mostrar el banner del cupón | promotion_id, promotion_name, creative_name, creative_slot, items |
| select_promotion | Clic en el banner (aplica BIENVENIDA10 y va al carrito) | igual que view_promotion |
| select_item | Clic en un producto del catálogo, antes de navegar | item_list_id, item_list_name, items |
| view_item | Al abrir la ficha | value, items |
| add_to_cart | Agregar o aumentar unidades | value, items |
| remove_from_cart | Quitar o disminuir unidades | value, items |
| view_cart | Al abrir el carrito con productos | value, coupon, items |
| begin_checkout | Al abrir checkout.html | value, coupon, items |
| add_shipping_info | Clic en "Continuar al pago" | value, coupon, items, shipping_tier ("Nacional - Estándar", "Nacional - Express", "Internacional - Estándar", "Internacional - Express") |
| add_payment_info | Clic en "Pagar (simulado)" | value, coupon, payment_type, items |
| purchase | Al cargar gracias.html, una sola vez por pedido | transaction_id único, affiliation, value (sin envío), shipping, coupon, tipo_cliente, items |

- Mantén `gtag('set', 'user_properties', { tipo_cliente })` al confirmar el envío y antes de purchase.
- Mantén la protección contra compras duplicadas: el pedido se guarda en sessionStorage y se marca como enviado.
- Mantén el cupón `BIENVENIDA10` (10 %) y las tarifas de envío en COP: Nacional Estándar 12000 (gratis desde 150000),
  Nacional Express 25000, Internacional Estándar 95000, Internacional Express 160000. Los estudiantes las usan para
  verificar sus compras.
- Si cambias los productos, conserva 8 productos con id en formato ABC-001 y precios enteros en COP.

## Monitor de eventos (no quitar)

El panel lateral "Monitor de eventos GA4" de `js/analytics.js` es una ayuda didáctica: estado de conexión,
origen de la visita (UTM), últimos eventos y botón "Simular nuevo visitante". Puedes cambiar su estilo,
no su función.

## Privacidad

No pidas ni envíes datos personales (correo, teléfono, documento, tarjeta). El formulario de pago es simulado.

## Verificación obligatoria después de cada cambio

1. Sirve la carpeta localmente (por ejemplo, `python -m http.server 8000`) y ábrela en el navegador.
2. Recorre el flujo completo: catálogo → ficha → carrito con BIENVENIDA10 → checkout con envío internacional → pago.
3. Confirma en el monitor los 12 eventos, sin errores en la consola.
4. Confirma que el value de purchase es la suma de price × quantity de sus ítems.
5. Recarga gracias.html y confirma que no aparece un segundo purchase.
