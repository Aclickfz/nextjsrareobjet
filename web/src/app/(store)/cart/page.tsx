import { CartView } from '@/components/cart/CartCheckout';
import { getCart } from '@/actions/cart.actions';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const cart = await getCart().catch(() => ({ items: [], count: 0, subtotal: 0, shipping: 0, total: 0 }));
  return (
    <main id="main-content" className="auth-page" tabIndex={-1}>
      <section>
        <div className="container">
          <nav className="shop-crumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <span>Cart</span>
          </nav>
          <div className="shop-plp__title"><h1>Your cart</h1></div>
        </div>
      </section>
      <CartView items={cart.items} subtotal={cart.subtotal} shipping={cart.shipping} total={cart.total} />
    </main>
  );
}
