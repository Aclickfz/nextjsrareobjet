import mysql from 'mysql2/promise';

const globalForDb = globalThis as unknown as { pool?: mysql.Pool };

export function getPool() {
  if (!globalForDb.pool) {
    globalForDb.pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'justaclick',
      waitForConnections: true,
      connectionLimit: 10,
      namedPlaceholders: true,
      dateStrings: true,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
    });
  }
  return globalForDb.pool;
}

export async function query<T = mysql.RowDataPacket[]>(sql: string, params: Record<string, unknown> = {}) {
  const pool = getPool() as mysql.Pool & {
    query: (sql: string, values?: Record<string, unknown>) => Promise<[T, unknown]>;
  };
  const [rows] = await pool.query(sql, params);
  return rows;
}
