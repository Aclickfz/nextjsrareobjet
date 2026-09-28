'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { imgSrc, money } from '@/lib/utils';

export type RecentProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image?: string | null;
};

const KEY = 'jac-recents';

export function rememberRecent(product: RecentProduct) {
  try {
    const current = JSON.parse(localStorage.getItem(KEY) || '[]') as RecentProduct[];
    const next = [product, ...current.filter((item) => item.slug !== product.slug)].slice(0, 12);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage can be blocked */
  }
}

export function RecentsList() {
  const [items, setItems] = useState<RecentProduct[] | null>(null);
  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY) || '[]'));
    } catch {
      setItems([]);
    }
  }, []);

  return (
    <section className="auth-page">
      <div className="container-fluid">
        <nav className="shop-crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Recently viewed</span>
        </nav>
        <div className="product_heading shop-plp__title"><h1>Recently viewed</h1></div>
        {items === null ? <p className="shop-plp__count">Loading your recent items.</p> : <p className="shop-plp__count">{items.length} {items.length === 1 ? 'item' : 'items'}</p>}
        <div className="row">
          {(items || []).map((product) => (
            <div className="col-xl-3 col-md-4 col-sm-6" key={product.slug}>
              <div className="card__inner shop-card">
                <Link href={`/products/${product.slug}`}>
                  <img src={imgSrc(product.image)} className="img-fluid" alt={product.name} />
                </Link>
                <div className="card__inner_content">
                  <Link href={`/products/${product.slug}`}>{product.name}</Link>
                  <span>{money(product.price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items && !items.length ? <p className="ui-status" role="status">Products you open will show up here. <Link href="/products">Continue shopping</Link></p> : null}
      </div>
    </section>
  );
}
