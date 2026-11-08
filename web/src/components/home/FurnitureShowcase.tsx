import { ArrowRight } from 'lucide-react';
import { assetImage, imgSrc } from '@/lib/utils';
import { navigationCategories } from '@/repositories/catalog.repository';
import { CategorySlider, type SliderCategory } from './CategorySlider';
import styles from './FurnitureShowcase.module.css';

type ShowcaseConfig = {
  slug: string;
  name: string;
  banner: { image: string; eyebrow: string; title: string; text: string; cta: string };
  fallback: [string, string][];
};

const SHOWCASES: ShowcaseConfig[] = [
  {
    slug: 'furniture',
    name: 'Furniture',
    banner: { image: 'furniture2.jpeg', eyebrow: 'Up to 40% off · Limited time', title: 'Furniture Built to Last', text: 'Handcrafted sofas, tables and storage designed for everyday living.', cta: 'Shop Furniture' },
    fallback: [['Sofas & Sectionals', 'sofa1.webp'], ['Chairs', 'chair.avif'], ['Coffee Tables', 'aptos-square-coffee-table-44-c.jpg'], ['Side Tables', 'aptos-side-table-22-c.jpg'], ['Buffets & Consoles', 'buffets.avif'], ['Dining Tables', 'table.avif'], ['Beds & Headboards', 'sleep.avif'], ['Nightstands', 'nightstand2.avif'], ['Sleeper Sofas', 'sofa3.webp'], ['Accent Chairs', 'sofa5.webp'], ['Ottomans & Poufs', 'sofa7.webp'], ['In-Stock Furniture', 'furniture.jpeg']]
  },
  {
    slug: 'new',
    name: 'New Arrivals',
    banner: { image: 'banner2.jpg', eyebrow: 'Just in', title: 'The Fall Collection', text: 'Fresh silhouettes, warm textures and new finishes for the season.', cta: 'Shop New' },
    fallback: [['New Furniture', 'sofa2.webp'], ['New Lighting', 'mygift1.webp'], ['New Decor', 'decoration.webp'], ['New Bedding', 'sleep.avif'], ['New Tabletop', 'collection1.avif'], ['New Rugs', 'img3.jpeg']]
  },
  {
    slug: 'outdoor',
    name: 'Outdoor',
    banner: { image: 'furniture5.jpeg', eyebrow: 'Outdoor season', title: 'Made for Open Air', text: 'Weather-ready lounge, dining and accents for patios and gardens.', cta: 'Shop Outdoor' },
    fallback: [['Outdoor Lounge', 'sofa4.webp'], ['Outdoor Dining', 'table.avif'], ['Outdoor Chairs', 'chair.avif'], ['Outdoor Lighting', 'mygift2.webp'], ['Planters', 'decoration.webp'], ['Outdoor Rugs', 'img4.jpeg']]
  },
  {
    slug: 'bedding',
    name: 'Bedding',
    banner: { image: 'sleep.avif', eyebrow: 'Sleep better', title: 'Layers of Comfort', text: 'Duvets, sheets and quilts in breathable natural fabrics.', cta: 'Shop Bedding' },
    fallback: [['Duvet Covers', 'sleep.avif'], ['Sheets', 'img2.jpeg'], ['Quilts', 'img5.jpeg'], ['Pillows', 'diamond-cable-knit-pillow-3-c.jpg'], ['Throws', 'sofa6.webp'], ['Kids Bedding', 'img1.avif']]
  },
  {
    slug: 'bath',
    name: 'Bath',
    banner: { image: 'furniture4.jpeg', eyebrow: 'Spa at home', title: 'Everyday Bath Luxury', text: 'Plush towels, bath mats and accessories for a calm retreat.', cta: 'Shop Bath' },
    fallback: [['Towels', 'img2m.jpg'], ['Bath Mats', 'img3m.jpg'], ['Bath Accessories', 'img7m.jpg'], ['Shower Curtains', 'img8m.jpg'], ['Vanities', 'buffets.avif'], ['Mirrors', 'img10m.jpg']]
  },
  {
    slug: 'lighting',
    name: 'Lighting',
    banner: { image: 'mygift1.webp', eyebrow: 'Set the mood', title: 'Light Every Corner', text: 'Pendants, lamps and sconces that shape the feel of a room.', cta: 'Shop Lighting' },
    fallback: [['Ceiling Lights', 'mygift1.webp'], ['Floor Lamps', 'mygift2.webp'], ['Wall Sconces', 'mygift3.webp'], ['Table Lamps', 'gift1.jpg'], ['Chandeliers', 'holday2.jpg'], ['Outdoor Lighting', 'holday3.jpg']]
  },
  {
    slug: 'rugs',
    name: 'Rugs',
    banner: { image: 'img3.jpeg', eyebrow: 'Underfoot', title: 'Rugs That Ground a Room', text: 'Hand-knotted, woven and washable rugs in every size.', cta: 'Shop Rugs' },
    fallback: [['Area Rugs', 'img3.jpeg'], ['Runners', 'img4.jpeg'], ['Washable Rugs', 'img5.jpeg'], ['Jute Rugs', 'img2.jpeg'], ['Outdoor Rugs', 'furniture3.jpeg'], ['Rug Pads', 'img1.avif']]
  },
  {
    slug: 'windows',
    name: 'Windows',
    banner: { image: 'furniture3.jpeg', eyebrow: 'Let the light in', title: 'Curtains & Shades', text: 'Linen drapes, blackout panels and hardware tailored to fit.', cta: 'Shop Windows' },
    fallback: [['Curtains', 'img10m.jpg'], ['Blackout Panels', 'img1m.jpg'], ['Shades', 'img2m.jpg'], ['Sheers', 'img3m.jpg'], ['Curtain Rods', 'img7m.jpg'], ['Hardware', 'img8m.jpg']]
  },
  {
    slug: 'pillows-decor',
    name: 'Pillows & Decor',
    banner: { image: 'decoration.webp', eyebrow: 'Finishing touches', title: 'Decor With Character', text: 'Pillows, throws, vases and objects that make a house personal.', cta: 'Shop Decor' },
    fallback: [['Pillows', 'diamond-cable-knit-pillow-3-c.jpg'], ['Throws', 'sofa6.webp'], ['Vases', 'decoration.webp'], ['Candles', 'gift1.jpg'], ['Baskets', 'img4.jpeg'], ['Decorative Objects', 'collection2.avif']]
  },
  {
    slug: 'art-mirrors',
    name: 'Art & Mirrors',
    banner: { image: 'wednesday.jpg', eyebrow: 'Gallery walls', title: 'Art & Mirrors', text: 'Framed prints and statement mirrors to finish any wall.', cta: 'Shop Art & Mirrors' },
    fallback: [['Wall Art', 'img2.jpeg'], ['Framed Prints', 'img5.jpeg'], ['Floor Mirrors', 'img10m.jpg'], ['Wall Mirrors', 'img1m.jpg'], ['Wall Decor', 'decoration.webp'], ['Frames', 'img3.jpeg']]
  },
  {
    slug: 'tabletop-bar',
    name: 'Tabletop & Bar',
    banner: { image: 'collection1.avif', eyebrow: 'Gather & serve', title: 'Tabletop & Bar', text: 'Dinnerware, glassware and serveware for every occasion.', cta: 'Shop Tabletop' },
    fallback: [['Dinnerware', 'collection1.avif'], ['Glassware', 'collection2.avif'], ['Serveware', '009.avif'], ['Flatware', '010.avif'], ['Table Linens', '012.avif'], ['Bar Tools', '013.avif']]
  },
  {
    slug: 'storage',
    name: 'Storage',
    banner: { image: 'buffets.avif', eyebrow: 'Organized living', title: 'Storage That Looks Good', text: 'Cabinets, shelves and baskets that keep things beautifully in place.', cta: 'Shop Storage' },
    fallback: [['Cabinets', 'buffets.avif'], ['Bookcases', 'furniture.jpeg'], ['Baskets', 'img4.jpeg'], ['Dressers', 'nightstand2.avif'], ['Entryway', 'furniture3.jpeg'], ['Closet', 'img1.avif']]
  },
  {
    slug: 'holidays',
    name: 'Holidays',
    banner: { image: 'holiday.png', eyebrow: 'Holiday shop', title: 'Make It Merry', text: 'Ornaments, stockings and table decor for the season.', cta: 'Shop Holidays' },
    fallback: [['Ornaments', 'holday1.png'], ['Stockings', 'holday2.jpg'], ['Wreaths', 'holday3.jpg'], ['Holiday Tabletop', 'collection1.avif'], ['Holiday Lighting', 'mygift1.webp'], ['Gift Wrap', 'gift1.jpg']]
  },
  {
    slug: 'gifts',
    name: 'Gifts',
    banner: { image: 'gift1.jpg', eyebrow: 'Thoughtful gifting', title: 'Gifts They’ll Love', text: 'Curated ideas for hosts, homeowners and everyone in between.', cta: 'Shop Gifts' },
    fallback: [['Gifts for Her', 'mygift1.webp'], ['Gifts for Him', 'mygift2.webp'], ['Host Gifts', 'mygift3.webp'], ['Personalized', 'diamond-cable-knit-pillow-3-c.jpg'], ['Under ₹2,000', 'decoration.webp'], ['Gift Cards', 'gift1.jpg']]
  }
];

