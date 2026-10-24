import { navigationCategories, STORE_NAV } from '@/repositories/catalog.repository';
import { currentUser } from '@/lib/auth';
import { StoreNavigation } from './StoreNavigation';

export async function SiteHeader({ cart = 0, wishlist = 0 }: { cart?: number; wishlist?: number }) {
  const [categories, user] = await Promise.all([
    navigationCategories().catch(() => []),
    currentUser(),
  ]);
  return <StoreNavigation categories={categories} navigation={[...STORE_NAV]} cart={cart} wishlist={wishlist} user={user ? { name: user.name, role: user.role } : null} />;
}
