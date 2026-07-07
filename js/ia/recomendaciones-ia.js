// Datos específicos para cultivo de banano
let bananaFarmData = {
    currentType: 'conventional', // conventional o organic
    plots: {
        conventional: [
            { 
                id: 1, 
                name: 'Lote A - Conv.', 
                stage: 'flowering', 
                weeks_to_harvest: 12, 
                health: 85, 
                productivity: 45, // racimos por hectárea
                sigatoka_level: 20,
                treatment: 'fungicida_sistemico',
                last_fertilization: 3, // semanas desde última fertilización
                fertilizer_type: 'urea_sulfato'
            },
            { 
                id: 2, 
                name: 'Lote B - Conv.', 
                stage: 'fruit_development', 
                weeks_to_harvest: 8, 
                health: 78, 
                productivity: 48,
                sigatoka_level: 35,
                treatment: 'fungicida_preventivo',
                last_fertilization: 2,
                fertilizer_type: 'abono_completo'
            },
            { 
                id: 3, 
                name: 'Lote C - Conv.', 
                stage: 'harvest_ready', 
                weeks_to_harvest: 2, 
                health: 92, 
                productivity: 52,
                sigatoka_level: 15,
                treatment: 'ninguno',
                last_fertilization: 1,
                fertilizer_type: 'potasio'
            }
        ],
        organic: [
            { 
                id: 4, 
                name: 'Lote D - Org.', 
                stage: 'vegetative', 
                weeks_to_harvest: 20, 
                health: 88, 
                productivity: 38,
                sigatoka_level: 45,
                treatment: 'aceite_neem',
                last_fertilization: 4,
                fertilizer_type: 'compost_organico'
            },
            { 
                id: 5, 
                name: 'Lote E - Org.', 
                stage: 'flowering', 
                weeks_to_harvest: 14, 
                health: 82, 
                productivity: 40,
                sigatoka_level: 40,
                treatment: 'caldo_bordelés',
                last_fertilization: 3,
                fertilizer_type: 'abono_verde'
            },
            { 
                id: 6, 
                name: 'Lote F - Org.', 
                stage: 'fruit_development', 
                weeks_to_harvest: 6, 
                health: 75, 
                productivity: 42,
                sigatoka_level: 50,
                treatment: 'bicarbonato_potasio',
                last_fertilization: 5,
                fertilizer_type: 'humus_lombriz'
            }
        ]
    },
    climate: {
        temperature: 26.5, // °C
        humidity: 75,      // %
        rainfall: 180,     // mm mensual
        wind_speed: 12,    // km/h
        uv_index: 8
    },
    diseases: {
        sigatoka_negra: 25,    // % incidencia
        nematodos: 15,         // % afectación radicular
        bacteriosis: 5         // % incidencia
    },
    soil: {
        ph: 6.2,
        organic_matter: 3.8,    // %
        potassium: 180,         // ppm
        phosphorus: 25,         // ppm
        nitrogen: 45,           // ppm
        drainage: 'good'
    },
    historical_productivity: [42, 38, 45, 41, 39, 44, 43, 46, 40, 47] // racimos/ha por período
};

// Sistema de IA especializado para banano
class BananaAI {
    constructor() {
        this.rules = {
            optimal_harvest: {
                conventional: { min_weeks: 2, max_weeks: 3, health_min: 80 },
                organic: { min_weeks: 1, max_weeks: 4, health_min: 75 }
            },
            sigatoka_risk: {
                low: 25,
                medium: 40,
                high: 60
            },
            climate_thresholds: {
                temp_optimal: [24, 28],
                humidity_critical: 85,
                rainfall_excess: 250
            },
            fertilization: {
                conventional: {
                    frequency_weeks: 4,
                    nitrogen_min: 40,
                    phosphorus_min: 20,
                    potassium_min: 150
                },
                organic: {
                    frequency_weeks: 6,
                    nitrogen_min: 35,
                    phosphorus_min: 18,
                    potassium_min: 140
                }
            },
            fumigation: {
                conventional: {
                    sigatoka_threshold: 30,
                    preventive_interval: 3
                },
                organic: {
                    sigatoka_threshold: 35,
                    preventive_interval: 4
                }
            }
        };
    }

