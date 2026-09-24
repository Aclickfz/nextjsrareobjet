import fs from 'fs';
import path from 'path';

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (full.endsWith('.tsx')) {
      let text = fs.readFileSync(full, 'utf8');
      text = text.replaceAll('tabIndex="-1"', 'tabIndex={-1}');
      text = text.replaceAll('fetchpriority=', 'fetchPriority=');
      fs.writeFileSync(full, text);
    }
  }
}
walk('src/components');
console.log('attrs fixed');
