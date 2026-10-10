import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../src/lib/product-admin-input.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { optionalProductContent: parse } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
assert.equal(parse('option_groups', ''), null);
assert.equal(parse('details_sections', '   '), null);
assert.equal(parse('faqs', 'null'), null);
assert.deepEqual(JSON.parse(parse('option_groups', '• Table Lamp\n• Floor Lamp')), [{ name: 'Options', options: [{ name: 'Table Lamp' }, { name: 'Floor Lamp' }] }]);
assert.deepEqual(JSON.parse(parse('details_sections', '• Table Lamp\r\n- Solid wood')), [{ title: 'Details', items: ['Table Lamp', 'Solid wood'] }]);
assert.deepEqual(JSON.parse(parse('dimensions', 'Height: 24 inches')), [{ label: 'Height', value: '24 inches' }]);
assert.deepEqual(JSON.parse(parse('faqs', 'Assembly required?: No')), [{ question: 'Assembly required?', answer: 'No' }]);
assert.deepEqual(JSON.parse(parse('paired_slugs', '• lamp-one\n• lamp-two')), ['lamp-one', 'lamp-two']);
assert.deepEqual(JSON.parse(parse('details_sections', '[{"title":"Care","items":["Wipe clean"]}]')), [{ title: 'Care', items: ['Wipe clean'] }]);
for (const key of ['option_groups', 'details_sections', 'dimensions', 'faqs', 'related_searches', 'related_category_slugs', 'ask_prompts', 'paired_slugs', 'collection_slugs', 'similar_slugs', 'still_deciding']) {
  assert.equal(parse(key, ''), null);
  assert.ok(Array.isArray(JSON.parse(parse(key, '• Table Lamp'))));
}
console.log('PASS: optional blanks, pasted bullets, structured JSON, and field-specific text conversion.');
