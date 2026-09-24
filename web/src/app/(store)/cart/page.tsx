import { CartView } from '@/components/cart/CartCheckout';
import { getCart } from '@/actions/cart.actions';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const cart = await getCart().catch(() => ({ items: [], count: 0, subtotal: 0, shipping: 0, total: 0 }));
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="cart_banner">
        <div className="container">
          <div className="cart_banner__content">
            <p>Shopping</p>
            <h1>Your cart</h1>
          </div>
        </div>
      </section>
      <CartView items={cart.items} subtotal={cart.subtotal} shipping={cart.shipping} total={cart.total} />
    </main>
  );
}
