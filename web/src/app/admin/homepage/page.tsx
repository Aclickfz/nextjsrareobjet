import type { CSSProperties } from 'react';
import { saveCategoryImageAction, saveHomepageMediaAction } from '@/actions/admin.actions';
import { AdminInput } from '@/components/admin/AdminControls';
import { AdminActionForm as ActionForm, AdminButton } from '@/components/admin/AdminForm';
import { HOMEPAGE_SHOWCASES } from '@/lib/homepage-showcases';
import { showcaseBannerSlotKey, showcaseTileSlotKey } from '@/lib/site-media-slots';
import { assetImage, imgSrc } from '@/lib/utils';
import type { CategoryNode } from '@/lib/catalog-tree';
import { adminCategories } from '@/repositories/catalog.repository';
import { listSiteMedia, type SiteMediaRow } from '@/repositories/site-media.repository';
import { s3Configured } from '@/lib/s3';

export const dynamic = 'force-dynamic';

const cardStyle: CSSProperties = {
  border: '1px solid var(--border, #e5e5e5)',
  borderRadius: 10,
  padding: 12,
  background: 'var(--card, #fff)',
  display: 'grid',
  gap: 10,
  alignContent: 'start'
};

function BannerForm({ row, title }: { row: SiteMediaRow; title: string }) {
  return (
    <ActionForm
      className="admin-form admin-form-wide"
      action={saveHomepageMediaAction}
      success={`${title} updated.`}
      style={{ ...cardStyle, maxWidth: 'none', padding: 16 }}
    >
      <AdminInput type="hidden" name="slot_key" value={row.slot_key} />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 360px) 1fr', gap: 16, alignItems: 'center' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc(row.path)}
          alt=""
          style={{
            width: '100%',
            height: 180,
            objectFit: 'cover',
            borderRadius: 8,
            background: '#f3f3f3',
            border: '1px solid var(--border, #e5e5e5)'
          }}
        />
        <div style={{ display: 'grid', gap: 8 }}>
          <strong style={{ fontSize: 15 }}>{title}</strong>
          <span style={{ fontSize: 12, opacity: 0.7 }}>Homepage section banner · S3 <code>banner/</code></span>
          <span style={{ fontSize: 12, opacity: 0.75, wordBreak: 'break-all' }}>{row.path}</span>
          <label>
            Replace banner
            <AdminInput type="file" name="image_file" accept="image/*" required />
          </label>
          <div className="admin-form-actions compact">
            <AdminButton type="submit">Save banner</AdminButton>
          </div>
        </div>
      </div>
    </ActionForm>
  );
}

function ShopTileForm({ row, title }: { row: SiteMediaRow; title: string }) {
  return (
    <ActionForm
      className="admin-form admin-form-wide"
      action={saveHomepageMediaAction}
      success={`${title} updated.`}
      style={{ ...cardStyle, maxWidth: 'none' }}
    >
      <AdminInput type="hidden" name="slot_key" value={row.slot_key} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc(row.path)}
        alt=""
        style={{
          width: '100%',
          height: 110,
          objectFit: 'cover',
          borderRadius: 8,
          background: '#f3f3f3'
        }}
      />
      <strong style={{ fontSize: 13 }}>{title}</strong>
      <span style={{ fontSize: 11, opacity: 0.7, wordBreak: 'break-all' }}>{row.path}</span>
      <label style={{ fontSize: 12 }}>
        Replace
        <AdminInput type="file" name="image_file" accept="image/*" required />
      </label>
      <div className="admin-form-actions compact">
        <AdminButton type="submit">Save</AdminButton>
      </div>
    </ActionForm>
  );
}

function ShopCategoryForm({ category }: { category: CategoryNode }) {
  return (
    <ActionForm
      className="admin-form admin-form-wide"
      action={saveCategoryImageAction}
      success={`${category.name} image updated.`}
      style={{ ...cardStyle, maxWidth: 'none' }}
    >
      <AdminInput type="hidden" name="id" value={category.id} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={category.image ? imgSrc(category.image) : assetImage('img2.jpeg')}
        alt=""
        style={{
          width: '100%',
          height: 110,
          objectFit: 'cover',
          borderRadius: 8,
          background: '#f3f3f3'
        }}
      />
      <strong style={{ fontSize: 13 }}>{category.name}</strong>
      <span style={{ fontSize: 11, opacity: 0.7 }}>/categories/{category.slug}</span>
      <label style={{ fontSize: 12 }}>
        Replace
        <AdminInput type="file" name="image_file" accept="image/*" required />
      </label>
      <div className="admin-form-actions compact">
        <AdminButton asChild variant="outline">
          <a href={`/admin/categories?id=${category.id}`}>Edit</a>
        </AdminButton>
        <AdminButton type="submit">Save</AdminButton>
      </div>
    </ActionForm>
  );
}

