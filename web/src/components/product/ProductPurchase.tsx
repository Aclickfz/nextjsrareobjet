'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { addToCartAction } from '@/actions/cart.actions';
import { imgSrc, money } from '@/lib/utils';
import { useToast } from '@/components/ui/ToastProvider';
import { WishlistButton } from './WishlistButton';
import { ProductImageViewer } from './ProductImageViewer';
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

function priceMeta(product: Product) {
  const min = Number(product.price);
  const max = product.pdp?.price_max != null ? Number(product.pdp.price_max) : null;
  const compare = product.compare_at_price ? Number(product.compare_at_price) : 0;
  const highs = [max, compare].filter((value): value is number => value != null && value > min);
  const highest = highs.length ? Math.max(...highs) : null;
  const onSale = highest != null;
  const savePct = onSale ? Math.round(((highest - min) / highest) * 100) : 0;
  return { min, highest, onSale, savePct };
}

function looksLikeLabel(text: string) {
  return text.length > 0 && text.length <= 48 && !/[.!?]$/.test(text) && (text.match(/,/g) || []).length < 2;
}

function productTypeRows(text: string, defaultLabel = 'Product Type') {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const colon = line.indexOf(':');
      if (colon > 0 && colon < 40) return { label: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim() };
      return { label: '', value: line };
    });
  if (defaultLabel && lines.length === 1 && !lines[0].label) {
    return [{ label: defaultLabel, value: lines[0].value }];
  }
  if (lines.length > 1 && lines.every((row) => !row.label)) {
    if (looksLikeLabel(lines[0].value)) {
      return [{ label: lines[0].value, value: lines.slice(1).map((row) => row.value).join(' ') }];
    }
    if (defaultLabel) {
      return [{ label: defaultLabel, value: lines.map((row) => row.value).join(' ') }];
    }
  }
  return lines.map((row) => (row.label || !defaultLabel ? row : { label: defaultLabel, value: row.value }));
}

/** Details section → heading + description blocks (same pattern as Product Story). */
function detailSectionBlocks(section: { title: string; items: string[] }) {
  const rows = productTypeRows(section.items.join('\n'), '');
  const title = (section.title || '').trim();
  if (title && rows.length && rows.every((row) => !row.label)) {
    return [{ heading: title, body: rows.map((row) => row.value).join('\n\n') }];
  }
  return rows.map((row) => ({
    heading: row.label || title || 'Details',
    body: row.value
  }));
}

