 class CalendarioAgricola {
            constructor() {
                this.currentDate = new Date();
                this.currentView = 'month';
                this.events = JSON.parse(localStorage.getItem('agriculturalEvents')) || [];
                this.selectedDate = null;
                this.init();
            }

            init() {
                this.bindEvents();
                this.render();
                this.checkNotifications();
                this.setTodayAsDefault();
            }

            bindEvents() {
                document.getElementById('eventForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addEvent();
                });

                document.getElementById('monthView').addEventListener('click', () => {
                    this.switchView('month');
                });

                document.getElementById('weekView').addEventListener('click', () => {
                    this.switchView('week');
                });

                document.getElementById('prevPeriod').addEventListener('click', () => {
                    this.navigatePeriod(-1);
                });

                document.getElementById('nextPeriod').addEventListener('click', () => {
                    this.navigatePeriod(1);
                });

                // Check notifications every hour
                setInterval(() => {
                    this.checkNotifications();
                }, 3600000);
            }

            setTodayAsDefault() {
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('eventDate').value = today;
            }

            selectDate(date) {
                this.selectedDate = date;
                const dateStr = date.toISOString().split('T')[0];
                document.getElementById('eventDate').value = dateStr;
                
                // Update visual selection
                document.querySelectorAll('.calendar-day').forEach(day => {
                    day.classList.remove('selected');
                });
                
                // Find and select the clicked day
                const clickedDay = event.target.closest('.calendar-day');
                if (clickedDay) {
                    clickedDay.classList.add('selected');
                }

                this.showNotification(`Fecha seleccionada: ${date.toLocaleDateString('es')}`, 'success');
            }

            goToDashboard() {
                swal({
                    title: "¿Volver al Dashboard?",
                    text: "Serás redirigido al panel principal",
                    icon: "info",
                    buttons: {
                        cancel: {
                            text: "Cancelar",
                            value: null,
                            visible: true,
                            className: "swal-button--cancel",
                            closeModal: true,
                        },
                        confirm: {
                            text: "Sí, volver",
                            value: true,
                            visible: true,
                            className: "",
                            closeModal: true
                        }
                    }
                }).then((willGo) => {
                    if (willGo) {
                        // Aquí puedes cambiar la URL por la ruta real de tu dashboard
                        swal({
                            title: "¡Redirigiendo!",
                            text: "Te llevamos al dashboard...",
                            icon: "success",
                            button: false,
                            timer: 1500
                        }).then(() => {
                            // Reemplaza esta URL por la ruta real de tu dashboard
                            window.location.href = "/dashboard";
                            // O si es una SPA: window.location.hash = "#dashboard";
                        });
                    }
                });
            }

            addEvent() {
                const type = document.getElementById('eventType').value;
                const lote = document.getElementById('eventLote').value;
                const date = document.getElementById('eventDate').value;
                const description = document.getElementById('eventDescription').value;

                if (!type || !lote || !date) {
                    this.showNotification('Por favor completa todos los campos obligatorios', 'error');
                    return;
                }

                const event = {
                    id: Date.now(),
                    type,
                    lote,
                    date,
                    description,
                    created: new Date().toISOString()
                };

                this.events.push(event);
                this.saveEvents();
                this.render();
                
                document.getElementById('eventForm').reset();
                this.setTodayAsDefault();
                
                this.showNotification(`Actividad ${type} agregada para el lote ${lote}`, 'success');
            }

            saveEvents() {
                localStorage.setItem('agriculturalEvents', JSON.stringify(this.events));
            }

            switchView(view) {
                this.currentView = view;
                
                document.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
                document.getElementById(view + 'View').classList.add('active');
                
                document.querySelectorAll('.calendar').forEach(cal => cal.classList.remove('active'));
                document.getElementById(view + 'Calendar').classList.add('active');
                
                this.render();
            }

            navigatePeriod(direction) {
                if (this.currentView === 'month') {
                    this.currentDate.setMonth(this.currentDate.getMonth() + direction);
                } else {
                    this.currentDate.setDate(this.currentDate.getDate() + (7 * direction));
                }
                this.render();
            }

            render() {
                this.updateDateDisplay();
                
                if (this.currentView === 'month') {
                    this.renderMonth();
                } else {
                    this.renderWeek();
                }
                
                this.renderUpcomingEvents();
            }

            updateDateDisplay() {
                const dateStr = this.currentView === 'month' 
                    ? this.currentDate.toLocaleString('es', { month: 'long', year: 'numeric' })
                    : `Semana del ${this.getWeekStart().toLocaleDateString('es')}`;
                
                document.getElementById('currentDate').textContent = 
                    dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
            }

            renderMonth() {
                const grid = document.getElementById('calendarGrid');
                grid.innerHTML = '';

                const year = this.currentDate.getFullYear();
                const month = this.currentDate.getMonth();
                
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const startDate = new Date(firstDay);
                startDate.setDate(startDate.getDate() - firstDay.getDay());

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                for (let i = 0; i < 42; i++) {
                    const currentDate = new Date(startDate);
                    currentDate.setDate(startDate.getDate() + i);
                    
                    const dayElement = document.createElement('div');
                    dayElement.className = 'calendar-day';
                    
                    if (currentDate.getMonth() !== month) {
                        dayElement.classList.add('other-month');
                    }
                    
                    if (currentDate.getTime() === today.getTime()) {
                        dayElement.classList.add('today');
                    }

                    // Check if this date is selected
                    if (this.selectedDate && currentDate.toDateString() === this.selectedDate.toDateString()) {
                        dayElement.classList.add('selected');
                    }

                    const dayEvents = this.getEventsForDate(currentDate);
                    
                    dayElement.innerHTML = `
                        <div class="day-number">${currentDate.getDate()}</div>
                        <div class="day-events">
                            ${dayEvents.map(event => `
                                <div class="event-label ${event.type}" onclick="event.stopPropagation(); showEventDetails(${event.id})">
                                    ${this.getEventIcon(event.type)} ${event.lote}
                                </div>
                            `).join('')}
                        </div>
                    `;

                    // Add click event to select date
                    dayElement.addEventListener('click', () => {
                        this.selectDate(new Date(currentDate));
                    });

                    grid.appendChild(dayElement);
                }
            }

            renderWeek() {
                const grid = document.getElementById('weekGrid');
                grid.innerHTML = '';

                const weekStart = this.getWeekStart();
                const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

                // Header
                grid.innerHTML = '<div class="week-hour"></div>';
                for (let i = 0; i < 7; i++) {
                    const date = new Date(weekStart);
                    date.setDate(weekStart.getDate() + i);
                    grid.innerHTML += `
                        <div class="week-hour">
                            ${days[i]}<br>
                            <small>${date.getDate()}</small>
                        </div>
                    `;
                }

                // Hours
                for (let hour = 6; hour < 20; hour++) {
                    grid.innerHTML += `<div class="week-hour">${hour}:00</div>`;
                    
                    for (let day = 0; day < 7; day++) {
                        const date = new Date(weekStart);
                        date.setDate(weekStart.getDate() + day);
                        
                        const dayEvents = this.getEventsForDate(date);
                        const weekDayElement = document.createElement('div');
                        weekDayElement.className = 'week-day';
                        weekDayElement.innerHTML = `
                            ${dayEvents.map(event => `
                                <div class="event-label ${event.type}" onclick="event.stopPropagation(); showEventDetails(${event.id})">
                                    ${this.getEventIcon(event.type)} ${event.lote}
                                </div>
                            `).join('')}
                        `;
                        
                        // Add click event to select date in week view
                        weekDayElement.addEventListener('click', () => {
                            this.selectDate(new Date(date));
                        });

                        grid.appendChild(weekDayElement);
                    }
                }
            }

            getWeekStart() {
                const date = new Date(this.currentDate);
                const day = date.getDay();
                const diff = date.getDate() - day;
                return new Date(date.setDate(diff));
            }

            getEventsForDate(date) {
                const dateStr = date.toISOString().split('T')[0];
                return this.events.filter(event => event.date === dateStr);
            }

            getEventIcon(type) {
                const icons = {
                    siembra: '🌱',
                    poda: '✂️',
                    fertilizacion: '🌿',
                    riego: '💧',
                    cosecha: '🌾'
                };
                return icons[type] || '📅';
            }

            renderUpcomingEvents() {
                const container = document.getElementById('upcomingList');
                const today = new Date();
                const upcoming = this.events
                    .filter(event => {
                        const eventDate = new Date(event.date);
                        const daysDiff = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
                        return daysDiff >= 0 && daysDiff <= 7;
                    })
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                if (upcoming.length === 0) {
                    container.innerHTML = '<p style="color: #6c757d; text-align: center;">No hay actividades próximas</p>';
                    return;
                }

                container.innerHTML = upcoming.map(event => {
                    const eventDate = new Date(event.date);
                    const daysDiff = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
                    const isUrgent = daysDiff <= 1;
                    
                    return `
                        <div class="event-item ${isUrgent ? 'urgent' : ''}" onclick="showEventDetails(${event.id})">
                            <strong>${this.getEventIcon(event.type)} ${event.lote}</strong><br>
                            <small>${event.type.toUpperCase()} - ${eventDate.toLocaleDateString('es')}</small>
                            ${daysDiff === 0 ? '<br><em style="color: #f44336;">¡Hoy!</em>' : 
                              daysDiff === 1 ? '<br><em style="color: #ff9800;">¡Mañana!</em>' : 
                              `<br><em>En ${daysDiff} días</em>`}
                        </div>
                    `;
                }).join('');
            }

            checkNotifications() {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);

                const todayStr = today.toISOString().split('T')[0];
                const tomorrowStr = tomorrow.toISOString().split('T')[0];

                const todayEvents = this.events.filter(event => event.date === todayStr);
                const tomorrowEvents = this.events.filter(event => event.date === tomorrowStr);

                todayEvents.forEach(event => {
                    this.showNotification(
                        `¡Actividad para hoy! ${event.type} en ${event.lote}`, 
                        'warning'
                    );
                });

                tomorrowEvents.forEach(event => {
                    this.showNotification(
                        `Recordatorio: ${event.type} en ${event.lote} para mañana`, 
                        'info'
                    );
                });
            }

            showNotification(message, type = 'success') {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.textContent = message;

                document.getElementById('notifications').appendChild(notification);

                setTimeout(() => {
                    notification.remove();
                }, 5000);
            }
        }

        // Initialize calendar
        const calendario = new CalendarioAgricola();

        // Global functions
        function showEventDetails(eventId) {
            const event = calendario.events.find(e => e.id === eventId);
            if (!event) return;

            const modal = document.getElementById('eventModal');
            const content = document.getElementById('modalContent');
            
            content.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <h4>${calendario.getEventIcon(event.type)} ${event.type.toUpperCase()}</h4>
                    <p><strong>Lote:</strong> ${event.lote}</p>
                    <p><strong>Fecha:</strong> ${new Date(event.date).toLocaleDateString('es', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</p>
                    ${event.description ? `<p><strong>Descripción:</strong> ${event.description}</p>` : ''}
                </div>
                <button class="btn btn-primary" onclick="deleteEvent(${event.id})" style="background: #f44336; margin-right: 10px;">
                    Eliminar Actividad
                </button>
            `;

            modal.classList.add('active');
        }

        function closeModal() {
            document.getElementById('eventModal').classList.remove('active');
        }

        function deleteEvent(eventId) {
            if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
                calendario.events = calendario.events.filter(e => e.id !== eventId);
                calendario.saveEvents();
                calendario.render();
                closeModal();
                calendario.showNotification('Actividad eliminada correctamente', 'success');
            }
        }

        // Close modal when clicking outside
        document.getElementById('eventModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                closeModal();
            }
        });