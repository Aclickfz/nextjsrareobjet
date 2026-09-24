import type { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { getPool, query } from '@/lib/db';
import { shippingFlat } from '@/lib/utils';
import { attachImages } from './catalog.repository';

export async function getOrCreateCart(userId: number | null, sessionId: string) {
  if (userId) {
    const rows = await query<{ id: number; user_id: number | null; session_id: string | null }[]>(
      'SELECT * FROM carts WHERE user_id = :uid LIMIT 1',
      { uid: userId }
    );
    if (rows.length) return rows[0];
    const [result] = await getPool().execute<ResultSetHeader>('INSERT INTO carts (user_id) VALUES (:uid)', { uid: userId });
    return { id: result.insertId, user_id: userId, session_id: null };
  }
  const rows = await query<{ id: number; user_id: number | null; session_id: string | null }[]>(
    'SELECT * FROM carts WHERE session_id = :sid LIMIT 1',
    { sid: sessionId }
  );
  if (rows.length) return rows[0];
  const [result] = await getPool().execute<ResultSetHeader>('INSERT INTO carts (session_id) VALUES (:sid)', { sid: sessionId });
  return { id: result.insertId, user_id: null, session_id: sessionId };
}

export async function loadCart(cartId: number) {
  const items = await query<
    { id: number; qty: number; product_id: number; name: string; slug: string; price: number; stock_qty: number; is_active: number }[]
  >(
    `SELECT ci.id, ci.qty, ci.product_id, p.name, p.slug, p.price, p.stock_qty, p.is_active
     FROM cart_items ci JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = :cartId ORDER BY ci.id DESC`,
    { cartId }
  );
  const withImages = await attachImages(
    items.map((item) => ({
      id: item.product_id,
      name: item.name,
      slug: item.slug,
      price: Number(item.price),
      stock_qty: item.stock_qty,
      is_active: item.is_active
    }))
  );
  const byId = Object.fromEntries(withImages.map((product) => [product.id, product]));
  let subtotal = 0;
  let count = 0;
  const mapped = items.map((item) => {
    const price = Number(item.price);
    const line_total = price * item.qty;
    subtotal += line_total;
    count += item.qty;
    return { id: item.id, product_id: item.product_id, qty: item.qty, price, line_total, product: byId[item.product_id] };
  });
  const shipping = shippingFlat(mapped.length);
  return { items: mapped, count, subtotal, shipping, total: subtotal + shipping };
}

export async function addCartItem(cartId: number, productId: number, qty: number) {
  const products = await query<{ id: number; stock_qty: number; is_active: number }[]>(
    'SELECT id, stock_qty, is_active FROM products WHERE id = :id LIMIT 1',
    { id: productId }
  );
  const product = products[0];
  if (!product || !product.is_active) throw new Error('Product unavailable');
  const existing = await query<{ id: number; qty: number }[]>(
    'SELECT id, qty FROM cart_items WHERE cart_id = :cartId AND product_id = :pid LIMIT 1',
    { cartId, pid: productId }
  );
  const nextQty = (existing[0]?.qty || 0) + qty;
  if (nextQty > product.stock_qty) throw new Error(`Only ${product.stock_qty} left`);
  if (existing.length) {
    await getPool().execute('UPDATE cart_items SET qty = :qty WHERE id = :id', { qty: nextQty, id: existing[0].id });
  } else {
    await getPool().execute('INSERT INTO cart_items (cart_id, product_id, qty) VALUES (:cartId, :pid, :qty)', {
      cartId,
      pid: productId,
      qty
    });
  }
}

export async function updateCartItem(cartId: number, itemId: number, qty: number) {
  const rows = await query<{ id: number; stock_qty: number }[]>(
    `SELECT ci.id, p.stock_qty FROM cart_items ci JOIN products p ON p.id = ci.product_id
     WHERE ci.id = :id AND ci.cart_id = :cartId LIMIT 1`,
    { id: itemId, cartId }
  );
  if (!rows.length) throw new Error('Item not found');
  if (qty > rows[0].stock_qty) throw new Error(`Only ${rows[0].stock_qty} left`);
  await getPool().execute('UPDATE cart_items SET qty = :qty WHERE id = :id', { qty, id: itemId });
}

export async function removeCartItem(cartId: number, itemId: number) {
  await getPool().execute('DELETE FROM cart_items WHERE id = :id AND cart_id = :cartId', { id: itemId, cartId });
}

export async function clearCart(cartId: number, conn?: PoolConnection) {
  const runner = conn || getPool();
  await runner.execute('DELETE FROM cart_items WHERE cart_id = :cartId', { cartId });
}

export async function mergeGuestCart(userId: number, sessionId: string) {
  if (!sessionId) return;
  const guest = await query<{ id: number }[]>('SELECT id FROM carts WHERE session_id = :sid LIMIT 1', { sid: sessionId });
  if (!guest.length) return;
  const userCart = await query<{ id: number }[]>('SELECT id FROM carts WHERE user_id = :uid LIMIT 1', { uid: userId });
  let userCartId = userCart[0]?.id;
  if (!userCartId) {
    const [created] = await getPool().execute<ResultSetHeader>('INSERT INTO carts (user_id) VALUES (:uid)', { uid: userId });
    userCartId = created.insertId;
  }
  const items = await query<{ product_id: number; qty: number }[]>(
    'SELECT product_id, qty FROM cart_items WHERE cart_id = :id',
    { id: guest[0].id }
  );
  for (const item of items) {
    const existing = await query<{ id: number; qty: number }[]>(
      'SELECT id, qty FROM cart_items WHERE cart_id = :cid AND product_id = :pid LIMIT 1',
      { cid: userCartId, pid: item.product_id }
    );
    if (existing.length) {
      await getPool().execute('UPDATE cart_items SET qty = :qty WHERE id = :id', {
        qty: existing[0].qty + item.qty,
        id: existing[0].id
      });
    } else {
      await getPool().execute('INSERT INTO cart_items (cart_id, product_id, qty) VALUES (:cid, :pid, :qty)', {
        cid: userCartId,
        pid: item.product_id,
        qty: item.qty
      });
    }
  }
  await getPool().execute('DELETE FROM cart_items WHERE cart_id = :id', { id: guest[0].id });
  await getPool().execute('DELETE FROM carts WHERE id = :id', { id: guest[0].id });
}
