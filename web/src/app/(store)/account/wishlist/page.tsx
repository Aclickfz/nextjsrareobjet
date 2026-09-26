import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { listWishlist } from '@/actions/order.actions';
import { attachImages, type ProductRow } from '@/repositories/catalog.repository';
import { imgSrc, money } from '@/lib/utils';
import { AddToCartButton } from '@/components/product/AddToCartButton';
import { WishlistButton } from '@/components/product/WishlistButton';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const user = await currentUser();
  if (!user) redirect('/login?next=/account/wishlist');
  const rows = (await listWishlist().catch(() => [])) as ProductRow[];
  const items = await attachImages(rows);

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="product_box global_section">
        <div className="container-fluid">
          <div className="product_box__content">
            <div className="product_heading">
              <h1>Favourites</h1>
              <p>{items.length} {items.length === 1 ? 'item' : 'items'}</p>
              <Link href="/products" className="global_btn">Continue shopping</Link>
            </div>
            <div className="row" id="product-grid">
              {items.map((product) => {
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
                        <span>{money(Number(product.price))}</span>
                        {product.grade_label ? <p>{product.grade_label}</p> : null}
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
                Your favourites list is empty. <Link href="/products">Continue shopping</Link>
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
