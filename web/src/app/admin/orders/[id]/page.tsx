import { AdminInput } from '@/components/admin/AdminControls';
import { AdminButton } from '@/components/admin/AdminForm';
import { AdminActionForm as ActionForm } from '@/components/admin/AdminForm';
import { notFound } from 'next/navigation';
import { orderStatusAction, saveTrackingAction } from '@/actions/admin.actions';
import { ensureOrderTrackingColumns } from '@/repositories/order.repository';
import { loadOrder } from '@/services/order.service';
import { ALLOWED_TRANSITIONS, money } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await ensureOrderTrackingColumns();
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
      <div className="panel">
        <h3>Shipment tracking</h3>
        <ActionForm className="admin-form" action={saveTrackingAction} success="Tracking saved.">
          <AdminInput type="hidden" name="id" value={String(order.id)} />
          <label>Carrier<AdminInput name="carrier" defaultValue={String((order as { carrier?: string }).carrier || '')} placeholder="Delhivery, BlueDart" /></label>
          <label>Tracking number<AdminInput name="tracking_number" defaultValue={String((order as { tracking_number?: string }).tracking_number || '')} /></label>
          <AdminButton type="submit">Save tracking</AdminButton>
        </ActionForm>
        <p>Customers look this up on Track order with the order number and postal code {String(order.postal_code || '')}.</p>
      </div>
      <div className="order-actions">
      {next.map((status) => (
        <ActionForm key={status} action={orderStatusAction} success="Order status updated.">
          <AdminInput type="hidden" name="id" value={String(order.id)} />
          <AdminInput type="hidden" name="status" value={status} />
          <AdminButton type="submit">Mark {status}</AdminButton>
        </ActionForm>
      ))}
      </div>
    </>
  );
}
