# Rapicostura V2 · Implementación

Fuente: `../../cambiosV2.txt` y ajustes posteriores del usuario. **Prevalece la última indicación: evidencias y registros duran 72 horas desde la confirmación de recepción**, sin caducidad mientras están En camino. Los tutoriales son permanentes hasta eliminación manual.

| Cambio | Resultado |
| --- | --- |
| Sede automática | Selector sin Guardar sede; cambio reactivo y título animado Sede: nombre. |
| Bandejas | Conmutador táctil centrado, envío rojo-morado y recepción morado-azul; dueña con una lista unificada. |
| Acciones | Ver detalle y Recibir ampliados; menú ⋯ sólo con sede activa de origen. |
| Editar y eliminar | Origen edita tipo, descripción, destino y fecha antes de recepción. Origen elimina con confirmación. Revisión del registro previene sobrescrituras y carreras con recepción. |
| Notas de voz | Mantener micrófono, deslizar arriba para bloquear, terminar y escuchar o eliminar. Forma de onda Web Audio, duración y MIME en metadatos de MongoDB, bytes en R2. |
| Evidencia grabada | Tomar foto o Grabar video desde cámara; luz roja, contador y botón Terminar video. Hasta 25 MB. |
| Dueña | Validación al terminar el trazo, reinicio rojo con sacudida y vibración si el navegador la admite; sin botones Limpiar/Entrar. Cambio de patrón en tres trazos automáticos. |
| Tutorial 1 GB | Máximo 1.073.741.824 bytes; partes de 8 MiB, barra visual, pausa/reanudar/cancelar y reintentos. |
| Recuperación de carga | Partes listadas y verificadas en R2; al recargar se elige el mismo archivo. Se guarda localmente sólo el permiso temporal y una huella de muestras del archivo, no el video completo. Sesión 24 h; la dueña debe tener sesión activa. |
| Portadas | JPG extraído del video, guardado en thumbnails/ y asociado al tutorial. Lectura con URL firmada. Compatibilidad de decodificación determina si se puede extraer; icono como alternativa. |
| Ciclo de vida | Registro y evidencias se retiran a las 72 h; tarea horaria borra bytes y documentos, reintenta si R2 falla. Cargas huérfanas/abandonadas tienen limpieza propia. |

## Decisiones técnicas

Se conserva la arquitectura de módulos web con esbuild; no se añade un framework para cambiar entre tres vistas. La UI cambia inmediatamente y los datos se refrescan de forma asíncrona; la latencia del servicio no puede garantizarse por debajo de 200 ms en toda red.

Se adapta el esquema sugerido en el TXT a MongoDB: audioId y receiptAudioId enlazan documentos media con tipo, duración y clave de R2. No se crean tablas SQL ni se guarda el archivo en la base. Multipart S3 no admite la condición `content-length-range` de un formulario POST; el servidor comprueba cantidad, numeración y tamaño real de cada parte antes de finalizar, y verifica tamaño y MIME del objeto antes de publicarlo.

La pausa automática usa los eventos de conexión del navegador. Tras tres fallos de red/almacenamiento se ofrece Reanudar manualmente, incluyendo un mensaje sobre CORS. Una pausa manual no se libera automáticamente al volver internet. Una parte interrumpida se retransmite; las completadas no se repiten. Si el sistema operativo cierra la PWA no puede seguir subiendo en segundo plano.

R2 conserva el bucket privado, GET/PUT/HEAD autorizados sólo para los orígenes establecidos. Las Functions firman permisos y manejan JSON; los bytes del video nunca atraviesan Netlify. Se mantiene el escaneo de secretos y el `.env` ignorado. No se requiere otra variable privada ni un segundo sitio Netlify.

## Publicación y actualización

Push a la rama conectada en GitHub → build de Netlify → deploy Published. La web usa los archivos nuevos al recargar. La PWA muestra Actualizar para activar el service worker nuevo sin reemplazar un formulario abierto. Si Netlify tiene builds o publicación automática suspendidos, hay que reanudarlos o activar Trigger deploy.

Fuentes: [multipart R2](https://developers.cloudflare.com/r2/objects/upload-objects/), [CORS R2](https://developers.cloudflare.com/r2/buckets/cors/), [despliegue continuo de Netlify](https://docs.netlify.com/build/git-workflows/overview/).
