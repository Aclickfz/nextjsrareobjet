import Link from 'next/link';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/auth';
import { listWishlist } from '@/actions/order.actions';
import { money } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
  const user = await currentUser();
  if (!user) redirect('/login');
  const items = (await listWishlist().catch(() => [])) as { id: number; name: string; slug: string; price: number }[];
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="whishlist_content global_section">
        <div className="container">
          <div className="whishlist_header__left"><p>{items.length} {items.length === 1 ? 'item' : 'items'}</p></div>
          {items.map((item) => (
            <div className="whishlist-box" key={item.id}>
              <Link href={`/products/${item.slug}`}>{item.name}</Link>
              <span>{money(Number(item.price))}</span>
            </div>
          ))}
          {!items.length ? <p>Your favourites list is empty.</p> : null}
        </div>
      </section>
    </main>
  );
}
