'use client';

import { useState } from 'react';
import { toggleWishlistAction } from '@/actions/order.actions';

export function WishlistButton({ productId }: { productId: number }) {
  const [message, setMessage] = useState('');
  return (
    <>
      <button
        type="button"
        className="catalog-heart heart"
        aria-label="Save to favourites"
        onClick={async () => {
          try {
            await toggleWishlistAction(productId);
            setMessage('Saved');
          } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Could not save');
          }
        }}
      >
        <i className="bx bx-heart" aria-hidden="true" />
      </button>
      {message ? <span className="ui-status">{message}</span> : null}
    </>
  );
}
