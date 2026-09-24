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
                        <li><a href="#" className=""><img src="/assets/images/cart.svg" className="" alt="cart" /> track order</a></li>
                        <li><a href="#" className=""><img src="/assets/images/recents.png" className="" alt="recents" />recents</a></li>
                        <li className="cart-no"><a href="/account/wishlist" className=""><img src="/assets/images/favorites.png" className="" alt="recents" />favorites</a><span className="">({wishlist})</span></li>
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
                    <a href="/categories">Furniture</a>
                    <div className="dropmenu_list">
                        <div className="dropmenu_list__flex">
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <h6> <a href="#">In-Stock & Quick Ship Furniture <i
                                                className='bx bx-chevron-right'></i></a></h6>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                </div>

                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <a href="#">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_heading">
                                    <a href="#">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="dropdown_img">
                                    <a href="#">
                                        <img src="/assets/images/img2m.jpg" className="img-fluid" alt="Explore the collection" />
                                    </a>
                                    <a href="#">New: Aptos Furniture Collection ›</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
<li className="dropmenu"><a href="/products">New</a>
                    <div className="dropmenu_list">
                        <div className="dropmenu_list__flex">
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <h6> <a href="#">In-Stock & Quick Ship Furniture <i
                                                className='bx bx-chevron-right'></i></a></h6>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                </div>

                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <a href="#">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_heading">
                                    <a href="#">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="dropdown_img">
                                    <a href="#">
                                        <img src="/assets/images/img2m.jpg" className="img-fluid" alt="Explore the collection" />
                                    </a>
                                    <a href="#">New: Aptos Furniture Collection ›</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
<li className="dropmenu"><a href="#">Outdoor</a>
                    <div className="dropmenu_list">
                        <div className="dropmenu_list__flex">
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <h6> <a href="#">In-Stock & Quick Ship Furniture <i
                                                className='bx bx-chevron-right'></i></a></h6>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                </div>

                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <a href="#">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_heading">
                                    <a href="#">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="dropdown_img">
                                    <a href="#">
                                        <img src="/assets/images/img2m.jpg" className="img-fluid" alt="Explore the collection" />
                                    </a>
                                    <a href="#">New: Aptos Furniture Collection ›</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
<li className="dropmenu"><a href="#">Bedding</a>
                    <div className="dropmenu_list">
                        <div className="dropmenu_list__flex">
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <h6> <a href="#">In-Stock & Quick Ship Furniture <i
                                                className='bx bx-chevron-right'></i></a></h6>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                </div>

                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <a href="#">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_heading">
                                    <a href="#">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="dropdown_img">
                                    <a href="#">
                                        <img src="/assets/images/img2m.jpg" className="img-fluid" alt="Explore the collection" />
                                    </a>
                                    <a href="#">New: Aptos Furniture Collection ›</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
<li className="dropmenu"><a href="#">Bath</a>
                    <div className="dropmenu_list">
                        <div className="dropmenu_list__flex">
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <h6> <a href="#">In-Stock & Quick Ship Furniture <i
                                                className='bx bx-chevron-right'></i></a></h6>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                </div>

                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <a href="#">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_heading">
                                    <a href="#">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="dropdown_img">
                                    <a href="#">
                                        <img src="/assets/images/img2m.jpg" className="img-fluid" alt="Explore the collection" />
                                    </a>
                                    <a href="#">New: Aptos Furniture Collection ›</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
<li className="dropmenu"><a href="#">Lighting</a>
                    <div className="dropmenu_list">
                        <div className="dropmenu_list__flex">
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <h6> <a href="#">In-Stock & Quick Ship Furniture <i
                                                className='bx bx-chevron-right'></i></a></h6>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                </div>

                            </div>
                            <div className="menu_coloumn">
                                <div className="menu_heading">
                                    <a href="#">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i> </h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                                <div className="menu_heading">
                                    <a href="#">In-Stock & Quick Ship Furniture <i className='bx bx-chevron-right'></i></a>
                                </div>
                                <div className="menu_list">
                                    <h6>Living Room Furniture <i className='bx bx-chevron-right'></i></h6>
                                    <a href="#">shop all furniture</a>
                                    <a href="#">new & featured</a>
                                    <a href="#">living room furniture</a>
                                    <a href="#">bedroom furniture</a>
                                    <a href="#">dining & kitchen furniture</a>
                                    <a href="#">storage and modaltas furniture</a>
                                    <a href="#">best selling furniture</a>
                                </div>
                            </div>
                            <div className="menu_coloumn">
                                <div className="dropdown_img">
                                    <a href="#">
                                        <img src="/assets/images/img2m.jpg" className="img-fluid" alt="Explore the collection" />
                                    </a>
                                    <a href="#">New: Aptos Furniture Collection ›</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
