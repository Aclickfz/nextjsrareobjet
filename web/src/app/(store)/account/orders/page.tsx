import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { listMyOrders } from '@/services/order.service';
import { money } from '@/lib/utils';
import { logoutAction } from '@/actions/auth.actions';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const user = await currentUser();
  if (!user) redirect('/login');
  const orders = (await listMyOrders(user.id).catch(() => [])) as { id: number; order_number: string; status: string; total: number }[];
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="global_section sign_wrapper">
        <div className="container">
          <div className="sign_wrapper__content" style={{ maxWidth: 960, margin: '0 auto' }}>
            <h1>My orders</h1>
            <p>{user.name} · {user.email}</p>
            <form action={logoutAction}><button type="submit">Log out</button></form>
            <table className="cart-items">
              <thead><tr><th>Order</th><th>Status</th><th>Total</th><th></th></tr></thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.order_number}</td>
                    <td>{order.status}</td>
                    <td>{money(Number(order.total))}</td>
                    <td><Link href={`/account/orders/${order.id}`}>View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!orders.length ? <p>No orders yet.</p> : null}
            <p><Link href="/account/wishlist">Favourites</Link> · <Link href="/account/profile">Profile</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
