# Cambios del informe aplicados a Rapicostura

Referencia: `informe-cambios-codex-rapicostura.md`, leído como especificación de interfaz. Implementación activa en `app/index.html` y `app/src/web/`; salida generada en `app/public/`. Primero se construyó la interfaz navegable y se revisó en navegador, después se añadió la API.

| Cambio solicitado | Implementación |
| --- | --- |
| Unificar Recepción y Envíos | Conmutador centrado para trabajadora y lista unificada de dueña. Listas y filtros sin recarga. |
| Perfil simplificado | Cambiar sede y Modo dueña; no hay nombre editable ni cuenta individual de trabajadora. |
| Patrón 3×3 N | Patrón inicial 7→4→1→5→9→6→3; validación de servidor y cambio desde el perfil. |
| Corregir diagonales táctiles | Detección circular de radio reducido, intersección del segmento entre movimientos y línea de guía. Las celdas cuadradas no actúan como zona de selección. |
| Sede en encabezado | Selector ancho de cambio automático, sin botón Guardar; Todas las sedes disponible para dueña. |
| Videos del taller | Buscador bajo el título; categoría junto al título; grilla de previsualizaciones. |
| Categorías | Recibir prendas, Costura y acabados, Revisar la calidad, Empaque y entregas. |
| Videos de dueña | Tarjeta morada + Subir un video al inicio; carga directa y permanente en R2. |
| Navegación limpia | Se retiran Mis trabajos, Compañeras, Equipo, Actividad de trabajo y las tarjetas obsoletas. |
| Recepción directa | Se muestra el historial al alternar a Recepción, sin una pantalla inicial obligatoria de selección. |
| Scroll | Cambiar filtro no fuerza ir al inicio de la pantalla. |
| Indicadores de dueña | En camino y Recibidos arriba; frase del equipo abajo. |
| Bot WhatsApp | Tarjeta Configurar chatbot y bandeja Postulantes y visitas con fichas, respuestas y citas ficticias. |

## Decisiones posteriores que prevalecen sobre el informe

- Recepción sólo muestra los envíos entre sedes. Se retiraron el botón Registrar prenda de cliente, su formulario, sus tarjetas y las rutas de API de ese flujo, tanto para dueña como para trabajadora.
- Las trabajadoras eligen sede sin iniciar sesión. El patrón protege las funciones de dueña y se valida en servidor; la sede libre no identifica a la persona.
- Bot WhatsApp es sólo simulación y queda desconectado. No se integran Gemini, WhatsApp ni otro servidor de bot.
- Un único sitio Netlify aloja web/PWA y API; MongoDB guarda texto/metadatos y R2 los archivos.
- Los tutoriales se conservan hasta eliminación de la dueña. Las evidencias vencen 72 horas después de confirmar recepción, sustituyendo la propuesta anterior de siete días desde subida.
- Videos muestra avisos al alcanzar 10, 50 y 80 GB sobre referencia de 100 GB. La API mide los objetos reales de tutoriales en R2.

En modo conectado la biblioteca comienza con los videos realmente publicados; no se inventan tutoriales para llenar el espacio. `?demo=1` muestra cuatro tarjetas ilustrativas para revisar el diseño. La bandeja del bot siempre deja claro que sus personas y citas son ficticias.

La entrega V2 se detalla en [CAMBIOS_V2.md](CAMBIOS_V2.md); la regla actual elimina tanto registro como evidencias a las 72 horas.