    analyzeHarvestTiming(plot, type) {
        const rules = this.rules.optimal_harvest[type];
        const recommendations = [];

        if (plot.weeks_to_harvest <= rules.max_weeks && plot.health >= rules.health_min) {
            if (plot.weeks_to_harvest <= rules.min_weeks) {
                recommendations.push({
                    priority: 'alta',
                    message: `${plot.name}: Cosecha INMEDIATA - Racimos en punto óptimo`,
                    action: 'harvest_now'
                });
            } else {
                recommendations.push({
                    priority: 'media',
                    message: `${plot.name}: Preparar cosecha en ${plot.weeks_to_harvest} semanas`,
                    action: 'prepare_harvest'
                });
            }
        }

        return recommendations;
    }

    analyzeSigatokaRisk(plot, type) {
        const recommendations = [];
        
        if (plot.sigatoka_level > this.rules.sigatoka_risk.high) {
            const treatment = type === 'organic' 
                ? 'Aplicar caldo bordelés o aceite de neem inmediatamente'
                : 'Aplicar fungicida sistémico de alta eficacia';
            
            recommendations.push({
                priority: 'alta',
                message: `${plot.name}: Sigatoka crítica (${plot.sigatoka_level}%) - ${treatment}`,
                action: 'sigatoka_treatment'
            });
        } else if (plot.sigatoka_level > this.rules.sigatoka_risk.medium) {
            recommendations.push({
                priority: 'media',
                message: `${plot.name}: Monitorear sigatoka de cerca - Preventivo recomendado`,
                action: 'sigatoka_monitoring'
            });
        }

        return recommendations;
    }

    analyzeClimateRisks(climate) {
        const recommendations = [];

        if (climate.humidity > this.rules.climate_thresholds.humidity_critical) {
            recommendations.push({
                priority: 'alta',
                message: `Humedad crítica (${climate.humidity}%) - Alto riesgo de enfermedades fúngicas`,
                action: 'humidity_management'
            });
        }

        if (climate.rainfall > this.rules.climate_thresholds.rainfall_excess) {
            recommendations.push({
                priority: 'media',
                message: `Precipitación excesiva (${climate.rainfall}mm) - Mejorar drenaje`,
                action: 'drainage_improvement'
            });
        }

        if (climate.temperature < this.rules.climate_thresholds.temp_optimal[0] || 
            climate.temperature > this.rules.climate_thresholds.temp_optimal[1]) {
            recommendations.push({
                priority: 'baja',
                message: `Temperatura subóptima (${climate.temperature}°C) - Monitorear crecimiento`,
                action: 'temperature_monitoring'
            });
        }

        return recommendations;
    }

    analyzeFertilizationNeeds(plots, type, soil) {
        const recommendations = [];
        const rules = this.rules.fertilization[type];

        plots.forEach(plot => {
            // Verificar frecuencia de fertilización
            if (plot.last_fertilization >= rules.frequency_weeks) {
                const fertilizers = type === 'organic' 
                    ? ['compost orgánico', 'humus de lombriz', 'abono verde', 'bocashi']
                    : ['urea', 'sulfato de amonio', 'DAP', 'muriato de potasio'];
                
                const randomFertilizer = fertilizers[Math.floor(Math.random() * fertilizers.length)];
                
                recommendations.push({
                    priority: 'media',
                    message: `${plot.name}: Fertilización requerida (${plot.last_fertilization} sem.) - Aplicar ${randomFertilizer}`,
                    action: 'fertilization_needed'
                });
            }
        });

        // Análisis de nutrientes del suelo
        if (soil.nitrogen < rules.nitrogen_min) {
            const nitrogenSource = type === 'organic' ? 'compost rico en nitrógeno' : 'urea o sulfato de amonio';
            recommendations.push({
                priority: 'alta',
                message: `Deficiencia de nitrógeno (${soil.nitrogen}ppm) - Aplicar ${nitrogenSource}`,
                action: 'nitrogen_deficiency'
            });
        }

        if (soil.phosphorus < rules.phosphorus_min) {
            const phosphorusSource = type === 'organic' ? 'harina de hueso' : 'superfosfato triple';
            recommendations.push({
                priority: 'media',
                message: `Bajo fósforo (${soil.phosphorus}ppm) - Aplicar ${phosphorusSource}`,
                action: 'phosphorus_deficiency'
            });
        }

        if (soil.potassium < rules.potassium_min) {
            const potassiumSource = type === 'organic' ? 'ceniza de plátano o compost' : 'muriato de potasio';
            recommendations.push({
                priority: 'alta',
                message: `Deficiencia de potasio (${soil.potassium}ppm) - Aplicar ${potassiumSource}`,
                action: 'potassium_deficiency'
            });
        }

        return recommendations;
    }

