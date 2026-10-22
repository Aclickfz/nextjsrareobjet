'use client';

import { useState } from 'react';
import Link from 'next/link';
import { money } from '@/lib/utils';

export type AccountOrder = { id: number; order_number: string; status: string; total: number; placed: string; invoice_number: string | null };
const statuses: Record<string, { label: string; description: string; icon: string }> = {
  pending: { label: 'Pending', description: 'Your order is awaiting confirmation.', icon: 'bx-time-five' },
  confirmed: { label: 'Confirmed', description: 'Your order has been confirmed.', icon: 'bx-check-circle' },
  shipped: { label: 'Shipped', description: 'Your order is on its way.', icon: 'bx-package' },
  delivered: { label: 'Delivered', description: 'A little more home, delivered.', icon: 'bx-check-double' },
  cancelled: { label: 'Cancelled', description: 'This order has been cancelled.', icon: 'bx-x-circle' }
};
const filters = ['All orders', 'In progress', 'Delivered', 'Cancelled'] as const;

export function OrdersList({ orders }: { orders: AccountOrder[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All orders');
  const matches = (order: AccountOrder, category: string) => category === 'All orders' || (category === 'In progress' ? ['pending', 'confirmed', 'shipped'].includes(order.status) : order.status === category.toLowerCase());
  const visible = orders.filter(order => matches(order, filter));
  return <>
    <div className="orders-filters" role="group" aria-label="Filter orders">
      {filters.map(item => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}<span>{orders.filter(order => matches(order, item)).length}</span></button>)}
    </div>
    <p className="orders-result-count" role="status">{visible.length} {visible.length === 1 ? 'order' : 'orders'}{filter !== 'All orders' ? ` · ${filter.toLowerCase()}` : ''}</p>
    {visible.length ? <div className="orders-list">{visible.map(order => {
      const status = statuses[order.status] || { label: order.status, description: 'View your order for the latest details.', icon: 'bx-receipt' };
      return <article className="account-order" key={order.id}>
        <div className="account-order-top"><div><span className="account-label">ORDER NUMBER</span><h2>{order.order_number}</h2></div><span className={`order-badge order-badge--${statuses[order.status] ? order.status : 'pending'}`}><span aria-hidden="true" />{status.label}</span></div>
        <div className="account-order-body"><div className="order-status-icon" aria-hidden="true"><i className={`bx ${status.icon}`} /></div><div className="order-status-copy"><strong>{status.description}</strong><p>Placed {order.placed}</p></div><div className="order-total"><span className="account-label">ORDER TOTAL</span><strong>{money(order.total)}</strong></div></div>
        <div className="account-order-bottom"><span><i className="bx bx-lock-alt" aria-hidden="true" /> Your order, all in one place</span><div>{order.invoice_number ? <Link className="order-invoice" href={`/account/orders/${order.id}/invoice`}>View invoice</Link> : null}<Link className="order-details" href={`/account/orders/${order.id}`} aria-label={`View order ${order.order_number}`}>View order <span aria-hidden="true">↗</span></Link></div></div>
      </article>;
    })}</div> : <div className="orders-empty"><span className="orders-empty-icon" aria-hidden="true"><i className="bx bx-shopping-bag" /></span><span className="account-label">ROOM FOR SOMETHING SPECIAL</span><h2>{orders.length ? 'Nothing here just yet.' : 'Your story starts here.'}</h2><p>{orders.length ? 'No orders match this filter. Choose another view to see your orders.' : 'Find a piece you love. Once you place an order, you can follow its journey right here.'}</p>{orders.length ? <button type="button" className="account-primary" onClick={() => setFilter('All orders')}>View all orders</button> : <Link className="account-primary" href="/products">Explore the collection <span aria-hidden="true">↗</span></Link>}</div>}
  </>;
}
