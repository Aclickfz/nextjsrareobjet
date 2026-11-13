import { ArrowRight } from 'lucide-react';
import { assetImage, imgSrc } from '@/lib/utils';
import { HOMEPAGE_SHOWCASES, type HomepageShowcase } from '@/lib/homepage-showcases';
import { showcaseBannerSlotKey } from '@/lib/site-media-slots';
import { listShopTiles } from '@/repositories/shop-tiles.repository';
import { CategorySlider, type SliderCategory } from './CategorySlider';
import styles from './CategoryShowcases.module.css';

function tileImage(path: string | null) {
  if (!path) return assetImage('img2.jpeg');
  if (path.startsWith('assets/')) return assetImage(path.replace(/^assets\/images\//, ''));
  return imgSrc(path);
}

async function sliderItems(config: HomepageShowcase): Promise<SliderCategory[]> {
  try {
    const tiles = await listShopTiles(config.slug, true);
    if (tiles.length) {
      return tiles.map((tile) => ({
        name: tile.name,
        href: tile.href || `/categories/${config.slug}`,
        image: tileImage(tile.image)
      }));
    }
  } catch {
    // Fall back to static showcase config when DB is unavailable.
  }
  return config.fallback.map(([name, image]) => ({
    name,
    href: `/categories/${config.slug}`,
    image: assetImage(image)
  }));
}

export async function CategoryShowcases({ media = {} }: { media?: Record<string, string> }) {
  const sections = await Promise.all(
    HOMEPAGE_SHOWCASES.map(async (config) => ({
      config,
      items: await sliderItems(config),
      bannerSrc: media[showcaseBannerSlotKey(config.slug)]
        ? imgSrc(media[showcaseBannerSlotKey(config.slug)])
        : assetImage(config.banner.image)
    }))
  );

  return (
    <>
      {sections.map(({ config, items, bannerSrc }) => (
        <CategoryShowcase key={config.slug} config={config} items={items} bannerSrc={bannerSrc} />
      ))}
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
