'use client';

import { useCallback, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CategoryShowcases.module.css';

export type SliderCategory = { name: string; href: string; image: string };

const AUTO_MS = 4000;

export function CategorySlider({ categories, label }: { categories: SliderCategory[]; label: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const pauseRef = useRef(false);

  const scroll = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    const max = el.scrollWidth - el.clientWidth;
    if (dir > 0 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    if (dir < 0 && el.scrollLeft <= 4) {
      el.scrollTo({ left: max, behavior: 'smooth' });
      return;
    }
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (categories.length < 2) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const timer = window.setInterval(() => {
      if (pauseRef.current) return;
      scroll(1);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [categories.length, scroll]);

  return (
    <div
      className={styles.slider}
      onMouseEnter={() => { pauseRef.current = true; }}
      onMouseLeave={() => { pauseRef.current = false; }}
      onFocusCapture={() => { pauseRef.current = true; }}
      onBlurCapture={() => { pauseRef.current = false; }}
    >
      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowPrev}`}
        onClick={() => scroll(-1)}
        disabled={categories.length < 2}
        aria-label={`Previous ${label} categories`}
      >
        <ChevronLeft size={22} />
      </button>

      <ul ref={trackRef} className={styles.track}>
        {categories.map((category, index) => (
          <li key={`${category.name}-${index}`} className={styles.card}>
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
        disabled={categories.length < 2}
        aria-label={`Next ${label} categories`}
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
