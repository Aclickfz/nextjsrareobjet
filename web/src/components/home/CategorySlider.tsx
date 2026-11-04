'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CategoryShowcases.module.css';

export type SliderCategory = { name: string; href: string; image: string };

export function CategorySlider({ categories, label }: { categories: SliderCategory[]; label: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div className={styles.slider}>
      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowPrev}`}
        onClick={() => scroll(-1)}
        disabled={!canPrev}
        aria-label={`Previous ${label} categories`}
      >
        <ChevronLeft size={22} />
      </button>

      <ul ref={trackRef} className={styles.track} onScroll={update}>
        {categories.map((category) => (
          <li key={category.name} className={styles.card}>
            <a href={category.href}>
              <span className={styles.cardImage}>
                <img src={category.image} alt="" loading="lazy" decoding="async" />
              </span>
              <span className={styles.cardName}>{category.name}</span>
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowNext}`}
        onClick={() => scroll(1)}
        disabled={!canNext}
        aria-label={`Next ${label} categories`}
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
