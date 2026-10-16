import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { loadOrder } from '@/services/order.service';
import { imgSrc, money } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) redirect('/login');
  const { id } = await params;
  const order = await loadOrder(Number(id), user.id, user.role === 'admin').catch(() => null);
  if (!order) redirect('/account/orders');
  const items = order.items as { name_snapshot: string; qty: number; line_total: number; image?: string }[];
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="global_section sign_wrapper">
        <div className="container">
          <div className="sign_wrapper__content" style={{ maxWidth: 720, margin: '0 auto' }}>
            <h1>{String(order.order_number)}</h1>
            <p>Status: {String(order.status)} · Payment: {String(order.payment_status)} (Cash on delivery)</p>
            <p>{String(order.street_address)}, {String(order.city)} {String(order.postal_code)}</p>
            {items.map((item) => (
              <div key={item.name_snapshot} className="table_flax">
                <img src={imgSrc(item.image)} alt="" className="img-fluid" />
                <p>{item.name_snapshot} × {item.qty}</p>
                <h6>{money(item.line_total)}</h6>
              </div>
            ))}
            <h6>Total {money(Number(order.total))}</h6>
            <p><Link href={`/account/orders/${order.id}/invoice`}>Invoice</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
