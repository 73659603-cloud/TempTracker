const pantallaInicio = document.getElementById('pantalla-inicio');
const dashboard = document.getElementById('dashboard');
const btnIniciar = document.getElementById('btn-iniciar');

const inputCiudad = document.getElementById('input-ciudad');
const btnBuscar = document.getElementById('btn-buscar');
const ciudadDisplay = document.querySelector('.ciudad');
const tempDisplay = document.querySelector('.temp');
const climaTexto = document.querySelector('.clima-texto');
const iconoApiContenedor = document.querySelector('.icono-api-placeholder');
const alertaPanel = document.getElementById('alerta-clima');

const precipDisplay = document.querySelector('.precipitacion');
const uvDisplay = document.querySelector('.uv');
const vientoDisplay = document.querySelector('.viento');
const humedadDisplay = document.querySelector('.humedad');

btnIniciar.addEventListener('click', () => {
    btnIniciar.textContent = "Obteniendo coordenadas...";
    iniciarGeolocalizacion();
});

function iniciarGeolocalizacion() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (posicion) => {
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
        const respuesta = await fetch(`/api/clima?q=${query}`);
        
        if (!respuesta.ok) {
            throw new Error('Error en la obtención de datos climáticos');
        }
        
        const data = await respuesta.json();
        
        pantallaInicio.style.display = 'none';
        dashboard.style.display = 'flex';
        
        renderizarInterfaz(data);
        inputCiudad.value = ""; 

    } catch (error) {
        console.error("Error de telemetría:", error);
        ciudadDisplay.textContent = "Error de conexión";
        tempDisplay.textContent = "--°C";
    }
}

function renderizarInterfaz(data) {
    ciudadDisplay.textContent = data.location.name;
    tempDisplay.textContent = `${Math.round(data.current.temp_c)}°C`;
    climaTexto.textContent = data.current.condition.text;
    
    iconoApiContenedor.innerHTML = `<img src="https:${data.current.condition.icon}" alt="Clima" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 15px rgba(0,254,186,0.6));">`;
    iconoApiContenedor.style.background = "transparent";
    iconoApiContenedor.style.border = "none";

    precipDisplay.textContent = `${data.current.precip_mm} mm`;
    uvDisplay.textContent = data.current.uv;
    vientoDisplay.textContent = `${data.current.wind_kph} km/h`;
    humedadDisplay.textContent = `${data.current.humidity} %`;

    alertaPanel.className = 'alerta-panel';
    
    if (data.current.precip_mm > 5.0) {
        alertaPanel.style.display = 'block';
        alertaPanel.classList.add('alerta-lluvia');
        alertaPanel.textContent = `⚠️ Tormenta detectada (${data.current.precip_mm}mm). Ajustar tiempos de despacho y envíos a domicilio en rutas de Pollería El Paraíso y alrededores.`;
    } else if (data.current.wind_kph > 30.0) {
        alertaPanel.style.display = 'block';
        alertaPanel.classList.add('alerta-viento');
        alertaPanel.textContent = `⚠️ Ráfagas severas (${data.current.wind_kph} km/h). Asegura objetos ligeros en exteriores.`;
    } else if (data.current.uv > 8.0) {
        alertaPanel.style.display = 'block';
        alertaPanel.classList.add('alerta-uv');
        alertaPanel.textContent = `⚠️ Radiación hostil (UV ${data.current.uv}). Bloqueador solar obligatorio, evita el sol directo.`;
    } else if (data.current.humidity > 85.0) {
        alertaPanel.style.display = 'block';
        alertaPanel.classList.add('alerta-humedad');
        alertaPanel.textContent = `⚠️ Condensación crítica (${data.current.humidity}%). Posible neblina densa en la ruta, conduce con cuidado.`;
    } else {
        alertaPanel.style.display = 'none';
    }
}

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