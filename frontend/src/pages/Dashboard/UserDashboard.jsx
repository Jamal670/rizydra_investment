import React, { useEffect, useState } from 'react';
import { Line, Pie, Bar, Line as StackedArea } from 'react-chartjs-2';
import api from '../../Api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement
);

function UserDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({ name: '', email: '', image: '', referralCode: '' });
    const [chartData, setChartData] = useState({
        lineChart: [],
        pieChart: { deposit: 0, invested: 0 },
        barChart: [],
        stackedAreaChart: []
    });
    const [cardData, setCardData] = useState({
        totalBalance: '0.00',
        totalEarn: '0.00',
        refEarn: '0.00',
        depositAmount: '0.00',
        investedAmount: '0.00'
    });
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const checkAuthAndLoadData = async () => {
            try {
                // Step 1: Check authentication first
                await api.get("/user/verify", { withCredentials: true });
                
                // Step 2: If auth successful, load dashboard data
                const res = await api.get('/user/showUserDash', { withCredentials: true });
                
                console.log('Dashboard response:', res.data);
                setUserData({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    image: res.data.image || '',
                    referralCode: res.data.referralCode || ''
                });
                
                setChartData({
                    lineChart: res.data.lineChart || [],
                    pieChart: res.data.pieChart || { deposit: 0, invested: 0 },
                    barChart: res.data.barChart || [],
                    stackedAreaChart: res.data.stackedAreaChart || []
                });
                
                setCardData(res.data.cardData || {
                    totalBalance: '0.00',
                    totalEarn: '0.00',
                    refEarn: '0.00',
                    depositAmount: '0.00',
                    investedAmount: '0.00'
                });

                // Load assets only once per session
                if (!window.__rizydraAssetsLoaded) {
                    loadAssets();
                    window.__rizydraAssetsLoaded = true;
                }

            } catch (err) {
                console.error('Authentication or data loading failed:', err);
                
                // Clear localStorage flags
                localStorage.removeItem("authenticated");
                localStorage.removeItem("isAdmin");

                // Show alert and redirect - ONLY ONCE
                alert("Your session has expired, Please login again.");
                window.location.href = '/login';
                return; // Stop execution here
            } finally {
                setIsLoading(false);
            }
        };

        const loadAssets = () => {
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
        };

        checkAuthAndLoadData();

        // Hide loader after 1 second (optional fallback)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Chart configurations with better data handling
    const lineChartData = {
        labels: chartData.lineChart.length > 0
            ? chartData.lineChart.map(item => item.date)
            : ['No Data'],
        datasets: [
            {
                label: 'Daily Earnings',
                data: chartData.lineChart.length > 0 
                    ? chartData.lineChart.map(item => item.value)
                    : [0],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
            },
        ],
    };

    const pieChartData = {
        labels: ['Deposit', 'Invested'],
        datasets: [
            {
                data: [chartData.pieChart.deposit, chartData.pieChart.invested],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const barChartData = {
        labels: chartData.barChart.length > 0
            ? chartData.barChart.map(item => item.name || 'Unknown')
            : ['No Data'],
        datasets: [
            {
                label: 'Referral Earnings',
                data: chartData.barChart.length > 0
                    ? chartData.barChart.map(item => item.totalReferralEarnings || 0)
                    : [0],
                backgroundColor: 'rgba(153, 102, 255, 0.8)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const stackedAreaChartData = {
        labels: chartData.stackedAreaChart.length > 0
            ? chartData.stackedAreaChart.map(item => item.date)
            : ['No Data'],
        datasets: [
            {
                label: 'Daily Earnings',
                data: chartData.stackedAreaChart.length > 0
                    ? chartData.stackedAreaChart.map(item => item.daily || 0)
                    : [0],
                borderColor: 'rgb(255, 159, 64)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: true,
            },
            {
                label: 'Referral Earnings',
                data: chartData.stackedAreaChart.length > 0
                    ? chartData.stackedAreaChart.map(item => item.referral || 0)
                    : [0],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Dashboard Analytics',
            },
        },
    };

    // Optional: Close sidebar when switching to desktop view
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 992) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                            <h2 className="inner-banner-title">User <br /> Dashboard</h2>
                            <ul className="breadcums">
                                <li><a href="/">Home</a></li>
                                <li><span>Dashboard</span></li>
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
                            <div
                                className={`dashboard-sidebar${sidebarOpen ? ' open' : ''}`}
                                style={{
                                    display: sidebarOpen || window.innerWidth >= 992 ? 'block' : 'none',
                                    position: window.innerWidth < 992 ? 'fixed' : 'static',
                                    top: 0,
                                    left: 0,
                                    zIndex: 1050,
                                    background: '#fff',
                                    height: '100vh',
                                    width: '80vw',
                                    maxWidth: 340,
                                    boxShadow: sidebarOpen ? '0 2px 16px rgba(0,0,0,0.18)' : undefined,
                                    transition: 'all 0.3s'
                                }}
                            >
                                <div className="close-dashboard d-lg-none" style={{ textAlign: 'right', padding: 8 }}>
                                    <i
                                        className="las la-times"
                                        style={{ fontSize: 28, cursor: 'pointer' }}
                                        onClick={() => setSidebarOpen(false)}
                                    ></i>
                                </div>
                                <div className="dashboard-user">
                                    <div className="user-thumb">
                                        <img
                                            src={userData.image ? (userData.image.startsWith('data:image') ? userData.image : `data:image/png;base64,${userData.image}`) : "/assets/images/testimonial/aa.png"}
                                            alt="dashboard"
                                            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", padding: "1px" }}
                                        />
                                    </div>
                                    <div className="user-content">
                                        <span>Welcome</span>
                                        <h5 className="name">{userData.name}</h5>
                                        <p className="email">{userData.email}</p>
                                        <hr />
                                    </div>
                                    {/* Referral Code Display */}
                                    <div style={{ marginTop: '5px', padding: '5px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                                        <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '0px' }}>Referral Code:</div>
                                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#007bff', fontFamily: 'monospace' }}>
                                            {userData.referralCode || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                <ul className="user-dashboard-tab">
                                    <li><a href="/user-dashboard" className="active">Account Overview</a></li>
                                    <li><a href="/earning-history">Earnings History</a></li>
                                    <li><a href="/referal-users">Referral Users</a></li>
                                    <li><a href="/deposit">Deposit/Withdraw</a></li>
                                    <li><a href="/account-settings">Account Settings</a></li>
                                    <li>
                                        <a
                                            href="#0"
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                try {
                                                    // Call logout API
                                                    await api.get('/logout', { withCredentials: true });

                                                    // Remove localStorage flag
                                                    localStorage.removeItem("authenticated");

                                                    // Redirect to homepage
                                                    window.location.href = '/';
                                                } catch (err) {
                                                    console.error("Logout failed:", err);
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
                                <div className="user-toggler" style={{ cursor: 'pointer', marginLeft: 'auto' }} onClick={() => setSidebarOpen(true)}>
                                    <i className="las la-sliders-h"></i>
                                </div>
                            </div>

                            {/* Dashboard Boxes Section */}
                            <div className="dashboard-boxes">
                                <div className="row justify-content-center g-4 mb-3">
                                    {/* Total Balance */}
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <div className="dashboard-item">
                                            <div className="row align-items-center">
                                                <div className="col-4 text-center">
                                                    <img src="/assets/images/dashboard/wallet.png" alt="dashboard" style={{ width: 48, height: 48 }} />
                                                </div>
                                                <div className="col-8">
                                                    <h6 className="title mb-0" style={{ fontWeight: 600 }}>Total Balance</h6>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 text-center">
                                                    <h3 className="ammount theme-one" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        ${cardData.totalBalance}
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
                                                    <h3 className="ammount theme-two" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        ${cardData.totalEarn}
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
                                                    <h3 className="ammount theme-four" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        ${cardData.refEarn}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Deposit Amount */}
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
                                                    <h3 className="ammount theme-three" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        ${cardData.depositAmount}
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
                                                    <h3 className="ammount theme-three" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        ${cardData.investedAmount}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Graphs Section Heading */}
                            <div className="graphs-heading mt-5 mb-4">
                                <div className="container">
                                    <h3 className="title" style={{
                                        fontSize: '28px',
                                        fontWeight: '700',
                                        color: '#222',
                                        textAlign: 'left',
                                        marginBottom: '0',
                                        padding: '0px 0'
                                    }}>
                                        Graphs
                                    </h3>
                                </div>
                            </div>

                            {/* All Graphs Section - Single Row with Horizontal Scrolling */}
                            <section className="charts-section mt-4">
                                <div className="container-fluid px-0">
                                    <div className="charts-scroll-container" style={{
                                        overflowX: 'auto',
                                        overflowY: 'hidden',
                                        whiteSpace: 'nowrap',
                                        padding: '0 20px',
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#888 #f1f1f1'
                                    }}>
                                        <div className="charts-row" style={{
                                            display: 'inline-flex',
                                            gap: '20px',
                                            minWidth: 'max-content',
                                            padding: '10px 0'
                                        }}>
                                            {/* Daily Earnings Trend */}
                                            <div className="chart-item" style={{
                                                minWidth: '400px',
                                                maxWidth: '400px',
                                                background: '#fff',
                                                padding: '20px',
                                                borderRadius: '10px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                border: '1px solid #e9ecef'
                                            }}>
                                                <h5 className="mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>Daily Earnings Trend</h5>
                                                <div style={{ height: '250px' }}>
                                                    <Line data={lineChartData} options={{
                                                        ...chartOptions,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            ...chartOptions.plugins,
                                                            title: { display: false }
                                                        }
                                                    }} />
                                                </div>
                                            </div>

                                            {/* Balance Distribution */}
                                            <div className="chart-item" style={{
                                                minWidth: '350px',
                                                maxWidth: '350px',
                                                background: '#fff',
                                                padding: '20px',
                                                borderRadius: '10px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                border: '1px solid #e9ecef'
                                            }}>
                                                <h5 className="mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>Balance Distribution</h5>
                                                <div style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Pie data={pieChartData} options={{
                                                        ...chartOptions,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            ...chartOptions.plugins,
                                                            title: { display: false }
                                                        }
                                                    }} />
                                                </div>
                                            </div>

                                            {/* Combined Growth Analysis */}
                                            <div className="chart-item" style={{
                                                minWidth: '400px',
                                                maxWidth: '400px',
                                                background: '#fff',
                                                padding: '20px',
                                                borderRadius: '10px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                border: '1px solid #e9ecef'
                                            }}>
                                                <h5 className="mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>Growth Analysis</h5>
                                                <div style={{ height: '250px' }}>
                                                    <StackedArea data={stackedAreaChartData} options={{
                                                        ...chartOptions,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            ...chartOptions.plugins,
                                                            title: { display: false }
                                                        }
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Scroll Indicator */}
                                    <div className="scroll-indicator mt-3" style={{
                                        textAlign: 'center',
                                        color: '#666',
                                        fontSize: '14px'
                                    }}>
                                        <i className="las la-arrows-alt-h" style={{ marginRight: '8px' }}></i>
                                        Scroll horizontally to view all graphs
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>

            <a href="#0" className="scrollToTop active"><i className="las la-chevron-up"></i></a>
        </>
    );
}

export default UserDashboard;