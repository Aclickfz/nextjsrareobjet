'use client';

import { useState } from 'react';
import Link from 'next/link';
import { imgSrc, money } from '@/lib/utils';
import { WishlistButton } from './WishlistButton';

type CardProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number | null;
  stock_qty: number;
  badge?: string | null;
  grade_label?: string | null;
  images?: { path: string }[];
};

export function ProductGrid({
  products,
  heading,
  sort,
  q,
  category,
  action = '/products',
  total,
  min,
  max,
  inStock
}: {
  products: CardProduct[];
  heading?: string;
  sort?: string;
  q?: string;
  category?: string;
  action?: string;
  total?: number;
  min?: string;
  max?: string;
  inStock?: boolean;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const count = total ?? products.length;

  return (
    <section className="product_box global_section shop-plp">
      <div className="container-fluid">
        <div className="product_box__content">
          <nav className="shop-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            {category ? <span>{heading}</span> : <Link href="/products">Shop</Link>}
          </nav>
          {heading ? <div className="product_heading shop-plp__title"><h1>{heading}</h1></div> : null}
          <p className="shop-plp__count">{count} {count === 1 ? 'product' : 'products'}</p>
          <div className="product_row">
            <div className="product_row__left">
              <button className="filter" type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>
                filter <img src="/assets/images/filter.svg" className="img-fluid" alt="" />
              </button>
            </div>
            <div className="product_row__right">
              <form action={action} method="get">
                {q ? <input type="hidden" name="q" value={q} /> : null}
                {category && !action.startsWith('/categories/') ? <input type="hidden" name="category" value={category} /> : null}
                {min ? <input type="hidden" name="min" value={min} /> : null}
                {max ? <input type="hidden" name="max" value={max} /> : null}
                {inStock ? <input type="hidden" name="stock" value="1" /> : null}
                <select className="form-select" name="sort" defaultValue={sort || 'newest'} aria-label="Sort products" onChange={(event) => event.currentTarget.form?.requestSubmit()}>
                  <option value="newest">Featured</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </form>
            </div>
          </div>
          {filtersOpen ? (
            <form className="shop-filters" action={action} method="get">
              {q ? <input type="hidden" name="q" value={q} /> : null}
              {category && !action.startsWith('/categories/') ? <input type="hidden" name="category" value={category} /> : null}
              <input type="hidden" name="sort" value={sort || 'newest'} />
              <label>Min price<input name="min" type="number" min={0} step="1" defaultValue={min || ''} /></label>
              <label>Max price<input name="max" type="number" min={0} step="1" defaultValue={max || ''} /></label>
              <label className="shop-filters__check"><input type="checkbox" name="stock" value="1" defaultChecked={inStock} /> In stock</label>
              <button type="submit" className="global_btn">Apply</button>
            </form>
          ) : null}
          <div className="row" id="product-grid">
            {products.map((product) => {
              const image = product.images?.[0]?.path;
              const compare = product.compare_at_price ? Number(product.compare_at_price) : 0;
              const onSale = compare > Number(product.price);
              return (
                <div className="col-xl-3 col-md-4 col-sm-6" key={product.id}>
                  <div className="card__inner shop-card">
                    <div className="card--img">
                      <Link href={`/products/${product.slug}`}>
                        <div className="media_hover">
                          <img decoding="async" loading="lazy" src={imgSrc(image)} className="img-fluid" alt={product.name} />
                        </div>
                      </Link>
                      <div className="favorites">
                        <WishlistButton productId={product.id} />
                      </div>
                    </div>
                    <div className="card__inner_content">
                      <h6>{product.badge || (onSale ? 'Sale' : '\u00a0')}</h6>
                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                      <span className="shop-card__price">
                        {onSale ? <s>{money(compare)}</s> : null}
                        {money(product.price)}
                      </span>
                      {product.grade_label ? <p>{product.grade_label}</p> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!products.length ? <p className="ui-status" role="status">No products found.</p> : null}
        </div>
      </div>
    </section>
  );
}
