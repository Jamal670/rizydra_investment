import React, { useEffect, useState } from 'react';
import api from '../../Api';

function ReferalUsers() {
    const [isLoading, setIsLoading] = useState(true);
    const [referralData, setReferralData] = useState({
        name: '',
        email: '',
        image: '',
        referralCodess: '',
        refEarnings: [],
        referralSummary: { level1: 0, level2: 0, level3: 0 }
    });

    useEffect(() => {
        // Only load assets once per session
        if (!window.__rizydraAssetsLoaded) {
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
            window.__rizydraAssetsLoaded = true;
        }
        // Fetch referral data
        api.get('/user/referal', { withCredentials: true })
            .then(res => {
                if (res.data && res.data.referralCode) {
                    setReferralData({
                        name: res.data.referralCode.name || '',
                        email: res.data.referralCode.email || '',
                        image: res.data.referralCode.image || '',
                        referralCode: res.data.referralCode.referralCode || '',
                        refEarnings: res.data.referralCode.refEarnings || [],
                        referralSummary: res.data.referralCode.referralSummary || { level1: 0, level2: 0, level3: 0 }
                    });
                }
            })
            .finally(() => {
                setIsLoading(false);
            });

        // Hide loader after 1 second
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleAddReferralUser = async () => {
        const frontendUrl = process.env.REACT_APP_API_URL_FRONTEND;
        const referralLink = `${frontendUrl}sign-up?ref=${referralData.referralCode}`;
        await navigator.clipboard.writeText(referralLink);
        alert("Referral link copied to clipboard!");
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
                            <h2 className="inner-banner-title">User <br /> Dashboard</h2>
                            <ul className="breadcums">
                                <li><a href="/">Home</a></li>
                                <li><a href="/user-dashboard">Dashboard</a></li>
                                <li><span>Referral Users</span></li>
                            </ul>
                        </div>
                        <div className="inner-banner-thumb about d-none d-md-block">
                            <img src="/assets/images/dashboard/thumb.png" alt="about" />
                        </div>
                    </div>
                </div>
                <div className="shape1 paroller" data-paroller-factor=".2">
                    <img src="/assets/images/about/balls.png" alt="about" />
                </div>
            </section>

            {/* User Dashboard Section */}
            <section className="user-dashboard padding-top padding-bottom">
                <div className="container">
                    <div className="row gy-5">
                        <div className="col-lg-3">
                            <div className="dashboard-sidebar">
                                <div className="close-dashboard d-lg-none">
                                    <i className="las la-times"></i>
                                </div>
                                <div className="dashboard-user">
                                    <div className="user-thumb">
                                        <img
                                            src={referralData.image ? (referralData.image.startsWith('data:image') ? referralData.image : `data:image/png;base64,${referralData.image}`) : "/assets/images/dashboard/userIconss.png"}
                                            alt="dashboard"
                                            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className="user-content">
                                        <span>Welcome</span>
                                        <h5 className="name">{referralData.name}</h5>
                                        <p className="email">{referralData.email}</p>
                                        <hr />
                                    </div>
                                    {/* Referral Code Display */}
                                    <div style={{ marginTop: '5px', padding: '5px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                                        <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '0px' }}>Referral Code:</div>
                                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#007bff', fontFamily: 'monospace' }}>
                                            {referralData.referralCode || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <ul className="user-dashboard-tab">
                                    <li><a href="/user-dashboard" >Account Overview</a></li>
                                    <li><a href="/earning-history">Earnings History</a></li>
                                    <li><a href="/referal-users" className="active">Referral Users</a></li>
                                    <li><a href="/deposit">Deposit/Withdraw</a></li>
                                    <li><a href="/account-settings">Account Settings</a></li>
                                    <li>
                                        <a
                                            href="#0"
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                try {
                                                    await api.get('/logout', { withCredentials: true });
                                                    window.location.href = '/';
                                                } catch (err) {
                                                    // Optionally handle error
                                                }
                                            }}
                                        >
                                            Sign Out
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="user-toggler-wrapper d-flex d-lg-none">
                                <h4 className="title">User Dashboard</h4>
                                <div className="user-toggler">
                                    <i className="las la-sliders-h"></i>
                                </div>
                            </div>


                            {/* Dashboard Boxes Section */}
                            <div className="dashboard-boxes">
                                <div className="row justify-content-center g-4 mb-3">
                                    {/* Total Users */}
                                    <div className="col-12 col-sm-6 col-md-3">
                                        <div className="dashboard-item">
                                            <div className="row align-items-center">
                                                <div className="col-4 text-center">
                                                    <img src="/assets/images/dashboard/icon6.png" alt="dashboard" style={{ width: 48, height: 48 }} />
                                                </div>
                                                <div className="col-8">
                                                    <h6 className="title mb-0" style={{ fontWeight: 600 }}>Total Users</h6>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 text-center">
                                                    <h3 className="ammount theme-one" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        {(referralData.referralSummary.level1 || 0) + (referralData.referralSummary.level2 || 0) + (referralData.referralSummary.level3 || 0)}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Level 1 Users */}
                                    <div className="col-12 col-sm-6 col-md-3">
                                        <div className="dashboard-item">
                                            <div className="row align-items-center">
                                                <div className="col-4 text-center">
                                                    <img src="/assets/images/dashboard/icon6.png" alt="dashboard" style={{ width: 48, height: 48 }} />
                                                </div>
                                                <div className="col-8">
                                                    <h6 className="title mb-0" style={{ fontWeight: 600 }}>Level 1 Users</h6>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 text-center">
                                                    <h3 className="ammount theme-two" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        {referralData.referralSummary.level1 || 0}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Level 2 Users */}
                                    <div className="col-12 col-sm-6 col-md-3">
                                        <div className="dashboard-item">
                                            <div className="row align-items-center">
                                                <div className="col-4 text-center">
                                                    <img src="/assets/images/dashboard/icon6.png" alt="dashboard" style={{ width: 48, height: 48 }} />
                                                </div>
                                                <div className="col-8">
                                                    <h6 className="title mb-0" style={{ fontWeight: 600 }}>Level 2 Users</h6>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 text-center">
                                                    <h3 className="ammount theme-three" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        {referralData.referralSummary.level2 || 0}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Level 3 Users */}
                                    <div className="col-12 col-sm-6 col-md-3">
                                        <div className="dashboard-item">
                                            <div className="row align-items-center">
                                                <div className="col-4 text-center">
                                                    <img src="/assets/images/dashboard/icon6.png" alt="dashboard" style={{ width: 48, height: 48 }} />
                                                </div>
                                                <div className="col-8">
                                                    <h6 className="title mb-0" style={{ fontWeight: 600 }}>Level 3 Users</h6>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 text-center">
                                                    <h3 className="ammount theme-three" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        {referralData.referralSummary.level3 || 0}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-11">
                                <div
                                    className="d-flex"
                                    style={{
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "20px"
                                    }}
                                >
                                    <div>
                                        <h4 className="title mb-0">Referal Users</h4>
                                    </div>
                                    <div>
                                        <button
                                            className=""
                                            style={{
                                                padding: "6px 46px",
                                                cursor: "pointer",
                                                marginLeft: "80px",
                                                backgroundColor: "#007bff",
                                                color: "#fff",
                                                border: "none"
                                            }}
                                            onClick={handleAddReferralUser}
                                        >
                                            Add Referal User
                                        </button>
                                    </div>
                                </div>
                            </div>



                            <table className="deposit-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Ref Earning</th>
                                        <th>Ref Level</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {referralData.refEarnings && referralData.refEarnings.length > 0 ? (
                                        referralData.refEarnings.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.refName}</td>
                                                <td>${item.amount}</td>
                                                <td>${item.earningRef}</td>
                                                <td>{item.refLevel}</td>
                                                <td>{item.date}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center' }}>No referral users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            



            <a href="#0" className="scrollToTop active"><i className="las la-chevron-up"></i></a>
        </>
    );
}

export default ReferalUsers;