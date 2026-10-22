import Link from 'next/link';
import { dashboardData } from '@/actions/admin.actions';
import { money } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await dashboardData();
  const stats = data.stats || {};
  const orders = data.recentOrders as { id: number; order_number: string; customer_name: string; status: string; total: number }[];
  const low = data.lowStock as { name: string; sku: string | null; stock_qty: number }[];
  return (
    <>
      <div className="page-head"><div><h2>Dashboard</h2><p>Orders, revenue, customers, and stock that need attention.</p></div></div>
      <div className="admin-cards">
        <div className="admin-card"><div className="label">Orders</div><div className="value">{Number(stats.orders_total || 0)}</div></div>
        <div className="admin-card"><div className="label">Pending</div><div className="value">{Number(stats.orders_pending || 0)}</div></div>
        <div className="admin-card"><div className="label">Revenue</div><div className="value">{money(Number(stats.revenue || 0))}</div></div>
        <div className="admin-card"><div className="label">Customers</div><div className="value">{Number(stats.customers || 0)}</div></div>
        <div className="admin-card"><div className="label">Low stock</div><div className="value">{Number(stats.low_stock || 0)}</div></div>
      </div>
      <div className="panel">
      <div className="panel-head"><h3>Recent orders</h3></div>
      <table className="admin-table">
        <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th><th></th></tr></thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.order_number}</td><td>{order.customer_name}</td><td>{order.status}</td>
              <td>{money(Number(order.total))}</td>
              <td><Link href={`/admin/orders/${order.id}`}>Open</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="panel">
      <div className="panel-head"><h3>Low stock</h3></div>
      <table className="admin-table">
        <thead><tr><th>Product</th><th>SKU</th><th>Stock</th></tr></thead>
        <tbody>{low.map((product) => <tr key={product.name}><td>{product.name}</td><td>{product.sku || '—'}</td><td>{product.stock_qty}</td></tr>)}</tbody>
      </table>
      </div>
    </>
  );
}
