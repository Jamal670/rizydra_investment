import React, { useEffect, useState } from 'react';
import api from '../Api';
import { useNavigate, useLocation } from 'react-router-dom';


function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    repassword: '',
    referralCode: ''
  });
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Get referral code from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      setForm(prev => ({ ...prev, referralCode: ref }));
    }

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
  }, [location.search]);

  // Handle input changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();

    // Password validation
    const password = form.password;
    const isLongEnough = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);

    if (!isLongEnough || !hasUppercase || !hasDigit) {
      alert('Password must be at least 8 characters long, contain at least one uppercase letter, and one digit.');
      return;
    }

    if (form.password !== form.repassword) {
      alert('Passwords do not match.');
      return;
    }
    try {
      console.log(api.defaults.baseURL);
      const res = await api.post('/UserRegister', {
        name: form.name,
        email: form.email,
        password: form.password,
        referralCode: form.referralCode
      });
      // alert(res.data.message || 'Registration successful!');
      navigate(`/otp/${res.data.user._id}/${"reg"}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  // Terms & Conditions Modal
  const TermsModal = () => (
    <div
      className="modal"
      style={{
        display: 'block',
        background: 'rgba(0,0,0,0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1050
      }}
      tabIndex="-1"
      role="dialog"
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: 600, margin: 'auto' }}
        role="document"
      >
        <div className="modal-content" style={{ position: 'relative', padding: '24px' }}>
          <button
            type="button"
            onClick={() => setShowTermsModal(false)}
            style={{
              position: 'absolute',
              top: 8,
              right: 10,
              width: '24px',
              height: '24px',
              background: 'transparent',
              border: 'none',
              fontSize: '1.2rem',
              lineHeight: '1rem',
              cursor: 'pointer',
              color: '#000',
              padding: 0
            }}
            aria-label="Close"
          >
            &times;
          </button>
          <h3 className="mb-3">Terms & Conditions</h3>
          <div style={{ maxHeight: '60vh', overflowY: 'auto', fontSize: '1rem' }}>
            <ol>
              <li><b>Account & Eligibility</b><br />
                Users must sign up/login with accurate personal information; 1 user = 1 account.<br />
                (Optional) A referral code may be entered at the time of signup; changes/attachments later are subject to platform policy.<br />
                The platform reserves the right to conduct KYC/AML verification. Services may be restricted if KYC is incomplete or failed.
              </li>
              <li><b>Deposits</b><br />
                Deposits are made via Binance; you must provide Binance transfer details/TxID proof.<br />
                Deposit credit times depend on network confirmations and verification.<br />
                The platform is not liable for delays, fees, or issues caused by third-party systems (e.g., Binance).
              </li>
              <li><b>Earnings</b><br />
                The platform calculates 1% daily return on the invested amount. Calculation, rounding, and timing follow platform policies (server time zone applies).<br />
                Earnings accrue only on verified and active balances; frozen or flagged funds do not earn returns.<br />
                Earnings are not guaranteed; the platform’s business model and policies may change at any time.
              </li>
              <li><b>Referral Program (3 Levels)</b><br />
                Level 1: You earn 3% of your direct referral’s daily earnings.<br />
                Level 2: You earn 2% from your Level 2 referral’s daily earnings.<br />
                Level 3: You earn 1% from your Level 3 referral’s daily earnings.<br />
                Prohibited: Self-referrals, fake accounts, circular referrals, and multi-accounting. Violation may result in forfeiture of earnings and account ban.
              </li>
              <li><b>Withdrawals</b><br />
                Minimum withdrawal amount, fees, cut-off times, and processing windows follow platform policy.<br />
                Withdrawals may be held or denied in cases of suspicious activity, chargebacks, or fraud.
              </li>
              <li><b>Risks & Disclaimers</b><br />
                Crypto/investment activities involve market and operational risks. Your capital is at risk.<br />
                Past performance does not guarantee future results.<br />
                The platform is provided “as-is” and may experience downtime or maintenance.
              </li>
              <li><b>Fair Use & Compliance</b><br />
                Users are responsible for compliance with AML/CFT regulations, sanctions laws, and tax obligations.<br />
                Accounts engaging in illegal activity may be suspended.<br />
                Abuse of the system (bots, exploits, etc.) may result in reversal of earnings.
              </li>
              <li><b>Data & Privacy</b><br />
                Your data is processed for service delivery, security, and compliance purposes, in accordance with our Privacy Policy.
              </li>
              <li><b>Changes</b><br />
                Terms & Conditions, fees, percentages, and schedules may change at any time.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );

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
      <section className="inner-banner bg_img padding-bottom" style={{ background: "url(./assets/images/about/bg.png) no-repeat right bottom" }}>
        <div className="container">
          <div className="inner-banner-wrapper">
            <div className="inner-banner-content">
              <h2 className="inner-banner-title">Create your account</h2>
              <ul className="breadcums">
                <li>
                  <a href="index.html">Home</a>
                </li>
                <li>
                  <span>Registration</span>
                </li>
              </ul>
            </div>
            <div className="inner-banner-thumb about d-none d-md-block">
              <img src="./assets/images/account/thumb.png" alt="account" />
            </div>
          </div>
        </div>
        <div className="shape1">
          <img src="./assets/images/about/balls.png" alt="about" />
        </div>
      </section>

      {/* Account Section */}
      <section className="account-section padding-top padding-bottom">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-7  d-none d-lg-block">
              <div className="account-thumb">
                <img src="./assets/images/account/login-thumb.png" alt="account" />
              </div>
            </div>
            <div className="col-lg-5">
              <div className="account-wrapper">
                <h2 className="title">Create Your Account</h2>
                <form className="account-form" onSubmit={handleSubmit}>
                  <div className="form--group">
                    <i className="las la-user"></i>
                    <input
                      type="text"
                      className="form--control"
                      placeholder="User Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form--group">
                    <i className="las la-user"></i>
                    <input
                      type="email"
                      className="form--control"
                      placeholder="Email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form--group">
                    <i className="las la-lock"></i>
                    <input
                      type="password"
                      className="form--control"
                      placeholder="Password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form--group">
                    <i className="las la-lock"></i>
                    <input
                      type="password"
                      className="form--control"
                      placeholder="Re - Password"
                      name="repassword"
                      value={form.repassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form--group">
                    <i className="las la-lock"></i>
                    <input
                      type="text"
                      className="form--control"
                      placeholder="Referral Code"
                      name="referralCode"
                      value={form.referralCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex">
                    <div className="form--group custom--checkbox ">
                      <input type="checkbox" id="check01" required />
                      <label htmlFor="check01">
                        I agree with all <span className="text--primary" style={{ cursor: 'pointer' }} onClick={() => setShowTermsModal(true)}>Terms & Conditions</span>
                      </label>
                    </div>
                  </div>
                  <div className="form--group">
                    <button className="custom-button" type="submit">REGISTRATION</button>
                  </div>
                </form>
                <span className="subtitle">Already you have an account here? </span>
                <a href="/login" className="create-account theme-four">Sign in</a>
                <div className="shape">
                  <img src="./assets/images/account/shape.png" alt="account" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profit Calculation Section */}
      <section className="profit-calculation overflow-hidden">
        <div className="container">
          <div className="profit-calculation-wrapper">
            <h3 className="title">Calculate How Much You Profit</h3>
            <form className="profit-form">
              <div className="row gy-3">
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
              <button type="submit" className="custom-button px-0">INVEST NOW</button>
            </div>
          </div>
        </div>
      </section>


      <a href="#0" className="scrollToTop active"><i className="las la-chevron-up"></i></a>

      {/* Terms & Conditions Modal */}
      {showTermsModal && <TermsModal />}
    </>
  );
}

export default Signup;