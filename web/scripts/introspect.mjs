import fs from 'fs';
import mysql from 'mysql2/promise';

const env = fs.readFileSync(new URL('../../server/.env.example', import.meta.url), 'utf8');
function g(k) {
  const m = env.match(new RegExp('^' + k + '=(.*)$', 'm'));
  if (!m) return '';
  return m[1].trim().replace(/^"|"$/g, '');
}

try {
  const c = await mysql.createConnection({
    host: g('DB_HOST'),
    port: Number(g('DB_PORT') || 3306),
    user: g('DB_USER'),
    password: g('DB_PASSWORD'),
    database: g('DB_NAME'),
    connectTimeout: 8000
  });
  const [tables] = await c.query('SHOW TABLES');
  console.log(JSON.stringify(tables, null, 2));
  await c.end();
} catch (e) {
  console.log('DB_FAIL', e.code || e.message);
}
