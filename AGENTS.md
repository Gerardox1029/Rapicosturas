# Guía rápida para trabajar en Rapicostura

- **Alcance:** este directorio es un repositorio Git propio dentro de `GastosClaros/`. El producto activo está en `app/`; no modificar el proyecto financiero padre ni `archivo-local/` para tareas de Rapicostura.
- **Entrada de contexto:** [app/docs/MAPA_DEL_PROYECTO.md](app/docs/MAPA_DEL_PROYECTO.md) explica módulos y flujos. [app/docs/CAMBIOS_V3.md](app/docs/CAMBIOS_V3.md) resume decisiones de producto. [app/docs/ESTILO_Y_ESENCIA.md](app/docs/ESTILO_Y_ESENCIA.md) define la interfaz; [app/docs/DESPLIEGUE_NETLIFY.md](app/docs/DESPLIEGUE_NETLIFY.md) cubre publicación.
- **Reglas vigentes:** sedes y usuarias son origen/destino equivalentes; sólo el origen declarado edita/elimina y sólo el destino declarado recibe. La selección de entidad es libre y no autentica trabajadoras. La dueña accede con patrón; la cuenta de usuaria conserva un ID estable aunque cambie su nombre.
- **Retención:** historial y evidencias de envío/recepción vencen 72 horas desde `confirmedAt` del servidor. En tránsito permanecen. Tutoriales y portadas duran hasta eliminación por la dueña. La limpieza horaria reintenta fallos de R2.
- **Bot:** mantener la pantalla Bot WhatsApp y «Postulantes y visitas» vacía; no conectar WhatsApp ni inventar postulantes, teléfonos o enlaces sin una solicitud posterior.
- **Medios:** el navegador sube bytes directamente a R2 con URLs firmadas; Netlify Functions emite permisos, valida y registra referencias en MongoDB. Tutoriales hasta 1 GiB con multipart; evidencia hasta 25 MiB. No mover bytes grandes por Functions ni colocar archivos binarios en MongoDB.
- **Avisos:** `app/server/push.mjs` envía Web Push al destino; `app/src/web/push.js` gestiona el permiso y la suscripción del dispositivo. La clave privada VAPID se queda en `.env` local/Netlify Functions, nunca en Git o `public/`.
- **Verificación:** desde `app/`, usar Node 22+, `npm run check`, `npm test`, `npm run build`. El modo `?demo=1` permite probar UI sin escribir en producción. `public/` es salida generada, no editarla a mano. Antes de publicar, revisar `git diff --check` y que `.env` siga ignorado.

No asumir que el `MONGODB_DB` real coincide con los ejemplos de documentación: leer únicamente el nombre configurado, sin imprimir el URI ni otros secretos.
