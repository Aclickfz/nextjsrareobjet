'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('main > section:not(:first-child)');
    if (!('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    sections.forEach((section) => {
      section.classList.add('reveal');
      observer.observe(section);
    });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
