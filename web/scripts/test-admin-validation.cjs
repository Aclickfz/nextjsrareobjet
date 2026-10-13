const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function load(file, dependencies = {}) {
  const source = fs.readFileSync(new URL(file, 'file://' + __filename.replaceAll('\\', '/')), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  new Function('require', 'exports', compiled)(name => dependencies[name] || require(name), exports);
  return exports;
}
const result = load('../src/lib/admin-action-result.ts');
const { validateProductForm, validateAdminUpload } = load('../src/lib/admin-validation.ts', { './admin-action-result': result });
function product(values = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries({ name: 'Test chair', category_id: '1', price: '', stock_qty: '0', sort_order: '0', ...values })) form.set(key, value);
  return form;
}
assert.doesNotThrow(() => validateProductForm(product()));
for (const [field, value] of [['name', ' '], ['category_id', '0'], ['price', '-1'], ['price', 'NaN'], ['stock_qty', '1.5'], ['stock_qty', '-1'], ['sort_order', '-2']]) {
  assert.throws(() => validateProductForm(product({ [field]: value })), error => error instanceof result.AdminValidationError && Boolean(error.fieldErrors[field]?.length));
}
const fiveMB = new File([new Uint8Array(5 * 1024 * 1024)], 'photo.png', { type: 'image/png' });
const validImage = product();
validImage.set('image', fiveMB);
assert.doesNotThrow(() => validateProductForm(validImage));
const oversized = product();
oversized.set('image', new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'photo.png', { type: 'image/png' }));
assert.throws(() => validateAdminUpload(oversized), error => Boolean(error.fieldErrors.image));
const wrongType = product();
wrongType.set('gallery', new File(['invalid'], 'document.txt', { type: 'text/plain' }));
assert.throws(() => validateAdminUpload(wrongType), error => Boolean(error.fieldErrors.gallery));
const tooMany = product();
tooMany.append('gallery', fiveMB);
tooMany.append('gallery', fiveMB);
assert.throws(() => validateAdminUpload(tooMany), /combined upload is too large/);
console.log('PASS: product validation, field errors, optional prices, 5 MB images, file types, and combined upload limit.');
