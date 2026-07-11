const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, '../pages');
const outputDir = path.resolve(__dirname, '../docs/qa/overflow-baseline');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));
  
  for (const file of files) {
    const pageUrl = `file:///${path.join(pagesDir, file).replace(/\\/g, '/')}`;
    console.log(`Processing ${file}...`);
    const page = await browser.newPage();
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
  console.log('Screenshots complete!');
}

takeScreenshots().catch(console.error);
