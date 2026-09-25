'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { currentUser, getSessionId } from '@/lib/auth';
import { getOrCreateCart, loadCart } from '@/repositories/cart.repository';
import { placeOrder } from '@/repositories/order.repository';
import { query } from '@/lib/db';

export async function toggleWishlistAction(productId: number) {
  const user = await currentUser();
  if (!user) redirect('/login');
  const existing = await query<{ id: number }[]>(
    'SELECT id FROM wishlists WHERE user_id = :uid AND product_id = :pid LIMIT 1',
    { uid: user.id, pid: productId }
  );
  if (existing.length) {
    await query('DELETE FROM wishlists WHERE id = :id', { id: existing[0].id });
  } else {
    const products = await query('SELECT id FROM products WHERE id = :id AND is_active = 1 LIMIT 1', { id: productId });
    if (!(products as unknown[]).length) throw new Error('Product unavailable');
    const { getPool } = await import('@/lib/db');
    await getPool().execute('INSERT INTO wishlists (user_id, product_id) VALUES (:uid, :pid)', { uid: user.id, pid: productId });
  }
  revalidatePath('/account/wishlist');
  return { message: existing.length ? 'Removed from your favourites.' : 'Added to your favourites.' };
}

export async function listWishlist() {
  const user = await currentUser();
  if (!user) return [];
  return query(
    `SELECT p.* FROM wishlists w JOIN products p ON p.id = w.product_id WHERE w.user_id = :uid AND p.is_active = 1`,
    { uid: user.id }
  );
}

export async function placeOrderAction(_state: { error?: string } | undefined, formData: FormData) {
  const user = await currentUser();
  if (!user) redirect('/login');
  const given_name = String(formData.get('given-name') || '').trim();
  const family_name = String(formData.get('family-name') || '').trim();
  const city = String(formData.get('address-level2') || '').trim();
  const postal_code = String(formData.get('postal-code') || '').trim();
  const street_address = String(formData.get('street-address') || '').trim();
  const notes = String(formData.get('order-notes') || '').trim();
  if (!given_name || !family_name || !city || !postal_code || !street_address) {
    return { error: 'Please complete the delivery form' };
  }
  const cart = await getOrCreateCart(user.id, await getSessionId());
  const payload = await loadCart(cart.id);
  let order;
  try {
    order = await placeOrder(user.id, cart, payload, { given_name, family_name, city, postal_code, street_address, notes });
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Could not place order' };
  }
  if (!order?.id) return { error: 'Order was saved but could not be opened' };
  redirect(`/account/orders/${order.id}`);
}
