# Publicar Rapicostura: una web, una API y una PWA

## Estructura activa

El proyecto que se publica está en `Rapicostura/app`. `index.html` y `src/web/` son la interfaz; `server/` y `netlify/functions/` son la API. `npm run build` genera `public/index.html` y sus recursos. La publicación usa únicamente `public/`, nunca la carpeta del repositorio completa.

El código anterior se conserva localmente en `Rapicostura/archivo-local/previo-netlify/`, ignorado por Git y excluido de la publicación. El APK anterior pertenecía a esa versión. No hay dependencia activa de Firebase, Gemini ni del servidor del bot. La presentación del compañero es un artefacto independiente y no forma parte de la aplicación publicada.

## 1. Completar el archivo privado

Usar Node.js 22 o posterior. Completar `app/.env` localmente, sin pegar valores en el chat ni subir el archivo al repositorio:

| Variable | Valor |
| --- | --- |
| `APP_ORIGIN` | Local: `http://127.0.0.1:4173`. En Netlify: origen HTTPS definitivo, sin ruta ni barra final. También se puede omitir en Netlify: la API utiliza automáticamente la variable de sistema `URL`, que contiene el dominio principal del sitio. |
| `MONGODB_URI` | Cadena de conexión Atlas del usuario con acceso a la base de esta aplicación. |
| `MONGODB_DB` | `rapicostura`; usa colecciones propias, sin reutilizar las financieras. |
| `R2_ACCOUNT_ID` | ID de cuenta Cloudflare, no el ID del token. |
| `R2_ACCESS_KEY_ID` | Access Key ID de las credenciales S3 de R2. |
| `R2_SECRET_ACCESS_KEY` | Secret Access Key de las credenciales S3 de R2. |
| `R2_BUCKET` | `rapicosturas`. |
| `SESSION_SECRET` | La clave aleatoria ya generada en el archivo local. Usar la misma en el servidor; nunca publicarla. |
| `OWNER_INITIAL_PATTERN` | `7415963`: N inicial. Sólo se usa al crear la configuración de dueña por primera vez. |
| `VAPID_PUBLIC_KEY` | Clave pública Web Push generada en el `.env` local. |
| `VAPID_PRIVATE_KEY` | Clave privada Web Push del mismo par; sólo Functions. |
| `VAPID_SUBJECT` | URL de contacto del sitio, ya preparada en el `.env` local. |

La autenticación de dueña guarda una derivación scrypt del patrón en MongoDB y una sesión de ocho horas en cookie HttpOnly/SameSite. El patrón se puede cambiar desde el avatar; se comprueba el actual y se invalida el acceso de las sesiones anteriores. Para recuperación por quien administra el servidor: añadir temporalmente `OWNER_RECOVERY_PATTERN` al `.env`, ejecutar `npm run owner:reset` y retirar esa variable. Cambiar `OWNER_INITIAL_PATTERN` después del primer acceso no cambia un patrón ya guardado.

Por decisión del producto, las trabajadoras no tienen cuentas: pueden cambiar libremente de sede. El servidor valida que una confirmación declare la sede destino, pero no verifica la identidad de la persona que eligió esa sede. Las operaciones de recepción y consulta por sede son acceso libre, con límites de frecuencia y comprobación de origen. El patrón protege las funciones de dueña, no convierte la selección libre en permisos por persona.

## 2. Preparar MongoDB y R2

En Atlas, crear o usar la base `rapicostura` y permitir la conexión desde la infraestructura donde se ejecuten las Functions. La URI debe pertenecer a un usuario con permisos sobre esa base. Los índices se crean en la primera conexión; el código no guarda imágenes ni videos en MongoDB.

Mantener privado el bucket `rapicosturas`. Crear credenciales S3 con lectura/escritura limitadas a ese bucket. Configurar CORS en el panel R2; reemplazar el dominio de ejemplo por el definitivo:

```json
[
  {
    "AllowedOrigins": ["https://rapicosturas.netlify.app", "http://127.0.0.1:4173"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["Content-Type", "Range"],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Range", "Accept-Ranges"],
    "MaxAgeSeconds": 3600
  }
]
```

El cliente pide un permiso temporal a Netlify, sube directamente a `pending/` en R2 y solicita la verificación del archivo. El servidor comprueba tamaño y tipo y copia el archivo a su clave definitiva. Una URL PUT antigua sólo puede afectar el temporal, no reemplazar el archivo publicado.

- `tutorials/`: videos permanentes hasta que la dueña los elimine.
- `evidence/`: evidencias de envíos y recepción. No vencen mientras el envío siga En camino. Vencen **72 horas después de confirmar la recepción en el servidor**, independientemente de la fecha editable del formulario.
- `thumbnails/`: portadas permanentes de tutoriales, borradas junto con su video.
- `pending/`: archivos transitorios de carga; la limpieza periódica elimina los huérfanos.

