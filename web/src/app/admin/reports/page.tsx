import { query } from '@/lib/db';
import { money } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const { from, to } = await searchParams;
  const params: Record<string, unknown> = {};
  let where = `o.status IN ('confirmed','shipped','delivered')`;
  if (from) { where += ' AND DATE(o.created_at) >= :from'; params.from = from; }
  if (to) { where += ' AND DATE(o.created_at) <= :to'; params.to = to; }
  const daily = await query<{ day: string; orders: number; revenue: number }[]>(
    `SELECT DATE(o.created_at) AS day, COUNT(*) AS orders, COALESCE(SUM(o.total),0) AS revenue FROM orders o WHERE ${where} GROUP BY DATE(o.created_at) ORDER BY day DESC LIMIT 60`,
    params
  );
  const top = await query<{ name: string; qty_sold: number; revenue: number }[]>(
    `SELECT oi.name_snapshot AS name, SUM(oi.qty) AS qty_sold, SUM(oi.line_total) AS revenue FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE ${where} GROUP BY oi.name_snapshot ORDER BY qty_sold DESC LIMIT 10`,
    params
  );
  return (
    <>
      <div className="page-head"><div><h2>Sales</h2><p>Confirmed, shipped, and delivered orders.</p></div></div>
      <form>
        <input type="date" name="from" defaultValue={from || ''} />
        <input type="date" name="to" defaultValue={to || ''} />
        <button type="submit">Filter</button>
      </form>
      <table className="admin-table">
        <thead><tr><th>Day</th><th>Orders</th><th>Revenue</th></tr></thead>
        <tbody>{daily.map((row) => <tr key={row.day}><td>{row.day}</td><td>{row.orders}</td><td>{money(Number(row.revenue))}</td></tr>)}</tbody>
      </table>
      <h3 style={{ marginTop: 24 }}>Top products</h3>
      <table className="admin-table">
        <thead><tr><th>Product</th><th>Qty</th><th>Revenue</th></tr></thead>
        <tbody>{top.map((row) => <tr key={row.name}><td>{row.name}</td><td>{row.qty_sold}</td><td>{money(Number(row.revenue))}</td></tr>)}</tbody>
      </table>
    </>
  );
}
