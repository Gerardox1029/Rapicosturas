# Rapicostura · Primera versión web y PWA

Aplicación para registrar envíos entre sedes y confirmar su recepción. Una misma interfaz HTML/CSS/JavaScript funciona en navegador y se puede instalar como PWA en Android.

- Trabajadoras: selección libre de sede, registro de envíos con foto o video y recepción en destino.
- Dueña: supervisión del equipo, filtros por sede, biblioteca de videos y patrón de acceso modificable.
- Evidencias en Cloudflare R2: vencen 24 horas después de confirmar recepción; los textos del historial se conservan en MongoDB.
- Tutoriales en R2: permanecen hasta que la dueña los elimine. Avisos de uso a 10, 50 y 80 GB sobre una referencia de 100 GB.
- Postulantes y visitas: ejemplos visuales; el bot todavía es una simulación.

## Desarrollo local

Requiere Node.js 22 o posterior. El proyecto activo está en `app/`:

```sh
cd app
npm ci
cp .env.example .env
# Completar las variables privadas de MongoDB y R2 y una SESSION_SECRET aleatoria.
npm run build
npm run dev
```

Abrir `http://127.0.0.1:4173/` para la aplicación conectada o añadir `?demo=1` para revisar ejemplos sin credenciales. No copiar `.env.example` encima de un `.env` ya completado.

## Publicar en Netlify

Conectar este repositorio y su rama `main`. Usar **Base directory: `app`**, **Build command: `npm run build`**, **Publish directory: `public`** y **Functions directory: `netlify/functions`**. Web, API y limpieza programada se alojan en un único sitio Netlify.

Añadir las variables privadas en Netlify. Omitir `APP_ORIGIN` para usar automáticamente el dominio principal del sitio, o definir su dirección HTTPS definitiva. Añadir ese dominio a CORS del bucket privado R2 y configurar el acceso de red a Atlas.

El archivo `.env`, las sesiones locales, las dependencias instaladas y las copias antiguas están excluidos de Git. Las variables de referencia están en `app/.env.example`.

## Documentación

- [Despliegue y configuración](app/docs/DESPLIEGUE_NETLIFY.md)
- [Cambios aplicados](app/docs/INFORME_CAMBIOS_APLICADOS.md)
- [Estilos y esencia](app/docs/ESTILO_Y_ESENCIA.md)
- [Verificaciones y pendientes de producción](app/docs/VERIFICACION.md)

`presentacion-parche/` es un material independiente del compañero y no forma parte de la aplicación publicada.

La versión 1.1 aplica cambiosV2.txt y los ajustes posteriores. Consulta [cambios y decisiones V2](app/docs/CAMBIOS_V2.md) y [estilos para integración](app/docs/ESTILO_Y_ESENCIA.md).
