
import React, { useEffect, useState } from 'react';
import '../assets/css/responsive-affiliate.css';

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
                    <div
                        className="loader-bg"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: '#fff',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <img
                            src="/loader.jpeg"
                            alt="Loading..."
                            style={{
                                width: 260,
                                height: 260,
                                animation: 'blink 1s infinite',
                            }}
                        />
                    </div>
                    <style>
                        {`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}
                    </style>
                </>
            )}

            {/* Banner Section */}
            <section className="inner-banner bg_img padding-bottom" style={{ background: 'url(/assets/images/about/bg.png) no-repeat right bottom' }}>
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
                        <div className="col-lg-5 d-lg-block d-none wow fadeInLeft">
                            <div className="affiliate-thumb">
                                <img src="/assets/images/affiliate/thumb.png" alt="affiliate" />
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="affiliate-content">
                                <div className="section-header">
                                    <span className="subtitle  fadeInUp">Affiliate program</span>
                                    <h2 className="title  fadeInUp" data--delay=".5s">Make Money By Affiliate Program</h2>
                                </div>
                                <div className="affilate-tab-menu row g-4">
                                    <div className="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-4 tab-item  fadeInUp" data--delay=".3s" >
                                        <div className="affiliate-tab-item">
                                            <div className="item-inner">
                                                <h3 className="percentage">3%</h3>
                                                <span>1st</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-4 tab-item  fadeInUp" data--delay=".4s" >
                                        <div className="affiliate-tab-item">
                                            <div className="item-inner">
                                                <h3 className="percentage">2%</h3>
                                                <span>2nd</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-4 tab-item  fadeInUp" data--delay=".5s" >
                                        <div className="affiliate-tab-item">
                                            <div className="item-inner">
                                                <h3 className="percentage">1%</h3>
                                                <span>3rd</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="affiliate-item-content">
                                    <h4 className="title">Unlock a rewarding opportunity by joining our multi-level affiliate program! You can start earning with every referral.</h4>
                                    <p>Our program is designed to grow with you — the more you share, the more you earn: <br />
                                        Level 1 – Earn 3% commission on your every direct referrals. <br />
                                        Level 2 – Earn 2% commission on every indirect level 1 referrals. <br />
                                        Level 3 – Get 1% commission from extended network of your level 2 referrals. <br />
                                        This 3-level structure allows you to build a passive income stream as your network grows. It’s simple to start: sign up, share your unique affiliate link, and watch your earnings grow!
                                    </p>
                                    {/* <a href="/affiliate" className="cmn--btn">View Details</a> */}
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
            <section className="commission-section bg_img" style={{ background: 'url(/assets/images/affiliate/bg.jpg) no-repeat center' }}>
                <div className="container">
                    <div className="commission-wrapper">
                        <div className="commission-thumb d-none d-lg-block">
                            <img src="/assets/images/commission/thumb.png" alt="commission" />
                        </div>
                        <div className="commission-content">
                            <h2 className="title">06% <br /><span>Affiliate Commission</span></h2>
                            <p>Why settle for less when you can earn more? Our platform ensures you get the best value with only up to 6% maximum commission – designed to maximize your profits, boost your growth, and make every transaction worth it!</p>
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
    <div className="row gy-5 align-items-center flex-lg-row flex-column-reverse">
      <div className="col-xl-6 col-lg-7">
        <div className="choose-us-right-content pl-0 pr-40 d-flex flex-column justify-content-center h-100">
          <div className="section-header mb-4 text-left">
            <span className="subtitle d-block  text-uppercase" style={{ fontSize: "1.5rem", color: "#4100f6ff" }}>
              WHY CHOOSE US
            </span>
            <h2 className="title fw-bold" style={{ fontSize: "2rem", color: "#222", marginTop: "0.3rem" }}>
              Why You Should Affiliate
            </h2>
          </div>

          <div className="p-4 border rounded-3 shadow-sm bg-white">
            <p className="fs-5 text-dark mb-4 text-center">
              <strong>Start earning from day one.</strong> Every investment on our platform generates 
              <strong> 1% daily commission</strong> — no matter the size of your investment.
            </p>
            <hr/>

            <h4 className="fw-bold text-left mb-3 ">Boost your income by inviting others</h4>

            <ul className="list-unstyled mb-4">
              <li className="mb-2">
                <span className="fw-bold ">Level 1:</span> Earn <strong>3% daily</strong> from your direct referrals.
              </li>
              <li className="mb-2">
                <span className="fw-bold">Level 2:</span> Earn <strong>2% daily</strong> from the referrals of your team.
              </li>
              <li>
                <span className="fw-bold">Level 3:</span> Earn <strong>1% daily</strong> from your extended network.
              </li>
            </ul>

            <div className="p-3 border rounded text-center bg-light">
              <h5 className="fw-semibold mb-2">Grow Your Network, Grow Your Income</h5>
              <p className="mb-0 text-muted">
                With every new referral, your earning potential multiplies. <br />
                <strong>The bigger your team, the higher your daily rewards.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-6 col-lg-5 d-flex align-items-center justify-content-center pl-40">
        <div className="choose-us-thumb ltr text-center w-100">
          <img 
            src="/assets/images/choose-us/thumb.png" 
            alt="choose-us" 
            className="img-fluid rounded-3"
            style={{ maxWidth: "700px" }} 
          />
        </div>
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


        </>
    );
}

export default Affiliate;