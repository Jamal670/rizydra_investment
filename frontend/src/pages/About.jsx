import React, { useEffect, useState } from 'react';

function About() {
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
              <h2 className="inner-banner-title">About our company</h2>
              <ul className="breadcums">
                <li><a href="/">Home</a></li>
                <li><span>About</span></li>
              </ul>
            </div>
            <div className="inner-banner-thumb about d-none d-md-block">
              <img src="/assets/images/about/thumb2.png" alt="about" />
            </div>
          </div>
        </div>
        <div className="shape1">
          <img src="/assets/images/about/balls.png" alt="about" />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="choose-us padding-bottom padding-top overflow-hidden">
        <div className="container">
          <div className="row gy-5">
            <div className="col-lg-5  d-none d-lg-block">
              <div className="choose-us-thumb two">
                <img src="/assets/images/choose-us/thumb2.png" alt="choose-us" />
              </div>
            </div>
            <div className="col-lg-7">
              <div className="choose-us-right-content">
                <div className="section-header">
                  <span className="subtitle  fadeInUp">WHY CHOOSE US</span>
                  <h2 className="title mx-100">Why You Should Saty With Us</h2>
                  <p className=" fadeInUp" data--delay=".6s">
                    Dapibus et amet sociis, arcu orci orci tincidunt neque. Purus etortors justmauris eumalesuada architecto.
                  </p>
                </div>
                <div className="row g-4 row2">
                  <div className="col-xl-6 col-lg-12 col-md-6  slideInUp" data--delay=".3s">
                    <div className="choose-item-two">
                      <div className="choose-thumb-two">
                        <img src="/assets/images/choose-us/reimbursement.png" alt="choose-us" />
                      </div>
                      <div className="choose-content-two">
                        <h5 className="title">Protected Website</h5>
                        <p>Donec tempus sed et mauris conquat, proin lectus varius wiortamet labore ac nam purus maurilentesq.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-12 col-md-6  slideInUp" data--delay=".4s">
                    <div className="choose-item-two">
                      <div className="choose-thumb-two">
                        <img src="/assets/images/choose-us/firewall.png" alt="choose-us" />
                      </div>
                      <div className="choose-content-two">
                        <h5 className="title">Quick Withdrawal</h5>
                        <p>Donec tempus sed et mauris conquat, proin lectus varius wiortamet labore ac nam purus maurilentesq.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-12 col-md-6  slideInUp" data--delay=".5s">
                    <div className="choose-item-two">
                      <div className="choose-thumb-two">
                        <img src="/assets/images/choose-us/register.png" alt="choose-us" />
                      </div>
                      <div className="choose-content-two">
                        <h5 className="title">Registered Company</h5>
                        <p>Donec tempus sed et mauris conquat, proin lectus varius wiortamet labore ac nam purus maurilentesq.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-12 col-md-6  slideInUp" data--delay=".6s">
                    <div className="choose-item-two">
                      <div className="choose-thumb-two">
                        <img src="/assets/images/choose-us/shield.png" alt="choose-us" />
                      </div>
                      <div className="choose-content-two">
                        <h5 className="title">Strong Protection</h5>
                        <p>Donec tempus sed et mauris conquat, proin lectus varius wiortamet labore ac nam purus maurilentesq.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investor Section */}
      <section className="investor-section padding-bottom overflow-hidden">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="section-header text-center">
                <span className="subtitle">featured investors</span>
                <h2 className="title">our top investor</h2>
                <p>
                  Pipsum dolor sit amet consectetur adipisicing elit. Aliquam modi explicabo nam ex unde et dolorum non dolor! Dolorum nobis
                </p>
              </div>
            </div>
          </div>
          <div className="row justify-content-center gy-5">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6  slideInUp" data--delay=".3s">
              <div className="investor-item">
                <div className="investor-thumb">
                  <img src="/assets/images/investor/item1.png" alt="investor" />
                </div>
                <div className="investor-content">
                  <h4 className="name">Robart Betson</h4>
                  <span className="designation">Top Investor</span>
                  <h3 className="invest-ammount">$40,000.00</h3>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6  slideInUp" data--delay=".4s">
              <div className="investor-item">
                <div className="investor-thumb">
                  <img src="/assets/images/investor/item2.png" alt="investor" />
                </div>
                <div className="investor-content">
                  <h4 className="name">Robart Betson</h4>
                  <span className="designation">Top Investor</span>
                  <h3 className="invest-ammount">$40,000.00</h3>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6  slideInUp" data--delay=".5s">
              <div className="investor-item">
                <div className="investor-thumb">
                  <img src="/assets/images/investor/item3.png" alt="investor" />
                </div>
                <div className="investor-content">
                  <h4 className="name">Robart Betson</h4>
                  <span className="designation">Top Investor</span>
                  <h3 className="invest-ammount">$40,000.00</h3>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6  slideInUp" data--delay=".6s">
              <div className="investor-item">
                <div className="investor-thumb">
                  <img src="/assets/images/investor/item4.png" alt="investor" />
                </div>
                <div className="investor-content">
                  <h4 className="name">Robart Betson</h4>
                  <span className="designation">Top Investor</span>
                  <h3 className="invest-ammount">$40,000.00</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="help-section overflow-hidden">
        <div className="container">
          <div className="row align-items-center gy-5 flex-column-reverse flex-lg-row">
            <div className="col-lg-6">
              <div className="help-content">
                <div className="section-header">
                  <span className="subtitle wow fadeInUp">we are ready for your help</span>
                  <h2 className="title wow fadeInUp" data-wow-delay=".5s">How We Can Help You?</h2>
                  <p className="wow fadeInUp" data-wow-delay=".6s">
                    Dapibus et amet sociis, arcu orci orci tincidunt neque. Purus etortor sjustmauris eumalesuada architecto.
                  </p>
                </div>
                <div className="faq-tab-menu nav-tabs nav border-0 row g-4 justify-content-center">
                  <div className="col-6 col-sm-4 col-md-4 col-lg-6 col-xl-4 wow fadeInLeft" data-wow-delay=".2s">
                    <a href="#investor" className="item active" data-bs-toggle="tab">
                      <div className="thumb">
                        <img src="/assets/images/help/trading.png" alt="" />
                      </div>
                      <h5>Become an investor</h5>
                    </a>
                  </div>
                  <div className="col-6 col-sm-4 col-md-4 col-lg-6 col-xl-4 wow fadeInLeft" data-wow-delay=".3s">
                    <a href="#privacy" className="item" data-bs-toggle="tab">
                      <div className="thumb">
                        <img src="/assets/images/help/password.png" alt="" />
                      </div>
                      <h5>our company privacy</h5>
                    </a>
                  </div>
                  <div className="col-6 col-sm-4 col-md-4 col-lg-6 col-xl-4 wow fadeInLeft" data-wow-delay=".4s">
                    <a href="#account" className="item" data-bs-toggle="tab">
                      <div className="thumb">
                        <img src="/assets/images/help/support.png" alt="" />
                      </div>
                      <h5>how setting account</h5>
                    </a>
                  </div>
                </div>
                {/* Tab content omitted for brevity, can be added as static content if needed */}
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block wow fadeInRight">
              <div className="help-thumb ">
                <img src="/assets/images/help/thumb.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section-two padding-top padding-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="section-header text-center">
                <span className="subtitle  fadeInUp">client feedback</span>
                <h2 className="title  mx-100">Happy Client What Say About Us</h2>
                <p className=" fadeInUp" data--delay=".6s">
                  Pipsum dolor sit amet consectetur adipisicing elit. Aliquam modi explicabo nam ex unde et dolorum non dolor! Dolorum nobis
                </p>
              </div>
            </div>
          </div>
          <div className="testimonial-slider-two">
            <div className="single-slider">
              <div className="testimonial-item-two">
                <div className="testimonial-thumb-two">
                  <img src="/assets/images/testimonial/item2.png" alt="" />
                </div>
                <div className="testimonial-content-two">
                  <div className="quote-icon">
                    <i className="las la-quote-left"></i>
                  </div>
                  <h4 className="name">Robindronat</h4>
                  <span className="designation">Hyip Investor</span>
                  <p>Placerat pellentesque eros elit lobortis eleifend amet vivamus integer sed tellus quibusdam mauris. Leo cras molestie.</p>
                </div>
              </div>
            </div>
            <div className="single-slider">
              <div className="testimonial-item-two">
                <div className="testimonial-thumb-two">
                  <img src="/assets/images/testimonial/item4.png" alt="" />
                </div>
                <div className="testimonial-content-two">
                  <div className="quote-icon">
                    <i className="las la-quote-left"></i>
                  </div>
                  <h4 className="name">Robindronat</h4>
                  <span className="designation">Hyip Investor</span>
                  <p>Placerat pellentesque eros elit lobortis eleifend amet vivamus integer sed tellus quibusdam mauris. Leo cras molestie.</p>
                </div>
              </div>
            </div>
            <div className="single-slider">
              <div className="testimonial-item-two">
                <div className="testimonial-thumb-two">
                  <img src="/assets/images/testimonial/item3.png" alt="" />
                </div>
                <div className="testimonial-content-two">
                  <div className="quote-icon">
                    <i className="las la-quote-left"></i>
                  </div>
                  <h4 className="name">Robindronat</h4>
                  <span className="designation">Hyip Investor</span>
                  <p>Placerat pellentesque eros elit lobortis eleifend amet vivamus integer sed tellus quibusdam mauris. Leo cras molestie.</p>
                </div>
              </div>
            </div>
            <div className="single-slider">
              <div className="testimonial-item-two">
                <div className="testimonial-thumb-two">
                  <img src="/assets/images/testimonial/item4.png" alt="" />
                </div>
                <div className="testimonial-content-two">
                  <div className="quote-icon">
                    <i className="las la-quote-left"></i>
                  </div>
                  <h4 className="name">Robindronat</h4>
                  <span className="designation">Hyip Investor</span>
                  <p>Placerat pellentesque eros elit lobortis eleifend amet vivamus integer sed tellus quibusdam mauris. Leo cras molestie.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Gateway Section */}
      <section className="payment-gateway padding-bottom">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-lg-5">
              <div className="section-header">
                <h2 className="title wow fadeInUp" data-wow-delay=".5s">Choose your Payment Gateway</h2>
                <p className="wow fadeInUp" data-wow-delay=".6s">
                  Select the payment method that best suits your needs. We offer secure, fast, and reliable payment gateway options to ensure a smooth checkout experience. You’re in control of how you pay.
                </p>
              </div>
            </div>
            <div className="col-lg-7 wow fadeInRight">
              <div className="payment-gateway-slider">
                <div className="sigle-slider">
                  <div className="gateway-item">
                    <img src="./assets/images/gateway/BinancePay.png" alt="gateway" />
                    <span className="coin-name">Binance Pay</span>
                  </div>
                </div>
                <div className="sigle-slider">
                  <div className="gateway-item">
                    <img src="./assets/images/gateway/usdttrx.png" alt="gateway" />
                    <span className="coin-name">TRON (TRC20)</span>
                  </div>
                </div>
                <div className="sigle-slider">
                  <div className="gateway-item">
                    <img src="./assets/images/gateway/usdt_eth.png" alt="gateway" />
                    <span className="coin-name">ERC20</span>
                  </div>
                </div>
                <div className="sigle-slider">
                  <div className="gateway-item">
                    <img src="./assets/images/gateway/usdt_bnb.png" alt="gateway" />
                    <span className="coin-name">BSC (WEB20)</span>
                  </div>
                </div>
                <div className="sigle-slider">
                  <div className="gateway-item">
                    <img src="./assets/images/gateway/usdtmatic.png" alt="gateway" />
                    <span className="coin-name">Skrill</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <a href="#0" className="scrollToTop active"><i className="las la-chevron-up"></i></a>
    </>
  );
}

export default About;
