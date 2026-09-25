import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const source = ts.transpileModule(fs.readFileSync(new URL(`../src/lib/${file}.ts`, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(`(function(require,module,exports){${source}\n})`, { Buffer, URL, process, console })(name => name in mocks ? mocks[name] : require(name), module, module.exports);
  return module.exports;
}
const validation = load('auth-validation');
for (const input of ['https://evil.test', '//evil.test', '/\\evil.test', '/login', '/admin/dashboard', '/a/../admin', '/hello\nworld']) assert.equal(validation.safeNextPath(input), '', input);
assert.equal(validation.safeNextPath('/checkout?item=1&qty=2'), '/checkout?item=1&qty=2');
assert.equal(validation.validPassword('short'), false);
assert.equal(validation.validPassword('😀'.repeat(19)), false);
assert.equal(validation.validPassword('good password'), true);
assert.equal(validation.validToken('a'.repeat(64)), true);
assert.equal(validation.validToken('bad'), false);
assert.equal(validation.validEmail('invalid'), false);
let cookie;
const row = { id: 42, role: 'customer', session_version: 0, email_verified_at: '2026-01-01' };
const auth = load('auth', {
  'next/headers': { cookies: async () => ({ get: () => cookie ? { value: cookie } : undefined }) },
  'next/navigation': { redirect: path => { throw new Error(`REDIRECT:${path}`); } },
  './auth-validation': validation,
  './db': { query: async (sql, params) => params.id === row.id && params.version === row.session_version && (!sql.includes('email_verified_at IS NOT NULL') || row.email_verified_at) ? [row] : [] }
});
const nextEnv = require('@next/env');
nextEnv.loadEnvConfig(process.cwd(), true);
process.env.JWT_SECRET ||= 'test-only-secret';
assert.equal(await auth.currentUser(), null);
cookie = 'invalid';
assert.equal(await auth.currentUser(), null);
cookie = auth.signToken(row);
assert.equal((await auth.currentUser()).id, 42);
await assert.rejects(auth.redirectIfAuthenticated('/checkout'), /REDIRECT:\/checkout/);
row.session_version++;
assert.equal(await auth.currentUser(), null, 'password reset revokes old sessions');
row.role = 'admin';
cookie = auth.signToken(row);
await assert.rejects(auth.redirectIfAuthenticated('/checkout'), /REDIRECT:\/admin\/dashboard/);
console.log('PASS validation, session verification, session revocation, customer/admin redirects');
row.email_verified_at = null;
assert.equal(await auth.currentUser(), null, 'unverified sessions are denied');
let signedIn;
let inserted = false;
let smtpConfigured = true;
let sentPurpose;
let tokenResult = 51;
let consumedPurpose;
let sessionUser = null;
let cleared = false;
const account = { id: 51, email: 'customer@example.com', role: 'customer', password_hash: 'stored-hash', email_verified_at: null, session_version: 0 };
const actions = load('../actions/auth.actions', {
  'bcryptjs': { hash: async () => 'hashed-password', compare: async password => password === 'correct-password' },
  'next/navigation': { redirect: path => { throw new Error(`REDIRECT:${path}`); } },
  '@/lib/db': {
    query: async sql => sql.includes('password_hash') || sql.includes('email_verified_at') ? [account] : [],
    getPool: () => ({ execute: async () => { inserted = true; return [{ insertId: account.id }]; } })
  },
  '@/lib/auth': {
    redirectIfAuthenticated: async () => {}, safeNextPath: validation.safeNextPath,
    getSessionId: async () => '', signToken: user => user,
    setAuthCookie: async user => { signedIn = user; },
    currentUser: async () => sessionUser,
    clearAuthCookie: async () => { cleared = true; }
  },
  '@/lib/auth-validation': validation,
  '@/lib/auth-tokens': { allowAuthAttempt: async () => true, issueAuthEmail: async (_id, _email, purpose) => { sentPurpose = purpose; }, consumeAuthToken: async (_token, purpose) => { consumedPurpose = purpose; return tokenResult; } },
  '@/lib/auth-email': { emailConfiguration: () => { if (!smtpConfigured) throw new Error('No email provider configured'); } },
  '@/repositories/cart.repository': { mergeGuestCart: async () => {} }
});
const loginForm = new FormData();
loginForm.set('email', account.email);
loginForm.set('password', 'wrong-password');
assert.equal((await actions.loginAction(undefined, loginForm)).error, 'Invalid email or password');
assert.equal(signedIn, undefined);
loginForm.set('password', 'correct-password');
loginForm.set('next', '/checkout');
assert.match((await actions.loginAction(undefined, loginForm)).error, /Verify your email/);
assert.equal(signedIn, undefined);
account.email_verified_at = '2026-01-01';
await assert.rejects(actions.loginAction(undefined, loginForm), /REDIRECT:\/checkout/);
assert.equal(signedIn.id, account.id, 'verified accounts can sign in');
signedIn = undefined;
loginForm.set('name', 'Customer');
loginForm.set('phone', '1234567890');
smtpConfigured = false;
assert.match((await actions.registerAction(undefined, loginForm)).error, /Email service/);
assert.equal(inserted, false);
smtpConfigured = true;
assert.match((await actions.registerAction(undefined, loginForm)).message, /verification email/);
assert.equal(inserted, true);
assert.equal(sentPurpose, 'verify');
assert.equal(signedIn, undefined, 'signup must not create a session');
const recovery = new FormData();
recovery.set('email', account.email);
await actions.forgotPasswordAction(undefined, recovery);
assert.equal(sentPurpose, 'reset');
recovery.set('token', 'a'.repeat(64));
recovery.set('next', '/checkout');
await assert.rejects(actions.verifyEmailAction(undefined, recovery), /REDIRECT:\/login\?verified=1&next=%2Fcheckout/);
assert.equal(consumedPurpose, 'verify');
tokenResult = null;
assert.match((await actions.verifyEmailAction(undefined, recovery)).error, /expired or already used/);
recovery.set('password', 'new-password');
recovery.set('confirmPassword', 'different-password');
assert.match((await actions.resetPasswordAction(undefined, recovery)).error, /do not match/);
recovery.set('confirmPassword', 'new-password');
assert.match((await actions.resetPasswordAction(undefined, recovery)).error, /expired or already used/);
tokenResult = account.id;
await assert.rejects(actions.resetPasswordAction(undefined, recovery), /REDIRECT:\/login\?reset=1/);
assert.equal(consumedPurpose, 'reset');
assert.equal(cleared, true);
await assert.rejects(actions.requireUser(), /REDIRECT:\/login/);
sessionUser = account;
await assert.rejects(actions.requireAdmin(), /^Error: REDIRECT:\/$/);
sessionUser = { ...account, role: 'admin' };
assert.equal((await actions.requireAdmin()).role, 'admin');
cleared = false;
await assert.rejects(actions.logoutAction(), /^Error: REDIRECT:\/$/);
assert.equal(cleared, true);
console.log('PASS verification-required signup/login, recovery, logout and role authorization');
const orders = load('../repositories/order.repository', {
  '@/lib/db': { query: async () => { throw new Error('Unauthenticated order lookup reached database'); } },
  '@/lib/utils': {}, './cart.repository': {}
});
assert.equal(await orders.loadOrder(1, null, false), null);
console.log('PASS unauthenticated order access is denied');

const savedEnv = { ...process.env };
let smtpOptions;
let mail;
let rejectMail = false;
const emailModule = load('auth-email', {
  nodemailer: { createTransport: options => {
    smtpOptions = options;
    return { sendMail: async message => {
      mail = message;
      return rejectMail ? { accepted: [], rejected: [message.to] } : { accepted: [message.to], rejected: [] };
    } };
  } }
});
try {
  Object.assign(process.env, {
    NODE_ENV: 'development', SMTP_HOST: 'smtp.hostinger.com', SMTP_PORT: '465',
    SMTP_USER: 'accounts@example.com', SMTP_PASSWORD: 'test-only',
    AUTH_EMAIL_FROM: 'JustAclick <accounts@example.com>', NEXT_PUBLIC_APP_URL: 'http://localhost:3000'
  });
  await emailModule.sendAuthEmail('customer@example.com', 'a'.repeat(64), 'verify', '/checkout?item=1&qty=2');
  assert.equal(smtpOptions.secure, true);
  assert.equal(smtpOptions.auth.user, 'accounts@example.com');
  assert.ok(mail.text.includes('http://localhost:3000/verify-email?token='));
  assert.ok(mail.text.includes('24 hours'));
  assert.ok(mail.html.includes('&amp;next='));
  process.env.SMTP_PORT = '587';
  process.env.NODE_ENV = 'production';
  assert.throws(() => emailModule.emailConfiguration(), /HTTPS/);
  process.env.NEXT_PUBLIC_APP_URL = 'https://shop.example.com';
  await emailModule.sendAuthEmail('customer@example.com', 'b'.repeat(64), 'reset', '');
  assert.equal(smtpOptions.secure, false);
  assert.equal(smtpOptions.requireTLS, true);
  assert.ok(mail.text.includes('https://shop.example.com/reset-password?token='));
  assert.ok(mail.text.includes('30 minutes'));
  rejectMail = true;
  await assert.rejects(emailModule.sendAuthEmail('customer@example.com', 'b'.repeat(64), 'reset', ''), /delivery failed/);
  delete process.env.SMTP_PASSWORD;
  assert.throws(() => emailModule.emailConfiguration(), /not configured/);
} finally {
  for (const key of Object.keys(process.env)) if (!(key in savedEnv)) delete process.env[key];
  Object.assign(process.env, savedEnv);
}
console.log('PASS SMTP TLS settings, local/production links, expiry text, rejected mail and missing configuration');

if (process.argv.includes('--integration')) {
  const db = load('db');
  const tokens = load('auth-tokens', { './db': db, './auth-validation': validation, './auth-email': { sendAuthEmail: async () => {} } });
  const { randomBytes } = require('node:crypto');
  const pool = db.getPool();
  let id;
  const rateIdentity = randomBytes(16).toString('hex');
  const rateBucket = Math.floor(Date.now() / 60000);
  try {
    const [insert] = await pool.execute("INSERT INTO users (name,email,password_hash,role) VALUES ('Auth integration test', :email, 'test-only', 'customer')", { email: `auth-test-${randomBytes(12).toString('hex')}@example.invalid` });
    id = insert.insertId;
    async function token(purpose, expired = false) {
      const raw = randomBytes(32).toString('hex');
      await pool.execute('INSERT INTO auth_tokens (user_id,purpose,token_hash,expires_at) VALUES (:id,:purpose,:hash,DATE_ADD(UTC_TIMESTAMP(), INTERVAL :seconds SECOND))', { id, purpose, hash: tokens.tokenHash(raw), seconds: expired ? -10 : 3600 });
      return raw;
    }
    assert.equal(await tokens.consumeAuthToken(await token('verify', true), 'verify'), null);
    const verify = await token('verify');
    assert.equal(await tokens.consumeAuthToken(verify, 'reset', 'unused'), null);
    assert.equal(await tokens.consumeAuthToken(verify, 'verify'), id);
    assert.equal(await tokens.consumeAuthToken(verify, 'verify'), null);
    await pool.execute('UPDATE users SET email_verified_at = NULL WHERE id = :id', { id });
    const pendingVerify = await token('verify');
    const reset1 = await token('reset');
    const reset2 = await token('reset');
    const results = await Promise.all([tokens.consumeAuthToken(reset1, 'reset', 'new-test-hash'), tokens.consumeAuthToken(reset2, 'reset', 'new-test-hash')]);
    assert.equal(results.filter(value => value === id).length, 1, 'only one concurrent reset succeeds');
    const [users] = await pool.execute('SELECT email_verified_at,session_version,password_hash FROM users WHERE id=:id', { id });
    assert.ok(users[0].email_verified_at);
    assert.equal(await tokens.consumeAuthToken(pendingVerify, 'verify'), null, 'reset invalidates pending verification links');
    assert.equal(users[0].session_version, 1);
    assert.equal(users[0].password_hash, 'new-test-hash');
    assert.equal(await tokens.consumeAuthToken(reset1, 'reset', 'replayed'), null);
    assert.equal(await tokens.allowAuthAttempt('integration', rateIdentity, 1, 60), true);
    assert.equal(await tokens.allowAuthAttempt('integration', rateIdentity, 1, 60), false);
    console.log('PASS database token expiry, purpose isolation, single use, concurrent resets and session invalidation');
  } finally {
    if (id) await pool.execute('DELETE FROM users WHERE id=:id', { id });
    for (const bucket of [rateBucket, rateBucket + 1]) {
      await pool.execute('DELETE FROM auth_rate_limits WHERE bucket_key=:key', { key: tokens.tokenHash(`integration:${rateIdentity}:${bucket}`) });
    }
    await pool.end();
  }
}
