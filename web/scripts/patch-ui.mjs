import fs from 'fs';

function patch(file) {
  let s = fs.readFileSync(file, 'utf8');
  s = s.replace(
    "document.addEventListener('DOMContentLoaded', () => {",
    'function bootSiteUI() {'
  );
  if (s.includes('function myFunction')) {
    s = s.replace(
      '});\n\nfunction myFunction',
      '}\n\nfunction startSiteUI() {\n  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootSiteUI);\n  else bootSiteUI();\n}\nstartSiteUI();\n\nfunction myFunction'
    );
  } else {
    s = s.replace(/\}\);\s*$/, '}\nfunction startSiteUI() {\n  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootSiteUI);\n  else bootSiteUI();\n}\nstartSiteUI();\n');
  }
  fs.writeFileSync(file, s);
  console.log('patched', file);
}

patch('public/assets/js/index.js');
patch('public/assets/js/carousels.js');
patch('public/assets/js/filter.js');
