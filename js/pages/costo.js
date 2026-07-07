        // Configuración de rutas de exportación
const rutasExportacion = {
    'EEUU': { nombre: 'Estados Unidos', precio: 7500, descripcion: 'Ruta marítima a puertos de la Costa Este y Oeste' },
    'Europa': { nombre: 'Europa', precio: 8000, descripcion: 'Ruta marítima a puertos europeos principales' },
    'MedioOriente': { nombre: 'Medio Oriente', precio: 8000, descripcion: 'Ruta marítima a puertos del Golfo Pérsico' }
};

// Precio fijo por caja
const PRECIO_POR_CAJA = 6.50;

// Almacenamiento de datos
let registros = [];

// Función para cargar datos desde localStorage
function cargarDatos() {
    try {
        const datosGuardados = localStorage.getItem('registrosCostosRutas');
        if (datosGuardados) {
            registros = JSON.parse(datosGuardados);
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
        registros = [];
    }
}

// Función para guardar datos en localStorage
function guardarEnLocalStorage() {
    try {
        localStorage.setItem('registrosCostosRutas', JSON.stringify(registros));
    } catch (error) {
        console.error('Error al guardar datos:', error);
        swal({
            title: "⚠️ Error",
            text: "No se pudieron guardar los datos. Verifique el espacio disponible.",
            icon: "error",
            button: "Entendido"
        });
    }
}

function actualizarRutaInfo() {
    const rutaSelect = document.getElementById('rutaExportacion');
    const rutaInfo = document.getElementById('rutaInfo');
    const rutaDestino = document.getElementById('rutaDestino');
    const rutaPrecio = document.getElementById('rutaPrecio');
    
    if (rutaSelect.value) {
        const ruta = rutasExportacion[rutaSelect.value];
        rutaDestino.textContent = `Destino: ${ruta.nombre}`;
        rutaPrecio.textContent = `Costo por contenedor: $${ruta.precio.toLocaleString()}`;
        rutaInfo.style.display = 'block';
        
        // Actualizar el costo por contenedor en el resumen
        document.getElementById('costoPorContenedor').textContent = `$${ruta.precio.toLocaleString()}`;
        
        // Recalcular costo total si ya hay contenedores seleccionados
        calcularCostoTransporte();
    } else {
        rutaInfo.style.display = 'none';
        document.getElementById('costoPorContenedor').textContent = '$0';
        document.getElementById('costoTotalTransporte').textContent = '$0';
    }
}

function calcularCostoTransporte() {
    const rutaSelect = document.getElementById('rutaExportacion');
    const numContenedores = parseInt(document.getElementById('numContenedores').value) || 0;
    const cantidadCajas = parseInt(document.getElementById('cantidadCajas').value) || 0;
    
    if (rutaSelect.value && numContenedores > 0) {
        const ruta = rutasExportacion[rutaSelect.value];
        const costoTotal = ruta.precio * numContenedores;
        
        document.getElementById('totalContenedores').textContent = numContenedores;
        document.getElementById('costoTotalTransporte').textContent = `$${costoTotal.toLocaleString()}`;
        
        if (cantidadCajas > 0) {
            document.getElementById('cajasPorContenedor').textContent = cantidadCajas.toLocaleString();
            document.getElementById('totalCajas').textContent = (cantidadCajas * numContenedores).toLocaleString();
        } else {
            document.getElementById('cajasPorContenedor').textContent = '0';
            document.getElementById('totalCajas').textContent = '0';
        }
    } else {
        document.getElementById('totalContenedores').textContent = '0';
        document.getElementById('costoTotalTransporte').textContent = '$0';
        document.getElementById('cajasPorContenedor').textContent = '0';
        document.getElementById('totalCajas').textContent = '0';
    }
    
    // Calcular precio total automáticamente
    calcularPrecioTotal();
}

function calcularPrecioTotal() {
    const cantidadCajas = parseInt(document.getElementById('cantidadCajas').value) || 0;
    const numContenedores = parseInt(document.getElementById('numContenedores').value) || 0;
    
    const totalCajas = cantidadCajas * numContenedores;
    const ingresosTotales = totalCajas * PRECIO_POR_CAJA;
    
    document.getElementById('totalCajasCalculado').value = totalCajas;
    document.getElementById('ingresosTotales').value = ingresosTotales.toFixed(2);
    
    // Actualizar también el resumen de contenedores
    if (cantidadCajas > 0 && numContenedores > 0) {
        document.getElementById('cajasPorContenedor').textContent = cantidadCajas.toLocaleString();
        document.getElementById('totalCajas').textContent = totalCajas.toLocaleString();
    }
}

function calcularRentabilidad() {
    const manoObra = parseFloat(document.getElementById('manoObra').value) || 0;
    const fertilizantes = parseFloat(document.getElementById('fertilizantes').value) || 0;
    const totalCajas = parseInt(document.getElementById('totalCajasCalculado').value) || 0;
    const ingresosTotales = parseFloat(document.getElementById('ingresosTotales').value) || 0;
    const rutaSelect = document.getElementById('rutaExportacion');
    const numContenedores = parseInt(document.getElementById('numContenedores').value) || 0;
    const cantidadCajas = parseInt(document.getElementById('cantidadCajas').value) || 0;

    if (totalCajas === 0 || ingresosTotales === 0 || !rutaSelect.value || numContenedores === 0 || cantidadCajas === 0) {
        swal({
            title: "⚠️ Datos Incompletos",
            text: "Por favor, complete todos los campos incluyendo la ruta de exportación, número de contenedores y cantidad de cajas por contenedor.",
            icon: "warning",
            button: "Entendido"
        });
        return;
    }

    const ruta = rutasExportacion[rutaSelect.value];
    const costoTransporte = ruta.precio * numContenedores;
    const totalCostos = manoObra + fertilizantes + costoTransporte;
    const totalIngresos = ingresosTotales;
    const ganancia = totalIngresos - totalCostos;
    const rentabilidad = totalCostos > 0 ? ((ganancia / totalCostos) * 100) : 0;
    const costoPorCaja = totalCajas > 0 ? (totalCostos / totalCajas) : 0;

    // Mostrar resultados
    document.getElementById('totalCostos').textContent = `$${totalCostos.toLocaleString()}`;
    document.getElementById('totalIngresos').textContent = `$${totalIngresos.toLocaleString()}`;
    document.getElementById('rentabilidad').textContent = `${rentabilidad.toFixed(1)}%`;
    
    const gananciaText = document.getElementById('gananciaText');
    if (ganancia >= 0) {
        gananciaText.textContent = `Ganancia: $${ganancia.toLocaleString()}`;
        gananciaText.className = 'profit-positive';
    } else {
        gananciaText.textContent = `Pérdida: $${Math.abs(ganancia).toLocaleString()}`;
        gananciaText.className = 'profit-negative';
    }

    document.getElementById('costoUnitario').textContent = 
        `Costo por caja: $${costoPorCaja.toFixed(2)} | Total cajas: ${totalCajas.toLocaleString()}`;

    // Desglose de costos
    document.getElementById('desgloseCostos').innerHTML = 
        `Desglose: Mano de obra $${manoObra.toLocaleString()} + Fertilizantes $${fertilizantes.toLocaleString()} + Transporte $${costoTransporte.toLocaleString()} | ${cantidadCajas} cajas/contenedor × ${numContenedores} contenedor(es)`;

    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });

    // Mostrar alerta de resultado
    const mensaje = ganancia >= 0 ? 
        `¡Excelente! La exportación a ${ruta.nombre} genera una ganancia de $${ganancia.toLocaleString()} con ${totalCajas.toLocaleString()} cajas` :
        `⚠️ La exportación a ${ruta.nombre} presenta una pérdida de $${Math.abs(ganancia).toLocaleString()}. Revise sus costos.`;

    swal({
        title: ganancia >= 0 ? "✅ Análisis Completado" : "⚠️ Análisis Completado",
        text: mensaje,
        icon: ganancia >= 0 ? "success" : "warning",
        button: "Continuar"
    });
}

