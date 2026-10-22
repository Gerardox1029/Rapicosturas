# Rapicostura V3: implementación y decisiones

Fuente: `../../cambiosV3.md` y la aclaración posterior del usuario. La aclaración mantiene **Bot WhatsApp vacío**: sólo la tarjeta «Configurar chatbot próximamente» y «Postulantes y visitas» sin registros. El motor de respuestas, la encuesta y la conexión con WhatsApp quedan para otra entrega; no se inventaron teléfonos, mapas ni postulantes.

## Entidades y bandejas

- El selector principal dice «Sede de trabajo / Usuario» y cambia la bandeja al instante. Contiene cinco sedes fijas y usuarias administrables, con Yesenia y Yolanda iniciales.
- «Editar usuarios» permite crear, cambiar nombre y eliminar con confirmación. Los identificadores no cambian al renombrar. No se puede eliminar una usuaria con envíos en camino. Las sedes nunca se editan.
- Una sede o usuaria puede ser origen o destino. La API valida que ambas estén activas al registrar y que sean diferentes. Sólo el origen elegido puede editar o eliminar; sólo el destino elegido confirma la recepción.
- Recepción y Envíos comparten pantalla y conmutador, también en modo dueña. El filtro «Todas las sedes» reúne sedes y usuarias. Los chips de estado conservan el desplazamiento al cambiar.
- El modo dueña conserva el patrón N y su cambio desde el avatar. En la vista trabajadora el menú tiene «Cambiar sede / usuario» y «Modo dueña».

La selección de sede o usuaria sigue siendo libre y **no autentica a una persona**. La validación de origen/destino usa la entidad declarada. Para permisos personales reales hará falta iniciar sesión por trabajadora.

## Voz, videos y retención

- Descripción/observación y micrófono forman una sola barra, basada sólo visualmente en las imágenes de referencia. Mantener pulsado graba, deslizar arriba bloquea, deslizar a la izquierda cancela; aparecen contador, punto rojo y onda. Se puede reproducir y borrar antes de enviar.
- El audio se sube directamente a R2 como evidencia. MongoDB conserva `audio_url` y `audio_duracion` para el envío, y `receipt_audio_url` y `receipt_audio_duracion` para la recepción. Las rutas de audio autorizan el acceso y redirigen a una URL firmada de corta duración.
- Los tutoriales ya admitían 1 GB por partes, pausa/reanudación y portada extraída del video desde V2; se conservan. Se retiraron tarjetas de tutorial genéricas fuera del modo demostración.
- Historial, imágenes, audio y video de evidencia vencen **72 horas exactas desde la confirmación de recepción en el servidor**. La limpieza programada sigue siendo horaria y reintenta fallos de R2. Los tutoriales permanecen hasta que la dueña los elimine.

## Avisos PWA

- Tras crear un envío, la API intenta enviar Web Push sólo a las suscripciones vinculadas a su destino. Si falla el servicio de avisos, el envío permanece guardado.
- Cada dispositivo pide permiso al pulsar «Activar avisos para…». Cambiar de sede/usuaria reasigna su suscripción; salir hacia «Todas las sedes» la retira. Un aviso abre `/envios?tab=recepcion` con el destino y el envío.
- Las notificaciones del sistema admiten título, texto e icono, pero no texto enriquecido en negrita. La aplicación usa título claro, nombre del remitente y emojis.
- Para activar Web Push en producción, copiar `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` y `VAPID_SUBJECT` del `.env` local ignorado por Git a las variables de Netlify con alcance Functions y desplegar de nuevo. La clave privada no debe publicarse ni regenerarse después de que los dispositivos se suscriban.
- El dispositivo necesita HTTPS, compatibilidad con Push y permiso de notificaciones. La entrega también depende de su conexión y del servicio de notificaciones del navegador; no sustituye la bandeja compartida.

## Verificación

`npm run check`, `npm test` y `npm run build` verifican sintaxis, API, retención y la PWA. La prueba de navegador en modo demostración recorrió crear usuaria → grabar audio/foto → enviar a Cayma → recibir desde Cayma, sin errores de página. La suscripción y entrega Web Push reales requieren configurar las tres variables VAPID en Netlify y probar con dos dispositivos Android; los tests inyectan el emisor para comprobar el destinatario sin enviar avisos externos.
