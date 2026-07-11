const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, '../pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('theme.css')) return;

  const linkStr = '<link rel="stylesheet" href="../css/theme.css" />\n  ';
  
  if (content.includes('<link rel="stylesheet" href="../css/')) {
    content = content.replace(/(<link rel="stylesheet" href="\.\.\/css\/[^>]+>)/, linkStr + '$1');
  } else if (content.includes('</head>')) {
    content = content.replace('</head>', linkStr + '</head>');
  }

  fs.writeFileSync(filePath, content);
  console.log('Updated', file);
});