**Retirar cualquier regla anterior que borre todo el bucket o `evidence/` a los siete días desde la subida.** Esa regla ya no corresponde al producto. El vencimiento actual depende de la recepción y lo aplica `expire-evidence`, programada cada hora. La lectura deja de autorizarse al llegar la fecha límite; el borrado físico ocurre en una ejecución posterior de limpieza. El registro del envío también se retira a las 72 horas. La limpieza reintenta errores de almacenamiento.

No se necesita un dominio público de R2: los reproductores reciben URL temporales firmadas. La configuración CORS debe permitir también `GET` y `HEAD` para que los videos puedan solicitar rangos y reproducirse.

## 3. Probar localmente

Desde `Rapicostura/app`:

```sh
npm ci
npm run build
npm run services:check
npm run dev
```

`services:check` comprueba MongoDB y la lectura de R2 sin subir archivos ni crear envíos. No imprime credenciales. Puede crear los índices necesarios de la aplicación en MongoDB.

Abrir `http://127.0.0.1:4173/` para el modo conectado. Para revisar la interfaz sin credenciales: `http://127.0.0.1:4173/?demo=1`. El modo demostración es explícito y nunca se utiliza como guardado alternativo cuando falla la API. Reiniciar el servidor después de editar `.env`.

```sh
npm test
npm run check
```

La PWA y cámara en un teléfono necesitan un origen HTTPS accesible por el teléfono; `127.0.0.1` en el móvil es el propio dispositivo. Probar cámara y galería desde la URL HTTPS publicada.

## 4. Publicar desde GitHub

Crear un sitio Netlify conectado al repositorio. En este repositorio compartido configurar:

- **Base directory:** `Rapicostura/app`.
- **Package directory:** `Rapicostura/app` si Netlify solicita identificar el proyecto dentro del repositorio.
- **Build command:** `npm run build`.
- **Publish directory:** `public` (relativa a la base).
- **Functions directory:** `netlify/functions`.
- **Node:** 22 (definido también en `.nvmrc` y `netlify.toml`).

Si se crea un repositorio cuyo contenido raíz es directamente `app/`, dejar la base vacía. Si la raíz del repositorio es `Rapicostura/`, la base es `app`. Verificar en el log que Netlify usa **este** `netlify.toml`, no el del proyecto financiero que existe en la raíz del repositorio compartido.

Añadir las variables del cuadro anterior en el panel de Netlify. Si el plan permite seleccionar alcances, incluir **Functions**; si no, usar el alcance general disponible. No poner secretos en el `netlify.toml` ni en el frontend. **No importar a producción el `APP_ORIGIN` local:** omitir esa variable para usar automáticamente el dominio principal de Netlify, o asignarle el dominio HTTPS publicado. Actualizar CORS de R2 con ese mismo dominio. Después desplegar nuevamente para que las Functions reciban sus variables. Usar la URL principal para operar: las vistas previas con otro dominio no quedan autorizadas automáticamente.

No basta con arrastrar `index.html` al hosting: esa modalidad no prepara la API. La publicación desde GitHub ejecuta la compilación y publica web, Functions y tarea programada en un único sitio. MongoDB y R2 siguen siendo servicios externos.

### Si Netlify detiene la publicación por Secrets scanning

El escaneo compara los valores marcados como secretos con todo el repositorio y la salida compilada. Un nombre de bucket, una ruta de carpeta o una dirección local pueden producir coincidencias aunque sean configuración pública. El `netlify.toml` incluye una excepción limitada mediante `SECRETS_SCAN_OMIT_KEYS` para `APP_ORIGIN`, `MONGODB_DB`, `R2_BUCKET`, `R2_TUTORIAL_PREFIX` y `R2_EVIDENCE_PREFIX`. El escaneo de credenciales permanece activo. Si ya existe esta variable en el panel de Netlify, revisar que su configuración no contradiga la lista del proyecto.

`R2_TUTORIAL_PREFIX` y `R2_EVIDENCE_PREFIX` pertenecen a una configuración anterior y pueden eliminarse de Netlify: esta versión utiliza internamente `tutorials/` y `evidence/`. No es necesario añadirlas al `.env`. Si `APP_ORIGIN` tiene una dirección local, eliminarla **sólo en Netlify** para usar el dominio principal automáticamente; conservarla en el `.env` local.

Las excepciones no incluyen la URI de MongoDB, las claves S3 de R2, el patrón ni `SESSION_SECRET`. No desactivar globalmente el escaneo ni excluir carpetas enteras para resolver coincidencias de configuración pública. Volver a desplegar el último commit después de corregir las variables del sitio.

## 5. Activación comprobable

Antes de usar registros reales, probar con datos de prueba:

