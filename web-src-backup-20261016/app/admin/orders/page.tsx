import Link from 'next/link';
import { query } from '@/lib/db';
import { money } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await query<{ id: number; order_number: string; status: string; total: number; customer_name: string; customer_email: string }[]>(
    `SELECT o.id, o.order_number, o.status, o.total, u.name AS customer_name, u.email AS customer_email
     FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC LIMIT 100`
  );
  return (
    <>
      <div className="page-head"><div><h2>Orders</h2><p>Track checkout through delivery.</p></div></div>
      <div className="panel">
      <table className="admin-table">
        <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th><th></th></tr></thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.order_number}</td>
              <td>{order.customer_name}<div style={{ fontSize: '.8rem', color: '#62675f' }}>{order.customer_email}</div></td>
              <td>{order.status}</td>
              <td>{money(Number(order.total))}</td>
              <td><Link href={`/admin/orders/${order.id}`}>Open</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
