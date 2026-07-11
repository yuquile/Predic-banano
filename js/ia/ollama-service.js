/**
 * Servicio de Inteligencia Artificial Local usando Ollama
 * Endpoint por defecto: http://localhost:11434/api/chat
 */

// Mensaje de sistema base para guiar la personalidad de la IA
const SYSTEM_PROMPT = `Eres un ingeniero agrónomo experto en cultivo de banano en Ecuador. 
Analiza los datos de la finca proporcionados y da recomendaciones prácticas, claras y específicas. 
Responde en español, usando formato Markdown con encabezados cortos cuando sea útil.`;

/**
 * Lee los datos reales del proyecto desde localStorage y construye un contexto 
 * detallado para que la IA sepa el estado actual de la finca.
 */
export async function buildCropContext() {
    let context = "ESTADO ACTUAL DE LA FINCA:\n\n";

    // 1. Datos de Control de Plagas
    try {
        const plagasData = JSON.parse(localStorage.getItem('pestControlData')) || [];
        if (plagasData.length > 0) {
            const recientes = plagasData.slice(0, 3); // Últimos 3 registros
            context += "--- PLAGAS Y ENFERMEDADES RECIENTES ---\n";
            recientes.forEach(p => {
                context += `- Fecha: ${p.date}, Sector: ${p.sector}, Plaga: ${p.pestType}, Nivel: ${p.severity}\n`;
            });
        } else {
            context += "No hay reportes recientes de plagas.\n";
        }
    } catch (e) {
        console.error("Error leyendo plagas", e);
    }

    context += "\n";

    // 2. Inventario y Postcosecha
    try {
        const inventario = JSON.parse(localStorage.getItem('inventario_postcosecha')) || [];
        if (inventario.length > 0) {
            const lotesActivos = inventario.filter(l => l.estado !== 'Despachado');
            context += "--- INVENTARIO ACTUAL (LOTES) ---\n";
            context += `Total de lotes en almacén/proceso: ${lotesActivos.length}\n`;
            lotesActivos.slice(0,3).forEach(l => {
                context += `- Lote ${l.idLote}: ${l.cajas} cajas tipo ${l.tipoCaja} (${l.estado})\n`;
            });
        }
    } catch (e) {
        console.error("Error leyendo inventario", e);
    }

    context += "\nPor favor, basándote en esta información, dame tus mejores recomendaciones agrónomas generales para esta semana.";
    return context;
}

/**
 * Envía el historial de mensajes a Ollama y procesa la respuesta en formato Streaming.
 * 
 * @param {Array} messagesHistory - Array de mensajes [{role: "user"|"assistant"|"system", content: "..."}]
 * @param {Function} onChunkCallback - Función que se ejecuta por cada pedazo de texto recibido
 * @param {Function} onErrorCallback - Función que se ejecuta si hay error de conexión
 */
export async function streamOllamaChat(messagesHistory, onChunkCallback, onErrorCallback) {
    // Asegurarse de que el primer mensaje sea el system prompt
    if (messagesHistory.length === 0 || messagesHistory[0].role !== 'system') {
        messagesHistory.unshift({ role: 'system', content: SYSTEM_PROMPT });
    }

    try {
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3.1:8b',
                messages: messagesHistory,
                stream: true
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunkStr = decoder.decode(value, { stream: true });
            const lines = chunkStr.split('\n').filter(line => line.trim() !== '');
            
            for (const line of lines) {
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.message && parsed.message.content) {
                        onChunkCallback(parsed.message.content);
                    }
                } catch (e) {
                    console.error("Error parseando chunk de Ollama:", e, line);
                }
            }
        }
    } catch (error) {
        console.error("Error en streamOllamaChat:", error);
        onErrorCallback("No se pudo conectar con el motor de IA local. Verifica que Ollama esté corriendo (`ollama serve`).");
    }
}
