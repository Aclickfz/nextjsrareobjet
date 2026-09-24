import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductExtras } from '@/components/product/ProductExtras';
import { ProductPurchase } from '@/components/product/ProductPurchase';
import { getProduct } from '@/services/product.service';
import { imgSrc } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProduct(slug);
    if (!product) return { title: 'Product' };
    const image = imgSrc(product.images?.[0]?.path);
    const description = product.description || product.name;
    return {
      title: product.name,
      description,
      alternates: { canonical: `/products/${product.slug}` },
      openGraph: { title: product.name, description, images: [image], type: 'website' },
      twitter: { card: 'summary_large_image', title: product.name, description, images: [image] }
    };
  } catch {
    return { title: 'Product' };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let product = null;
  try {
    product = await getProduct(slug);
  } catch {
    product = null;
  }
  if (!product || !product.is_active) notFound();
  const image = imgSrc(product.images?.[0]?.path);
  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products/${product.slug}`;
  return (
    <main id="main-content" tabIndex={-1}>
      <ProductPurchase product={product} />
      <ProductExtras />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description || product.name,
            sku: product.sku || undefined,
            image,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'INR',
              price: Number(product.price),
              availability: product.stock_qty > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' },
              { '@type': 'ListItem', position: 2, name: product.category_name || 'Shop', item: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products` },
              { '@type': 'ListItem', position: 3, name: product.name, item: url }
            ]
          })
        }}
      />
    </main>
  );
}
