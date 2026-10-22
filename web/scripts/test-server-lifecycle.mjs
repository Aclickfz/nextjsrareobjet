import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../', import.meta.url));

if (process.argv[2] === '--child') {
  // Exercise the actual CLI. IPC invokes the registered handlers on Windows,
  // where child.kill('SIGTERM') would terminate without running JS cleanup.
  process.on('message', ({ signals }) => {
    for (const signal of signals) process.emit(signal, signal);
  });
  process.argv = [process.execPath, require.resolve('next/dist/bin/next'),
    'start', '-H', '127.0.0.1', '-p', process.argv[3]];
  require('next/dist/bin/next');
} else {
  async function reservePort() {
    const server = createServer();
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    return server;
  }

  async function run(signals, occupiedPort) {
    const reservation = occupiedPort ? null : await reservePort();
    const port = occupiedPort ?? reservation.address().port;
    if (reservation) await new Promise((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()));
    const env = { ...process.env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1' };
    delete env.NEXT_MANUAL_SIG_HANDLE;
    const child = fork(fileURLToPath(import.meta.url), ['--child', String(port)], {
      cwd: root, env, silent: true, windowsHide: true,
    });
    let output = '';
    child.stdout.on('data', data => { output += data; });
    child.stderr.on('data', data => { output += data; });
    const exited = once(child, 'exit');
    const watchdog = setTimeout(() => child.kill('SIGKILL'), 45000);
    try {
      if (!occupiedPort) {
        let ready = false;
        for (let attempt = 0; attempt < 150; attempt++) {
          assert.equal(child.exitCode, null, output);
          try {
            const response = await fetch(`http://127.0.0.1:${port}/login`, { signal: AbortSignal.timeout(2000) });
            await response.text();
            if (response.status === 200) { ready = true; break; }
          } catch { /* The listener or request handler is still starting. */ }
          await delay(100);
        }
        assert.ok(ready, `Login did not return HTTP 200.\n${output}`);
        // Send the entire burst in one turn, before asynchronous cleanup finishes.
        child.send({ signals });
      }
      const [code, signal] = await exited;
      assert.equal(signal, null, `Timed out or was killed: ${signal}\n${output}`);
      assert.equal(code, occupiedPort ? 1 : signals[0] === 'SIGINT' ? 130 : 143, output);
      assert.doesNotMatch(output, /ERR_SERVER_NOT_RUNNING|Server is not running|unhandledRejection/i);
      if (occupiedPort) assert.match(output, /EADDRINUSE/);
      console.log(`PASS ${occupiedPort ? 'occupied port fails with EADDRINUSE' : `HTTP 200, ${signals.join(' + ')} (in-process signal emission)`}`);
    } finally {
      clearTimeout(watchdog);
      if (child.exitCode === null && child.signalCode === null) {
        child.kill('SIGKILL');
        await exited;
      }
    }
  }

  for (const signals of [['SIGTERM'], ['SIGINT'], ['SIGTERM', 'SIGTERM', 'SIGINT'], ['SIGINT', 'SIGINT', 'SIGTERM']]) {
    await run(signals);
  }
  const occupied = await reservePort();
  try { await run([], occupied.address().port); }
  finally { await new Promise((resolve, reject) => occupied.close(error => error ? reject(error) : resolve())); }
}
