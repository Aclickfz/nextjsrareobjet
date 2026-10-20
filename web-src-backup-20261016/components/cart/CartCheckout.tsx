'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { removeItemAction, updateQtyAction } from '@/actions/cart.actions';
import { placeOrderAction } from '@/actions/order.actions';
import { imgSrc, money } from '@/lib/utils';
import { ActionFeedback, useToast } from '@/components/ui/ToastProvider';
import { ActionForm } from '@/components/ui/ActionForm';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { getURLFromRedirectError } from 'next/dist/client/components/redirect';

type Item = {
  id: number;
  qty: number;
  price: number;
  line_total: number;
  product: { name: string; slug: string; images?: { path: string }[] };
};

export function CartView({ items, subtotal, shipping, total }: { items: Item[]; subtotal: number; shipping: number; total: number }) {
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  return (
    <section className="cart_wrapper">
      <div className="container">
        {!items.length ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <Link href="/products" className="global_btn">Continue shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-panel">
              <div className="cart-items-head">
                <h2>Items</h2>
                <span>{count} {count === 1 ? 'piece' : 'pieces'}</span>
              </div>
              {items.map((item) => (
                <article className="cart-line" key={item.id}>
                  <Link href={`/products/${item.product.slug}`} className="cart-line__media">
                    <img src={imgSrc(item.product.images?.[0]?.path)} alt={item.product.name} />
                  </Link>
                  <div className="cart-line__body">
                    <div className="cart-line__title">
                      <Link href={`/products/${item.product.slug}`}>{item.product.name}</Link>
                      <p>{money(item.price)}</p>
                    </div>
                    <div className="cart-line__actions">
                        <div className="cart-quantity__num">
                          <ActionForm action={updateQtyAction.bind(null, item.id, Math.max(1, item.qty - 1))} success="Cart quantity updated."><button disabled={item.qty <= 1} type="submit" aria-label="Decrease quantity">−</button></ActionForm>
                          <input readOnly value={item.qty} aria-label="Quantity" />
                          <ActionForm action={updateQtyAction.bind(null, item.id, item.qty + 1)} success="Cart quantity updated."><button type="submit" aria-label="Increase quantity">+</button></ActionForm>
                        </div>
                      <ActionForm action={removeItemAction.bind(null, item.id)} success="Item removed from your cart.">
                        <button type="submit" className="cart-remove">Remove</button>
                      </ActionForm>
                    </div>
                  </div>
                  <div className="cart_total"><h6>{money(item.line_total)}</h6></div>
                </article>
              ))}
            </div>
            <aside className="cart-summary">
              <h2>Order summary</h2>
              <dl>
                <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
                <div><dt>Shipping</dt><dd>{money(shipping)}</dd></div>
                <div className="cart-summary__total"><dt>Estimated total</dt><dd>{money(total)}</dd></div>
              </dl>
              <p>Taxes are not added beyond the flat shipping amount.</p>
              <Link href="/checkout" className="cart-checkout">Check out</Link>
              <Link href="/products" className="cart-continue">Continue shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export function CheckoutForm({ total, shipping, subtotal }: { total: number; shipping: number; subtotal: number }) {
  const toast = useToast();
  const [state, action, pending] = useActionState(async (previous: { error?: string } | undefined, data: FormData) => {
    try { return await placeOrderAction(previous, data); }
    catch (error) {
      if (isRedirectError(error)) {
        if (getURLFromRedirectError(error)?.startsWith('/account/orders/')) toast('Your order has been placed.');
        throw error;
      }
      return { error: 'Could not place your order. Please try again.' };
    }
  }, undefined);
  return (
    <section className="payment_wrapper global_section">
      <div className="container">
        <div className="row">
          <div className="col-xl-7 col-lg-6">
            <div className="payment_left">
              <h3>delivery</h3>
              <form id="checkout-form" action={action}>
                <div className="payment_form">
                  <div className="form_input">
                    <div className="field"><label htmlFor="given-name">First Name</label><input id="given-name" name="given-name" autoComplete="given-name" type="text" placeholder="First Name" required /></div>
                    <div className="field"><label htmlFor="family-name">Last Name</label><input id="family-name" name="family-name" autoComplete="family-name" type="text" placeholder="Last Name" required /></div>
                  </div>
                  <div className="form_input">
                    <div className="field"><label htmlFor="address-level2">City</label><input id="address-level2" name="address-level2" autoComplete="address-level2" type="text" placeholder="City" required /></div>
                    <div className="field"><label htmlFor="postal-code">Zip Code</label><input id="postal-code" name="postal-code" autoComplete="postal-code" type="text" placeholder="Zip Code" required /></div>
                  </div>
                  <div className="form_input">
                    <div className="field"><label htmlFor="street-address">Address</label><input id="street-address" name="street-address" autoComplete="street-address" type="text" placeholder="Address" required /></div>
                  </div>
                  <div className="form_input notes">
                    <label htmlFor="order-notes">Order notes (optional)</label>
                    <textarea name="order-notes" id="order-notes" cols={30} rows={4} placeholder="Notes about your order" />
                  </div>
                  <p>Payment method: Cash on delivery</p>
                  <div className="form_input">
                    <button className="global_btn" disabled={pending}>{pending ? 'Placing order...' : 'Place order'}</button>
                  </div>
                  <ActionFeedback state={state} />
                </div>
              </form>
            </div>
          </div>
          <div className="col-xl-5 col-lg-6">
            <div className="payment_right" id="checkout-summary">
              <p>Subtotal {money(subtotal)}</p>
              <p>Shipping {money(shipping)}</p>
              <h6>Total {money(total)}</h6>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
