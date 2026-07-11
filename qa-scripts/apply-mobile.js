const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../pages/dashboard.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Overlay and Sidebar adjustments
content = content.replace(/<!-- ===== SIDEBAR ===== -->\s*<aside class="([^"]+)">/, (match, cls) => {
    // Remove conflicting classes if any, though we can just rebuild it
    let newCls = cls.replace(/md:w-64|w-full|bg-primary|transition-all/g, '').trim();
    return `<!-- ===== SIDEBAR ===== -->\n    <div id="sidebarOverlay" class="fixed inset-0 bg-black/50 z-40 hidden md:hidden"></div>\n    <aside id="sidebar" class="flex flex-col w-64 shrink-0 h-screen overflow-y-auto transition-transform duration-300 bg-primary fixed inset-y-0 left-0 z-50 transform -translate-x-full md:relative md:translate-x-0 ${newCls}">`;
});

// Add Close Menu Button to Sidebar Header
content = content.replace(/(<span style="color: var\(--accent\);[^>]*>BananoSys<\/span>\s*<div[^>]*>AGRO INTELLIGENCE<\/div>\s*<\/div>)\s*<\/div>/, '$1\n        <button id="closeMenu" class="md:hidden p-1 text-white opacity-70 hover:opacity-100">\n          <i data-lucide="x" class="icon-fixed" style="width:20px; height:20px;"></i>\n        </button>\n      </div>');


// 2. Hamburger Menu Button
content = content.replace(/<header class="([^"]+)">\s*<div class="min-w-0">/, (match, cls) => {
    return `<header class="${cls}">
        <div class="flex items-center gap-3">
          <button id="menuToggle" class="md:hidden p-2 -ml-2 text-text-main rounded hover:bg-gray-100" aria-label="Abrir menú" aria-expanded="false">
            <i data-lucide="menu" class="icon-fixed" style="width:24px; height:24px;"></i>
          </button>
          <div class="min-w-0">`;
});
// Need to add 'flex items-center gap-3' around the title to keep hamburger and title together, then close it properly.
// But the original had `<div class="min-w-0">` wrapping the h1. Let's make sure it closes.
// Ah, the regex above replaces `<div class="min-w-0">` with `flex items-center gap-3` then `min-w-0` inside it. We need a closing div.
content = content.replace(/<div style="font-size: 12px; color: var\(--text-muted\); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px;">\s*Temporada activa — Sem. 23 — 07 Jun 2026\s*<\/div>\s*<\/div>\s*<div class="flex items-center gap-3">/, `
          <div style="font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px;">
            Temporada activa — Sem. 23 — 07 Jun 2026
          </div>
        </div>
        </div>

        <div class="flex items-center gap-3">`);


// 3. rounded -> rounded-xl and shadow-soft
content = content.replace(/class="([^"]*rounded[^"]*)"/g, (match, cls) => {
    // Avoid changing button rounded or rounded-full
    if (cls.includes('rounded-full') || cls.includes('button')) return match;
    let newCls = cls.replace(/\brounded\b/g, 'rounded-xl');
    // Add shadow-soft to specific panels if they are bg-card or bg-primary
    if (newCls.includes('bg-card') || newCls.includes('bg-primary') || newCls.includes('bg-white') || newCls.includes('border')) {
        if (!newCls.includes('shadow-soft')) {
            newCls += ' shadow-soft';
        }
    }
    return `class="${newCls}"`;
});


// 4. Trend Chart Container
content = content.replace(/(<div id="predictionYield"[^>]*>--<\/div>\s*<\/div>)/, '$1\n              <div id="trendChart" class="trend-chart-container"></div>');


// 5. Change JS variable for +12% fixed
content = content.replace(/document\.getElementById\('expectedGrowth'\)\.textContent = `\+\$\{Math\.round\(10 \+ Math\.random\(\) \* 20\)\}%`;/, "document.getElementById('expectedGrowth').textContent = `+12%`;");


// 6. Temp Display
content = content.replace(/<div id="temperature" style="font-size: 48px; font-weight: 200; color: var\(--text-main\); line-height: 1;">/, '<div id="temperature" class="temp-display" style="color: var(--text-main);">');


// 7. Inject Scripts at bottom
content = content.replace(/<\/body>/, '  <script type="module" src="../js/ui/hamburger-menu.js"></script>\n  <script type="module" src="../js/ui/trend-chart.js"></script>\n</body>');


fs.writeFileSync(filePath, content);
console.log('HTML procesado correctamente.');