function MediaSlotForm({ row, title }: { row: SiteMediaRow; title?: string }) {
  return (
    <ActionForm
      className="admin-form admin-form-wide"
      action={saveHomepageMediaAction}
      success={`${title || row.label} updated.`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(140px, 200px) 1fr',
        gap: '1rem',
        alignItems: 'start',
        maxWidth: 'none',
        padding: '12px 0',
        borderBottom: '1px solid var(--border, #e5e5e5)'
      }}
    >
      <AdminInput type="hidden" name="slot_key" value={row.slot_key} />
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc(row.path)}
          alt=""
          width={200}
          height={120}
          style={{
            width: '100%',
            maxWidth: 200,
            height: 120,
            objectFit: 'cover',
            borderRadius: 8,
            background: '#f3f3f3',
            border: '1px solid var(--border, #e5e5e5)'
          }}
        />
      </div>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <strong>{title || row.label}</strong>
        <span style={{ fontSize: 12, opacity: 0.75, wordBreak: 'break-all' }}>{row.path}</span>
        <label>
          Replace image
          <AdminInput type="file" name="image_file" accept="image/*" required />
        </label>
        <div className="admin-form-actions compact">
          <AdminButton type="submit">Save image</AdminButton>
        </div>
      </div>
    </ActionForm>
  );
}

export default async function HomepageMediaAdminPage() {
  const [rows, categories] = await Promise.all([listSiteMedia(), adminCategories()]);
  const byKey = new Map(rows.map((row) => [row.slot_key, row]));

  const heroSlots = ['hero.slide1.poster', 'hero.slide2.poster', 'hero.slide3.poster']
    .map((key) => byKey.get(key))
    .filter(Boolean) as SiteMediaRow[];

  const lowerHome = rows.filter((row) => row.slot_key.startsWith('home.'));

  const jumpLinks = [
    { id: 'hero', title: 'Hero' },
    ...HOMEPAGE_SHOWCASES.map((s) => ({ id: `section-${s.slug}`, title: s.name })),
    { id: 'home-extra', title: 'Other blocks' }
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Homepage media</h2>
          <p>
            Same layout as the storefront: each section has a <strong>banner</strong>, then{' '}
            <strong>Shop by Category</strong> tiles. Update section by section (Furniture → next → …).
            {s3Configured() ? ' Uploads go to S3 + DB.' : ' Set AWS_* in .env for S3.'}
          </p>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <h3>Jump to homepage section</h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 24px 20px' }}>
          {jumpLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              style={{
                display: 'inline-block',
                padding: '6px 10px',
                border: '1px solid var(--border, #e5e5e5)',
                borderRadius: 6,
                fontSize: 13,
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>

      <div className="panel" id="hero">
        <div className="panel-head">
          <div>
            <h3>Hero banners</h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>
              Top homepage video posters (slide 1–3).
            </p>
          </div>
        </div>
        <div style={{ padding: '0 24px 16px', display: 'grid', gap: 12 }}>
          {heroSlots.map((row) => (
            <BannerForm key={row.slot_key} row={row} title={row.label} />
          ))}
        </div>
      </div>

      {HOMEPAGE_SHOWCASES.map((showcase, index) => {
        const banner = byKey.get(showcaseBannerSlotKey(showcase.slug));
        const parent = categories.find((c) => c.slug === showcase.slug && (c.parent_id == null || c.parent_id === 0));
        const children = parent
          ? categories
            .filter((c) => c.parent_id === parent.id)
            .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
          : [];
        // Same rule as storefront CategoryShowcases: 3+ DB children → live categories, else tile slots.
        const useLiveCategories = children.length >= 3;

        return (
          <div className="panel" key={showcase.slug} id={`section-${showcase.slug}`}>
            <div className="panel-head">
              <div>
                <h3>
                  {index + 1}. {showcase.name}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>
                  Matches homepage block: <strong>{showcase.name}</strong> banner + Shop by Category.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <a href={`/categories/${showcase.slug}`} target="_blank" rel="noreferrer">
                  View on site
                </a>
                {parent ? (
                  <a href={`/admin/categories?parent=${parent.id}`}>Add category</a>
                ) : (
                  <a href="/admin/categories">Manage categories</a>
                )}
              </div>
            </div>

            <div style={{ padding: '0 24px 20px', display: 'grid', gap: 18 }}>
              <section>
                <h4 style={{ margin: '0 0 10px', fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.75 }}>
                  Section banner
                </h4>
                {banner ? (
                  <BannerForm row={banner} title={`${showcase.name} banner`} />
                ) : (
                  <p style={{ fontSize: 13, opacity: 0.7 }}>Banner slot missing — reload to seed site_media.</p>
                )}
              </section>

              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                  <h4 style={{ margin: 0, fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.75 }}>
                    Shop by Category
                  </h4>
                  <span style={{ fontSize: 12, opacity: 0.7 }}>
                    {useLiveCategories
                      ? `Using ${children.length} DB categories (same as storefront)`
                      : `Using homepage tiles (${showcase.fallback.length}) — add 3+ child categories to switch to live DB images`}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: 12
                  }}
                >
                  {useLiveCategories
                    ? children.map((child) => <ShopCategoryForm key={child.id} category={child} />)
                    : showcase.fallback.map(([name], tileIndex) => {
                      const tile = byKey.get(showcaseTileSlotKey(showcase.slug, tileIndex));
                      if (!tile) return null;
                      return <ShopTileForm key={tile.slot_key} row={tile} title={name} />;
                    })}
                </div>
              </section>
            </div>
          </div>
        );
      })}

      <div className="panel" id="home-extra">
        <div className="panel-head">
          <div>
            <h3>Other home blocks</h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted-foreground)' }}>
              Bestseller, collections, sliders, and sofa grid below the category sections.
            </p>
          </div>
        </div>
        <div style={{ padding: '0 24px 8px' }}>
          {lowerHome.map((row) => (
            <MediaSlotForm key={row.slot_key} row={row} />
          ))}
        </div>
      </div>
    </>
  );
}
