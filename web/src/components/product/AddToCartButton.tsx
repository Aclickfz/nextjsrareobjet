'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addToCartAction } from '@/actions/cart.actions';
import { useToast } from '@/components/ui/ToastProvider';

export function AddToCartButton({ productId, productName, stockQty }: {
  productId: number;
  productName: string;
  stockQty: number;
}) {
  const [pending, setPending] = useState(false);
  const adding = useRef(false);
  const router = useRouter();
  const toast = useToast();
  const unavailable = stockQty < 1;

  async function add() {
    if (adding.current || unavailable) return;
    adding.current = true;
    setPending(true);
    try {
      const result = await addToCartAction(productId, 1);
      if (result.alreadyAdded) toast('Already added to cart. Use + or - in your cart to change the quantity.', 'info');
      else toast('Added to your cart. Size: Small.');
      router.refresh();
    } catch {
      toast('Could not add this item. Check the available quantity and try again.', 'error');
    } finally {
      adding.current = false;
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      className="catalog-add-cart"
      data-react-action="true"
      disabled={pending || unavailable}
      aria-busy={pending}
      aria-label={unavailable ? `${productName} is out of stock` : `Add ${productName}, size Small, to cart`}
      onClick={add}
    >
      <i className="bx bx-cart-add" aria-hidden="true" />
      {unavailable ? 'Out of stock' : pending ? 'Adding...' : 'Add to cart'}
    </button>
  );
}
