import { ArrowRight } from 'lucide-react';
import { assetImage, imgSrc } from '@/lib/utils';
import { HOMEPAGE_SHOWCASES, type HomepageShowcase } from '@/lib/homepage-showcases';
import { showcaseBannerSlotKey, showcaseTileSlotKey } from '@/lib/site-media-slots';
import { navigationCategories } from '@/repositories/catalog.repository';
import { CategorySlider, type SliderCategory } from './CategorySlider';
import styles from './CategoryShowcases.module.css';

type CategoryRow = Awaited<ReturnType<typeof navigationCategories>>[number];

function sliderItems(
  config: HomepageShowcase,
  rows: CategoryRow[],
  media: Record<string, string>
): SliderCategory[] {
  const href = `/categories/${config.slug}`;
  const fallback = config.fallback.map(([name, image], index) => {
    const tilePath = media[showcaseTileSlotKey(config.slug, index)];
    return { name, href, image: tilePath ? imgSrc(tilePath) : assetImage(image) };
  });
  const parent = rows.find((row) => row.slug === config.slug);
  const children = parent ? rows.filter((row) => row.parent_id === parent.id) : [];
  if (children.length < 3) return fallback;
  return children.map((row, i) => ({
    name: row.name,
    href: `/categories/${row.slug}`,
    image: row.image ? imgSrc(row.image) : fallback[i % fallback.length].image
  }));
}

export async function CategoryShowcases({ media = {} }: { media?: Record<string, string> }) {
  let rows: CategoryRow[] = [];
  try {
    rows = await navigationCategories();
  } catch {
    rows = [];
  }

  return (
    <>
      {HOMEPAGE_SHOWCASES.map((config) => {
        const override = media[showcaseBannerSlotKey(config.slug)];
        const bannerSrc = override ? imgSrc(override) : assetImage(config.banner.image);
        return (
          <CategoryShowcase
            key={config.slug}
            config={config}
            items={sliderItems(config, rows, media)}
            bannerSrc={bannerSrc}
          />
        );
      })}
    </>
  );
}

function CategoryShowcase({
  config,
  items,
  bannerSrc
}: {
  config: HomepageShowcase;
  items: SliderCategory[];
  bannerSrc: string;
}) {
  const href = `/categories/${config.slug}`;
  const headingId = `showcase-${config.slug}`;

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <header className={styles.header}>
        <h2 id={headingId} className={styles.heading}>{config.name}</h2>
        <a href={href} className={styles.viewAll}>
          View all <ArrowRight size={16} aria-hidden />
        </a>
      </header>

      <a href={href} className={styles.banner}>
        <img src={bannerSrc} alt="" className={styles.bannerImage} loading="lazy" decoding="async" />
        <span className={styles.bannerOverlay} />
        <span className={styles.bannerContent}>
          <span className={styles.eyebrow}>{config.banner.eyebrow}</span>
          <span className={styles.bannerTitle}>{config.banner.title}</span>
          <span className={styles.bannerText}>{config.banner.text}</span>
          <span className={styles.bannerBtn}>
            {config.banner.cta} <ArrowRight size={18} aria-hidden />
          </span>
        </span>
      </a>

      <div className={styles.sliderHead}>
        <h3 className={styles.subheading}>Shop by Category</h3>
      </div>
      <CategorySlider categories={items} label={config.name} />
    </section>
  );
}