    analyzeFumigationNeeds(plots, type, climate) {
        const recommendations = [];
        const rules = this.rules.fumigation[type];

        plots.forEach(plot => {
            // Fumigación por sigatoka
            if (plot.sigatoka_level > rules.sigatoka_threshold) {
                const fumigants = type === 'organic' 
                    ? ['Cuchubiol', 'aceite de neem', 'caldo bordelés', 'bicarbonato de potasio', 'extracto de ajo']
                    : ['Cuchibiol (preventivo)', 'propiconazol', 'tebuconazol', 'mancozeb', 'azoxistrobina'];
                
                const randomFumigant = fumigants[Math.floor(Math.random() * fumigants.length)];
                
                recommendations.push({
                    priority: 'alta',
                    message: `${plot.name}: Fumigación urgente contra sigatoka - Usar ${randomFumigant}`,
                    action: 'fumigation_sigatoka'
                });
            }
        });

        // Fumigación preventiva por condiciones climáticas
        if (climate.humidity > 80) {
            const preventiveFumigants = type === 'organic' 
                ? ['Cuchubiol preventivo', 'aceite de neem diludo']
                : ['Cuchibiol (dosis preventiva)', 'fungicida preventivo'];
            
            const randomPreventive = preventiveFumigants[Math.floor(Math.random() * preventiveFumigants.length)];
            
            recommendations.push({
                priority: 'media',
                message: `Humedad alta favorece hongos - Fumigación preventiva con ${randomPreventive}`,
                action: 'preventive_fumigation'
            });
        }

        return recommendations;
    }

    compareProductivity(current, historical) {
        const currentAvg = current.reduce((a, b) => a + b.productivity, 0) / current.length;
        const historicalAvg = historical.reduce((a, b) => a + b, 0) / historical.length;
        const difference = ((currentAvg - historicalAvg) / historicalAvg * 100);

        return {
            current: currentAvg.toFixed(1),
            historical: historicalAvg.toFixed(1),
            difference: difference.toFixed(1),
            trend: difference > 0 ? 'mejora' : 'declive',
            status: Math.abs(difference) < 5 ? 'estable' : (difference > 0 ? 'creciente' : 'decreciente')
        };
    }

    detectBananaAnomalies(plots) {
        const anomalies = [];
        
        plots.forEach(plot => {
            // Anomalía: Sigatoka muy alta con salud aparentemente buena
            if (plot.sigatoka_level > 50 && plot.health > 85) {
                anomalies.push({
                    plot: plot.name,
                    type: 'inconsistent_health_disease',
                    severity: 'media',
                    message: 'Salud alta con sigatoka severa - Verificar evaluación'
                });
            }

            // Anomalía: Productividad muy baja para el tipo
            const expectedProductivity = bananaFarmData.currentType === 'conventional' ? 45 : 38;
            if (plot.productivity < expectedProductivity * 0.7) {
                anomalies.push({
                    plot: plot.name,
                    type: 'low_productivity',
                    severity: 'alta',
                    message: 'Productividad anómalamente baja - Investigar causas'
                });
            }
        });

        return anomalies;
    }

    generateProductivityForecast(plots, climate) {
        let forecast = 'estable';
        let confidence = 85;

        // Factor climático
        if (climate.humidity > 80) {
            forecast = 'riesgo_bajo';
            confidence -= 15;
        }

        // Factor de enfermedades
        const avgSigatoka = plots.reduce((a, p) => a + p.sigatoka_level, 0) / plots.length;
        if (avgSigatoka > 40) {
            forecast = 'riesgo_medio';
            confidence -= 20;
        }

        return { forecast, confidence };
    }
}

const bananaAI = new BananaAI();

function switchPlantationType(type) {
    bananaFarmData.currentType = type;
    
    // Actualizar interfaz visual
    document.querySelectorAll('.plantation-type').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelector(`.plantation-type.${type}`).classList.add('active');
    
    generateBananaRecommendations();
}

