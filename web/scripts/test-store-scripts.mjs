import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(
  fs.readFileSync(new URL('../src/components/layout/StoreScripts.tsx', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }
).outputText;

function setup() {
  const scripts = [];
  const errors = [];
  let effect;
  let boots = 0;
  const exports = {};
  vm.runInNewContext(source, {
    exports,
    require: name => {
      assert.equal(name, 'react');
      return { useEffect: callback => { effect = callback; } };
    },
    document: {
      querySelector: selector => scripts.find(script => selector === `script[src="${script.src}"]`),
      createElement: () => ({ remove() { scripts.splice(scripts.indexOf(this), 1); } }),
      body: { appendChild: script => scripts.push(script) }
    },
    window: { bootSiteUI: () => { boots++; } },
    console: { error: (...args) => errors.push(args) }
  });
  exports.StoreScripts();
  return { scripts, errors, mount: () => effect(), boots: () => boots };
}

const flush = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };

// React Strict Mode setup -> cleanup -> setup while jQuery is still pending.
const state = setup();
state.mount()();
state.mount();
await flush();
assert.equal(state.scripts.length, 1, 'Slick must not be inserted before jQuery loads');
const paths = ['vendor/jquery/jquery.min.js', 'vendor/slick/slick.min.js',
  'vendor/swiper/swiper-bundle.min.js', 'js/index.js', 'js/carousels.js', 'js/filter.js'];
for (const [index, path] of paths.entries()) {
  assert.equal(state.scripts[index].src, `/assets/${path}`);
  assert.equal(state.scripts.length, index + 1);
  state.scripts[index].onload();
  await flush();
}
assert.equal(state.boots(), 1);
state.mount();
await flush();
assert.equal(state.scripts.length, paths.length, 'Loaded scripts are reused on remount');
assert.equal(state.boots(), 2);
assert.equal(state.errors.length, 0);

const failed = setup();
failed.mount();
failed.scripts[0].onerror();
await flush();
assert.equal(failed.errors.length, 1, 'Load errors must be reported');
assert.equal(failed.scripts.length, 0);
failed.mount();
assert.equal(failed.scripts.length, 1, 'A failed load can be retried on remount');
assert.equal(failed.scripts[0].src, '/assets/vendor/jquery/jquery.min.js');

const cancelled = setup();
cancelled.mount()();
cancelled.scripts[0].onload();
await flush();
assert.equal(cancelled.scripts.length, 1, 'Unmounted effects stop loading dependencies');
assert.equal(cancelled.boots(), 0);
console.log('PASS delayed jQuery, Strict Mode replay, sequential dependencies, remount, failure/retry, cancellation');
