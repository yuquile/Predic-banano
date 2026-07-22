 // Datos simulados de producción
        const productionData = [
            { month: 'Enero', year: 2024, finca: 'norte', cultivo: 'maiz', production: 15000, hectares: 50, exported: 75 },
            { month: 'Febrero', year: 2024, finca: 'sur', cultivo: 'arroz', production: 18000, hectares: 60, exported: 80 },
            { month: 'Marzo', year: 2024, finca: 'este', cultivo: 'soja', production: 12000, hectares: 40, exported: 70 },
            { month: 'Abril', year: 2024, finca: 'oeste', cultivo: 'trigo', production: 20000, hectares: 65, exported: 85 },
            { month: 'Mayo', year: 2024, finca: 'norte', cultivo: 'maiz', production: 22000, hectares: 55, exported: 78 },
            { month: 'Junio', year: 2024, finca: 'sur', cultivo: 'arroz', production: 19000, hectares: 58, exported: 82 },
            { month: 'Julio', year: 2024, finca: 'este', cultivo: 'soja', production: 16000, hectares: 45, exported: 73 },
            { month: 'Agosto', year: 2024, finca: 'oeste', cultivo: 'trigo', production: 25000, hectares: 70, exported: 88 },
            { month: 'Septiembre', year: 2024, finca: 'norte', cultivo: 'maiz', production: 21000, hectares: 52, exported: 76 },
            { month: 'Octubre', year: 2024, finca: 'sur', cultivo: 'arroz', production: 17000, hectares: 55, exported: 79 },
            { month: 'Noviembre', year: 2024, finca: 'este', cultivo: 'soja', production: 14000, hectares: 42, exported: 71 },
            { month: 'Diciembre', year: 2024, finca: 'oeste', cultivo: 'trigo', production: 23000, hectares: 68, exported: 86 },
            
            // Datos 2023
            { month: 'Enero', year: 2023, finca: 'norte', cultivo: 'maiz', production: 14000, hectares: 48, exported: 72 },
            { month: 'Febrero', year: 2023, finca: 'sur', cultivo: 'arroz', production: 16000, hectares: 55, exported: 77 },
            { month: 'Marzo', year: 2023, finca: 'este', cultivo: 'soja', production: 11000, hectares: 38, exported: 68 },
            { month: 'Abril', year: 2023, finca: 'oeste', cultivo: 'trigo', production: 18000, hectares: 60, exported: 82 },
            { month: 'Mayo', year: 2023, finca: 'norte', cultivo: 'maiz', production: 20000, hectares: 52, exported: 75 },
            { month: 'Junio', year: 2023, finca: 'sur', cultivo: 'arroz', production: 17000, hectares: 56, exported: 79 },
            { month: 'Julio', year: 2023, finca: 'este', cultivo: 'soja', production: 15000, hectares: 43, exported: 70 },
            { month: 'Agosto', year: 2023, finca: 'oeste', cultivo: 'trigo', production: 22000, hectares: 65, exported: 85 },
            { month: 'Septiembre', year: 2023, finca: 'norte', cultivo: 'maiz', production: 19000, hectares: 50, exported: 73 },
            { month: 'Octubre', year: 2023, finca: 'sur', cultivo: 'arroz', production: 16000, hectares: 54, exported: 78 },
            { month: 'Noviembre', year: 2023, finca: 'este', cultivo: 'soja', production: 13000, hectares: 40, exported: 69 },
            { month: 'Diciembre', year: 2023, finca: 'oeste', cultivo: 'trigo', production: 21000, hectares: 63, exported: 83 }
        ];

        let charts = {};

        // Inicializar la aplicación
        document.addEventListener('DOMContentLoaded', function() {
            initializeCharts();
            updateDashboard();
            setupEventListeners();
        });

        function setupEventListeners() {
            document.getElementById('yearFilter').addEventListener('change', updateDashboard);
            document.getElementById('fincaFilter').addEventListener('change', updateDashboard);
            document.getElementById('cultivoFilter').addEventListener('change', updateDashboard);
        }

        function getFilteredData() {
            const yearFilter = document.getElementById('yearFilter').value;
            const fincaFilter = document.getElementById('fincaFilter').value;
            const cultivoFilter = document.getElementById('cultivoFilter').value;

            return productionData.filter(item => {
                return (yearFilter === 'all' || item.year.toString() === yearFilter) &&
                       (fincaFilter === 'all' || item.finca === fincaFilter) &&
                       (cultivoFilter === 'all' || item.cultivo === cultivoFilter);
            });
        }

        function updateMetrics() {
            const data = getFilteredData();
            
            const totalProduction = data.reduce((sum, item) => sum + item.production, 0);
            const totalHectares = data.reduce((sum, item) => sum + item.hectares, 0);
            const avgYield = totalHectares > 0 ? Math.round(totalProduction / totalHectares) : 0;
            const avgExported = data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.exported, 0) / data.length) : 0;
            const totalFarms = new Set(data.map(item => item.finca)).size;

            document.getElementById('totalProduction').textContent = totalProduction.toLocaleString();
            document.getElementById('avgYield').textContent = avgYield.toLocaleString();
            document.getElementById('exportPercent').textContent = avgExported + '%';
            document.getElementById('totalFarms').textContent = totalFarms;
        }

        function initializeCharts() {
            // Gráfico de producción mensual
            const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
            charts.monthly = new Chart(monthlyCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Producción (Kg)',
                        data: [],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString() + ' kg';
                                }
                            }
                        }
                    }
                }
            });

            // Gráfico comparativo por años
            const yearlyCtx = document.getElementById('yearlyChart').getContext('2d');
            charts.yearly = new Chart(yearlyCtx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Producción Total (Kg)',
                        data: [],
                        backgroundColor: 'rgba(102, 126, 234, 0.8)',
                        borderColor: '#667eea',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString() + ' kg';
                                }
                            }
                        }
                    }
                }
            });

            // Gráfico por fincas
            const farmsCtx = document.getElementById('farmsChart').getContext('2d');
            charts.farms = new Chart(farmsCtx, {
                type: 'doughnut',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            '#667eea',
                            '#764ba2',
                            '#f093fb',
                            '#f5576c'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });

            // Gráfico por cultivos
            const cropsCtx = document.getElementById('cropsChart').getContext('2d');
            charts.crops = new Chart(cropsCtx, {
                type: 'pie',
                data: {
                    labels: [],
                    datasets: [{
                        data: [],
                        backgroundColor: [
                            '#11998e',
                            '#38ef7d',
                            '#667eea',
                            '#764ba2'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });

            // Gráfico exportación vs nacional
            const exportCtx = document.getElementById('exportChart').getContext('2d');
            charts.export = new Chart(exportCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Exportado', 'Nacional'],
                    datasets: [{
                        data: [0, 0],
                        backgroundColor: ['#667eea', '#f5576c']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });

            // Gráfico rendimiento por hectárea
            const yieldCtx = document.getElementById('yieldChart').getContext('2d');
            charts.yield = new Chart(yieldCtx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Kg/Hectárea',
                        data: [],
                        backgroundColor: 'rgba(17, 153, 142, 0.8)',
                        borderColor: '#11998e',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value + ' kg/ha';
                                }
                            }
                        }
                    }
                }
            });
        }

        function updateDashboard() {
            showLoading();
            
            setTimeout(() => {
                const data = getFilteredData();
                
                updateMetrics();
                updateMonthlyChart(data);
                updateYearlyChart(data);
                updateFarmsChart(data);
                updateCropsChart(data);
                updateExportChart(data);
                updateYieldChart(data);
                updateTable(data);
                
                hideLoading();
            }, 300);
        }

        function updateMonthlyChart(data) {
            const monthlyData = data.reduce((acc, item) => {
                const key = `${item.month} ${item.year}`;
                if (!acc[key]) acc[key] = 0;
                acc[key] += item.production;
                return acc;
            }, {});

            charts.monthly.data.labels = Object.keys(monthlyData);
            charts.monthly.data.datasets[0].data = Object.values(monthlyData);
            charts.monthly.update();
        }

        function updateYearlyChart(data) {
            const yearlyData = data.reduce((acc, item) => {
                if (!acc[item.year]) acc[item.year] = 0;
                acc[item.year] += item.production;
                return acc;
            }, {});

            charts.yearly.data.labels = Object.keys(yearlyData);
            charts.yearly.data.datasets[0].data = Object.values(yearlyData);
            charts.yearly.update();
        }

        function updateFarmsChart(data) {
            const farmsData = data.reduce((acc, item) => {
                const fincaName = item.finca.charAt(0).toUpperCase() + item.finca.slice(1);
                if (!acc[fincaName]) acc[fincaName] = 0;
                acc[fincaName] += item.production;
                return acc;
            }, {});

            charts.farms.data.labels = Object.keys(farmsData);
            charts.farms.data.datasets[0].data = Object.values(farmsData);
            charts.farms.update();
        }

        function updateCropsChart(data) {
            const cropsData = data.reduce((acc, item) => {
                const cropName = item.cultivo.charAt(0).toUpperCase() + item.cultivo.slice(1);
                if (!acc[cropName]) acc[cropName] = 0;
                acc[cropName] += item.production;
                return acc;
            }, {});

            charts.crops.data.labels = Object.keys(cropsData);
            charts.crops.data.datasets[0].data = Object.values(cropsData);
            charts.crops.update();
        }

        function updateExportChart(data) {
            const totalProduction = data.reduce((sum, item) => sum + item.production, 0);
            const totalExported = data.reduce((sum, item) => sum + (item.production * item.exported / 100), 0);
            const totalNational = totalProduction - totalExported;

            charts.export.data.datasets[0].data = [totalExported, totalNational];
            charts.export.update();
        }

        function updateYieldChart(data) {
            const yieldData = data.reduce((acc, item) => {
                const key = `${item.finca} - ${item.cultivo}`;
                if (!acc[key]) {
                    acc[key] = { production: 0, hectares: 0 };
                }
                acc[key].production += item.production;
                acc[key].hectares += item.hectares;
                return acc;
            }, {});

            const labels = Object.keys(yieldData);
            const yields = labels.map(key => Math.round(yieldData[key].production / yieldData[key].hectares));

            charts.yield.data.labels = labels;
            charts.yield.data.datasets[0].data = yields;
            charts.yield.update();
        }

        function updateTable(data) {
            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = '';

            data.forEach(item => {
                const row = tbody.insertRow();
                const yield = Math.round(item.production / item.hectares);
                
                row.innerHTML = `
                    <td>${item.month}</td>
                    <td>${item.year}</td>
                    <td>${item.finca.charAt(0).toUpperCase() + item.finca.slice(1)}</td>
                    <td>${item.cultivo.charAt(0).toUpperCase() + item.cultivo.slice(1)}</td>
                    <td>${item.production.toLocaleString()}</td>
                    <td>${item.hectares}</td>
                    <td>${yield.toLocaleString()}</td>
                    <td>${item.exported}%</td>
                `;
            });
        }

        function showLoading() {
            document.getElementById('loading').style.display = 'block';
        }

        function hideLoading() {
            document.getElementById('loading').style.display = 'none';
        }

        function exportToPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Título
            doc.setFontSize(20);
            doc.text('Análisis Estadístico de Producción', 20, 30);
            
            // Fecha
            doc.setFontSize(12);
            doc.text(`Generado: ${new Date().toLocaleDateString()}`, 20, 45);
            
            // Métricas
            const totalProd = document.getElementById('totalProduction').textContent;
            const avgYield = document.getElementById('avgYield').textContent;
            const exportPercent = document.getElementById('exportPercent').textContent;
            const totalFarms = document.getElementById('totalFarms').textContent;
            
            doc.setFontSize(14);
            doc.text('Métricas Clave:', 20, 65);
            doc.setFontSize(12);
            doc.text(`• Producción Total: ${totalProd} kg`, 25, 80);
            doc.text(`• Rendimiento Promedio: ${avgYield} kg/ha`, 25, 95);
            doc.text(`• Porcentaje Exportado: ${exportPercent}`, 25, 110);
            doc.text(`• Fincas Activas: ${totalFarms}`, 25, 125);
            
            // Tabla de datos
            const data = getFilteredData();
            let yPos = 150;
            
            doc.setFontSize(14);
            doc.text('Datos Detallados:', 20, yPos);
            yPos += 20;
            
            // Encabezados de tabla
            doc.setFontSize(10);
            doc.text('Mes', 20, yPos);
            doc.text('Año', 40, yPos);
            doc.text('Finca', 60, yPos);
            doc.text('Cultivo', 85, yPos);
            doc.text('Producción', 115, yPos);
            doc.text('Ha', 145, yPos);
            doc.text('Kg/Ha', 160, yPos);
            doc.text('Exp%', 180, yPos);
            
            yPos += 10;
            
            // Datos de la tabla
            data.slice(0, 15).forEach(item => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 30;
                }
                
                const yield = Math.round(item.production / item.hectares);
                doc.text(item.month.substr(0, 3), 20, yPos);
                doc.text(item.year.toString(), 40, yPos);
                doc.text(item.finca.substr(0, 5), 60, yPos);
                doc.text(item.cultivo.substr(0, 6), 85, yPos);
                doc.text(item.production.toLocaleString(), 115, yPos);
                doc.text(item.hectares.toString(), 145, yPos);
                doc.text(yield.toLocaleString(), 160, yPos);
                doc.text(`${item.exported}%`, 180, yPos);
                
                yPos += 8;
            });
            
            doc.save('analisis-produccion.pdf');
        }

        function exportToExcel() {
            const data = getFilteredData();
            
            // Preparar datos para Excel
            const excelData = data.map(item => ({
                'Mes': item.month,
                'Año': item.year,
                'Finca': item.finca.charAt(0).toUpperCase() + item.finca.slice(1),
                'Cultivo': item.cultivo.charAt(0).toUpperCase() + item.cultivo.slice(1),
                'Producción (Kg)': item.production,
                'Hectáreas': item.hectares,
                'Kg/Hectárea': Math.round(item.production / item.hectares),
                'Exportado (%)': item.exported
            }));
            
            // Agregar métricas al inicio
            const metrics = [
                { 'Mes': 'MÉTRICAS GENERALES', 'Año': '', 'Finca': '', 'Cultivo': '', 'Producción (Kg)': '', 'Hectáreas': '', 'Kg/Hectárea': '', 'Exportado (%)': '' },
                { 'Mes': 'Total Producción', 'Año': document.getElementById('totalProduction').textContent + ' kg', 'Finca': '', 'Cultivo': '', 'Producción (Kg)': '', 'Hectáreas': '', 'Kg/Hectárea': '', 'Exportado (%)': '' },
                { 'Mes': 'Rendimiento Promedio', 'Año': document.getElementById('avgYield').textContent + ' kg/ha', 'Finca': '', 'Cultivo': '', 'Producción (Kg)': '', 'Hectáreas': '', 'Kg/Hectárea': '', 'Exportado (%)': '' },
                { 'Mes': 'Porcentaje Exportado', 'Año': document.getElementById('exportPercent').textContent, 'Finca': '', 'Cultivo': '', 'Producción (Kg)': '', 'Hectáreas': '', 'Kg/Hectárea': '', 'Exportado (%)': '' },
                { 'Mes': 'Fincas Activas', 'Año': document.getElementById('totalFarms').textContent, 'Finca': '', 'Cultivo': '', 'Producción (Kg)': '', 'Hectáreas': '', 'Kg/Hectárea': '', 'Exportado (%)': '' },
                { 'Mes': '', 'Año': '', 'Finca': '', 'Cultivo': '', 'Producción (Kg)': '', 'Hectáreas': '', 'Kg/Hectárea': '', 'Exportado (%)': '' },
                { 'Mes': 'DATOS DETALLADOS', 'Año': '', 'Finca': '', 'Cultivo': '', 'Producción (Kg)': '', 'Hectáreas': '', 'Kg/Hectárea': '', 'Exportado (%)': '' }
            ];
            
            const finalData = [...metrics, ...excelData];
            
            // Crear workbook
            const ws = XLSX.utils.json_to_sheet(finalData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Análisis Producción");
            
            // Guardar archivo
            XLSX.writeFile(wb, 'analisis-produccion.xlsx');
        }

        // Animaciones y efectos adicionales
        function addChartAnimations() {
            const cards = document.querySelectorAll('.card');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fadeIn 0.6s ease-in';
                    }
                });
            });

            cards.forEach(card => {
                observer.observe(card);
            });
        }

        // Inicializar animaciones cuando la página carga
        document.addEventListener('DOMContentLoaded', function() {
            addChartAnimations();
        });

        // Función para actualizar datos en tiempo real (simulado)
        setInterval(() => {
            // Simular pequeños cambios en los datos cada 30 segundos
            if (Math.random() > 0.7) {
                const randomIndex = Math.floor(Math.random() * productionData.length);
                const variation = Math.floor(Math.random() * 1000) - 500;
                productionData[randomIndex].production += variation;
                
                if (productionData[randomIndex].production < 0) {
                    productionData[randomIndex].production = Math.abs(variation);
                }
                
                // Solo actualizar si no hay filtros activos
                const yearFilter = document.getElementById('yearFilter').value;
                const fincaFilter = document.getElementById('fincaFilter').value;
                const cultivoFilter = document.getElementById('cultivoFilter').value;
                
                if (yearFilter === 'all' && fincaFilter === 'all' && cultivoFilter === 'all') {
                    updateDashboard();
                }
            }
        }, 30000);

        // Función para mostrar tooltips informativos
        function showTooltip(element, message) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerHTML = message;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
                max-width: 200px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 3000);
        }

        // Agregar tooltips a elementos importantes
        document.addEventListener('DOMContentLoaded', function() {
            const metricCards = document.querySelectorAll('.metric-card');
            metricCards.forEach((card, index) => {
                card.addEventListener('mouseenter', function() {
                    const messages = [
                        'Suma total de la producción en kilogramos para el período seleccionado',
                        'Rendimiento promedio por hectárea cultivada',
                        'Porcentaje de la producción destinada a exportación',
                        'Número de fincas con producción activa'
                    ];
                    showTooltip(this, messages[index]);
                });
            });
        });