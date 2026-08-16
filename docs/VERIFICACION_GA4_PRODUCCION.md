# Verificación de producción — instalación GA4

- Commit publicado: `8edd4a3` — `[Update] index.html and app.js - Install GA4 guide and download tracking`.
- URL comprobada: `https://alumnos-trabajo-alemania.primoeuropa.eu/?guide=documentos&utm_source=qa_manual&utm_medium=test&utm_campaign=ga4_installation`.
- Resultado visual: la variante `documentos` mostró el contenido y el CTA correctos; el aviso de partner se activó al detectar `utm_source`.
- CTA de cabecera comprobado: navega a `#checklist-descarga` y conserva la variante documental.
- El HTML público contiene exactamente dos apariciones del ID `G-M613Q4L4KL`: la carga de `gtag.js` y `gtag('config', ...)`.

Pendiente: comprobar el clic de descarga en cada guía y revisar en GA4/DebugView que lleguen los eventos con sus parámetros.

La consola de Google Analytics cargó la propiedad **Primo Europa** y confirmó el ID de medición `G-M613Q4L4KL`. Inmediatamente después de la primera navegación de prueba, el panel seguía mostrando cero datos recibidos. Este estado puede ser transitorio por la latencia de incorporación de GA4 o por bloqueo de las solicitudes de Google Analytics en el navegador de prueba; no se considera una validación positiva de recepción aún.

La propiedad **Primo Europa** está disponible en la consola de Analytics con permisos de administración. Se localizó la ruta **Administración → Datos mostrados → Definiciones personalizadas**; la navegación se encuentra en preparación para crear las dimensiones de evento requeridas.

Se creó en GA4 la dimensión personalizada de ámbito Evento **Guía** asociada al parámetro `guide`. La consola confirmó que no había definiciones previas y ahora muestra esta primera definición creada el 16 de agosto de 2026.

La segunda dimensión personalizada está preparada con ámbito Evento: **Fuente del partner**, asociada al parámetro `partner_source`. Su guardado se ejecutará junto con las restantes dimensiones de atribución requeridas.

La tercera dimensión personalizada está preparada con ámbito Evento: **Medio del partner**, asociada al parámetro `partner_medium`.

La cuarta dimensión personalizada está preparada con ámbito Evento: **Campaña**, asociada al parámetro `campaign`.

La quinta dimensión personalizada está preparada con ámbito Evento: **CTA**, asociada al parámetro `cta`.

La sexta dimensión personalizada está preparada con ámbito Evento: **Archivo descargado**, asociada al parámetro `guide_file`.

La consola de GA4 confirma las seis dimensiones personalizadas de ámbito Evento requeridas por el handoff: `guide`, `partner_source`, `partner_medium`, `campaign`, `cta` y `guide_file`.

La marca de `guide_download` como evento clave permanece pendiente hasta que GA4 reciba y muestre el primer evento; antes de esa recepción el evento no está disponible en el listado de eventos de la propiedad.