type CategoryRow = Awaited<ReturnType<typeof navigationCategories>>[number];

function sliderItems(config: ShowcaseConfig, rows: CategoryRow[]): SliderCategory[] {
  const href = `/categories/${config.slug}`;
  const fallback = config.fallback.map(([name, image]) => ({ name, href, image: assetImage(image) }));
  const parent = rows.find((row) => row.slug === config.slug);
  const children = parent ? rows.filter((row) => row.parent_id === parent.id) : [];
  if (children.length < 3) return fallback;
  return children.map((row, i) => ({
    name: row.name,
    href: `/categories/${row.slug}`,
    image: row.image ? imgSrc(row.image) : fallback[i % fallback.length].image
  }));
}

export async function CategoryShowcases() {
  let rows: CategoryRow[] = [];
  try {
    rows = await navigationCategories();
  } catch {
    rows = [];
  }

  return (
    <>
      {SHOWCASES.map((config) => (
        <CategoryShowcase key={config.slug} config={config} items={sliderItems(config, rows)} />
      ))}
    </>
  );
}

function CategoryShowcase({ config, items }: { config: ShowcaseConfig; items: SliderCategory[] }) {
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
        <img src={assetImage(config.banner.image)} alt="" className={styles.bannerImage} loading="lazy" decoding="async" />
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
