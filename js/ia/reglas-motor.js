/**
 * Motor de recomendaciones determinístico basado en reglas (Reemplazo de IA).
 */

export const RULES = [
    // === REGLAS DE PLAGAS ===
    {
        id: 'plaga-sigatoka',
        origen: 'plagas',
        prioridad: 'alta',
        condicion: (lote) => lote.plagas && lote.plagas.includes('Sigatoka negra'),
        mensaje: (lote) => `Aplicar fungicida sistémico y revisar drenaje en el lote ${lote.loteNumber || 'Desconocido'}`
    },
    {
        id: 'plaga-mosca',
        origen: 'plagas',
        prioridad: 'media',
        condicion: (lote) => lote.plagas && lote.plagas.includes('Mosca de la fruta'),
        mensaje: (lote) => `Instalar trampas y aplicar control biológico en lote ${lote.loteNumber || 'Desconocido'}`
    },
    {
        id: 'plaga-trips',
        origen: 'plagas',
        prioridad: 'media',
        condicion: (lote) => lote.plagas && lote.plagas.includes('Trips del banano'),
        mensaje: (lote) => `Aplicar insecticida específico para trips en lote ${lote.loteNumber || 'Desconocido'}`
    },
    {
        id: 'plaga-acaros',
        origen: 'plagas',
        prioridad: 'media',
        condicion: (lote) => lote.plagas && lote.plagas.includes('Ácaros'),
        mensaje: (lote) => `Aplicar acaricida dirigido en lote ${lote.loteNumber || 'Desconocido'}`
    },
    {
        id: 'estado-rechazado',
        origen: 'plagas',
        prioridad: 'alta',
        condicion: (lote) => lote.status === 'rejected',
        mensaje: (lote) => `Lote ${lote.loteNumber || 'Desconocido'} fue rechazado, investigar causa raíz`
    },
    {
        id: 'estado-pendiente',
        origen: 'plagas',
        prioridad: 'media',
        condicion: (lote) => lote.status === 'pending',
        mensaje: (lote) => `Lote ${lote.loteNumber || 'Desconocido'} pendiente de tratamiento antes de continuar`
    },
    {
        id: 'racimo-sobremaduro',
        origen: 'plagas',
        prioridad: 'alta',
        condicion: (lote) => lote.estadoRacimo === 'sobremaduro',
        mensaje: (lote) => `Racimo sobremaduro en lote ${lote.loteNumber || 'Desconocido'}, priorizar cosecha/despacho inmediato`
    },
    {
        id: 'racimo-manchas',
        origen: 'plagas',
        prioridad: 'media',
        condicion: (lote) => lote.estadoRacimo === 'con_manchas',
        mensaje: (lote) => `Racimo con manchas en lote ${lote.loteNumber || 'Desconocido'}, revisar calidad antes de aprobar`
    },

    // === REGLAS DE INVENTARIO ===
    {
        id: 'inv-rechazado',
        origen: 'inventario',
        prioridad: 'alta',
        condicion: (lote) => lote.calidad === 'rechazada',
        mensaje: (lote) => `Lote ${lote.codigoLote || 'Desconocido'} marcado como rechazado, investigar causa y evitar pérdida total`
    },
    {
        id: 'inv-plagas',
        origen: 'inventario',
        prioridad: 'alta',
        condicion: (lote) => lote.plagas && lote.plagas !== 'ninguna',
        mensaje: (lote) => `Lote ${lote.codigoLote || 'Desconocido'} tiene plagas detectadas, poner en cuarentena antes de despachar`
    },
    {
        id: 'inv-alerta-tiempo-media',
        origen: 'inventario',
        prioridad: 'media',
        condicion: (lote) => {
            if (lote.estado !== 'disponible' || !lote.fechaCosecha) return false;
            const diffDays = getDaysDiff(lote.fechaCosecha);
            return diffDays >= 4 && diffDays <= 6;
        },
        mensaje: (lote) => `Lote ${lote.codigoLote || 'Desconocido'} lleva ${getDaysDiff(lote.fechaCosecha)} días sin despachar, priorizar salida`
    },
    {
        id: 'inv-alerta-tiempo-alta',
        origen: 'inventario',
        prioridad: 'alta',
        condicion: (lote) => {
            if (lote.estado !== 'disponible' || !lote.fechaCosecha) return false;
            const diffDays = getDaysDiff(lote.fechaCosecha);
            return diffDays >= 7;
        },
        mensaje: (lote) => `Lote ${lote.codigoLote || 'Desconocido'} lleva ${getDaysDiff(lote.fechaCosecha)} días sin despachar — riesgo crítico de sobremaduración`
    },
    {
        id: 'inv-maduracion-optima',
        origen: 'inventario',
        prioridad: 'alta', // Segun requerimiento, media-alta, usaremos alta para simplificar prioridad
        condicion: (lote) => lote.color === 'amarillo' && lote.estado === 'disponible',
        mensaje: (lote) => `Lote ${lote.codigoLote || 'Desconocido'} está en punto óptimo de maduración, despachar antes de que sobremadure`
    }
];

/**
 * Calcula los días de diferencia entre hoy y una fecha dada.
 * Retorna -1 si la fecha es inválida o no existe.
 */
function getDaysDiff(dateString) {
    if (!dateString) return -1;
    const past = new Date(dateString);
    if (isNaN(past.getTime())) return -1;
    const today = new Date();
    const diffTime = today.getTime() - past.getTime(); // Use signed difference instead of absolute to avoid future dates triggering old date rules
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
}

/**
 * Recorre los conjuntos de datos evaluando las reglas y devuelve las alertas ordenadas.
 */
export function evaluarRecomendaciones(plagasData = [], inventarioData = []) {
    let alertas = [];

    // Evaluar reglas de plagas
    plagasData.forEach(lote => {
        RULES.filter(r => r.origen === 'plagas').forEach(regla => {
            if (regla.condicion(lote)) {
                alertas.push({
                    id: regla.id,
                    origen: regla.origen,
                    prioridad: regla.prioridad,
                    mensaje: regla.mensaje(lote),
                    lote: lote.loteNumber || 'Desconocido',
                    fecha: lote.inspectionDate || new Date().toISOString()
                });
            }
        });
    });

    // Evaluar reglas de inventario
    inventarioData.forEach(lote => {
        RULES.filter(r => r.origen === 'inventario').forEach(regla => {
            if (regla.condicion(lote)) {
                alertas.push({
                    id: regla.id,
                    origen: regla.origen,
                    prioridad: regla.prioridad,
                    mensaje: regla.mensaje(lote),
                    lote: lote.codigoLote || 'Desconocido',
                    fecha: lote.fechaCosecha || new Date().toISOString()
                });
            }
        });
    });

    // Ordenar por prioridad: Alta > Media > Baja
    const prioridadVal = { 'alta': 3, 'media': 2, 'baja': 1 };
    alertas.sort((a, b) => prioridadVal[b.prioridad] - prioridadVal[a.prioridad]);

    return alertas;
}