function generateBananaRecommendations() {
    const currentPlots = bananaFarmData.plots[bananaFarmData.currentType];
    const recommendationsContainer = document.getElementById('recommendations-container');
    const recommendations = [];

    // Análisis de cosecha
    currentPlots.forEach(plot => {
        const harvestRecs = bananaAI.analyzeHarvestTiming(plot, bananaFarmData.currentType);
        recommendations.push(...harvestRecs);
    });

    // Análisis de sigatoka
    currentPlots.forEach(plot => {
        const sigatokaRecs = bananaAI.analyzeSigatokaRisk(plot, bananaFarmData.currentType);
        recommendations.push(...sigatokaRecs);
    });

    // Análisis climático
    const climateRecs = bananaAI.analyzeClimateRisks(bananaFarmData.climate);
    recommendations.push(...climateRecs);

    // Análisis de fertilización
    const fertilizationRecs = bananaAI.analyzeFertilizationNeeds(currentPlots, bananaFarmData.currentType, bananaFarmData.soil);
    recommendations.push(...fertilizationRecs);

    // Análisis de fumigación
    const fumigationRecs = bananaAI.analyzeFumigationNeeds(currentPlots, bananaFarmData.currentType, bananaFarmData.climate);
    recommendations.push(...fumigationRecs);

    // Análisis comparativo
    const productivity = bananaAI.compareProductivity(currentPlots, bananaFarmData.historical_productivity);
    recommendations.push({
        priority: productivity.status === 'decreciente' ? 'media' : 'baja',
        message: `Productividad ${productivity.difference}% ${productivity.trend} vs promedio histórico (${productivity.current} vs ${productivity.historical} racimos/ha)`,
        action: 'productivity_analysis'
    });

    // Pronóstico de productividad
    const forecast = bananaAI.generateProductivityForecast(currentPlots, bananaFarmData.climate);
    recommendations.push({
        priority: forecast.forecast.includes('riesgo') ? 'media' : 'baja',
        message: `Pronóstico: ${forecast.forecast.replace('_', ' ')} (confianza: ${forecast.confidence}%)`,
        action: 'forecast_monitoring'
    });

    // Mostrar recomendaciones
    recommendationsContainer.innerHTML = recommendations.map(rec => `
        <div class="recommendation">
            <h4>
                ${getBananaRecommendationIcon(rec.action)} ${getBananaRecommendationTitle(rec.action)}
                <span class="priority priority-${rec.priority}">${rec.priority.toUpperCase()}</span>
            </h4>
            <p>${rec.message}</p>
        </div>
    `).join('');

    // Generar alertas y actualizar otros paneles
    generateBananaAlerts();
    updateBananaPlots();
    updateBananaMetrics();
    updateDiseaseChart();
}

