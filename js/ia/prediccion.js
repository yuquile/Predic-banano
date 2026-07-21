// js/ia/prediccion.js
const form = document.getElementById("formPrediccion");
const emptyState = document.getElementById("chart-empty-state");

// KPIs
const kpiProduccion = document.getElementById("kpi-produccion");
const kpiRendimiento = document.getElementById("kpi-rendimiento");
const kpiConfianza = document.getElementById("kpi-confianza");

let chartInstance = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  // Simulación con base en 5 años de datos históricos promedio
  const baseHistorica = {
    siembra:    { temp: 28, hum: 75, rendimiento: 28 },
    floración:  { temp: 30, hum: 80, rendimiento: 34 },
    maduración: { temp: 27, hum: 78, rendimiento: 30 }
  };

  const faseData = baseHistorica[data.fase];

  // Ajuste controlado respecto al histórico
  const ajusteTemp = (data.temperatura - faseData.temp) * 0.8;
  const ajusteHum  = (data.humedad - faseData.hum) * 0.3;

  const rendimiento = faseData.rendimiento + ajusteTemp + ajusteHum;
  const produccionTotal = rendimiento * 38; // 38 Hectáreas activas estimadas
  
  // Calcular confianza (basado en cuán lejos están los datos de los parámetros ideales)
  const desviacion = Math.abs(ajusteTemp) + Math.abs(ajusteHum);
  let confianza = 95 - desviacion; 
  if (confianza > 99) confianza = 98;
  if (confianza < 60) confianza = 65;

  // Actualizar KPIs en la UI
  kpiRendimiento.innerHTML = `${rendimiento.toFixed(2)} <span class="kpi-unit">Tn/Ha</span>`;
  kpiProduccion.innerHTML = `${Math.round(produccionTotal)} <span class="kpi-unit">Tn</span>`;
  kpiConfianza.innerHTML = `${confianza.toFixed(1)}<span class="kpi-unit">%</span>`;

  // Guardar para mostrar en dashboard
  localStorage.setItem("ultimaPrediccion", JSON.stringify({
    rendimiento: rendimiento.toFixed(2),
    fecha: new Date().toLocaleString(),
    fase: data.fase
  }));

  // Curva de predicción según comportamiento (4 semanas)
  let curva = [];
  if (data.temperatura >= 30 && data.humedad >= 70) {
    curva = [rendimiento * 0.6, rendimiento * 0.85, rendimiento * 0.95, rendimiento];
  } else if (data.temperatura < 20 || data.humedad < 50) {
    curva = [rendimiento * 0.4, rendimiento * 0.5, rendimiento * 0.6, rendimiento * 0.7];
  } else {
    curva = [rendimiento * 0.5, rendimiento * 0.65, rendimiento * 0.8, rendimiento];
  }

  localStorage.setItem("graficoUltimaPrediccion", JSON.stringify({
    curva,
    fecha: new Date().toLocaleString(),
    fase: data.fase
  }));

  // Ocultar Empty State
  if(emptyState) emptyState.style.display = 'none';

  // Destruir instancia anterior si existe
  if (chartInstance) chartInstance.destroy();

  const ctx = document.getElementById("graficoPrediccion").getContext("2d");
  
  // Crear gradiente para el Area Chart
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, 'rgba(34, 197, 94, 0.4)'); // var(--success) con opacidad
  gradient.addColorStop(1, 'rgba(34, 197, 94, 0.0)');

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [{
        label: 'Proyección (Tn/Ha)',
        data: curva,
        borderColor: '#10b981', // var(--success)
        backgroundColor: gradient,
        fill: true,
        tension: 0.4, // Curva suave
        borderWidth: 3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#10b981',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          display: false // Oculto para que sea más limpio
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { size: 13, family: 'Inter' },
          bodyFont: { size: 14, weight: 'bold', family: 'Inter' },
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: ctx => `${ctx.parsed.y.toFixed(2)} Tn/Ha`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 12 }, color: '#64748b' }
        },
        y: {
          beginAtZero: true,
          grid: { 
            color: 'rgba(15, 23, 42, 0.05)',
            drawBorder: false,
            borderDash: [5, 5] // Grid punteada
          },
          ticks: { 
            font: { family: 'Inter', size: 12 }, 
            color: '#64748b',
            padding: 10
          }
        }
      }
    }
  });
});
