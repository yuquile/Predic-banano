// prediccion.js
const form = document.getElementById("formPrediccion");
const resultado = document.getElementById("resultado");
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

  resultado.textContent = `🌟 Cosecha estimada: ${rendimiento.toFixed(2)} toneladas por hectárea`;

  // Guardar para mostrar en dashboard
  localStorage.setItem("ultimaPrediccion", JSON.stringify({
    rendimiento: rendimiento.toFixed(2),
    fecha: new Date().toLocaleString(),
    fase: data.fase
  }));

  // Curva de predicción según comportamiento
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

  if (chartInstance) chartInstance.destroy();

  const ctx = document.getElementById("graficoPrediccion").getContext("2d");
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [{
        label: '📈 Predicción de cosecha (Tn/Ha)',
        data: curva,
        borderColor: '#43a047',
        backgroundColor: 'rgba(67, 160, 71, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1200,
        easing: 'easeInOutQuart'
      },
      plugins: {
        legend: {
          labels: { color: '#2e7d32', font: { size: 14, weight: 'bold' } }
        },
        tooltip: {
          callbacks: {
            label: ctx => `🍌 ${ctx.parsed.y.toFixed(2)} Tn/Ha`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Toneladas por Hectárea',
            color: '#2e7d32',
            font: { weight: 'bold' }
          }
        }
      }
    }
  });
});
