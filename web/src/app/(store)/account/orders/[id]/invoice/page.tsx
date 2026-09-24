import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { loadOrder } from '@/services/order.service';
import { money } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) redirect('/login');
  const { id } = await params;
  const order = await loadOrder(Number(id), user.id, user.role === 'admin').catch(() => null);
  if (!order) redirect('/account/orders');
  const items = order.items as { name_snapshot: string; qty: number; line_total: number }[];
  return (
    <main id="main-content" className="invoice">
      <h1>Invoice {String(order.invoice_number || '')}</h1>
      <p>Order {String(order.order_number)}</p>
      <p>{String(order.given_name)} {String(order.family_name)}</p>
      <ul>
        {items.map((item) => <li key={item.name_snapshot}>{item.name_snapshot} × {item.qty} — {money(item.line_total)}</li>)}
      </ul>
      <p>Shipping {money(Number(order.shipping))}</p>
      <h2>Total {money(Number(order.total))}</h2>
    </main>
  );
}
