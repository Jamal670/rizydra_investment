import React, { useEffect, useState } from 'react';
import api from '../../Api';

function ReferalUsers() {
    const [isLoading, setIsLoading] = useState(true);
    const [referralData, setReferralData] = useState({
        name: '',
        email: '',
        image: '',
        referralCode: '',
        investedAmount: 0,
        refEarnings: [],
        referralSummary: { level1: 0, level2: 0, level3: 0 }
    });
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    useEffect(() => {
        const loadAssets = () => new Promise(resolve => {
            if (window.__rizydraAssetsLoaded) {
                resolve(true);
                return;
            }
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
                if (loaded >= total) {
                    window.__rizydraAssetsLoaded = true;
                    resolve(true);
                }
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
        });

        const init = async () => {
            try {
                await api.get("/user/verify", { withCredentials: true });
                const res = await api.get('/user/referal', { withCredentials: true });

                if (res.data && res.data.referralCode) {
                    setReferralData({
                        name: res.data.referralCode.name || '',
                        email: res.data.referralCode.email || '',
                        image: res.data.referralCode.image || '',
                        referralCode: res.data.referralCode.referralCode || '',
                        investedAmount: res.data.referralCode.investedAmount || 0,
                        refEarnings: res.data.referralCode.refEarnings || [],
                        referralSummary: res.data.referralCode.referralSummary || { level1: 0, level2: 0, level3: 0 }
                    });
                }
            } catch (err) {
                console.error('Authentication or data loading failed:', err);
                localStorage.removeItem("authenticated");
                localStorage.removeItem("isAdmin");
                alert("Your session has expired, Please login again.");
                window.location.href = '/login';
                return;
            }

            await loadAssets();
            setIsLoading(false);
        };

        init();
    }, []);

    // Pagination logic
    const tableData = referralData.refEarnings || [];
    const totalRows = tableData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const paginatedData = tableData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleAddReferralUser = async () => {
        if (referralData.investedAmount >= 20) {
            const referralLink = `www.rizydra.com/sign-up?ref=${referralData.referralCode}`;
            try {
                await navigator.clipboard.writeText(referralLink);
                alert("Referral link copied to clipboard!");
            } catch (err) {
                alert("Failed to copy referral link. Please try again.");
            }
        } else {
            alert("Please invest 20 dollars before referring.");
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
                            <h2 className="inner-banner-title">User <br /> Dashboard</h2>
                            <ul className="breadcums">
                                {/* <li><a href="/">Home</a></li> */}
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
                                            src={referralData.image ? (referralData.image.startsWith('data:image') ? referralData.image : `data:image/png;base64,${referralData.image}`) : "/assets/images/testimonial/aa.png"}
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
                                                    // Call logout API
                                                    await api.get('/logout', { withCredentials: true });

                                                    // Remove localStorage flag
                                                    localStorage.removeItem("authenticated");

                                                    // Redirect to homepage
                                                    window.location.href = '/';
                                                } catch (err) {
                                                    console.error("Logout failed:", err);
                                                    // Optionally show an error message
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
    <div className="col-12 col-sm-6 col-md-6 col-lg-3">
      <DashboardItem 
        icon="/assets/images/dashboard/icon6.png" 
        title="Total Users" 
        value={(referralData.referralSummary.level1 || 0) + (referralData.referralSummary.level2 || 0) + (referralData.referralSummary.level3 || 0)}
        theme="theme-one"
      />
    </div>
    {/* Level 1 Users */}
    <div className="col-12 col-sm-6 col-md-6 col-lg-3">
      <DashboardItem 
        icon="/assets/images/dashboard/icon6.png" 
        title="Level 1 Users" 
        value={referralData.referralSummary.level1 || 0} 
        theme="theme-two"
      />
    </div>
    {/* Level 2 Users */}
    <div className="col-12 col-sm-6 col-md-6 col-lg-3">
      <DashboardItem 
        icon="/assets/images/dashboard/icon6.png" 
        title="Level 2 Users" 
        value={referralData.referralSummary.level2 || 0} 
        theme="theme-three"
      />
    </div>
    {/* Level 3 Users */}
    <div className="col-12 col-sm-6 col-md-6 col-lg-3">
      <DashboardItem 
        icon="/assets/images/dashboard/icon6.png" 
        title="Level 3 Users" 
        value={referralData.referralSummary.level3 || 0} 
        theme="theme-three"
      />
    </div>
  </div>
</div>


                            <div className="col-lg-11">
                                <div
                                    className="d-flex flex-wrap align-items-center mb-3"
                                    style={{
                                        justifyContent: "space-between",
                                        gap: "10px", // space between elements on smaller screens
                                    }}
                                >
                                    <div>
                                        <h4 className="title mb-0">Referral Users</h4>
                                    </div>
                                    <div>
                                        <button
                                            className="btn btn-primary"
                                            style={{
                                                padding: "6px 20px",
                                                cursor: "pointer",
                                                minWidth: "150px"
                                            }}
                                            onClick={handleAddReferralUser}
                                        >
                                            Add Referral User
                                        </button>
                                    </div>
                                </div>
                            </div>




                            <div
                                style={{
                                    width: '100%',
                                    overflowX: 'auto',
                                    WebkitOverflowScrolling: 'touch',
                                    background: '#fff',
                                    borderRadius: 8,
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                    marginBottom: '1.5rem',
                                    border: '1px solid #eee'
                                }}
                            >
                                <table
                                    style={{
                                        width: '100%',
                                        borderCollapse: 'collapse',
                                        minWidth: 400,
                                        fontSize: '15px',
                                        background: '#fff'
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            {['Name', 'Amount', 'Ref Earning', 'Ref Level', 'Date'].map(header => (
                                                <th
                                                    key={header}
                                                    style={{
                                                        background: '#f8f9fa',
                                                        fontWeight: 600,
                                                        color: '#222',
                                                        padding: '12px 10px',
                                                        borderBottom: '1px solid #eee',
                                                        position: 'sticky',
                                                        top: 0,
                                                        zIndex: 2,
                                                        textAlign: 'left',
                                                        whiteSpace: 'normal'
                                                    }}
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData && paginatedData.length > 0 ? (
                                            paginatedData.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td style={{
                                                        padding: '12px 10px',
                                                        borderBottom: '1px solid #eee',
                                                        whiteSpace: 'normal',
                                                        wordBreak: 'break-word',
                                                        verticalAlign: 'middle',
                                                        textAlign: 'left'
                                                    }}>{item.refName}</td>
                                                    <td style={{
                                                        padding: '12px 10px',
                                                        borderBottom: '1px solid #eee',
                                                        whiteSpace: 'normal',
                                                        wordBreak: 'break-word',
                                                        verticalAlign: 'middle',
                                                        textAlign: 'left'
                                                    }}>${item.amount}</td>
                                                    <td style={{
                                                        padding: '12px 10px',
                                                        borderBottom: '1px solid #eee',
                                                        whiteSpace: 'normal',
                                                        wordBreak: 'break-word',
                                                        verticalAlign: 'middle',
                                                        textAlign: 'left'
                                                    }}>${item.earningRef}</td>
                                                    <td style={{
                                                        padding: '12px 10px',
                                                        borderBottom: '1px solid #eee',
                                                        whiteSpace: 'normal',
                                                        wordBreak: 'break-word',
                                                        verticalAlign: 'middle',
                                                        textAlign: 'left'
                                                    }}>{item.refLevel}</td>
                                                    <td style={{
                                                        padding: '12px 10px',
                                                        borderBottom: '1px solid #eee',
                                                        whiteSpace: 'normal',
                                                        wordBreak: 'break-word',
                                                        verticalAlign: 'middle',
                                                        textAlign: 'left'
                                                    }}>{item.date}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" style={{ textAlign: 'center', padding: '12px 10px' }}>No referral users found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem 0',
                                    background: '#fff',
                                    borderRadius: '8px',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div style={{ fontSize: '14px', color: '#666' }}>
                                        Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, totalRows)} of {totalRows} results
                                    </div>
                                    <nav aria-label="Table pagination">
                                        <ul style={{
                                            display: 'flex',
                                            listStyle: 'none',
                                            margin: 0,
                                            padding: 0,
                                            gap: '4px'
                                        }}>
                                            <li>
                                                <button
                                                    style={{
                                                        padding: '8px 12px',
                                                        border: '1px solid #dee2e6',
                                                        background: currentPage === 1 ? '#e9ecef' : '#fff',
                                                        color: currentPage === 1 ? '#6c757d' : '#007bff',
                                                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                                        borderRadius: '4px',
                                                        fontSize: '14px'
                                                    }}
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    Previous
                                                </button>
                                            </li>
                                            {[...Array(totalPages)].map((_, idx) => (
                                                <li key={idx + 1}>
                                                    <button
                                                        style={{
                                                            padding: '8px 12px',
                                                            border: '1px solid #dee2e6',
                                                            background: currentPage === idx + 1 ? '#007bff' : '#fff',
                                                            color: currentPage === idx + 1 ? '#fff' : '#007bff',
                                                            cursor: 'pointer',
                                                            borderRadius: '4px',
                                                            fontSize: '14px'
                                                        }}
                                                        onClick={() => setCurrentPage(idx + 1)}
                                                    >
                                                        {idx + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li>
                                                <button
                                                    style={{
                                                        padding: '8px 12px',
                                                        border: '1px solid #dee2e6',
                                                        background: currentPage === totalPages ? '#e9ecef' : '#fff',
                                                        color: currentPage === totalPages ? '#6c757d' : '#007bff',
                                                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                                        borderRadius: '4px',
                                                        fontSize: '14px'
                                                    }}
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>





            <a href="#0" className="scrollToTop active"><i className="las la-chevron-up"></i></a>
        </>
    );
}

export default ReferalUsers;

function DashboardItem({ icon, title, value, theme }) {
  return (
    <div className="dashboard-item">
      <div className="row align-items-center">
        <div className="col-4 text-center">
          <img src={icon} alt="dashboard" style={{ width: 48, height: 48 }} />
        </div>
        <div className="col-8">
          <h6 className="title mb-0" style={{ fontWeight: 600 }}>{title}</h6>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-12 text-center">
          <h3 className={`ammount ${theme}`} style={{ fontWeight: 700, fontSize: 22 }}>
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}
