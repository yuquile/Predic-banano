const fs = require('fs');
const path = require('path');

const cssDir = path.resolve(__dirname, '../css/pages');
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));

const baseGlobal = `
/* FASE 2: Contención Global y Textos Largos */
html {
  overflow-x: hidden;
}
*, *::before, *::after {
  box-sizing: border-box;
}

/* Selectores específicos para textos dinámicos o largos */
.export-details, .user-name, .card-title, .product-description, h1, h2, h3, h4, h5, h6, p, a, span, li, th, td {
  overflow-wrap: break-word;
  word-break: break-word;
}
`;

for (const file of cssFiles) {
    const filePath = path.join(cssDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Solo lo añadimos si no existe ya
    if (!content.includes('/* FASE 2: Contención Global y Textos Largos */')) {
        content = baseGlobal + '\n' + content;
        fs.writeFileSync(filePath, content);
    }
}
console.log('Fase 2 inyectada en todos los CSS.');
