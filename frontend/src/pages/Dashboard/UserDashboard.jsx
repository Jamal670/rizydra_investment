import React, { useEffect, useState, useRef } from "react";
import { Line, Pie, Bar, Line as StackedArea } from "react-chartjs-2";
import api from "../../Api";
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
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
    referralCode: "",
  });
  const [chartData, setChartData] = useState({
    lineChart: [],
    pieChart: { deposit: 0, invested: 0 },
    barChart: [],
    stackedAreaChart: [],
  });
  const [cardData, setCardData] = useState({
    totalBalance: "0.00",
    totalEarn: "0.00",
    refEarn: "0.00",
    depositAmount: "0.00",
    investedAmount: "0.00",
    depositAmount: "0.00",
    investedAmount: "0.00",
  });

  // Sidebar State
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
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

  useEffect(() => {
    const loadAssets = () =>
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
      });

    const init = async () => {
      try {
        await api.get("/user/verify", { withCredentials: true });
        const res = await api.get("/user/showUserDash", {
          withCredentials: true,
        });

        setUserData({
          name: res.data.name || "",
          email: res.data.email || "",
          image: res.data.image || "",
          referralCode: res.data.referralCode || "",
        });

        setChartData({
          lineChart: res.data.lineChart || [],
          pieChart: res.data.pieChart || { withdrawConfirmed: 0 },
          barChart: res.data.barChart || [],
          stackedAreaChart: res.data.stackedAreaChart || [],
        });

        const rawCardData = res.data.cardData || {};
        // Ensure withdrawConfirmed is present in cardData for easier rendering
        setCardData({
          totalBalance: rawCardData.totalBalance || "0.00",
          totalEarn: rawCardData.totalEarn || "0.00",
          refEarn: rawCardData.refEarn || "0.00",
          depositAmount: rawCardData.depositAmount || "0.00",
          investedAmount: rawCardData.investedAmount || "0.00",
          pendingInvestedLots: rawCardData.pendingInvestedLots || "0.00",
          withdrawConfirmed: (
            res.data.pieChart?.withdrawConfirmed || 0
          ).toString(),
        });
      } catch (err) {
        console.error("Authentication or data loading failed:", err);
        localStorage.removeItem("authenticated");
        localStorage.removeItem("isAdmin");
        alert("Your session has expired, Please login again.");
        window.location.href = "/login";
        return;
      }

      await loadAssets();
      setIsLoading(false);
    };

    init();
  }, []);

  // Chart configurations with better data handling
  const lineChartData = {
    labels:
      chartData.lineChart.length > 0
        ? chartData.lineChart.map((item) => item.date)
        : ["No Data"],
    datasets: [
      {
        label: "Daily Earnings",
        data:
          chartData.lineChart.length > 0
            ? chartData.lineChart.map((item) => item.value)
            : [0],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Withdraw", "Deposit", "Invested", "Pending"],
    datasets: [
      {
        data: [
          chartData.pieChart.withdrawConfirmed || 0,
          parseFloat(cardData.depositAmount || 0),
          parseFloat(cardData.investedAmount || 0),
          parseFloat(cardData.pendingInvestedLots || 0),
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(49, 135, 192, 1)",
          "rgba(233, 183, 56, 1)",
          "#5d3cacff",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(49, 135, 192, 1)",
          "rgba(233, 183, 56, 1)",
          "#5d3cacff",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels:
      chartData.barChart.length > 0
        ? chartData.barChart.map((item) => item.name || "Unknown")
        : ["No Data"],
    datasets: [
      {
        label: "Referral Earnings",
        data:
          chartData.barChart.length > 0
            ? chartData.barChart.map((item) => item.totalReferralEarnings || 0)
            : [0],
        backgroundColor: "rgba(153, 102, 255, 0.8)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const stackedAreaChartData = {
    labels:
      chartData.stackedAreaChart.length > 0
        ? chartData.stackedAreaChart.map((item) => item.date)
        : ["No Data"],
    datasets: [
      {
        label: "Daily Earnings",
        data:
          chartData.stackedAreaChart.length > 0
            ? chartData.stackedAreaChart.map((item) => item.daily || 0)
            : [0],
        borderColor: "rgb(255, 159, 64)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: true,
      },
      {
        label: "Referral Earnings",
        data:
          chartData.stackedAreaChart.length > 0
            ? chartData.stackedAreaChart.map((item) => item.referral || 0)
            : [0],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
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
        display: true,
        text: "Dashboard Analytics",
      },
    },
  };

  return (
    <>
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
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <span>Dashboard</span>
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
                        padding: "1px",
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
                    <a href="/user-dashboard" className="active">
                      Account Overview
                    </a>
                  </li>
                  <li>
                    <a href="/insights">Analytics</a>
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

              {/* Dashboard Boxes Section - Horizontal Scroll on Mobile */}
              <div
                className="dashboard-boxes hide-scrollbar"
                style={{
                  overflowX: "auto",
                  paddingBottom: "10px",
                }}
              >
                <div
                  className="row justify-content-lg-center g-4 mb-3"
                  style={{ minWidth: "900px" }}
                >
                  {/* Total Balance */}
                  <div className="col-4 col-lg-4">
                    <div className="dashboard-item">
                      <div className="row align-items-center">
                        <div className="col-4 text-center">
                          <img
                            src="/assets/images/dashboard/wallet.png"
                            alt="dashboard"
                            style={{ width: 48, height: 48 }}
                          />
                        </div>
                        <div className="col-8">
                          <h6
                            className="title mb-0"
                            style={{ fontWeight: 600 }}
                          >
                            Total Amount
                          </h6>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12 text-center">
                          <h3
                            className="ammount theme-one"
                            style={{ fontWeight: 700, fontSize: 22 }}
                          >
                            ${cardData.totalBalance || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Total Earning */}
                  <div className="col-4 col-lg-4">
                    <div className="dashboard-item">
                      <div className="row align-items-center">
                        <div className="col-4 text-center">
                          <img
                            src="/assets/images/dashboard/profit.png"
                            alt="dashboard"
                            style={{ width: 48, height: 48 }}
                          />
                        </div>
                        <div className="col-8">
                          <h6
                            className="title mb-0"
                            style={{ fontWeight: 600 }}
                          >
                            Total Earning
                          </h6>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12 text-center">
                          <h3
                            className="ammount theme-two"
                            style={{ fontWeight: 700, fontSize: 22 }}
                          >
                            ${cardData.totalEarn || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Referral Earning */}
                  <div className="col-4 col-lg-4">
                    <div className="dashboard-item">
                      <div className="row align-items-center">
                        <div className="col-4 text-center">
                          <img
                            src="/assets/images/dashboard/reference.png"
                            alt="dashboard"
                            style={{ width: 48, height: 48 }}
                          />
                        </div>
                        <div className="col-8">
                          <h6
                            className="title mb-0"
                            style={{ fontWeight: 600 }}
                          >
                            Referral Earning
                          </h6>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12 text-center">
                          <h3
                            className="ammount theme-four"
                            style={{ fontWeight: 700, fontSize: 22 }}
                          >
                            ${cardData.refEarn || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Row of Dashboard Boxes */}
              <div
                className="dashboard-boxes hide-scrollbar"
                style={{
                  overflowX: "auto",
                  paddingBottom: "10px",
                }}
              >
                <div
                  className="row justify-content-lg-center g-4 mb-3"
                  style={{ minWidth: "900px" }}
                >
                  {/* Deposit Amount */}
                  <div className="col-4 col-lg-4">
                    <div className="dashboard-item">
                      <div className="row align-items-center">
                        <div className="col-4 text-center">
                          <img
                            src="/assets/images/dashboard/deposit.png"
                            alt="dashboard"
                            style={{ width: 48, height: 48 }}
                          />
                        </div>
                        <div className="col-8">
                          <h6
                            className="title mb-0"
                            style={{ fontWeight: 600 }}
                          >
                            Deposit Amount
                          </h6>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12 text-center">
                          <h3
                            className="ammount theme-three"
                            style={{ fontWeight: 700, fontSize: 22 }}
                          >
                            ${cardData.depositAmount || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Withdraw Amount Box */}
                  <div className="col-4 col-lg-4">
                    <div className="dashboard-item">
                      <div className="row align-items-center">
                        <div className="col-4 text-center">
                          <img
                            src="/assets/images/dashboard/withdraw.png"
                            alt="dashboard"
                            style={{ width: 48, height: 48 }}
                          />
                        </div>
                        <div className="col-8">
                          <h6
                            className="title mb-0"
                            style={{ fontWeight: 600 }}
                          >
                            Withdraw Amount
                          </h6>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12 text-center">
                          <h3
                            className="ammount theme-two"
                            style={{ fontWeight: 700, fontSize: 22 }}
                          >
                            ${cardData.withdrawConfirmed || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Invested Amount */}
                  <div className="col-4 col-lg-4">
                    <div className="dashboard-item">
                      <div className="row align-items-center">
                        <div className="col-4 text-center">
                          <img
                            src="/assets/images/dashboard/invest.png"
                            alt="dashboard"
                            style={{ width: 48, height: 48 }}
                          />
                        </div>
                        <div className="col-8">
                          <h6
                            className="title mb-0"
                            style={{ fontWeight: 600 }}
                          >
                            Invested Amount
                          </h6>
                        </div>
                      </div>
                      <div className="row mt-2">
                        <div className="col-12 text-center">
                          <h3
                            className="ammount theme-three"
                            style={{ fontWeight: 700, fontSize: 22 }}
                          >
                            ${cardData.investedAmount || 0}
                          </h3>
                        </div>
                      </div>
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

              {/* Graphs Section Heading */}
              <div className="graphs-heading mt-5 mb-4">
                <div className="container">
                  <h3
                    className="title"
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#222",
                      textAlign: "left",
                      marginBottom: "0",
                      padding: "0px 0",
                    }}
                  >
                    Weekly Progress Summary
                  </h3>
                </div>
              </div>

              {/* All Graphs Section - Single Row with Horizontal Scrolling */}
              <section className="charts-section mt-4">
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
                      {/* Combined Growth Analysis */}
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
                          Growth Analysis
                        </h5>
                        <div style={{ height: "250px" }}>
                          <StackedArea
                            data={stackedAreaChartData}
                            options={{
                              ...chartOptions,
                              maintainAspectRatio: false,
                              plugins: {
                                ...chartOptions.plugins,
                                title: { display: false },
                              },
                            }}
                          />
                        </div>
                      </div>

                      {/* Balance Distribution */}
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
                            data={pieChartData}
                            options={{
                              ...chartOptions,
                              maintainAspectRatio: false,
                              plugins: {
                                ...chartOptions.plugins,
                                title: { display: false },
                              },
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

      <style>
        {`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;  /* IE and Edge */
                        scrollbar-width: none;  /* Firefox */
                    }
                `}
      </style>
    </>
  );
}

export default UserDashboard;
