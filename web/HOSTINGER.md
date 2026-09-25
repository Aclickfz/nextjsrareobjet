# Hostinger Node.js deploy

For verification and password-reset emails through Hostinger SMTP, follow [AUTH.md](AUTH.md). Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `AUTH_EMAIL_FROM` in the application's server environment. No Resend API key is needed.

The app in this folder is a Next.js Node server. Do not upload it as a static site.

1. In hPanel, create a Node.js application with Node 18 or newer.
2. Set the application root to this `web` directory.
3. Install command: `npm install`
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
