'use client';

import Link from 'next/link';
import { imgSrc, money } from '@/lib/utils';
import { WishlistButton } from './WishlistButton';
import { RecentsList } from './RecentsList';

type CardProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  price_max?: number | null;
  compare_at_price?: number | null;
  badge?: string | null;
  free_shipping?: number | boolean | null;
  images?: { path: string }[];
  pdp?: { price_max?: number | null; free_shipping?: boolean };
};

type Chip = { label: string; href?: string };
type Faq = { question: string; answer: string };

function cardPrice(product: CardProduct) {
  const min = Number(product.price);
  const max = product.pdp?.price_max ?? product.price_max;
  const compare = product.compare_at_price ? Number(product.compare_at_price) : 0;
  const onSale = compare > min;
  const range = max != null && Number(max) > min ? `${money(min)} – ${money(Number(max))}` : money(min);
  return (
    <span className="shop-rail__price">
      {onSale ? <s>{money(compare)}</s> : null}
      <strong className={onSale ? 'is-sale' : ''}>{range}</strong>
    </span>
  );
}

function ProductRail({ title, products }: { title: string; products: CardProduct[] }) {
  if (!products.length) return null;
  return (
    <section className="shop-rail global_section">
      <div className="container">
        <div className="shop-rail__head">
          <h2>{title}</h2>
        </div>
        <div className="shop-rail__track">
          {products.map((product) => (
            <article className="shop-rail__card" key={product.id}>
              <div className="shop-rail__media">
                {(product.badge || '').toLowerCase().includes('best') ? <span className="shop-rail__badge">Bestseller</span> : null}
                {product.badge && !(product.badge || '').toLowerCase().includes('best') ? <span className="shop-rail__badge">{product.badge}</span> : null}
                <WishlistButton productId={product.id} />
                <Link href={`/products/${product.slug}`}>
                  <img decoding="async" loading="lazy" src={imgSrc(product.images?.[0]?.path)} alt={product.name} />
                </Link>
              </div>
              <Link href={`/products/${product.slug}`} className="shop-rail__meta">
                <span>{product.name}</span>
                {cardPrice(product)}
                {(product.pdp?.free_shipping || product.free_shipping) ? <em>Free Shipping</em> : null}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChipRow({ title, items, searchIcon }: { title: string; items: Chip[]; searchIcon?: boolean }) {
  if (!items.length) return null;
  return (
    <section className="shop-chips global_section">
      <div className="container">
        <h2>{title}</h2>
        <div className="shop-chips__row">
          {items.map((item) => (
            <Link key={item.label} href={item.href || '#'} className="shop-chips__item">
              {searchIcon ? <i className="bx bx-search" aria-hidden="true" /> : null}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqList({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <section className="shop-faq global_section">
      <div className="container">
        <h2>FAQ</h2>
        <div className="shop-faq__list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary><span aria-hidden="true">+</span> {faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductExtras({
  paired = [],
  collection = [],
  similar = [],
  relatedCategories = [],
  relatedSearches = [],
  faqs = []
}: {
  paired?: CardProduct[];
  collection?: CardProduct[];
  similar?: CardProduct[];
  relatedCategories?: Chip[];
  relatedSearches?: Chip[];
  faqs?: Faq[];
}) {
  return (
    <>
      <ProductRail title="Frequently Paired With" products={paired} />
      <ProductRail title="Also In This Collection" products={collection} />
      <ProductRail title="Similar Items" products={similar} />
      <section className="shop-rail global_section">
        <div className="container">
          <div className="shop-rail__head"><h2>Recently Viewed</h2></div>
          <RecentsList variant="rail" />
        </div>
      </section>
      <ChipRow title="Related Categories" items={relatedCategories} />
      <ChipRow title="Related Searches" items={relatedSearches} searchIcon />
      <FaqList faqs={faqs} />
    </>
  );
}
