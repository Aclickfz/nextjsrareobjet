import { ActionForm } from '@/components/ui/ActionForm';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { listMyOrders } from '@/services/order.service';
import { logoutAction } from '@/actions/auth.actions';
import { OrdersList, type AccountOrder } from '@/components/account/OrdersList';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'My orders', robots: { index: false, follow: false } };

type OrderRow = Omit<AccountOrder, 'placed'> & { created_at: string | Date };
export default async function OrdersPage() {
  const user = await currentUser();
  if (!user) redirect('/login');
  let orders: AccountOrder[] = [];
  let unavailable = false;
  try {
    const rows = await listMyOrders(user.id) as OrderRow[];
    orders = rows.map(order => {
      const date = new Date(order.created_at);
      return { id: order.id, order_number: order.order_number, status: order.status, total: Number(order.total), invoice_number: order.invoice_number, placed: Number.isNaN(date.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(date) };
    });
  } catch { unavailable = true; }
  const active = orders.filter(order => ['pending', 'confirmed', 'shipped'].includes(order.status)).length;
  const delivered = orders.filter(order => order.status === 'delivered').length;
  const initials = user.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'U';
  return <main id="main-content" className="account-page" tabIndex={-1}>
    <div className="account-container">
      <div className="account-breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>My account</span><span aria-hidden="true">/</span><strong>Orders</strong></div>
      <div className="account-layout">
        <aside className="account-sidebar">
          <div className="account-identity"><span className="account-avatar">{initials}</span><span className="account-label">YOUR PERSONAL SPACE</span><h2>{user.name}</h2><p>{user.email}</p></div>
          <nav className="account-navigation" aria-label="My account"><Link href="/account/orders" aria-current="page"><i className="bx bx-package" aria-hidden="true" /> My orders <span>{unavailable ? '-' : orders.length}</span></Link><Link href="/account/wishlist"><i className="bx bx-heart" aria-hidden="true" /> Favourites</Link><Link href="/account/profile"><i className="bx bx-user" aria-hidden="true" /> My profile</Link></nav>
          <div className="account-sidebar-bottom"><p><i className="bx bx-lock-alt" aria-hidden="true" /> Your account is secure</p><ActionForm action={logoutAction} success="You have been signed out." successPath="/"><button type="submit" className="account-logout"><i className="bx bx-log-out" aria-hidden="true" /> Log out</button></ActionForm></div>
        </aside>
        <section className="account-main" aria-labelledby="orders-title">
          <header className="account-heading"><div><span className="account-label">THOUGHTFULLY CHOSEN. ALL YOURS.</span><h1 id="orders-title">My orders.</h1><p>A home for every order, from first click to your doorstep.</p></div><Link href="/products" className="account-shop">Continue shopping <span aria-hidden="true">&#8599;</span></Link></header>
          {unavailable ? <div className="orders-empty" role="alert"><span className="orders-empty-icon" aria-hidden="true"><i className="bx bx-cloud" /></span><h2>We could not load your orders.</h2><p>Please try again in a moment. Your order history will appear here.</p><a className="account-primary" href="/account/orders">Try again</a></div> : <><div className="account-stats"><div><span>Total orders</span><strong>{orders.length.toString().padStart(2, '0')}</strong><i className="bx bx-shopping-bag" aria-hidden="true" /></div><div><span>In progress</span><strong>{active.toString().padStart(2, '0')}</strong><i className="bx bx-time-five" aria-hidden="true" /></div><div><span>Delivered</span><strong>{delivered.toString().padStart(2, '0')}</strong><i className="bx bx-check-circle" aria-hidden="true" /></div></div><OrdersList orders={orders} /></>}
          <div className="account-help"><i className="bx bx-message-rounded-detail" aria-hidden="true" /><div><strong>A little help with your order?</strong><p>We are here to help with the details.</p></div><Link href="/contact">Contact us <span aria-hidden="true">&#8599;</span></Link></div>
        </section>
      </div>
    </div>
  </main>;
}
