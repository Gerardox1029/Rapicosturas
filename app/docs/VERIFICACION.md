# Verificación · Rapicostura V2 · 19 de octubre de 2026

## Resultado comprobado

- Build con Node.js 24 y esbuild; plataforma configurada para Node.js 22 en Netlify. Publicación de HTML, JS/CSS con hash, iconos, manifest y service worker. No incluye archivos privados ni módulos de Firebase/Gemini/bot.
- 41 casos automatizados: 28 de API/ciclo de vida, 6 de geometría y finalización del patrón, 4 de publicación/seguridad de recursos y 3 de pausa, reconexión y cancelación del cliente.
- Límite exacto de 1.073.741.824 bytes aceptado; un byte adicional rechazado. API multipart comprueba partes incompletas, permiso de archivo, numeración, tamaño, reanudación y finalización.
- Prueba real de R2 con 9 MiB en dos partes firmadas: preflight CORS para el dominio de producción, PUT de ambas partes, ListParts para retomar, CompleteMultipartUpload, HEAD y CopyObject. Se eliminaron los objetos y la sesión multipart temporal al finalizar. No se escribieron envíos ni documentos en MongoDB para esa prueba.
- Pruebas locales de navegador en modo demo con medios artificiales, sin llamadas a la API de producción: sede automática, tema Recepción, patrón incorrecto con reinicio y patrón N correcto sin botón Entrar, grabación de video con contador, nota de voz con bloqueo hacia arriba, reproducción de ambos, creación/edición de envío, tutorial con portada extraída y grilla móvil de 430 px.
- Prueba adicional de cámara con permisos demorados: cerrar/reabrir no reutiliza streams anteriores ni deja cámara/micrófono activos tras cerrar.
- Retención de 72 horas desde el cierre real del servidor comprobada con reloj controlado: antes del límite hay acceso, al llegar se oculta y la limpieza elimina registro y bytes. En camino se conserva. Errores de borrado en R2 conservan metadatos para reintento. Evidencias disponibles con la antigua fecha de 24 horas se ajustan a la regla de 72 horas.
- Edición/eliminación sólo con sede de origen declarada, recepción sólo con destino declarado; recibido no se edita. Control de revisión evita sobrescritura y carrera con recepción.
- Tutoriales y portadas siguen disponibles después de la limpieza de evidencias; se retiran juntos al eliminar el tutorial. Cargas multipart sin completar se abortan al vencer la sesión de 24 horas.
- `.env`, node_modules, salida public/ y archivo-local/ permanecen ignorados por Git. No se añadieron nuevas claves privadas.

## Límites de la verificación

El límite de 1 GB se comprobó por validación y protocolo, **no transfiriendo un video real de 1 GB**. La transferencia real de R2 fue de 9 MiB; la pausa/reconexión de cliente se probó con transporte controlado. Cámara y micrófono de las pruebas de navegador eran simulados; validar permisos, sonido, vibración y archivos de cámara reales en Android después de publicar. Algunas codificaciones no permiten extraer una portada en todos los navegadores.

No se esperaron tres días reales para la limpieza. Verificar en Netlify las ejecuciones horarias de expire-evidence y sus errores. La lectura/lista se bloquea al cumplir el plazo aunque el borrado físico se ejecute en la siguiente hora. No se recuperan archivos borrados por versiones anteriores.

La sede y usuaria siguen siendo de libre selección, según lo acordado: se valida el valor declarado, sin autenticar a la trabajadora. El bot está vacío. La PWA necesita internet para operaciones compartidas y no puede garantizar una transferencia mientras el teléfono suspende o cierra la aplicación.

## Complemento V3 · 21 de octubre de 2026

- Nuevas pruebas de API: alta, cambio de nombre y baja de usuarias con identificador estable; rutas usuaria ↔ sede y usuaria ↔ usuaria; bloqueo de eliminación con envíos en camino; filtros de origen/destino para ambos modos.
- Web Push: la suscripción se vincula sólo al destino seleccionado; se rechazan URLs de servicio no confiables; el mensaje incluye remitente, clase de envío y ruta a Recepción. Se probó el emisor con transporte inyectado y que un fallo de notificación no revierte el envío.
- Audio: se verificaron duración persistida y ruta estable que redirige a URL firmada. La evidencia conserva la regla de 72 horas.
- Build y tests completos pasan. Navegador móvil aislado en modo demo: crear usuaria, grabar/reproducir audio, enviar con foto, cambiar a Cayma y confirmar recepción. Se comprobaron bloqueo hacia arriba, cancelación hacia la izquierda y apertura directa de `/envios?tab=recepcion` con el detalle; sin errores de página.
- Falta una prueba de entrega Push entre dos dispositivos reales después de copiar las claves VAPID del `.env` privado a Netlify. El navegador de prueba no envió avisos externos.