function generateBananaAlerts() {
    const alertsContainer = document.getElementById('alerts-container');
    const currentPlots = bananaFarmData.plots[bananaFarmData.currentType];
    const alerts = [];

    // Alertas críticas de sigatoka
    const criticalSigatoka = currentPlots.filter(p => p.sigatoka_level > 60);
    if (criticalSigatoka.length > 0) {
        alerts.push({
            type: 'critical',
            icon: '🍂',
            message: `CRÍTICO: Sigatoka severa detectada en ${criticalSigatoka.length} lote(s) - Acción inmediata requerida`
        });
    }

    // Alertas de cosecha
    const harvestReady = currentPlots.filter(p => p.weeks_to_harvest <= 2 && p.health >= 80);
    if (harvestReady.length > 0) {
        alerts.push({
            type: 'warning',
            icon: '✂️',
            message: `${harvestReady.length} lote(s) listo(s) para cosecha - Programar cuadrillas`
        });
    }

    // Alertas de fertilización
    const needsFertilization = currentPlots.filter(p => p.last_fertilization >= 4);
    if (needsFertilization.length > 0) {
        alerts.push({
            type: 'warning',
            icon: '🌱',
            message: `${needsFertilization.length} lote(s) requiere(n) fertilización - Aplicar según cronograma`
        });
    }

    // Alertas de fumigación por sigatoka
    const needsFumigation = currentPlots.filter(p => p.sigatoka_level > 35);
    if (needsFumigation.length > 0) {
        const fumigant = bananaFarmData.currentType === 'organic' ? 'Cuchubiol' : 'fungicida sistémico';
        alerts.push({
            type: 'warning',
            icon: '💨',
            message: `${needsFumigation.length} lote(s) necesita(n) fumigación con ${fumigant} - Sigatoka elevada`
        });
    }

    // Alertas climáticas
    if (bananaFarmData.climate.humidity > 80) {
        alerts.push({
            type: 'warning',
            icon: '💨',
            message: `Humedad alta (${bananaFarmData.climate.humidity}%) - Aumentar ventilación y monitoreo`
        });
    }

    // Alertas nutricionales
    if (bananaFarmData.soil.nitrogen < 40) {
        const nitrogenSource = bananaFarmData.currentType === 'organic' ? 'compost orgánico' : 'urea';
        alerts.push({
            type: 'info',
            icon: '🧪',
            message: `Nitrógeno bajo (${bananaFarmData.soil.nitrogen}ppm) - Aplicar ${nitrogenSource}`
        });
    }

    if (bananaFarmData.soil.potassium < 150) {
        const potassiumSource = bananaFarmData.currentType === 'organic' ? 'ceniza vegetal' : 'muriato de potasio';
        alerts.push({
            type: 'info',
            icon: '🧪',
            message: `Potasio insuficiente (${bananaFarmData.soil.potassium}ppm) - Aplicar ${potassiumSource}`
        });
    }

    // Alertas positivas
    const healthyPlots = currentPlots.filter(p => p.health >= 85 && p.sigatoka_level < 25);
    if (healthyPlots.length >= 2) {
        alerts.push({
            type: 'success',
            icon: '🌟',
            message: `Excelente: ${healthyPlots.length} lote(s) en estado óptimo - Mantener prácticas actuales`
        });
    }

    // Detectar anomalías
    const anomalies = bananaAI.detectBananaAnomalies(currentPlots);
    if (anomalies.length > 0) {
        alerts.push({
            type: 'info',
            icon: '🔍',
            message: `${anomalies.length} anomalía(s) detectada(s) en los datos - Revisar evaluaciones`
        });
    }

    alertsContainer.innerHTML = alerts.map(alert => `
        <div class="alert alert-${alert.type}">
            <span class="icon">${alert.icon}</span>
            <span>${alert.message}</span>
        </div>
    `).join('');
}

function updateBananaPlots() {
    const plotsContainer = document.getElementById('banana-plots');
    const currentPlots = bananaFarmData.plots[bananaFarmData.currentType];
    
    plotsContainer.innerHTML = currentPlots.map(plot => {
        const healthClass = plot.health >= 80 ? 'optimal' : plot.health >= 60 ? 'warning' : 'critical';
        const stageInfo = getBananaStageInfo(plot.stage);
        const sigatokaRisk = plot.sigatoka_level > 40 ? 'critical' : plot.sigatoka_level > 25 ? 'warning' : 'optimal';
        
        return `
            <div class="plot-card">
                <div class="plot-header">
                    <h4>🍌 ${plot.name}</h4>
                    <span class="plot-type-badge badge-${bananaFarmData.currentType}">
                        ${bananaFarmData.currentType === 'conventional' ? 'Convencional' : 'Orgánico'}
                    </span>
                </div>
                
                <div class="banana-stage">
                    <div class="stage-icon">${stageInfo.icon}</div>
                    <div class="stage-info">
                        <h5>${stageInfo.name}</h5>
                        <p>Cosecha en ${plot.weeks_to_harvest} semanas</p>
                    </div>
                </div>

                <div style="margin: 15px 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Salud General</span>
                        <span>${plot.health}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill progress-${healthClass}" style="width: ${plot.health}%"></div>
                    </div>
                </div>

                <div style="margin: 15px 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Riesgo Sigatoka</span>
                        <span>${plot.sigatoka_level}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill progress-${sigatokaRisk}" style="width: ${plot.sigatoka_level}%"></div>
                    </div>
                </div>

                <div style="font-size: 0.9em; color: #556B2F; margin-top: 15px;">
                    <strong>Productividad:</strong> ${plot.productivity} racimos/ha<br>
                    <strong>Tratamiento:</strong> ${plot.treatment.replace('_', ' ')}<br>
                    <strong>Fertilizante:</strong> ${plot.fertilizer_type.replace('_', ' ')}<br>
                    <strong>Última fertilización:</strong> ${plot.last_fertilization} semanas
                </div>
            </div>
        `;
    }).join('');
}

