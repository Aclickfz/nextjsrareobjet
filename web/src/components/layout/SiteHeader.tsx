import { navigationCategories, STORE_NAV } from '@/repositories/catalog.repository';
import { imgSrc } from '@/lib/utils';
export async function SiteHeader({ cart = 0, wishlist = 0 }: { cart?: number; wishlist?: number }) {
  const categories = await navigationCategories().catch(() => []);
  const children = (id: number) => categories.filter(c => c.parent_id === id);
  return (
    <>
<header className="myNav">
        <div className="container-fluid">
            <div className="myNav_content active">
                <div className="mob-icon">
                    <button type="button" className="menu_icon" aria-label="Open menu">
                        <i className='bx bx-menu'></i>
                    </button>
                    <button type="button" className="search-icon" aria-label="Open search">
                        <i className='bx bx-search'></i>
                    </button>
                </div>

                <div className="search">
                    <form className="search-field" role="search" action="/search" method="get">
                        <input type="search" name="q" aria-label="Search products" placeholder="Search" className="" />
                        <button type="submit" aria-label="Search products" className="">
                            <i className='bx bx-search'></i>
                        </button>
                    </form>
                </div>

                <div className="search--input">
                    <form className="search--input-box" role="search" action="/search" method="get">
                        <input type="search" name="q" aria-label="Search products" placeholder="Search here..." />
                        <button type="submit" aria-label="Search products"><i className='bx bx-search'></i></button>
                    </form>
                </div>

                <div className="logo">
                    <a href="/" aria-label="Go to home page" className="">
                        <img src="/assets/images/Logo/Logo1.svg" className="" alt="JustAclick" />
                    </a>
                </div>

                <div className="menu">
                    <ul className="">
                        <li><a href="/login" className=""><i className='bx bx-user-circle text-lg'></i>account</a></li>
                        <li><a href="/track-order" className=""><img src="/assets/images/cart.svg" className="" alt="cart" /> track order</a></li>
                        <li><a href="/recents" className=""><img src="/assets/images/recents.png" className="" alt="recents" />recents</a></li>
                        <li className="cart-no"><a href="/favorites" className=""><img src="/assets/images/favorites.png" className="" alt="recents" />favorites</a><span className="">({wishlist})</span></li>
                        <li className="cart-no"><a href="/cart" className=""><img src="/assets/images/cartnew.png" className="" alt="cart" />cart</a><span className="">({cart})</span></li>
                    </ul>
                </div>

                <div className="menu_mob">
                    <div className="user">
                        <a href="/login" aria-label="Your account"><i className='bx bx-user-circle text-[26px]'></i></a>
                    </div>
                    <div className="cart">
                        <a href="/cart" aria-label="Your cart" className="">
                            <i className='bx bx-cart text-[26px]'></i>
                            <span className="">({cart})</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <nav className="bottom-menu" aria-label="Main navigation">
            <ul>{STORE_NAV.map(top => {
              const root = categories.find(c => c.slug === top.slug);
              const groups = root ? children(root.id) : [];
              const featured = groups.find(group => group.image);
              return <li className="dropmenu" key={top.slug}><a href={'/categories/' + top.slug}>{top.name}</a>
                {groups.length > 0 && <div className="dropmenu_list catalog-mega-menu"><div className="catalog-menu-columns">
                  {groups.map(group => <div className="menu_coloumn" key={group.id}><div className="menu_list">
                    <h6><a href={'/categories/' + group.slug}>{group.name} &rsaquo;</a></h6>
                    {children(group.id).map(sub => <div key={sub.id}><a href={'/categories/' + sub.slug}>{sub.name}</a>{children(sub.id).map(child => <a className="catalog-child-link" key={child.id} href={'/categories/' + child.slug}>{child.name}</a>)}</div>)}
                  </div></div>)}
                </div>{featured && <aside className="catalog-menu-feature"><a href={'/categories/' + featured.slug}><img src={imgSrc(featured.image)} alt={featured.name} /><span>Explore {featured.name} &rsaquo;</span></a></aside>}</div>}
              </li>;
            })}</ul>
        </nav>
        <div className="offer">
            <div className="container">
                <div className="offer_info">
                    <p>Free Shipping on 1000s of Items <a href="/categories/furniture">shop now ›</a></p>
                    <p>The Halloween Shop <a href="#"> Selling Scary Fast ›</a></p>
                    <p>In-Stock Furniture <a href="#"> Delivered in 1-5 Weeks ›</a></p>
                </div>
            </div>
        </div>


        <div className="mobile_nav" aria-hidden="true">
            <div className="mobile_nav__content">
                <div className="mobile_header">
                    <div className="mobile_brand">
                        <a href="/" aria-label="Go to home page">
                            <img src="/assets/images/Logo/Logo1.svg" alt="JustAclick" className="img-fluid" />
                        </a>
                    </div>
                    <button type="button" className="close-icon" aria-label="Close menu">
                        <i className='bx bx-x'></i>
                    </button>
                </div>
                <div className="mobile_search">
                    <form className="mobile_search_box" role="search" action="/search" method="get">
                        <button type="submit" aria-label="Search"><i className="bx bx-search" aria-hidden="true"></i></button>
                        <input type="search" name="q" aria-label="Search products" placeholder="Search" />
                    </form>
                </div>
                <nav className="mobile_menu" aria-label="Mobile navigation"><ul>{STORE_NAV.map(top => {
 const root = categories.find(c => c.slug === top.slug);
 return <li key={top.slug}><a href={'/categories/' + top.slug}>{top.name}</a>{root && children(root.id).map(group => <details key={group.id}><summary>{group.name}</summary><a href={'/categories/' + group.slug}>Shop all {group.name}</a>{children(group.id).map(sub => <details key={sub.id} style={{padding:'8px 24px'}}><summary>{sub.name}</summary><a href={'/categories/' + sub.slug}>Shop all {sub.name}</a>{children(sub.id).map(child => <a key={child.id} href={'/categories/' + child.slug} style={{display:'block',padding:'8px 16px'}}>{child.name}</a>)}</details>)}</details>)}</li>;
})}<li><a href="/products">Shop all products</a></li><li><a href="/contact">Contact us</a></li></ul></nav>
 </div></div></header></>);
}
