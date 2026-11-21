/* =====================================================================
   CONFIGURACIÓN DE LA TIENDA — EL ÚNICO ARCHIVO QUE DEBES EDITAR
   ---------------------------------------------------------------------
   1. Crea tu propiedad de Google Analytics 4 y su flujo de datos web.
   2. Copia el "ID de medición" del flujo (empieza por G-).
   3. Reemplaza G-XXXXXXXXXX por tu ID, conservando las comillas.
   4. Guarda el cambio (Commit changes). Vercel publicará la tienda de
      nuevo en menos de un minuto.
   ===================================================================== */

window.TIENDA_CONFIG = {
  // Tu ID de medición de GA4. Ejemplo: "G-4B7Q2KZ9TR"
  GA_MEASUREMENT_ID: "G-XXXXXXXXXX",

  // true = los eventos aparecen también en DebugView de GA4.
  // Déjalo en true durante el laboratorio.
  DEBUG_MODE: true
};
