# TempTracker - Dashboard de Telemetría Climática

TempTracker es una aplicación web de monitoreo meteorológico en tiempo real, diseñada con un enfoque Mobile-First y una interfaz basada en telemetría de sistemas (Glassmorphism + estética tech).

## 🚀 Innovación Logística (Contexto El Niño)
Más allá de mostrar la temperatura, este proyecto implementa variables extendidas de **WeatherAPI** para prevención ciudadana y logística de negocios locales:
* **Alerta Temprana:** Detección de milímetros de precipitación (lluvia) y niveles críticos de Índice UV.
* **Geolocalización Automática:** El sistema detecta las coordenadas del usuario mediante el API nativo del navegador (`navigator.geolocation`) y realiza una geocodificación inversa para mostrar los datos exactos del distrito actual.

## 🛠️ Arquitectura y Tecnologías
* **Frontend:** HTML5, CSS3 (Grid Layout, Flexbox, Glassmorphism), Vanilla JavaScript.
* **Backend / Seguridad:** Vercel Serverless Functions. La clave de WeatherAPI se oculta en una variable de entorno (`WEATHER_API_KEY`) y es consultada únicamente por la ruta segura `/api/clima`, aislando la lógica del lado del cliente.
* **Diseño:** Adaptación de recursos `.jpg` sólidos mediante contenedores circulares con emisión de luz (box-shadow) para integrarlos a un fondo transparente complejo.

## 📂 Estructura del Proyecto
```text
/
├── api/
│   └── clima.js         # Endpoint Serverless para Vercel
├── imagenes/
│   ├── logo.jpg         # Isotipo de la app
│   ├── buscar.jpg       # Botón de búsqueda
│   ├── ubicacion.jpg    # Pin GPS
│   ├── lluvia.jpg       # Nodo Precipitación
│   ├── uv.jpg           # Nodo Radiación Solar
│   ├── viento.jpg       # Nodo Velocidad del Viento
│   └── humedad.jpg      # Nodo Humedad/Sensación
├── estilos.css          # Reglas de estilo y grillas
├── index.html           # Estructura semántica
└── codigo.js            # Lógica de consumo de interfaz y GPS