function updateBananaMetrics() {
    const metricsContainer = document.getElementById('metrics-container');
    const currentPlots = bananaFarmData.plots[bananaFarmData.currentType];
    
    const avgHealth = (currentPlots.reduce((a, p) => a + p.health, 0) / currentPlots.length).toFixed(1);
    const avgProductivity = (currentPlots.reduce((a, p) => a + p.productivity, 0) / currentPlots.length).toFixed(1);
    const avgSigatoka = (currentPlots.reduce((a, p) => a + p.sigatoka_level, 0) / currentPlots.length).toFixed(1);
    const plotsReadyHarvest = currentPlots.filter(p => p.weeks_to_harvest <= 3).length;
    
    metricsContainer.innerHTML = `
        <div class="metric">
            <div class="metric-value">${avgHealth}%</div>
            <div class="metric-label">Salud Promedio</div>
        </div>
        <div class="metric">
            <div class="metric-value">${avgProductivity}</div>
            <div class="metric-label">Racimos/Ha</div>
        </div>
        <div class="metric">
            <div class="metric-value">${avgSigatoka}%</div>
            <div class="metric-label">Riesgo Sigatoka</div>
        </div>
        <div class="metric">
            <div class="metric-value">${plotsReadyHarvest}</div>
            <div class="metric-label">Lotes p/Cosecha</div>
        </div>
        <div class="metric">
            <div class="metric-value">${bananaFarmData.climate.temperature}°C</div>
            <div class="metric-label">Temperatura</div>
        </div>
        <div class="metric">
            <div class="metric-value">${bananaFarmData.climate.humidity}%</div>
            <div class="metric-label">Humedad</div>
        </div>
        <div class="metric">
            <div class="metric-value">${bananaFarmData.soil.ph}</div>
            <div class="metric-label">pH Suelo</div>
        </div>
        <div class="metric">
            <div class="metric-value">${bananaFarmData.climate.rainfall}</div>
            <div class="metric-label">Lluvia (mm)</div>
        </div>
    `;
}

function updateDiseaseChart() {
    const chartContainer = document.getElementById('disease-chart-container');
    const diseases = bananaFarmData.diseases;
    
    chartContainer.innerHTML = `
        <div class="disease-bar">
            <div class="bar bar-sigatoka" style="height: ${diseases.sigatoka_negra * 2}px" 
                 title="Sigatoka Negra: ${diseases.sigatoka_negra}%"></div>
            <div class="bar-label">Sigatoka<br>Negra<br>${diseases.sigatoka_negra}%</div>
        </div>
        <div class="disease-bar">
            <div class="bar bar-nematodos" style="height: ${diseases.nematodos * 3}px" 
                 title="Nematodos: ${diseases.nematodos}%"></div>
            <div class="bar-label">Nematodos<br><br>${diseases.nematodos}%</div>
        </div>
        <div class="disease-bar">
            <div class="bar bar-bacteriosis" style="height: ${diseases.bacteriosis * 8}px" 
                 title="Bacteriosis: ${diseases.bacteriosis}%"></div>
            <div class="bar-label">Bacteriosis<br><br>${diseases.bacteriosis}%</div>
        </div>
    `;
}

function updateClimateData() {
    // Simular nuevos datos climáticos realistas para banano
    bananaFarmData.climate = {
        temperature: Math.random() * 6 + 23, // 23-29°C (rango tropical)
        humidity: Math.random() * 25 + 65,   // 65-90%
        rainfall: Math.random() * 150 + 100, // 100-250mm
        wind_speed: Math.random() * 10 + 8,  // 8-18 km/h
        uv_index: Math.random() * 4 + 6      // 6-10
    };
    
    // Redondear valores
    bananaFarmData.climate.temperature = Math.round(bananaFarmData.climate.temperature * 10) / 10;
    bananaFarmData.climate.humidity = Math.round(bananaFarmData.climate.humidity);
    bananaFarmData.climate.rainfall = Math.round(bananaFarmData.climate.rainfall);
    bananaFarmData.climate.wind_speed = Math.round(bananaFarmData.climate.wind_speed * 10) / 10;
    bananaFarmData.climate.uv_index = Math.round(bananaFarmData.climate.uv_index);
    
    // Actualizar enfermedades basado en clima
    if (bananaFarmData.climate.humidity > 80) {
        bananaFarmData.diseases.sigatoka_negra = Math.min(60, bananaFarmData.diseases.sigatoka_negra + Math.random() * 10);
    }
    
    generateBananaRecommendations();
}

