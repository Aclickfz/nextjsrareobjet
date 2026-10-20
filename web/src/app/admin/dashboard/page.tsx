import Link from 'next/link';
import { AlertTriangle, Clock, IndianRupee, ShoppingCart, Users } from 'lucide-react';
import { dashboardData } from '@/actions/admin.actions';
import { query } from '@/lib/db';
import { money } from '@/lib/utils';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/admin-ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/admin-ui/table';
import { RevenueChart, type RevenuePoint } from '@/components/admin-shell/RevenueChart';
import { StatCard } from '@/components/admin-shell/StatCard';
import { StatusBadge } from '@/components/admin-shell/StatusBadge';

export const dynamic = 'force-dynamic';

async function revenueSeries(days = 30): Promise<RevenuePoint[]> {
  const rows = await query<{ day: string; revenue: number; orders: number }[]>(
    `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day,
            COALESCE(SUM(CASE WHEN status IN ('confirmed','shipped','delivered') THEN total ELSE 0 END), 0) AS revenue,
            COUNT(*) AS orders
     FROM orders
     WHERE created_at >= CURDATE() - INTERVAL ${days - 1} DAY
     GROUP BY day`
  );
  const byDay = new Map(rows.map((row) => [row.day, row]));
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const row = byDay.get(day);
    return {
      day,
      label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      revenue: Number(row?.revenue || 0),
      orders: Number(row?.orders || 0)
    };
  });
}

export default async function DashboardPage() {
  const [data, series] = await Promise.all([dashboardData(), revenueSeries()]);
  const stats = data.stats || {};
  const orders = data.recentOrders as { id: number; order_number: string; customer_name: string; status: string; total: number }[];
  const low = data.lowStock as { id: number; name: string; sku: string | null; stock_qty: number }[];
  const periodRevenue = series.reduce((sum, point) => sum + point.revenue, 0);
  const periodOrders = series.reduce((sum, point) => sum + point.orders, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Orders, revenue, customers, and stock that need attention.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={<ShoppingCart />} title="Orders" value={Number(stats.orders_total || 0)} hint="All time" />
        <StatCard icon={<Clock />} title="Pending" value={Number(stats.orders_pending || 0)} hint="Awaiting confirmation" />
        <StatCard icon={<IndianRupee />} title="Revenue" value={money(Number(stats.revenue || 0))} hint="Confirmed, shipped & delivered" />
        <StatCard icon={<Users />} title="Customers" value={Number(stats.customers || 0)} hint="Registered accounts" />
        <StatCard icon={<AlertTriangle />} title="Low stock" value={Number(stats.low_stock || 0)} hint="Active products with ≤ 5 units" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales overview</CardTitle>
          <CardDescription>Revenue over the last 30 days · {periodOrders} orders · {money(periodRevenue)}</CardDescription>
          <CardAction><Link href="/admin/reports" className="text-sm font-medium underline-offset-4 hover:underline">View report</Link></CardAction>
        </CardHeader>
        <CardContent><RevenueChart data={series} /></CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="gap-0 py-0 xl:col-span-2">
          <CardHeader className="border-b py-5">
            <CardTitle>Recent orders</CardTitle>
            <CardAction><Link href="/admin/orders" className="text-sm font-medium underline-offset-4 hover:underline">View all</Link></CardAction>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="pl-6">Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="pr-6 text-right"><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 && <TableRow><TableCell colSpan={5} className="text-muted-foreground h-24 text-center">No orders yet.</TableCell></TableRow>}
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="pl-6 font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                  <TableCell className="text-right">{money(Number(order.total))}</TableCell>
                  <TableCell className="pr-6 text-right"><Link href={`/admin/orders/${order.id}`} className="font-medium underline-offset-4 hover:underline">Open</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-5">
            <CardTitle>Low stock</CardTitle>
            <CardAction><Link href="/admin/inventory" className="text-sm font-medium underline-offset-4 hover:underline">Inventory</Link></CardAction>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="pl-6">Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="pr-6 text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {low.length === 0 && <TableRow><TableCell colSpan={3} className="text-muted-foreground h-24 text-center">Everything is well stocked.</TableCell></TableRow>}
              {low.map((product) => (
                <TableRow key={product.id ?? product.name}>
                  <TableCell className="max-w-48 truncate pl-6 font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.sku || '—'}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <span className={product.stock_qty <= 0 ? 'text-destructive font-semibold' : 'font-medium text-amber-600 dark:text-amber-400'}>{product.stock_qty}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
