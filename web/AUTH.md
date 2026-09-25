# Authentication and Hostinger SMTP setup

Signup sends a verification link through SMTP. Users must confirm their email before signing in with their password. Signed-in users are redirected away from login and registration to their account or admin dashboard. Existing unverified accounts must request a verification link before signing in. Users can request another verification link at /verify-email (also linked from /login). Forgot password at /forgot-password sends a secure reset link using the same SMTP mailbox.

## 1. Prepare the mailbox

Create a mailbox such as accounts@yourdomain.com in Hostinger hPanel under Emails. Use that full email address as SMTP_USER and its **mailbox password**, not your Hostinger account password, as SMTP_PASSWORD. Confirm the mailbox works in Hostinger Webmail. Use the SMTP settings shown for your mailbox; the defaults below are for Hostinger Email, not Titan or another provider.

Hostinger setup: https://www.hostinger.com/support/4305847-set-up-hostinger-email-on-your-applications-and-devices/

## 2. Local development

Add or update these values in web/.env. Keep your existing DB_* and JWT_SECRET values. Do not replace the entire file.

```dotenv
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=accounts@yourdomain.com
SMTP_PASSWORD="your-mailbox-password"
AUTH_EMAIL_FROM="JustAclick <accounts@yourdomain.com>"
NEXT_PUBLIC_APP_URL=http://localhost:3000
COOKIE_SECURE=false
```

Use the same mailbox for SMTP_USER and AUTH_EMAIL_FROM. Port 465 uses TLS immediately. If your provider/network requires port 587, change SMTP_PORT to 587; the app then requires STARTTLS. No SMTP_SECURE variable is needed. Certificate validation remains enabled.

Next.js loads environment files from web/, not the repository root .evn file. Existing process environment variables and .env.local/.env.development.local may override .env; remove conflicting values. If a password contains a literal dollar sign, escape it as \$ in a Next.js env file (quotes alone do not prevent expansion). Do not use the escape in a hosting dashboard field. Never prefix SMTP credentials with NEXT_PUBLIC_ or commit them.

From web/:

```sh
npm install
node scripts/migrate-auth.mjs
npm run dev
```

The migration is additive and safe to rerun. It adds session/verification fields and token/rate-limit tables. It does not mark addresses as verified. Run it against each environment's intended database. Restart the app after changing env settings.

Register with an inbox you control and check for the verification email. Open the link and click Verify my email. For an existing account, request a link at http://localhost:3000/verify-email. Local links point to localhost, so open them on the computer running the app. Test password reset at http://localhost:3000/forgot-password using an existing account.

## 3. Production server

In the Node.js application's environment settings in hPanel, enter the same SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD and AUTH_EMAIL_FROM values. Enter raw values without surrounding dotenv quotes in dashboard fields. Alternatively, put them in web/.env.production on the server. Keep local files and production files separate.

Change these values for production:

```dotenv
NEXT_PUBLIC_APP_URL=https://yourdomain.com
COOKIE_SECURE=true
```

Keep the server's existing DB_* variables and a strong JWT_SECRET. Install dependencies, run the auth migration against the server database, build, and restart/redeploy the Node.js app. Set the public URL before building so links never point to localhost. When running the migration from a terminal, set NODE_ENV first as shown below.

PowerShell:

```powershell
$env:NODE_ENV = 'production'
node scripts/migrate-auth.mjs
npm run build
npm start
```

Linux:

```sh
NODE_ENV=production node scripts/migrate-auth.mjs
npm run build
npm start
```

If hPanel manages the process, use its deploy/restart controls instead of manually starting a second process. Outbound TCP to smtp.hostinger.com on the selected port must be allowed. Configure the domain's email DNS records as directed by hPanel, including SPF and DKIM, and check spam folders during testing.

## Behavior and troubleshooting

- Verification links last 24 hours and are single-use. Reset links last 30 minutes and are single-use; resetting a password revokes existing sessions, confirms mailbox ownership, and invalidates pending verification links.
- Missing/invalid SMTP settings cause recovery forms to report that email is unavailable. Check all variables and restart the application.
- Provider rejection or connection failure produces a generic server log without passwords or tokens. Recovery responses remain generic for account privacy; they are not a delivery receipt.
- If no email arrives, confirm the mailbox password, matching sender address, spam folder, mailbox sending limits, and outbound port access. Wait at least a minute between requests. Five requests per 15 minutes are allowed per email/purpose.
- If signup email delivery fails after account creation, use /verify-email to retry after fixing SMTP. No session is issued until the email is verified and the password is entered.
- RESEND_API_KEY is no longer used.

## Checks

```sh
node scripts/test-auth.mjs
node scripts/test-auth.mjs --integration
npx tsc --noEmit
npm run build
```

The default tests mock SMTP and do not send real email. Integration tests require the configured database. Verify real inbox delivery separately after setting credentials. Remove expired auth_tokens periodically. Keep .env files private.
