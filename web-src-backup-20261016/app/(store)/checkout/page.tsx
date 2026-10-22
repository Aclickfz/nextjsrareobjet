import { redirect } from 'next/navigation';
import { CheckoutForm } from '@/components/cart/CartCheckout';
import { getCart } from '@/actions/cart.actions';
import { currentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const user = await currentUser();
  if (!user) redirect('/login?next=/checkout');
  const cart = await getCart();
  if (!cart.items.length) redirect('/cart');
  return (
    <main id="main-content" tabIndex={-1}>
      <CheckoutForm subtotal={cart.subtotal} shipping={cart.shipping} total={cart.total} />
    </main>
  );
}
