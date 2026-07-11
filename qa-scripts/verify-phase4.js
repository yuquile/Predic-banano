const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, '../pages');
const outputDir = path.resolve(__dirname, '../docs/qa/overflow-final');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let totalErrors = 0;

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));
  
  for (const file of files) {
    const pageUrl = `file:///${path.join(pagesDir, file).replace(/\\/g, '/')}`;
    console.log(`Verificando ${file}...`);
    const page = await browser.newPage();
    
    page.on('pageerror', err => {
        console.error(`[JS Error en ${file}]`, err.message);
        totalErrors++;
    });
    page.on('console', msg => {
        if (msg.type() === 'error' && !msg.text().includes('favicon')) {
            console.error(`[Consola Error en ${file}]`, msg.text());
            // Ignore some expected network errors or non-critical issues if any, but log them
        }
    });

    await page.goto(pageUrl, { waitUntil: 'networkidle0' });

    // 100% zoom, 1920x1080
    await page.setViewport({ width: 1920, height: 1080 });
    await page.evaluate(() => document.body.style.zoom = 1);
    await page.screenshot({ path: path.join(outputDir, `${file.replace('.html', '')}-100.png`), fullPage: true });

    // 150% zoom, 1920x1080
    await page.evaluate(() => document.body.style.zoom = 1.5);
    await page.screenshot({ path: path.join(outputDir, `${file.replace('.html', '')}-150.png`), fullPage: true });

    // Mobile 320px width
    await page.setViewport({ width: 320, height: 800 });
    await page.evaluate(() => document.body.style.zoom = 1);
    await page.screenshot({ path: path.join(outputDir, `${file.replace('.html', '')}-320px.png`), fullPage: true });

    await page.close();
  }

  await browser.close();
  console.log(`Verificación completa! Errores detectados: ${totalErrors}`);
}

takeScreenshots().catch(console.error);
