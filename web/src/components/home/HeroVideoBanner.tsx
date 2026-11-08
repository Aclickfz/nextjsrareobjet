'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { assetImage } from '@/lib/utils';
import styles from './HeroVideoBanner.module.css';

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
  video: string;
  poster: string;
  href: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: 'New Season · 2026',
    title: 'Interior Design, Reimagined',
    description: 'Original pieces and timeless collections crafted to make every room feel like home.',
    video: 'https://videos.pexels.com/video-files/7578552/7578552-uhd_2560_1440_30fps.mp4',
    poster: assetImage('banner.jpg'),
    href: '/products',
  },
  {
    eyebrow: 'Just In',
    title: 'The Fall Collection',
    description: 'Warm textures, sculpted forms and quiet luxury — curated for the colder months.',
    video: 'https://videos.pexels.com/video-files/7578544/7578544-uhd_2560_1440_30fps.mp4',
    poster: assetImage('banner2.jpg'),
    href: '/products',
  },
  {
    eyebrow: 'Last Day · Up to 40% Off',
    title: 'Living Room Essentials',
    description: 'Sofas, lighting and décor that bring comfort and character together.',
    video: 'https://videos.pexels.com/video-files/3015510/3015510-hd_1920_1080_24fps.mp4',
    poster: assetImage('banner.jpg'),
    href: '/products',
  },
];

const SLIDE_DURATION = 8000;

export function HeroVideoBanner() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const elapsedRef = useRef(0);
  const touchX = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    elapsedRef.current = 0;
    setProgress(0);
    setActive((index + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && playing) {
        video.play().catch(() => {});
      } else {
        video.pause();
        if (i !== active) video.currentTime = 0;
      }
    });
  }, [active, playing]);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      elapsedRef.current += now - last;
      last = now;
      if (elapsedRef.current >= SLIDE_DURATION) {
        goTo(active + 1);
        return;
      }
      setProgress(elapsedRef.current / SLIDE_DURATION);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, playing, goTo]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goTo(active + 1);
    if (e.key === 'ArrowLeft') goTo(active - 1);
  };

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onKeyDown={onKeyDown}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) goTo(active + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.title}
          className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${SLIDES.length}`}
          aria-hidden={i !== active}
        >
          <video
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            className={styles.video}
            src={slide.video}
            poster={slide.poster}
            muted
            loop
            playsInline
            preload={i === 0 ? 'auto' : 'metadata'}
          />
          <div className={styles.overlay} />

          <div className={styles.content}>
            <span className={styles.eyebrow}>{slide.eyebrow}</span>
            {i === 0 ? <h1 className={styles.title}>{slide.title}</h1> : <h2 className={styles.title}>{slide.title}</h2>}
            <p className={styles.description}>{slide.description}</p>
            <div className={styles.actions}>
              <a href={slide.href} className={styles.btnPrimary} tabIndex={i === active ? 0 : -1}>
                Explore More
                <ArrowRight size={18} aria-hidden />
              </a>
            </div>
          </div>
        </div>
      ))}

      <div className={styles.controls}>
        <div className={styles.tabs} role="tablist" aria-label="Choose slide">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`${styles.tab} ${i === active ? styles.tabActive : ''}`}
              onClick={() => goTo(i)}
            >
              <span className={styles.tabBar}>
                <span
                  className={styles.tabFill}
                  style={{ transform: `scaleX(${i === active ? progress : i < active ? 1 : 0})` }}
                />
              </span>
              <span className={styles.tabLabel}>
                <span className={styles.tabIndex}>0{i + 1}</span>
                {slide.title}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.buttons}>
          <button type="button" className={styles.iconBtn} onClick={() => goTo(active - 1)} aria-label="Previous slide">
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause banner' : 'Play banner'}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button type="button" className={styles.iconBtn} onClick={() => goTo(active + 1)} aria-label="Next slide">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