function guardarDatos() {
    const finca = document.getElementById('finca').value.trim();
    const rutaExportacion = document.getElementById('rutaExportacion').value;
    
    if (!finca || !rutaExportacion) {
        swal({
            title: "⚠️ Datos Incompletos",
            text: "Por favor, complete el nombre de la finca y la ruta de exportación antes de guardar.",
            icon: "warning",
            button: "Entendido"
        });
        return;
    }

    const manoObra = parseFloat(document.getElementById('manoObra').value) || 0;
    const fertilizantes = parseFloat(document.getElementById('fertilizantes').value) || 0;
    const totalCajas = parseInt(document.getElementById('totalCajasCalculado').value) || 0;
    const ingresosTotales = parseFloat(document.getElementById('ingresosTotales').value) || 0;
    const numContenedores = parseInt(document.getElementById('numContenedores').value) || 0;
    const cantidadCajas = parseInt(document.getElementById('cantidadCajas').value) || 0;

    const ruta = rutasExportacion[rutaExportacion];
    const costoTransporte = ruta.precio * numContenedores;
    const totalCostos = manoObra + fertilizantes + costoTransporte;
    const totalIngresos = ingresosTotales;
    const ganancia = totalIngresos - totalCostos;
    const rentabilidad = totalCostos > 0 ? ((ganancia / totalCostos) * 100) : 0;

    // Verificar si ya existe un registro con la misma finca y ruta
    const existeRegistro = registros.findIndex(r => r.finca === finca && r.rutaExportacion === rutaExportacion);
    
    const registro = {
        id: existeRegistro >= 0 ? registros[existeRegistro].id : Date.now(),
        finca,
        rutaExportacion,
        rutaNombre: ruta.nombre,
        numContenedores,
        cajasPorContenedor: cantidadCajas,
        totalCajas,
        costos: {
            manoObra,
            fertilizantes,
            transporte: costoTransporte,
            total: totalCostos
        },
        ingresos: totalIngresos,
        ganancia,
        rentabilidad,
        fecha: new Date().toLocaleDateString()
    };

    if (existeRegistro >= 0) {
        // Actualizar registro existente
        swal({
            title: "⚠️ Registro Existente",
            text: `Ya existe un registro para ${finca} - ${ruta.nombre}. ¿Desea actualizarlo?`,
            icon: "warning",
            buttons: ["Cancelar", "Actualizar"],
        }).then((willUpdate) => {
            if (willUpdate) {
                registros[existeRegistro] = registro;
                guardarEnLocalStorage();
                swal({
                    title: "✅ Registro Actualizado",
                    text: `El registro para ${finca} - ${ruta.nombre} ha sido actualizado exitosamente.`,
                    icon: "success",
                    button: "Perfecto"
                });
            }
        });
    } else {
        // Nuevo registro
        registros.push(registro);
        guardarEnLocalStorage();
        swal({
            title: "✅ Datos Guardados",
            text: `El registro para ${finca} - ${ruta.nombre} ha sido guardado exitosamente.`,
            icon: "success",
            button: "Perfecto"
        });
    }
}

