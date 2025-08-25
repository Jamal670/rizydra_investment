import React, { useEffect, useState } from 'react';
import api from '../Api';
import { useNavigate } from 'react-router-dom';

function UpdatePassword() {
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({ password: '', cPassword: '' });
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
        if (form.password !== form.cPassword) {
            alert('Passwords do not match!');
            return;
        }
        const password = form.password;
        const isLongEnough = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasDigit = /\d/.test(password);
        if (!isLongEnough || !hasUppercase || !hasDigit) {
            alert('Password must be at least 8 characters long, contain at least one uppercase letter, and one digit.');
            return;
        }
        try {
            // Replace with correct API call for password update
            // You need userId from route or props
            const userId = window.location.pathname.split('/').pop();
            const res = await api.put(`/forgotpass/${userId}`, {
                newPassword: form.password
            });
            alert(res.data.message || 'Password updated successfully!');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || 'Error updating password');
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
                            <h2 className="inner-banner-title">Reset Password</h2>
                            <ul className="breadcums">
                                <li>
                                    <a href="/">Home</a>
                                </li>
                                <li>
                                    <span>Reset Password</span>
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
                                <h2 className="title">Enter New Password</h2>
                                <form className="account-form" onSubmit={handleSubmit}>
                                    <div className="form--group">
                                        <i className="las la-lock"></i>
                                        <input
                                            type="password"
                                            className="form--control"
                                            placeholder="New Password"
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
                                            placeholder="Confirm Password"
                                            name="cPassword"
                                            value={form.cPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form--group">
                                        <button className="custom-button" type="submit">Reset</button>
                                    </div>
                                </form>
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

export default UpdatePassword;