import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../Api';

function EarningHistory() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        image: '',
        referralCode: '',
        depositAmount: 0,
        investedAmount: 0,
        earnings: []
    });

    // Utility function to get auth token from cookies
    const getAuthTokenFromCookies = () => {
        // Since your backend uses httpOnly cookies, we can't access them directly
        // We need to make an API call to verify authentication
        return null; // This will be handled by the API call
    };

    // Utility function to check if token is valid
    const isTokenValid = (token) => {
        if (!token) return false;

        try {
            // Basic JWT token validation (check if it's not expired)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;

            return payload.exp > currentTime;
        } catch (error) {
            return false;
        }
    };

    // Authentication check function
    const checkAuthentication = async () => {
        try {
            // Make an API call to verify authentication
            const response = await api.get('/user/verify-auth', { withCredentials: true });
            return true;
        } catch (error) {
            if (error.response?.status === 401) {
                alert('Your session has expired. Please login again');
                navigate('/login');
                return false;
            }
            return false;
        }
    };

    useEffect(() => {
        // First, check authentication
        if (!checkAuthentication()) {
            return;
        }

        setIsAuthenticated(true);

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

        // Fetch earning history data only if authenticated
        api.get('/user/earnhistory', { withCredentials: true })
            .then(res => {
                console.log('API Response:', res.data);
                setUserData({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    image: res.data.image || '',
                    referralCode: res.data.referralCode || '',
                    depositAmount: res.data.depositAmount || 0,
                    investedAmount: res.data.investedAmount || 0,
                    earnings: res.data.earnings || []
                });
            })
            .catch((error) => {
                console.error('API Error:', error);
                // If API call fails due to authentication, redirect to login
                if (error.response?.status === 401) {
                    alert('Your session has expired. Please login again');
                    navigate('/login');
                    return;
                }
                setUserData({
                    name: '',
                    email: '',
                    image: '',
                    referralCode: '',
                    depositAmount: 0,
                    investedAmount: 0,
                    earnings: []
                });
            })
            .finally(() => {
                setIsLoading(false);
            });

        // Hide loader after 1 second (optional fallback)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [navigate]); // Proper dependency management

    // Don't render anything if not authenticated
    if (!isAuthenticated) {
        return null;
    }

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
                            <h2 className="inner-banner-title">User <br /> Dashboard</h2>
                            <ul className="breadcums">
                                <li><a href="/">Home</a></li>
                                <li><span>Dashboard</span></li>
                                <li><span>Earning History</span></li>
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
                                            src={userData.image ? (userData.image.startsWith('data:image') ? userData.image : `data:image/png;base64,${userData.image}`) : "/assets/images/dashboard/userIconss.png"}
                                            alt="dashboard"
                                            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className="user-content">
                                        <span style={{ fontSize: '14px', color: '#666' }}>Welcome</span>
                                        <h5 className="name" style={{ fontSize: '18px', fontWeight: '600', margin: '5px 0', color: '#222' }}>{userData.name}</h5>
                                        <p className="email" style={{ fontSize: '14px', color: '#666', margin: '0' }}>{userData.email}</p>




                                    </div>
                                </div>
                                <ul className="user-dashboard-tab">
                                    <li><a href="/user-dashboard">Account Overview</a></li>
                                    <li><a href="/earning-history" className="active">Earnings History</a></li>
                                    <li><a href="/referal-users">Referral Users</a></li>
                                    <li><a href="/deposit">Deposit</a></li>
                                    <li><a href="/account-settings">Account Settings</a></li>
                                    <li>
                                        <a
                                            href="#0"
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                try {
                                                    await api.get('/logout', { withCredentials: true });
                                                    navigate('/login');
                                                } catch (err) {
                                                    console.error('Logout error:', err);
                                                    navigate('/login');
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
                                    {/* Deposit Balance */}
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <div className="dashboard-item">
                                            <div className="row align-items-center">
                                                <div className="col-4 text-center">
                                                    <img src="/assets/images/dashboard/deposit.png" alt="dashboard" style={{ width: 48, height: 48 }} />
                                                </div>
                                                <div className="col-8">
                                                    <h6 className="title mb-0" style={{ fontWeight: 600 }}>Deposit Balance</h6>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 text-center">
                                                    <h3 className="ammount theme-one" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        ${userData.depositAmount}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Invested Amount */}
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <div className="dashboard-item">
                                            <div className="row align-items-center">
                                                <div className="col-4 text-center">
                                                    <img src="/assets/images/dashboard/invest.png" alt="dashboard" style={{ width: 48, height: 48 }} />
                                                </div>
                                                <div className="col-8">
                                                    <h6 className="title mb-0" style={{ fontWeight: 600 }}>Invested Amount</h6>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 text-center">
                                                    <h3 className="ammount theme-one" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        ${userData.investedAmount}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Total Earning */}
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <div className="dashboard-item">
                                            <div className="row align-items-center">
                                                <div className="col-4 text-center">
                                                    <img src="/assets/images/dashboard/profit.png" alt="dashboard" style={{ width: 48, height: 48 }} />
                                                </div>
                                                <div className="col-8">
                                                    <h6 className="title mb-0" style={{ fontWeight: 600 }}>Total Earning</h6>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 text-center">
                                                    <h3 className="ammount theme-one" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        ${userData.earnings && userData.earnings.length > 0
                                                            ? userData.earnings
                                                                .reduce((sum, item) => sum + Number(item.dailyProfit) + Number(item.refEarn), 0)
                                                                .toFixed(2)
                                                            : "0.00"}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Referral Earning */}
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <div className="dashboard-item">
                                            <div className="row align-items-center">
                                                <div className="col-4 text-center">
                                                    <img src="/assets/images/dashboard/reference.png" alt="dashboard" style={{ width: 48, height: 48 }} />
                                                </div>
                                                <div className="col-8">
                                                    <h6 className="title mb-0" style={{ fontWeight: 600 }}>Referral Earning</h6>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 text-center">
                                                    <h3 className="ammount theme-one" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        ${userData.earnings && userData.earnings.length > 0
                                                            ? userData.earnings
                                                                .reduce((sum, item) => sum + Number(item.refEarn), 0)
                                                                .toFixed(2)
                                                            : "0.00"}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="dashborad-header">
                                <h4 className="title">Daily Earning</h4>
                            </div>
                            <table className="deposit-table">
                                <thead>
                                    <tr>
                                        <th>Amount</th>
                                        <th>Earning</th>
                                        <th>Ref Earning</th>
                                        <th>Total Earning</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userData.earnings && userData.earnings.length > 0 ? (
                                        userData.earnings.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>${item.baseAmount}</td>
                                                <td>${item.dailyProfit}</td>
                                                <td>${item.refEarn}</td>
                                                <td>${(Number(item.dailyProfit) + Number(item.refEarn)).toFixed(2)}</td>
                                                <td>{item.date}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center' }}>No earning history found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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

export default EarningHistory;