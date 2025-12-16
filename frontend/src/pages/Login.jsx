import React, { useEffect, useState } from 'react';
import api from '../Api';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({ email: '', password: '' });
    const [loginLoading, setLoginLoading] = useState(false); // Add loading state for button
    const [showPassword, setShowPassword] = useState(false); // Add password visibility state
    const navigate = useNavigate();

    useEffect(() => {
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
    }, []);

    // Auto-fill credentials from localStorage
    useEffect(() => {
        const savedEmail = localStorage.getItem("savedEmail");
        const savedPassword = localStorage.getItem("savedPassword");
        if (savedEmail && savedPassword) {
            setForm({ email: savedEmail, password: savedPassword });
        }
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoginLoading(true);
        try {
            const res = await api.post('/Login', {
                email: form.email,
                password: form.password
            });

            const { user } = res.data;

            // ✅ just keep simple flags
            localStorage.setItem("authenticated", "true");
            
            // Save credentials for auto-fill
            localStorage.setItem("savedEmail", form.email);
            localStorage.setItem("savedPassword", form.password);

            if (user.email === "rizydra342@gmail.com") {
                localStorage.setItem("isAdmin", "true");   // admin flag
                window.location.href = "/admin-dashboard";
            } else {
                localStorage.setItem("isAdmin", "false");  // normal user
                window.location.href = "/user-dashboard";
            }

            setLoginLoading(false);

        } catch (err) {
            alert(err.response?.data?.error || "Invalid credentials");
            setLoginLoading(false);
        }
    };



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
            <section className="inner-banner bg_img padding-bottom" style={{ background: "url(/assets/images/about/bg.png) no-repeat right bottom" }}>
                <div className="container">
                    <div className="inner-banner-wrapper">
                        <div className="inner-banner-content">
                            <h2 className="inner-banner-title">Login</h2>
                            <ul className="breadcums">
                                <li>
                                    <a href="/">Home</a>
                                </li>
                                <li>
                                    <span>Login</span>
                                </li>
                            </ul>
                        </div>
                        <div className="inner-banner-thumb about d-none d-md-block">
                            <img src="/assets/images/account/thumb.png" alt="account" />
                        </div>
                    </div>
                </div>
                <div className="shape1 paroller" data-paroller-factor=".2">
                    <img src="/assets/images/about/balls.png" alt="about" />
                </div>
            </section>

            {/* Account Section */}
            <section className="account-section padding-top padding-bottom">
                <div className="container">
                    <div className="row align-items-center gy-5">
                        <div className="col-lg-7  d-none d-lg-block">
                            <div className="account-thumb">
                                <img src="/assets/images/account/login-thumb.png" alt="account" />
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="account-wrapper">
                                <h2 className="title">Sign In Your Account</h2>
                                <form className="account-form" onSubmit={handleSubmit}>
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
                                            type={showPassword ? "text" : "password"}
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
                                            onClick={togglePasswordVisibility}
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
                                                padding: '0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '20px',
                                                height: '20px',
                                                zIndex: 10
                                            }}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            <i className={showPassword ? "las la-eye-slash" : "las la-eye"}></i>
                                        </button>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div className="form--group custom--checkbox ">
                                            <input type="checkbox" id="check01" />
                                            <label htmlFor="check01">Remember me</label>
                                        </div>
                                        <div className="form--group forgot-pass">
                                            <a href="/pass-reset">Forgot Password?</a>
                                        </div>
                                    </div>
                                    <div className="form--group">
                                        <button
                                            className="custom-button"
                                            type="submit"
                                            disabled={loginLoading}
                                            style={{
                                                position: 'relative',
                                                minWidth: 140,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: loginLoading ? 0.7 : 1,
                                                cursor: loginLoading ? 'not-allowed' : 'pointer'
                                            }}
                                            aria-busy={loginLoading}
                                            aria-disabled={loginLoading}
                                        >
                                            {loginLoading ? (
                                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                                    <span
                                                        className="spinner-border spinner-border-sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        style={{ marginRight: 8 }}
                                                    ></span>
                                                    <span style={{ fontSize: '1rem', fontWeight: 500 }}>Signing In...</span>
                                                </span>
                                            ) : (
                                                <span style={{ width: '100%' }}>SIGN IN NOW</span>
                                            )}
                                        </button>
                                    </div>
                                </form>
                                <span className="subtitle">Don't have an account yet?</span>
                                <a href="/sign-up" className="create-account theme-four">Create Account</a>
                                <div className="shape">
                                    <img src="/assets/images/account/shape.png" alt="account" />
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

export default Login;
