
import React, { useEffect, useState } from 'react';

function Affiliate() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Dynamically load CSS files
        const cssFiles = [
            '/assets/css/bootstrap.min.css',
            '/assets/css/all.min.css',
            '/assets/css/line-awesome.min.css',
            '/assets/css/animate.css',
            '/assets/css/magnific-popup.css',
            '/assets/css/nice-select.css',
            '/assets/css/odometer.css',
            '/assets/css/slick.css',
            '/assets/css/main.css'
        ];
        cssFiles.forEach(href => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            }
        });

        // Dynamically load JS files
        const jsFiles = [
            '/assets/js/jquery-3.3.1.min.js',
            '/assets/js/bootstrap.min.js',
            '/assets/js/jquery.ui.js',
            '/assets/js/slick.min.js',
            '/assets/js/wow.min.js',
            '/assets/js/magnific-popup.min.js',
            '/assets/js/odometer.min.js',
            '/assets/js/viewport.jquery.js',
            '/assets/js/nice-select.js',
            '/assets/js/main.js'
        ];
        jsFiles.forEach(src => {
            if (!document.querySelector(`script[src="${src}"]`)) {
                const script = document.createElement('script');
                script.src = src;
                script.async = false;
                document.body.appendChild(script);
            }
        });

        // Hide loader after 1 second
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* Preloader */}
            {isLoading && (
                <>
                    <div className="loader-bg">
                        <div className="loader-p"></div>
                    </div>
                    <div className="overlay"></div>
                </>
            )}

            {/* Banner Section */}
            <section className="inner-banner bg_img padding-bottom" style={{background: 'url(/assets/images/about/bg.png) no-repeat right bottom'}}>
                <div className="container">
                    <div className="inner-banner-wrapper">
                        <div className="inner-banner-content">
                            <h2 className="inner-banner-title">Affiliates Program</h2>
                            <ul className="breadcums">
                                <li><a href="/">Home</a></li>
                                <li><span>Affiliates Program</span></li>
                            </ul>
                        </div>
                        <div className="inner-banner-thumb about d-none d-md-block">
                            <img src="/assets/images/affiliate/banner.png" alt="about" />
                        </div>
                    </div>
                </div>
                <div className="shape1 paroller" data-paroller-factor=".2">
                    <img src="/assets/images/about/balls.png" alt="about" />
                </div>
            </section>

            {/* Affiliate Section */}
            <section className="affiliate-section padding-top padding-bottom overflow-hidden">
                <div className="container">
                    <div className="row gy-5 align-items-center">
                        <div className="col-lg-5 d-lg-block d-none">
                            <div className="affiliate-thumb">
                                <img src="/assets/images/affiliate/thumb.png" alt="affiliate" />
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="affiliate-content">
                                <div className="section-header">
                                    <span className="subtitle">Affiliate program</span>
                                    <h2 className="title">Make Money By Affiliate With Out Invest</h2>
                                </div>
                                <div className="affilate-tab-menu row g-4">
                                    <div className="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-4 tab-item">
                                        <div className="affiliate-tab-item">
                                            <div className="item-inner">
                                                <h3 className="percentage">05%</h3>
                                                <span className="serial">1st</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-4 tab-item">
                                        <div className="affiliate-tab-item">
                                            <div className="item-inner">
                                                <h3 className="percentage">07%</h3>
                                                <span className="serial">2nd</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-4 tab-item">
                                        <div className="affiliate-tab-item">
                                            <div className="item-inner">
                                                <h3 className="percentage">12%</h3>
                                                <span className="serial">3rd</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="affiliate-item-content">
                                    <h4 className="title">Dapibus et amet sociis, arcu orci orci tinci dunt neque. Purus etortor sjust mauris eumales uada architecto.</h4>
                                    <p>Pulvinar a diam ipsum volutpat, bibendum bibendum quia urna id eros. Laoreet fusce dictum amet, purus facilisis pellentesque sed est tristique, ut ligula ac aut integer per, eu purus commodo, id fermentum semper nisl a. Interdum purus molestie. Volutpat quisque justo tellus arcu eget, nonummy vel luctus hendrerit etiam, integer congue aliquam, nunc velit sunt ut at ve</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="shape">
                    <img src="/assets/images/affiliate/bg-map.png" alt="affiliate" />
                </div>
            </section>

            {/* Affiliate Commission Section */}
            <section className="commission-section bg_img" style={{background: 'url(/assets/images/affiliate/bg.jpg) no-repeat center'}}>
                <div className="container">
                    <div className="commission-wrapper">
                        <div className="commission-thumb d-none d-lg-block">
                            <img src="/assets/images/commission/thumb.png" alt="commission" />
                        </div>
                        <div className="commission-content">
                            <h2 className="title">30% <br /><span>Affiliate Commission</span></h2>
                            <p>Phasellus a non dui hymenaeos mi ideu non ut lacus, nec erat consequataceuaugueid augue gravida consequat Magna erat nuncsit.</p>
                            <div className="shape1">
                                <img src="/assets/images/commission/shape1.png" alt="commission" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="choose-us-three padding-top padding-bottom overflow-hidden">
                <div className="container">
                    <div className="row gy-5">
                        <div className="col-xl-6 col-lg-7">
                            <div className="choose-us-right-content pl-0 pr-40">
                                <div className="section-header">
                                    <span className="subtitle">WHY CHOOSE US</span>
                                    <h2 className="title" data--delay=".5s">Why You Should Affiliate</h2>
                                    <p data--delay=".6s">Dapibus et amet sociis, arcu orci orci tincidunt neque. Purus etortors justmauris eumalesuada architecto.</p>
                                </div>
                                <div className="choose-item-wrapper-three">
                                    <div className="choose-item-three">
                                        <div className="choose-item-thumb-three"></div>
                                    </div>
                                    <div className="choose-item-three"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-5 d-none d-lg-block pl-40">
                            <div className="choose-us-thumb ltr"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Affiliate Section (How to do it) */}
            <div className="affiliate-section padding-bottom mb-40">
                <div className="container">
                    <div className="row justify-content-center mb-3">
                        <div className="col-lg-7">
                            <div className="section-header text-center"></div>
                        </div>
                    </div>
                    <div className="row g-5 justify-content-center">
                        <div className="col-lg-4 col-md-6 col-sm-10"></div>
                        <div className="col-lg-4 col-md-6 col-sm-10"></div>
                    </div>
                </div>
            </div>

            {/* Profit Calculation Section */}
            <section className="profit-calculation wow slideInUp overflow-hidden">
                <div className="container"></div>
            </section>
        </>
    );
}

export default Affiliate;