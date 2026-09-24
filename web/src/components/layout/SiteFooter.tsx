export function SiteFooter() {
  return (
    <>
<footer>
        <div className="footer_wrapper">
            <div className="container">
                <div className="row">
                    <div className="col-xl-3 col-sm-4">
                        <div className="footer_wrapper__box">
                            <div className="footer-section">
                            <h6 data-footer-toggle="footer-customer-service">Customer Service</h6>
                            <div className="footer_links" id="footer-customer-service">
                                <a href="/contact">Contact Us</a>
                                <a href="#">Track Your Order</a>
                                <a href="#"> Returns & Exchanges</a>
                                <a href="#">Shipping Information</a>
                                <a href="#">International Orders</a>
                                <a href="#">Email Preferences</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-4">
                        <div className="footer_wrapper__box">
                            <div className="footer-section">
                            <h6 data-footer-toggle="footer-about-us">About Us</h6>
                            <div className="footer_links" id="footer-about-us">
                                <a href="/about">Our Story</a>
                                <a href="#">Careers</a>
                                <a href="#"> Press</a>
                                <a href="#">Influencers</a>
                                <a href="#">Find a Store</a>
                                </div>
                        </div>
                        <div className="footer-section">
                            <h6 data-footer-toggle="footer-business-to-business">Business to Business</h6>
                            <div className="footer_links" id="footer-business-to-business">
                                <a href="#">Overview</a>
                                <a href="#">Trade</a>
                                <a href="/contact">Contact</a>
                                <a href="#">Corporate Gifting</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-4">
                        <div className="footer_wrapper__box">
                            <div className="footer-section">
                            <h6 data-footer-toggle="footer-design-services">Design Services</h6>
                            <div className="footer_links" id="footer-design-services">
                                <a href="#">Free Interior Design</a>
                                <a href="#">Room Planner</a>
                                </div>
                        </div>
                        <div className="footer-section">
                            <h6 data-footer-toggle="footer-resources">Resources</h6>
                            <div className="footer_links" id="footer-resources">
                                <a href="#"> JustAclick Credit Card</a>
                                <a href="#"> Pay Bill Online</a>
                                <a href="#"> View Online CatalogOrders</a>
                                <a href="#">Request a Catalog</a>
                                <a href="#">Address Change</a>
                                <a href="#">Gift Cards</a>
                                <a href="#"> Do Not Sell Or Share My Personal Information</a>
                                </div>
                        </div>
                        <div className="footer-section">
                            <h6 data-footer-toggle="footer-shopping-app">Shopping App</h6>
                            <div className="footer_links" id="footer-shopping-app">
                                <a href="#">"Everything you love about shopping with us, all in one convenient
                                    place."</a>
                                <img loading="lazy" decoding="async" src="/assets/images/AppStoreDownload.svg" className="img-fluid" alt="app-store" />
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-12">
                        <div className="footer_wrapper__box footer_email">
                            <h6>Join our VIP list for inspiration, new arrivals & more.</h6>
                            <form className="newsletter-form" data-static-form="Email signup is currently unavailable. Please try again later."><label className="sr-only" htmlFor="newsletter-email">Email address</label><div className="footer_input">
                                <input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="Your email address" required />
                                <button type="submit">Sign up</button>
                            </div></form>
                            <span>UAE residents, please see the Financial Incentive Terms for terms. </span>
                            <div className="follow">
                                <h6>follow us</h6>
                                <div className="follow_links">
                                    <a href="#" aria-label="instagram"><i className="bx bxl-instagram" aria-hidden="true"></i></a>
                                    <a href="#" aria-label="facebook"><i className="bx bxl-facebook" aria-hidden="true"></i></a>
                                    <a href="#" aria-label="pinterest"><i className="bx bxl-pinterest" aria-hidden="true"></i></a>
                                    <a href="#" aria-label="youtube"><i className="bx bxl-youtube" aria-hidden="true"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="copyright">
                <p>© 2025 JustAclick, Inc. All Rights Reserved |
                    <a href="#"> Terms & Conditions |</a>
                    <a href="#"> Accessibility |</a>
                    <a href="#"> Privacy Policy |</a>
                    <a href="#"> Legal Statement </a>
                </p>
            </div>
        </div>
    </footer>
    </>
  );
}
