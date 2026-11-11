import { imgSrc } from '@/lib/utils';
import { SITE_MEDIA_SLOTS } from '@/lib/site-media-slots';
import { getSiteMediaMap } from '@/repositories/site-media.repository';
import { HeroVideoBanner } from './HeroVideoBanner';
import { CategoryShowcases } from './CategoryShowcases';

function mediaUrl(map: Record<string, string>, slotKey: string) {
  const fallback = SITE_MEDIA_SLOTS.find((slot) => slot.slot_key === slotKey)?.default_path;
  return imgSrc(map[slotKey] || fallback);
}

export async function HomeMain() {
  const media = await getSiteMediaMap();
  const heroPosters: [string, string, string] = [
    mediaUrl(media, 'hero.slide1.poster'),
    mediaUrl(media, 'hero.slide2.poster'),
    mediaUrl(media, 'hero.slide3.poster')
  ];

  return (
    <>
<main id="main-content" className="home-page" tabIndex={-1}>
    <HeroVideoBanner posters={heroPosters} />

    <CategoryShowcases media={media} />
    <section className="bestseller_wrapper global_section">
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-7">
                    <div className="bestseller_wrapper__left">
                        <img decoding="async" loading="lazy" src={mediaUrl(media, 'home.bestseller')} className="img-fluid" alt="furniture" />
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
                                <img decoding="async" loading="lazy" src={mediaUrl(media, 'home.collection1.img1')} className="img-fluid" alt="collection1" />
                            </div>
                            <div className="collection_img">
                                <img decoding="async" loading="lazy" src={mediaUrl(media, 'home.collection1.img2')} className="img-fluid" alt="collection1" />
                            </div>
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
                                <img decoding="async" loading="lazy" src={mediaUrl(media, 'home.collection2.img1')} className="img-fluid" alt="Table tops collection" />
                            </div>
                            <div className="collection_img">
                                <img decoding="async" loading="lazy" src={mediaUrl(media, 'home.collection2.img2')} className="img-fluid" alt="Kitchenware collection" />
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

    <section className="global_section elements_wrapper">
        <div className="container-fluid">
            <div className="elements_wrapper__content insta_slider">


                <div className="main_heading collection_heading">
                    <h3> collections</h3>
                </div>

                <div className="swiper mySwiper element_content">
                    <div className="swiper-wrapper">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div className="swiper-slide" key={`elements-${n}`}>
                            <a href="#">
                                <img decoding="async" loading="lazy" src={mediaUrl(media, `home.elements.${n}`)} className="img-fluid" alt="Explore the collection" />
                            </a>
                        </div>
                        ))}
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
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div className="swiper-slide" key={`discover-${n}`}>
                            <a href="#">
                                <img decoding="async" loading="lazy" src={mediaUrl(media, `home.discover.${n}`)} className="img-fluid" alt="Explore the collection" />
                            </a>
                        </div>
                        ))}
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
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div className="mycollection_box" key={`sofa-${n}`}>
                    <a href="#">
                        <div className="mycollection_box__img">
                            <img decoding="async" loading="lazy" src={mediaUrl(media, `home.mycollection.${n}`)} className="img-fluid" alt="Explore the collection" />
                        </div>
                        <div className="mycollection_box__content">
                            <p>up to 40% off sofas & chairs <i className='bx bx-chevron-right'></i></p>
                        </div>
                    </a>
                </div>
                ))}
            </div>
        </div>
    </section>
    </main>
    </>
  );
}
