import React, { useEffect, useState } from 'react';
import api from '../Api';
import { useNavigate } from 'react-router-dom';

function UpdatePassword() {
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState({ password: '', cPassword: '' });
    const [resetLoading, setResetLoading] = useState(false);
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
        const isLongEnough = password.length >= 6;
        if (!isLongEnough) {
            alert('Password should contain at least 6 characters.');
            return;
        }
        
        setResetLoading(true);
        try {
            const userId = window.location.pathname.split('/').pop();
            const res = await api.put(`/forgotpass/${userId}`, {
                newPassword: form.password
            });
            alert(res.data.message || 'Password updated successfully!');
            setResetLoading(false);
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || 'Error updating password');
            setResetLoading(false);
        }
    };

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
                                        <button
                                            className="custom-button"
                                            type="submit"
                                            disabled={resetLoading}
                                            style={{
                                                position: 'relative',
                                                minWidth: 140,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: resetLoading ? 0.7 : 1,
                                                cursor: resetLoading ? 'not-allowed' : 'pointer'
                                            }}
                                            aria-busy={resetLoading}
                                            aria-disabled={resetLoading}
                                        >
                                            {resetLoading ? (
                                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                                    <span
                                                        className="spinner-border spinner-border-sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        style={{ marginRight: 8 }}
                                                    ></span>
                                                    <span style={{ fontSize: '1rem', fontWeight: 500 }}>Resetting...</span>
                                                </span>
                                            ) : (
                                                <span style={{ width: '100%' }}>Reset</span>
                                            )}
                                        </button>
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