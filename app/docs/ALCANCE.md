# Alcance actual

La versión activa aplica el informe de cambios a la interfaz y añade API Netlify, persistencia MongoDB, cargas directas R2 y PWA. El código y las pruebas están preparados; activar los servicios reales requiere completar variables y publicar el sitio según `DESPLIEGUE_NETLIFY.md`.

La trabajadora elige sede sin cuenta. Puede registrar envíos y consultar entradas/salidas; la sede destino declarada confirma la recepción. Esta selección no demuestra la identidad de quien usa el sistema. La dueña entra mediante patrón validado en servidor, puede cambiarlo, supervisa todas las sedes y publica/elimina tutoriales; no confirma recepciones desde ese modo.

Recepción incluye directamente el historial de paquetes de sede y las prendas de clientes registradas. El flujo de transporte no contiene seguimiento de repartidor: crear envío → En camino → confirmar recepción → Finalizado. Las fechas declaradas son editables y las marcas reales se guardan desde servidor.

Bot WhatsApp es únicamente una maqueta de postulantes y visitas. No envía mensajes, no pide credenciales de bot, no evalúa candidaturas y no agenda nada real. La versión activa no necesita Firebase ni Gemini.

R2 conserva tutoriales hasta eliminación manual. Las evidencias vencen 24 horas después de confirmar recepción en el servidor; mientras están En camino se conservan. El texto del historial permanece. Las URL de lectura tienen duración limitada y la tarea horaria realiza el borrado físico.

La PWA comparte interfaz/API con la web. Cachea sólo recursos estáticos y requiere conexión para registros y consulta compartida. No ofrece captura offline con sincronización posterior. El prototipo anterior y sus datos del navegador no se migran automáticamente a otro dominio.
