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
          <div className="loader-bg">
            <div className="loader-p"></div>
          </div>
          <div className="overlay"></div>
        </>
      )}

      
      {/* Banner Section */}
      <section className="inner-banner bg_img" style={{ background: 'url(/assets/images/privacy-policy/bg.png) no-repeat center bottom' }}>
        <div className="container">
          <div className="inner-banner-wrapper">
            <div className="inner-banner-content">
              <h2 className="inner-banner-title">investment plan</h2>
              <ul className="breadcums">
                <li><a href="/">Home</a></li>
                <li><span>investment plan</span></li>
              </ul>
            </div>
            <div className="inner-banner-thumb d-none d-md-block">
              <img src="/assets/images/investment/thumb.png" alt="investment" />
            </div>
          </div>
        </div>
        <div className="shape1 paroller" data-paroller-factor=".2">
          <img src="/assets/images/about/balls.png" alt="about" />
        </div>
      </section>

      {/* Plan Section Two */}
      <section className="plan-section padding-top padding-bottom overflow-hidden">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="section-header text-center">
                <span className="subtitle  fadeInUp">choose your plan</span>
                <h2 className="title">our investment plan</h2>
                <p>
                  Praesent nibh aut vivamusad quis in tortor aenean ligula non lacinia quisque. Purus nunc tellus ac nulla praesent quis porttitor sit arcu congue auctor ut amet.
                </p>
              </div>
            </div>
          </div>
          <div className="row gy-4 justify-content-center">
            {/* Plan Items - repeat as needed, example below */}
            {[{
              percent: '07%', days: '30', min: '15 USD', max: '1000 USD', daily: '07% Daily', subtitle: 'for 30 calendar days'
            }, {
              percent: '10%', days: '15', min: '15 USD', max: '1000 USD', daily: '10% Daily', subtitle: 'for 15 calendar days'
            }, {
              percent: '25%', days: '45', min: '15 USD', max: '1000 USD', daily: '25% Daily', subtitle: 'for 45 calendar days'
            }, {
              percent: '30%', days: '60', min: '15 USD', max: '1000 USD', daily: '30% Daily', subtitle: 'for 60 calendar days'
            }].map((plan, idx) => (
              <div className="col-sm-6 col-md-10 col-xl-6  slideInUp" key={idx}>
                <div className="plan-item-two">
                  <div className="left-content">
                    <h2 className="title">{plan.daily}</h2>
                    <h5 className="subtitle">{plan.subtitle}</h5>
                  </div>
                  <div className="right-content">
                    <ul className="plan-info">
                      <li><span className="info">principal</span><span className="result">Included</span></li>
                      <li><span className="info">Total retan </span><span className="result">160%</span></li>
                      <li><span className="info">Minimum</span><span className="result">{plan.min}</span></li>
                      <li><span className="info">Maximum</span><span className="result">{plan.max}</span></li>
                    </ul>
                  </div>
                  <div className="plan-hover">
                    <div className="left-content">
                      <h2 className="title">{plan.daily}</h2>
                      <h5 className="subtitle">{plan.subtitle}</h5>
                    </div>
                    <div className="right-content">
                      <a href="/login" className="invest-button">Invest Now</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              <h2 className="title">30% <br />
                <span>Affiliate Commission</span>
              </h2>
              <p>
                Phasellus a non dui hymenaeos mi ideu non ut lacus, nec erat consequataceuaugueid augue gravida consequat Magna erat nuncsit.
              </p>
              <a href="/affiliate" className="cmn--btn">View Details</a>
              <div className="shape1">
                <img src="/assets/images/commission/shape1.png" alt="commission" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Transaction Section */}
      <section className="latest-transaction-section padding-top padding-bottom overflow-hidden">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="section-header text-center">
                <span className="subtitle">latest transaction</span>
                <h2 className="title mx-100">Check Latest Deposit & Withdrow</h2>
                <p>
                  Praesent nibh aut vivamusad quis in tortor aenean ligula non lacinia quisque. Purus nunc tellus ac nulla praesent quis porttitor sit arcu congue auctor ut amet.
                </p>
              </div>
            </div>
          </div>
          {/* Tabs and tables omitted for brevity, can be added as static content if needed */}
        </div>
      </section>

      {/* Affiliate Section */}
      <section className="affiliate-section padding-bottom">
        <div className="container">
          <div className="row gy-5 align-items-center flex-column-reverse flex-lg-row">
            <div className="col-lg-7 col-xl-6">
              <div className="affiliate-content-two">
                <div className="section-header">
                  <span className="subtitle  fadeInUp">Affiliate program</span>
                  <h2 className="title  fadeInUp" data--delay=".5s">Make Money By Affiliate Without Invest</h2>
                </div>
                <div className="affiliate-item-wrapper-two">
                  {[1,2,3].map((item, idx) => (
                    <div className="affiliate-item-two  fadeInUp" key={idx}>
                      <div className="left-content">
                        <h3 className="percent">05%</h3>
                        <span className="serial">1st</span>
                      </div>
                      <div className="right-content">
                        <h4 className="title">Business Affiliate</h4>
                        <p>Massa nulla curabitur dolor, magna vitae wisiat venenatis ante pede. Inneque velit adipiscing </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-5  col-xl-6 d-none d-lg-block  fadeInRight">
              <div className="affiliate-thumb direction-ltr">
                <img src="/assets/images/affiliate/thumb2.png" alt="affiliate" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profit Calculation Section */}
      <section className="profit-calculation wow slideInUp overflow-hidden">
        <div className="container">
          <div className="profit-calculation-wrapper">
            <h3 className="title">Calculate How Much You Profit</h3>
            <form className="profit-form">
              <div className="row g-4">
                <div className="col-lg-4 col-md-6">
                  <div className="form--group">
                    <select>
                      <option value="plan01">Select the Plan</option>
                      <option value="plan01">Business Plan</option>
                      <option value="plan01">Professional Plan</option>
                      <option value="plan01">Individual Plan</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="form--group">
                    <select>
                      <option value="plan01">Select the Currency</option>
                      <option value="plan01">Bitcoin</option>
                      <option value="plan01">Ethereum</option>
                      <option value="plan01">Ripple</option>
                    </select>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="form--group">
                    <input type="text" className="form--control" placeholder="Enter the Ammount" required />
                  </div>
                </div>
              </div>
            </form>
            <div className="profit-title-wrapper d-flex justify-content-between my-5 mb-3">
              <h5 className="daily-profit text--secondary">Daily Profit - <span className="ammount">0.1200</span>BTC</h5>
              <h5 className="daily-profit theme-four">Total Profit - <span className="ammount">24.1200</span>BTC</h5>
            </div>
            <div className="invest-range-area">
              <div className="main-amount">
                <input type="text" className="calculator-invest" id="btc-amount" readOnly />
              </div>
              <div className="invest-amount" data-min="01 BTC" data-max="10000 BTC">
                <div id="btc-range" className="invest-range-slider"></div>
              </div>
              <button type="submit" className="custom-button px-0">Invest now</button>
            </div>
          </div>
        </div>
      </section>

      

      <a href="#0" className="scrollToTop active"><i className="las la-chevron-up"></i></a>
    </>
  );
}

export default EarningPlan;