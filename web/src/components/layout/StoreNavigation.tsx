'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, Heart, ShoppingBag, UserRound, ChevronDown, ArrowUpRight, Truck, History } from 'lucide-react';
import type { CategoryNode } from '@/lib/catalog-tree';
import { imgSrc } from '@/lib/utils';
import { logoutAction } from '@/actions/auth.actions';
import { searchSuggestions } from '@/actions/search.actions';
import styles from './StoreNavigation.module.css';

type Props = { categories: CategoryNode[]; navigation: { name: string; slug: string }[]; cart: number; wishlist: number; user: { name: string; role: string } | null };

function ProductSearch() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [results, setResults] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [active, setActive] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  useEffect(() => {
    let cancelled = false;
    if (q.trim().length < 2) return;
    const timer = setTimeout(async () => {
      try {
        const data = await searchSuggestions(q);
        if (!cancelled) { setResults(data.products); setStatus(data.error ? 'Suggestions unavailable. Press Enter to search.' : data.products.length ? '' : 'No matching products. Try another search.'); }
      } catch { if (!cancelled) setStatus('Suggestions unavailable. Press Enter to search.'); }
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [q]);
  const visible = open && q.trim().length >= 2;
  return <div className={styles.search} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <form action="/search" role="search" onSubmit={event => {
      setOpen(false);
      if (active >= 0 && results[active]) { event.preventDefault(); router.push(`/products/${results[active].slug}`); }
    }}>
      <button type="submit" aria-label="Search products"><Search size={20} /></button>
      <input ref={input} type="search" name="q" maxLength={100} placeholder="Search" aria-label="Search products" role="combobox" aria-autocomplete="list" aria-expanded={visible} aria-controls="header-search-results" aria-activedescendant={visible && active >= 0 ? `header-result-${active}` : undefined} autoComplete="off" value={q} onFocus={() => setOpen(true)} onChange={event => { setQ(event.target.value); setOpen(true); setResults([]); setActive(-1); setStatus('Searching…'); }} onKeyDown={event => {
        if (event.key === 'Escape') { setOpen(false); setActive(-1); }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); setActive(index => results.length ? (index + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length : -1); }
      }} />
      {q && <button type="button" aria-label="Clear search" onClick={() => { setQ(''); setResults([]); setActive(-1); input.current?.focus(); }}><X size={17} /></button>}
    </form>
    {visible && <div className={styles.suggestions}>
      <p role="status">{status || 'Suggested products'}</p>
      <ul role="listbox" id="header-search-results" aria-label="Suggested products">{results.map((item, index) => <li key={item.id} role="option" id={`header-result-${index}`} aria-selected={active === index}><Link className={active === index ? styles.selected : ''} href={`/products/${item.slug}`} onClick={() => setOpen(false)}>{item.name}<ArrowUpRight size={15} /></Link></li>)}</ul>
      <Link className={styles.allResults} href={`/search?q=${encodeURIComponent(q)}`} onClick={() => setOpen(false)}>View all results <ArrowUpRight size={15} /></Link>
    </div>}
  </div>;
}

export function StoreNavigation({ categories, navigation, cart, wishlist, user }: Props) {
  const [menu, setMenu] = useState<string | null>(null);
  const header = useRef<HTMLElement>(null);
  const drawer = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const orderedNavigation = navigation;
  const inspirationLinks = [
    ...['halloween', 'thanksgiving', 'christmas'].flatMap(slug => {
      const category = categories.find(item => item.slug === slug);
      return category ? [{ name: category.name, href: '/categories/' + category.slug }] : [];
    }),
  ];
  const children = (id: number) => categories.filter(category => category.parent_id === id);
  const closeDrawer = () => drawer.current?.close();
  useEffect(() => {
    const dismiss = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setMenu(null); };
    document.addEventListener('pointerdown', dismiss);
    const media = window.matchMedia('(min-width: 1200px)');
    media.addEventListener('change', closeDrawer);
    return () => { document.removeEventListener('pointerdown', dismiss); media.removeEventListener('change', closeDrawer); };
  }, []);
  useEffect(() => {
    const dialog = drawer.current;
    const lock = () => { document.body.style.overflow = 'hidden'; };
    const unlock = () => { document.body.style.overflow = ''; opener.current?.focus(); };
    dialog?.addEventListener('close', unlock);
    opener.current?.addEventListener('click', lock);
    const button = opener.current;
    return () => { dialog?.removeEventListener('close', unlock); button?.removeEventListener('click', lock); document.body.style.overflow = ''; };
  }, []);
  const categoryLink = (category: { slug: string; name: string }) => <Link href={`/categories/${category.slug}`} aria-current={pathname === `/categories/${category.slug}` ? 'page' : undefined} onClick={() => { setMenu(null); closeDrawer(); }}>{category.name}</Link>;
  const mobileBranch = (category: CategoryNode, depth = 0): React.ReactNode => {
    const nested = depth < 4 ? children(category.id) : [];
    return nested.length ? <details key={category.id}><summary>{category.name}<ChevronDown size={16} /></summary><div className={styles.subcategories}>{categoryLink({ ...category, name: `Shop all ${category.name}` })}{nested.map(child => mobileBranch(child, depth + 1))}</div></details> : <div key={category.id}>{categoryLink(category)}</div>;
  };
  return <header ref={header} className={styles.header} onClick={event => { if ((event.target as HTMLElement).closest("a")) setMenu(null); }} onKeyDown={event => {
    if (event.key === 'Escape' && menu) { header.current?.querySelector<HTMLButtonElement>(`[data-menu="${menu}"]`)?.focus(); setMenu(null); }
  }}>
    <div className={styles.main}>
      <button ref={opener} className={`${styles.iconButton} ${styles.hamburger}`} type="button" aria-label="Open navigation menu" aria-haspopup="dialog" aria-controls="store-navigation-drawer" onClick={() => drawer.current?.showModal()}><Menu /></button>
      <Link href="/" className={styles.logo} aria-label="JustAclick home"><img src="/assets/images/Logo/Logo1.svg" alt="JustAclick" width={166} height={50} /></Link>
      <ProductSearch />
      <div className={styles.actions}>
        <div className={styles.account} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setMenu(current => current === 'account' ? null : current); }}>
          <button className={styles.iconButton} data-menu="account" type="button" aria-label="Account options" aria-expanded={menu === 'account'} aria-controls="header-account" onClick={() => setMenu(menu === 'account' ? null : 'account')}><UserRound /><span>Account</span></button>
          {menu === 'account' && <div id="header-account" className={styles.accountPanel}><strong>{user ? `Hello, ${user.name.split(' ')[0]}` : 'Welcome to JustAclick'}</strong>{user ? <><Link href="/account/profile">My profile</Link><Link href="/account/orders">My orders</Link>{user.role === 'admin' && <Link href="/admin/dashboard">Admin dashboard</Link>}<form action={logoutAction}><button type="submit">Sign out</button></form></> : <><Link href="/login">Sign in</Link><Link href="/register">Create an account</Link></>}<Link href="/track-order">Track an order</Link><Link href="/recents">Recently viewed</Link></div>}
        </div>
        <Link href="/track-order" className={`${styles.iconButton} ${styles.desktopAction}`}><Truck /><span>Track Order</span></Link>
        <Link href="/recents" className={`${styles.iconButton} ${styles.desktopAction}`}><History /><span>Recents</span></Link>
        <Link href="/favorites" className={styles.iconButton} aria-label={`Favourites, ${wishlist} items`}><span className={styles.iconWrap}><Heart /><b aria-live="polite">{wishlist > 99 ? '99+' : wishlist}</b></span><span className={styles.actionLabel}>Favorites</span></Link>
        <Link href="/cart" className={styles.iconButton} aria-label={`Shopping bag, ${cart} items`}><span className={styles.iconWrap}><ShoppingBag /><b aria-live="polite">{cart > 99 ? '99+' : cart}</b></span><span className={styles.actionLabel}>Cart ({cart})</span></Link>
      </div>
    </div>
    {inspirationLinks.length > 0 && <nav className={styles.inspiration} aria-label="Seasonal collections">{inspirationLinks.map(link => <Link key={link.href} href={link.href}>{link.name}</Link>)}</nav>}
    <nav className={styles.navigation} aria-label="Main navigation" onMouseLeave={() => setMenu(current => current === 'account' ? current : null)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setMenu(current => current === 'account' ? current : null); }}>
      <ul>{orderedNavigation.map(top => {
        const root = categories.find(category => category.slug === top.slug);
        const groups = root ? children(root.id) : [];
        const featured = groups.find(group => group.image);
        return <li key={top.slug} onMouseEnter={() => setMenu(groups.length ? top.slug : null)}><div className={styles.navItem}>{categoryLink(top)}{groups.length > 0 && <button type="button" data-menu={top.slug} aria-label={`${top.name} categories`} aria-expanded={menu === top.slug} aria-controls={`header-menu-${top.slug}`} onClick={() => setMenu(menu === top.slug ? null : top.slug)}><ChevronDown size={12} /></button>}</div>
          {groups.length > 0 && menu === top.slug && <div id={`header-menu-${top.slug}`} className={styles.mega}><div className={styles.megaHeading}>{categoryLink({ ...top, name: `Explore all ${top.name}` })}<ArrowUpRight size={18} /></div><div className={styles.megaBody}><div className={styles.columns}>{groups.map(group => <section key={group.id}><h3>{categoryLink(group)}</h3>{children(group.id).map(sub => <div key={sub.id}>{categoryLink(sub)}{children(sub.id).map(child => <div className={styles.child} key={child.id}>{categoryLink(child)}</div>)}</div>)}</section>)}</div>{featured && <Link className={styles.feature} href={`/categories/${featured.slug}`} onClick={() => setMenu(null)}><img src={imgSrc(featured.image)} alt={featured.name} /><span>Discover {featured.name} <ArrowUpRight size={16} /></span></Link>}</div></div>}
        </li>;
      })}</ul>
    </nav>
    <dialog ref={drawer} id="store-navigation-drawer" aria-labelledby="store-drawer-title" className={styles.drawer} onClick={event => { if (event.target === event.currentTarget) closeDrawer(); }}>
      <div className={styles.drawerContent}><div className={styles.drawerHeading}><span id="store-drawer-title">Explore JustAclick</span><button type="button" className={styles.iconButton} aria-label="Close navigation menu" autoFocus onClick={closeDrawer}><X /></button></div>
        <nav aria-label="Mobile navigation" className={styles.mobileNav}>{orderedNavigation.map(top => { const root = categories.find(category => category.slug === top.slug); return root ? mobileBranch(root) : <div key={top.slug}>{categoryLink(top)}</div>; })}<div><Link href="/products" onClick={closeDrawer}>Shop all products <ArrowUpRight size={16} /></Link></div></nav>
        <nav className={styles.drawerUtility} aria-label="Shopping help">{[{ href: user ? '/account/profile' : '/login', name: user ? 'My account' : 'Sign in / Register' }, { href: '/track-order', name: 'Track order' }, { href: '/recents', name: 'Recently viewed' }, { href: '/contact', name: 'Contact us' }].map(link => <Link key={link.href} href={link.href} onClick={closeDrawer}>{link.name}</Link>)}</nav>
      </div>
    </dialog>
  </header>;
}
