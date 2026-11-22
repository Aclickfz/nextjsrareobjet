import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { listWishlist } from '@/actions/order.actions';
import { attachImages, type ProductRow } from '@/repositories/catalog.repository';
import { imgSrc, money } from '@/lib/utils';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { WishlistButton } from '@/components/product/WishlistButton';

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
  const user = await currentUser();
  if (!user) redirect('/login?next=/favorites');
  const rows = (await listWishlist().catch(() => [])) as ProductRow[];
  const items = await attachImages(rows);

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="auth-page">
        <div className="container-fluid">
          <nav className="shop-crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Favorites</span>
          </nav>
          <div className="product_heading shop-plp__title">
            <h1>Favorites</h1>
          </div>
          <p className="shop-plp__count">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          <div className="row" id="product-grid">
            {items.map((product) => {
              const price = Number(product.price);
              const compare = product.compare_at_price ? Number(product.compare_at_price) : 0;
              const onSale = compare > price;
              const savePct = onSale ? Math.round(((compare - price) / compare) * 100) : 0;
              const tags = [product.badge || (onSale ? 'Sale' : '')].filter(Boolean) as string[];
              return (
                <div className="col-xl-3 col-md-4 col-sm-6" key={product.id}>
                  <div className="card__inner shop-card">
                    <div className="card--img">
                      {tags[0] ? <span className="shop-card__badge">{tags[0]}</span> : null}
                      <Link href={`/products/${product.slug}`}>
                        <img decoding="async" loading="lazy" src={imgSrc(product.images?.[0]?.path)} className="img-fluid" alt={product.name} />
                      </Link>
                      <div className="favorites">
                        <WishlistButton productId={product.id} />
                      </div>
                    </div>
                    <div className="card__inner_content shop-card__meta">
                      {tags.length ? (
                        <div className="shop-card__tags" aria-label="Product labels">
                          {tags.map((tag) => (
                            <span key={tag} className="shop-card__tag">{tag}</span>
                          ))}
                        </div>
                      ) : null}
                      <Link href={`/products/${product.slug}`} className="shop-card__title">{product.name}</Link>
                      <div className="shop-card__price-row">
                        <span className={`shop-card__price${onSale ? ' is-sale' : ''}`}>
                          {onSale ? <s className="shop-card__compare">{money(compare)}</s> : null}
                          <span className="shop-card__current">{money(price)}</span>
                        </span>
                        {onSale && savePct > 0 ? <span className="shop-card__save">Save {savePct}%</span> : null}
                      </div>
                      <div className="catalog-cart-action">
                        <AddToCartButton productId={product.id} productName={product.name} stockQty={product.stock_qty} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!items.length ? (
            <p className="ui-status" role="status">
              Your favorites list is empty. <Link href="/products">Continue shopping</Link>
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
