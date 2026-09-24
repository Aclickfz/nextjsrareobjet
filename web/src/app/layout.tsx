import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { HeaderCounts, StoreScripts } from '@/components/layout/StoreScripts';
import { getCart } from '@/actions/cart.actions';
import { currentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Furniture, Lighting & Home Decor | JustAclick',
    template: '%s | JustAclick'
  },
  description: 'Explore JustAclick furniture, lighting, tabletop collections and home decor, with inspiration for your space.',
  openGraph: {
    title: 'Furniture, Lighting & Home Decor | JustAclick',
    description: 'Explore JustAclick furniture, lighting, tabletop collections and home decor, with inspiration for your space.',
    type: 'website',
    siteName: 'JustAclick'
  },
  twitter: { card: 'summary_large_image', title: 'JustAclick', description: 'Furniture, lighting and home decor.' }
};

const styles = [
  '/assets/css/global.css',
  '/assets/css/style.css',
  '/assets/css/sweiper.css',
  '/assets/vendor/bootstrap/bootstrap.min.css',
  '/assets/vendor/boxicons/css/boxicons.min.css',
  '/assets/vendor/slick/slick.css',
  '/assets/vendor/slick/slick-theme.css',
  '/assets/vendor/swiper/swiper-bundle.min.css',
  '/assets/css/design.css',
  '/assets/css/product.css',
  '/assets/css/categories.css',
  '/assets/css/cart.css',
  '/assets/css/payment.css',
  '/assets/css/login.css',
  '/assets/css/about.css',
  '/assets/css/blogs.css',
  '/assets/css/blog_details.css',
  '/assets/css/contract.css',
  '/assets/css/whishlist.css'
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {styles.map((href) => <link key={href} rel="stylesheet" href={href} />)}
        <link rel="icon" href="/assets/images/Logo/favicon/favicon.ico" />
        <meta name="theme-color" content="#303e34" />
      </head>
      <body>{children}</body>
    </html>
  );
}

export async function StoreShell({ children }: { children: React.ReactNode }) {
  let cart = 0;
  let wishlist = 0;
  try {
    cart = (await getCart()).count;
    const user = await currentUser();
    if (user) {
      const rows = await query<{ count: number }[]>('SELECT COUNT(*) AS count FROM wishlists WHERE user_id = :uid', { uid: user.id });
      wishlist = Number(rows[0]?.count || 0);
    }
  } catch {
    cart = 0;
  }
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader cart={cart} wishlist={wishlist} />
      <HeaderCounts cart={cart} wishlist={wishlist} />
      {children}
      <SiteFooter />
      <StoreScripts />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'JustAclick',
            url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'JustAclick',
            url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            potentialAction: {
              '@type': 'SearchAction',
              target: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          })
        }}
      />
    </>
  );
}
