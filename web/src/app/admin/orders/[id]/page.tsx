import { ActionForm } from '@/components/ui/ActionForm';
import { notFound } from 'next/navigation';
import { orderStatusAction } from '@/actions/admin.actions';
import { loadOrder } from '@/services/order.service';
import { ALLOWED_TRANSITIONS, money } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await loadOrder(Number(id), null, true);
  if (!order) notFound();
  const next = ALLOWED_TRANSITIONS[String(order.status)] || [];
  const items = order.items as { name_snapshot: string; qty: number; line_total: number }[];
  return (
    <>
      <div className="page-head"><div><h2>{String(order.order_number)}</h2><p>{String(order.customer_name)} · stock deducted: {String(order.stock_deducted)}</p></div><span className="pill">{String(order.status)}</span></div>
      <div className="panel">
        <table className="admin-table">
          <thead><tr><th>Item</th><th>Qty</th><th>Line</th></tr></thead>
          <tbody>{items.map((item) => <tr key={item.name_snapshot}><td>{item.name_snapshot}</td><td>{item.qty}</td><td>{money(item.line_total)}</td></tr>)}</tbody>
        </table>
      </div>
      <p><strong>Total {money(Number(order.total))}</strong> including shipping {money(Number(order.shipping))}</p>
      <div className="order-actions">
      {next.map((status) => (
        <ActionForm key={status} action={orderStatusAction} success="Order status updated.">
          <input type="hidden" name="id" value={String(order.id)} />
          <input type="hidden" name="status" value={status} />
          <button type="submit">Mark {status}</button>
        </ActionForm>
      ))}
      </div>
    </>
  );
}
