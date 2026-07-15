// js/theme-manager.js
// Manejador del sistema de temas de BananoSys

function initTheme() {
    // 1. Leer de localStorage
    const savedTheme = localStorage.getItem('bananosys-theme');
    
    // 2. Si existe, aplicarlo. Si no, aplicar "modern" por defecto
    const themeToApply = savedTheme || 'modern';
    
    // 3. Inyectar en el documento inmediatamente
    document.documentElement.setAttribute('data-theme', themeToApply);
}

function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('bananosys-theme', themeName);
}

// Ejecutar inmediatamente al cargar el script en el <head>
initTheme();
