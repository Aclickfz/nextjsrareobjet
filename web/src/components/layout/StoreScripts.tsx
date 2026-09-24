'use client';

import { useEffect } from 'react';

function load(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(src));
    document.body.appendChild(script);
  });
}

export function StoreScripts() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await load('/assets/vendor/jquery/jquery.min.js');
      await load('/assets/vendor/slick/slick.min.js');
      await load('/assets/vendor/swiper/swiper-bundle.min.js');
      if (cancelled) return;
      await load('/assets/js/index.js');
      await load('/assets/js/carousels.js');
      await load('/assets/js/filter.js');
      const win = window as Window & { bootSiteUI?: () => void; startSiteUI?: () => void };
      win.bootSiteUI?.();
    })().catch(() => undefined);
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
