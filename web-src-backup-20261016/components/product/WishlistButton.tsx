'use client';

import { useState } from 'react';
import { toggleWishlistAction } from '@/actions/order.actions';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { useToast } from '@/components/ui/ToastProvider';

export function WishlistButton({ productId }: { productId: number }) {
  const [pending, setPending] = useState(false);
  const toast = useToast();
  return (
    <>
      <button
        type="button"
        data-react-action="true"
        className="catalog-heart heart"
        aria-label="Save to favourites"
        disabled={pending}
        onClick={async () => {
          if (pending) return;
          setPending(true);
          try {
            const result = await toggleWishlistAction(productId);
            toast(result.message);
          } catch (error) {
            if (isRedirectError(error)) { toast('Sign in to save your favourites.', 'info'); throw error; }
            toast('Could not update your favourites. Please try again.', 'error');
          } finally { setPending(false); }
        }}
      >
        <i className="bx bx-heart" aria-hidden="true" />
      </button>
    </>
  );
}
