export function HomeMain() {
  return (
    <>
<main id="main-content" tabIndex={-1}>
    <section className="banner_wrapper">
        <div className="banner_slider">
            <div className="banner_video global_section">
                <div className="container-fluid">
                    <div className="banner_video__content">
                        <img decoding="async" fetchPriority="high" src="/assets/images/banner.jpg" className="img-fluid" alt="Interior design collection" />
                    </div>
                </div>
                <div className="banner_video__text">
                    <h3>last day</h3>
                    <h1>Interior Design</h1>
                    <div className="shop-now">
                        <a href="/products" className="global_btn">shop now</a>
                    </div>
                </div>
            </div>
            <div className="banner_video global_section">
                <div className="container-fluid">
                    <div className="banner_video__content">
                        <img decoding="async" src="/assets/images/banner2.jpg" className="img-fluid" alt="Interior design collection" />
                    </div>
                </div>
                <div className="banner_video__text">
                    <h3>just in</h3>
                    <h2>The fall collection</h2>
                    <div className="shop-now">
                        <a href="/products" className="global_btn">shop now</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section className="global_section elements_wrapper">
        <div className="container-fluid">
            <div className="elements_wrapper__content">

                <div className="main_heading">
                    <h4>uncompromising quality. original pieces. timeless collections.</h4>
                </div>

                <div className="swiper mySwiper element_content">
                    <div className="swiper-wrapper">
                        <div className="swiper-slide">
                            <div className="categories_box">
                                <a href="#">
                                    <img decoding="async" loading="lazy" src="/assets/images/img1.avif" className="img-fluid" alt="Explore the collection" />
                                    <p>categories name</p>
                                </a>
                            </div>
                        </div>
                        <div className="swiper-slide">
                            <div className="categories_box">
                                <a href="#">
                                    <img decoding="async" loading="lazy" src="/assets/images/img1.avif" className="img-fluid" alt="Explore the collection" />
                                </a>
                                <p>categories name</p>
                            </div>
                        </div>
                        <div className="swiper-slide">
                            <div className="categories_box">
                                <a href="#">
                                    <img decoding="async" loading="lazy" src="/assets/images/img1.avif" className="img-fluid" alt="Explore the collection" />
                                </a>
                                <p>categories name</p>
                            </div>
                        </div>
                        <div className="swiper-slide">
                            <div className="categories_box">
                                <a href="#">
                                    <img decoding="async" loading="lazy" src="/assets/images/img1.avif" className="img-fluid" alt="Explore the collection" />
                                </a>
                                <p>categories name</p>
                            </div>
                        </div>
                        <div className="swiper-slide">
                            <div className="categories_box">
                                <a href="#">
                                    <img decoding="async" loading="lazy" src="/assets/images/img1.avif" className="img-fluid" alt="Explore the collection" />
                                </a>
                                <p>categories name</p>
                            </div>
                        </div>
                        <div className="swiper-slide">
                            <div className="categories_box">
                                <a href="#">
                                    <img decoding="async" loading="lazy" src="/assets/images/img1.avif" className="img-fluid" alt="Explore the collection" />
                                </a>
                                <p>categories name</p>
                            </div>
                        </div>

                    </div>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                </div>
            </div>
        </div>
    </section>


    <section className="holiday_wrapper global_section">
        <div className="container-fluid">
            <div className="holiday_wrapper__content">

                <div className="main_heading holiday_heading">
                    <h3>Gift Lighting</h3>
                </div>
                <div className="holiday_grid">
                    <div className="holiday_grid__box">
                        <a href="#">
                            <img decoding="async" loading="lazy" src="/assets/images/mygift1.webp" className="img-fluid" alt="gift" />
                            <p>selling</p>
                        </a>
                    </div>
                    <div className="holiday_grid__box">
                        <a href="#">
                            <img decoding="async" loading="lazy" src="/assets/images/mygift2.webp" className="img-fluid" alt="gift" />
                            <p>floor</p>
                        </a>
                    </div>
                    <div className="holiday_grid__box">
                        <a href="#">
                            <img decoding="async" loading="lazy" src="/assets/images/mygift3.webp" className="img-fluid" alt="gift" />
                            <p>wall</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>


    <section className="furniture_wrapper global_section">
        <div className="container-fluid">
            <div className="furniture_wrapper__content">
                <div className="furniture_img">
                    <img decoding="async" loading="lazy" src="/assets/images/furniture2.jpeg" className="img-fluid" alt="furniture" />
                </div>
                <div className="furniture_content">
                    <h3>decor & utilize</h3>
                    <div className="furniture_content__btn">
                        <a href="#">sofa & sectionals</a>
                        <a href="#">in-stock furniture</a>

                    </div>
                </div>
                <div className="furniture_bottom">
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus earum doloribus fuga!
                        Dolor officia accusamus quae!</p>
                </div>
                <div className="furniture_left">
                    <div className="box">

                        <a href="#">
                            <div className="box-content">
                                <p>shop the look</p>
                            </div>
                        </a>
                    </div>

                </div>
            </div>
        </div>
    </section>


    <section className="gathering_wrapper global_section">
        <div className="container-fluid">
            <div className="gathering_wrapper__inner">
                <div className="gathering_wrapper__content">
                    <div className="furniture_img">
                        <img decoding="async" loading="lazy" src="/assets/images/furniture3.jpeg" className="img-fluid" alt="furniture" />
                    </div>
                    <div className="furniture_content furniture_content-first">
                        <h3>furniture built to </h3>

                        <div className="furniture_content__btn">
                            <a href="#">sofa & sectionals</a>
                            <a href="#">in-stock furniture</a>
                        </div>
                    </div>
                    <div className="furniture_bottom">
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus earum doloribus fuga!
                            Dolor officia accusamus quae!</p>
                    </div>
                    <div className="furniture_left">
                        <div className="box">

                            <a href="#">
                                <div className="box-content">
                                    <p>shop the look</p>
                                </div>
                            </a>
                        </div>

                    </div>
                </div>
                <div className="furniture_wrapper__content jewels_content">
                    <div className="furniture_img">
                        <img decoding="async" loading="lazy" src="/assets/images/furniture4.jpeg" className="img-fluid" alt="furniture" />
                    </div>
                    <div className="furniture_content">
                        <h3>tabletop & kitchen</h3>
                        <div className="furniture_content__btn">
                            <a href="#">sofa & sectionals</a>
                            <a href="#">in-stock furniture</a>
                        </div>
                    </div>
                    <div className="furniture_bottom">
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus earum doloribus fuga!
                            Dolor officia accusamus quae!</p>
                    </div>
                    <div className="furniture_left">
                        <div className="box">

                            <a href="#">
                                <div className="box-content">
                                    <p>shop the look</p>
                                </div>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>


    <section className="collection_wrapper global_section">
        <div className="container-fluid">
            <div className="collection_wrapper__content collection-bg">
                <div className="row collection_flex">
                    <div className="col-lg-6">
                        <div className="collection_wrapper__left">

                            <h2>table tops</h2>
                            <span><i className='bx bx-x'></i></span>
                            <h3>JustAclick</h3>
                            <h4>functional. accessible. beautiful.</h4>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime ea tempora debitis.
                                Dolorum dolorem consequuntur, temporibus eveniet, doloribus facere repudiandae aperiam
                                iste, eum aliquam nulla est. Expedita hic exercitationem ducimus?</p>
                            <div className="collection-btn">
                                <a href="/products">shop the collection</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="collection_wrapper__right">
                            <div className="collection_img">
                                <img decoding="async" loading="lazy" src="/assets/images/collection1.avif" className="img-fluid" alt="collection1" />
                            </div>
                            <div className="collection_img">
                                <img decoding="async" loading="lazy" src="/assets/images/collection2.avif" className="img-fluid" alt="collection1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>


    <section className="bestseller_wrapper global_section">
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-7">
                    <div className="bestseller_wrapper__left">
                        <img decoding="async" loading="lazy" src="/assets/images/furniture5.jpeg" className="img-fluid" alt="furniture" />
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="bestseller_wrapper__right">
                        <h6>iconic. versatile. timeless.</h6>

                        <h3>Interior design</h3>
                        <div className="shop-now">
                            <a href="/products">get in touch</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>


    <section className="collection_wrapper global_section">
        <div className="container-fluid">
            <div className="collection_wrapper__content collection_bg">
                <div className="row ">
                    <div className="col-lg-6">
                        <div className="collection_wrapper__right">
                            <div className="collection_img">
                                <img decoding="async" loading="lazy" src="/assets/images/banner.jpg" className="img-fluid" alt="collection1" />
                            </div>
                            <div className="collection_img">
                                <img decoding="async" loading="lazy" src="/assets/images/banner2.jpg" className="img-fluid" alt="collection1" />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="collection_wrapper__left">

                            <h2>Table Tops and Kitchenware</h2>
                            <span><i className='bx bx-x'></i></span>
                            <h3>JustAclick</h3>
                            <h4>functional. accessible. beautiful.</h4>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime ea tempora debitis.
                                Dolorum dolorem consequuntur, temporibus eveniet, doloribus facere repudiandae aperiam
                                iste, eum aliquam nulla est. Expedita hic exercitationem ducimus?</p>
                            <div className="collection-btn">
                                <a href="/products">shop the collection</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>


    <section className="wednesday_wrapper global_section">
        <div className="container-fluid">
            <div className="wednesday_wrapper__banner">
                <img decoding="async" loading="lazy" src="/assets/images/wednesday.jpg" className="img-fluid" alt="wednesday" />
            </div>
        </div>
    </section>

    <section className="design_wrapper global_section">
        <div className="container-fluid">
            <div className="design_wrapper__content">
                <h6>good by design</h6>
                <h3>For the 7th consecutive year, Williams-Sonoma, Inc. is the only exclusive home furnishings retailer
                    on Barron's list of the 100 Most Sustainable U.S Companies.</h3>
                <div className="design-btn">
                    <a href="#">see our impact</a>
                    <a href="#">shop responsibly</a>
                </div>
            </div>
        </div>
    </section>

    <section className="global_section elements_wrapper">
        <div className="container-fluid">
            <div className="elements_wrapper__content insta_slider">


                <div className="main_heading collection_heading">
                    <h3> collections</h3>
                </div>

                <div className="swiper mySwiper element_content">
                    <div className="swiper-wrapper">
                        <div className="swiper-slide">
                            <a href="#">
                                <img decoding="async" loading="lazy" src="/assets/images/img2.jpeg" className="img-fluid" alt="Explore the collection" />
                            </a>
                        </div>
                        <div className="swiper-slide">
                            <a href="#">
                                <img decoding="async" loading="lazy" src="/assets/images/img3.jpeg" className="img-fluid" alt="Explore the collection" />
                            </a>
                        </div>
                        <div className="swiper-slide">
                            <a href="#">
                                <img decoding="async" loading="lazy" src="/assets/images/img4.jpeg" className="img-fluid" alt="Explore the collection" />
                            </a>
                        </div>
                        <div className="swiper-slide">
                            <a href="#">
                                <img decoding="async" loading="lazy" src="/assets/images/img5.jpeg" className="img-fluid" alt="Explore the collection" />
                            </a>
                        </div>
                        <div className="swiper-slide">
                            <a href="#">
                                <img decoding="async" loading="lazy" src="/assets/images/img1.avif" className="img-fluid" alt="Explore the collection" />
                            </a>
                        </div>
                        <div className="swiper-slide">
                            <a href="#">
                                <img decoding="async" loading="lazy" src="/assets/images/img1.avif" className="img-fluid" alt="Explore the collection" />
                            </a>
                        </div>

                    </div>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>


                </div>
            </div>
        </div>
    </section>


    <section className="discover_wrapper global_section">
        <div className="container-fluid">
            <div className="discover_wrapper__content">
                <div className="discover_heading">
                    <h6>Discover Even more across our family of brands</h6>
                </div>
                <div className="swiper mySwiper2 element_content">
                    <div className="swiper-wrapper">
                        <div className="swiper-slide">
                            <a href="#">
                                <img decoding="async" loading="lazy" src="/assets/images/016.avif" className="img-fluid" alt="Explore the collection" />
                            </a>
                        </div>
                        <div className="swiper-slide">
                            <a href="#">
                                <img decoding="async" loading="lazy" src="/assets/images/010.avif" className="img-fluid" alt="Explore the collection" />
                            </a>
                        </div>
                        <div className="swiper-slide">
                            <a href="#">
                                <img decoding="async" loading="lazy" src="/assets/images/012.avif" className="img-fluid" alt="Explore the collection" />
                            </a>
                        </div>
                        <div className="swiper-slide">
                            <a href="#">
                                <img decoding="async" loading="lazy" src="/assets/images/013.avif" className="img-fluid" alt="Explore the collection" />
                            </a>
                        </div>
                        <div className="swiper-slide">
                            <a href="#">
                                <img decoding="async" loading="lazy" src="/assets/images/009.avif" className="img-fluid" alt="Explore the collection" />
                            </a>
                        </div>
                        <div className="swiper-slide">
                            <a href="#">
                                <img decoding="async" loading="lazy" src="/assets/images/img1.avif" className="img-fluid" alt="Explore the collection" />
                            </a>
                        </div>

                    </div>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>


                </div>
            </div>
        </div>
    </section>

    <section className="mycollection global_section">
        <div className="container-fluid">
            <div className="mycollection__flex">
                <div className="mycollection_box">
                    <a href="#">
                        <div className="mycollection_box__img">
                            <img decoding="async" loading="lazy" src="/assets/images/sofa1.webp" className="img-fluid" alt="Explore the collection" />
                        </div>
                        <div className="mycollection_box__content">
                            <p>up to 40% off sofas & chairs <i className='bx bx-chevron-right'></i></p>
                        </div>
                    </a>
                </div>
                <div className="mycollection_box">
                    <a href="#">
                        <div className="mycollection_box__img">
                            <img decoding="async" loading="lazy" src="/assets/images/sofa2.webp" className="img-fluid" alt="Explore the collection" />
                        </div>
                        <div className="mycollection_box__content">
                            <p>up to 40% off sofas & chairs <i className='bx bx-chevron-right'></i></p>
                        </div>
                    </a>
                </div>
                <div className="mycollection_box">
                    <a href="#">
                        <div className="mycollection_box__img">
                            <img decoding="async" loading="lazy" src="/assets/images/sofa3.webp" className="img-fluid" alt="Explore the collection" />
                        </div>
                        <div className="mycollection_box__content">
                            <p>up to 40% off sofas & chairs <i className='bx bx-chevron-right'></i></p>
                        </div>
                    </a>
                </div>
                <div className="mycollection_box">
                    <a href="#">
                        <div className="mycollection_box__img">
                            <img decoding="async" loading="lazy" src="/assets/images/sofa4.webp" className="img-fluid" alt="Explore the collection" />
                        </div>
                        <div className="mycollection_box__content">
                            <p>up to 40% off sofas & chairs <i className='bx bx-chevron-right'></i></p>
                        </div>
                    </a>
                </div>
                <div className="mycollection_box">
                    <a href="#">
                        <div className="mycollection_box__img">
                            <img decoding="async" loading="lazy" src="/assets/images/sofa5.webp" className="img-fluid" alt="Explore the collection" />
                        </div>
                        <div className="mycollection_box__content">
                            <p>up to 40% off sofas & chairs <i className='bx bx-chevron-right'></i></p>
                        </div>
                    </a>
                </div>
                <div className="mycollection_box">
                    <a href="#">
                        <div className="mycollection_box__img">
                            <img decoding="async" loading="lazy" src="/assets/images/sofa6.webp" className="img-fluid" alt="Explore the collection" />
                        </div>
                        <div className="mycollection_box__content">
                            <p>up to 40% off sofas & chairs <i className='bx bx-chevron-right'></i></p>
                        </div>
                    </a>
                </div>
                <div className="mycollection_box">
                    <a href="#">
                        <div className="mycollection_box__img">
                            <img decoding="async" loading="lazy" src="/assets/images/sofa7.webp" className="img-fluid" alt="Explore the collection" />
                        </div>
                        <div className="mycollection_box__content">
                            <p>up to 40% off sofas & chairs <i className='bx bx-chevron-right'></i></p>
                        </div>
                    </a>
                </div>
                <div className="mycollection_box">
                    <a href="#">
                        <div className="mycollection_box__img">
                            <img decoding="async" loading="lazy" src="/assets/images/sofa8.webp" className="img-fluid" alt="Explore the collection" />
                        </div>
                        <div className="mycollection_box__content">
                            <p>up to 40% off sofas & chairs <i className='bx bx-chevron-right'></i></p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </section>

    </main>
    </>
  );
}