function ProductStoryDetails({
  story,
  productType
}: {
  story: string;
  productType: string;
}) {
  if (!story && !productType) return null;
  const typeRows = productType ? productTypeRows(productType) : [];

  return (
    <div className="shop-pdp__story-card is-open">
      {story ? (
        <article className="shop-pdp__story-block">
          <span className="shop-pdp__story-label">Product Story</span>
          <p className="shop-pdp__details-copy">{story}</p>
        </article>
      ) : null}

      {typeRows.length ? (
        <div className="shop-pdp__story-extra is-open">
          {typeRows.map((row, index) => (
            <article key={index} className={`shop-pdp__story-block${story || index > 0 ? ' shop-pdp__story-block--type' : ''}`}>
              <span className="shop-pdp__story-label">{row.label || 'Product Type'}</span>
              <p className="shop-pdp__details-copy">{row.value}</p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ProductPurchase({ product }: { product: Product }) {
  const pdp = product.pdp;
  const images = product.images?.length ? product.images : [{ path: '/assets/images/img2.jpeg' }];
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [openPanel, setOpenPanel] = useState<'description' | 'details' | 'dimensions' | null>(null);
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const orderNowRef = useRef<HTMLDivElement>(null);
  const productStory = (pdp?.product_story || '').trim();
  const productType = (product.description || '').trim();
  const detailSections = (pdp?.details_sections || []).filter((section) => section.items?.length);
  const pricing = priceMeta(product);
  const tags = [product.grade_label, product.badge].filter(Boolean) as string[];
  const stockOut = product.stock_qty < 1;

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
    const el = orderNowRef.current;
    if (!el) return;
    let inView = true;
    const mq = window.matchMedia('(max-width: 991px)');
    const sync = () => setShowStickyCta(mq.matches && !inView);
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0, rootMargin: '0px' }
    );
    io.observe(el);
    mq.addEventListener('change', sync);
    sync();
    return () => {
      io.disconnect();
      mq.removeEventListener('change', sync);
    };
  }, []);

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
    <section className={`purchasing_wrapper global_section shop-pdp${showStickyCta ? ' shop-pdp--sticky-cta' : ''}`}>
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
              <div className="purchasing_img shop-pdp__gallery">
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
                  <ProductImageViewer images={images} active={active} onChange={setActive} name={product.name} />
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
              <header className="shop-pdp__header">
                {tags.length ? (
                  <div className="shop-pdp__tags" aria-label="Product labels">
                    {tags.map((tag) => (
                      <span key={tag} className="shop-pdp__tag">{tag}</span>
                    ))}
                  </div>
                ) : null}
                <h1 className="shop-pdp__title">{product.name}</h1>
                <div className="shop-pdp__price-row">
                  <p className={`shop-pdp__price${pricing.onSale ? ' is-sale' : ''}`}>
                    {pricing.onSale && pricing.highest != null ? (
                      <s className="shop-pdp__compare">{money(pricing.highest)}</s>
                    ) : null}
                    <span className="shop-pdp__current">{money(pricing.min)}</span>
                  </p>
                  {pricing.onSale && pricing.savePct > 0 ? (
                    <span className="shop-pdp__save">Save {pricing.savePct}%</span>
                  ) : null}
                </div>
                {pdp?.free_shipping ? (
                  <p className="shop-pdp__ship">
                    <i className="bx bx-package" aria-hidden="true" />
                    <span>Free Shipping</span>
                  </p>
                ) : null}
              </header>

              <div className="purchase_type">
                <div className="purchase_type__select shop-pdp__qty-row">
                  <h6>Quantity</h6>
                  <div className="purchase--input">
                    <div className="purchase-quantity">
                      <button type="button" className="quantity-button" aria-label="Decrease quantity" onClick={() => setQty((value) => Math.max(1, value - 1))}>−</button>
                      <input type="number" min={1} max={99} value={qty} aria-label="Quantity" onChange={(event) => setQty(Math.min(99, Math.max(1, Number(event.target.value) || 1)))} />
                      <button type="button" className="quantity-button" aria-label="Increase quantity" onClick={() => setQty((value) => Math.min(99, value + 1))}>+</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-now" data-react-action="true" ref={orderNowRef}>
                <button type="button" className="global_btn" disabled={pending || stockOut} onClick={() => add(false)}>
                  {pending ? 'Adding...' : 'Add to cart'}
                </button>
                <button type="button" className="global_btn shop-pdp__secondary" disabled={pending || stockOut} onClick={() => add(true)}>
                  Buy now
                </button>
              </div>

              <div className="shop-pdp__accordion">
                {productStory || productType ? (
                  <>
                    <button type="button" className="shop-pdp__acc-head" aria-expanded={openPanel === 'description'} onClick={() => setOpenPanel(openPanel === 'description' ? null : 'description')}>
                      <span>Product Description</span>
                      <i className={`bx ${openPanel === 'description' ? 'bx-chevron-up' : 'bx-chevron-down'}`} aria-hidden="true" />
                    </button>
                    {openPanel === 'description' ? (
                      <div className="shop-pdp__acc-body">
                        <ProductStoryDetails story={productStory} productType={productType} />
                      </div>
                    ) : null}
                  </>
                ) : null}

                <button type="button" className="shop-pdp__acc-head" aria-expanded={openPanel === 'details'} onClick={() => setOpenPanel(openPanel === 'details' ? null : 'details')}>
                  <span>Product Details</span>
                  <i className={`bx ${openPanel === 'details' ? 'bx-chevron-up' : 'bx-chevron-down'}`} aria-hidden="true" />
                </button>
                {openPanel === 'details' ? (
                  <div className="shop-pdp__acc-body">
                    {detailSections.length ? (
                      <div className="shop-pdp__specs">
                        {detailSections.map((section) => (
                          <div key={section.title} className="shop-pdp__details-section">
                            {detailSectionBlocks(section).map((block, index) => (
                              <article key={`${block.heading}-${index}`} className="shop-pdp__story-block">
                                <span className="shop-pdp__story-label">{block.heading}</span>
                                <p className="shop-pdp__details-copy">{block.body}</p>
                              </article>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : null}
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

      <div className={`shop-pdp__sticky-cta${showStickyCta ? ' is-visible' : ''}`} aria-hidden={!showStickyCta}>
        <div className="shop-pdp__sticky-cta-price">
          <span className="shop-pdp__sticky-cta-label">{product.name}</span>
          <strong>{money(pricing.min)}</strong>
        </div>
        <div className="shop-pdp__sticky-cta-actions">
          <button type="button" className="global_btn" disabled={pending || stockOut || !showStickyCta} onClick={() => add(false)}>
            {pending ? 'Adding...' : 'Add to cart'}
          </button>
          <button type="button" className="global_btn shop-pdp__secondary" disabled={pending || stockOut || !showStickyCta} onClick={() => add(true)}>
            Buy now
          </button>
        </div>
      </div>
    </section>
  );
}
