# Plan de mejoras de Rapicostura

## 1. Avisos desde la apertura

- Al abrir la aplicación con una sede o usuaria seleccionada, mostrar de inmediato una invitación a activar avisos para esa entidad.
- Solicitar el permiso del navegador al tocar «Activar avisos» y registrar la suscripción Web Push para el destino seleccionado.
- Si el permiso ya está concedido, preparar la suscripción automáticamente al abrir. Si la persona pospone o rechaza el permiso, conservar la opción manual de activación.
- Mantener la reasignación de la suscripción al cambiar de sede o usuaria. No solicitar avisos en modo demostración ni cuando el navegador o la configuración del servidor no los admitan.

## 2. Instalación de la PWA

- Recuperar «Instalar app» en el menú superior derecho.
- Usar el diálogo de instalación del navegador cuando esté disponible. En otros navegadores, mostrar instrucciones breves para instalar desde el menú o para añadir la aplicación a la pantalla de inicio.
- Detectar si la aplicación ya está instalada para evitar una solicitud repetida.

## 3. Edición de usuarias sólo para la dueña

- Mostrar el lápiz «Editar usuarios» únicamente en modo dueña.
- Bloquear también en la API la creación, el cambio de nombre y la eliminación de usuarias para cualquier sesión sin modo dueña.
- Conservar el ID estable de cada usuaria cuando cambie su nombre.

## 4. Interfaz adaptable a escritorio

- Sustituir el marco móvil de ancho fijo por un espacio de trabajo que aproveche el navegador de computadora.
- Adaptar cabecera, selector de entidad, navegación, bandejas, tarjetas, videos, formularios y diálogos a anchos grandes y medianos, sin perder el diseño móvil.
- Mantener botones legibles y utilizables con teclado, ratón y tacto, y evitar recortes y desplazamiento horizontal.

## Criterios de cierre

- Cada cambio funciona en modo trabajadora y, donde corresponde, en modo dueña.
- La instalación y los avisos responden con claridad cuando el navegador no ofrece la función.
- La edición de usuarias requiere la sesión de dueña incluso si alguien llama a la API directamente.
- La aplicación se puede usar de forma cómoda en móvil, tableta y escritorio.
