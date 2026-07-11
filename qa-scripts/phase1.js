const fs = require('fs');
const path = require('path');

const cssDir = path.resolve(__dirname, '../css/pages');
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));

const baseClasses = `
/* Contención estricta para iconos e imágenes (Fase 1) */
.icon-fixed {
  flex-shrink: 0 !important;
}
.img-fluid {
  max-width: 100% !important;
  height: auto !important;
}
`;

for (const file of cssFiles) {
    const filePath = path.join(cssDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('.icon-fixed')) {
        content = baseClasses + '\n' + content;
        fs.writeFileSync(filePath, content);
    }
}

const htmlDir = path.resolve(__dirname, '../pages');
const htmlFiles = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;
for (const file of htmlFiles) {
    const filePath = path.join(htmlDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add min-w-0 to specific flex text containers
    content = content.replace(/class="flex-1 leading-snug"/g, 'class="flex-1 leading-snug min-w-0"');
    content = content.replace(/class="export-info flex-1"/g, 'class="export-info flex-1 min-w-0"');
    
    // Check width: 300px forced widths and convert to max-width: 300px, width: 100%
    content = content.replace(/width:\s*(\d+)px/g, (match, px) => {
        // Only safely apply to large container-like elements, >150px
        if (parseInt(px) > 150 && parseInt(px) < 500) {
            return `width: 100%; max-width: ${px}px`;
        }
        return match;
    });

    // Add icon-fixed to lucide icons (unless already there)
    content = content.replace(/<i data-lucide="([^"]+)"([^>]*)>/g, (match, icon, rest) => {
        if (!rest.includes('icon-fixed')) {
            if (rest.includes('class="')) {
                return `<i data-lucide="${icon}"${rest.replace('class="', 'class="icon-fixed ')}>`;
            } else {
                return `<i data-lucide="${icon}" class="icon-fixed"${rest}>`;
            }
        }
        return match;
    });

    fs.writeFileSync(filePath, content);
    modifiedCount++;
}
console.log(`Updated ${cssFiles.length} CSS and ${modifiedCount} HTML files.`);
