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
            {items.map((product) => (
              <div className="col-xl-3 col-md-4 col-sm-6" key={product.id}>
                <div className="card__inner shop-card">
                  <div className="card--img">
                    <Link href={`/products/${product.slug}`}>
                      <img decoding="async" loading="lazy" src={imgSrc(product.images?.[0]?.path)} className="img-fluid" alt={product.name} />
                    </Link>
                    <div className="favorites">
                      <WishlistButton productId={product.id} />
                    </div>
                  </div>
                  <div className="card__inner_content">
                    <Link href={`/products/${product.slug}`}>{product.name}</Link>
                    <span>{money(Number(product.price))}</span>
                    <div className="catalog-cart-action">
                      <AddToCartButton productId={product.id} productName={product.name} stockQty={product.stock_qty} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
