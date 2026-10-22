# Alcance actual · V2

HTML, CSS y módulos JavaScript para web/PWA; Netlify publica interfaz y API en un solo sitio. MongoDB conserva registros y metadatos, R2 privado conserva archivos. Sin Firebase, Gemini ni backend de WhatsApp.

La sede se selecciona libremente y cambia la bandeja inmediatamente. La API comprueba la sede declarada para editar/eliminar (origen) o recibir (destino); por decisión del producto no autentica la identidad de una trabajadora. La dueña entra al soltar el patrón, puede cambiarlo, supervisar sedes y publicar/eliminar tutoriales. Su vista agrupa todos los envíos sin otro apartado de finalizados.

Recepción sólo contiene envíos entre sedes: crear → En camino → confirmar recepción → Finalizado. Las fechas declaradas son editables; el cierre real para retención usa el reloj del servidor. Sólo la sede de origen puede editar datos antes de la recepción o eliminar un envío con confirmación.

Fotos y videos de evidencia: hasta 25 MB. Notas de voz opcionales de envío/recepción: hasta 25 MB, grabación sostenida, bloqueo hacia arriba y onda visual. Cámara con foto o video, contador y luz roja. Se guardan todos en R2 hasta 72 horas después de confirmar recepción. A las 72 horas se ocultan el envío y sus evidencias; el borrado físico se realiza en la siguiente ejecución horaria y reintenta errores. Los envíos En camino no caducan por antigüedad.

Tutorial MP4/WebM: hasta 1 GB (1024 MB), permanente hasta eliminación de la dueña. Carga por partes de 8 MiB con barra, pausa manual y por desconexión; continúa con las partes ya aceptadas por R2. Tras recargar hay que elegir nuevamente el mismo archivo y completar los campos de publicación; la sesión de carga dura 24 horas. Portada extraída cuando el navegador decodifica el video; si no, permanece el botón de reproducción. Los tutoriales anteriores intentan una portada local al hacerse visibles.

La PWA comparte interfaz y API, cachea sólo recursos estáticos y necesita conexión para registros compartidos. No registra envíos offline. Una carga no sigue transfiriéndose con la app cerrada o suspendida; se retoma al abrirla y seleccionar el archivo. Web Push envía avisos al destino seleccionado en dispositivos que hayan aceptado el permiso. Bot WhatsApp permanece vacío y desconectado, sin comunicación real ni evaluación de personas.
