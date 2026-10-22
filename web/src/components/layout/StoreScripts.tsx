'use client';

import { useEffect } from 'react';

const scriptLoads = new Map<string, Promise<void>>();

function load(src: string) {
  const existing = scriptLoads.get(src);
  if (existing) return existing;

  // A script element can exist while it is still downloading. Share completion,
  // not just element presence, across effect reruns and component remounts.
  const pending = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      scriptLoads.delete(src);
      reject(new Error(`Failed to load storefront script: ${src}`));
    };
    document.body.appendChild(script);
  });
  scriptLoads.set(src, pending);
  return pending;
}

export function StoreScripts() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const src of [
        '/assets/vendor/jquery/jquery.min.js',
        '/assets/vendor/slick/slick.min.js',
        '/assets/vendor/swiper/swiper-bundle.min.js',
        '/assets/js/index.js',
        '/assets/js/carousels.js',
        '/assets/js/filter.js'
      ]) {
        if (cancelled) return;
        await load(src);
      }
      if (cancelled) return;
      const win = window as Window & { bootSiteUI?: () => void; startSiteUI?: () => void };
      win.bootSiteUI?.();
    })().catch((error: unknown) => {
      console.error('Unable to initialize storefront scripts', error);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}

export function HeaderCounts({ cart, wishlist }: { cart: number; wishlist: number }) {
  useEffect(() => {
    document.querySelectorAll('a[href="/account/wishlist"] + span, a[href="/account/wishlist"] span').forEach((node) => {
      node.textContent = `(${wishlist})`;
    });
    document.querySelectorAll('a[href="/cart"] + span, a[href="/cart"] span').forEach((node) => {
      node.textContent = `(${cart})`;
    });
  }, [cart, wishlist]);
  return null;
}