function simulateBananaGrowth() {
    const currentPlots = bananaFarmData.plots[bananaFarmData.currentType];
    
    currentPlots.forEach(plot => {
        // Simular progreso del crecimiento
        if (plot.weeks_to_harvest > 0) {
            plot.weeks_to_harvest = Math.max(0, plot.weeks_to_harvest - 1);
            
            // Avanzar etapa si corresponde
            if (plot.stage === 'vegetative' && plot.weeks_to_harvest <= 16) {
                plot.stage = 'flowering';
            } else if (plot.stage === 'flowering' && plot.weeks_to_harvest <= 10) {
                plot.stage = 'fruit_development';
            } else if (plot.stage === 'fruit_development' && plot.weeks_to_harvest <= 3) {
                plot.stage = 'harvest_ready';
            }
        }
        
        // Incrementar semanas desde fertilización
        plot.last_fertilization += 0.25; // Incremento gradual
        
        // Simular cambios en salud (factores ambientales)
        const healthChange = (Math.random() - 0.4) * 8;
        plot.health = Math.max(40, Math.min(100, plot.health + healthChange));
        
        // Simular cambios en sigatoka (dependiente de clima y tratamiento)
        let sigatokaChange = (Math.random() - 0.3) * 10;
        
        if (plot.treatment !== 'ninguno') {
            sigatokaChange -= 5; // Tratamiento reduce sigatoka
        }
        
        if (bananaFarmData.climate.humidity > 80) {
            sigatokaChange += 8; // Humedad alta aumenta sigatoka
        }
        
        plot.sigatoka_level = Math.max(5, Math.min(80, plot.sigatoka_level + sigatokaChange));
        
        // Ajustar productividad basada en salud y manejo
        const baseProductivity = bananaFarmData.currentType === 'conventional' ? 48 : 40;
        const healthFactor = plot.health / 100;
        const diseaseFactor = (100 - plot.sigatoka_level) / 100;
        const nutritionFactor = plot.last_fertilization > 4 ? 0.9 : 1.0; // Penalizar falta de fertilización
        plot.productivity = Math.round(baseProductivity * healthFactor * diseaseFactor * nutritionFactor);
    });
    
    generateBananaRecommendations();
}

function detectBananaDiseases() {
    // Simular detección de enfermedades con IA
    const diseases = bananaFarmData.diseases;
    const alerts = [];
    
    // Aumentar detección de sigatoka si las condiciones son propicias
    if (bananaFarmData.climate.humidity > 75 && bananaFarmData.climate.temperature > 25) {
        diseases.sigatoka_negra = Math.min(70, diseases.sigatoka_negra + Math.random() * 15);
        alerts.push('Condiciones favorables para Sigatoka Negra detectadas');
    }
    
    // Detección de nematodos por análisis de suelo simulado
    if (Math.random() > 0.7) {
        diseases.nematodos = Math.min(40, diseases.nematodos + Math.random() * 8);
        alerts.push('Posible incremento en población de nematodos');
    }
    
    // Detección de bacteriosis
    if (bananaFarmData.climate.wind_speed > 15 && Math.random() > 0.8) {
        diseases.bacteriosis = Math.min(15, diseases.bacteriosis + Math.random() * 5);
        alerts.push('Condiciones de viento pueden propagar bacteriosis');
    }
    
    // Mostrar alertas de detección
    if (alerts.length > 0) {
        const alertsContainer = document.getElementById('alerts-container');
        const detectionAlert = `
            <div class="alert alert-info">
                <span class="icon">🔬</span>
                <span>Análisis completado: ${alerts.join(', ')}</span>
            </div>
        `;
        alertsContainer.innerHTML = detectionAlert + alertsContainer.innerHTML;
    }
    
    generateBananaRecommendations();
}

