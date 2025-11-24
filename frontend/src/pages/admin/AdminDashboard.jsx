import React, { useState, useEffect, useCallback } from "react";
import { FaAngleRight, FaAngleLeft  } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import api from '../../Api'; // Adjust path if needed

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [pageCache, setPageCache] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState("");

  const rowsPerPage = 10;

  // Fetch dashboard data on mount
  useEffect(() => {
    api.get('/admin/adminGetAllUsers')
      .then(res => {
        setDashboard(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("isAdmin");
    window.location.href = "/login"; // redirect to login
  };

  const formatCurrency = (value) => `$${Number(value || 0).toLocaleString()}`;

  const totals = dashboard?.totals ?? {
    totalBalance: 0,
    totalDeposit: 0,
    totalInvest: 0,
    totalRefEarn: 0,
    totalEarn: 0,
    totalWithdraw: 0,
    pendingLotsTotal: 0,
  };

  const userGrowth = dashboard?.userGrowth ?? [];
  const referralPerformance = dashboard?.referralPerformance ?? [];
  const dailyEarnings = dashboard?.dailyEarnings ?? [];
  const depositsVsWithdraws = dashboard?.investments?.depositsVsWithdraws ?? [];
  const topUsers = dashboard?.topUsers ?? [];

  // Chart data mapping (aligned with your latest API structure)
  const userGrowthData = dashboard ? {
    labels: userGrowth.map(item => item.date),
    datasets: [
      {
        label: "Users",
        data: userGrowth.map(item => item.count),
        borderColor: "#2575fc",
        backgroundColor: "rgba(37,117,252,0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  } : { labels: [], datasets: [] };

  const referralPerformanceLevels = [0, 1, 2, 3];
  const referralPerformanceData = dashboard ? {
    labels: referralPerformanceLevels.map(level => `Level ${level}`),
    datasets: [
      {
        label: "Referrals",
        data: referralPerformanceLevels.map(level => {
          const entry = referralPerformance.find(item => item.refLevel === level);
          return entry ? entry.count : 0;
        }),
        backgroundColor: ["#36D1DC", "#5B86E5", "#C471F5", "#8E2DE2"],
      },
    ],
  } : { labels: [], datasets: [] };

  const dailyEarningsData = dashboard ? {
    labels: dailyEarnings.map(item => item.date),
    datasets: [
      {
        label: "Daily Profit",
        data: dailyEarnings.map(item => item.dailyProfit ?? item.profit ?? 0),
        borderColor: "#FF512F",
        backgroundColor: "rgba(255,81,47,0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Referral Earn",
        data: dailyEarnings.map(item => item.refEarn ?? item.ref ?? 0),
        borderColor: "#36D1DC",
        backgroundColor: "rgba(54,209,220,0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  } : { labels: [], datasets: [] };

  const depositWithdrawData = dashboard ? {
    labels: depositsVsWithdraws.map(item => item._id),
    datasets: [
      {
        data: depositsVsWithdraws.map(item => item.total),
        backgroundColor: ["#f46b45", "#0ba360"],
      },
    ],
  } : { labels: [], datasets: [] };

  const systemTotalsData = dashboard ? {
    labels: ["Total Balance", "Pending Lots", "Total Invest"],
    datasets: [
      {
        data: [
          totals.totalBalance,
          totals.pendingLotsTotal,
          totals.totalInvest
        ],
        backgroundColor: ["#6a11cb", "#FFB347", "#11998e"],
      },
    ],
  } : { labels: [], datasets: [] };

  const topUsersData = dashboard ? {
    labels: topUsers.map(user => user.name),
    datasets: [
      {
        label: "Balance",
        data: topUsers.map(user => user.totalBalance),
        backgroundColor: "#6a11cb",
      },
    ],
  } : { labels: [], datasets: [] };

  // Stats cards
  const financialSummary = dashboard ? [
    { label: "Total Balance", value: formatCurrency(totals.totalBalance + totals.totalInvest + totals.pendingLotsTotal), icon: "bi-plus-circle", color: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
    { label: "Balance", value: formatCurrency(totals.totalBalance), icon: "bi-currency-dollar", color: "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)" },
    { label: "Invest", value: formatCurrency(totals.totalInvest), icon: "bi-bar-chart", color: "linear-gradient(135deg, #C471F5 0%, #FA71CD 100%)" },
    { label: "Pending", value: formatCurrency(totals.pendingLotsTotal), icon: "bi-hourglass-split", color: "linear-gradient(135deg, #FFC371 0%, #FF5F6D 100%)" },
  ] : [];

  const userSummary = dashboard ? [
    { label: "Users", value: dashboard.totalUsers, icon: "bi-people", color: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" },
    { label: "Referral Earn", value: formatCurrency(totals.totalRefEarn), icon: "bi-arrow-repeat", color: "linear-gradient(135deg, #36D1DC 0%, #5B86E5 100%)" },
    { label: "Earnings", value: formatCurrency(totals.totalEarn), icon: "bi-speedometer2", color: "linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)" },
    { label: "Deposit (7d)", value: formatCurrency(totals.totalDeposit), icon: "bi-graph-up", color: "linear-gradient(135deg, #f46b45 0%, #eea849 100%)" },
    { label: "Withdraw (7d)", value: formatCurrency(totals.totalWithdraw), icon: "bi-wallet2", color: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)" },
  ] : [];

  const mapUserToRow = useCallback((user = {}) => ({
    _id: user._id || "",
    name: user.name || "",
    email: user.email || "",
    totalBalance: user.totalBalance || 0,
    totalEarn: user.totalEarn || 0,
    refEarn: user.refEarn || 0,
    depositAmount: user.depositAmount || 0,
    investedAmount: user.investedAmount || 0,
    status: user.status || "Unknown",
    date: user.createdAt || "",
  }), []);

  const paginatedRows = searchResults !== null ? searchResults : (pageCache[currentPage] || []);
  const isSearchActive = searchResults !== null;
  const baseIndex = isSearchActive ? 0 : (currentPage - 1) * rowsPerPage;
  const disablePrev = isSearchActive || tableLoading || currentPage <= 1;
  const disableNext = isSearchActive || tableLoading || currentPage >= totalPages;

  const fetchUsersPage = useCallback(async (page = 1, endpoint = '/admin/adminGetUsersPaginated', requestPageOverride) => {
    setTableLoading(true);
    setTableError("");
    try {
      const requestPageNumber = requestPageOverride ?? page;
      const res = await api.get(endpoint, {
        params: {
          page: requestPageNumber,
          limit: rowsPerPage,
        },
      });

      const {
        users = [],
        totalPages: totalFromApi = 1,
        totalUsers = 0,
      } = res.data;

      const normalized = users.map(user => mapUserToRow(user));

      setPageCache(prev => ({
        ...prev,
        [page]: normalized,
      }));
      setTotalPages(totalFromApi || 1);
      setTotalUsersCount(totalUsers || 0);
      setCurrentPage(page);
    } catch (err) {
      setTableError("Failed to load users. Please try again.");
    } finally {
      setTableLoading(false);
    }
  }, [rowsPerPage, mapUserToRow]);

  useEffect(() => {
    fetchUsersPage(1);
  }, [fetchUsersPage]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    maintainAspectRatio: false,
  };

  // Handle View button click
  const handleViewUser = (userId) => {
    navigate(`/admin-specific-user/${userId}`);
  };

  // Handle Delete button click
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      await api.post('/admin/adminDeleteUser', { _id: userId });
      // Refresh dashboard data after delete
      const res = await api.get('/admin/adminGetAllUsers');
      setDashboard(res.data);
      setSearchResults(null);
      setSearch("");
      setSearchError("");
      setPageCache({});
      await fetchUsersPage(1);
      alert('User deleted successfully');
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleSearchInputChange = (value) => {
    setSearch(value);
    setSearchError("");
    if (!value.trim()) {
      setSearchResults(null);
    }
  };

  const handleSearchUsers = async () => {
    const trimmedSearch = search.trim();
    if (!trimmedSearch) {
      setSearchResults(null);
      setSearchError("");
      return;
    }

    setSearchLoading(true);
    setSearchError("");

    try {
      const res = await api.get('/admin/adminGetUserBySearch', {
        params: { search: trimmedSearch }
      });

      const dataArray = Array.isArray(res.data) ? res.data : [res.data];
      setSearchResults(dataArray.map(user => mapUserToRow(user)));
      if (dataArray.length === 0) {
        setSearchError("No users found.");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setSearchResults([]);
        setSearchError("No users found.");
      } else {
        setSearchResults(null);
        setSearchError("Failed to search users. Please try again.");
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const handleNextPage = () => {
    if (isSearchActive || tableLoading || currentPage >= totalPages) return;
    const nextPage = currentPage + 1;
    fetchUsersPage(nextPage);
  };

  const handlePreviousPage = () => {
    if (isSearchActive || tableLoading || currentPage <= 1) return;
    const previousPage = currentPage - 1;
    if (pageCache[previousPage]) {
      setCurrentPage(previousPage);
    } else {
      const backwardPageParam = Math.max(1, totalPages - previousPage + 1);
      fetchUsersPage(previousPage, '/admin/adminGetUsersPaginatedBackward', backwardPageParam);
    }
  };

  const handlePageNumberClick = (pageNumber) => {
    if (isSearchActive || tableLoading || pageNumber === currentPage) return;
    if (pageCache[pageNumber]) {
      setCurrentPage(pageNumber);
    } else {
      if (pageNumber < currentPage) {
        const backwardPageParam = Math.max(1, totalPages - pageNumber + 1);
        fetchUsersPage(pageNumber, '/admin/adminGetUsersPaginatedBackward', backwardPageParam);
      } else {
        fetchUsersPage(pageNumber);
      }
    }
  };

  // Enhanced ellipsis handler for jumping pages
  const handleEllipsisClick = (type) => {
    if (isSearchActive || tableLoading) return;
    
    let jumpPage;
    if (type === 'start') {
      // Jump back 5 pages from current
      jumpPage = Math.max(1, currentPage - 5);
    } else {
      // Jump forward 5 pages from current
      jumpPage = Math.min(totalPages, currentPage + 5);
    }
    
    handlePageNumberClick(jumpPage);
  };

  // Enhanced pagination with better ellipsis handling
  const getPageList = () => {
    if (isSearchActive) return [];
    
    // If total pages is small, show all
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, idx) => ({
        type: 'number',
        value: idx + 1
      }));
    }

    const pages = [];
    
    // Always show first page
    pages.push({ type: 'number', value: 1 });

    // Determine middle pages around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if we're near the start
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages - 1);
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 4);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push({ type: 'ellipsis', value: 'start', position: 'after-first' });
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push({ type: 'number', value: i });
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push({ type: 'ellipsis', value: 'end', position: 'before-last' });
    }

    // Always show last page
    pages.push({ type: 'number', value: totalPages });

    return pages;
  };

  // Responsive page list for mobile devices
  const getResponsivePageList = () => {
    if (isSearchActive) return [];
    
    const isMobile = window.innerWidth < 768;
    const maxVisiblePages = isMobile ? 5 : 7;
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, idx) => ({
        type: 'number',
        value: idx + 1
      }));
    }

    const pages = [];
    pages.push({ type: 'number', value: 1 });

    if (currentPage <= 3) {
      // Near start: show first 3 pages, ellipsis, last 2 pages
      for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
        pages.push({ type: 'number', value: i });
      }
      if (totalPages > 5) {
        pages.push({ type: 'ellipsis', value: 'middle', position: 'middle' });
      }
      pages.push({ type: 'number', value: totalPages });
    } else if (currentPage >= totalPages - 2) {
      // Near end: show first page, ellipsis, last 3 pages
      pages.push({ type: 'ellipsis', value: 'middle', position: 'middle' });
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pages.push({ type: 'number', value: i });
      }
    } else {
      // Middle: show first, current-1, current, current+1, last
      pages.push({ type: 'ellipsis', value: 'start', position: 'after-first' });
      pages.push({ type: 'number', value: currentPage - 1 });
      pages.push({ type: 'number', value: currentPage });
      pages.push({ type: 'number', value: currentPage + 1 });
      pages.push({ type: 'ellipsis', value: 'end', position: 'before-last' });
      pages.push({ type: 'number', value: totalPages });
    }

    return pages;
  };

  // Use responsive pagination
  const pageList = getResponsivePageList();

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="min-vh-100 bg-light" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand navbar-light bg-white border-bottom px-3 py-2 sticky-top shadow-sm" style={{ zIndex: 1020 }}>
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
            <a className="navbar-brand fw-bold fs-4 mb-0 text-primary me-4" href="/admin-dashboard">
              <i className="bi bi-speedometer2 me-2"></i>Admin Panel
            </a>
          </div>

          <div className="d-flex align-items-center">
            <span className="me-3 d-none d-sm-inline text-muted">Hello, Admin</span>
            <div className="dropdown">
              <button className="btn p-0 border-0" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://i.pravatar.cc/40" alt="Profile" className="rounded-circle shadow-sm" width="40" height="40" />
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                <li><a className="dropdown-item" href="#"><i className="bi bi-gear me-2"></i>Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar for desktop */}
          <div className="col-md-3 col-lg-2 d-none d-md-block bg-white sidebar border-end vh-100 sticky-top" style={{ zIndex: 1010, top: "56px" }}>
            <div className="p-3">
              <h4 className="mb-4 fs-4 text-primary">
                <i className="bi bi-layers me-2"></i>Admin
              </h4>
              <ul className="nav flex-column">
                <li className="nav-item mb-2">
                  <a className="nav-link active bg-primary text-white rounded" href="/admin-dashboard">
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
                  <a className="nav-link text-dark" href="#">
                    <i className="bi bi-gear me-2"></i> Settings
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <main className="col-md-9 col-lg-10 px-md-4 py-3">
            {/* Page Title */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 fw-bold text-dark">Dashboard Overview</h2>
            </div>

            {/* Statistic Cards */}
            <div className="mb-4">
              <h5 className="fw-bold mb-3 text-dark">Financial Summary</h5>
              <div className="d-flex flex-nowrap overflow-auto gap-3 pb-2 summary-scroll">
                {financialSummary.map(stat => (
                  <div
                    key={stat.label}
                    className="card border-0 shadow-sm flex-shrink-0"
                    style={{
                      background: stat.color,
                      borderRadius: "12px",
                      minWidth: "190px",
                    }}
                  >
                    <div className="card-body text-white py-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-white bg-opacity-25 p-3 rounded-circle me-3">
                          <i className={`bi ${stat.icon} fs-3`}></i>
                        </div>
                        <div>
                          <div className="fw-bold fs-4">{stat.value}</div>
                          <div className="opacity-75">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h5 className="fw-bold mb-3 text-dark">User & Earnings Summary</h5>
              <div className="d-flex flex-nowrap overflow-auto gap-3 pb-2 summary-scroll">
                {userSummary.map(stat => (
                  <div
                    key={stat.label}
                    className="card border-0 shadow-sm flex-shrink-0"
                    style={{
                      background: stat.color,
                      borderRadius: "12px",
                      minWidth: "190px",
                    }}
                  >
                    <div className="card-body text-white py-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-white bg-opacity-25 p-3 rounded-circle me-3">
                          <i className={`bi ${stat.icon} fs-3`}></i>
                        </div>
                        <div>
                          <div className="fw-bold fs-4">{stat.value}</div>
                          <div className="opacity-75">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Graphs Section */}
            <div className="mb-4">
              <h4 className="mb-3 fw-bold text-dark">Analytics Overview (Last 7 Days)</h4>
              <div className="d-flex flex-nowrap overflow-auto gap-3 pb-2 analytics-scroll">
                <div className="card border-0 shadow-sm flex-shrink-0" style={{ minWidth: "320px" }}>
                  <div className="card-header bg-white border-0">
                    <h6 className="mb-0 fw-bold">User Growth Trend</h6>
                    <small className="text-muted">New registrations over time</small>
                  </div>
                  <div className="card-body">
                    <div className="chart-container" style={{ height: '240px' }}>
                      <Line data={userGrowthData} options={chartOptions} />
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm flex-shrink-0" style={{ minWidth: "320px" }}>
                  <div className="card-header bg-white border-0">
                    <h6 className="mb-0 fw-bold">Referral Performance</h6>
                    <small className="text-muted">Levels 0 - 3</small>
                  </div>
                  <div className="card-body">
                    <div className="chart-container" style={{ height: '240px' }}>
                      <Bar data={referralPerformanceData} options={chartOptions} />
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm flex-shrink-0" style={{ minWidth: "320px" }}>
                  <div className="card-header bg-white border-0">
                    <h6 className="mb-0 fw-bold">Daily Earnings</h6>
                    <small className="text-muted">Profit vs referral rewards</small>
                  </div>
                  <div className="card-body">
                    <div className="chart-container" style={{ height: '240px' }}>
                      <Line data={dailyEarningsData} options={chartOptions} />
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm flex-shrink-0" style={{ minWidth: "320px" }}>
                  <div className="card-header bg-white border-0">
                    <h6 className="mb-0 fw-bold">Deposits vs Withdraws</h6>
                    <small className="text-muted">Capital flow split</small>
                  </div>
                  <div className="card-body">
                    <div className="chart-container" style={{ height: '240px' }}>
                      <Doughnut data={depositWithdrawData} options={chartOptions} />
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm flex-shrink-0" style={{ minWidth: "320px" }}>
                  <div className="card-header bg-white border-0">
                    <h6 className="mb-0 fw-bold">System Totals</h6>
                    <small className="text-muted">Balance · Pending · Invested</small>
                  </div>
                  <div className="card-body">
                    <div className="chart-container" style={{ height: '240px' }}>
                      <Doughnut data={systemTotalsData} options={chartOptions} />
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm flex-shrink-0" style={{ minWidth: "320px" }}>
                  <div className="card-header bg-white border-0">
                    <h6 className="mb-0 fw-bold">Top Users by Balance</h6>
                    <small className="text-muted">Leaderboard</small>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topUsers.map(user => (
                            <tr key={user._id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td className="fw-bold text-primary">{formatCurrency(user.totalBalance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div>
                    <h5 className="mb-0 fw-bold text-dark">User Management</h5>
                    <p className="text-muted mb-0">Manage all users from this panel</p>
                  </div>
                  <div className="mt-3 mt-md-0" style={{ minWidth: "320px" }}>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="search"
                        className="form-control border-start-0"
                        placeholder="Search by name or email"
                        aria-label="Search users"
                        value={search}
                        onChange={e => handleSearchInputChange(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearchUsers();
                          }
                        }}
                      />
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={handleSearchUsers}
                        disabled={searchLoading}
                      >
                        {searchLoading ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          'Search'
                        )}
                      </button>
                    </div>
                    {searchError && <small className="text-danger d-block mt-2">{searchError}</small>}
                    {tableError && !isSearchActive && <small className="text-danger d-block mt-1">{tableError}</small>}
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="ps-4">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Total Balance</th>
                        <th scope="col">Total Earn</th>
                        <th scope="col">Ref Earn</th>
                        <th scope="col">Deposit Amount</th>
                        <th scope="col">Invested Amount</th>
                        <th scope="col">Status</th>
                        <th scope="col" className="pe-4">Created</th>
                        <th scope="col">Action</th>
                        <th scope="col" className="pe-4">Delete User</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableLoading ? (
                        <tr>
                          <td colSpan="12" className="text-center py-4">
                            <div className="d-flex justify-content-center align-items-center">
                              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                              Loading users...
                            </div>
                          </td>
                        </tr>
                      ) : paginatedRows.length === 0 ? (
                        <tr>
                          <td colSpan="12" className="text-center py-4">
                            {isSearchActive ? "No users found for this search." : "No users to display."}
                          </td>
                        </tr>
                      ) : (
                        paginatedRows.map((row, idx) => {
                          const globalIndex = baseIndex + idx + 1;
                          const rowKey = row._id || `row-${globalIndex}`;
                          return (
                            <tr
                              key={rowKey}
                              className={idx % 2 === 0 ? "table-row-light" : "table-row-dark"}
                            >
                              <td className="ps-4">{globalIndex}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {row.name}
                                </div>
                              </td>
                              <td>{row.email}</td>
                              <td className="fw-bold text-success">{formatCurrency(row.totalBalance)}</td>
                              <td>{formatCurrency(row.totalEarn)}</td>
                              <td>{formatCurrency(row.refEarn)}</td>
                              <td>{formatCurrency(row.depositAmount)}</td>
                              <td>{formatCurrency(row.investedAmount)}</td>
                              <td>
                                <span
                                  className={`badge ${row.status === "Active" || row.status === "Verified"
                                    ? "bg-success"
                                    : row.status === "Inactive"
                                      ? "bg-secondary"
                                      : "bg-warning text-dark"
                                    }`}
                                >
                                  {row.status}
                                </span>
                              </td>
                              <td className="pe-4">{row.date}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleViewUser(row._id)}
                                  aria-label={`View user ${row.name}`}
                                >
                                  <i className="bi bi-eye me-1"></i> View
                                </button>
                              </td>
                              <td className="pe-4">
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteUser(row._id)}
                                  aria-label={`Delete user ${row.name}`}
                                >
                                  <i className="bi bi-trash me-1"></i> Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {isSearchActive
                      ? `Showing ${paginatedRows.length} search result${paginatedRows.length === 1 ? "" : "s"}`
                      : `${totalUsersCount} user${totalUsersCount === 1 ? "" : "s"}`}
                  </div>
                  {!isSearchActive && (
                    <nav aria-label="User pagination">
                      <ul className="pagination mb-0">
                        <li className={`page-item${disablePrev ? " disabled" : ""}`}>
                          <button 
                            className="page-link" 
                            onClick={handlePreviousPage} 
                            disabled={disablePrev}
                            aria-label="Previous page"
                          >
                            <FaAngleLeft />
                          </button>
                        </li>
                        {pageList.map((page, idx) => {
                          if (page.type === "ellipsis") {
                            return (
                              <li key={`${page.value}-${idx}`} className="page-item">
                                <button 
                                  className="page-link" 
                                  onClick={() => handleEllipsisClick(page.value)}
                                  aria-label={`Jump ${page.value === 'start' ? 'back' : 'forward'} 5 pages`}
                                >
                                  ...
                                </button>
                              </li>
                            );
                          }
                          return (
                            <li key={page.value} className={`page-item${currentPage === page.value ? " active" : ""}`}>
                              <button 
                                className="page-link" 
                                onClick={() => handlePageNumberClick(page.value)}
                                aria-label={`Go to page ${page.value}`}
                                aria-current={currentPage === page.value ? 'page' : undefined}
                              >
                                {page.value}
                              </button>
                            </li>
                          );
                        })}
                        <li className={`page-item${disableNext ? " disabled" : ""}`}>
                          <button 
                            className="page-link" 
                            onClick={handleNextPage} 
                            disabled={disableNext}
                            aria-label="Next page"
                          >
                            <FaAngleRight />
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
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
              <a
                className="nav-link active"
                href="/admin-dashboard"
                style={{ backgroundColor: "lightblue" }}
              >
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
              <a className="nav-link text-dark" href="#">
                <i className="bi bi-gear me-2"></i> Settings
              </a>
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        .summary-scroll::-webkit-scrollbar,
        .analytics-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .summary-scroll::-webkit-scrollbar-thumb,
        .analytics-scroll::-webkit-scrollbar-thumb {
          background: #c5c5c5;
          border-radius: 10px;
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
          .pagination .page-link {
            padding: 0.375rem 0.5rem;
            font-size: 0.875rem;
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
        .page-item.active .page-link {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }
        .page-link {
          color: #0d6efd;
        }
        .page-link:hover {
          color: #0a58ca;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;