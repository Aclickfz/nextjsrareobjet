import { redirect } from 'next/navigation';
import { PrintInvoiceButton } from '@/components/account/PrintInvoiceButton';
import { currentUser } from '@/lib/auth';
import { loadOrder } from '@/services/order.service';
import { imgSrc, money } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) redirect('/login');
  const { id } = await params;
  const order = await loadOrder(Number(id), user.id, user.role === 'admin').catch(() => null);
  if (!order) redirect('/account/orders');

  const items = order.items;
  const invoiceNo = String(order.invoice_number || `INV-${String(order.id).padStart(6, '0')}`);
  const issued = order.issued_at ? new Date(String(order.issued_at)).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : '';
  const paymentMethod = String(order.payment_method || 'cod').toLowerCase() === 'cod'
    ? 'Cash on Delivery (COD)'
    : String(order.payment_method || 'Payment').toUpperCase();
  const paymentStatus = String(order.payment_status || '').toLowerCase() === 'paid'
    ? 'Paid'
    : String(order.payment_status || '').toLowerCase() === 'refunded'
      ? 'Refunded'
      : 'Payment pending';

  return (
    <main id="main-content" className="order-invoice" tabIndex={-1}>
      <div className="order-invoice__sheet">
        <header className="order-invoice__brand">
          <div>
            <p className="order-invoice__eyebrow">Tax invoice / order receipt</p>
            <h1>Rare Objet</h1>
          </div>
          <div className="order-invoice__actions">
            <a href={`/account/orders/${order.id}`}>Back to order</a>
            <PrintInvoiceButton />
          </div>
        </header>

        <section className="order-invoice__meta">
          <div>
            <span>Order number</span>
            <strong>{order.order_number}</strong>
          </div>
          <div>
            <span>Invoice</span>
            <strong>{invoiceNo}</strong>
          </div>
          <div>
            <span>Date</span>
            <strong>{issued || '—'}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong className="order-invoice__caps">{order.status}</strong>
          </div>
        </section>

        <section className="order-invoice__grid">
          <article>
            <h2>Shipping details</h2>
            <p>
              <strong>{order.given_name} {order.family_name}</strong><br />
              {order.street_address}<br />
              {order.city} {order.postal_code}
              {order.customer_phone ? <><br />{order.customer_phone}</> : null}
              {order.notes ? <><br /><em>Note: {order.notes}</em></> : null}
            </p>
          </article>
          <article>
            <h2>Payment details</h2>
            <p>
              <strong>{paymentMethod}</strong><br />
              Status: {paymentStatus}<br />
              Amount: <strong>{money(Number(order.total))}</strong>
            </p>
          </article>
        </section>

        <section className="order-invoice__items">
          <h2>Items ordered</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Qty</th>
                <th scope="col">Price</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.product_id}-${item.name_snapshot}`}>
                  <td>
                    <div className="order-invoice__product">
                      <img src={imgSrc(item.image)} alt="" />
                      <span>{item.name_snapshot}</span>
                    </div>
                  </td>
                  <td>{item.qty}</td>
                  <td>{money(item.price_snapshot)}</td>
                  <td>{money(item.line_total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="order-invoice__totals">
          <div>
            <span>Subtotal</span>
            <strong>{money(Number(order.subtotal))}</strong>
          </div>
          <div>
            <span>Shipping</span>
            <strong>{money(Number(order.shipping))}</strong>
          </div>
          <div className="order-invoice__grand">
            <span>Grand total</span>
            <strong>{money(Number(order.total))}</strong>
          </div>
        </section>

        <p className="order-invoice__footnote">
          Thank you for shopping with Rare Objet. Keep this invoice for your records.
        </p>
      </div>
    </main>
  );
}
