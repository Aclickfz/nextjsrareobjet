import { BarChart3, Boxes, FolderTree, LayoutDashboard, Package, PackagePlus, ShoppingCart, Users, type LucideIcon } from 'lucide-react';

export type AdminNavItem = { label: string; href: string; icon: LucideIcon; exact?: boolean };
export type AdminNavGroup = { label: string; items: AdminNavItem[] };

export const adminNav: AdminNavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Sales', href: '/admin/reports', icon: BarChart3 }
    ]
  },
  {
    label: 'Catalog',
    items: [
      { label: 'Categories', href: '/admin/categories', icon: FolderTree },
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Add product', href: '/admin/products/new', icon: PackagePlus, exact: true },
      { label: 'Inventory', href: '/admin/inventory', icon: Boxes }
    ]
  },
  {
    label: 'Shop flow',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
      { label: 'Customers', href: '/admin/customers', icon: Users }
    ]
  }
];

export function isNavActive(item: AdminNavItem, pathname: string) {
  if (item.href === '/admin/products') return pathname === item.href || /^\/admin\/products\/\d+/.test(pathname);
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
