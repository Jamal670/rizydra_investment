import React, { useEffect, useState } from 'react';

function About() {
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      // Dynamically load CSS and JS files; hide loader when all are loaded
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
      const total = cssFiles.length + jsFiles.length;
      const markLoaded = () => {
        loaded += 1;
        if (loaded >= total) setIsLoading(false);
      };

      cssFiles.forEach(href => {
        const existing = document.querySelector(`link[href="${href}"]`);
        if (existing) {
          markLoaded();
        } else {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          link.onload = markLoaded;
          link.onerror = markLoaded;
          document.head.appendChild(link);
        }
      });

      jsFiles.forEach(src => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          markLoaded();
        } else {
          const script = document.createElement('script');
          script.src = src;
          script.async = false;
          script.onload = markLoaded;
          script.onerror = markLoaded;
          document.body.appendChild(script);
        }
      });

      return () => { /* no-op */ };
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
                  <h2 className="title mx-100">Why You Should Stay With Us</h2>
                  <p className=" fadeInUp" data--delay=".6s">
                    We don’t just offer earnings, we create opportunities that turn dreams into reality.
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
                        <p>Your data and investments are fully secured with advanced encryption, ensuring a safe and reliable platform where trust always comes first</p>
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
                        <p>Enjoy quick withdrawals with hassle-free payments processed directly to your account — all within 24 hours, without any delays.</p>
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
                        <p>A legally registered company you can trust, built on transparency and credibility.</p>
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
                        <p>Multi-layer security with advanced systems keeps your funds safe 24/7.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Help Section */}
      <section className="help-section  overflow-hidden">
        <div className="container">
          <div className="row align-items-center gy-5 flex-column-reverse flex-lg-row">
            <div className="col-lg-6">
              <div className="help-content">
                <div className="section-header">
                  <span className="subtitle wow fadeInUp">we are ready for your help</span>
                  <h2 className="title wow fadeInUp" data-wow-delay=".5s">How We Can Help You?</h2>
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
                <div className="tab-content">
                  <div className="tab-pane show fade active" id="investor">
                    <div className="faq-wrapper">
                      <div className="faq-item wow fadeInUp" data-wow-delay=".3s">
                        <div className="faq-title">
                          <h5 className="title">Why You Should Become An Investor?</h5>
                          <div className="arrow">
                            <i className="fas fa-angle-up"></i>
                          </div>
                        </div>
                        <div className="faq-content">
                          <p>
                            Becoming an investor allows you to grow your money over time, build long-term wealth, and achieve financial independence. Instead of just saving, investing helps your money work for you through potential returns, compounding, and passive income. It's a smart step toward securing your future.
                          </p>
                        </div>
                      </div>
                      <div className="faq-item open active wow fadeInUp" data-wow-delay=".4s">
                        <div className="faq-title">
                          <h5 className="title">Can I Invest Using Cryptocurrency?</h5>
                          <div className="arrow">
                            <i className="fas fa-angle-up"></i>
                          </div>
                        </div>
                        <div className="faq-content">
                          <p>
                            Yes, you can invest using cryptocurrency. We accept popular digital currencies as a payment method, making it easy and secure for crypto holders to grow their investments. Just choose your preferred crypto at checkout or during the funding process.
                          </p>
                        </div>
                      </div>
                      <div className="faq-item wow fadeInUp" data-wow-delay=".5s">
                        <div className="faq-title">
                          <h5 className="title">Why You Choose Us?</h5>
                          <div className="arrow">
                            <i className="fas fa-angle-up"></i>
                          </div>
                        </div>
                        <div className="faq-content">
                          <p>
                            A secure and transparent platform built on risk-controlled, automated trading. Our system is designed to target up to 20% monthly returns, supported by smart automation, flexible crypto payments, and a reliable affiliate program - all backed by a dedicated support team.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane show fade" id="privacy">
                    <div className="faq-wrapper">
                      <div className="faq-item">
                        <div className="faq-title">
                          <h5 className="title">How do you protect my personal information?</h5>
                          <div className="arrow">
                            <i className="fas fa-angle-up"></i>
                          </div>
                        </div>
                        <div className="faq-content">
                          <p>
                            We use advanced encryption and secure server technology to protect your personal data. All information you provide is stored safely and handled in compliance with global privacy standards.
                          </p>
                        </div>
                      </div>
                      <div className="faq-item open active">
                        <div className="faq-title">
                          <h5 className="title">Will my data be shared with third parties?</h5>
                          <div className="arrow">
                            <i className="fas fa-angle-up"></i>
                          </div>
                        </div>
                        <div className="faq-content">
                          <p>
                            No, we do not sell or share your personal information with third parties without your consent. Your data is used solely to provide services, improve your experience, and comply with legal requirements.
                          </p>
                        </div>
                      </div>
                      <div className="faq-item">
                        <div className="faq-title">
                          <h5 className="title">Is my financial information safe on your platform?</h5>
                          <div className="arrow">
                            <i className="fas fa-angle-up"></i>
                          </div>
                        </div>
                        <div className="faq-content">
                          <p>
                            Yes, your financial information is fully protected. We partner with trusted payment gateways and implement strict security protocols to ensure that your transactions and investment details remain confidential and secure.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane show fade" id="account">
                    <div className="faq-wrapper">
                      <div className="faq-item">
                        <div className="faq-title">
                          <h5 className="title">How do I create an account on your platform?</h5>
                          <div className="arrow">
                            <i className="fas fa-angle-up"></i>
                          </div>
                        </div>
                        <div className="faq-content">
                          <p>
                            To create an account, click the Sign Up button on our homepage. Fill in your basic information, such as name, email, and password, then verify your email to activate your account.
                          </p>
                        </div>
                      </div>
                      <div className="faq-item open active">
                        <div className="faq-title">
                          <h5 className="title">Can I update my account details later?</h5>
                          <div className="arrow">
                            <i className="fas fa-angle-up"></i>
                          </div>
                        </div>
                        <div className="faq-content">
                          <p>
                            Absolutely. You can update your profile information, contact details, and password anytime from your account dashboard. Just log in and go to the Account Settings section.
                          </p>
                        </div>
                      </div>
                      <div className="faq-item">
                        <div className="faq-title">
                          <h5 className="title">What should I do if I forget my password?</h5>
                          <div className="arrow">
                            <i className="fas fa-angle-up"></i>
                          </div>
                        </div>
                        <div className="faq-content">
                          <p>
                            If you forget your password, click on the “Forgot Password?” link on the login page. Enter your registered email address, and we’ll send you a link to reset your password securely.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                  Our clients smiles are our biggest achievement, and their words inspire our growth.
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
                  <h4 className="name">Michael Carter</h4>
                  <span className="designation">Property Dealer</span>
                  <p>"I invested $10,000 and now I’m earning around $100 daily, plus extra income from referral users. The platform is transparent and payments are always on time — truly life-changing!</p>
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
                  <h4 className="name">James Anderson</h4>
                  <span className="designation">Software Engineer</span>
                  <p>I’ve tried many platforms, but this one stands out for its quick withdrawals and reliability. The process is smooth and I feel secure with my funds here.</p>
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
                  <h4 className="name">David Miller</h4>
                  <span className="designation">Freelancer</span>
                  <p>Being a freelancer, I wanted a safe side income. This system has helped me grow financially with ease.</p>
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
                  <h4 className="name">Robert Wilson</h4>
                  <span className="designation">Business Consultant</span>
                  <p>As a businessman, I value trust and speed. This platform delivers both — earnings are consistent, and the referral program gives a nice boost.</p>
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
                    <span className="coin-name">Tron (TRC20)</span>
                  </div>
                </div>
                <div className="sigle-slider">
                  <div className="gateway-item">
                    <img src="./assets/images/gateway/usdt_eth.png" alt="gateway" />
                    <span className="coin-name">Ethereum (ERC20)</span>
                  </div>
                </div>
                <div className="sigle-slider">
                  <div className="gateway-item">
                    <img src="./assets/images/gateway/usdt_bnb.png" alt="gateway" />
                    <span className="coin-name">BSC (BEP20)</span>
                  </div>
                </div>
                <div className="sigle-slider">
                  <div className="gateway-item">
                    <img src="./assets/images/gateway/usdtmatic.png" alt="gateway" />
                    <span className="coin-name">Polygon POS</span>
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