function mostrarComparacion() {
    if (registros.length === 0) {
        swal({
            title: "📊 Sin Datos",
            text: "No hay registros guardados para mostrar la comparación. Primero guarde algunos datos.",
            icon: "info",
            button: "Entendido"
        });
        return;
    }

    const tbody = document.getElementById('comparisonTableBody');
    tbody.innerHTML = '';

    registros.forEach((registro, index) => {
        const row = document.createElement('tr');
        const rentabilidadClass = registro.ganancia >= 0 ? 'profit-positive' : 'profit-negative';
        
        row.innerHTML = `
            <td>${registro.finca}</td>
            <td>${registro.rutaNombre || registro.rutaExportacion}</td>
            <td>${registro.numContenedores}</td>
            <td>${registro.cajasPorContenedor ? registro.cajasPorContenedor.toLocaleString() : 'N/A'}</td>
            <td>${registro.totalCajas ? registro.totalCajas.toLocaleString() : 'N/A'}</td>
            <td>$${registro.costos.total.toLocaleString()}</td>
            <td>$${registro.ingresos.toLocaleString()}</td>
            <td class="${rentabilidadClass}">$${registro.ganancia.toLocaleString()}</td>
            <td class="${rentabilidadClass}">${registro.rentabilidad.toFixed(1)}%</td>
            <td>${registro.fecha}</td>
            <td>
                <button class="delete-btn" onclick="eliminarRegistro(${index})" title="Eliminar registro">
                    🗑️
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('comparisonSection').style.display = 'block';
    document.getElementById('comparisonSection').scrollIntoView({ behavior: 'smooth' });

    swal({
        title: "📈 Comparación Lista",
        text: `Se muestran ${registros.length} registro(s) para comparación por rutas.`,
        icon: "info",
        button: "Ver Tabla"
    });
}

function eliminarRegistro(index) {
    const registro = registros[index];
    swal({
        title: "🗑️ Eliminar Registro",
        text: `¿Está seguro de que desea eliminar el registro de ${registro.finca} - ${registro.rutaNombre || registro.rutaExportacion}?`,
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"],
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            registros.splice(index, 1);
            guardarEnLocalStorage();
            mostrarComparacion(); // Actualizar la tabla
            swal({
                title: "✅ Registro Eliminado",
                text: "El registro ha sido eliminado exitosamente.",
                icon: "success",
                button: "Entendido"
            });
        }
    });
}

function limpiarFormulario() {
    swal({
        title: "🗑️ Limpiar Formulario",
        text: "¿Está seguro de que desea limpiar todos los campos del formulario?",
        icon: "warning",
        buttons: ["Cancelar", "Limpiar"],
        dangerMode: true,
    }).then((willClear) => {
        if (willClear) {
            document.getElementById('finca').value = '';
            document.getElementById('manoObra').value = '';
            document.getElementById('fertilizantes').value = '';
            document.getElementById('rutaExportacion').value = '';
            document.getElementById('numContenedores').value = '';
            document.getElementById('cantidadCajas').value = '';
            document.getElementById('totalCajasCalculado').value = '';
            document.getElementById('ingresosTotales').value = '';
            
            // Limpiar información de ruta
            document.getElementById('rutaInfo').style.display = 'none';
            document.getElementById('costoPorContenedor').textContent = '$0';
            document.getElementById('totalContenedores').textContent = '0';
            document.getElementById('cajasPorContenedor').textContent = '0';
            document.getElementById('totalCajas').textContent = '0';
            document.getElementById('costoTotalTransporte').textContent = '$0';
            
            document.getElementById('resultsSection').style.display = 'none';
            document.getElementById('comparisonSection').style.display = 'none';

            swal("✅ Formulario limpiado exitosamente", {
                icon: "success",
            });
        }
    });
}

function volverAlDashboard() {
    // Ocultar secciones de resultados y comparación
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('comparisonSection').style.display = 'none';
    
    // Hacer scroll suave al top de la página para mostrar el dashboard
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    swal({
        title: "🏠 Dashboard",
        text: "Ha regresado al panel principal.",
        icon: "info",
        button: "Continuar",
        timer: 1500
    });
}

function eliminarTodosLosDatos() {
    if (registros.length === 0) {
        swal({
            title: "📊 Sin Datos",
            text: "No hay registros guardados para eliminar.",
            icon: "info",
            button: "Entendido"
        });
        return;
    }

    swal({
        title: "⚠️ Eliminar Todos los Datos",
        text: `¿Está seguro de que desea eliminar TODOS los ${registros.length} registros guardados? Esta acción no se puede deshacer.`,
        icon: "warning",
        buttons: ["Cancelar", "Eliminar Todo"],
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            registros = [];
            guardarEnLocalStorage();
            
            // Ocultar secciones si están visibles
            document.getElementById('comparisonSection').style.display = 'none';
            document.getElementById('resultsSection').style.display = 'none';
            
            swal({
                title: "✅ Datos Eliminados",
                text: "Todos los registros han sido eliminados permanentemente.",
                icon: "success",
                button: "Entendido"
            });
        }
    });
}

function agregarDatosEjemplo() {
    const ejemplos = [
        {
            id: 1,
            finca: "Finca El Progreso",
            rutaExportacion: "EEUU",
            rutaNombre: "Estados Unidos",
            numContenedores: 2,
            cajasPorContenedor: 1200,
            totalCajas: 2400,
            costos: { 
                manoObra: 5000, 
                fertilizantes: 3000, 
                transporte: 15000, // 2 contenedores x $7500
                total: 23000 
            },
            ingresos: 15600, // 2400 cajas x $6.50
            ganancia: -7400,
            rentabilidad: -32.2,
            fecha: "15/08/2024"
        },
        {
            id: 2,
            finca: "Finca San José",
            rutaExportacion: "Europa",
            rutaNombre: "Europa",
            numContenedores: 1,
            cajasPorContenedor: 1500,
            totalCajas: 1500,
            costos: { 
                manoObra: 4500, 
                fertilizantes: 2800, 
                transporte: 8000, // 1 contenedor x $8000
                total: 15300 
            },
            ingresos: 9750, // 1500 cajas x $6.50
            ganancia: -5550,
            rentabilidad: -36.3,
            fecha: "20/08/2024"
        },
        {
            id: 3,
            finca: "Finca La Esperanza",
            rutaExportacion: "MedioOriente",
            rutaNombre: "Medio Oriente",
            numContenedores: 3,
            cajasPorContenedor: 1134,
            totalCajas: 3402,
            costos: { 
                manoObra: 5500, 
                fertilizantes: 3200, 
                transporte: 24000, // 3 contenedores x $8000
                total: 32700 
            },
            ingresos: 22113, // 3402 cajas x $6.50
            ganancia: -10587,
            rentabilidad: -32.4,
            fecha: "25/09/2024"
        }
    ];
    
    // Solo agregar ejemplos si no hay datos guardados
    if (registros.length === 0) {
        registros = ejemplos;
        guardarEnLocalStorage();
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos existentes
    cargarDatos();
    
    // Si no hay datos, agregar ejemplos
    if (registros.length === 0) {
        agregarDatosEjemplo();
    }
    
    const mensaje = registros.length > 0 ? 
        `Sistema cargado exitosamente. Tienes ${registros.length} registro(s) guardado(s) con rutas de exportación.` :
        "Sistema cargado exitosamente. ¡Listo para gestionar costos por rutas!";
    
    // Mensaje de bienvenida con información sobre las nuevas funcionalidades
    swal({
        title: "🚢 ¡Sistema de Cajas Actualizado!",
        text: mensaje + " Ahora puedes gestionar costos por cajas. Precio fijo: $6.50/caja. Contenedores: 960-1500 cajas.",
        icon: "success",
        button: "Comenzar"
    });
});

// Prevenir pérdida de datos al cerrar la ventana
window.addEventListener('beforeunload', function(e) {
    if (registros.length > 0) {
        guardarEnLocalStorage();
    }
});

// Función para detectar y manejar errores
window.addEventListener('error', function(e) {
    console.error('Error detectado:', e.error);
    guardarEnLocalStorage(); // Guardar datos antes de cualquier problema
});