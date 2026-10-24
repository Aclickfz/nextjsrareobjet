'use client';

import { Sparkles, Heart, ShoppingBag, Truck, Tag } from 'lucide-react';
import styles from './StoreNavigation.module.css';

const announcements = [
  { text: 'Delivery Within 7 Days', Icon: Truck },
  { text: 'Festive Sale Live: Flat 10% Off: Auto applied On Checkout', Icon: Tag },
  { text: 'Discover Our Latest Arrivals', Icon: Sparkles },
  { text: 'Furniture, Lighting & Decor For Your Home', Icon: ShoppingBag },
  { text: 'Find Your Next Favourite At JustAclick', Icon: Heart },
];

export function AnnouncementTicker() {
  return <section className={styles.ticker} aria-label="Store announcements" tabIndex={0}>
    <div className={styles.tickerViewport}>
      <div className={styles.tickerTrack}>
        {[0, 1].map(copy => <div className={styles.tickerGroup} key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {announcements.map(({ text, Icon }) => <span className={styles.tickerItem} key={text}><Icon size={15} aria-hidden="true" />{text}</span>)}
        </div>)}
      </div>
    </div>
  </section>;
}
