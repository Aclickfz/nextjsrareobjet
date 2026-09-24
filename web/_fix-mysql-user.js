import { createConnection } from 'mysql2/promise';

(async () => {
  const pw = process.env.DB_PASSWORD;
  const root = await createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: pw,
  });
  for (const host of ['localhost', '127.0.0.1']) {
    await root.query(`CREATE USER IF NOT EXISTS 'imran'@'${host}' IDENTIFIED BY ?`, [pw]);
    await root.query(`ALTER USER 'imran'@'${host}' IDENTIFIED BY ?`, [pw]);
    await root.query(`GRANT ALL PRIVILEGES ON justaclick.* TO 'imran'@'${host}'`);
  }
  await root.query('FLUSH PRIVILEGES');
  await root.end();

  const app = await createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: pw,
    database: process.env.DB_NAME,
  });
  const [rows] = await app.query('SELECT CURRENT_USER() AS u, DATABASE() AS d');
  console.log(JSON.stringify(rows));
  await app.end();
})().catch((error) => {
  console.error(error.code || '', error.sqlMessage || error.message);
  process.exit(1);
});
