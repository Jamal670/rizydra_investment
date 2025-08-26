import React, { useEffect, useState } from 'react';

function EarningPlan() {
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

      <div className="overlay"></div>

      

      {/* Banner Section */}
      <section className="inner-banner bg_img" style={{ background: 'url(./assets/images/privacy-policy/bg.png) no-repeat center bottom' }}>
        <div className="container">
          <div className="inner-banner-wrapper">
            <div className="inner-banner-content">
              <h2 className="inner-banner-title">investment plan</h2>
              <ul className="breadcums">
                <li><a href="index.html">Home</a></li>
                <li><span>investment plan</span></li>
              </ul>
            </div>
            <div className="inner-banner-thumb d-none d-md-block">
              <img src="./assets/images/investment/thumb.png" alt="investment" />
            </div>
          </div>
        </div>
        <div className="shape1 paroller" data-paroller-factor=".2">
          <img src="./assets/images/about/balls.png" alt="about" />
        </div>
      </section>

      {/* Plan Section Two */}
      <section className="plan-section padding-top padding-bottom overflow-hidden">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="section-header text-center">
                <span className="subtitle  fadeInUp">With Easy Two Steps</span>
                <h2 className="title">EARN EXTRA</h2>
                <p>
                  Step 1: Register & verify account, deposit to activate your profile.
                  <br /> Step 2: Join our Telegram bot to receive real-time trading signals.
                  <br /> Just follow only provided signals and start earning with ease!
                </p>
              </div>
            </div>
          </div>
          <div className="row gy-4 justify-content-center">
            <div className="col-sm-6 col-md-10 col-xl-6  slideInUp">
              <div className="plan-item-two">
                <div className="left-content">
                  <h2 className="title">&gt;&gt;&gt; Step 1</h2>
                  <h5 className="subtitle"></h5>
                </div>
                <div className="right-content">
                  <ul className="plan-info">
                    <li><span className="info">Create</span><span className="result">Account</span></li>
                    <li><span className="info">Verify</span><span className="result">Identity</span></li>
                    <li><span className="info">Min Deposit</span><span className="result">50 USD</span></li>
                  </ul>
                </div>
                <div className="plan-hover">
                  <div className="left-content">
                    <h5 className="subtitle">Create & Verify your Account</h5>
                  </div>
                  <div className="right-content">
                    <a href="https://market-qx.pro/sign-up/?lid=1358430" className="invest-button">Create Account</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-10 col-xl-6  slideInUp">
              <div className="plan-item-two">
                <div className="left-content">
                  <h2 className="title">&gt;&gt;&gt; Step 2</h2>
                </div>
                <div className="right-content">
                  <ul className="plan-info">
                    <li><span className="info">Select</span><span className="result">Live Pairs</span></li>
                    <li><span className="info">Min Returns </span><span className="result">70 %</span></li>
                    <li><span className="info">Max Returns</span><span className="result">92 %</span></li>
                  </ul>
                </div>
                <div className="plan-hover">
                  <div className="left-content">
                    <h5 className="subtitle">ACCESS BEST FOR FREE NOW</h5>
                  </div>
                  <div className="right-content">
                    <a href="https://t.me/rizydra_bot" className="invest-button">Telegram Link</a>
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

export default EarningPlan;