import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();

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

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/Login', {
                email: form.email,
                password: form.password
            }, { withCredentials: true });
            alert(res.data.message || 'Login successful!');
            navigate('/user-dashboard');
        } catch (err) {
            alert(err.response?.data?.error || 'Invalid credentials');
        }
    };

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
                                            placeholder="Email or User Name"
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
                                        <button className="custom-button" type="submit">SIGN IN NOW</button>
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

export default Login;