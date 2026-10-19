# Rapicostura: estilo compartido de la versión web/PWA

La esencia es **cada puntada une; cada entrega nos conecta**. Interfaz cálida entre compañeras, morado textil, superficies suaves y mensajes breves. La prioridad es distinguir qué se envió, a qué sede y si llegó.

Fuente implementada: `src/web/styles.css`. Tokens: fondo `#20152C`, superficie `#2C2039`, relieve `#372846`, marca lavanda `#B88BDD`, texto `#FAF6FF`, secundario `#C0ADC9`, recibido `#81D3B0`, en camino `#EFC479`, error `#FFA0AE`. Gradiente hero `#593373 → #422652`; tarjeta de video `#70418B → #46285A`. El logo original se conserva completo en `assets/logo.png`.

Tipografía local Trebuchet MS/Arial en controles; Georgia para marca y frase de escritorio. No se descargan fuentes. Títulos principales 23–25 px, cuerpo de controles 12–13 px; secundarios 9–11 px. Revisar escalado real con las usuarias antes de ampliar el producto.

Tarjetas con radio 20 px, campos 12 px, hojas inferiores 25 px. Separación habitual 8/10/12/16/20/24 px. Controles principales de al menos 46 px. Cabecera y navegación permanecen visibles; el contenido tiene scroll propio. El selector de sede ocupa el ancho de cabecera.

Envíos usa el conmutador Recepción/Envíos, chips de estado y tarjetas de ruta. Las dos métricas de dueña preceden a la lista. Videos usa grilla de dos columnas, cubiertas ilustradas, categoría desplegable y búsqueda inmediata. Bot WhatsApp conserva tarjetas de postulantes/visitas claramente ficticias, sin mensajes flotantes.

Los iconos son SVG lineales locales de trazo 1.6 px. No se usa color como única indicación: acompañar con palabras, checks y posición. El camión se mueve suavemente, el humo se desvanece y el check completa su trazo. `prefers-reduced-motion` desactiva el movimiento.

El patrón tiene círculos táctiles pequeños en una matriz 3×3; no debe ampliarse el área sensible a toda la celda cuadrada. Las diagonales se detectan geométricamente y la guía de trazo ayuda a confirmar el recorrido. Es accesible con teclado además de tacto.

En escritorio hay una composición editorial y marco móvil de 440 px. En pantallas de hasta 480 px la aplicación ocupa 100dvh y respeta los márgenes seguros. Ese marco es de presentación, no parte de la navegación móvil.