<li className="dropmenu"><a href="#">Rugs</a>
                </li>
<li className="dropmenu"><a href="#">Windows</a>
                </li>
<li className="dropmenu"><a href="#">Pillows & Decor</a>
                </li>
<li className="dropmenu"><a href="#">Art & Mirrors</a>
                </li>
<li className="dropmenu"><a href="#">Tabletop & Bar</a>
                </li>
<li className="dropmenu"><a href="#">Storage</a>
                </li>
<li className="dropmenu"><a href="#">Holidays</a>
                </li>
<li className="dropmenu"><a href="#">gifts</a>
                </li>
            </ul>
        </nav>
        <div className="offer">
            <div className="container">
                <div className="offer_info">
                    <p>Free Shipping on 1000s of Items <a href="#">shop now ›</a></p>
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
                                        <div className="megadropBtn_list"><a href="#">bedroom furniture</a><a href="#">living room furniture</a><a href="#">dining room furniture</a></div>
                                    </li>
                                    <li className="megadropBtn"><button type="button" className="dropBtn--active">new & featured <i className='bx bx-chevron-right'></i></button>
                                        <div className="megadropBtn_list"><a href="#">new arrivals</a><a href="#">best sellers</a><a href="#">sale picks</a></div>
                                    </li>
                                    <li className="megadropBtn"><button type="button" className="dropBtn--active">living room furniture <i className='bx bx-chevron-right'></i></button>
                                        <div className="megadropBtn_list"><a href="#">sofas</a><a href="#">chairs</a><a href="#">tables</a></div>
                                    </li>
                                </ul>
                            </div>
                        </li>
<li><a href="/products">New</a></li>
<li><a href="#">Outdoor</a></li>
<li><a href="#">Bedding</a></li>
<li><a href="#">Bath</a></li>
<li className="dropBtn"><button type="button">Lighting <i className='bx bx-chevron-right'></i></button>
                            <div className="megaDrop">
                                <ul>
                                    <li className="megadropBtn"><button type="button" className="dropBtn--active">table lamps <i className='bx bx-chevron-right'></i></button>
                                        <div className="megadropBtn_list"><a href="#">modern</a><a href="#">floor lamps</a><a href="#">task lamps</a></div>
                                    </li>
                                    <li className="megadropBtn"><button type="button" className="dropBtn--active">ceiling lights <i className='bx bx-chevron-right'></i></button>
                                        <div className="megadropBtn_list"><a href="#">pendants</a><a href="#">chandeliers</a><a href="#">fans</a></div>
                                    </li>
                                </ul>
                            </div>
                        </li>
<li><a href="#">Rugs</a></li>
<li><a href="#">Windows</a></li>
<li className="dropBtn"><button type="button">Pillows & Decor <i className='bx bx-chevron-right'></i></button>
                            <div className="megaDrop">
                                <ul>
                                    <li className="megadropBtn"><button type="button" className="dropBtn--active">wall art <i className='bx bx-chevron-right'></i></button>
                                        <div className="megadropBtn_list"><a href="#">prints</a><a href="#">mirrors</a><a href="#">wall panels</a></div>
                                    </li>
                                    <li className="megadropBtn"><button type="button" className="dropBtn--active">pillows & throws <i className='bx bx-chevron-right'></i></button>
                                        <div className="megadropBtn_list"><a href="#">colored</a><a href="#">texture</a><a href="#">seasonal</a></div>
                                    </li>
                                </ul>
                            </div>
                        </li>
<li><a href="#">Art & Mirrors</a></li>
<li><a href="#">Tabletop & Bar</a></li>
<li><a href="#">Storage</a></li>
<li><a href="#">Holidays</a></li>
<li><a href="#">gifts</a></li>
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