function getBananaStageInfo(stage) {
    const stages = {
        'vegetative': { icon: '🌱', name: 'Crecimiento Vegetativo' },
        'flowering': { icon: '🌺', name: 'Floración' },
        'fruit_development': { icon: '🍌', name: 'Desarrollo del Fruto' },
        'harvest_ready': { icon: '✂️', name: 'Listo para Cosecha' }
    };
    return stages[stage] || { icon: '🌱', name: 'Etapa Desconocida' };
}

function getBananaRecommendationIcon(action) {
    const icons = {
        'harvest_now': '✂️',
        'prepare_harvest': '📅',
        'sigatoka_treatment': '🍂',
        'sigatoka_monitoring': '🔍',
        'humidity_management': '💨',
        'drainage_improvement': '🚰',
        'temperature_monitoring': '🌡️',
        'productivity_analysis': '📊',
        'forecast_monitoring': '🔮',
        'fertilization_needed': '🌱',
        'nitrogen_deficiency': '🧪',
        'phosphorus_deficiency': '🧪',
        'potassium_deficiency': '🧪',
        'fumigation_sigatoka': '💨',
        'preventive_fumigation': '🛡️'
    };
    return icons[action] || '💡';
}

function getBananaRecommendationTitle(action) {
    const titles = {
        'harvest_now': 'Cosecha Inmediata',
        'prepare_harvest': 'Preparar Cosecha',
        'sigatoka_treatment': 'Tratamiento Sigatoka',
        'sigatoka_monitoring': 'Monitoreo Sigatoka',
        'humidity_management': 'Control de Humedad',
        'drainage_improvement': 'Mejorar Drenaje',
        'temperature_monitoring': 'Monitoreo Térmico',
        'productivity_analysis': 'Análisis de Productividad',
        'forecast_monitoring': 'Pronóstico de Producción',
        'fertilization_needed': 'Fertilización Requerida',
        'nitrogen_deficiency': 'Déficit de Nitrógeno',
        'phosphorus_deficiency': 'Déficit de Fósforo',
        'potassium_deficiency': 'Déficit de Potasio',
        'fumigation_sigatoka': 'Fumigación Anti-Sigatoka',
        'preventive_fumigation': 'Fumigación Preventiva'
    };
    return titles[action] || 'Recomendación General';
}

// Inicializar la aplicación
window.onload = function() {
    // Cargar datos climáticos reales al inicio
    updateClimateData();
    
    // Generar recomendaciones iniciales
    generateBananaRecommendations();
    
    // Actualizar datos climáticos cada 10 minutos (600,000 ms)
    setInterval(updateClimateData, 600000);
    
    // Simular actualizaciones periódicas de cultivos cada 45 segundos
    setInterval(() => {
        const currentPlots = bananaFarmData.plots[bananaFarmData.currentType];
        
        // Pequeños cambios graduales en los cultivos
        currentPlots.forEach(plot => {
            // Cambios muy sutiles para simular el paso del tiempo
            plot.health += (Math.random() - 0.5) * 1;
            plot.health = Math.max(30, Math.min(100, plot.health));
            
            plot.sigatoka_level += (Math.random() - 0.5) * 2;
            plot.sigatoka_level = Math.max(0, Math.min(80, plot.sigatoka_level));
            
            plot.last_fertilization += 0.02; // Incremento muy gradual
        });
        
        // Actualizar solo métricas y gráficos (sin regenerar todo)
        updateBananaMetrics();
        updateDiseaseChart();
        updateBananaPlots();
        
    }, 45000);
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        const alertsContainer = document.getElementById('alerts-container');
        const welcomeAlert = `
            <div class="alert alert-info">
                <span class="icon">🌐</span>
                <span>Sistema conectado con datos climáticos en tiempo real de Milagro, Guayas 📍</span>
            </div>
        `;
        alertsContainer.insertAdjacentHTML('afterbegin', welcomeAlert);
        
        // Remover mensaje de bienvenida después de 8 segundos
        setTimeout(() => {
            const welcomeElement = alertsContainer.querySelector('.alert-info');
            if (welcomeElement && welcomeElement.textContent.includes('Sistema conectado')) {
                welcomeElement.remove();
            }
        }, 8000);
    }, 2000);
};