import fs from 'fs';
import path from 'path';

const root = path.resolve(import.meta.dirname, '../..');

const hrefs = [
  ['product-details.html', '/products'],
  ['order-details.html', '/account/orders'],
  ['categories.html', '/categories'],
  ['contact-us.html', '/contact'],
  ['about-us.html', '/about'],
  ['whishlist.html', '/account/wishlist'],
  ['blogs-details.html', '/blogs/story'],
  ['payment.html', '/checkout'],
  ['product.html', '/products'],
  ['signup.html', '/register'],
  ['invoice.html', '/account/orders'],
  ['orders.html', '/account/orders'],
  ['login.html', '/login'],
  ['index.html', '/'],
  ['cart.html', '/cart'],
  ['blogs.html', '/blogs']
];

function toJsx(html) {
  let s = html.replace(/<!--[\s\S]*?-->/g, '');
  for (const [from, to] of hrefs) {
    s = s.replaceAll(`href="${from}`, `href="${to}`);
    s = s.replaceAll(`action="${from}`, `action="${to === '/products' ? '/search' : to}`);
  }
  s = s.replaceAll('src="assets/', 'src="/assets/');
  s = s.replaceAll("src='assets/", "src='/assets/");
  s = s.replaceAll('href="assets/', 'href="/assets/');
  s = s.replace(/\sclass=/g, ' className=');
  s = s.replace(/\sfor=/g, ' htmlFor=');
  s = s.replace(/\stabindex=/g, ' tabIndex=');
  s = s.replace(/\sautocomplete=/g, ' autoComplete=');
  s = s.replace(/\sautofocus/g, ' autoFocus');
  s = s.replace(/\sreadonly/g, ' readOnly');
  s = s.replace(/\scolspan=/g, ' colSpan=');
  s = s.replace(/\srowspan=/g, ' rowSpan=');
  s = s.replace(/<(img|input|br|hr|source|meta|link)([^>]*?)>/gi, (m, tag, rest) => {
    if (rest.trim().endsWith('/')) return m;
    return `<${tag}${rest} />`;
  });
  return s.trim();
}

function slice(file, start, end) {
  const lines = fs.readFileSync(path.join(root, file), 'utf8').split(/\r?\n/);
  return lines.slice(start - 1, end).join('\n');
}

function writeComponent(rel, name, body, extra = '') {
  const out = path.join(import.meta.dirname, '..', rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(
    out,
    `${extra}export function ${name}() {\n  return (\n    <>\n${body}\n    </>\n  );\n}\n`
  );
}

writeComponent(
  'src/components/layout/SiteHeader.tsx',
  'SiteHeader',
  toJsx(slice('index.html', 42, 768))
);
writeComponent(
  'src/components/layout/SiteFooter.tsx',
  'SiteFooter',
  toJsx(slice('index.html', 1307, 1411))
);
writeComponent(
  'src/components/home/HomeMain.tsx',
  'HomeMain',
  toJsx(slice('index.html', 770, 1306))
);

const pages = [
  ['about-us.html', 'src/components/pages/AboutMain.tsx', 'AboutMain'],
  ['contact-us.html', 'src/components/pages/ContactMain.tsx', 'ContactMain'],
  ['blogs.html', 'src/components/pages/BlogsMain.tsx', 'BlogsMain'],
  ['blogs-details.html', 'src/components/pages/BlogStoryMain.tsx', 'BlogStoryMain'],
  ['categories.html', 'src/components/pages/CategoriesBanner.tsx', 'CategoriesBanner']
];

for (const [file, rel, name] of pages) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const m = html.match(/<main[\s\S]*?<\/main>/i);
  if (!m) throw new Error('no main ' + file);
  writeComponent(rel, name, toJsx(m[0]));
}

writeComponent(
  'src/components/product/ProductExtras.tsx',
  'ProductExtras',
  toJsx(slice('product-details.html', 863, 914))
);

console.log('converted');
