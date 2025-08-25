import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Api';

function Otp() {
  const [isLoading, setIsLoading] = useState(true);
  const [otp, setOtp] = useState('');
  const params = useParams();
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

  const handleChange = e => setOtp(e.target.value);

  const handleSubmit = async e => {
    e.preventDefault();
    // Try to get id from params (for /otp/:id)
    const id = params.id;
    const type = params.type;
    if (!id) {
      alert('User ID is missing in the URL.');
      return;
    }
    try {
      const res = await api.put(`/VerifyOtp/${id}`, { otp, type });
      if(type === "reg") {
        // alert(res.data.message || 'OTP verified!');
        navigate('/login');
      }
      else{
        // alert(res.data.message || 'OTP verified!');
        navigate(`/pass-update/${id}`);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Invalid OTP');
    }
  };

  return (
    <React.Fragment>
      {/* Preloader */}
      {isLoading && (
        <React.Fragment>
          <div className="loader-bg">
            <div className="loader-p"></div>
          </div>
          <div className="overlay"></div>
        </React.Fragment>
      )}

      {/* Banner Section */}
      <section className="inner-banner bg_img padding-bottom" style={{ background: "url(/assets/images/about/bg.png) no-repeat right bottom" }}>
        <div className="container">
          <div className="inner-banner-wrapper">
            <div className="inner-banner-content">
              <h2 className="inner-banner-title">OTP Verification</h2>
              <ul className="breadcums">
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <span>OTP</span>
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
            <div className="col-lg-7 d-none d-lg-block">
              <div className="account-thumb">
                <img src="/assets/images/account/login-thumb.png" alt="account" />
              </div>
            </div>
            <div className="col-lg-5">
              <div className="account-wrapper">
                <h2 className="title">Enter OTP</h2>
                <form className="account-form" onSubmit={handleSubmit}>
                  <div className="form--group">
                    <p style={{ marginBottom: '10px', color: '#333' }}>
                      Your OTP has been sent to your email.
                    </p>
                    <i className="las la-key mt-3"></i>
                    <input
                      type="text"
                      className="form--control"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form--group">
                    <button className="custom-button" type="submit">VERIFY OTP</button>
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
    </React.Fragment>
  );
}

export default Otp;