export function SiteHeader({ cart = 0, wishlist = 0 }: { cart?: number; wishlist?: number }) {
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
            <ul>
<li className="dropmenu">
                    <a href="/categories/furniture">Furniture</a>
                    <div className="dropmenu_list">
                        <div className="dropmenu_list__flex">
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <h6> <a href="/categories/furniture">In-Stock & Quick Ship Furniture <i
                                                className='bx bx-chevron-right'></i></a></h6>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/furniture">shop all furniture</a>
                                    <a href="/categories/furniture">new & featured</a>
                                    <a href="/categories/furniture">living room furniture</a>
                                    <a href="/categories/furniture">bedroom furniture</a>
                                    <a href="/categories/furniture">dining & kitchen furniture</a>
                                    <a href="/categories/furniture">storage and modaltas furniture</a>
                                    <a href="/categories/furniture">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/furniture">shop all furniture</a>
                                    <a href="/categories/furniture">new & featured</a>
                                    <a href="/categories/furniture">living room furniture</a>
                                    <a href="/categories/furniture">bedroom furniture</a>
                                    <a href="/categories/furniture">dining & kitchen furniture</a>
                                    <a href="/categories/furniture">storage and modaltas furniture</a>
                                    <a href="/categories/furniture">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/furniture">shop all furniture</a>
                                    <a href="/categories/furniture">new & featured</a>
                                    <a href="/categories/furniture">living room furniture</a>
                                    <a href="/categories/furniture">bedroom furniture</a>
                                    <a href="/categories/furniture">dining & kitchen furniture</a>
                                    <a href="/categories/furniture">storage and modaltas furniture</a>
                                    <a href="/categories/furniture">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/furniture">shop all furniture</a>
                                    <a href="/categories/furniture">new & featured</a>
                                    <a href="/categories/furniture">living room furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/furniture">shop all furniture</a>
                                    <a href="/categories/furniture">new & featured</a>
                                    <a href="/categories/furniture">living room furniture</a>
                                </div>

                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <a href="/categories/furniture">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/furniture">shop all furniture</a>
                                    <a href="/categories/furniture">new & featured</a>
                                    <a href="/categories/furniture">living room furniture</a>
                                    <a href="/categories/furniture">bedroom furniture</a>
                                    <a href="/categories/furniture">dining & kitchen furniture</a>
                                    <a href="/categories/furniture">storage and modaltas furniture</a>
                                    <a href="/categories/furniture">best selling furniture</a>
                                </div>
                                <div className="menu_heading">
                                    <a href="/categories/furniture">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/furniture">shop all furniture</a>
                                    <a href="/categories/furniture">new & featured</a>
                                    <a href="/categories/furniture">living room furniture</a>
                                    <a href="/categories/furniture">bedroom furniture</a>
                                    <a href="/categories/furniture">dining & kitchen furniture</a>
                                    <a href="/categories/furniture">storage and modaltas furniture</a>
                                    <a href="/categories/furniture">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="dropdown_img">
                                    <a href="/categories/furniture">
                                        <img src="/assets/images/img2m.jpg" className="img-fluid" alt="Explore the collection" />
                                    </a>
                                    <a href="/categories/furniture">New: Aptos Furniture Collection ›</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
<li className="dropmenu"><a href="/categories/new">New</a>
                    <div className="dropmenu_list">
                        <div className="dropmenu_list__flex">
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <h6> <a href="/categories/new">In-Stock & Quick Ship Furniture <i
                                                className='bx bx-chevron-right'></i></a></h6>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/new">shop all furniture</a>
                                    <a href="/categories/new">new & featured</a>
                                    <a href="/categories/new">living room furniture</a>
                                    <a href="/categories/new">bedroom furniture</a>
                                    <a href="/categories/new">dining & kitchen furniture</a>
                                    <a href="/categories/new">storage and modaltas furniture</a>
                                    <a href="/categories/new">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/new">shop all furniture</a>
                                    <a href="/categories/new">new & featured</a>
                                    <a href="/categories/new">living room furniture</a>
                                    <a href="/categories/new">bedroom furniture</a>
                                    <a href="/categories/new">dining & kitchen furniture</a>
                                    <a href="/categories/new">storage and modaltas furniture</a>
                                    <a href="/categories/new">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/new">shop all furniture</a>
                                    <a href="/categories/new">new & featured</a>
                                    <a href="/categories/new">living room furniture</a>
                                    <a href="/categories/new">bedroom furniture</a>
                                    <a href="/categories/new">dining & kitchen furniture</a>
                                    <a href="/categories/new">storage and modaltas furniture</a>
                                    <a href="/categories/new">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/new">shop all furniture</a>
                                    <a href="/categories/new">new & featured</a>
                                    <a href="/categories/new">living room furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/new">shop all furniture</a>
                                    <a href="/categories/new">new & featured</a>
                                    <a href="/categories/new">living room furniture</a>
                                </div>

                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <a href="/categories/new">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/new">shop all furniture</a>
                                    <a href="/categories/new">new & featured</a>
                                    <a href="/categories/new">living room furniture</a>
                                    <a href="/categories/new">bedroom furniture</a>
                                    <a href="/categories/new">dining & kitchen furniture</a>
                                    <a href="/categories/new">storage and modaltas furniture</a>
                                    <a href="/categories/new">best selling furniture</a>
                                </div>
                                <div className="menu_heading">
                                    <a href="/categories/new">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/new">shop all furniture</a>
                                    <a href="/categories/new">new & featured</a>
                                    <a href="/categories/new">living room furniture</a>
                                    <a href="/categories/new">bedroom furniture</a>
                                    <a href="/categories/new">dining & kitchen furniture</a>
                                    <a href="/categories/new">storage and modaltas furniture</a>
                                    <a href="/categories/new">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="dropdown_img">
                                    <a href="/categories/new">
                                        <img src="/assets/images/img2m.jpg" className="img-fluid" alt="Explore the collection" />
                                    </a>
                                    <a href="/categories/new">New: Aptos Furniture Collection ›</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
<li className="dropmenu"><a href="/categories/outdoor">Outdoor</a>
                    <div className="dropmenu_list">
                        <div className="dropmenu_list__flex">
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <h6> <a href="/categories/outdoor">In-Stock & Quick Ship Furniture <i
                                                className='bx bx-chevron-right'></i></a></h6>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/outdoor">shop all furniture</a>
                                    <a href="/categories/outdoor">new & featured</a>
                                    <a href="/categories/outdoor">living room furniture</a>
                                    <a href="/categories/outdoor">bedroom furniture</a>
                                    <a href="/categories/outdoor">dining & kitchen furniture</a>
                                    <a href="/categories/outdoor">storage and modaltas furniture</a>
                                    <a href="/categories/outdoor">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/outdoor">shop all furniture</a>
                                    <a href="/categories/outdoor">new & featured</a>
                                    <a href="/categories/outdoor">living room furniture</a>
                                    <a href="/categories/outdoor">bedroom furniture</a>
                                    <a href="/categories/outdoor">dining & kitchen furniture</a>
                                    <a href="/categories/outdoor">storage and modaltas furniture</a>
                                    <a href="/categories/outdoor">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/outdoor">shop all furniture</a>
                                    <a href="/categories/outdoor">new & featured</a>
                                    <a href="/categories/outdoor">living room furniture</a>
                                    <a href="/categories/outdoor">bedroom furniture</a>
                                    <a href="/categories/outdoor">dining & kitchen furniture</a>
                                    <a href="/categories/outdoor">storage and modaltas furniture</a>
                                    <a href="/categories/outdoor">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/outdoor">shop all furniture</a>
                                    <a href="/categories/outdoor">new & featured</a>
                                    <a href="/categories/outdoor">living room furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/outdoor">shop all furniture</a>
                                    <a href="/categories/outdoor">new & featured</a>
                                    <a href="/categories/outdoor">living room furniture</a>
                                </div>

                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <a href="/categories/outdoor">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/outdoor">shop all furniture</a>
                                    <a href="/categories/outdoor">new & featured</a>
                                    <a href="/categories/outdoor">living room furniture</a>
                                    <a href="/categories/outdoor">bedroom furniture</a>
                                    <a href="/categories/outdoor">dining & kitchen furniture</a>
                                    <a href="/categories/outdoor">storage and modaltas furniture</a>
                                    <a href="/categories/outdoor">best selling furniture</a>
                                </div>
                                <div className="menu_heading">
                                    <a href="/categories/outdoor">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/outdoor">shop all furniture</a>
                                    <a href="/categories/outdoor">new & featured</a>
                                    <a href="/categories/outdoor">living room furniture</a>
                                    <a href="/categories/outdoor">bedroom furniture</a>
                                    <a href="/categories/outdoor">dining & kitchen furniture</a>
                                    <a href="/categories/outdoor">storage and modaltas furniture</a>
                                    <a href="/categories/outdoor">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="dropdown_img">
                                    <a href="/categories/outdoor">
                                        <img src="/assets/images/img2m.jpg" className="img-fluid" alt="Explore the collection" />
                                    </a>
                                    <a href="/categories/outdoor">New: Aptos Furniture Collection ›</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
<li className="dropmenu"><a href="/categories/bedding">Bedding</a>
                    <div className="dropmenu_list">
                        <div className="dropmenu_list__flex">
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <h6> <a href="/categories/bedding">In-Stock & Quick Ship Furniture <i
                                                className='bx bx-chevron-right'></i></a></h6>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/bedding">shop all furniture</a>
                                    <a href="/categories/bedding">new & featured</a>
                                    <a href="/categories/bedding">living room furniture</a>
                                    <a href="/categories/bedding">bedroom furniture</a>
                                    <a href="/categories/bedding">dining & kitchen furniture</a>
                                    <a href="/categories/bedding">storage and modaltas furniture</a>
                                    <a href="/categories/bedding">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/bedding">shop all furniture</a>
                                    <a href="/categories/bedding">new & featured</a>
                                    <a href="/categories/bedding">living room furniture</a>
                                    <a href="/categories/bedding">bedroom furniture</a>
                                    <a href="/categories/bedding">dining & kitchen furniture</a>
                                    <a href="/categories/bedding">storage and modaltas furniture</a>
                                    <a href="/categories/bedding">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/bedding">shop all furniture</a>
                                    <a href="/categories/bedding">new & featured</a>
                                    <a href="/categories/bedding">living room furniture</a>
                                    <a href="/categories/bedding">bedroom furniture</a>
                                    <a href="/categories/bedding">dining & kitchen furniture</a>
                                    <a href="/categories/bedding">storage and modaltas furniture</a>
                                    <a href="/categories/bedding">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/bedding">shop all furniture</a>
                                    <a href="/categories/bedding">new & featured</a>
                                    <a href="/categories/bedding">living room furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/bedding">shop all furniture</a>
                                    <a href="/categories/bedding">new & featured</a>
                                    <a href="/categories/bedding">living room furniture</a>
                                </div>

                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <a href="/categories/bedding">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/bedding">shop all furniture</a>
                                    <a href="/categories/bedding">new & featured</a>
                                    <a href="/categories/bedding">living room furniture</a>
                                    <a href="/categories/bedding">bedroom furniture</a>
                                    <a href="/categories/bedding">dining & kitchen furniture</a>
                                    <a href="/categories/bedding">storage and modaltas furniture</a>
                                    <a href="/categories/bedding">best selling furniture</a>
                                </div>
                                <div className="menu_heading">
                                    <a href="/categories/bedding">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/bedding">shop all furniture</a>
                                    <a href="/categories/bedding">new & featured</a>
                                    <a href="/categories/bedding">living room furniture</a>
                                    <a href="/categories/bedding">bedroom furniture</a>
                                    <a href="/categories/bedding">dining & kitchen furniture</a>
                                    <a href="/categories/bedding">storage and modaltas furniture</a>
                                    <a href="/categories/bedding">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="dropdown_img">
                                    <a href="/categories/bedding">
                                        <img src="/assets/images/img2m.jpg" className="img-fluid" alt="Explore the collection" />
                                    </a>
                                    <a href="/categories/bedding">New: Aptos Furniture Collection ›</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
<li className="dropmenu"><a href="/categories/bath">Bath</a>
                    <div className="dropmenu_list">
                        <div className="dropmenu_list__flex">
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <h6> <a href="/categories/bath">In-Stock & Quick Ship Furniture <i
                                                className='bx bx-chevron-right'></i></a></h6>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/bath">shop all furniture</a>
                                    <a href="/categories/bath">new & featured</a>
                                    <a href="/categories/bath">living room furniture</a>
                                    <a href="/categories/bath">bedroom furniture</a>
                                    <a href="/categories/bath">dining & kitchen furniture</a>
                                    <a href="/categories/bath">storage and modaltas furniture</a>
                                    <a href="/categories/bath">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/bath">shop all furniture</a>
                                    <a href="/categories/bath">new & featured</a>
                                    <a href="/categories/bath">living room furniture</a>
                                    <a href="/categories/bath">bedroom furniture</a>
                                    <a href="/categories/bath">dining & kitchen furniture</a>
                                    <a href="/categories/bath">storage and modaltas furniture</a>
                                    <a href="/categories/bath">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/bath">shop all furniture</a>
                                    <a href="/categories/bath">new & featured</a>
                                    <a href="/categories/bath">living room furniture</a>
                                    <a href="/categories/bath">bedroom furniture</a>
                                    <a href="/categories/bath">dining & kitchen furniture</a>
                                    <a href="/categories/bath">storage and modaltas furniture</a>
                                    <a href="/categories/bath">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/bath">shop all furniture</a>
                                    <a href="/categories/bath">new & featured</a>
                                    <a href="/categories/bath">living room furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/bath">shop all furniture</a>
                                    <a href="/categories/bath">new & featured</a>
                                    <a href="/categories/bath">living room furniture</a>
                                </div>

                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <a href="/categories/bath">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/bath">shop all furniture</a>
                                    <a href="/categories/bath">new & featured</a>
                                    <a href="/categories/bath">living room furniture</a>
                                    <a href="/categories/bath">bedroom furniture</a>
                                    <a href="/categories/bath">dining & kitchen furniture</a>
                                    <a href="/categories/bath">storage and modaltas furniture</a>
                                    <a href="/categories/bath">best selling furniture</a>
                                </div>
                                <div className="menu_heading">
                                    <a href="/categories/bath">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/bath">shop all furniture</a>
                                    <a href="/categories/bath">new & featured</a>
                                    <a href="/categories/bath">living room furniture</a>
                                    <a href="/categories/bath">bedroom furniture</a>
                                    <a href="/categories/bath">dining & kitchen furniture</a>
                                    <a href="/categories/bath">storage and modaltas furniture</a>
                                    <a href="/categories/bath">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="dropdown_img">
                                    <a href="/categories/bath">
                                        <img src="/assets/images/img2m.jpg" className="img-fluid" alt="Explore the collection" />
                                    </a>
                                    <a href="/categories/bath">New: Aptos Furniture Collection ›</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
<li className="dropmenu"><a href="/categories/lighting">Lighting</a>
                    <div className="dropmenu_list">
                        <div className="dropmenu_list__flex">
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <h6> <a href="/categories/lighting">In-Stock & Quick Ship Furniture <i
                                                className='bx bx-chevron-right'></i></a></h6>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/lighting">shop all furniture</a>
                                    <a href="/categories/lighting">new & featured</a>
                                    <a href="/categories/lighting">living room furniture</a>
                                    <a href="/categories/lighting">bedroom furniture</a>
                                    <a href="/categories/lighting">dining & kitchen furniture</a>
                                    <a href="/categories/lighting">storage and modaltas furniture</a>
                                    <a href="/categories/lighting">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/lighting">shop all furniture</a>
                                    <a href="/categories/lighting">new & featured</a>
                                    <a href="/categories/lighting">living room furniture</a>
                                    <a href="/categories/lighting">bedroom furniture</a>
                                    <a href="/categories/lighting">dining & kitchen furniture</a>
                                    <a href="/categories/lighting">storage and modaltas furniture</a>
                                    <a href="/categories/lighting">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/lighting">shop all furniture</a>
                                    <a href="/categories/lighting">new & featured</a>
                                    <a href="/categories/lighting">living room furniture</a>
                                    <a href="/categories/lighting">bedroom furniture</a>
                                    <a href="/categories/lighting">dining & kitchen furniture</a>
                                    <a href="/categories/lighting">storage and modaltas furniture</a>
                                    <a href="/categories/lighting">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/lighting">shop all furniture</a>
                                    <a href="/categories/lighting">new & featured</a>
                                    <a href="/categories/lighting">living room furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/lighting">shop all furniture</a>
                                    <a href="/categories/lighting">new & featured</a>
                                    <a href="/categories/lighting">living room furniture</a>
                                </div>

                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <a href="/categories/lighting">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="/categories/lighting">shop all furniture</a>
                                    <a href="/categories/lighting">new & featured</a>
                                    <a href="/categories/lighting">living room furniture</a>
                                    <a href="/categories/lighting">bedroom furniture</a>
                                    <a href="/categories/lighting">dining & kitchen furniture</a>
                                    <a href="/categories/lighting">storage and modaltas furniture</a>
                                    <a href="/categories/lighting">best selling furniture</a>
                                </div>
                                <div className="menu_heading">
                                    <a href="/categories/lighting">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="/categories/lighting">shop all furniture</a>
                                    <a href="/categories/lighting">new & featured</a>
                                    <a href="/categories/lighting">living room furniture</a>
                                    <a href="/categories/lighting">bedroom furniture</a>
                                    <a href="/categories/lighting">dining & kitchen furniture</a>
                                    <a href="/categories/lighting">storage and modaltas furniture</a>
                                    <a href="/categories/lighting">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="dropdown_img">
                                    <a href="/categories/lighting">
                                        <img src="/assets/images/img2m.jpg" className="img-fluid" alt="Explore the collection" />
                                    </a>
                                    <a href="/categories/lighting">New: Aptos Furniture Collection ›</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
<li className="dropmenu"><a href="/categories/rugs">Rugs</a>
                </li>
<li className="dropmenu"><a href="/categories/windows">Windows</a>
                </li>
<li className="dropmenu"><a href="/categories/pillows-decor">Pillows & Decor</a>
                </li>
<li className="dropmenu"><a href="/categories/art-mirrors">Art & Mirrors</a>
                </li>
<li className="dropmenu"><a href="/categories/tabletop-bar">Tabletop & Bar</a>
                </li>
<li className="dropmenu"><a href="/categories/storage">Storage</a>
                </li>
<li className="dropmenu"><a href="/categories/holidays">Holidays</a>
                </li>
<li className="dropmenu"><a href="/categories/gifts">gifts</a>
                </li>
            </ul>
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
                <nav className="mobile_menu" aria-label="Mobile navigation">
                    <ul>
<li><a href="/">Home</a></li>
<li><a href="/about">About</a></li>
<li className="dropBtn"><button type="button">Furniture <i className='bx bx-chevron-right'></i></button>
                            <div className="megaDrop">
                                <ul>
                                    <li className="megadropBtn"><button type="button" className="dropBtn--active">shop all furniture <i className='bx bx-chevron-right'></i></button>
                                        <div className="megadropBtn_list"><a href="/categories/furniture">bedroom furniture</a><a href="/categories/furniture">living room furniture</a><a href="/categories/furniture">dining room furniture</a></div>
                                    </li>
                                    <li className="megadropBtn"><button type="button" className="dropBtn--active">new & featured <i className='bx bx-chevron-right'></i></button>
                                        <div className="megadropBtn_list"><a href="/categories/furniture">new arrivals</a><a href="/categories/furniture">best sellers</a><a href="/categories/furniture">sale picks</a></div>
                                    </li>
                                    <li className="megadropBtn"><button type="button" className="dropBtn--active">living room furniture <i className='bx bx-chevron-right'></i></button>
                                        <div className="megadropBtn_list"><a href="/categories/furniture">sofas</a><a href="/categories/furniture">chairs</a><a href="/categories/furniture">tables</a></div>
                                    </li>
                                </ul>
                            </div>
                        </li>
<li><a href="/categories/new">New</a></li>
<li><a href="/categories/outdoor">Outdoor</a></li>
<li><a href="/categories/bedding">Bedding</a></li>
<li><a href="/categories/bath">Bath</a></li>
<li className="dropBtn"><button type="button">Lighting <i className='bx bx-chevron-right'></i></button>
                            <div className="megaDrop">
                                <ul>
                                    <li className="megadropBtn"><button type="button" className="dropBtn--active">table lamps <i className='bx bx-chevron-right'></i></button>
                                        <div className="megadropBtn_list"><a href="/categories/lighting">modern</a><a href="/categories/lighting">floor lamps</a><a href="/categories/lighting">task lamps</a></div>
                                    </li>
                                    <li className="megadropBtn"><button type="button" className="dropBtn--active">ceiling lights <i className='bx bx-chevron-right'></i></button>
                                        <div className="megadropBtn_list"><a href="/categories/lighting">pendants</a><a href="/categories/lighting">chandeliers</a><a href="/categories/lighting">fans</a></div>
                                    </li>
                                </ul>
                            </div>
                        </li>
<li><a href="/categories/rugs">Rugs</a></li>
<li><a href="/categories/windows">Windows</a></li>
<li className="dropBtn"><button type="button">Pillows & Decor <i className='bx bx-chevron-right'></i></button>
                            <div className="megaDrop">
                                <ul>
                                    <li className="megadropBtn"><button type="button" className="dropBtn--active">wall art <i className='bx bx-chevron-right'></i></button>
                                        <div className="megadropBtn_list"><a href="/categories/pillows-decor">prints</a><a href="/categories/pillows-decor">mirrors</a><a href="/categories/pillows-decor">wall panels</a></div>
                                    </li>
                                    <li className="megadropBtn"><button type="button" className="dropBtn--active">pillows & throws <i className='bx bx-chevron-right'></i></button>
                                        <div className="megadropBtn_list"><a href="/categories/pillows-decor">colored</a><a href="/categories/pillows-decor">texture</a><a href="/categories/pillows-decor">seasonal</a></div>
                                    </li>
                                </ul>
                            </div>
                        </li>
<li><a href="/categories/art-mirrors">Art & Mirrors</a></li>
<li><a href="/categories/tabletop-bar">Tabletop & Bar</a></li>
<li><a href="/categories/storage">Storage</a></li>
<li><a href="/categories/holidays">Holidays</a></li>
<li><a href="/categories/gifts">gifts</a></li>
<li><a href="/products">Shop</a></li>
<li><a href="/blogs">Blog</a></li>
<li><a href="/contact">Contact us</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
    </>
  );
}
