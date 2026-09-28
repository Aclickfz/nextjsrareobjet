import Link from 'next/link';
import { findOrderForTracking } from '@/repositories/order.repository';
import { money } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const labels: Record<string, string> = {
  pending: 'Order received',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ order?: string; zip?: string }> }) {
  const params = await searchParams;
  const orderNumber = (params.order || '').trim();
  const postalCode = (params.zip || '').trim();
  let result: Record<string, unknown> | null = null;
  let lookedUp = false;
  if (orderNumber && postalCode) {
    lookedUp = true;
    try {
      result = await findOrderForTracking(orderNumber, postalCode);
    } catch {
      result = null;
    }
  }

  return (
    <main id="main-content" className="auth-page" tabIndex={-1}>
      <section className="auth-frame auth-frame--single">
        <div className="auth-panel">
          <Link className="auth-back" href="/">← Back home</Link>
          <div className="auth-panel-body">
          <div className="sign_intro"><span className="sign_eyebrow">ORDER SHIPMENT</span><h1>Track your order</h1><p>Enter the order number from your confirmation and the postal code used at checkout.</p></div>
          <form className="sign_form" action="/track-order" method="get">
            <div className="sign_input"><label htmlFor="order">Order number</label><input id="order" name="order" required defaultValue={orderNumber} /></div>
            <div className="sign_input"><label htmlFor="zip">Postal code</label><input id="zip" name="zip" required defaultValue={postalCode} /></div>
            <button type="submit" className="sign_submit">Track</button>
          </form>
          {lookedUp && !result ? <p className="ui-status" role="status">We could not find an order with those details. Check the order number and postal code.</p> : null}
          {result ? (
            <div className="action-feedback">
              <h2>{String(result.order_number)}</h2>
              <p>Status: {labels[String(result.status)] || String(result.status)}</p>
              <p>Placed: {String(result.created_at || '')}</p>
              <p>Ship to: {String(result.city || '')} {String(result.postal_code || '')}</p>
              <p>Total: {money(Number(result.total || 0))}</p>
              {result.carrier || result.tracking_number ? (
                <p>Shipment: {String(result.carrier || 'Carrier')} {String(result.tracking_number || '')}</p>
              ) : (
                <p>A tracking number will appear here after the order ships.</p>
              )}
            </div>
          ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
