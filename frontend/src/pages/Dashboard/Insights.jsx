import React, { useEffect, useState, useRef, useCallback } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
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
} from "chart.js";
import api from "../../Api";

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

function Insights() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
    referralCode: "",
  });
  const [metrics, setMetrics] = useState({
    totalAmount: 0,
    totalEarnings: 0,
    referralEarnings: 0,
    totalReferrals: 0,
    depositAmount: 0,
    withdrawAmount: 0,
    investedAmount: 0,
    pendingBalance: 0,
  });

  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarActive &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".user-toggler")
      ) {
        setIsSidebarActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarActive]);

  const [graphs, setGraphs] = useState({
    dailyEarnings: [],
    referralLevels: { level1: 0, level2: 0, level3: 0 },
  });
  const [timeRange, setTimeRange] = useState("Weekly");
  const [isLoadingGraphs, setIsLoadingGraphs] = useState(false);

  const loadAssets = useCallback(
    () =>
      new Promise((resolve) => {
        if (window.__rizydraAssetsLoaded) {
          resolve(true);
          return;
        }
        const cssFiles = [
          "/assets/css/bootstrap.min.css",
          "/assets/css/all.min.css",
          "/assets/css/line-awesome.min.css",
          "/assets/css/animate.css",
          "/assets/css/magnific-popup.css",
          "/assets/css/nice-select.css",
          "/assets/css/odometer.css",
          "/assets/css/slick.css",
          "/assets/css/main.css",
        ];
        const jsFiles = [
          "/assets/js/jquery-3.3.1.min.js",
          "/assets/js/bootstrap.min.js",
          "/assets/js/jquery.ui.js",
          "/assets/js/slick.min.js",
          "/assets/js/wow.min.js",
          "/assets/js/magnific-popup.min.js",
          "/assets/js/odometer.min.js",
          "/assets/js/viewport.jquery.js",
          "/assets/js/nice-select.js",
          "/assets/js/main.js",
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

        cssFiles.forEach((href) => {
          const existing = document.querySelector(`link[href="${href}"]`);
          if (existing) {
            markLoaded();
          } else {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = href;
            link.onload = markLoaded;
            link.onerror = markLoaded;
            document.head.appendChild(link);
          }
        });

        jsFiles.forEach((src) => {
          const existing = document.querySelector(`script[src="${src}"]`);
          if (existing) {
            markLoaded();
          } else {
            const script = document.createElement("script");
            script.src = src;
            script.async = false;
            script.onload = markLoaded;
            script.onerror = markLoaded;
            document.body.appendChild(script);
          }
        });
      }),
    []
  );

  // Fetch Static Cards Data (Run Once)
  const fetchCards = useCallback(async () => {
    try {
      await api.get("/user/verify", { withCredentials: true });
      const res = await api.get("/user/insights/cards", {
        withCredentials: true,
      });

      if (res.data && res.data.success && res.data.data) {
        const metrics = res.data.data;

        setUserData({
          name: metrics.name || "",
          email: metrics.email || "",
          image: metrics.image || "",
          referralCode: metrics.referralCode || "",
        });

        setMetrics({
          totalAmount: metrics.totalAmount || 0,
          totalEarnings: metrics.totalEarnings || 0,
          referralEarnings: metrics.referralEarnings || 0,
          totalReferrals: metrics.totalReferrals || 0,
          depositAmount: metrics.depositAmount || 0,
          withdrawAmount: metrics.withdrawAmount || 0,
          investedAmount: metrics.investedAmount || 0,
          pendingBalance: metrics.pendingBalance || 0,
        });
      }
    } catch (err) {
      console.error("Cards data loading failed:", err);
      // Optional: Handle auth failure here or in the other call
    }
  }, []);

  // Fetch Graphs Data (Run on Filter Change)
  const fetchGraphs = useCallback(async (range) => {
    console.log("🔄 [DROPDOWN] Fetching graphs for range:", range);
    setIsLoadingGraphs(true);

    try {
      const res = await api.get(
        `/user/insights/graphs?range=${encodeURIComponent(range)}`,
        {
          withCredentials: true,
        }
      );

      console.log("✅ [API RESPONSE] Received data:", res.data);

      if (res.data && res.data.success && res.data.data) {
        const graphs = res.data.data;

        console.log("📊 [DATA] Daily Earnings:", graphs.dailyEarnings);
        console.log("📊 [DATA] Referral Levels:", graphs.referralLevels);

        setGraphs({
          dailyEarnings: graphs.dailyEarnings || [],
          referralLevels: graphs.referralLevels || {
            level1: 0,
            level2: 0,
            level3: 0,
          },
        });

        console.log("✅ [STATE] Graphs state updated successfully");
      }
    } catch (err) {
      console.error("❌ [ERROR] Graph data loading failed:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("authenticated");
        localStorage.removeItem("isAdmin");
        alert("Your session has expired, Please login again.");
        window.location.href = "/login";
      }
    } finally {
      setIsLoadingGraphs(false);
    }
  }, []);

  // Initial Load (Run once on mount)
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([fetchCards(), fetchGraphs(timeRange), loadAssets()]);
      setIsLoading(false);
    };
    init();
  }, []); // Run once on mount

  // Chart configurations
  const lineChartData = {
    labels:
      graphs.dailyEarnings.length > 0
        ? graphs.dailyEarnings.map((item) => item._id)
        : ["No Data"],
    datasets: [
      {
        label: "Daily Profit",
        data:
          graphs.dailyEarnings.length > 0
            ? graphs.dailyEarnings.map((item) => item.dailyProfit || 0)
            : [0],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
      {
        label: "Referral Earnings",
        data:
          graphs.dailyEarnings.length > 0
            ? graphs.dailyEarnings.map((item) => item.refEarn || 0)
            : [0],
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const depositWithdrawPieData = {
    labels: ["Deposit", "Withdraw"],
    datasets: [
      {
        data: [metrics.depositAmount || 0, metrics.withdrawAmount || 0],
        backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const balanceDistributionPieData = {
    labels: ["Total Balance", "Invested Amount", "Pending Balance"],
    datasets: [
      {
        data: [
          metrics.totalAmount || 0,
          metrics.investedAmount || 0,
          metrics.pendingBalance || 0,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const referralBarData = {
    labels: ["Level 1", "Level 2", "Level 3"],
    datasets: [
      {
        label: "Referral Earnings",
        data: [
          graphs.referralLevels.level1 || 0,
          graphs.referralLevels.level2 || 0,
          graphs.referralLevels.level3 || 0,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <>
      {/* Preloader */}
      {isLoading && (
        <>
          <div
            className="loader-bg"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "#fff",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/loader.jpeg"
              alt="Loading..."
              style={{
                width: 260,
                height: 260,
                animation: "blink 1s infinite",
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
      <section
        className="inner-banner bg_img padding-bottom"
        style={{
          background: "url(/assets/images/about/bg.png) no-repeat right bottom",
        }}
      >
        <div className="container">
          <div className="inner-banner-wrapper">
            <div className="inner-banner-content">
              <h2 className="inner-banner-title">
                User <br /> Dashboard
              </h2>
              <ul className="breadcums">
                {/* <li><a href="/">Home</a></li> */}
                <li>
                  <a href="/user-dashboard">Dashboard</a>
                </li>
                <li>
                  <span>Referral Users</span>
                </li>
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
                className={`dashboard-sidebar ${
                  isSidebarActive ? "active" : ""
                }`}
                ref={sidebarRef}
              >
                <div
                  className="close-dashboard d-lg-none"
                  onClick={() => setIsSidebarActive(false)}
                >
                  <i className="las la-times"></i>
                </div>
                <div className="dashboard-user">
                  <div className="user-thumb">
                    <img
                      src={
                        userData.image
                          ? userData.image.startsWith("data:image")
                            ? userData.image
                            : `data:image/png;base64,${userData.image}`
                          : "/assets/images/testimonial/aa.png"
                      }
                      alt="dashboard"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="user-content">
                    <span>Welcome</span>
                    <h5 className="name">{userData.name}</h5>
                    <p className="email">{userData.email}</p>
                    <hr />
                  </div>
                  {/* Referral Code Display */}
                  <div
                    style={{
                      marginTop: "5px",
                      padding: "5px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      border: "1px solid #e9ecef",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6c757d",
                        marginBottom: "0px",
                      }}
                    >
                      Referral Code:
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#007bff",
                        fontFamily: "monospace",
                      }}
                    >
                      {userData.referralCode || "N/A"}
                    </div>
                  </div>
                </div>
                <ul className="user-dashboard-tab">
                  <li>
                    <a href="/user-dashboard">Account Overview</a>
                  </li>
                  <li>
                    <a href="/insights" className="active">
                      Analytics
                    </a>
                  </li>
                  <li>
                    <a href="/earning-history">Earnings History</a>
                  </li>
                  <li>
                    <a href="/referal-users">Referral Users</a>
                  </li>
                  <li>
                    <a href="/deposit">Deposit/Withdraw</a>
                  </li>
                  <li>
                    <a href="/account-settings">Account Settings</a>
                  </li>
                  <li>
                    <a
                      href="#0"
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          // Call logout API
                          await api.get("/logout", { withCredentials: true });

                          // Remove localStorage flag
                          localStorage.removeItem("authenticated");

                          // Redirect to homepage
                          window.location.href = "/";
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
                <div
                  className="user-toggler"
                  onClick={() => setIsSidebarActive(true)}
                >
                  <i className="las la-sliders-h"></i>
                </div>
              </div>

              {/* Internal Styles for Dashboard Layout */}
              <style>
                {`
                  @media (max-width: 991px) {
                    .mobile-scroll-wrapper {
                      overflow-x: auto;
                      padding-bottom: 10px;
                    }
                    .mobile-dashboard-card {
                      flex: 0 0 60%;
                      max-width: 60%;
                      width: 60%;
                    }
                    /* Optional: Hide scrollbar on mobile for cleaner look */
                    .mobile-scroll-wrapper::-webkit-scrollbar {
                       display: none; 
                    }
                    .mobile-scroll-wrapper {
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    }
                  }
                  @media (min-width: 992px) {
                    .mobile-scroll-wrapper {
                      overflow-x: visible;
                      padding-bottom: 0;
                    }
                    /* Ensure grid layout on desktop */
                    .mobile-dashboard-card {
                      /* Bootstrap col-lg-3 handles width */
                    }
                  }
                `}
              </style>

              {/* Dashboard Boxes Section */}
              <div className="dashboard-boxes">
                {/* Row 1 - Scrollable on mobile, Grid on Desktop */}
                <div className="mobile-scroll-wrapper">
                  <div
                    className="row g-4 mb-3 flex-nowrap flex-lg-wrap justify-content-lg-center"
                    style={{ width: "100%" }}
                  >
                    {/* Total Amount */}
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mobile-dashboard-card">
                      <DashboardItem
                        icon="/assets/images/dashboard/wallet.png"
                        title="Total Amount"
                        value={`$${metrics.totalAmount || 0}`}
                        theme="theme-one"
                      />
                    </div>
                    {/* Total Earnings */}
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mobile-dashboard-card">
                      <DashboardItem
                        icon="/assets/images/dashboard/profit.png"
                        title="Total Earning"
                        value={`$${metrics.totalEarnings || 0}`}
                        theme="theme-two"
                      />
                    </div>
                    {/* Referral Earnings */}
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mobile-dashboard-card">
                      <DashboardItem
                        icon="/assets/images/dashboard/reference.png"
                        title="Referal Earning"
                        value={`$${metrics.referralEarnings || 0}`}
                        theme="theme-three"
                      />
                    </div>
                    {/* Total Referrals */}
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mobile-dashboard-card">
                      <DashboardItem
                        icon="/assets/images/dashboard/icon6.png"
                        title="Total Referral"
                        value={metrics.totalReferrals || 0}
                        theme="theme-three"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2 - Scrollable on mobile, Grid on Desktop */}
                <div className="mobile-scroll-wrapper">
                  <div
                    className="row g-4 mb-3 flex-nowrap flex-lg-wrap justify-content-lg-center"
                    style={{ width: "100%" }}
                  >
                    {/* Deposit Amount */}
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mobile-dashboard-card">
                      <DashboardItem
                        icon="/assets/images/dashboard/deposit.png"
                        title="Deposit Amount"
                        value={`$${metrics.depositAmount || 0}`}
                        theme="theme-one"
                      />
                    </div>
                    {/* Withdraw Amount */}
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mobile-dashboard-card">
                      <DashboardItem
                        icon="/assets/images/dashboard/withdraw.png"
                        title="Withdraw Amount"
                        value={`$${metrics.withdrawAmount || 0}`}
                        theme="theme-two"
                      />
                    </div>
                    {/* Invested Amount */}
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mobile-dashboard-card">
                      <DashboardItem
                        icon="/assets/images/dashboard/invest.png"
                        title="Invested Amount"
                        value={`$${metrics.investedAmount || 0}`}
                        theme="theme-three"
                      />
                    </div>
                    {/* Pending Balance */}
                    <div className="col-12 col-sm-6 col-md-6 col-lg-3 mobile-dashboard-card">
                      <DashboardItem
                        icon="/assets/images/dashboard/queue.png"
                        title="Pending Balance"
                        value={`$${metrics.pendingBalance || 0}`}
                        theme="theme-three"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="d-lg-none text-center text-muted mb-3"
                style={{ fontSize: "14px" }}
              >
                <i className="las la-arrows-alt-h me-2"></i>Scroll horizontally
                to view details
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
                    <h4 className="title m-0">Performance</h4>
                  </div>
                  <div>
                    <select
                      className="form-select"
                      style={{
                        minWidth: "180px",
                        padding: "6px 20px",
                        cursor: "pointer",
                      }}
                      value={timeRange}
                      onChange={(e) => {
                        const selectedRange = e.target.value;
                        console.log(
                          "👆 [USER ACTION] Dropdown changed to:",
                          selectedRange
                        );
                        setTimeRange(selectedRange);
                        fetchGraphs(selectedRange); // ← Directly call API
                      }}
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Six Month">Six Month</option>
                      <option value="Yearly">Yearly</option>
                      <option value="Lastly">Lastly</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Graphs Section - Horizontal Scroll Similar to UserDashboard */}
              <section
                className="charts-section mt-4"
                style={{ position: "relative" }}
              >
                {/* Loading Overlay for Graphs */}
                {isLoadingGraphs && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "rgba(255, 255, 255, 0.8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10,
                      borderRadius: "10px",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        className="spinner-border text-primary"
                        role="status"
                        style={{ width: "3rem", height: "3rem" }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p
                        className="mt-3"
                        style={{ fontSize: "16px", fontWeight: "500" }}
                      >
                        Updating graphs...
                      </p>
                    </div>
                  </div>
                )}

                <div className="container-fluid px-0">
                  <div
                    className="charts-scroll-container"
                    style={{
                      overflowX: "auto",
                      overflowY: "hidden",
                      whiteSpace: "nowrap",
                      padding: "0 20px",
                      scrollbarWidth: "thin",
                      scrollbarColor: "#888 #f1f1f1",
                    }}
                  >
                    <div
                      className="charts-row"
                      style={{
                        display: "inline-flex",
                        gap: "20px",
                        minWidth: "max-content",
                        padding: "10px 0",
                      }}
                    >
                      {/* Line Graph - Daily Earnings Trend */}
                      <div
                        className="chart-item"
                        style={{
                          minWidth: "400px",
                          maxWidth: "400px",
                          background: "#fff",
                          padding: "20px",
                          borderRadius: "10px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <h5
                          className="mb-3"
                          style={{ fontSize: "16px", fontWeight: "600" }}
                        >
                          Daily Earnings Trend
                        </h5>
                        <div style={{ height: "250px" }}>
                          <Line
                            data={lineChartData}
                            options={{
                              ...chartOptions,
                              maintainAspectRatio: false,
                            }}
                          />
                        </div>
                      </div>

                      {/* Pie Graph – Deposit vs Withdraw */}
                      <div
                        className="chart-item"
                        style={{
                          minWidth: "350px",
                          maxWidth: "350px",
                          background: "#fff",
                          padding: "20px",
                          borderRadius: "10px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <h5
                          className="mb-3"
                          style={{ fontSize: "16px", fontWeight: "600" }}
                        >
                          Deposit vs Withdraw
                        </h5>
                        <div
                          style={{
                            height: "250px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Pie
                            data={depositWithdrawPieData}
                            options={{
                              ...chartOptions,
                              maintainAspectRatio: false,
                            }}
                          />
                        </div>
                      </div>

                      {/* Pie Graph – Balance Distribution */}
                      <div
                        className="chart-item"
                        style={{
                          minWidth: "350px",
                          maxWidth: "350px",
                          background: "#fff",
                          padding: "20px",
                          borderRadius: "10px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <h5
                          className="mb-3"
                          style={{ fontSize: "16px", fontWeight: "600" }}
                        >
                          Balance Distribution
                        </h5>
                        <div
                          style={{
                            height: "250px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Pie
                            data={balanceDistributionPieData}
                            options={{
                              ...chartOptions,
                              maintainAspectRatio: false,
                            }}
                          />
                        </div>
                      </div>

                      {/* Bar Graph – Referral Earnings by Level */}
                      <div
                        className="chart-item"
                        style={{
                          minWidth: "400px",
                          maxWidth: "400px",
                          background: "#fff",
                          padding: "20px",
                          borderRadius: "10px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          border: "1px solid #e9ecef",
                        }}
                      >
                        <h5
                          className="mb-3"
                          style={{ fontSize: "16px", fontWeight: "600" }}
                        >
                          Referral Earnings by Level
                        </h5>
                        <div style={{ height: "250px" }}>
                          <Bar
                            data={referralBarData}
                            options={{
                              ...chartOptions,
                              maintainAspectRatio: false,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scroll Indicator */}
                  <div
                    className="scroll-indicator mt-3"
                    style={{
                      textAlign: "center",
                      color: "#666",
                      fontSize: "14px",
                    }}
                  >
                    <i
                      className="las la-arrows-alt-h"
                      style={{ marginRight: "8px" }}
                    ></i>
                    Scroll horizontally to view all graphs
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <a href="#0" className="scrollToTop active">
        <i className="las la-chevron-up"></i>
      </a>
    </>
  );
}

export default Insights;

function DashboardItem({ icon, title, value, theme }) {
  return (
    <div className="dashboard-item">
      <div className="row align-items-center">
        <div className="col-4 text-center">
          <img src={icon} alt="dashboard" style={{ width: 48, height: 48 }} />
        </div>
        <div className="col-8">
          <h6 className="title mb-0" style={{ fontWeight: 600 }}>
            {title}
          </h6>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-12 text-center">
          <h3
            className={`ammount ${theme}`}
            style={{ fontWeight: 700, fontSize: 22 }}
          >
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}
