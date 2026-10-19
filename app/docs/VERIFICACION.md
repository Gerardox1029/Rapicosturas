# Verificación de entrega · 19 de octubre de 2026

## Comprobado

- Compilación con esbuild y Node.js 24: genera `public/index.html`, JS/CSS con nombre por contenido, manifest, service worker e iconos. Destino de Netlify: Node.js 22.
- 27 casos automatizados aprobados: 18 sobre API y reglas del producto, 5 sobre el trazo del patrón y 4 sobre publicación, URLs firmadas, permisos de carga de imágenes/videos en la política CSP y PWA.
- `.env`, `archivo-local/` y `app/public/` están excluidos de Git. El build no copia credenciales ni los módulos anteriores de Firebase/Gemini/bot.
- MongoDB real: conexión, índices y persistencia de un envío técnico temporal.
- R2 real: subida firmada de una imagen técnica pequeña, verificación de tamaño/tipo, copia a clave definitiva y lectura firmada con los mismos bytes.
- Flujo real Yanahuara → Cayma: aparece En camino en la consulta de destino; recepción con otra evidencia; cambio a Recibido; `evidenceExpiresAt` exactamente 24 horas después de `confirmedAt` del servidor.
- Se retiraron únicamente los envíos, metadatos de archivos y objetos temporales creados por esa prueba. Los contadores técnicos de frecuencia caducan automáticamente.
- CORS de R2: se añadió `http://127.0.0.1:4173`, conservando otras reglas; solicitud OPTIONS verificada. El bucket conserva su acceso privado.
- Navegador: interfaz conectada fuera de `?demo=1`, respuesta de API real; modo demostración, acceso con N, grilla sin coordenadas visibles, bandeja simulada de postulantes/visitas, categorías y búsqueda de videos. Vista móvil de 390 px sin desbordamiento horizontal.

## Corrección posterior: Recepción

Se retiró el flujo Registrar prenda de cliente de ambas vistas, incluidos formulario, tarjetas, llamadas de consulta y rutas de API. Recepción sólo presenta envíos entre sedes. Se comprobó la interfaz de trabajadora y dueña en navegador; las antiguas rutas de prendas devuelven 404 para ambas. No se borraron registros existentes de MongoDB.

## Pendiente del entorno publicado

No se ha desplegado el sitio en Netlify. Seguir [DESPLIEGUE_NETLIFY.md](DESPLIEGUE_NETLIFY.md): variables privadas del sitio, dominio principal, CORS con el dominio HTTPS definitivo y acceso de red a Atlas desde Functions.

En Netlify, **omitir `APP_ORIGIN` para usar automáticamente su variable de sistema `URL`**, o definir el dominio HTTPS definitivo. No copiar el valor local a producción.

El borrado físico programado se probó con reloj simulado y objetos de prueba; debe comprobarse la ejecución horaria de `expire-evidence` tras desplegar. No se esperó un día real ni se borraron archivos del usuario para verificarla. Revisar que ninguna regla de ciclo de vida anterior elimine tutoriales permanentes o evidencias pendientes por antigüedad desde subida.

La prueba real utilizó imágenes pequeñas. El límite de 300 MB por tutorial está validado por código, pero no se consumieron cientos de MB del bucket en una carga de prueba. La cámara, instalación PWA y reproducción de videos grandes deben probarse en el teléfono mediante HTTPS.

Las trabajadoras eligen sede libremente según lo solicitado; esta selección no autentica su identidad. El bot sigue siendo exclusivamente una simulación.