1. Desde un dispositivo registrar envío Yanahuara → Cayma con una foto. Desde otro elegir Cayma, entrar en Recepción y reproducir/abrir la misma evidencia.
2. Confirmar recepción en Cayma y comprobar Finalizado en ambos dispositivos. La dueña supervisa, pero no confirma recepciones desde su modo.
3. Verificar `confirmedAt` y `evidenceExpiresAt` en el registro: diferencia de 72 horas. Al vencer, la lectura debe devolver 410 y la siguiente limpieza debe borrar los archivos de envío y recepción, eliminando también el registro del envío.
4. Entrar como dueña, cambiar el patrón y comprobar que el anterior y una sesión previa ya no abren ese modo.
5. Subir un MP4 pequeño como tutorial, reproducirlo en otro dispositivo y confirmar que sólo la dueña lo puede eliminar.
6. Comprobar en Netlify la ejecución programada de `expire-evidence` y sus errores. Sin esa ejecución, la API impide nuevas lecturas vencidas, pero el archivo puede seguir ocupando espacio físico.
7. Instalar la PWA en Android. Abrir sin conexión: debe cargar la interfaz y pedir conexión para operaciones; no mostrar un falso guardado ni copiar respuestas privadas a caché.

La interfaz notifica al superar 10, 50 y 80 GB de videos, indicando 100 GB como referencia presupuestada. El uso se calcula listando objetos reales de `tutorials/` en R2. **100 GB no es una cuota gratuita contratada ni un límite técnico impuesto por esta aplicación.** No se bloquean videos automáticamente al llegar a ese valor.

Límites iniciales: evidencia de hasta 25 MB; tutorial MP4/WebM de hasta 1 GB (1024 MB). Las fotos compatibles se reducen a un lado máximo de 1600 px y JPEG al 85 % en el cliente; no se promete conservar el original. La PWA requiere internet para compartir datos. El cambio de dominio no importa automáticamente registros privados guardados en localStorage por el prototipo anterior.

## Fuentes oficiales

[Functions y variables privadas en Netlify](https://docs.netlify.com/build/functions/environment-variables/), [monorepos y configuración](https://docs.netlify.com/build/configure-builds/monorepos/), [Functions programadas](https://docs.netlify.com/build/functions/scheduled-functions/), [URL prefirmadas de R2](https://developers.cloudflare.com/r2/api/s3/presigned-urls/), [CORS de R2](https://developers.cloudflare.com/r2/buckets/cors/), [instalación PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).

## Actualización V2 desde Git

El repositorio Rapicosturas ya usa `app` como Base directory. Un push a la rama conectada dispara automáticamente el build **si Auto publishing/continuous deployment sigue habilitado**. Verificar que el deploy publicado corresponda al nuevo commit y termine en Published. Si los builds están detenidos o la rama no coincide, usar Trigger deploy en el panel. No subir `public/` manualmente.

No hacen falta nuevas variables privadas para V2. Mantener CORS con el dominio de producción y GET/PUT/HEAD, Content-Type y Range; ETag expuesto es recomendable. La política de la web ahora permite micrófono para notas y clips. El bucket continúa privado. La carga de tutoriales usa multipart S3 de R2 con partes de 8 MiB, URLs de cada parte válidas 15 minutos y sesión total de 24 horas. El servidor lista y valida las partes; no recibe bytes del video. No aumentar límites de Functions ni añadir un proxy de archivos.

Tras publicar, recargar la web. En una PWA abierta aparecerá «Hay una versión nueva»; tocar **Actualizar** cuando no haya un formulario abierto. La interfaz busca actualizaciones al volver a primer plano y cada cinco minutos mientras está visible. Los formularios no se reemplazan durante una operación.

La limpieza horaria `expire-evidence` elimina evidencias y registros 72 horas después del cierre confirmado por servidor. Las evidencias disponibles de registros anteriores se ajustan a este plazo al consultar/limpiar; un archivo ya eliminado físicamente por la versión anterior no se puede recuperar.

## Actualización V3: Web Push y usuarias

La V3 incorpora usuarias como origen y destino, audio junto al texto y avisos PWA para el destino. Las tres variables VAPID ya están generadas en `app/.env` local, que Git ignora. **Copiar sus valores al panel de variables del mismo sitio Netlify** con alcance Functions, sin pegarlos en el repositorio ni en un chat, y volver a desplegar. Mantener el par VAPID estable: cambiarlo invalida las suscripciones existentes y obliga a activar avisos otra vez en cada dispositivo. `VAPID_SUBJECT` es una dirección pública, por eso está excluida del detector de secretos; la clave privada sigue bajo escaneo.

En cada móvil, seleccionar sede o usuaria y tocar «Activar avisos para…». Aceptar el permiso del navegador. La API guarda la suscripción para esa entidad y, al registrar un envío nuevo, envía el aviso únicamente a los dispositivos vinculados al destino. La entrega depende de HTTPS, conexión y permisos del dispositivo. Si las variables no están configuradas, el aviso no se activa, pero los envíos funcionan. La URL abre `/envios?tab=recepcion` y el detalle del envío.

La selección de entidad sigue siendo libre. No tratar los avisos ni el selector como autenticación de trabajadoras. El Bot WhatsApp se mantiene vacío por decisión posterior del usuario; no configurar API de WhatsApp ni datos de contacto para V3.
