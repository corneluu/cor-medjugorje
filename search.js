const fs = require('fs');
const path = require('path');

function walk(dir, results) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        walk(filePath, results);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.pdf', '.mp3', '.m4a', '.wav'].includes(ext)) {
        results.push({
          path: filePath,
          name: file,
          dir: dir
        });
      }
    }
  });
}

const results = [];
walk('D:/site-apps/inctcpartituri', results);
walk('D:/site-apps/HC-Partituri', results);

fs.writeFileSync('D:/site-apps/MEDJUGORJE/search_results.json', JSON.stringify(results, null, 2));
console.log(`Found ${results.length} files.`);
