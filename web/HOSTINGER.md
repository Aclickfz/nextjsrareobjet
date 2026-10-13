# Hostinger Node.js deploy

For verification and password-reset emails through Hostinger SMTP, follow [AUTH.md](AUTH.md). Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `AUTH_EMAIL_FROM` in the application's server environment. No Resend API key is needed.

The app in this folder is a Next.js Node server. Do not upload it as a static site.

1. In hPanel, create a Node.js application with Node 20.9 or newer (the minimum required by Next.js 16.3.3). Local verification uses Node 24.19.0; check `node --version` in the deployment runtime too.
2. Set the application root to this `web` directory.
3. Install command: `npm ci` (deploy the reviewed `package-lock.json` alongside `package.json`).
4. Build command: `npm run build`
5. Start command: `npm start`
6. Local test uses `.env` (`npm run dev`). Production uses `.env.production` (`npm run build` and `npm start`). Both use database `justaclick` on `127.0.0.1` with the same user and password. On the server, set `NEXT_PUBLIC_APP_URL` to the public HTTPS address and keep `COOKIE_SECURE=true`.

   You can also set the same variables in hPanel (never commit them):

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` — existing MySQL database
- `DATABASE_URL` — same database, for Prisma if you introspect later
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL` — public site URL
- `SHIPPING_FLAT_INR` — `99` unless you already use another flat rate
- `COOKIE_SECURE` — `true` when the site is HTTPS
- `DB_SSL` — `true` only if Hostinger MySQL requires SSL
- `PORT` — provided by Hostinger. `npm start` listens on all interfaces.

7. Keep `public/uploads/products` writable so admin image uploads persist.
8. After the app is running, check `/`, `/products`, `/login`, add to cart, cash-on-delivery checkout, and admin order confirmation.

`schema.sql` in `sql/schema.sql` matches the tables the current Express API already uses. Run it only on an empty database. Do not drop the live tables.

## Restart diagnostics

This checkout runs `next start -H 0.0.0.0` through `npm start`; it has no custom Node server entry point. Next.js owns the HTTP server and signal handlers. Do not add another shutdown handler that closes that server independently.

If deployment reports `Server is not running`, capture the actual start command, deployed commit, Node version, `npm ls next sharp`, and logs before the error (redact secrets). Check whether the hosting service injects a custom server or process wrapper. The Node-only stack does not identify the caller or prove repeated shutdown calls.

After `npm run build`, run `node scripts/test-server-lifecycle.mjs`. It checks HTTP startup, SIGTERM/SIGINT handlers, repeated signals, and an occupied-port startup failure. On Windows, signals are emitted inside the test child through IPC because sending POSIX signals would forcibly terminate it; verify real signal delivery on the deployment host separately.

Next.js 16.3.3 is patched for [GHSA-2xp9-vwfh-vxw4](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4). Keep `images.unoptimized: true` in `next.config.ts`. Verify the deployed lockfile resolves Next.js 16.3.3 or a reviewed patched version; an older lockfile here resolved 16.1.6. This advisory does not establish a connection to the shutdown error.
