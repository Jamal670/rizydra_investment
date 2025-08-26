import React, { useEffect, useState } from 'react';

function Contact() {
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
    let loaded = 0;
    jsFiles.forEach(src => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        script.onload = () => {
          loaded += 1;
          if (loaded === jsFiles.length) {
            setIsLoading(false);
          }
        };
        document.body.appendChild(script);
      } else {
        loaded += 1;
        if (loaded === jsFiles.length) {
          setIsLoading(false);
        }
      }
    });

    // Fallback: hide loader after 2 seconds in case scripts don't load
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* preloader */}
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

      {/* Banner Section Starts Here */}
      <section className="inner-banner bg_img overflow-initial" style={{ background: "url(./assets/images/contact/bg.png) no-repeat center bottom" }}>
        <div className="container">
          <div className="inner-banner-wrapper d-flex contact">
            <div className="inner-banner-content contact-banner">
              <h2 className="inner-banner-title">
                get in touch <br />
                with us
              </h2>
              <ul className="breadcums">
                <li>
                  <a href="index.html">Home</a>
                </li>
                <li>
                  <span>Contact</span>
                </li>
              </ul>
            </div>
            <div className="contact-wrapper  fadeInUp">
              <h4 className="title">Send Us a Message</h4>
              <form className="contact-form">
                <div className="form--group">
                  <input type="text" className="form--control" placeholder="Name" />
                </div>
                <div className="form--group">
                  <input type="email" className="form--control" placeholder="Email" />
                </div>
                <div className="form--group">
                  <input type="tel" className="form--control" placeholder="Phone" />
                </div>
                
                <div className="form--group">
                  <textarea className="form--control" cols="30" rows="10" placeholder="Message"></textarea>
                </div>
                <div className="form--group">
                  <button className="custom-button" type="submit">SUBMIT NOW</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="shape1 paroller" data-paroller-factor=".2">
          <img src="./assets/images/about/balls.png" alt="about" />
        </div>
      </section>
      {/* Banner Section Ends Here */}

      {/* Contact Info Section Starts Here */}
      <section className="contact-info padding-top padding-bottom">
        <div className="container">
          <div className="row gy-5 flex-column-reverse flex-lg-row">
            <div className="col-lg-6 col-xl-7">
              <div className="row g-4 justify-content-center mb-4">
                <div className="col-md-6 col-lg-10 col-xl-6  fadeInLeft">
                  <div className="contact-info-item">
                    <div className="contact-item-thumb">
                      <img src="./assets/images/contact/location.png" alt="contact" />
                    </div>
                    <div className="contact-item-content">
                      <h4 className="title">Office Address</h4>
                      <p>
                       742 Evergreen Terrace, <br />
                        Springfield, IL 62704, USA
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row g-4 justify-content-center">
                <div className="col-md-6 col-lg-10 col-xl-6  fadeInLeft">
                  <div className="contact-info-item">
                    <div className="contact-item-thumb">
                      <img src="./assets/images/contact/email.png" alt="contact" />
                    </div>
                    <div className="contact-item-content">
                      <h4 className="title">Email Address</h4>
                      <p href="Mailto:mdudnfsddf@gmal.com">info@rizydra.com</p>
                      {/* <a href="Mailto:mdudnfsddf@gmal.com">info@example.com</a> */}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-10 col-xl-6  fadeInLeft">
                  <div className="contact-info-item">
                    <div className="contact-item-thumb">
                      <img src="./assets/images/contact/phone.png" alt="contact" />
                    </div>
                    <div className="contact-item-content">
                      <h4 className="title">Contact Number</h4>
                      <a href="https://t.me/rizydra">Telegram</a>
                      {/* <a href="Tel:90172834">(123) 456-7891 - 00626</a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xl-5  fadeInRight d-none d-lg-block">
              <div className="contact-info-thumb">
                <img src="./assets/images/contact/thumb.png" alt="contact" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Info Section Ends Here */}

      {/* Section Starts Here */}
      <section className="padding-bottom">
        <div className="container">
          <div className="row gy-5">
            <div className="col-lg-6  fadeInLeft">
              <div className="subscription-wrapper">
                <h2 className="title">Subscribe Newslatter</h2>
                <p>
                  Stay updated with the latest investment opportunities and daily commission tips — straight to your inbox.
                </p>
                <form className="subscription-form">
                  <div className="form--group">
                    <input type="email" className="form--control" placeholder="Enter email Address" />
                    <button type="submit" className="custom-button"><i className="lab la-telegram-plane"></i></button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="payment-gateway-two-wrapper">
                <div className="section-header">
                  <h2 className="title  fadeInUp">Payment Gateway</h2>
                  <p className=" fadeInUp">
                                      Select the payment method that best suits your needs. We offer secure, fast, and reliable payment gateway options to ensure a smooth checkout experience. You’re in control of how you pay.

                  </p>
                </div>
                <div className="row g-3">
                  <div className="col-6 col-md-4 col-lg-6 col-xl-5  fadeInUp" data--delay=".2s">
                    <div className="payment-item-two">
                      <div className="thumb">
                        <img src="./assets/images/gateway/usdttrx.png" alt="gateway" />
                      </div>
                      <h6 className="title">TRON (TRC20)</h6>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-6 col-xl-5  fadeInUp" data--delay=".3s">
                    <div className="payment-item-two">
                      <div className="thumb">
                        <img src="./assets/images/gateway/usdt_bnb.png" alt="gateway" />
                      </div>
                      <h6 className="title">BSC (BEP20)</h6>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-6 col-xl-5  fadeInUp" data--delay=".4s">
                    <div className="payment-item-two">
                      <div className="thumb">
                        <img src="./assets/images/gateway/usdt_eth.png" alt="gateway" />
                      </div>
                      <h6 className="title">Ethereum (ERC20)</h6>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-6 col-xl-5  fadeInUp" data--delay=".5s">
                    <div className="payment-item-two">
                      <div className="thumb">
                        <img src="./assets/images/gateway/usdtmatic.png" alt="gateway" />
                      </div>
                      <h6 className="title">Polygon POS</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Section Ends Here */}



      <a href="#0" className="scrollToTop active"><i className="las la-chevron-up"></i></a>
    </>
  );
}

export default Contact;