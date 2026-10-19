# Rapicostura · Web y PWA

Una sola interfaz HTML/CSS/JavaScript para navegador y móvil instalable. Un sitio Netlify aloja la web y la API; MongoDB guarda envíos, recepciones, textos y referencias; Cloudflare R2 almacena fotos y videos. El bot es sólo una pantalla de ejemplos de postulantes y visitas.

## Empezar

Requiere Node.js 22 o posterior. Desde esta carpeta:

```sh
npm ci
npm run build
npm run dev
```

- Web conectada: `http://127.0.0.1:4173/`. Requiere completar el `.env` privado.
- Prototipo navegable: `http://127.0.0.1:4173/?demo=1`. Los ejemplos no se envían al servidor.
- Pruebas: `npm test` y `npm run check`.

La configuración de publicación, CORS y variables está en [DESPLIEGUE_NETLIFY.md](docs/DESPLIEGUE_NETLIFY.md). El `.env` está ignorado por Git. Se verificaron la conexión real a MongoDB, lectura/escritura de evidencias en R2, envío, recepción y CORS local; los registros de prueba se retiraron. Falta publicar en Netlify y añadir su dominio a CORS. Ver [VERIFICACION.md](docs/VERIFICACION.md) para el alcance de las comprobaciones.

## Cambios del informe

Envíos incorpora el conmutador Recepción / Envíos, filtros sin recarga, sede en cabecera, métricas de dueña y registro local de sede. La navegación elimina Mis trabajos, Compañeras, Equipo y Actividad de trabajo. Videos tiene búsqueda, las cuatro categorías acordadas y una tarjeta de carga para la dueña. Bot WhatsApp presenta fichas ficticias bajo Postulantes y visitas.

El acceso inicial de dueña usa el patrón N **7 → 4 → 1 → 5 → 9 → 6 → 3**, con `i` como columna y `j` como fila: `i1j3 → i1j2 → i1j1 → i2j2 → i3j3 → i3j2 → i3j1`. La detección es circular y reconoce diagonales entre eventos táctiles. El patrón real se valida en servidor y puede cambiarse desde el avatar; el modo demostración usa un patrón independiente en memoria.

Las trabajadoras eligen sede sin iniciar sesión, por decisión del producto. Esto no comprueba quién está usando cada sede. El patrón protege las funciones administrativas.

Ver [INFORME_CAMBIOS_APLICADOS.md](docs/INFORME_CAMBIOS_APLICADOS.md) y [ESTILO_Y_ESENCIA.md](docs/ESTILO_Y_ESENCIA.md).

## Archivos activos

```text
index.html             Entrada HTML fuente
src/web/               Interfaz modular, estilos, patrón, acceso a API y demo
server/                Validación, sesiones, persistencia y R2
netlify/functions/     API HTTP y limpieza programada
scripts/build-app.mjs  Compila y genera public/ con recursos PWA
scripts/dev.mjs        Servidor local que sólo publica public/ y la API
tests/connected/       Pruebas de reglas, acceso, retención y patrón
public/                Salida generada: index.html, JS, CSS, manifest y service worker
.env                   Configuración privada, excluida de Git y publicación
.env.example           Nombres de variables sin credenciales
```

El frontend usa módulos JavaScript y esbuild para producir un script pequeño; no necesita un framework de UI para estas tres vistas. El build publica una lista explícita de recursos y no copia archivos de configuración privada. El service worker conserva sólo la interfaz estática; no cachea respuestas de API ni evidencias.

## Archivos y retención

Las cargas van directamente a R2 con permiso temporal. Las fotos se reducen, cuando el navegador puede decodificarlas, a un lado máximo de 1600 px y JPEG al 85 %. Evidencia: máximo 25 MB; tutorial MP4/WebM: máximo 300 MB.

Los tutoriales se conservan hasta eliminación de la dueña. Las evidencias no caducan mientras el envío esté En camino; vencen 24 horas después de la confirmación de recepción del servidor. La tarea horaria elimina el archivo físico y conserva los textos del envío. No aplicar la antigua regla de siete días desde subida.

Videos avisa al llegar a 10, 50 y 80 GB sobre una referencia de 100 GB. La medición corresponde a objetos reales bajo `tutorials/` en R2; 100 GB no es una cuota gratuita incluida ni un bloqueo automático.

El material anterior, su APK y sus integraciones se conservan en `../archivo-local/previo-netlify/`, fuera de Git y del despliegue. No forman parte de esta versión activa. La PWA reemplaza ese flujo de entrega móvil y usa la misma URL web.
