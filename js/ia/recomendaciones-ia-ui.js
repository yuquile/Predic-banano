import { buildCropContext } from './contexto-finca.js';
import { evaluarRecomendaciones } from './reglas-motor.js';

// ── Elementos del DOM ─────────────────────────────────────────────────────────
const grid       = document.getElementById('chatMessages');
const btnRefresh = document.getElementById('btnNewChat');

// KPI spans
const kpiHigh    = document.getElementById('kpiHigh');
const kpiMedium  = document.getElementById('kpiMedium');
const kpiOk      = document.getElementById('kpiOk');

// Chip counts
const countAll       = document.getElementById('countAll');
const countPlagas    = document.getElementById('countPlagas');
const countInventario= document.getElementById('countInventario');
const countHighChip  = document.getElementById('countHigh');

// ── Estado global ─────────────────────────────────────────────────────────────
let _allRecs  = [];           // todas las recomendaciones del ciclo actual
let _activeFilter = 'all';   // filtro activo

// ── Utilidades ────────────────────────────────────────────────────────────────

/** Devuelve la antigüedad de una fecha como texto en español */
function relativeDate(dateStr) {
    if (!dateStr) return '—';
    const past = new Date(dateStr);
    if (isNaN(past.getTime())) return '—';
    const diffMs   = Date.now() - past.getTime();
    const diffDays = Math.floor(diffMs / 86_400_000);
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Hace 1 día';
    return `Hace ${diffDays} días`;
}

/** Renderiza una tarjeta en el grid */
function appendCard(rec) {
    const priorityClass = rec.prioridad === 'alta'  ? 'priority-high'
                        : rec.prioridad === 'media' ? 'priority-medium'
                        :                             'priority-low';

    const badgeLabel = rec.prioridad === 'alta'  ? 'Alta'
                     : rec.prioridad === 'media' ? 'Media'
                     :                             'Baja';

    const origenIcon  = rec.origen === 'plagas' ? 'bug' : 'package';
    const dateText    = relativeDate(rec.fecha);

    const article = document.createElement('article');
    article.className = `rec-card ${priorityClass}`;
    article.dataset.origen    = rec.origen;
    article.dataset.prioridad = rec.prioridad;

    article.innerHTML = `
        <div class="priority-strip"></div>
        <div class="rec-content">
            <div class="rec-header">
                <div class="rec-icon">
                    <i data-lucide="${origenIcon}" style="width:18px;height:18px;"></i>
                </div>
                <span class="rec-title">${rec.lote}</span>
                <span class="rec-badge">${badgeLabel}</span>
            </div>
            <p class="rec-message">${rec.mensaje}</p>
            <div class="rec-footer">
                <span class="rec-meta">
                    <span class="dot"></span> ${dateText}
                </span>
                <button class="btn-attend" aria-label="Marcar como atendido">
                    <i data-lucide="check" style="width:14px;height:14px;"></i>
                    Marcar como atendido
                </button>
            </div>
        </div>
    `;

    grid.appendChild(article);
}

/** Renderiza el estado vacío */
function renderEmpty() {
    grid.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">
                <i data-lucide="circle-check-big" style="width:48px;height:48px;"></i>
            </div>
            <h2 class="empty-title">Sin alertas activas</h2>
            <p class="empty-message">
                Todos los lotes están en condiciones normales.
                El monitoreo continúa sin novedades que requieran atención.
            </p>
        </div>
    `;
}

/** Actualiza los contadores de los chips de filtro */
function updateCounts(recs) {
    const total     = recs.length;
    const plagas    = recs.filter(r => r.origen === 'plagas').length;
    const inventario= recs.filter(r => r.origen === 'inventario').length;
    const high      = recs.filter(r => r.prioridad === 'alta').length;
    const medium    = recs.filter(r => r.prioridad === 'media').length;

    if (countAll)        countAll.textContent        = total;
    if (countPlagas)     countPlagas.textContent     = plagas;
    if (countInventario) countInventario.textContent = inventario;
    if (countHighChip)   countHighChip.textContent   = high;

    // KPIs
    if (kpiHigh)   kpiHigh.textContent   = high;
    if (kpiMedium) kpiMedium.textContent = medium;
    if (kpiOk)     kpiOk.textContent     = '—';   // sería calculado con datos reales de lotes
}

/** Aplica el filtro activo y re-renderiza */
function applyFilter(filter) {
    _activeFilter = filter;
    grid.innerHTML = '';

    const filtered = _allRecs.filter(rec => {
        if (filter === 'all')        return true;
        if (filter === 'plagas')     return rec.origen === 'plagas';
        if (filter === 'inventario') return rec.origen === 'inventario';
        if (filter === 'high')       return rec.prioridad === 'alta';
        return true;
    });

    if (filtered.length === 0) {
        renderEmpty();
    } else {
        filtered.forEach(rec => appendCard(rec));
    }

    // Re-inicializar Lucide para los nuevos iconos inyectados
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ── Motor principal ───────────────────────────────────────────────────────────

function initRulesEngine() {
    const context = buildCropContext();
    _allRecs = evaluarRecomendaciones(context.plagasData, context.inventarioData);

    updateCounts(_allRecs);
    applyFilter(_activeFilter);   // respeta el filtro activo al refrescar

    // Actualizar chips del DOM con estado activo
    document.querySelectorAll('.filter-chip').forEach(chip => {
        const isActive = chip.dataset.filter === _activeFilter;
        chip.classList.toggle('active', isActive);
        chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

// ── Interactividad de chips ────────────────────────────────────────────────────

document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', function () {
        document.querySelectorAll('.filter-chip').forEach(c => {
            c.classList.remove('active');
            c.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-pressed', 'true');
        applyFilter(this.dataset.filter);
    });

    chip.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// ── Botón refresh ─────────────────────────────────────────────────────────────
if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
        _activeFilter = 'all';
        initRulesEngine();
    });
}

// ── Arranque ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initRulesEngine();
});
