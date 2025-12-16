import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import api from "../../Api";

function EarningHistory() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
    referralCode: "",
    depositAmount: 0,
    investedAmount: 0,
    earnings: [],
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const rowsPerPage = 8;

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
        const res = await api.get(
          `/user/earnhistory?page=${currentPage}&limit=${rowsPerPage}`,
          {
            withCredentials: true,
          }
        );
        const user = Array.isArray(res.data) ? res.data[0] : res.data;

        if (user && user.pagination) {
          setTotalPages(user.pagination.totalPages);
          setTotalRows(user.pagination.total);
        }

        setUserData({
          name: user.name || "",
          email: user.email || "",
          image: user.image || "",
          referralCode: user.referralCode || "",
          depositAmount: user.depositAmount || 0,
          investedAmount: user.investedAmount || 0,
          earnings: user.earnings || [],
          lastEarningDate:
            user.earnings && user.earnings.length > 0
              ? user.earnings[0].date // Sorted DESC, so first is latest
              : "",
        });
      } catch (err) {
        console.error("Authentication or data loading failed:", err);
        localStorage.removeItem("authenticated");
        localStorage.removeItem("isAdmin"); // Assuming this might be used?
        // alert("Your session has expired, Please login again."); // Can be annoying on refresh
        // window.location.href = "/login";
        return;
      }

      await loadAssets();
      setIsLoading(false);
    };

    init();
  }, [navigate, currentPage]);

  // Pagination logic
  const paginatedData = userData.earnings || [];

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

      {/* Styles for hiding scrollbar */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

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
                  <a href="/user-dashboard">Dashboard</a>
                </li>
                {/* <li><span>Dashboard</span></li> */}
                <li>
                  <span>Earning History</span>
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
              <div className="dashboard-sidebar">
                <div className="close-dashboard d-lg-none">
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
                    <span style={{ fontSize: "14px", color: "#666" }}>
                      Welcome
                    </span>
                    <h5
                      className="name"
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        margin: "5px 0",
                        color: "#222",
                      }}
                    >
                      {userData.name}
                    </h5>
                    <p
                      className="email"
                      style={{ fontSize: "14px", color: "#666", margin: "0" }}
                    >
                      {userData.email}
                    </p>
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
                    <a href="/insights">Analytics</a>
                  </li>
                  <li>
                    <a href="/earning-history" className="active">
                      Earnings History
                    </a>
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
                <div className="user-toggler">
                  <i className="las la-sliders-h"></i>
                </div>
              </div>

              {/* Dashboard Boxes Section - Horizontal Scroll on Mobile */}
              <div
                className="dashboard-boxes hide-scrollbar"
                style={{
                  overflowX: "auto",
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
                            ${userData.totalBalance || 0}
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
                            ${userData.totalEarn || 0}
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
                            ${userData.refEarn || 0}
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
                            ${userData.depositAmount || 0}
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
                            ${userData.investedAmount || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Pending Amount Box */}
                  <div className="col-4 col-lg-4">
                    <div className="dashboard-item position-relative">
                      {/* Top-right info icon */}
                      <div
                        className="position-absolute top-0 end-0 me-2 mt-2"
                        style={{ cursor: "pointer" }}
                        title="The money you have invested will generate profit after 24 hours."
                        onClick={() => {
                          try {
                            const isTouch =
                              typeof window !== "undefined" &&
                              window.matchMedia &&
                              window.matchMedia("(hover: none)").matches;
                            if (isTouch) setShowPendingInfoModal(true);
                          } catch (_) {
                            // no-op
                          }
                        }}
                      >
                        {userData?.pendingLotsSum > 0 && (
                          <span
                            style={{
                              display: "inline-block",
                              backgroundColor: "#ff3b30",
                              color: "#fff",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            textAlign: "center",
                            lineHeight: "20px",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        >
                          ?
                        </span>
                        )}
                      </div>

                      <div className="row align-items-center">
                        <div className="col-4 text-center">
                          <img
                            src="/assets/images/dashboard/queue.png"
                            alt="dashboard"
                            style={{ width: 48, height: 48 }}
                          />
                        </div>
                        <div className="col-8">
                          <h6
                            className="title mb-0"
                            style={{ fontWeight: 600 }}
                          >
                            Pending Amount
                          </h6>
                        </div>
                      </div>

                      <div className="row mt-2">
                        <div className="col-12 text-center">
                          <h3
                            className="ammount theme-four"
                            style={{ fontWeight: 700, fontSize: 22 }}
                          >
                            ${(userData?.pendingLotsSum || 0).toLocaleString()}
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
              <div className="dashborad-header">
                <h4 className="title">Daily Earning</h4>
                {/* Show last earning date if available
                                // {userData.lastEarningDate && (
                                //     <div style={{ fontSize: '16px', color: '#444', marginBottom: '10px' }}>
                                //         Last Earning Date: <b>{userData.lastEarningDate}</b>
                                //     </div>
                                // )} */}
              </div>
              <div
                style={{
                  width: "100%",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                  background: "#fff",
                  borderRadius: 8,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  marginBottom: "1.5rem",
                  border: "1px solid #eee",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 400,
                    fontSize: "15px",
                    background: "#fff",
                  }}
                >
                  <thead>
                    <tr>
                      {[
                        "Amount",
                        "Earning",
                        "Ref Earning",
                        "Total Earning",
                        "Date",
                      ].map((header) => (
                        <th
                          key={header}
                          style={{
                            background: "#f8f9fa",
                            fontWeight: 600,
                            color: "#222",
                            padding: "12px 10px",
                            borderBottom: "1px solid #eee",
                            position: "sticky",
                            top: 0,
                            zIndex: 2,
                            textAlign: "left",
                            whiteSpace: "normal",
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
                          <td
                            style={{
                              padding: "12px 10px",
                              borderBottom: "1px solid #eee",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              verticalAlign: "middle",
                              textAlign: "left",
                            }}
                          >
                            ${item.baseAmount}
                          </td>
                          <td
                            style={{
                              padding: "12px 10px",
                              borderBottom: "1px solid #eee",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              verticalAlign: "middle",
                              textAlign: "left",
                            }}
                          >
                            ${item.dailyProfit}
                          </td>
                          <td
                            style={{
                              padding: "12px 10px",
                              borderBottom: "1px solid #eee",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              verticalAlign: "middle",
                              textAlign: "left",
                            }}
                          >
                            ${item.refEarn}
                          </td>
                          <td
                            style={{
                              padding: "12px 10px",
                              borderBottom: "1px solid #eee",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              verticalAlign: "middle",
                              textAlign: "left",
                            }}
                          >
                            $
                            {(
                              Number(item.dailyProfit) + Number(item.refEarn)
                            ).toFixed(2)}
                          </td>
                          <td
                            style={{
                              padding: "12px 10px",
                              borderBottom: "1px solid #eee",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              verticalAlign: "middle",
                              textAlign: "left",
                            }}
                          >
                            {item.date}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          style={{ textAlign: "center", padding: "12px 10px" }}
                        >
                          No earning history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem 0",
                    background: "#fff",
                    borderRadius: "8px",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={{ fontSize: "14px", color: "#666" }}>
                    Showing {Math.min(currentPage * rowsPerPage, totalRows)} of{" "}
                    {totalRows} results
                  </div>
                  <nav aria-label="Table pagination">
                    <ul
                      style={{
                        display: "flex",
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        gap: "4px",
                      }}
                    >
                      <li>
                        <button
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #dee2e6",
                            background: currentPage === 1 ? "#e9ecef" : "#fff",
                            color: currentPage === 1 ? "#6c757d" : "#007bff",
                            cursor:
                              currentPage === 1 ? "not-allowed" : "pointer",
                            borderRadius: "4px",
                            fontSize: "14px",
                          }}
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <MdOutlineArrowBackIos />
                        </button>
                      </li>
                      {/* Numbered buttons removed as per request */}
                      <li>
                        <button
                          style={{
                            padding: "8px 12px",
                            border: "1px solid #dee2e6",
                            background:
                              currentPage === totalPages ? "#e9ecef" : "#fff",
                            color:
                              currentPage === totalPages
                                ? "#6c757d"
                                : "#007bff",
                            cursor:
                              currentPage === totalPages
                                ? "not-allowed"
                                : "pointer",
                            borderRadius: "4px",
                            fontSize: "14px",
                          }}
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <MdArrowForwardIos />
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

      <a href="#0" className="scrollToTop active">
        <i className="las la-chevron-up"></i>
      </a>
    </>
  );
}

export default EarningHistory;
