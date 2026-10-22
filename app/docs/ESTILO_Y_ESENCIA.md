# Rapicostura: estilo compartido de la versión web/PWA

La esencia es **cada puntada une; cada entrega nos conecta**. Interfaz cálida entre compañeras, morado textil, superficies suaves y mensajes breves. La prioridad es distinguir qué se envió, a qué sede y si llegó.

Fuente implementada: `src/web/styles.css`. Tokens: fondo `#20152C`, superficie `#2C2039`, relieve `#372846`, marca lavanda `#B88BDD`, texto `#FAF6FF`, secundario `#C0ADC9`, recibido `#81D3B0`, en camino `#EFC479`, error `#FFA0AE`. Gradiente hero `#593373 → #422652`; tarjeta de video `#70418B → #46285A`. El logo original se conserva completo en `assets/logo.png`.

Tipografía local Trebuchet MS/Arial en controles; Georgia para marca y frase de escritorio. No se descargan fuentes. Títulos principales 23–25 px, cuerpo de controles 12–13 px; secundarios 9–11 px. Revisar escalado real con las usuarias antes de ampliar el producto.

Tarjetas con radio 20 px, campos 12 px, hojas inferiores 25 px. Separación habitual 8/10/12/16/20/24 px. Controles principales de al menos 46 px. Cabecera y navegación permanecen visibles; el contenido tiene scroll propio. El selector de sede ocupa el ancho de cabecera.

Envíos usa el conmutador Recepción/Envíos, chips de estado y tarjetas de ruta. Las dos métricas de dueña preceden a la lista. Videos usa grilla de dos columnas, cubiertas ilustradas, categoría desplegable y búsqueda inmediata. Bot WhatsApp conserva una tarjeta de configuración futura y una bandeja vacía de postulantes/visitas, sin mensajes flotantes.

Los iconos son SVG lineales locales de trazo 1.6 px. No se usa color como única indicación: acompañar con palabras, checks y posición. El camión se mueve suavemente, el humo se desvanece y el check completa su trazo. `prefers-reduced-motion` desactiva el movimiento.

El patrón tiene círculos táctiles pequeños en una matriz 3×3; no debe ampliarse el área sensible a toda la celda cuadrada. Las diagonales se detectan geométricamente y la guía de trazo ayuda a confirmar el recorrido. Es accesible con teclado además de tacto.

En escritorio hay una composición editorial y marco móvil de 440 px. En pantallas de hasta 480 px la aplicación ocupa 100dvh y respeta los márgenes seguros. Ese marco es de presentación, no parte de la navegación móvil.

## Ajustes V2 para integración

La marca lavanda se conserva. Cada bandeja modifica sólo acentos y superficies: Envíos usa acento `#DF9FCE`, superficie `#352337` y hero `#673C61 → #442747`; Recepción usa acento `#A8A4F0`, superficie `#29243E` y hero `#454674 → #352747`. Las tarjetas mantienen radios de 20 px y acciones de al menos 44 px. El título de sede entra con opacidad/desplazamiento de 5 px en 220 ms. El selector no requiere confirmación.

El conmutador de bandeja tiene 48 px mínimos de alto y aparece centrado. El menú ⋯ se alinea a la derecha del encabezado. Las portadas de video usan imagen recortada con object-fit cover y un círculo oscuro de reproducción superpuesto.

Error del patrón: rojo `#FF6E80`, fondo `#6A273D`, sacudida breve y reinicio tras 650 ms. La vibración es complementaria y depende del dispositivo. Grabación: punto rojo `#FF526A`, contador de segundos y onda lavanda; el bloqueo de nota se anuncia con candado. Carga: barra de 12 px con degradado `#9C75DC → #EDAFD6`, estado escrito y botones Pausar/Reanudar/Cancelar. Siempre se respeta la preferencia de reducir movimiento.

## Ajustes V3 para integración

El selector «Sede de trabajo / Usuario» ocupa el ancho completo del marco; a la derecha lleva el botón ✏️ Editar usuarios. Las sedes conservan su nombre corto y las usuarias se presentan como «Soy [nombre]». El título de la bandeja repite esa identidad. El conmutador de recepción y envío se ve en ambos modos.

Descripción/observación y audio comparten una barra redondeada. Campo `#242831`, borde `#555967`, texto claro y micrófono circular rosa `#CB6688` de 54 px. Al grabar, el campo se sustituye por contador, punto rojo, onda y guía para cancelar deslizando a la izquierda; deslizar arriba bloquea. El estilo toma únicamente la composición de la referencia de WhatsApp, sin copiar sus marcas. La grabación se puede reproducir y eliminar antes de enviar.

Los avisos PWA usan el icono local de Rapicostura y una acción para abrir la bandeja de recepción. El sistema operativo controla su tipografía y no admite negritas en partes del texto. El botón de activación lleva campana lineal y explica que aplica a la entidad seleccionada.
