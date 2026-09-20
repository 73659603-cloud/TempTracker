// Referencias al DOM (Núcleo y Buscador)
const inputCiudad = document.getElementById('input-ciudad');
const btnBuscar = document.getElementById('btn-buscar');
const ciudadDisplay = document.querySelector('.ciudad');
const tempDisplay = document.querySelector('.temp');
const climaTexto = document.querySelector('.clima-texto');
const iconoApiContenedor = document.querySelector('.icono-api-placeholder');
const alertaPanel = document.getElementById('alerta-clima');

// Referencias al DOM (Nodos Orbitales)
const precipDisplay = document.querySelector('.precipitacion');
const uvDisplay = document.querySelector('.uv');
const vientoDisplay = document.querySelector('.viento');
const humedadDisplay = document.querySelector('.humedad');

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    iniciarGeolocalizacion();
});

function iniciarGeolocalizacion() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (posicion) => {
                // Si acepta, armamos la consulta con sus coordenadas exactas
                const query = `${posicion.coords.latitude},${posicion.coords.longitude}`;
                obtenerClima(query);
            },
            (error) => {
                console.warn("Acceso a GPS denegado o no disponible. Cargando ubicación por defecto.");
                obtenerClima('Chupaca'); 
            },
            { timeout: 10000 }
        );
    } else {
        obtenerClima('Chupaca');
    }
}

async function obtenerClima(query) {
    ciudadDisplay.textContent = "Sincronizando...";
    
    try {
        // La petición viaja a nuestro propio servidor (Vercel Serverless) para proteger la API Key
        const respuesta = await fetch(`/api/clima?q=${query}`);
        
        if (!respuesta.ok) {
            throw new Error('Error en la obtención de datos climáticos');
        }
        
        const data = await respuesta.json();
        renderizarInterfaz(data);
        inputCiudad.value = ""; // Limpiar buscador tras éxito

    } catch (error) {
        console.error("Error de telemetría:", error);
        ciudadDisplay.textContent = "Error de conexión";
        tempDisplay.textContent = "--°C";
    }
}

function renderizarInterfaz(data) {
    // 1. Actualizar Núcleo Central
    ciudadDisplay.textContent = data.location.name;
    tempDisplay.textContent = `${Math.round(data.current.temp_c)}°C`;
    climaTexto.textContent = data.current.condition.text;
    
    // Inyectar el ícono real de WeatherAPI con un filtro de neón para que encaje en la estética
    iconoApiContenedor.innerHTML = `<img src="https:${data.current.condition.icon}" alt="Clima" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 15px rgba(0,254,186,0.6));">`;
    iconoApiContenedor.style.background = "transparent";
    iconoApiContenedor.style.border = "none";

    // 2. Actualizar Nodos Orbitales
    precipDisplay.textContent = `${data.current.precip_mm} mm`;
    uvDisplay.textContent = data.current.uv;
    vientoDisplay.textContent = `${data.current.wind_kph} km/h`;
    humedadDisplay.textContent = `${data.current.humidity} %`;

    // 3. Evaluar Alerta Temprana (Prevención logística)
    if (data.current.precip_mm > 2.0) {
        alertaPanel.style.display = 'block';
        alertaPanel.textContent = `⚠️ Alerta: Lluvia (${data.current.precip_mm}mm). Ajustar tiempos de despacho y envíos a domicilio (ej. Pollería El Paraíso).`;
    } else if (data.current.uv > 8) {
        alertaPanel.style.display = 'block';
        alertaPanel.textContent = `⚠️ Precaución: Índice UV extremo (${data.current.uv}). Evitar exposición prolongada.`;
        alertaPanel.style.borderLeftColor = "#ffb703";
    } else {
        alertaPanel.style.display = 'none';
    }
}

// Escuchadores de eventos para la búsqueda manual
btnBuscar.addEventListener('click', () => {
    const ciudad = inputCiudad.value.trim();
    if (ciudad) obtenerClima(ciudad);
});

inputCiudad.addEventListener('keypress', (evento) => {
    if (evento.key === 'Enter') {
        const ciudad = inputCiudad.value.trim();
        if (ciudad) obtenerClima(ciudad);
    }
});