'use client';

import Link from 'next/link';
import { imgSrc, money } from '@/lib/utils';
import { WishlistButton } from './WishlistButton';

type CardProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
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
  action = '/products'
}: {
  products: CardProduct[];
  heading?: string;
  sort?: string;
  q?: string;
  category?: string;
  action?: string;
}) {
  return (
    <section className="product_box global_section">
      <div className="container-fluid">
        <div className="product_box__content">
          {heading ? <div className="product_heading"><h1>{heading}</h1></div> : null}
          <div className="product_row">
            <div className="product_row__left">
              <button className="filter" type="button">filter <img src="/assets/images/filter.svg" className="img-fluid" alt="filter" /></button>
            </div>
            <div className="product_row__right">
              <form action={action} method="get">
                {q ? <input type="hidden" name="q" value={q} /> : null}
                {category ? <input type="hidden" name="category" value={category} /> : null}
                <select className="form-select" name="sort" defaultValue={sort || 'newest'} aria-label="Sort products" onChange={(event) => event.currentTarget.form?.requestSubmit()}>
                  <option value="newest">Featured</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </form>
            </div>
          </div>
          <div className="row" id="product-grid">
            {products.map((product) => {
              const image = product.images?.[0]?.path;
              return (
                <div className="col-xl-4 col-sm-6" key={product.id}>
                  <div className="card__inner">
                    <div className="card--img">
                      <div className="media_hover">
                        <img decoding="async" loading="lazy" src={imgSrc(image)} className="img-fluid" alt={product.name} />
                      </div>
                      <div className="favorites">
                        <WishlistButton productId={product.id} />
                      </div>
                    </div>
                    <div className="card__inner_content">
                      <h6>{product.badge || '\u00a0'}</h6>
                      <Link href={`/products/${product.slug}`}>{product.name}</Link>
                      <span>{money(product.price)}</span>
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
