// Variables globales
        let selectedStatus = '';
        let inspectionData = [];

        // Función para mostrar loading
        function showLoading() {
            document.getElementById('loadingOverlay').style.display = 'flex';
        }

        // Función para ocultar loading
        function hideLoading() {
            document.getElementById('loadingOverlay').style.display = 'none';
        }

        // Función para cargar datos desde localStorage
        function loadDataFromStorage() {
            try {
                const storedData = localStorage.getItem('pestControlData');
                if (storedData) {
                    inspectionData = JSON.parse(storedData);
                }
            } catch (error) {
                console.error('Error loading data from localStorage:', error);
                inspectionData = [];
            }
        }

        // Función para guardar datos en localStorage
        function saveDataToStorage() {
            try {
                localStorage.setItem('pestControlData', JSON.stringify(inspectionData));
            } catch (error) {
                console.error('Error saving data to localStorage:', error);
                Swal.fire({
                    title: 'Error de almacenamiento',
                    text: 'No se pudieron guardar los datos localmente',
                    icon: 'warning',
                    confirmButtonColor: '#ff9800'
                });
            }
        }

        // Función para ir al dashboard
        function goToDashboard() {
            Swal.fire({
                title: '¿Regresar al Dashboard?',
                text: 'Los datos no guardados se perderán',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#2c5530',
                cancelButtonColor: '#95a5a6',
                confirmButtonText: 'Sí, regresar',
                cancelButtonText: 'Cancelar',
                background: '#fff',
                customClass: {
                    popup: 'animated fadeInDown'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    showLoading();
                    setTimeout(() => {
                        hideLoading();
                        Swal.fire({
                            title: '¡Redirigiendo!',
                            text: 'Regresando al dashboard principal...',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    }, 1000);
                }
            });
        }

        // Función para limpiar todos los datos
        function clearAllData() {
            if (inspectionData.length === 0) {
                Swal.fire({
                    title: 'Sin datos',
                    text: 'No hay datos para limpiar',
                    icon: 'info',
                    confirmButtonColor: '#2196f3'
                });
                return;
            }

            Swal.fire({
                title: '¿Eliminar todos los datos?',
                html: `
                    <p>Esta acción eliminará <strong>${inspectionData.length}</strong> registro(s) de inspección.</p>
                    <br>
                    <p style="color: #f44336; font-weight: bold;">⚠️ Esta acción no se puede deshacer</p>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f44336',
                cancelButtonColor: '#95a5a6',
                confirmButtonText: 'Sí, eliminar todo',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    showLoading();
                    
                    setTimeout(() => {
                        inspectionData = [];
                        saveDataToStorage();
                        
                        updateRecentInspections();
                        updateHistorialTable();
                        updateStats();
                        
                        hideLoading();
                        
                        Swal.fire({
                            title: '¡Datos eliminados!',
                            text: 'Todos los registros han sido eliminados correctamente',
                            icon: 'success',
                            confirmButtonColor: '#4caf50'
                        });
                    }, 1000);
                }
            });
        }

        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            showLoading();
            
            // Cargar datos guardados
            loadDataFromStorage();
            
            // Inicializar fecha actual
            document.getElementById('inspectionDate').value = new Date().toISOString().split('T')[0];
            
            // Actualizar interfaz
            setTimeout(() => {
                updateRecentInspections();
                updateHistorialTable();
                updateStats();
                
                hideLoading();
                
                // Mensaje de bienvenida
                if (inspectionData.length === 0) {
                    Swal.fire({
                        title: 'Sistema iniciado',
                        text: 'Complete el primer registro de inspección para comenzar',
                        icon: 'info',
                        timer: 3000,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end'
                    });
                } else {
                    Swal.fire({
                        title: '¡Datos cargados!',
                        text: `${inspectionData.length} registro(s) encontrado(s)`,
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end'
                    });
                }
            }, 1000);
        });

        // Manejo de botones de estatus
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedStatus = this.getAttribute('data-status');
                
                // SweetAlert para confirmar selección
                const statusTexts = {
                    'approved': 'Aprobado para exportación',
                    'pending': 'Pendiente de tratamiento',
                    'rejected': 'Rechazado'
                };
                
                Swal.fire({
                    title: 'Estado seleccionado',
                    text: `Lote marcado como: ${statusTexts[selectedStatus]}`,
                    icon: 'info',
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            });
        });

        // Manejo de checkbox "Ninguna"
        document.getElementById('ninguna').addEventListener('change', function() {
            const otherCheckboxes = document.querySelectorAll('input[name="plagas"]:not(#ninguna)');
            if (this.checked) {
                otherCheckboxes.forEach(cb => {
                    cb.checked = false;
                    cb.disabled = true;
                });
                
                Swal.fire({
                    title: 'Sin plagas detectadas',
                    text: 'Se ha marcado que no hay plagas presentes',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            } else {
                otherCheckboxes.forEach(cb => {
                    cb.disabled = false;
                });
            }
        });

        // Manejo de otros checkboxes
        document.querySelectorAll('input[name="plagas"]:not(#ninguna)').forEach(cb => {
            cb.addEventListener('change', function() {
                if (this.checked) {
                    document.getElementById('ninguna').checked = false;
                    
                    Swal.fire({
                        title: 'Plaga detectada',
                        text: `Se ha registrado: ${this.value}`,
                        icon: 'warning',
                        timer: 1500,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end'
                    });
                }
            });
        });

        // Manejo de subida de archivos
        document.getElementById('fileInput').addEventListener('change', function(e) {
            const files = e.target.files;
            const preview = document.getElementById('filePreview');
            preview.innerHTML = '';

            if (files.length > 0) {
                Swal.fire({
                    title: 'Archivos cargados',
                    text: `${files.length} foto(s) seleccionada(s)`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });

                Array.from(files).forEach(file => {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            const img = document.createElement('img');
                            img.src = e.target.result;
                            img.onclick = function() {
                                Swal.fire({
                                    imageUrl: e.target.result,
                                    imageAlt: 'Imagen del lote',
                                    showCloseButton: true,
                                    showConfirmButton: false,
                                    customClass: {
                                        image: 'swal-image-preview'
                                    }
                                });
                            };
                            preview.appendChild(img);
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        });

        // Manejo del formulario
        document.getElementById('inspectionForm').addEventListener('submit', function(e) {
            e.preventDefault();

            if (!selectedStatus) {
                Swal.fire({
                    title: 'Campo requerido',
                    text: 'Por favor selecciona un estatus para el lote',
                    icon: 'warning',
                    confirmButtonColor: '#ff9800',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            // Mostrar confirmación antes de guardar
            Swal.fire({
                title: '¿Confirmar inspección?',
                text: 'Se guardará la inspección con los datos ingresados',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#4caf50',
                cancelButtonColor: '#95a5a6',
                confirmButtonText: 'Sí, guardar',
                cancelButtonText: 'Revisar datos',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    saveInspection();
                }
            });
        });

        function saveInspection() {
            showLoading();
            
            // Simular guardado
            setTimeout(() => {
                // Recopilar datos del formulario
                const formData = new FormData(document.getElementById('inspectionForm'));
                const plagas = Array.from(document.querySelectorAll('input[name="plagas"]:checked')).map(cb => cb.value);
                
                const newInspection = {
                    id: Date.now(),
                    loteNumber: formData.get('loteNumber'),
                    inspectionDate: formData.get('inspectionDate'),
                    inspector: formData.get('inspector'),
                    plagas: plagas,
                    estadoRacimo: formData.get('estadoRacimo'),
                    tamanoPromedio: formData.get('tamanoPromedio'),
                    pesoPromedio: formData.get('pesoPromedio'),
                    observaciones: formData.get('observaciones'),
                    status: selectedStatus,
                    timestamp: new Date().toISOString()
                };

                // Agregar al inicio del array
                inspectionData.unshift(newInspection);
                
                // Guardar en localStorage
                saveDataToStorage();

                // Actualizar interfaz
                updateRecentInspections();
                updateHistorialTable();
                updateStats();

                // Resetear formulario
                resetForm();

                hideLoading();

                // Mensaje de éxito
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Inspección guardada correctamente',
                    icon: 'success',
                    confirmButtonColor: '#4caf50',
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    // Preguntar si quiere hacer otra inspección
                    Swal.fire({
                        title: '¿Nueva inspección?',
                        text: '¿Deseas realizar otra inspección?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#2c5530',
                        cancelButtonColor: '#95a5a6',
                        confirmButtonText: 'Sí, continuar',
                        cancelButtonText: 'No, terminar'
                    }).then((result) => {
                        if (!result.isConfirmed) {
                            Swal.fire({
                                title: 'Sesión finalizada',
                                text: 'Gracias por usar el sistema de control de plagas',
                                icon: 'info',
                                timer: 2000,
                                showConfirmButton: false
                            });
                        }
                    });
                });
            }, 1000);
        }

        function resetForm() {
            document.getElementById('inspectionForm').reset();
            document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('input[name="plagas"]').forEach(cb => cb.disabled = false);
            document.getElementById('filePreview').innerHTML = '';
            selectedStatus = '';
            document.getElementById('inspectionDate').value = new Date().toISOString().split('T')[0];
        }

        // Funciones de actualización de interfaz
        function updateRecentInspections() {
            const recentList = document.getElementById('recentInspections');
            recentList.innerHTML = '';

            if (inspectionData.length === 0) {
                recentList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <p>No hay inspecciones registradas</p>
                        <small>Los registros aparecerán aquí después de guardar una inspección</small>
                    </div>
                `;
                return;
            }

            inspectionData.slice(0, 5).forEach(inspection => {
                const li = document.createElement('li');
                li.style.setProperty('--color', getStatusColor(inspection.status));
                li.innerHTML = `
                    <strong>${inspection.loteNumber}</strong>
                    <div class="inspection-date">${formatDate(inspection.inspectionDate)} - Inspector: ${inspection.inspector}</div>
                    <span class="inspection-status ${inspection.status}">${getStatusText(inspection.status)}</span>
                `;
                li.addEventListener('click', () => showInspectionDetails(inspection));
                li.style.cursor = 'pointer';
                recentList.appendChild(li);
            });
        }

        function updateHistorialTable() {
            const tableBody = document.getElementById('historialTable');
            tableBody.innerHTML = '';

            if (inspectionData.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6">
                            <div class="empty-state">
                                <i class="fas fa-database"></i>
                                <p>No hay datos registrados</p>
                                <small>Complete el formulario de inspección para comenzar a llenar el historial</small>
                            </div>
                        </td>
                    </tr>
                `;
                return;
            }

            inspectionData.forEach((inspection, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${inspection.loteNumber}</strong></td>
                    <td>${formatDate(inspection.inspectionDate)}</td>
                    <td>${inspection.plagas.join(', ')}</td>
                    <td><span class="inspection-status ${inspection.status}">${getStatusText(inspection.status)}</span></td>
                    <td>${inspection.inspector}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-small" onclick="showInspectionDetails(inspectionData[${index}])">
                                <i class="fas fa-eye"></i> Ver
                            </button>
                            <button class="btn btn-small btn-danger" onclick="deleteInspection(${index})">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }

        // Función para eliminar una inspección
        function deleteInspection(index) {
            const inspection = inspectionData[index];
            
            Swal.fire({
                title: '¿Eliminar inspección?',
                html: `
                    <div style="text-align: left;">
                        <p><strong>Lote:</strong> ${inspection.loteNumber}</p>
                        <p><strong>Fecha:</strong> ${formatDate(inspection.inspectionDate)}</p>
                        <p><strong>Inspector:</strong> ${inspection.inspector}</p>
                        <p><strong>Estado:</strong> <span class="inspection-status ${inspection.status}">${getStatusText(inspection.status)}</span></p>
                    </div>
                    <br>
                    <p style="color: #f44336; font-weight: bold;">Esta acción no se puede deshacer</p>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f44336',
                cancelButtonColor: '#95a5a6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // Mostrar loading durante la eliminación
                    showLoading();
                    
                    setTimeout(() => {
                        // Eliminar el registro del array
                        inspectionData.splice(index, 1);
                        
                        // Guardar en localStorage
                        saveDataToStorage();
                        
                        // Actualizar todas las vistas
                        updateRecentInspections();
                        updateHistorialTable();
                        updateStats();
                        
                        hideLoading();
                        
                        // Mensaje de confirmación
                        Swal.fire({
                            title: '¡Eliminado!',
                            text: `La inspección del lote ${inspection.loteNumber} ha sido eliminada`,
                            icon: 'success',
                            confirmButtonColor: '#4caf50',
                            timer: 3000,
                            timerProgressBar: true
                        });
                    }, 1000);
                }
            });
        }

        function updateStats() {
            const approved = inspectionData.filter(i => i.status === 'approved').length;
            const pending = inspectionData.filter(i => i.status === 'pending').length;
            const rejected = inspectionData.filter(i => i.status === 'rejected').length;
            const total = inspectionData.length;

            // Animación de contador
            animateCounter('approvedCount', approved);
            animateCounter('pendingCount', pending);
            animateCounter('rejectedCount', rejected);
            animateCounter('totalCount', total);
        }

        function animateCounter(elementId, targetValue) {
            const element = document.getElementById(elementId);
            const currentValue = parseInt(element.textContent) || 0;
            const increment = targetValue > currentValue ? 1 : -1;
            const duration = 50;

            if (currentValue !== targetValue) {
                element.textContent = currentValue + increment;
                setTimeout(() => animateCounter(elementId, targetValue), duration);
            }
        }

        function showInspectionDetails(inspection) {
            const plagasText = inspection.plagas.length > 0 ? inspection.plagas.join(', ') : 'Ninguna';
            const observacionesText = inspection.observaciones || 'Sin observaciones';
            
            Swal.fire({
                title: `Detalles de ${inspection.loteNumber}`,
                html: `
                    <div style="text-align: left; margin: 1rem 0;">
                        <p><strong>Fecha:</strong> ${formatDate(inspection.inspectionDate)}</p>
                        <p><strong>Inspector:</strong> ${inspection.inspector}</p>
                        <p><strong>Estado del racimo:</strong> ${getEstadoRacimoText(inspection.estadoRacimo)}</p>
                        <p><strong>Tamaño promedio:</strong> ${inspection.tamanoPromedio} cm</p>
                        <p><strong>Peso promedio:</strong> ${inspection.pesoPromedio} kg</p>
                        <p><strong>Plagas detectadas:</strong> ${plagasText}</p>
                        <p><strong>Estado:</strong> <span class="inspection-status ${inspection.status}">${getStatusText(inspection.status)}</span></p>
                        <p><strong>Observaciones:</strong></p>
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-top: 0.5rem;">
                            ${observacionesText}
                        </div>
                    </div>
                `,
                showCloseButton: true,
                showConfirmButton: false,
                width: '600px',
                customClass: {
                    popup: 'inspection-details-popup'
                }
            });
        }

        function formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('es-ES');
        }

        function getStatusText(status) {
            const statusTexts = {
                'approved': 'Aprobado',
                'pending': 'Pendiente',
                'rejected': 'Rechazado'
            };
            return statusTexts[status] || status;
        }

        function getStatusColor(status) {
            const statusColors = {
                'approved': '#4caf50',
                'pending': '#ff9800',
                'rejected': '#f44336'
            };
            return statusColors[status] || '#95a5a6';
        }

        function getEstadoRacimoText(estado) {
            const estados = {
                'verde': 'Verde',
                'sobremaduro': 'Sobremaduro',
                'con_manchas': 'Con manchas',
                'optimo': 'Óptimo'
            };
            return estados[estado] || estado;
        }

        // Función para exportar datos
        function exportData() {
            if (inspectionData.length === 0) {
                Swal.fire({
                    title: 'Sin datos',
                    text: 'No hay datos para exportar',
                    icon: 'info',
                    confirmButtonColor: '#2196f3'
                });
                return;
            }

            Swal.fire({
                title: 'Exportar datos',
                text: 'Se descargará un archivo CSV con todos los registros',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#4caf50',
                cancelButtonColor: '#95a5a6',
                confirmButtonText: 'Descargar CSV',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    const csv = generateCSV();
                    downloadCSV(csv, 'inspecciones_plagas.csv');
                    
                    Swal.fire({
                        title: '¡Exportado!',
                        text: 'Los datos se han descargado correctamente',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            });
        }

        function generateCSV() {
            const headers = ['Lote', 'Fecha', 'Inspector', 'Plagas', 'Estado Racimo', 'Tamaño (cm)', 'Peso (kg)', 'Estado', 'Observaciones'];
            const rows = inspectionData.map(inspection => [
                inspection.loteNumber,
                inspection.inspectionDate,
                inspection.inspector,
                inspection.plagas.join('; '),
                getEstadoRacimoText(inspection.estadoRacimo),
                inspection.tamanoPromedio,
                inspection.pesoPromedio,
                getStatusText(inspection.status),
                inspection.observaciones || ''
            ]);

            return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
        }

        function downloadCSV(csv, filename) {
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // Agregar botones de acción al final
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                const historialSection = document.querySelector('.historial-section');
                
                // Contenedor para botones
                const buttonsContainer = document.createElement('div');
                buttonsContainer.style.display = 'flex';
                buttonsContainer.style.gap = '1rem';
                buttonsContainer.style.marginTop = '1rem';
                buttonsContainer.style.flexWrap = 'wrap';
                
                // Botón exportar
                const exportBtn = document.createElement('button');
                exportBtn.className = 'btn';
                exportBtn.innerHTML = '<i class="fas fa-download"></i> Exportar Datos';
                exportBtn.onclick = exportData;
                
                // Botón limpiar datos
                const clearBtn = document.createElement('button');
                clearBtn.className = 'btn btn-danger';
                clearBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Limpiar Todos los Datos';
                clearBtn.onclick = clearAllData;
                
                buttonsContainer.appendChild(exportBtn);
                buttonsContainer.appendChild(clearBtn);
                historialSection.appendChild(buttonsContainer);
            }, 100);
        });

        // Manejar errores globales
        window.addEventListener('error', function(e) {
            console.error('Error:', e.error);
            Swal.fire({
                title: 'Error del sistema',
                text: 'Ha ocurrido un error inesperado. Por favor, recarga la página.',
                icon: 'error',
                confirmButtonColor: '#f44336'
            });
        });

        // Confirmar antes de cerrar si hay datos sin guardar
        window.addEventListener('beforeunload', function(e) {
            const formData = new FormData(document.getElementById('inspectionForm'));
            let hasData = false;
            
            for (let [key, value] of formData.entries()) {
                if (value && value.trim() !== '') {
                    hasData = true;
                    break;
                }
            }
            
            if (hasData || selectedStatus) {
                e.preventDefault();
                e.returnValue = '';
            }
        });