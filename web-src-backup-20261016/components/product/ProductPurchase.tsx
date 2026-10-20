'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { addToCartAction } from '@/actions/cart.actions';
import { imgSrc, money } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastProvider';
import { WishlistButton } from './WishlistButton';
import { rememberRecent } from './RecentsList';
import type { normalizePdp } from '@/lib/product-pdp';

type Product = {
  id: number;
  slug?: string;
  name: string;
  price: number;
  compare_at_price?: number | null;
  description: string | null;
  stock_qty: number;
  sku: string | null;
  badge?: string | null;
  grade_label?: string | null;
  category_name?: string | null;
  category_slug?: string | null;
  images?: { path: string }[];
  pdp?: ReturnType<typeof normalizePdp>;
};

function priceLabel(product: Product) {
  const min = Number(product.price);
  const max = product.pdp?.price_max != null ? Number(product.pdp.price_max) : null;
  if (max != null && max > min) return `${money(min)} – ${money(max)}`;
  return money(min);
}

export function ProductPurchase({ product }: { product: Product }) {
  const pdp = product.pdp;
  const images = product.images?.length ? product.images : [{ path: '/assets/images/img2.jpeg' }];
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [openGroup, setOpenGroup] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [openPanel, setOpenPanel] = useState<'details' | 'dimensions' | null>('details');
  const toast = useToast();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    rememberRecent({
      id: product.id,
      name: product.name,
      slug: product.slug || '',
      price: Number(product.price),
      image: images[0]?.path
    });
  }, [product.id]);

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const group of pdp?.option_groups || []) {
      if (group.options[0]) next[group.name] = group.options[0].name;
    }
    setSelected(next);
  }, [product.id]);

  const caption = useMemo(() => {
    if (!pdp?.option_groups?.length) return pdp?.shown_caption || null;
    const picks = Object.values(selected).filter(Boolean);
    if (!picks.length) return pdp.shown_caption || null;
    return `Shown in ${picks.join(' with ')}.`;
  }, [selected, pdp?.shown_caption, pdp?.option_groups]);

  const compare = product.compare_at_price ? Number(product.compare_at_price) : 0;
  const onSale = compare > Number(product.price);

  async function add(buyNow: boolean) {
    if (pending) return;
    setPending(true);
    try {
      const result = await addToCartAction(product.id, qty, buyNow);
      if (!buyNow) {
        if (result.alreadyAdded) toast('Already added to cart. Use + or - in your cart to change the quantity.', 'info');
        else toast('Added to your cart.');
      }
    } catch (error) {
      if (isRedirectError(error)) throw error;
      toast('Could not add this item. Check the available quantity and try again.', 'error');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="purchasing_wrapper global_section shop-pdp">
      <div className="container">
        <nav className="shop-crumb" aria-label="Breadcrumb">
          {product.category_slug ? (
            <Link href={`/categories/${product.category_slug}`}>{`< ${product.category_name}`}</Link>
          ) : (
            <Link href="/products">{'< Shop'}</Link>
          )}
        </nav>
        <div className="row shop-pdp__layout">
          <div className="col-lg-7">
            <div className="purchasing_wrapper__left">
              <div className="purchasing_img">
                <div className="purchasing_small__img">
                  {images.map((image, index) => (
                    <div className={`vertical_img${index === active ? ' is-active' : ''}`} key={image.path + index}>
                      <button type="button" aria-label={`View product image ${index + 1}`} aria-pressed={index === active} onClick={() => setActive(index)}>
                        <img src={imgSrc(image.path)} className="img-fluid" alt={`${product.name} view ${index + 1}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="purchasing_big__img">
                  <WishlistButton productId={product.id} />
                  <img id="imgBox" src={imgSrc(images[active]?.path)} className="img-fluid example-1 image" alt={product.name} />
                  {caption ? <p className="shop-pdp__caption">{caption}</p> : null}
                </div>
              </div>

              {pdp?.ask_prompts?.length ? (
                <div className="shop-pdp__ask">
                  <div className="shop-pdp__ask-head">
                    <strong>Ask Otto</strong>
                    <i className="bx bxs-magic-wand" aria-hidden="true" />
                  </div>
                  <div className="shop-pdp__ask-chips">
                    {pdp.ask_prompts.map((prompt) => (
                      <button type="button" key={prompt} onClick={() => toast(prompt, 'info')}>
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="purchasing_wrapper__content product_content shop-pdp__buy">
              {product.grade_label ? <p className="shop-pdp__badge">{product.grade_label}</p> : null}
              {product.badge ? <p className="shop-pdp__badge shop-pdp__badge--soft">{product.badge}</p> : null}
              <h1>{product.name}</h1>
              <p className="price">
                {onSale ? <s>{money(compare)}</s> : null}
                {priceLabel(product)}
              </p>
              {pdp?.free_shipping ? <p className="shop-pdp__ship">Free Shipping</p> : null}

              {(pdp?.option_groups || []).length ? (
                <div className="shop-pdp__options">
                  <div className="shop-pdp__options-head">
                    <h6>Select Options</h6>
                    <button type="button" onClick={() => {
                      const next: Record<string, string> = {};
                      for (const group of pdp?.option_groups || []) {
                        if (group.options[0]) next[group.name] = group.options[0].name;
                      }
                      setSelected(next);
                    }}>
                      Clear Options
                    </button>
                  </div>
                  {pdp!.option_groups.map((group, index) => (
                    <div className="shop-pdp__option-group" key={group.name}>
                      <button type="button" className="shop-pdp__option-toggle" aria-expanded={openGroup === index} onClick={() => setOpenGroup(openGroup === index ? -1 : index)}>
                        <span>{group.name}</span>
                        <span>{group.options.length} Options</span>
                        <i className={`bx ${openGroup === index ? 'bx-chevron-up' : 'bx-chevron-down'}`} aria-hidden="true" />
                      </button>
                      {openGroup === index ? (
                        <div className="purchase_type__input shop-pdp__swatches">
                          {group.options.map((option) => {
                            const checked = selected[group.name] === option.name;
                            return (
                              <label key={option.name} className={checked ? 'active-btn' : ''}>
                                <input
                                  type="radio"
                                  name={group.name}
                                  checked={checked}
                                  onChange={() => setSelected((prev) => ({ ...prev, [group.name]: option.name }))}
                                />
                                {option.image ? <img src={imgSrc(option.image)} alt="" /> : null}
                                {option.hex && !option.image ? <span className="shop-pdp__swatch-color" style={{ background: option.hex }} /> : null}
                                <em>{option.name}</em>
                              </label>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="purchase_type">
                <div className="purchase_type__select shop-pdp__qty-row">
                  <h6>quantity:</h6>
                  <div className="purchase--input">
                    <div className="purchase-quantity">
                      <button type="button" className="quantity-button" aria-label="Decrease quantity" onClick={() => setQty((value) => Math.max(1, value - 1))}>−</button>
                      <input type="number" min={1} max={99} value={qty} aria-label="Quantity" onChange={(event) => setQty(Math.min(99, Math.max(1, Number(event.target.value) || 1)))} />
                      <button type="button" className="quantity-button" aria-label="Increase quantity" onClick={() => setQty((value) => Math.min(99, value + 1))}>+</button>
                    </div>
                  </div>
                  <p className="price">{priceLabel(product)}</p>
                </div>
              </div>

              <div className="order-now" data-react-action="true">
                <button type="button" className="global_btn" disabled={pending || product.stock_qty < 1} onClick={() => add(false)}>
                  {pending ? 'Adding...' : 'Add to cart'}
                </button>
                <button type="button" className="global_btn shop-pdp__secondary" disabled={pending || product.stock_qty < 1} onClick={() => add(true)}>
                  Buy now
                </button>
              </div>

              <div className="shop-pdp__accordion">
                <button type="button" className="shop-pdp__acc-head" aria-expanded={openPanel === 'details'} onClick={() => setOpenPanel(openPanel === 'details' ? null : 'details')}>
                  <span>Product Details</span>
                  <i className={`bx ${openPanel === 'details' ? 'bx-chevron-up' : 'bx-chevron-down'}`} aria-hidden="true" />
                </button>
                {openPanel === 'details' ? (
                  <div className="shop-pdp__acc-body">
                    {product.description ? <p>{product.description}</p> : null}
                    {(pdp?.details_sections || []).map((section) => (
                      <div key={section.title}>
                        <h3>{section.title}</h3>
                        <ul>
                          {section.items.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : null}

                <button type="button" className="shop-pdp__acc-head" aria-expanded={openPanel === 'dimensions'} onClick={() => setOpenPanel(openPanel === 'dimensions' ? null : 'dimensions')}>
                  <span>Dimensions</span>
                  <i className={`bx ${openPanel === 'dimensions' ? 'bx-chevron-up' : 'bx-chevron-down'}`} aria-hidden="true" />
                </button>
                {openPanel === 'dimensions' ? (
                  <div className="shop-pdp__acc-body">
                    <div className="shop-pdp__dims">
                      {(pdp?.dimensions || []).map((row) => (
                        <div key={row.label}>
                          <strong>{row.label}</strong>
                          <span>{row.value}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/contact" className="shop-pdp__measure"><i className="bx bx-ruler" aria-hidden="true" /> How to Measure For Delivery</Link>
                  </div>
                ) : null}
              </div>

              {(pdp?.still_deciding || []).length ? (
                <div className="shop-pdp__deciding">
                  <h3>Still Deciding?</h3>
                  <ul>
                    {pdp!.still_deciding.map((item) => (
                      <li key={item.label}>
                        <Link href={item.href}>
                          <i className={`bx ${item.icon || 'bx-link'}`} aria-hidden="true" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
