'use client';

import { useState } from 'react';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { addToCartAction } from '@/actions/cart.actions';
import { imgSrc, money } from '@/lib/utils';

type Product = {
  id: number;
  name: string;
  price: number;
  description: string | null;
  stock_qty: number;
  sku: string | null;
  images?: { path: string }[];
};

export function ProductPurchase({ product }: { product: Product }) {
  const images = product.images?.length ? product.images : [{ path: '/assets/images/img2.jpeg' }];
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');

  async function add(buyNow: boolean) {
    try {
      await addToCartAction(product.id, qty, buyNow);
      if (!buyNow) setMessage('Added to cart');
    } catch (error) {
      if (isRedirectError(error)) throw error;
      setMessage(error instanceof Error ? error.message : 'Could not add to cart');
    }
  }

  return (
    <section className="purchasing_wrapper global_section">
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="purchasing_wrapper__left">
              <div className="purchasing_img">
                <div className="purchasing_small__img">
                  {images.map((image, index) => (
                    <div className="vertical_img" key={image.path + index}>
                      <button type="button" aria-label={`View product image ${index + 1}`} aria-pressed={index === active} onClick={() => setActive(index)}>
                        <img src={imgSrc(image.path)} className="img-fluid" alt={`${product.name} view ${index + 1}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="purchasing_big__img">
                  <img id="imgBox" src={imgSrc(images[active]?.path)} className="img-fluid example-1 image" alt={product.name} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="purchasing_wrapper__content product_content">
              <h1>{product.name}</h1>
              <p className="price">{money(product.price)}</p>
              {product.sku ? <p>SKU: {product.sku}</p> : null}
              {product.description ? <p>{product.description}</p> : null}
              <p>{product.stock_qty > 0 ? `${product.stock_qty} in stock` : 'Out of stock'}</p>
              <div className="purchase_type">
                <div className="purchase_type__select">
                  <h6>quantity:</h6>
                  <div className="purchase--input">
                    <div className="purchase-quantity">
                      <button type="button" className="quantity-button" aria-label="Decrease quantity" onClick={() => setQty((value) => Math.max(1, value - 1))}>−</button>
                      <input type="number" min={1} max={99} value={qty} aria-label="Quantity" onChange={(event) => setQty(Math.min(99, Math.max(1, Number(event.target.value) || 1)))} />
                      <button type="button" className="quantity-button" aria-label="Increase quantity" onClick={() => setQty((value) => Math.min(99, value + 1))}>+</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-now">
                <button type="button" className="global_btn" onClick={() => add(false)}><i className="bx bxs-shopping-bag" /> add to cart</button>
                <button type="button" className="global_btn" onClick={() => add(true)}><i className="bx bxs-cart-alt" /> buy now</button>
              </div>
              {message ? <p className="ui-status" role="status">{message}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
