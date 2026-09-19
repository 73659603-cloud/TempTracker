// Capturamos los elementos del DOM (Buenas prácticas: declararlos arriba)
const inputCiudad = document.getElementById('input-ciudad');
const btnBuscar = document.getElementById('btn-buscar');

// Simulación para probar la estructura sin llamar a la API aún
function simularBusqueda() {
    const ciudad = inputCiudad.value.trim();
    
    if (ciudad === "") {
        console.warn("El input está vacío");
        return;
    }

    console.log(`Estructura lista. Simulando búsqueda para la ciudad: ${ciudad}`);
    
    // Aquí implementaremos la separación de lógica:
    // 1. Llamada a Vercel/WeatherAPI
    // 2. Procesamiento de Errores
    // 3. Renderizado de la UI
}

// Escuchadores de eventos
btnBuscar.addEventListener('click', simularBusqueda);

inputCiudad.addEventListener('keypress', (evento) => {
    if (evento.key === 'Enter') {
        simularBusqueda();
    }
});