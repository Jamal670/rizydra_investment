import React, { useEffect, useState } from 'react';
import api from '../Api.jsx';
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
    const [registerLoading, setRegisterLoading] = useState(false);
    const [isReferralLocked, setIsReferralLocked] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showReferralField, setShowReferralField] = useState(false);

    // Get referral code from URL on mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ref = params.get("ref");
        if (ref) {
            setForm(prev => ({ ...prev, referralCode: ref }));
            setIsReferralLocked(true);
            setShowReferralField(true);
        }

        // Dynamically load CSS and JS; hide loader when all are loaded
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
        const isLongEnough = password.length >= 6;

        if (!isLongEnough) {
            alert('Password should contain at least 6 characters.');
            return;
        }

        if (form.password !== form.repassword) {
            alert('Passwords do not match.');
            return;
        }
        setRegisterLoading(true);
        try {
            const res = await api.post('/UserRegister', {
                name: form.name,
                email: form.email,
                password: form.password,
                referralCode: form.referralCode
            }, {
                withCredentials: true
            });
            navigate(`/otp/${res.data.user._id}/${"reg"}`);
        } catch (err) {
            alert(err.response?.data?.error || 'Registration failed');
            setRegisterLoading(false);
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
                                Earnings are not guaranteed; the platform's business model and policies may change at any time.
                            </li>
                            <li><b>Referral Program (3 Levels)</b><br />
                                Level 1: You earn 3% of your direct referral's daily earnings.<br />
                                Level 2: You earn 2% from your Level 2 referral's daily earnings.<br />
                                Level 3: You earn 1% from your Level 3 referral's daily earnings.<br />
                                Prohibited: Self-referrals, fake accounts, circular referrals, and multi-accounting. Violation may result in forfeiture of earnings and account ban.
                            </li>
                            <li><b>Withdrawals</b><br />
                                Minimum withdrawal amount, fees, cut-off times, and processing windows follow platform policy.<br />
                                Withdrawals may be held or denied in cases of suspicious activity, chargebacks, or fraud.
                            </li>
                            <li><b>Risks & Disclaimers</b><br />
                                Crypto/investment activities involve market and operational risks. Your capital is at risk.<br />
                                Past performance does not guarantee future results.<br />
                                The platform is provided "as-is" and may experience downtime or maintenance.
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
                                    <div className="form--group" style={{ position: 'relative' }}>
                                        <i className="las la-lock"></i>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="form--control"
                                            placeholder="Password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            required
                                            style={{ paddingRight: '45px' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            style={{
                                                position: 'absolute',
                                                right: '15px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#666',
                                                fontSize: '18px',
                                                padding: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '20px',
                                                height: '20px',
                                                zIndex: 10
                                            }}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            <i className={showPassword ? 'las la-eye-slash' : 'las la-eye'}></i>
                                        </button>
                                    </div>
                                    <div className="form--group" style={{ position: 'relative' }}>
                                        <i className="las la-lock"></i>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className="form--control"
                                            placeholder="Re - Password"
                                            name="repassword"
                                            value={form.repassword}
                                            onChange={handleChange}
                                            required
                                            style={{ paddingRight: '45px' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(prev => !prev)}
                                            style={{
                                                position: 'absolute',
                                                right: '15px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#666',
                                                fontSize: '18px',
                                                padding: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '20px',
                                                height: '20px',
                                                zIndex: 10
                                            }}
                                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                        >
                                            <i className={showConfirmPassword ? 'las la-eye-slash' : 'las la-eye'}></i>
                                        </button>
                                    </div>

                                    {/* Referral Code Section */}
                                    <div className="form--group" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                        {/* Radio Button on Left */}
                                        <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
  <input
    type="checkbox"
    id="referralToggle"
    checked={showReferralField}
    onChange={(e) => setShowReferralField(e.target.checked)}
    style={{
      marginRight: '8px',
      width: '18px',
      height: '18px',
      cursor: 'pointer',
      borderRadius: '50%',           // ✅ circular shape
      accentColor: '#007bff',        // ✅ blue color (modern browsers)
      border: '2px solid #007bff',   // ✅ blue border
    }}
  />
  <label
    htmlFor="referralToggle"
    style={{
      margin: 0,
      cursor: 'pointer',
      fontWeight: '500',
      color: '#007bff',              // ✅ label text blue
    }}
  >
    Referral code
  </label>
</div>

                                        
                                        {/* Referral Input Field on Right - 50% width */}
                                        {showReferralField && (
                                            <div style={{ flex: '1', maxWidth: '100%' }}>
                                            <input
                                              type="text"
                                              className="form--control"
                                              placeholder={isReferralLocked ? "Referral Code (locked)" : "Referral Code (optional)"}
                                              name="referralCode"
                                              value={form.referralCode}
                                              onChange={handleChange}
                                              readOnly={isReferralLocked}
                                              style={{
                                                background: isReferralLocked ? '#f5f5f5' : undefined,
                                                color: isReferralLocked ? '#888' : undefined,
                                                cursor: isReferralLocked ? 'not-allowed' : undefined,
                                                fontWeight: isReferralLocked ? 600 : undefined,
                                                borderColor: isReferralLocked ? '#007bff' : undefined,
                                                borderRadius: '1.5rem',
                                              }}
                                            />
                                          </div>
                                          
                                        )}
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
                                        <button
                                            className="custom-button"
                                            type="submit"
                                            disabled={registerLoading}
                                            style={{
                                                position: 'relative',
                                                minWidth: 140,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: registerLoading ? 0.7 : 1,
                                                cursor: registerLoading ? 'not-allowed' : 'pointer'
                                            }}
                                            aria-busy={registerLoading}
                                            aria-disabled={registerLoading}
                                        >
                                            {registerLoading ? (
                                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                                    <span
                                                        className="spinner-border spinner-border-sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        style={{ marginRight: 8 }}
                                                    ></span>
                                                    <span style={{ fontSize: '1rem', fontWeight: 500 }}>Registering...</span>
                                                </span>
                                            ) : (
                                                <span style={{ width: '100%' }}>REGISTRATION</span>
                                            )}
                                        </button>
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

            <a href="#0" className="scrollToTop active"><i className="las la-chevron-up"></i></a>

            {/* Terms & Conditions Modal */}
            {showTermsModal && <TermsModal />}
        </>
    );
}

export default Signup;