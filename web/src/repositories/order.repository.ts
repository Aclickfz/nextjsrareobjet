import type { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { getPool, query } from '@/lib/db';
import { canTransition, invoiceNumber, nextPaymentStatus, orderNumber } from '@/lib/utils';
import { clearCart, loadCart } from './cart.repository';

type CartPayload = Awaited<ReturnType<typeof loadCart>>;

export async function loadOrder(orderId: number, userId: number | null, isAdmin: boolean): Promise<{
  id: number;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  payment_status: string;
  stock_deducted: number;
  order_number: string;
  customer_name?: string;
  given_name?: string;
  family_name?: string;
  street_address?: string;
  city?: string;
  postal_code?: string;
  invoice_number?: string;
  items: { product_id: number; qty: number; name_snapshot: string; price_snapshot: number; line_total: number; image?: string }[];
} | null> {
  if (!isAdmin && !userId) return null;
  const params: Record<string, unknown> = { id: orderId };
  let sql = `SELECT o.*, u.name AS customer_name, u.email AS customer_email, u.phone AS customer_phone,
      inv.invoice_number, inv.issued_at
    FROM orders o
    JOIN users u ON u.id = o.user_id
    LEFT JOIN invoices inv ON inv.order_id = o.id
    WHERE o.id = :id`;
  if (!isAdmin && userId) {
    sql += ' AND o.user_id = :uid';
    params.uid = userId;
  }
  sql += ' LIMIT 1';
  const rows = await query<Record<string, unknown>[]>(sql, params);
  if (!rows.length) return null;
  const items = await query<Record<string, unknown>[]>(
    `SELECT oi.*,
      (SELECT path FROM product_images pi WHERE pi.product_id = oi.product_id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) AS image
     FROM order_items oi WHERE oi.order_id = :id`,
    { id: orderId }
  );
  const order = rows[0];
  return {
    ...order,
    id: Number(order.id),
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    total: Number(order.total),
    status: String(order.status),
    payment_status: String(order.payment_status),
    stock_deducted: Number(order.stock_deducted),
    order_number: String(order.order_number),
    items: items.map((item) => ({
      ...item,
      product_id: Number(item.product_id),
      qty: Number(item.qty),
      name_snapshot: String(item.name_snapshot),
      price_snapshot: Number(item.price_snapshot),
      line_total: Number(item.line_total),
      image: item.image ? String(item.image) : undefined
    }))
  };
}

export async function placeOrder(userId: number, cart: { id: number }, payload: CartPayload, address: {
  given_name: string;
  family_name: string;
  city: string;
  postal_code: string;
  street_address: string;
  notes: string;
}) {
  if (!payload.items.length) throw new Error('Cart is empty');
  for (const item of payload.items) {
    if (!item.product?.is_active) throw new Error(`${item.product?.name || 'Item'} is unavailable`);
    if (item.qty > item.product.stock_qty) throw new Error(`Only ${item.product.stock_qty} left for ${item.product.name}`);
  }
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const number = orderNumber();
    const [orderResult] = await conn.execute<ResultSetHeader>(
      `INSERT INTO orders
        (order_number, user_id, status, payment_method, payment_status, subtotal, shipping, total,
         given_name, family_name, city, postal_code, street_address, notes, stock_deducted)
       VALUES
        (:order_number, :user_id, 'pending', 'cod', 'unpaid', :subtotal, :shipping, :total,
         :given_name, :family_name, :city, :postal_code, :street_address, :notes, 0)`,
      {
        order_number: number,
        user_id: userId,
        subtotal: payload.subtotal,
        shipping: payload.shipping,
        total: payload.total,
        ...address
      }
    );
    const orderId = orderResult.insertId;
    for (const item of payload.items) {
      await conn.execute(
        `INSERT INTO order_items (order_id, product_id, name_snapshot, price_snapshot, qty, line_total)
         VALUES (:order_id, :product_id, :name_snapshot, :price_snapshot, :qty, :line_total)`,
        {
          order_id: orderId,
          product_id: item.product_id,
          name_snapshot: item.product.name,
          price_snapshot: item.price,
          qty: item.qty,
          line_total: item.line_total
        }
      );
    }
    await conn.execute('INSERT INTO invoices (order_id, invoice_number) VALUES (:order_id, :invoice_number)', {
      order_id: orderId,
      invoice_number: invoiceNumber(orderId)
    });
    await clearCart(cart.id, conn);
    await conn.commit();
    return loadOrder(orderId, userId, false);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function adjustStock(conn: PoolConnection, productId: number, changeQty: number, reason: string, refId: number, userId: number, note: string) {
  await conn.execute('UPDATE products SET stock_qty = stock_qty + :change WHERE id = :id', { change: changeQty, id: productId });
  await conn.execute(
    `INSERT INTO inventory_logs (product_id, change_qty, reason, ref_id, created_by, note)
     VALUES (:product_id, :change_qty, :reason, :ref_id, :created_by, :note)`,
    { product_id: productId, change_qty: changeQty, reason, ref_id: refId, created_by: userId, note }
  );
}

export async function updateOrderStatus(orderId: number, nextStatus: string, adminId: number, markPaid?: boolean) {
  const order = await loadOrder(orderId, null, true);
  if (!order) throw new Error('Order not found');
  if (!canTransition(String(order.status), nextStatus)) {
    throw new Error(`Cannot move from ${order.status} to ${nextStatus}`);
  }
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    if (nextStatus === 'confirmed' && !order.stock_deducted) {
      for (const item of order.items as { product_id: number; qty: number; name_snapshot: string }[]) {
        if (!item.product_id) continue;
        const [locked] = await conn.execute(
          'SELECT id, stock_qty, name FROM products WHERE id = :id FOR UPDATE',
          { id: item.product_id }
        );
        const product = (locked as { stock_qty: number }[])[0];
        if (!product || product.stock_qty < item.qty) throw new Error(`Insufficient stock for ${item.name_snapshot}`);
        await adjustStock(conn, item.product_id, -item.qty, 'order', orderId, adminId, `Order ${order.order_number}`);
      }
      await conn.execute('UPDATE orders SET stock_deducted = 1 WHERE id = :id', { id: orderId });
    }
    if (nextStatus === 'cancelled' && order.stock_deducted) {
      for (const item of order.items as { product_id: number; qty: number }[]) {
        if (!item.product_id) continue;
        await adjustStock(conn, item.product_id, item.qty, 'cancel', orderId, adminId, `Cancel ${order.order_number}`);
      }
      await conn.execute('UPDATE orders SET stock_deducted = 0 WHERE id = :id', { id: orderId });
    }
    const paymentStatus = nextPaymentStatus(String(order.payment_status), nextStatus, markPaid);
    await conn.execute('UPDATE orders SET status = :status, payment_status = :payment_status WHERE id = :id', {
      status: nextStatus,
      payment_status: paymentStatus,
      id: orderId
    });
    await conn.commit();
    return loadOrder(orderId, null, true);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export async function listMyOrders(userId: number) {
  return query(
    `SELECT o.id, o.order_number, o.status, o.total, o.created_at, inv.invoice_number
     FROM orders o LEFT JOIN invoices inv ON inv.order_id = o.id
     WHERE o.user_id = :uid ORDER BY o.created_at DESC`,
    { uid: userId }
  );
}
