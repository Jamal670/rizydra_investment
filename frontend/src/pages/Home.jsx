// filepath: d:\jani_Rizydra\client\src\pages\Home.js
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(Cookies.get("token"));

  useEffect(() => {
    // Check token on mount and whenever cookies change
    const checkToken = () => setToken(Cookies.get("token"));
    checkToken();

    // Optionally, set up an interval to check for cookie changes
    const interval = setInterval(checkToken, 1000);

    // Hide loader after 1 second
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

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


  return (
    <>
      {/* <Helmet>
        <title>Rizydra</title>
        <meta name="description" content="Welcome to Rizydra, your trusted partner in investment solutions." />
      </Helmet> */}
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
      <section className="banner-section bg_img" style={{ background: 'url(/assets/images/banner/bg.png) center bottom' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-4  d-none d-lg-block">
              <div className="banner-thumb">
                <img src="/assets/images/banner/thumb.png" alt="banner" />
                <div className="shapes ">
                  <div className="shape2">
                    <img src="/assets/images/banner/shape1.png" alt="banner" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="banner-content">
                <h1 className="banner-title">Rizydra <span className="text--base">Investment </span><span> Solutions</span></h1>
                <span className="subtitle">Your Journey to Financial Freedom Begins Here - Unlock Consistent, Automated Returns Through a Platform Designed for Simplicity & Security
                </span>
                <div className="button-group d-flex flex-wrap align-items-center">
                  {token ? (
                    <a href="/user-dashboard" className="cmn--btn btn--secondary">
                      Dashboard
                    </a>
                  ) : (
                    <a href="/sign-up" className="cmn--btn btn--secondary">
                      Get Started
                    </a>
                  )}
                  <a href="https://www.youtube.com/@rizydra" target='_blank' className="video-button"><i className="las la-play"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-work padding-top padding-bottom">
        <div className="container">
          <div className="row justif-content-center align-items-center">
            <div className="col-lg-6">
              <div className="how-work-left-content">
                <div className="section-header wow fadeInUp">
                  <span className="subtitle">How to Do It</span>
                  <h2 className="title">HOW TO INVEST EASILY</h2>
                  <p>Investing doesn't have to be complicated. Our streamlined process guides you through three simple steps to financial growth. Start building your future today with confidence and ease.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row align-items-center gy-4">
                <div className="col-md-6 col-sm-6">
                  <div className="row gy-4">
                    <div className="col-12 wow fadeInUp" data-wow-delay=".2s">
                      <div className="how-work-item">
                        <div className="how-work-item-thumb theme-one">
                          <i className="las la-atlas"></i>
                        </div>
                        <div className="how-work-item-content">
                          <h4 className="title"><a href="sign-up.html">Quick Registration</a></h4>
                          <p>Start your investment journey in minutes. Our fast and secure registration process ensures you're ready to go without delay.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 wow fadeInUp" data-wow-delay=".3s">
                      <div className="how-work-item gradient-two">
                        <div className="how-work-item-thumb theme-two">
                          <i className="las la-hand-holding-usd"></i>
                        </div>
                        <div className="how-work-item-content">
                          <h4 className="title"><a href="investment-plan-01.html">Make An Invest</a></h4>
                          <p>Explore diverse investment opportunities and fund your portfolio with ease. Our platform makes investing straightforward for everyone.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 wow fadeInUp" data-wow-delay=".4s">
                  <div className="how-work-item gradient-four">
                    <div className="how-work-item-thumb theme-four">
                      <i className="las la-wallet"></i>
                    </div>
                    <div className="how-work-item-content">
                      <h4 className="title"><a href="login.html">Get Your Profit</a></h4>
                      <p>Watch your investments grow and easily withdraw your returns. We ensure a transparent and efficient profit realization process.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Section */}
      <div className="sponsor-section wow fadeInUp">
        <div className="container">
          <div className="sponsor-slider">
            {['aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh', 'ii'].map((img, idx) => (
              <div className="single-slide" key={idx}>
                <div className="brand-item">
                  <img src={`/assets/images/sponsor/${img}.png`} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <section className="feature-section padding-top">
        <div className="container">
          <div className="row align-items-center gy-5 ">
            <div className="col-lg-6 col-md-10 wow fadeInLeft d-none d-lg-block">
              <div className="feature-thumb">
                <img src="/assets/images/feature/thumb.png" alt="feature" />
              </div>
            </div>
            <div className="col-lg-6 wow fadeInRight">
              <div className="feature-content">
                <div className="section-header">
                  <span className="subtitle">RIZYDRA HIGHLIGHTS</span>
                  <h2 className="title">Our Key Features</h2>
                  <p>
                    Discover Rizydra's core advantages. We provide a seamless, rewarding experience, managing your investments with expertise and care.
                  </p>
                </div>
                <h3 className="title-two">Account Management</h3>
                <p>
                  Gain full control over your financial portfolio with Rizydra's robust account management tools. From detailed insights to easy transactions, we provide everything you need to oversee your progress effortlessly and confidently.
                </p>
                <ul className="feature-info-list">
                  <li>
                    <b>Personalized Portfolio:</b> Intuitive dashboard for clear performance and growth tracking.
                  </li>
                  <li>
                    <b>Secure & Accessible:</b> Manage your account anytime, anywhere, with top-tier security.
                  </li>
                  <li>
                    <b>Expert Support:</b> Access our knowledgeable team ready to assist with any questions or guidance you need.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Section */}
      <section className="plan-section padding-top">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="section-header text-center">
                <h2 className="title wow fadeInUp" data-wow-delay=".4s">Grow Your Wealth with Confidence</h2>
                <p className="wow fadeInUp" data-wow-delay=".6s">
                  Our cutting-edge platform offers secure, high-yield investment opportunities tailored to your financial goals. With competitive returns, transparent processes, and expert support, we empower you to maximize profits effortlessly.
                </p>
              </div>
            </div>
          </div>
          <div className="plan-wrapper row g-4">
            <div className="col-sm-6 col-lg-12">
              <div className="plan-item wow fadeIn" data-wow-delay=".1s">
                <div className="plan-inner-part">
                  <h3>1</h3>  &nbsp; <h4>% </h4>  &nbsp;  &nbsp; <h3> Per Day</h3>
                </div>
                <div className="plan-inner-part">
                  <ul className="plan-invest-limit">
                    <li>
                      <i className="fas fa-check"></i>
                      Deposit Anytime
                    </li>
                    <li>
                      <i className="fas fa-check"></i>
                      Withdraw Anytime
                    </li>
                  </ul>
                </div>
                <div className="plan-inner-part">
                  <h4>Safe & Secure</h4>
                </div>
                <div className="plan-inner-part">
                  <a href="/sign-up" className="cmn--btn-2">Invest now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <section className="counter-section padding-top">
        <div className="container">
          <div className="row justif-content-center gy-5">
            <div className="col-lg-3 col-sm-6">
              <div className="counter-wrapper">
                <div className="counter-item">
                  <div className="counter-inner">
                    <span className="odometer title" data-odometer-final="100"></span>
                    <h2 className="counter-sign">%</h2>
                  </div>
                </div>
                <span className="info">Customer Satisfaction</span>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="counter-wrapper">
                <div className="counter-item">
                  <div className="counter-inner">
                    <span className="odometer title" data-odometer-final="1.2"></span>
                    <h2 className="counter-sign">K</h2>
                  </div>
                </div>
                <span className="info">Active Investors</span>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="counter-wrapper">
                <div className="counter-item">
                  <div className="counter-inner">
                    <span className="odometer title" data-odometer-final="10"></span>
                    <h2 className="counter-sign">K</h2>
                  </div>
                </div>
                <span className="info">Average Investment</span>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="counter-wrapper">
                <div className="counter-item">
                  <div className="counter-inner">
                    <span className="odometer title" data-odometer-final="100"></span>
                    <h2 className="counter-sign">K</h2>
                  </div>
                </div>
                <span className="info">Affiliate Earnings Paid</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="choose-us-three padding-top padding-bottom overflow-hidden">
        <div className="container">
          <div className="row gy-5">
            <div className="col-xl-6 col-lg-5 d-none d-lg-block wow slideInLeft">
              <div className="choose-us-thumb">
                <img src="/assets/images/choose-us/thumb.png" alt="choose-us" />
              </div>
            </div>
            <div className="col-xl-6 col-lg-7">
              <div className="choose-us-right-content">
                <div className="section-header">
                  <span className="subtitle wow fadeInUp">WHY CHOOSE US</span>
                  <h2 className="title wow fadeInUp" data-wow-delay=".5s">Why You Should Stay With Us</h2>
                  <p className="wow fadeInUp" data-wow-delay=".6s">
                    Stay with us for reliable service, transparent investments, and continuous support. Your trusted partner in building lasting financial success.
                  </p>
                </div>
                <div className="row g-4">
                  <div className="col-lg-4 col-md-4 col-sm-6">
                    <div className="choose-item">
                      <div className="choose-thumb">
                        <img src="/assets/images/choose-us/lock.png" alt="choose-us" />
                      </div>
                      <div className="choose-content">
                        <h6 className="title">High Security</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6">
                    <div className="choose-item">
                      <div className="choose-thumb">
                        <img src="/assets/images/choose-us/business-ico.png" alt="choose-us" />
                      </div>
                      <div className="choose-content">
                        <h6 className="title">Free Transactions</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6">
                    <div className="choose-item">
                      <div className="choose-thumb">
                        <img src="/assets/images/choose-us/user.png" alt="choose-us" />
                      </div>
                      <div className="choose-content">
                        <h6 className="title">Supper Dashboard</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-seciton pb-180">
        <div className="container">
          <div className="row gy-4 align-items-center justify-content-center">
            <div className="col-lg-5 d-none d-lg-block  wow slideInLeft">
              <div className="testimonial-thumb">
                <img src="/assets/images/testimonial/thumb2.png" alt="testimonial" />
              </div>
            </div>
            <div className="col-lg-7 col-md-10">
              <div className="testimonial-content">
                <div className="section-header text-center">
                  <span className="subtitle wow fadeInUp">our happly client</span>
                  <h2 className="title wow fadeInUp" data-wow-delay=".5s">Discover Our Happy
                    Client Feedback</h2>
                </div>
                <div className="testimonial-slider-wrapper">
                  <div className="testimonial-img">
                    <div className="testimonial-img-slider">
                      <div className="img-item">
                        <img src="/assets/images/testimonial/bb.png" alt="testimonial" />
                      </div>
                      <div className="img-item">
                        <img src="/assets/images/testimonial/aa.png" alt="testimonial" />
                      </div>
                      <div className="img-item">
                        <img src="/assets/images/testimonial/cc.png" alt="testimonial" />
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-slider">
                    <div className="content-item">
                      <div className="quote-icon">
                        <i className="las la-quote-left"></i>
                      </div>
                      <div className="content-inner">
                        <p>
                          Safe, transparent, and easy to use. I’ve tried other platforms, but this is the one I trust with my money.
                        </p>
                        <h5 className="name">Robindronath Chondro</h5>
                        <span className="designation">Businessman</span>
                      </div>
                    </div>
                    <div className="content-item">
                      <div className="quote-icon">
                        <i className="las la-quote-left"></i>
                      </div>
                      <div className="content-inner">
                        <p>
                          The affiliate program is a game changer! Not only am I earning from my investment, but also from sharing it with others.
                        </p>
                        <h5 className="name">Jubayer Al Somser</h5>
                        <span className="designation">Developer</span>
                      </div>
                    </div>
                    <div className="content-item">
                      <div className="quote-icon">
                        <i className="las la-quote-left"></i>
                      </div>
                      <div className="content-inner">
                        <p>
                          I started with a small investment and was amazed by the consistent returns. This platform truly delivers on its promises!
                        </p>
                        <h5 className="name">Raihan Rafuj</h5>
                        <span className="designation">Designer</span>
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
                            We offer a secure, transparent, and rewarding investment platform with competitive returns and a user-friendly experience. Our multi-level affiliate program, flexible payment options including cryptocurrency, and dedicated support team set us apart — making your investment journey simple, smart, and profitable.
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
                  <a href="/affiliate" className="cmn--btn">View Details</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="shape">
          <img src="/assets/images/affiliate/bg-map.png" alt="affiliate" />
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

export default Home;