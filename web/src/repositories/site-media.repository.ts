import { getPool, query } from '@/lib/db';
import { SITE_MEDIA_SLOTS, siteMediaSlotByKey } from '@/lib/site-media-slots';

export type SiteMediaRow = {
  slot_key: string;
  label: string;
  section: string;
  path: string | null;
  updated_at?: string;
};

async function ensureSiteMediaTable() {
  await getPool().execute(`
    CREATE TABLE IF NOT EXISTS site_media (
      slot_key VARCHAR(64) PRIMARY KEY,
      label VARCHAR(120) NOT NULL,
      section VARCHAR(64) NOT NULL,
      path VARCHAR(512) NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_site_media_section (section)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

async function ensureSiteMediaSeed() {
  await ensureSiteMediaTable();
  const conn = await getPool().getConnection();
  try {
    for (const slot of SITE_MEDIA_SLOTS) {
      await conn.execute(
        `INSERT IGNORE INTO site_media (slot_key, label, section, path)
         VALUES (:slot_key, :label, :section, :path)`,
        {
          slot_key: slot.slot_key,
          label: slot.label,
          section: slot.section,
          path: slot.default_path
        }
      );
    }
  } finally {
    conn.release();
  }
}

export async function listSiteMedia(): Promise<SiteMediaRow[]> {
  await ensureSiteMediaSeed();
  const rows = await query<SiteMediaRow[]>(
    `SELECT slot_key, label, section, path, updated_at
     FROM site_media
     ORDER BY section ASC, slot_key ASC`
  );
  const byKey = new Map(rows.map((row) => [row.slot_key, row]));
  return SITE_MEDIA_SLOTS.map((slot) => {
    const row = byKey.get(slot.slot_key);
    return {
      slot_key: slot.slot_key,
      label: row?.label || slot.label,
      section: row?.section || slot.section,
      path: row?.path || slot.default_path,
      updated_at: row?.updated_at
    };
  });
}

/** slot_key → stored path (or default). */
export async function getSiteMediaMap(): Promise<Record<string, string>> {
  try {
    const rows = await listSiteMedia();
    return Object.fromEntries(rows.map((row) => [row.slot_key, row.path || siteMediaSlotByKey(row.slot_key)?.default_path || '']));
  } catch {
    return Object.fromEntries(SITE_MEDIA_SLOTS.map((slot) => [slot.slot_key, slot.default_path]));
  }
}

export async function getSiteMediaPath(slotKey: string): Promise<string | null> {
  const map = await getSiteMediaMap();
  return map[slotKey] || siteMediaSlotByKey(slotKey)?.default_path || null;
}

export async function updateSiteMediaPath(slotKey: string, pathValue: string) {
  const meta = siteMediaSlotByKey(slotKey);
  if (!meta) throw new Error('Unknown homepage media slot');
  await ensureSiteMediaSeed();
  await getPool().execute(
    `INSERT INTO site_media (slot_key, label, section, path)
     VALUES (:slot_key, :label, :section, :path)
     ON DUPLICATE KEY UPDATE path = VALUES(path), label = VALUES(label), section = VALUES(section)`,
    {
      slot_key: slotKey,
      label: meta.label,
      section: meta.section,
      path: pathValue
    }
  );
}
