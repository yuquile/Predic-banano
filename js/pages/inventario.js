// Sistema de Gestión de Inventario y Postcosecha con SweetAlert2
class SistemaInventario {
    constructor() {
        this.lotes = this.cargarDatos() || [];
        this.loteEditando = null;
        this.inicializar();
    }

    inicializar() {
        this.actualizarTabla();
        this.actualizarEstadisticas();
        this.configurarEventos();
        this.establecerFechaActual();
    }

    configurarEventos() {
        // Evento del formulario
        document.getElementById('formLote').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarLote();
        });

        // Cerrar modal al hacer clic fuera
        document.getElementById('modalLote').addEventListener('click', (e) => {
            if (e.target.id === 'modalLote') {
                this.cerrarModal();
            }
        });

        // Escape para cerrar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cerrarModal();
            }
        });

        // Evento para mostrar/ocultar selector de plagas específicas
        document.addEventListener('change', (e) => {
            if (e.target.id === 'plagas') {
                this.manejarCambioPlagas(e.target.value);
            }
        });
    }

    manejarCambioPlagas(valorPlagas) {
        const contenedorPlagasEspecificas = document.getElementById('contenedorPlagasEspecificas');
        const selectPlagasEspecificas = document.getElementById('plagasEspecificas');
        
        if (valorPlagas === 'plaga') {
            contenedorPlagasEspecificas.style.display = 'block';
            selectPlagasEspecificas.required = true;
        } else {
            contenedorPlagasEspecificas.style.display = 'none';
            selectPlagasEspecificas.required = false;
            selectPlagasEspecificas.value = '';
        }
    }

    establecerFechaActual() {
        const hoy = new Date().toISOString().split('T')[0];
        document.getElementById('fechaCosecha').value = hoy;
    }

    // Gestión de datos
    cargarDatos() {
        try {
            // Cargar desde localStorage
            const datosGuardados = localStorage.getItem('inventario_postcosecha');
            if (datosGuardados) {
                const datos = JSON.parse(datosGuardados);
                console.log('Datos cargados desde localStorage:', datos.length, 'lotes');
                return datos;
            }
            
            // Si no hay datos guardados, devolver array vacío
            console.log('No hay datos guardados, iniciando array vacío');
            return [];
        } catch (error) {
            console.error('Error al cargar datos:', error);
            // Si hay error, intentar limpiar localStorage corrupto
            localStorage.removeItem('inventario_postcosecha');
            return [];
        }
    }

    guardarDatos() {
        try {
            // Guardar en localStorage
            localStorage.setItem('inventario_postcosecha', JSON.stringify(this.lotes));
            console.log('✅ Datos guardados en localStorage:', this.lotes.length, 'lotes');
            
            // También mantener en memoria como respaldo
            window.__inventarioData = [...this.lotes];
        } catch (error) {
            console.error('❌ Error al guardar datos:', error);
            
            // Si localStorage está lleno, mostrar alerta
            if (error.name === 'QuotaExceededError') {
                Swal.fire({
                    title: 'Almacenamiento lleno',
                    text: 'No se pueden guardar más datos. Considere exportar y limpiar datos antiguos.',
                    icon: 'warning'
                });
            }
        }
    }

    // CRUD de lotes
    agregarLote(lote) {
        try {
            // Generar ID único
            lote.id = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
            lote.fechaRegistro = new Date().toISOString();
            
            // Agregar al array
            this.lotes.push(lote);
            
            // Guardar datos
            this.guardarDatos();
            
            // Actualizar interfaz
            this.actualizarTabla();
            this.actualizarEstadisticas();
            
            console.log('Lote agregado:', lote.codigoLote, '- Total lotes:', this.lotes.length);
        } catch (error) {
            console.error('Error al agregar lote:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo agregar el lote. Intente nuevamente.',
                icon: 'error'
            });
        }
    }

    editarLote(id, loteActualizado) {
        try {
            const index = this.lotes.findIndex(l => l.id === id);
            if (index !== -1) {
                loteActualizado.id = id;
                loteActualizado.fechaRegistro = this.lotes[index].fechaRegistro;
                this.lotes[index] = loteActualizado;
                
                this.guardarDatos();
                this.actualizarTabla();
                this.actualizarEstadisticas();
                
                console.log('Lote editado:', loteActualizado.codigoLote);
            }
        } catch (error) {
            console.error('Error al editar lote:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el lote. Intente nuevamente.',
                icon: 'error'
            });
        }
    }

    async eliminarLote(id) {
        try {
            const lote = this.lotes.find(l => l.id === id);
            if (!lote) {
                Swal.fire('Error', 'Lote no encontrado', 'error');
                return;
            }
            
            const result = await Swal.fire({
                title: '¿Está seguro?',
                html: `¿Desea eliminar el lote <strong>${lote.codigoLote}</strong>?<br><small>Esta acción no se puede deshacer</small>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            });

            if (result.isConfirmed) {
                // Filtrar el lote a eliminar
                this.lotes = this.lotes.filter(l => l.id !== id);
                
                // Guardar cambios
                this.guardarDatos();
                this.actualizarTabla();
                this.actualizarEstadisticas();
                
                console.log('Lote eliminado:', lote.codigoLote, '- Total lotes:', this.lotes.length);
                
                Swal.fire({
                    title: '¡Eliminado!',
                    text: `El lote ${lote.codigoLote} ha sido eliminado correctamente`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Error al eliminar lote:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar el lote. Intente nuevamente.',
                icon: 'error'
            });
        }
    }

    // Funciones del modal
    abrirModal(lote = null) {
        const modal = document.getElementById('modalLote');
        const titulo = document.getElementById('modalTitulo');
        
        if (lote) {
            // Modo edición
            titulo.textContent = 'Editar Lote';
            this.loteEditando = lote.id;
            this.llenarFormulario(lote);
        } else {
            // Modo creación
            titulo.textContent = 'Agregar Nuevo Lote';
            this.loteEditando = null;
            this.limpiarFormulario();
            this.establecerFechaActual();
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    cerrarModal() {
        const modal = document.getElementById('modalLote');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.limpiarFormulario();
        this.loteEditando = null;
    }

    llenarFormulario(lote) {
        document.getElementById('codigoLote').value = lote.codigoLote;
        document.getElementById('finca').value = lote.finca;
        document.getElementById('fechaCosecha').value = lote.fechaCosecha;
        document.getElementById('peso').value = lote.peso;
        document.getElementById('estado').value = lote.estado;
        document.getElementById('calidad').value = lote.calidad;
        document.getElementById('color').value = lote.color;
        document.getElementById('tamano').value = lote.tamano;
        document.getElementById('plagas').value = lote.plagas;
        document.getElementById('notas').value = lote.notas || '';
        
        // Manejar campo de plagas específicas
        if (lote.plagas === 'plaga' && lote.plagaEspecifica) {
            document.getElementById('plagasEspecificas').value = lote.plagaEspecifica;
            this.manejarCambioPlagas('plaga');
        }
    }

    limpiarFormulario() {
        document.getElementById('formLote').reset();
        document.getElementById('estado').value = 'disponible';
        document.getElementById('color').value = 'verde';
        document.getElementById('tamano').value = 'mediano';
        document.getElementById('plagas').value = 'ninguna';
        
        // Ocultar campo de plagas específicas
        const contenedorPlagasEspecificas = document.getElementById('contenedorPlagasEspecificas');
        if (contenedorPlagasEspecificas) {
            contenedorPlagasEspecificas.style.display = 'none';
            document.getElementById('plagasEspecificas').required = false;
        }
    }

    async guardarLote() {
        const formulario = document.getElementById('formLote');
        if (!formulario.checkValidity()) {
            formulario.reportValidity();
            return;
        }

        const lote = {
            codigoLote: document.getElementById('codigoLote').value.trim(),
            finca: document.getElementById('finca').value.trim(),
            fechaCosecha: document.getElementById('fechaCosecha').value,
            peso: parseFloat(document.getElementById('peso').value),
            estado: document.getElementById('estado').value,
            calidad: document.getElementById('calidad').value,
            color: document.getElementById('color').value,
            tamano: document.getElementById('tamano').value,
            plagas: document.getElementById('plagas').value,
            notas: document.getElementById('notas').value.trim()
        };

        // Si hay plaga específica, agregarla al objeto
        if (lote.plagas === 'plaga') {
            const plagaEspecifica = document.getElementById('plagasEspecificas').value;
            if (!plagaEspecifica) {
                Swal.fire({
                    title: 'Campo requerido',
                    text: 'Por favor seleccione el tipo de plaga específica.',
                    icon: 'warning',
                    confirmButtonText: 'Entendido'
                });
                return;
            }
            lote.plagaEspecifica = plagaEspecifica;
        }

        // Validar código único (excepto en edición)
        const codigoExiste = this.lotes.some(l => 
            l.codigoLote.toLowerCase() === lote.codigoLote.toLowerCase() && 
            l.id !== this.loteEditando
        );

        if (codigoExiste) {
            Swal.fire({
                title: 'Código duplicado',
                text: 'Ya existe un lote con este código. Por favor, use un código diferente.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        if (this.loteEditando) {
            this.editarLote(this.loteEditando, lote);
            
            Swal.fire({
                title: '¡Actualizado!',
                text: `El lote ${lote.codigoLote} ha sido actualizado correctamente`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            this.agregarLote(lote);
            
            Swal.fire({
                title: '¡Agregado!',
                text: `El lote ${lote.codigoLote} ha sido agregado correctamente`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }

        this.cerrarModal();
    }

    // Actualización de la interfaz
    actualizarTabla() {
        const tbody = document.getElementById('tablaLotes');
        const mensajeVacio = document.getElementById('mensajeVacio');
        
        if (this.lotes.length === 0) {
            tbody.innerHTML = '';
            mensajeVacio.style.display = 'block';
            return;
        }

        mensajeVacio.style.display = 'none';
        
        const lotesOrdenados = this.obtenerLotesOrdenados();
        
        tbody.innerHTML = lotesOrdenados.map(lote => `
            <tr>
                <td><strong>${lote.codigoLote}</strong></td>
                <td>${lote.finca}</td>
                <td>${this.formatearFecha(lote.fechaCosecha)}</td>
                <td>${lote.peso.toFixed(1)} kg</td>
                <td><span class="estado-badge estado-${lote.estado}">${this.formatearEstado(lote.estado)}</span></td>
                <td><span class="calidad-badge calidad-${lote.calidad}">${this.formatearCalidad(lote.calidad)}</span></td>
                <td><span class="color-badge">${this.formatearColor(lote.color)}</span></td>
                <td>${this.formatearTamano(lote.tamano)}</td>
                <td><span class="plagas-badge plagas-${lote.plagas}">${this.formatearPlagas(lote)}</span></td>
                <td><span class="dias-almacenado ${this.obtenerClaseDias(lote.fechaCosecha)}">${this.calcularDiasAlmacenado(lote.fechaCosecha)} días</span></td>
                <td>
                    <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                        <button class="btn btn-small btn-secondary" onclick="sistemaInventario.abrirModal(${JSON.stringify(lote).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small ${lote.estado === 'disponible' ? 'btn-warning' : 'btn-success'}" onclick="sistemaInventario.cambiarEstado('${lote.id}')">
                            <i class="fas ${lote.estado === 'disponible' ? 'fa-clock' : 'fa-check'}"></i>
                        </button>
                        <button class="btn btn-small btn-danger" onclick="sistemaInventario.eliminarLote('${lote.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    actualizarEstadisticas() {
        const totalLotes = this.lotes.length;
        const pesoTotal = this.lotes.reduce((total, lote) => total + lote.peso, 0);
        const disponibles = this.lotes.filter(l => l.estado === 'disponible').length;
        const reservados = this.lotes.filter(l => l.estado === 'reservado').length;
        const exportados = this.lotes.filter(l => l.estado === 'exportado').length;

        document.getElementById('totalLotes').textContent = totalLotes;
        document.getElementById('pesoTotal').textContent = `${pesoTotal.toFixed(1)} kg`;
        document.getElementById('disponibles').textContent = disponibles;
        document.getElementById('reservados').textContent = reservados;
        document.getElementById('exportados').textContent = exportados;
    }

    // Filtros y ordenamiento
    filtrarLotes() {
        this.actualizarTabla();
    }

    obtenerLotesOrdenados() {
        let lotesFiltrados = [...this.lotes];

        // Aplicar filtros
        const busqueda = document.getElementById('busqueda').value.toLowerCase();
        const filtroEstado = document.getElementById('filtroEstado').value;
        const filtroCalidad = document.getElementById('filtroCalidad').value;

        if (busqueda) {
            lotesFiltrados = lotesFiltrados.filter(lote =>
                lote.codigoLote.toLowerCase().includes(busqueda) ||
                lote.finca.toLowerCase().includes(busqueda)
            );
        }

        if (filtroEstado) {
            lotesFiltrados = lotesFiltrados.filter(lote => lote.estado === filtroEstado);
        }

        if (filtroCalidad) {
            lotesFiltrados = lotesFiltrados.filter(lote => lote.calidad === filtroCalidad);
        }

        // Aplicar ordenamiento
        const ordenamiento = document.getElementById('ordenamiento').value;
        
        switch (ordenamiento) {
            case 'fecha_asc':
                lotesFiltrados.sort((a, b) => new Date(a.fechaCosecha) - new Date(b.fechaCosecha));
                break;
            case 'fecha_desc':
                lotesFiltrados.sort((a, b) => new Date(b.fechaCosecha) - new Date(a.fechaCosecha));
                break;
            case 'peso_desc':
                lotesFiltrados.sort((a, b) => b.peso - a.peso);
                break;
            case 'lote':
                lotesFiltrados.sort((a, b) => a.codigoLote.localeCompare(b.codigoLote));
                break;
        }

        return lotesFiltrados;
    }

    ordenarLotes() {
        this.actualizarTabla();
    }

    // Funciones auxiliares
    async cambiarEstado(id) {
        try {
            const lote = this.lotes.find(l => l.id === id);
            if (!lote) return;

            let nuevoEstado;
            let mensaje;
            let icono;

            switch (lote.estado) {
                case 'disponible':
                    nuevoEstado = 'reservado';
                    mensaje = '¿Desea marcar este lote como <strong>reservado</strong>?';
                    icono = 'warning';
                    break;
                case 'reservado':
                    nuevoEstado = 'exportado';
                    mensaje = '¿Desea marcar este lote como <strong>exportado</strong>?';
                    icono = 'question';
                    break;
                case 'exportado':
                    nuevoEstado = 'disponible';
                    mensaje = '¿Desea marcar este lote como <strong>disponible</strong> nuevamente?';
                    icono = 'info';
                    break;
            }

            const result = await Swal.fire({
                title: 'Cambiar estado',
                html: `Lote: <strong>${lote.codigoLote}</strong><br>${mensaje}`,
                icon: icono,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, cambiar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                lote.estado = nuevoEstado;
                this.guardarDatos();
                this.actualizarTabla();
                this.actualizarEstadisticas();

                console.log('Estado cambiado:', lote.codigoLote, 'a', nuevoEstado);

                // Toast de confirmación
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                });

                Toast.fire({
                    icon: 'success',
                    title: `Estado cambiado a ${this.formatearEstado(nuevoEstado)}`
                });
            }
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cambiar el estado. Intente nuevamente.',
                icon: 'error'
            });
        }
    }

    calcularDiasAlmacenado(fechaCosecha) {
        const hoy = new Date();
        const cosecha = new Date(fechaCosecha);
        const diferencia = Math.floor((hoy - cosecha) / (1000 * 60 * 60 * 24));
        return Math.max(0, diferencia);
    }

    obtenerClaseDias(fechaCosecha) {
        const dias = this.calcularDiasAlmacenado(fechaCosecha);
        if (dias <= 7) return 'dias-fresh';
        if (dias <= 14) return 'dias-warning';
        return 'dias-danger';
    }

    formatearFecha(fecha) {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    formatearEstado(estado) {
        const estados = {
            'disponible': 'Disponible',
            'reservado': 'Reservado',
            'exportado': 'Exportado'
        };
        return estados[estado] || estado;
    }

    formatearCalidad(calidad) {
        const calidades = {
            'excelente': 'Excelente',
            'buena': 'Buena',
            'regular': 'Regular',
            'rechazada': 'Rechazada'
        };
        return calidades[calidad] || calidad;
    }

    formatearColor(color) {
        const colores = {
            'verde': 'Verde',
            'amarillo': 'Amarillo',
            'rojo': 'Rojo',
            'mixto': 'Mixto'
        };
        return colores[color] || color;
    }

    formatearTamano(tamano) {
        const tamanos = {
            'pequeño': 'Pequeño',
            'mediano': 'Mediano',
            'grande': 'Grande',
            'extra_grande': 'Extra Grande'
        };
        return tamanos[tamano] || tamano;
    }

    formatearPlagas(lote) {
        if (lote.plagas === 'ninguna') {
            return 'Ninguna';
        } else if (lote.plagas === 'plaga' && lote.plagaEspecifica) {
            const plagasTexto = {
                'sigatoka_negra': 'Sigatoka Negra',
                'picudo_negro': 'Picudo Negro',
                'nematodos': 'Nematodos'
            };
            return plagasTexto[lote.plagaEspecifica] || lote.plagaEspecifica;
        } else {
            return 'Plaga';
        }
    }

    // Exportar datos
    async exportarDatos() {
        if (this.lotes.length === 0) {
            Swal.fire({
                title: 'Sin datos',
                text: 'No hay datos para exportar',
                icon: 'info',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        // Mostrar loading
        Swal.fire({
            title: 'Exportando datos...',
            html: 'Preparando archivo CSV',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Simular proceso de exportación
        setTimeout(() => {
            const datosExportar = this.lotes.map(lote => ({
                'Código Lote': lote.codigoLote,
                'Finca': lote.finca,
                'Fecha Cosecha': lote.fechaCosecha,
                'Peso (kg)': lote.peso,
                'Estado': this.formatearEstado(lote.estado),
                'Calidad': this.formatearCalidad(lote.calidad),
                'Color': this.formatearColor(lote.color),
                'Tamaño': this.formatearTamano(lote.tamano),
                'Plagas': this.formatearPlagas(lote.plagas),
                'Días Almacenado': this.calcularDiasAlmacenado(lote.fechaCosecha),
                'Notas': lote.notas || ''
            }));

            const csv = this.convertirACSV(datosExportar);
            this.descargarCSV(csv, 'inventario_postcosecha.csv');

            Swal.fire({
                title: '¡Exportado!',
                text: `Se han exportado ${this.lotes.length} registros correctamente`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }, 1000);
    }

    convertirACSV(datos) {
        if (datos.length === 0) return '';

        const encabezados = Object.keys(datos[0]);
        const filas = datos.map(fila => 
            encabezados.map(campo => {
                const valor = fila[campo];
                // Escapar comillas y envolver en comillas si contiene comas
                return typeof valor === 'string' && (valor.includes(',') || valor.includes('"') || valor.includes('\n'))
                    ? `"${valor.replace(/"/g, '""')}"`
                    : valor;
            }).join(',')
        );

        return [encabezados.join(','), ...filas].join('\n');
    }

    descargarCSV(csv, nombreArchivo) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', nombreArchivo);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Generar datos de ejemplo para demostración
    async generarDatosEjemplo() {
        const ejemplos = [
            {
                codigoLote: 'BAN-2024-001',
                finca: 'Finca San José',
                fechaCosecha: '2024-07-20',
                peso: 150.5,
                estado: 'disponible',
                calidad: 'excelente',
                color: 'verde',
                tamano: 'grande',
                plagas: 'ninguna',
                notas: 'Lote de banano Cavendish, excelente calidad'
            },
            {
                codigoLote: 'BAN-2024-002',
                finca: 'Finca El Paraíso',
                fechaCosecha: '2024-07-18',
                peso: 85.2,
                estado: 'reservado',
                calidad: 'buena',
                color: 'amarillo',
                tamano: 'mediano',
                plagas: 'plaga',
                plagaEspecifica: 'sigatoka_negra',
                notas: 'Tratamiento aplicado para Sigatoka, reservado para mercado local'
            },
            {
                codigoLote: 'BAN-2024-003',
                finca: 'Finca La Esperanza',
                fechaCosecha: '2024-07-15',
                peso: 200.0,
                estado: 'exportado',
                calidad: 'excelente',
                color: 'verde',
                tamano: 'extra_grande',
                plagas: 'ninguna',
                notas: 'Exportado a Estados Unidos - Premium quality'
            }
        ];

        // Mostrar notificación de datos de ejemplo
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

        Toast.fire({
            icon: 'info',
            title: 'Datos de ejemplo de banano cargados'
        });

        ejemplos.forEach(ejemplo => this.agregarLote(ejemplo));
    }

    // Método para limpiar todos los datos (útil para development/testing)
    limpiarTodosLosDatos() {
        Swal.fire({
            title: '⚠️ ¡Atención!',
            html: 'Esta acción eliminará <strong>TODOS</strong> los lotes guardados.<br><small>Esta acción no se puede deshacer</small>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar todo',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Limpiar localStorage
                localStorage.removeItem('inventario_postcosecha');
                
                // Limpiar memoria
                this.lotes = [];
                window.__inventarioData = [];
                
                // Actualizar interfaz
                this.actualizarTabla();
                this.actualizarEstadisticas();
                
                Swal.fire({
                    title: '¡Datos eliminados!',
                    text: 'Todos los datos han sido eliminados correctamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                console.log('🗑️ Todos los datos han sido eliminados');
            }
        });
    }
}

// Funciones globales para eventos onclick
let sistemaInventario;

function abrirModal(lote = null) {
    sistemaInventario.abrirModal(lote);
}

function cerrarModal() {
    sistemaInventario.cerrarModal();
}

function filtrarLotes() {
    sistemaInventario.filtrarLotes();
}

function ordenarLotes() {
    sistemaInventario.ordenarLotes();
}

function exportarDatos() {
    sistemaInventario.exportarDatos();
}

// Función para limpiar datos (útil para testing)
function limpiarDatos() {
    if (sistemaInventario) {
        sistemaInventario.limpiarTodosLosDatos();
    }
}

// Inicializar el sistema cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando sistema de inventario...');
    
    sistemaInventario = new SistemaInventario();
    
    const totalLotes = sistemaInventario.lotes.length;
    console.log('📦 Sistema iniciado con', totalLotes, 'lotes cargados');
    
    // Solo generar datos de ejemplo si NO hay ningún dato guardado
    if (totalLotes === 0) {
        console.log('📝 No hay datos guardados, generando datos de ejemplo...');
        sistemaInventario.generarDatosEjemplo();
    } else {
        console.log('✅ Datos existentes cargados correctamente desde localStorage');
        
        // Mostrar toast de bienvenida con datos cargados
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });

        Toast.fire({
            icon: 'success',
            title: `${totalLotes} lotes cargados correctamente`
        });
    }
});