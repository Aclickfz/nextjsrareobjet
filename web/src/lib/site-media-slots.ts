import { HOMEPAGE_SHOWCASES } from '@/lib/homepage-showcases';

export type SiteMediaSlot = {
  slot_key: string;
  label: string;
  section: string;
  /** Relative path used as seed / fallback (e.g. assets/images/banner.jpg). */
  default_path: string;
};

export function showcaseBannerSlotKey(slug: string) {
  return `showcase.${slug}.banner`;
}

export function showcaseTileSlotKey(slug: string, index: number) {
  return `showcase.${slug}.tile.${index + 1}`;
}

const heroAndHomeSlots: SiteMediaSlot[] = [
  { slot_key: 'hero.slide1.poster', label: 'Hero slide 1 poster', section: 'Hero', default_path: 'assets/images/banner.jpg' },
  { slot_key: 'hero.slide2.poster', label: 'Hero slide 2 poster', section: 'Hero', default_path: 'assets/images/banner2.jpg' },
  { slot_key: 'hero.slide3.poster', label: 'Hero slide 3 poster', section: 'Hero', default_path: 'assets/images/banner.jpg' },

  { slot_key: 'home.bestseller', label: 'Bestseller / interior design', section: 'Home sections', default_path: 'assets/images/furniture5.jpeg' },
  { slot_key: 'home.collection1.img1', label: 'Collection 1 image A', section: 'Home sections', default_path: 'assets/images/collection1.avif' },
  { slot_key: 'home.collection1.img2', label: 'Collection 1 image B', section: 'Home sections', default_path: 'assets/images/collection2.avif' },
  { slot_key: 'home.collection2.img1', label: 'Collection 2 image A', section: 'Home sections', default_path: 'assets/images/collection1.avif' },
  { slot_key: 'home.collection2.img2', label: 'Collection 2 image B', section: 'Home sections', default_path: 'assets/images/collection2.avif' },

  { slot_key: 'home.elements.1', label: 'Collections slider 1', section: 'Home sections', default_path: 'assets/images/img2.jpeg' },
  { slot_key: 'home.elements.2', label: 'Collections slider 2', section: 'Home sections', default_path: 'assets/images/img3.jpeg' },
  { slot_key: 'home.elements.3', label: 'Collections slider 3', section: 'Home sections', default_path: 'assets/images/img4.jpeg' },
  { slot_key: 'home.elements.4', label: 'Collections slider 4', section: 'Home sections', default_path: 'assets/images/img5.jpeg' },
  { slot_key: 'home.elements.5', label: 'Collections slider 5', section: 'Home sections', default_path: 'assets/images/img1.avif' },
  { slot_key: 'home.elements.6', label: 'Collections slider 6', section: 'Home sections', default_path: 'assets/images/img1.avif' },

  { slot_key: 'home.discover.1', label: 'Discover brands 1', section: 'Home sections', default_path: 'assets/images/016.avif' },
  { slot_key: 'home.discover.2', label: 'Discover brands 2', section: 'Home sections', default_path: 'assets/images/010.avif' },
  { slot_key: 'home.discover.3', label: 'Discover brands 3', section: 'Home sections', default_path: 'assets/images/012.avif' },
  { slot_key: 'home.discover.4', label: 'Discover brands 4', section: 'Home sections', default_path: 'assets/images/013.avif' },
  { slot_key: 'home.discover.5', label: 'Discover brands 5', section: 'Home sections', default_path: 'assets/images/009.avif' },
  { slot_key: 'home.discover.6', label: 'Discover brands 6', section: 'Home sections', default_path: 'assets/images/img1.avif' },

  { slot_key: 'home.mycollection.1', label: 'My collection sofa 1', section: 'Home sections', default_path: 'assets/images/sofa1.webp' },
  { slot_key: 'home.mycollection.2', label: 'My collection sofa 2', section: 'Home sections', default_path: 'assets/images/sofa2.webp' },
  { slot_key: 'home.mycollection.3', label: 'My collection sofa 3', section: 'Home sections', default_path: 'assets/images/sofa3.webp' },
  { slot_key: 'home.mycollection.4', label: 'My collection sofa 4', section: 'Home sections', default_path: 'assets/images/sofa4.webp' },
  { slot_key: 'home.mycollection.5', label: 'My collection sofa 5', section: 'Home sections', default_path: 'assets/images/sofa5.webp' },
  { slot_key: 'home.mycollection.6', label: 'My collection sofa 6', section: 'Home sections', default_path: 'assets/images/sofa6.webp' },
  { slot_key: 'home.mycollection.7', label: 'My collection sofa 7', section: 'Home sections', default_path: 'assets/images/sofa7.webp' },
  { slot_key: 'home.mycollection.8', label: 'My collection sofa 8', section: 'Home sections', default_path: 'assets/images/sofa8.webp' }
];

const showcaseBannerSlots: SiteMediaSlot[] = HOMEPAGE_SHOWCASES.map((showcase) => ({
  slot_key: showcaseBannerSlotKey(showcase.slug),
  label: `${showcase.name} banner`,
  section: 'Category showcases',
  default_path: `assets/images/${showcase.banner.image}`
}));

const showcaseTileSlots: SiteMediaSlot[] = HOMEPAGE_SHOWCASES.flatMap((showcase) =>
  showcase.fallback.map(([name, file], index) => ({
    slot_key: showcaseTileSlotKey(showcase.slug, index),
    label: `${showcase.name}: ${name}`,
    section: `Tiles · ${showcase.name}`,
    default_path: `assets/images/${file}`
  }))
);

export const SITE_MEDIA_SLOTS: SiteMediaSlot[] = [
  ...heroAndHomeSlots.slice(0, 3),
  ...showcaseBannerSlots,
  ...showcaseTileSlots,
  ...heroAndHomeSlots.slice(3)
];

export function siteMediaSlotByKey(slotKey: string) {
  return SITE_MEDIA_SLOTS.find((slot) => slot.slot_key === slotKey);
}
