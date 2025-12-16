import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api";

const AdminSetting = () => {
  const [dailyPercentage, setDailyPercentage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/admin/adminGetRizydraInfo", {
          withCredentials: true,
        });
        if (data && data.data) {
          setDailyPercentage(data.data.dailyPercentage);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("isAdmin");
    window.location.href = "/login";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/admin/adminUpdateRizydraInfo",
        { dailyPercentage },
        { withCredentials: true }
      );
      alert("Updated Successfully");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update");
    }
  };

  return (
    <div
      className="min-vh-100 bg-light"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      {/* Top Navbar */}
      <nav
        className="navbar navbar-expand navbar-light bg-white border-bottom px-3 py-2 sticky-top shadow-sm"
        style={{ zIndex: 1020 }}
      >
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            {/* Sidebar toggle for mobile */}
            <button
              className="btn btn-outline-secondary d-md-none me-2"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileSidebar"
              aria-controls="mobileSidebar"
            >
              <i className="bi bi-list"></i>
            </button>
            <a
              className="navbar-brand fw-bold fs-4 mb-0 text-primary me-4"
              href="/admin-dashboard"
            >
              <i className="bi bi-speedometer2 me-2"></i>Admin Panel
            </a>
          </div>

          <div className="d-flex align-items-center">
            <span className="me-3 d-none d-sm-inline text-muted">
              Hello, Admin
            </span>
            <div className="dropdown">
              <button
                className="btn p-0 border-0"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://i.pravatar.cc/40"
                  alt="Profile"
                  className="rounded-circle shadow-sm"
                  width="40"
                  height="40"
                />
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-gear me-2"></i>Settings
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar for desktop */}
          <div
            className="col-md-3 col-lg-2 d-none d-md-block bg-white sidebar border-end vh-100 sticky-top"
            style={{ zIndex: 1010, top: "56px" }}
          >
            <div className="p-3">
              <h4 className="mb-4 fs-4 text-primary">
                <i className="bi bi-layers me-2"></i>Admin
              </h4>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <a className="nav-link text-dark" href="/admin-dashboard">
                    <i className="bi bi-house me-2"></i> Dashboard
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link text-dark" href="/admin-users">
                    <i className="bi bi-people me-2"></i> Users
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link text-dark" href="/admin-deposit">
                    <i className="bi bi-bar-chart me-2"></i> Deposit
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link text-dark" href="/admin-withdraw">
                    <i className="bi bi-chat-left-text me-2"></i> Withdraw
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a className="nav-link text-dark" href="/admin-contact">
                    <i className="bi bi-chat-left-text me-2"></i> Contact
                  </a>
                </li>
                <li className="nav-item mb-2">
                  <a
                    className="nav-link active bg-primary text-white rounded"
                    href="/admin-setting"
                  >
                    <i className="bi bi-chat-left-text me-2"></i> Settings
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <main className="col-md-9 col-lg-10 px-md-4 py-3">
            {/* Page Title */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 fw-bold text-dark">Platform Settings </h2>
            </div>
            <div className="container-fluid h-100 d-flex flex-column justify-content-center">
              <div className="row justify-content-center w-100">
                <div className="col-md-6 col-lg-5">
                  <div className="card shadow-sm border-0 rounded-3">
                    <div className="card-body p-4 p-md-5">
                      <h3
                        className="text-center fw-bold mb-4"
                        style={{ color: "#0d6efd" }}
                      >
                        Rizydra Daily Income
                      </h3>

                      <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                          <label
                            htmlFor="dailyPercentage"
                            className="form-label fw-semibold text-secondary"
                          >
                            Daily Percentage
                          </label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control form-control-lg bg-light"
                              id="dailyPercentage"
                              placeholder="0.00"
                              value={dailyPercentage}
                              onChange={(e) =>
                                setDailyPercentage(e.target.value)
                              }
                              step="0.01"
                              min="0"
                              required
                            />
                            <span className="input-group-text bg-white text-secondary border-start-0">
                              %
                            </span>
                          </div>
                        </div>

                        <div className="d-grid mt-5">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg fw-bold shadow-sm text-uppercase"
                            style={{ letterSpacing: "1px" }}
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/* specific */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <h2 className="h4 fw-bold text-dark">
                    Control Earing (coming soon)
                  </h2>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Offcanvas Sidebar for mobile */}
      <div
        className="offcanvas offcanvas-start d-md-none"
        tabIndex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title text-primary" id="mobileSidebarLabel">
            <i className="bi bi-layers me-2"></i>Admin
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a className="nav-link text-dark" href="/admin-dashboard">
                <i className="bi bi-house me-2"></i> Dashboard
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-dark" href="/admin-users">
                <i className="bi bi-people me-2"></i> Users
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-dark" href="/admin-deposit">
                <i className="bi bi-bar-chart me-2"></i> Deposit
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-dark" href="/admin-withdraw">
                <i className="bi bi-chat-left-text me-2"></i> Withdraw
              </a>
            </li>
            <li className="nav-item mb-2">
              <a className="nav-link text-dark" href="/admin-contact">
                <i className="bi bi-chat-left-text me-2"></i> Contact
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                className="nav-link active bg-primary text-white rounded"
                href="/admin-setting"
              >
                <i className="bi bi-gear me-2"></i> Settings
              </a>
            </li>
          </ul>
        </div>
      </div>

      <style>{`
                .stats-scroll-container::-webkit-scrollbar {
                    height: 6px;
                }
                .stats-scroll-container::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .stats-scroll-container::-webkit-scrollbar-thumb {
                    background: #c5c5c5;
                    border-radius: 10px;
                }
                .stats-scroll-container::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
                .table th {
                    font-weight: 600;
                    color: #495057;
                    font-size: 0.9rem;
                    white-space: nowrap;
                }
                .table td {
                    vertical-align: middle;
                    color: #6c757d;
                    white-space: nowrap;
                }
                .input-group-text {
                    transition: all 0.3s;
                }
                .form-control:focus {
                    box-shadow: none;
                    border-color: #ced4da;
                }
                .form-control:focus + .input-group-text {
                    border-color: #86b7fe;
                }
                @media (max-width: 768px) {
                    .table-responsive {
                        font-size: 0.85rem;
                    }
                    .btn-sm {
                        padding: 0.25rem 0.5rem;
                        font-size: 0.75rem;
                    }
                }
                .chart-container {
                    position: relative;
                }
                .table-row-light {
                    background-color: #f8f9fa !important;
                }
                .table-row-dark {
                    background-color: #e9ecef !important;
                }
            `}</style>
    </div>
  );
};

export default AdminSetting;
