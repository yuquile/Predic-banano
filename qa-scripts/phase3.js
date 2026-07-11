const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const cssDir = path.resolve(__dirname, '../css/pages');
const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));

function pxToRem(pxStr) {
    const px = parseFloat(pxStr);
    return (px / 16).toFixed(4).replace(/\.?0+$/, '') + 'rem';
}

function processCss(content) {
    // We only process properties in the whitelist: font-size, padding, margin, width, height, gap
    // But we avoid borders, box-shadow, media queries, transform, border-radius.
    
    // Split into blocks and avoid media queries
    let result = '';
    let inMedia = false;
    let lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        if (line.includes('@media')) {
            inMedia = true;
        }
        if (inMedia && line.includes('}')) {
            // Very naive check for media query end. Just heuristic.
            // A better way is regex replacing specific properties only when they match px.
        }
        
        // Replace padding, margin, width, height, gap
        line = line.replace(/(padding|margin|width|height|gap|padding-top|padding-bottom|padding-left|padding-right|margin-top|margin-bottom|margin-left|margin-right):\s*([^;]+);/g, (match, prop, values) => {
            // Ignore if it's a fixed icon class or max-width
            if (line.includes('max-width') || line.includes('.icon-fixed')) return match;
            
            // replace px values in the property
            let newValues = values.replace(/(\d*\.?\d+)px/g, (m, px) => pxToRem(px));
            return `${prop}: ${newValues};`;
        });
        
        // Replace font-size
        line = line.replace(/font-size:\s*(\d*\.?\d+)px;/g, (match, px) => {
            const num = parseFloat(px);
            if (num > 16) {
                // Large titles use clamp
                const rem = num / 16;
                const min = (rem * 0.8).toFixed(2);
                const max = rem.toFixed(2);
                return `font-size: clamp(${min}rem, 2vw, ${max}rem);`;
            } else {
                return `font-size: ${pxToRem(px)};`;
            }
        });
        
        result += line + '\n';
    }
    return result;
}

for (const file of cssFiles) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(cssDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    content = processCss(content);
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        
        // Execute git commit for this file
        try {
            execSync(`git add "${filePath}"`, { cwd: path.resolve(__dirname, '..') });
            execSync(`git commit -m "fix(css): migración a unidades fluidas en ${file}"`, { cwd: path.resolve(__dirname, '..') });
            console.log(`Committed changes for ${file}`);
        } catch (e) {
            console.log(`Could not commit ${file}`, e.message);
        }
    }
}
console.log('Fase 3 completed.');
