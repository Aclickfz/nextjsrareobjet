import Link from 'next/link';
import { imgSrc, money } from '@/lib/utils';

type Related = {
  id: number;
  name: string;
  slug: string;
  price: number;
  images?: { path: string }[];
};

export function ProductExtras({ products = [] }: { products?: Related[] }) {
  if (!products.length) return null;
  return (
    <section className="global_section elements_wrapper">
      <div className="container-fluid">
        <div className="elements_wrapper__content">
          <div className="main_heading">
            <h3>You may also like</h3>
          </div>
          <div className="row">
            {products.map((product) => (
              <div className="col-xl-3 col-md-4 col-6" key={product.id}>
                <Link href={`/products/${product.slug}`} className="shop-related">
                  <img decoding="async" loading="lazy" src={imgSrc(product.images?.[0]?.path)} className="img-fluid" alt={product.name} />
                  <span>{product.name}</span>
                  <strong>{money(product.price)}</strong>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
