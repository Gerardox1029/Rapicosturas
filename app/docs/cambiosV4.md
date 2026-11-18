# Rapicostura V4: ajustes de claridad y recepción

## Objetivo

Mejorar la lectura rápida de fechas y horas, simplificar las acciones de las tarjetas y reducir pasos innecesarios en el formulario de Envíos y en la confirmación de recepción. Aplicar los cambios en todos los modos (dueña y costurera) y en los distintos tamaños de pantalla.

## Cambios solicitados

### 1. Fecha y hora más legibles

- En las tarjetas principales de las bandejas, aumentar al doble el tamaño actual de la fecha y hora ubicadas en la parte inferior izquierda y mostrarlas en negrita.
- Aplicar el mismo tratamiento a la fecha y hora que aparecen en las vistas de detalle abiertas con «Ver detalle» o «Recibir».
- Mantener el texto legible y sin recortes en móvil, tableta y escritorio; comprobar el resultado en los modos dueña y costurera.
- Usar las capturas de referencia de esta solicitud para ubicar los elementos señalados en rojo.

### 2. Etiqueta de acción en las tarjetas

- Cambiar el texto de la acción «Recibir» en las tarjetas principales a «Ver más+».
- Aplicar el cambio también en la vista de Envíos y en todos los modos de uso.
- La acción debe seguir abriendo el detalle correspondiente. La confirmación real de recepción permanece dentro del flujo de detalle, disponible sólo para el destino declarado.

### 3. Quitar edición de fecha y hora de recepción

- Retirar del formulario de Envíos los controles que permiten cambiar la fecha y la hora de recepción.
- Eliminar también el espacio, etiquetas y lógica de interfaz que existan únicamente para esos controles, para simplificar el formulario.
- No cambiar la fecha y hora registradas por el sistema para el envío o la recepción ni las reglas de historial y retención. La eliminación se refiere a la edición manual desde el formulario.

### 4. Confirmación de recepción y animación

- Cambiar el texto del botón «Confirmar recepción y finalizar» a **«Ya lo recibí!!»**.
- Al pulsarlo, mostrar una animación breve y clara de éxito, como celebración con partículas/confeti que termina en una señal visual de recepción completada.
- La animación debe acompañar el resultado exitoso de la confirmación, evitar bloquear la interacción y respetar `prefers-reduced-motion`.
- Evitar una animación continua o un bucle que siga ejecutándose después de finalizar la confirmación.
- El código de canvas incluido en la solicitud sirve como referencia conceptual para partículas que salen del centro y caen. No copiarlo literalmente: adaptarlo al ciclo de vida y arquitectura existentes, evitar variables globales y `window.onload`, y asegurar limpieza del canvas, temporizadores y `requestAnimationFrame` al desmontar o cerrar la vista.
- Usar colores y tratamiento visual coherentes con Rapicostura. La animación no debe oscurecer el contenido ni ocultar el estado final.

## Referencias visuales

Las tres capturas adjuntas en la solicitud señalan:

1. El botón de confirmación de recepción que debe renombrarse y acompañarse de una animación.
2. La fecha/hora y acción de las tarjetas principales.
3. La fecha/hora visible en la vista de detalle.

Los círculos y trazos rojos son anotaciones de ubicación, no elementos que deban aparecer en la interfaz.

## Criterios de aceptación

- La fecha y hora de las tarjetas y vistas de detalle se perciben aproximadamente al doble de tamaño y en negrita, sin desbordes en las resoluciones compatibles.
- Las tarjetas muestran «Ver más+» en lugar de «Recibir» y conservan la navegación al detalle en Recepción y Envíos, tanto para dueña como para costurera.
- El formulario de Envíos ya no ofrece controles manuales para fecha u hora de recepción y mantiene el resto del flujo funcional.
- La confirmación muestra «Ya lo recibí!!» y, cuando la operación termina correctamente, presenta la animación de éxito. Con movimiento reducido activo, la animación se omite o se reduce a una señal estática breve.
- Se mantienen las reglas vigentes: sólo el destino declarado puede confirmar la recepción; los registros de fecha/hora los determina el sistema y la retención de historial/evidencias vence 72 horas desde `confirmedAt` del servidor.

## Límites

Este documento registra el alcance solicitado. No implica que los cambios estén implementados. No modificar ni completar las pantallas de Bot WhatsApp o «Postulantes y visitas» como parte de esta entrega.
