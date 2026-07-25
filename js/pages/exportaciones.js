// Variables globales
    let orders = [];
    let currentEditingOrder = null;

    // Inicialización
    document.addEventListener('DOMContentLoaded', function() {
        loadSampleData();
        updateDashboard();
        updateOrdersList();
        populateDocumentSelect();
        
        // Event listeners
        document.getElementById('pedido-form').addEventListener('submit', handleNewOrder);
        document.getElementById('edit-form').addEventListener('submit', handleEditOrder);
        document.getElementById('search-orders').addEventListener('input', filterOrders);
        document.getElementById('filter-status').addEventListener('change', filterOrders);
        
        // Modal close
        document.querySelector('.close').addEventListener('click', closeModal);
        window.addEventListener('click', function(event) {
            if (event.target === document.getElementById('editModal')) {
                closeModal();
            }
        });
    });

    // Cargar datos guardados o datos de ejemplo
    function loadSampleData() {
        // Intentar cargar datos guardados del localStorage
        const savedOrders = localStorage.getItem('exportOrders');
        
        if (savedOrders) {
            try {
                orders = JSON.parse(savedOrders);
                // console.log('Datos cargados desde localStorage:', orders.length, 'pedidos');
            } catch (error) {
                console.error('Error al cargar datos guardados:', error);
                orders = [];
            }
        } else {
            // Si no hay datos guardados, usar array vacío
            orders = [];
            // console.log('No hay datos guardados, iniciando con lista vacía');
        }
    }

    // Guardar datos en localStorage
    function saveOrdersToStorage() {
        try {
            localStorage.setItem('exportOrders', JSON.stringify(orders));
            // console.log('Datos guardados en localStorage:', orders.length, 'pedidos');
        } catch (error) {
            console.error('Error al guardar datos:', error);
        }
    }

    // Navegación entre secciones
    function showSection(sectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(sectionId).classList.add('active');
        const activeBtn = document.querySelector(`.nav-btn[onclick*="${sectionId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        if (sectionId === 'nuevo-pedido') {
            renderRecentOrdersPanel();
        }
    }

    // Generar ID único
    function generateOrderId() {
        const number = (orders.length + 1).toString().padStart(3, '0');
        return `EXP${number}`;
    }

    // Manejar nuevo pedido
    function handleNewOrder(e) {
        e.preventDefault();
        
        const orderId = generateOrderId();
        
        // Generar código de seguimiento automático
        const trackingCode = `TRK${orderId}${Date.now().toString().slice(-6)}`;
        
        // Generar información de transporte automática
        const transportOptions = [
            'Transporte Terrestre - Camión Refrigerado',
            'Transporte Marítimo - Contenedor 20ft',
            'Transporte Aéreo - Carga Especial',
            'Transporte Mixto - Terrestre/Marítimo',
            'Courier Express - DHL International'
        ];
        const randomTransport = transportOptions[Math.floor(Math.random() * transportOptions.length)];
        
        const newOrder = {
            id: orderId,
            cliente: document.getElementById('cliente').value,
            paisDestino: document.getElementById('pais-destino').value,
            variedad: document.getElementById('variedad').value,
            cantidad: parseInt(document.getElementById('cantidad').value),
            fechaEnvio: document.getElementById('fecha-envio').value,
            precioUnitario: parseFloat(document.getElementById('precio-unitario').value),
            estado: 'pendiente',
            fechaCreacion: new Date().toISOString().split('T')[0],
            notas: document.getElementById('notas').value,
            tracking: trackingCode, // Código generado automáticamente
            transporte: randomTransport // Transporte generado automáticamente
        };
        
        orders.push(newOrder);
        
        // Guardar en localStorage
        saveOrdersToStorage();
        
        // Reset form
        document.getElementById('pedido-form').reset();
        
        // Update displays
        updateDashboard();
        updateOrdersList();
        populateDocumentSelect();
        renderRecentOrdersPanel();
        
        Swal.fire({
            title: '¡Pedido registrado!',
            html: `
                <div style="text-align: left;">
                    <p><strong>Pedido:</strong> ${newOrder.id}</p>
                    <p><strong>Código de seguimiento:</strong> ${trackingCode}</p>
                    <p><strong>Transporte asignado:</strong> ${randomTransport}</p>
                </div>
            `,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            timer: 5000,
            timerProgressBar: true
        });
    }

    // Actualizar dashboard
    function updateDashboard() {
        const stats = {
            total: orders.length,
            pendiente: orders.filter(o => o.estado === 'pendiente').length,
            proceso: orders.filter(o => o.estado === 'proceso').length,
            enviado: orders.filter(o => o.estado === 'enviado').length,
            entregado: orders.filter(o => o.estado === 'entregado').length
        };
        
        document.getElementById('total-pedidos').textContent = stats.total;
        document.getElementById('pedidos-pendientes').textContent = stats.pendiente;
        document.getElementById('pedidos-enviados').textContent = stats.enviado;
        document.getElementById('pedidos-entregados').textContent = stats.entregado;
        
        // Mostrar pedidos recientes
        const recentOrders = orders.slice(-3).reverse();
        const recentOrdersHtml = recentOrders.map(order => createOrderCard(order, true)).join('');
        document.getElementById('recent-orders').innerHTML = recentOrdersHtml;
    }

    // Actualizar panel de últimos pedidos (sección Nuevo Pedido)
    function renderRecentOrdersPanel() {
        const listContainer = document.getElementById('np-recent-orders-list');
        if (!listContainer) return;

        // Ordenar explícitamente por fechaCreacion (más reciente primero)
        // En caso de empate, por ID descendente
        const sortedOrders = [...orders].sort((a, b) => {
            const dateA = new Date(a.fechaCreacion || a.fechaEnvio || 0);
            const dateB = new Date(b.fechaCreacion || b.fechaEnvio || 0);
            if (dateB.getTime() !== dateA.getTime()) {
                return dateB - dateA;
            }
            return b.id.localeCompare(a.id);
        });

        // Tomar los primeros 10 (los más recientes debido al sort)
        const top10 = sortedOrders.slice(0, 10);

        listContainer.innerHTML = top10.map(order => {
            const val = (order.cantidad * order.precioUnitario).toLocaleString('en-US', {
                style: 'currency', currency: 'USD'
            });
            return `
                <div class="compact-order-item">
                    <div class="compact-order-info">
                        <div class="compact-order-id">
                            ${order.id} 
                            <span class="badge-status-compact badge-${order.estado}">
                                ${order.estado === 'procesa' ? 'proceso' : order.estado}
                            </span>
                        </div>
                        <div class="compact-order-client">${order.cliente}</div>
                    </div>
                    <div class="compact-order-meta">
                        <div class="compact-order-val">${val}</div>
                        <div style="font-size: 0.7rem; color: var(--text-soft);">${order.fechaEnvio}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Crear tarjeta de pedido
    function createOrderCard(order, isRecent = false) {
        const totalValue = (order.cantidad * order.precioUnitario).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        
        return `
            <div class="tracking-card">
                <!-- Encabezado: ID + Badge de estado -->
                <div class="card-header">
                    <div class="export-id">
                        <span class="export-id-icon" onclick="copyOrderId('${order.id}', this)" style="cursor: pointer;" title="Copiar ID">
                            <svg class="icon" viewBox="0 0 24 24"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>
                        </span>
                        ${order.id}
                    </div>
                    <span class="badge-status badge-${order.estado}">
                        <span class="badge-dot"></span> ${order.estado.toUpperCase()}
                    </span>
                </div>

                <!-- Divisor -->
                <div class="divider"></div>

                <!-- Grid de 3 columnas -->
                <div class="info-grid">
                    <!-- Cliente -->
                    <div class="info-item">
                        <div class="info-icon">
                            <svg class="icon" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M12 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/></svg>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Cliente</span>
                            <span class="info-value">${order.cliente}</span>
                        </div>
                    </div>

                    <!-- Variedad -->
                    <div class="info-item">
                        <div class="info-icon">
                            <svg class="icon" viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Variedad</span>
                            <span class="info-value">${order.variedad}</span>
                        </div>
                    </div>

                    <!-- Cantidad -->
                    <div class="info-item">
                        <div class="info-icon">
                            <svg class="icon" viewBox="0 0 24 24"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Cantidad</span>
                            <span class="info-value">${order.cantidad.toLocaleString()} unidades</span>
                        </div>
                    </div>

                    <!-- Fecha de envío -->
                    <div class="info-item">
                        <div class="info-icon">
                            <svg class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Fecha Envío</span>
                            <span class="info-value">${new Date(order.fechaEnvio).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <!-- Destino -->
                    <div class="info-item">
                        <div class="info-icon">
                            <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Destino</span>
                            <span class="info-value">${order.paisDestino}</span>
                        </div>
                    </div>

                    <!-- Valor Total -->
                    <div class="info-item">
                        <div class="info-icon">
                            <svg class="icon" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Valor Total</span>
                            <span class="info-value highlight">${totalValue}</span>
                        </div>
                    </div>
                </div>

                ${!isRecent || order.tracking ? '<div class="divider"></div>' : ''}

                <!-- Tracking & Actions -->
                <div class="tracking-footer-row">
                    ${order.tracking ? `
                    <div class="info-item" style="flex: 0 0 auto;">
                        <div class="info-icon">
                            <svg class="icon" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Tracking</span>
                            <span class="tracking-highlight">${order.tracking}</span>
                        </div>
                    </div>
                    ` : '<div></div>'}

                    ${!isRecent ? `
                    <div class="tracking-actions">
                        <button class="action-btn" onclick="editOrder('${order.id}')">
                            <svg class="icon" viewBox="0 0 24 24"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg> Editar
                        </button>
                        <button class="action-btn" onclick="trackOrderById('${order.id}')">
                            <svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Seguir
                        </button>
                        <button class="action-btn delete" onclick="deleteOrder('${order.id}')">
                            <svg class="icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Eliminar
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Copiar ID del pedido al portapapeles
    window.copyOrderId = function(text, element) {
        navigator.clipboard.writeText(text).then(() => {
            const originalColor = element.style.color;
            const originalBackground = element.style.background;
            
            element.style.color = 'var(--success)';
            element.style.background = '#d1fae5';
            
            Swal.fire({
                icon: 'success',
                title: 'ID copiado: ' + text,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                background: 'var(--surface)',
                color: 'var(--text)'
            });
            
            setTimeout(() => {
                element.style.color = originalColor;
                element.style.background = originalBackground;
            }, 1500);
        }).catch(err => {
            console.error('Error al copiar:', err);
        });
    };

    // Actualizar lista de pedidos
    function updateOrdersList() {
        const ordersHtml = orders.map(order => createOrderCard(order, false)).join('');
        document.getElementById('orders-list').innerHTML = ordersHtml;
        renderSeguimientoList();
    }

    window.currentSeguimientoFilter = 'todos';
    window.setSeguimientoFilter = function(estado) {
        window.currentSeguimientoFilter = estado;
        renderSeguimientoList();
    };

    // Renderizar lista de pedidos para seguimiento
    function renderSeguimientoList(ordersToRender = orders) {
        const listContainer = document.getElementById('seguimiento-orders-list');
        if (!listContainer) return;
        
        let filteredOrders = ordersToRender;
        if (window.currentSeguimientoFilter && window.currentSeguimientoFilter !== 'todos') {
            filteredOrders = filteredOrders.filter(o => o.estado === window.currentSeguimientoFilter);
        }
        
        const html = `
        <div class="seguimiento-table-container">
            <div class="seguimiento-table-header">
                <div class="pl-2">ID Pedido</div>
                <div>Cliente</div>
                <div>Variedad</div>
                <div>Tracking</div>
                <div>Cantidad</div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    Estado
                    <select onchange="window.setSeguimientoFilter(this.value)" onclick="event.stopPropagation()" style="background: transparent; border: 1px solid var(--border); border-radius: 4px; padding: 2px 4px; font-size: 11px; cursor: pointer; color: var(--text-soft); font-weight: 500; outline: none;">
                        <option value="todos" ${window.currentSeguimientoFilter === 'todos' ? 'selected' : ''}>Todos</option>
                        <option value="pendiente" ${window.currentSeguimientoFilter === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="proceso" ${window.currentSeguimientoFilter === 'proceso' ? 'selected' : ''}>En Preparación</option>
                        <option value="enviado" ${window.currentSeguimientoFilter === 'enviado' ? 'selected' : ''}>En Tránsito</option>
                        <option value="entregado" ${window.currentSeguimientoFilter === 'entregado' ? 'selected' : ''}>Entregado</option>
                        <option value="cancelado" ${window.currentSeguimientoFilter === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </div>
            </div>
            <div class="seguimiento-table-body">
                ${filteredOrders.length > 0 ? filteredOrders.map(order => {
                    let statusClass = 'st-status-amber';
                    let statusText = 'Pendiente';
                    if (order.estado === 'proceso') { statusClass = 'st-status-purple'; statusText = 'En Preparación'; }
                    else if (order.estado === 'enviado') { statusClass = 'st-status-emerald'; statusText = 'En Tránsito'; }
                    else if (order.estado === 'entregado') { statusClass = 'st-status-blue'; statusText = 'Entregado'; }
                    
                    return `
                    <div class="seguimiento-table-row" onclick="trackOrderById('${order.id}')">
                        <div class="st-id">${order.id}</div>
                        <div class="st-client">${order.cliente}</div>
                        <div class="st-variety">${order.variedad}</div>
                        <div class="st-tracking">${order.tracking || 'TRK-PEND'}</div>
                        <div class="st-quantity">${order.cantidad} unidades</div>
                        <div>
                            <span class="st-status-pill ${statusClass}">${statusText}</span>
                        </div>
                    </div>
                    `;
                }).join('') : '<div style="padding: 20px; text-align: center; color: var(--text-soft); grid-column: 1 / -1;">No se encontraron pedidos con este estado.</div>'}
            </div>
        </div>
        `;
        listContainer.innerHTML = html;
    }

    // Filtrar pedidos
    function filterOrders() {
        const searchTerm = document.getElementById('search-orders').value.toLowerCase();
        const statusFilter = document.getElementById('filter-status').value;
        
        let filteredOrders = orders;
        
        if (searchTerm) {
            filteredOrders = filteredOrders.filter(order => 
                order.cliente.toLowerCase().includes(searchTerm) ||
                order.paisDestino.toLowerCase().includes(searchTerm) ||
                order.id.toLowerCase().includes(searchTerm) ||
                order.variedad.toLowerCase().includes(searchTerm)
            );
        }
        
        if (statusFilter) {
            filteredOrders = filteredOrders.filter(order => order.estado === statusFilter);
        }
        
        const ordersHtml = filteredOrders.map(order => createOrderCard(order, false)).join('');
        document.getElementById('orders-list').innerHTML = ordersHtml;
    }

    // Editar pedido
    function editOrder(orderId) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        
        currentEditingOrder = order;
        
        // Asegurar que los campos existan antes de asignar valores
        const statusField = document.getElementById('edit-status');
        const trackingField = document.getElementById('edit-tracking');
        const transportField = document.getElementById('edit-transport');
        
        if (statusField) statusField.value = order.estado;
        if (trackingField) trackingField.value = order.tracking || '';
        if (transportField) transportField.value = order.transporte || '';
        
        // Mostrar el modal
        document.getElementById('editModal').style.display = 'block';
        
        // Forzar la actualización de los valores después de mostrar el modal
        setTimeout(() => {
            if (statusField) statusField.value = order.estado;
            if (trackingField) trackingField.value = order.tracking || '';
            if (transportField) transportField.value = order.transporte || '';
        }, 100);
    }

    // Manejar edición de pedido
    function handleEditOrder(e) {
        e.preventDefault();
        
        if (!currentEditingOrder) return;
        
        currentEditingOrder.estado = document.getElementById('edit-status').value;
        currentEditingOrder.tracking = document.getElementById('edit-tracking').value;
        currentEditingOrder.transporte = document.getElementById('edit-transport').value;
        
        // Guardar cambios en localStorage
        saveOrdersToStorage();
        
        closeModal();
        updateDashboard();
        updateOrdersList();
        
        Swal.fire({
            title: '¡Actualizado!',
            text: 'Pedido actualizado exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            timer: 2000
        });
    }

    // Cerrar modal
    function closeModal() {
        document.getElementById('editModal').style.display = 'none';
        currentEditingOrder = null;
    }

    // Eliminar pedido
    async function deleteOrder(orderId) {
        const result = await Swal.fire({
            title: '¿Eliminar pedido?',
            text: "¡No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        
        if (result.isConfirmed) {
            orders = orders.filter(o => o.id !== orderId);
            
            // Guardar cambios en localStorage
            saveOrdersToStorage();
            
            updateDashboard();
            updateOrdersList();
            populateDocumentSelect();
            
            Swal.fire(
                '¡Eliminado!',
                'El pedido ha sido eliminado.',
                'success'
            );
        }
    }

    // Seguimiento de pedido
    function trackOrder() {
        const orderId = document.getElementById('tracking-id').value.trim().toLowerCase();
        if (!orderId) {
            renderSeguimientoList(orders);
            return;
        }
        
        // Check if exact match to open modal
        const exactMatch = orders.find(o => o.id.toLowerCase() === orderId || (o.tracking && o.tracking.toLowerCase() === orderId));
        if (exactMatch) {
            trackOrderById(exactMatch.id);
        } else {
            // Otherwise just filter the list
            const filtered = orders.filter(o => 
                o.id.toLowerCase().includes(orderId) || 
                (o.tracking && o.tracking.toLowerCase().includes(orderId))
            );
            renderSeguimientoList(filtered);
            if (filtered.length === 0) {
                Swal.fire({
                    title: 'No encontrado',
                    text: 'No se encontraron pedidos con ese criterio',
                    icon: 'info',
                    confirmButtonText: 'Entendido'
                });
            }
        }
    }

    function trackOrderById(orderId) {
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
            Swal.fire({
                title: 'Pedido no encontrado',
                text: `No se encontró ningún pedido con el ID: ${orderId}`,
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
            return;
        }
        
        const trackingSteps = [
            { step: 'Pedido Confirmado', desc: '16/05/2026', status: 'completed' },
            { step: 'Preparación y Empaque', desc: 'Inspección de calidad aprobada', status: order.estado !== 'pendiente' ? 'completed' : 'pending' },
            { step: 'Despacho Terrestre', desc: 'Carga en tránsito a puerto de origen', status: ['enviado', 'entregado'].includes(order.estado) ? 'completed' : 'pending' },
            { step: 'Zarpe de Buque', desc: '16/05/2026', status: ['enviado', 'entregado'].includes(order.estado) ? 'completed' : 'pending' },
            { step: 'En Tránsito Marítimo', desc: 'Actualizando... 16/05/2026', status: ['enviado', 'entregado'].includes(order.estado) ? (order.estado === 'enviado' ? 'active' : 'completed') : 'pending' },
            { step: 'Llegada a Puerto', desc: 'Estado estimado', status: order.estado === 'entregado' ? 'completed' : 'pending' },
            { step: 'Entrega Final', desc: 'Estado estimado', status: order.estado === 'entregado' ? 'completed' : 'pending' }
        ];

        const timelineHtml = trackingSteps.map((step) => {
            const isCompleted = step.status === 'completed' || step.status === 'active';
            const iconHtml = isCompleted 
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12"/></svg>';
            
            return `
            <div class="dark-timeline-step">
                <div class="dark-timeline-icon ${step.status}">
                    ${iconHtml}
                </div>
                <div class="dark-timeline-content ${step.status}">
                    <h4>${step.step}</h4>
                    <p>${step.desc}</p>
                </div>
            </div>
            `;
        }).join('');

        document.getElementById('tracking-result').innerHTML = `
            <div class="tracking-dark-modal" id="tracking-dark-modal-overlay" onclick="closeTrackingModal(event)">
                <div class="tracking-dark-content" onclick="event.stopPropagation()">
                    <div class="tracking-dark-header">
                        <div class="tracking-dark-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            Seguimiento de Envío
                        </div>
                        <button class="tracking-dark-close" onclick="closeTrackingModal()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    <div class="tracking-dark-body">
                        <div class="tracking-dark-left">
                            <div>
                                <div class="tracking-dark-subtitle">TRACKING ACTIVO ${order.tracking || order.id}</div>
                                <div class="tracking-dark-grid">
                                    <div>
                                        <div class="tracking-dark-label">Pedido Relacionado</div>
                                        <div class="tracking-dark-value">${order.id}</div>
                                    </div>
                                    <div>
                                        <div class="tracking-dark-label">Cliente</div>
                                        <div class="tracking-dark-value">${order.cliente}</div>
                                    </div>
                                    <div>
                                        <div class="tracking-dark-label">Variedad</div>
                                        <div class="tracking-dark-value">${order.variedad}</div>
                                    </div>
                                    <div>
                                        <div class="tracking-dark-label">Cantidad</div>
                                        <div class="tracking-dark-value">${order.cantidad.toLocaleString()} unidades</div>
                                    </div>
                                    <div>
                                        <div class="tracking-dark-label">Valor Total</div>
                                        <div class="tracking-dark-value">$${(order.cantidad * order.precioUnitario).toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
                                    </div>
                                    <div>
                                        <div class="tracking-dark-label">Transportista</div>
                                        <div class="tracking-dark-value" style="color: var(--warning);">${order.transporte || 'Por asignar'}</div>
                                    </div>
                                    <div>
                                        <div class="tracking-dark-label">Origen</div>
                                        <div class="tracking-dark-value" style="display:flex;align-items:center;gap:6px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-soft)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                            Puerto Marítimo, EC
                                        </div>
                                    </div>
                                    <div>
                                        <div class="tracking-dark-label">Destino</div>
                                        <div class="tracking-dark-value" style="display:flex;align-items:center;gap:6px;">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-soft)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                            ${order.paisDestino}
                                        </div>
                                    </div>
                                    <div style="grid-column: span 2;">
                                        <div class="tracking-dark-label">Llegada Estimada (ETA)</div>
                                        <div class="tracking-dark-value">${order.fechaEnvio ? new Date(new Date(order.fechaEnvio).getTime() + 15*24*60*60*1000).toLocaleDateString() : 'Por determinar'}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="tracking-dark-doc-title">Documentos de Transporte</div>
                                <div style="display: flex; gap: 16px;">
                                    <div class="tracking-dark-doc-card">
                                        <div style="display: flex; align-items: center; gap: 12px;">
                                            <div style="background-color: color-mix(in srgb, var(--error) 15%, transparent); color: var(--error); padding: 8px; border-radius: 8px;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                            </div>
                                            <span style="font-size: 14px; font-weight: 500;">Bill of Lading (BL)</span>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-soft)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="cursor: pointer;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    </div>
                                    <div class="tracking-dark-doc-card">
                                        <div style="display: flex; align-items: center; gap: 12px;">
                                            <div style="background-color: color-mix(in srgb, var(--info) 15%, transparent); color: var(--info); padding: 8px; border-radius: 8px;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                            </div>
                                            <span style="font-size: 14px; font-weight: 500;">Packing List</span>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-soft)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="cursor: pointer;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tracking-dark-right">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <h3 style="font-size: 18px; font-weight: 700; color: var(--text);">Estado: ${order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}</h3>
                                <span style="background-color: rgba(16, 185, 129, 0.15); color: var(--success); padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">${order.estado}</span>
                            </div>
                            <div style="font-size: 14px; color: var(--text-soft); margin-bottom: 32px;">Última actualización: hace unos momentos</div>
                            <div class="tracking-timeline-dark">
                                ${timelineHtml}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Cambiar a la sección de seguimiento si no estamos ahí
        showSection('seguimiento');
        document.querySelector('[onclick="showSection(\'seguimiento\')"]').classList.add('active');
    }

    window.closeTrackingModal = function(e) {
        if(e && e.target !== e.currentTarget) return;
        document.getElementById('tracking-result').innerHTML = '';
    }

    // Poblar selector de documentos
    function populateDocumentSelect() {
        const select = document.getElementById('doc-order-id');
        select.innerHTML = '<option value="">Seleccionar pedido...</option>';
        
        orders.forEach(order => {
            const option = document.createElement('option');
            option.value = order.id;
            option.textContent = `${order.id} - ${order.cliente} (${order.paisDestino})`;
            select.appendChild(option);
        });
    }

    // Generar documentos
    function generateDocument(type) {
        const orderId = document.getElementById('doc-order-id').value;
        if (!orderId) {
            Swal.fire({
                title: 'Selección requerida',
                text: 'Por favor seleccione un pedido',
                icon: 'info',
                confirmButtonText: 'Entendido'
            });
            return;
        }
        
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        
        let documentContent = '';
        
        switch (type) {
            case 'guia':
                documentContent = generateExportGuide(order);
                break;
            case 'factura':
                documentContent = generateCommercialInvoice(order);
                break;
            case 'packing':
                documentContent = generatePackingList(order);
                break;
        }
        
        document.getElementById('document-preview').innerHTML = `
            <div style="background: white; border: 2px solid #e9ecef; border-radius: 15px; padding: 30px; margin-top: 25px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                ${documentContent}
                <div style="margin-top: 30px; text-align: center;">
                    <button class="btn-primary" onclick="printDocument()">🖨️ Imprimir</button>
                    <button class="btn-secondary" onclick="downloadDocument('${type}', '${orderId}')">💾 Descargar PDF</button>
                </div>
            </div>
        `;
    }

    // Generar guía de exportación
    function generateExportGuide(order) {
        return `
            <h2 style="text-align: center; color: var(--text); margin-bottom: 30px;">GUÍA DE EXPORTACIÓN</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <div>
                    <h3>INFORMACIÓN DEL EXPORTADOR</h3>
                    <p><strong>Empresa:</strong> Mi Empresa Exportadora S.A.</p>
                    <p><strong>RUC:</strong> 0912345678001</p>
                    <p><strong>Dirección:</strong> Av. Principal 123, Guayaquil, Ecuador</p>
                    <p><strong>Teléfono:</strong> +593 4 123-4567</p>
                </div>
                <div>
                    <h3>INFORMACIÓN DEL IMPORTADOR</h3>
                    <p><strong>Cliente:</strong> ${order.cliente}</p>
                    <p><strong>País:</strong> ${order.paisDestino}</p>
                    <p><strong>Fecha de Envío:</strong> ${new Date(order.fechaEnvio).toLocaleDateString()}</p>
                </div>
            </div>
            <h3>DETALLES DE LA MERCANCÍA</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background: var(--bg);">
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Producto</th>
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Variedad</th>
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Cantidad</th>
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Peso Estimado</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #dee2e6; padding: 12px;">Producto Agrícola</td>
                    <td style="border: 1px solid #dee2e6; padding: 12px;">${order.variedad}</td>
                    <td style="border: 1px solid #dee2e6; padding: 12px;">${order.cantidad.toLocaleString()} unidades</td>
                    <td style="border: 1px solid #dee2e6; padding: 12px;">${(order.cantidad * 18.5).toLocaleString()} kg</td>
                </tr>
            </table>
            <div style="margin-top: 30px;">
                <p><strong>Número de Guía:</strong> ${order.id}-GE${new Date().getFullYear()}</p>
                <p><strong>Código de Seguimiento:</strong> ${order.tracking || 'Por asignar'}</p>
                <p><strong>Estado:</strong> ${order.estado.toUpperCase()}</p>
            </div>
        `;
    }

    // Generar factura comercial
    function generateCommercialInvoice(order) {
        const subtotal = order.cantidad * order.precioUnitario;
        const tax = subtotal * 0.15; // IVA 15%
        const total = subtotal + tax;
        
        return `
            <h2 style="text-align: center; color: var(--text); margin-bottom: 30px;">FACTURA COMERCIAL</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <div>
                    <h3>VENDEDOR</h3>
                    <p><strong>Mi Empresa Exportadora S.A.</strong></p>
                    <p>RUC: 0912345678001</p>
                    <p>Av. Principal 123</p>
                    <p>Guayaquil, Ecuador</p>
                    <p>Tel: +593 4 123-4567</p>
                </div>
                <div>
                    <h3>COMPRADOR</h3>
                    <p><strong>${order.cliente}</strong></p>
                    <p>${order.paisDestino}</p>
                    <br>
                    <p><strong>Factura N°:</strong> ${order.id}-FC</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Términos:</strong> FOB</p>
                </div>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background: var(--bg);">
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Descripción</th>
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Cantidad</th>
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">Precio Unit.</th>
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">Total</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #dee2e6; padding: 12px;">${order.variedad}</td>
                    <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">${order.cantidad.toLocaleString()}</td>
                    <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">${order.precioUnitario.toFixed(2)}</td>
                    <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">${subtotal.toFixed(2)}</td>
                </tr>
            </table>
            <div style="text-align: right; margin-top: 20px;">
                <p><strong>Subtotal: ${subtotal.toFixed(2)}</strong></p>
                <p><strong>IVA (15%): ${tax.toFixed(2)}</strong></p>
                <p style="font-size: 1.2em; color: var(--text);"><strong>TOTAL: ${total.toFixed(2)} USD</strong></p>
            </div>
        `;
    }

    // Generar packing list
    function generatePackingList(order) {
        const boxes = Math.ceil(order.cantidad / 100); // Aproximadamente 100 unidades por caja
        const grossWeight = order.cantidad * 18.5; // 18.5 kg promedio
        const netWeight = order.cantidad * 17.8; // Peso neto
        
        return `
            <h2 style="text-align: center; color: var(--text); margin-bottom: 30px;">LISTA DE EMPAQUE (PACKING LIST)</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <div>
                    <h3>EXPORTADOR</h3>
                    <p><strong>Mi Empresa Exportadora S.A.</strong></p>
                    <p>Guayaquil, Ecuador</p>
                    <p>Tel: +593 4 123-4567</p>
                </div>
                <div>
                    <h3>CONSIGNATARIO</h3>
                    <p><strong>${order.cliente}</strong></p>
                    <p>${order.paisDestino}</p>
                    <br>
                    <p><strong>Packing List N°:</strong> ${order.id}-PL</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
            </div>
            <h3>INFORMACIÓN DEL ENVÍO</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background: var(--bg);">
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Descripción</th>
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Cajas</th>
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Unidades/Caja</th>
                    <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">Total Unidades</th>
                </tr>
                <tr>
                    <td style="border: 1px solid #dee2e6; padding: 12px;">${order.variedad}</td>
                    <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">${boxes}</td>
                    <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">~100</td>
                    <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">${order.cantidad.toLocaleString()}</td>
                </tr>
            </table>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px;">
                <div>
                    <h4>PESOS Y MEDIDAS</h4>
                    <p><strong>Peso Bruto:</strong> ${grossWeight.toLocaleString()} kg</p>
                    <p><strong>Peso Neto:</strong> ${netWeight.toLocaleString()} kg</p>
                    <p><strong>Volumen:</strong> ${(boxes * 0.05).toFixed(2)} m³</p>
                </div>
                <div>
                    <h4>MARCAS Y NÚMEROS</h4>
                    <p><strong>Marca:</strong> EXPORT</p>
                    <p><strong>Origen:</strong> ECUADOR</p>
                    <p><strong>Destino:</strong> ${order.paisDestino}</p>
                    <p><strong>Cajas numeradas:</strong> 1 a ${boxes}</p>
                </div>
            </div>
        `;
    }

    // Imprimir documento
    function printDocument() {
        Swal.fire({
            title: 'Preparando impresión',
            text: 'Se abrirá la ventana de impresión. Asegúrate de seleccionar la impresora correcta.',
            icon: 'info',
            confirmButtonText: 'Entendido'
        }).then(() => {
            const content = document.getElementById('document-preview').querySelector('div').innerHTML;
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Documento</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #000; padding: 8px; }
                        h2, h3 { color: var(--text); }
                        @media print { button { display: none; } }
                    </style>
                </head>
                <body>${content}</body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        });
    }

    // Descargar documento (PDF)
    function downloadDocument(type, orderId) {
        try {
            if (!window.jspdf || !window.jspdf.jsPDF) {
                Swal.fire({
                    title: 'Servicio no disponible',
                    text: 'No se pudo cargar la herramienta para generar PDFs. Por favor, verifica tu conexión a internet o intenta recargar la página.',
                    icon: 'warning',
                    confirmButtonText: 'Entendido'
                });
                return;
            }
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'pt', 'a4');
            const order = orders.find(o => o.id === orderId);
            
            if (!order) {
                Swal.fire('Error', 'Pedido no encontrado.', 'error');
                return;
            }

            const fileName = `${type}_${orderId}_${new Date().toISOString().split('T')[0]}.pdf`;
            
            doc.setFontSize(18);
            doc.setTextColor(15, 23, 42); // primary color
            
            let title = '';
            let bodyData = [];
            
            if (type === 'guia') {
                title = 'GUÍA DE EXPORTACIÓN (HBL/MBL)';
                const boxes = order.cantidad || 0;
                bodyData = [
                    ['Shipper / Exportador', 'AgroExport S.A.\\nGuayaquil, Ecuador'],
                    ['Consignee / Cliente', `${order.cliente || '-'}\\n${order.paisDestino || '-'}`],
                    ['Puerto de Origen', 'Guayaquil (GYE)'],
                    ['Puerto de Destino', order.paisDestino || '-'],
                    ['Descripción de la Carga', `Banano Fresco - Variedad ${order.variedad || '-'}\\nCantidad: ${boxes} cajas`]
                ];
            } else if (type === 'factura') {
                title = 'FACTURA COMERCIAL';
                const cant = order.cantidad || 0;
                const prec = order.precioUnitario || 0;
                bodyData = [
                    ['Factura No.', `INV-${orderId}-${Math.floor(Math.random()*1000)}`],
                    ['Fecha', new Date().toLocaleDateString()],
                    ['Cliente', order.cliente || '-'],
                    ['Destino', order.paisDestino || '-'],
                    ['Producto', `Banano ${order.variedad || '-'}`],
                    ['Cantidad', `${cant} cajas`],
                    ['Precio Unitario', `$${prec}`],
                    ['Total a Pagar', `$${(cant * prec).toLocaleString()}`]
                ];
            } else if (type === 'packing') {
                title = 'PACKING LIST';
                const boxes = order.cantidad || 0;
                const totalWeight = boxes * 18.14; // kg
                bodyData = [
                    ['Exportador', 'AgroExport S.A.'],
                    ['Cliente', order.cliente || '-'],
                    ['Variedad', order.variedad || '-'],
                    ['Cajas Totales', `${boxes} unidades`],
                    ['Peso Neto Total', `${totalWeight.toLocaleString()} kg`],
                    ['Origen', 'ECUADOR'],
                    ['Cajas numeradas', `1 a ${boxes}`]
                ];
            }

            doc.text(title, 40, 60);
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`ID de Pedido: ${orderId}`, 40, 80);
            doc.text(`Generado: ${new Date().toLocaleString()}`, 40, 95);

            if (doc.autoTable) {
                doc.autoTable({
                    startY: 120,
                    body: bodyData,
                    theme: 'grid',
                    styles: { fontSize: 10, cellPadding: 8 },
                    columnStyles: {
                        0: { fontStyle: 'bold', fillColor: [248, 250, 252], textColor: [15, 23, 42], cellWidth: 150 }
                    }
                });
            } else {
                // Fallback si no carga autoTable
                let currentY = 130;
                bodyData.forEach(row => {
                    doc.text(`${row[0]}: ${row[1].replace(/\\n/g, ', ')}`, 40, currentY);
                    currentY += 20;
                });
            }

            doc.save(fileName);
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al generar el PDF: ' + error.message, 'error');
        }
    }

    // Exportar a CSV
    function exportToCSV() {
        const headers = ['ID', 'Cliente', 'País Destino', 'Variedad', 'Cantidad', 'Fecha Envío', 'Precio Unitario', 'Estado', 'Tracking'];
        const csvContent = [
            headers.join(','),
            ...orders.map(order => [
                order.id,
                `"${order.cliente}"`,
                order.paisDestino,
                `"${order.variedad}"`,
                order.cantidad,
                order.fechaEnvio,
                order.precioUnitario,
                order.estado,
                order.tracking || ''
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exportaciones_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        Swal.fire({
            title: 'Exportación completada',
            text: `El archivo ${a.download} se ha descargado correctamente`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            timer: 3000
        });
    }

    // Funciones adicionales para SweetAlert
    function showLoading() {
        Swal.fire({
            title: 'Procesando...',
            html: 'Por favor espera un momento',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    function hideLoading() {
        Swal.close();
    }

    async function confirmAction(title, text, confirmText, cancelText = 'Cancelar') {
        const result = await Swal.fire({
            title,
            text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
            reverseButtons: true
        });
        return result.isConfirmed;
    }

    // Función adicional para limpiar todos los datos (opcional)
    async function clearAllData() {
        const result = await Swal.fire({
            title: '⚠️ ¿Limpiar todos los datos?',
            text: "Esta acción eliminará TODOS los pedidos permanentemente",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, limpiar todo',
            cancelButtonText: 'Cancelar',
            input: 'text',
            inputPlaceholder: 'Escribe "CONFIRMAR" para continuar',
            preConfirm: (inputValue) => {
                if (inputValue !== 'CONFIRMAR') {
                    Swal.showValidationMessage('Debes escribir "CONFIRMAR" exactamente');
                    return false;
                }
                return true;
            }
        });
        
        if (result.isConfirmed) {
            orders = [];
            localStorage.removeItem('exportOrders');
            updateDashboard();
            updateOrdersList();
            populateDocumentSelect();
            
            Swal.fire({
                title: '¡Datos eliminados!',
                text: 'Todos los pedidos han sido eliminados',
                icon: 'success',
                timer: 2000
            });
        }
    }