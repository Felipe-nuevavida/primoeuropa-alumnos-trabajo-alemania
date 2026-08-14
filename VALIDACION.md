# Validación inicial de la landing

Fecha de prueba: 14 de agosto de 2026.

La landing se visualizó localmente con el parámetro `utm_source=educaro`. Se comprobó que el encabezado muestra la promesa principal, el bloque visual se renderiza correctamente y aparece el aviso contextual de llegada desde Educaro. Los tres CTAs de necesidad son visibles y la URL conserva los parámetros de atribución.

Pendiente antes de publicación: comprobar las interacciones de los tres CTAs, comprobar el diseño en viewport móvil, habilitar un endpoint de formulario si se decide captar email y configurar analítica solo con consentimiento adecuado.


## Interacción de rutas

La selección de la ruta de seguro se comprobó mediante ejecución controlada en el navegador. Al activarla, la página aplica el estado visual `health`, actualiza el contador de ruta a `1/3` y muestra el contenido correspondiente: confirmar seguro activo, consultar a empleador o aseguradora y abrir la ruta de seguro médico. La lógica JavaScript y la atribución por parámetro `utm_source=educaro` funcionan en local.
