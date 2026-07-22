/**
 * Servicio para leer los datos reales de la finca desde el almacenamiento local.
 */

export function buildCropContext() {
    let plagasData = [];
    let inventarioData = [];

    // 1. Datos de Control de Plagas
    try {
        plagasData = JSON.parse(localStorage.getItem('pestControlData')) || [];
    } catch (e) {
        console.error("Error leyendo plagas", e);
    }

    // 2. Inventario y Postcosecha
    try {
        inventarioData = JSON.parse(localStorage.getItem('inventario_postcosecha')) || [];
    } catch (e) {
        console.error("Error leyendo inventario", e);
    }

    return { plagasData, inventarioData };
}
