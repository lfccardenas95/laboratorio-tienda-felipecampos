# Tienda Andina · laboratorio de Google Analytics 4

Tienda en línea **ficticia** para practicar la medición de comercio electrónico con Google Analytics 4 (GA4).
Diplomado en E-commerce y Negocios Internacionales Digitales.

No usa servidor, base de datos ni pagos reales: son páginas HTML que se publican gratis en Vercel.

## Qué mide

| Momento del recorrido | Evento GA4 |
| --- | --- |
| Ver el catálogo | `view_item_list`, `view_promotion` |
| Hacer clic en un producto o en el banner | `select_item`, `select_promotion` |
| Ver el detalle de un producto | `view_item` |
| Agregar o quitar del carrito | `add_to_cart`, `remove_from_cart` |
| Ver el carrito | `view_cart` |
| Iniciar el pago | `begin_checkout` |
| Elegir el envío | `add_shipping_info` (`shipping_tier`: Nacional o Internacional, Estándar o Express) |
| Elegir el medio de pago | `add_payment_info` (`payment_type`) |
| Confirmar la compra | `purchase` (`transaction_id`, `value`, `shipping`, `coupon`, `tipo_cliente`) |

Todos los valores van en pesos colombianos (`currency: "COP"`). El cupón `BIENVENIDA10` aplica 10 % de descuento.

## Cómo usarla

1. Crea tu copia con **Use this template → Create a new repository** (o sube estos archivos a un repositorio nuevo).
2. Importa el repositorio en Vercel (**Add New → Project → Import**). No cambies ninguna opción: es un sitio estático.
3. Crea una propiedad de GA4 con un flujo de datos web y copia el **ID de medición** (`G-…`).
4. Edita `js/config.js`, pega tu ID y guarda el cambio. Vercel publica la nueva versión en menos de un minuto.
5. Abre tu tienda: el **Monitor de eventos GA4** (abajo a la derecha) muestra cada evento enviado.
   Compruébalos en GA4, en **Informes → Tiempo real** y en **Administrar → Visualización de datos → DebugView**.

## Archivos

| Archivo | Para qué sirve |
| --- | --- |
| `js/config.js` | **El único que debes editar**: ID de medición y modo de depuración |
| `js/productos.js` | Catálogo de productos y precios |
| `js/analytics.js` | Carga GA4 (gtag.js) y dibuja el monitor de eventos |
| `js/carrito.js` | Carrito guardado en el navegador y formato de ítems para GA4 |
| `js/inicio.js`, `producto.js`, `carrito-pagina.js`, `checkout.js`, `gracias.js` | Eventos de cada página |

## Personalizar con un agente de IA

`AGENTS.md` contiene las reglas que un agente (Antigravity, Claude u otro) debe respetar al modificar la tienda: el contrato de medición de GA4 y la verificación después de cada cambio.

## Buenas prácticas

- Desactiva el bloqueador de anuncios para tu tienda: bloquea los envíos a GA4.
- No escribas datos personales reales en el formulario de pago.
- El botón **Simular nuevo visitante** borra las cookies de GA4 y el carrito: la siguiente visita cuenta como un usuario nuevo.
