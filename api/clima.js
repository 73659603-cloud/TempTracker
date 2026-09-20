export default async function handler(req, res) {
    // 1. Capturar el parámetro de búsqueda (coordenadas o ciudad) que envía el frontend
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Falta el parámetro de búsqueda' });
    }

    // 2. Extraer la llave secreta desde el entorno de Vercel
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key no configurada en Vercel' });
    }

    // 3. Construir la URL segura hacia WeatherAPI (incluyendo idioma español)
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${q}&lang=es`;

    try {
        // 4. Ejecutar la petición desde el servidor
        const response = await fetch(url);
        const data = await response.json();

        // 5. Manejar errores que devuelva WeatherAPI (ej. ciudad no encontrada)
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        // 6. Enviar los datos exitosos a nuestro frontend
        res.status(200).json(data);

    } catch (error) {
        console.error("Error en el servidor Serverless:", error);
        res.status(500).json({ error: 'Fallo al procesar la solicitud del clima' });
    }
}