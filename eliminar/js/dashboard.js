import { auth } from '../core/firebase.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm';

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    mostrarPagina('inicio');
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  Swal.fire({
    title: '¿Cerrar sesión?',
    text: '¿Deseas salir del sistema?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      auth.signOut().then(() => window.location.href = 'login.html');
    }
  });
});

document.querySelectorAll('button[data-page]').forEach(btn => {
  btn.addEventListener('click', () => {
    mostrarPagina(btn.dataset.page);
  });
});

function mostrarPagina(pagina) {
  const cont = document.getElementById("contenido");
  cont.classList.remove("fade-in");

  setTimeout(() => {
    let html = "";

    if (pagina === 'inicio') {
      const prediccion = JSON.parse(localStorage.getItem("ultimaPrediccion"));
      const grafico = JSON.parse(localStorage.getItem("graficoUltimaPrediccion"));

      html = `
        <div class="card"><h2>Volumen Importado</h2><p>1,500 Tn</p></div>
        <div class="card"><h2>Contenedores en tránsito</h2><p>28</p></div>
        <div class="card"><h2>Producción estimada</h2><p>900 Tn</p></div>`;

      if (prediccion && grafico?.curva) {
        html += `
          <div class="card">
            <h2>🌱 Última Predicción de Cosecha</h2>
            <p><strong>Fecha:</strong> ${grafico.fecha}</p>
            <p><strong>Rendimiento estimado:</strong> ${prediccion.rendimiento} Tn/Ha</p>
            <canvas id="graficoInicio" height="200"></canvas>
          </div>`;
      } else {
        html += `
          <div class="card">
            <h2>🌱 Última Predicción</h2>
            <p>No se ha realizado ninguna predicción aún.</p>
          </div>`;
      }
    } else if (pagina === 'importaciones') {
      html = `<div class="card"><h2>Control de Importaciones</h2><p>Estado de pedidos, aduanas y embarques.</p></div>`;
    } else if (pagina === 'prediccion') {
      html = `<div class="card"><h2>Predicción de cosecha</h2><p>Haz clic en el menú lateral para predecir.</p></div>`;
    } else if (pagina === 'estadisticas') {
      html = `<div class="card"><h2>Estadísticas Históricas</h2><p>Rendimiento por mes, finca y región.</p></div>`;
    }

    cont.innerHTML = html;
    cont.classList.add("fade-in");

    if (pagina === 'inicio') {
      const grafico = JSON.parse(localStorage.getItem("graficoUltimaPrediccion"));

      if (grafico?.curva) {
        const ctx = document.getElementById('graficoInicio').getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
            datasets: [{
              label: 'Predicción (Tn/Ha)',
              data: grafico.curva,
              borderColor: '#4caf50',
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              fill: true,
              tension: 0.4,
              pointRadius: 4
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Toneladas por Hectárea'
                }
              }
            }
          }
        });
      }
    }
  }, 200);
}
