'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';
import { currentUser, getSessionId } from '@/lib/auth';
import { addCartItem, getOrCreateCart, loadCart, removeCartItem, updateCartItem } from '@/repositories/cart.repository';

async function cartContext(createSid: boolean) {
  const user = await currentUser();
  let sessionId = await getSessionId();
  if (!user && !sessionId) {
    if (!createSid) throw new Error('Cart session missing');
    sessionId = randomBytes(24).toString('hex');
    const jar = await cookies();
    jar.set('sid', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
      path: '/',
      maxAge: 30 * 24 * 60 * 60
    });
  }
  return getOrCreateCart(user?.id || null, sessionId);
}

export async function getCart() {
  try {
    const cart = await cartContext(false);
    return await loadCart(cart.id);
  } catch {
    return { items: [], count: 0, subtotal: 0, shipping: 0, total: 0 };
  }
}

export async function addToCartAction(productId: number, qty: number, buyNow = false) {
  const cart = await cartContext(true);
  await addCartItem(cart.id, productId, Math.max(1, qty));
  revalidatePath('/cart');
  if (buyNow) redirect('/checkout');
}

export async function updateQtyAction(itemId: number, qty: number) {
  const cart = await cartContext(true);
  await updateCartItem(cart.id, itemId, Math.max(1, qty));
  revalidatePath('/cart');
}

export async function removeItemAction(itemId: number) {
  const cart = await cartContext(true);
  await removeCartItem(cart.id, itemId);
  revalidatePath('/cart');
}
