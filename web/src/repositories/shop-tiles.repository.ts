import type { ResultSetHeader } from 'mysql2/promise';
import { getPool, query } from '@/lib/db';
import { HOMEPAGE_SHOWCASES } from '@/lib/homepage-showcases';

export type ShopTile = {
  id: number;
  showcase_slug: string;
  name: string;
  href: string;
  image: string | null;
  sort_order: number;
  is_active: number;
};

let tableReady: Promise<void> | null = null;

export async function ensureShopTilesTable() {
  if (!tableReady) {
    tableReady = (async () => {
      await getPool().execute(`
        CREATE TABLE IF NOT EXISTS homepage_shop_tiles (
          id INT AUTO_INCREMENT PRIMARY KEY,
          showcase_slug VARCHAR(120) NOT NULL,
          name VARCHAR(200) NOT NULL,
          href VARCHAR(500) NOT NULL,
          image VARCHAR(500) NULL,
          sort_order INT NOT NULL DEFAULT 0,
          is_active TINYINT(1) NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          KEY idx_shop_tiles_showcase (showcase_slug, sort_order, id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      const countRows = await query<{ total: number }[]>('SELECT COUNT(*) AS total FROM homepage_shop_tiles');
      if (Number(countRows[0]?.total || 0) === 0) {
        let sort = 0;
        for (const showcase of HOMEPAGE_SHOWCASES) {
          for (const [name, image] of showcase.fallback) {
            await getPool().execute(
              `INSERT INTO homepage_shop_tiles (showcase_slug, name, href, image, sort_order, is_active)
               VALUES (:showcase_slug, :name, :href, :image, :sort_order, 1)`,
              {
                showcase_slug: showcase.slug,
                name,
                href: `/categories/${showcase.slug}`,
                image: `assets/images/${image}`,
                sort_order: sort++
              }
            );
          }
        }
      }
    })().catch((error) => {
      tableReady = null;
      throw error;
    });
  }
  await tableReady;
}

export async function listShopTiles(showcaseSlug?: string, activeOnly = false) {
  await ensureShopTilesTable();
  const where: string[] = [];
  const params: Record<string, unknown> = {};
  if (showcaseSlug) {
    where.push('showcase_slug = :showcase_slug');
    params.showcase_slug = showcaseSlug;
  }
  if (activeOnly) where.push('is_active = 1');
  const sql = `SELECT id, showcase_slug, name, href, image, sort_order, is_active
    FROM homepage_shop_tiles
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY showcase_slug ASC, sort_order ASC, id ASC`;
  return query<ShopTile[]>(sql, params);
}

export async function getShopTile(id: number) {
  await ensureShopTilesTable();
  const rows = await query<ShopTile[]>(
    `SELECT id, showcase_slug, name, href, image, sort_order, is_active
     FROM homepage_shop_tiles WHERE id = :id LIMIT 1`,
    { id }
  );
  return rows[0] || null;
}

export async function saveShopTile(data: {
  id?: number;
  showcase_slug: string;
  name: string;
  href: string;
  image: string | null;
  sort_order: number;
  is_active: number;
}) {
  await ensureShopTilesTable();
  if (data.id) {
    await getPool().execute(
      `UPDATE homepage_shop_tiles
       SET showcase_slug=:showcase_slug, name=:name, href=:href, image=:image, sort_order=:sort_order, is_active=:is_active
       WHERE id=:id`,
      data
    );
    return data.id;
  }
  const [result] = await getPool().execute<ResultSetHeader>(
    `INSERT INTO homepage_shop_tiles (showcase_slug, name, href, image, sort_order, is_active)
     VALUES (:showcase_slug, :name, :href, :image, :sort_order, :is_active)`,
    data
  );
  return result.insertId;
}

export async function deleteShopTile(id: number) {
  await ensureShopTilesTable();
  await getPool().execute('DELETE FROM homepage_shop_tiles WHERE id = :id', { id });
}
