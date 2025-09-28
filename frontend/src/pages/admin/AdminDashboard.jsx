import React, { useState, useEffect } from "react";
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
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import api from '../../Api'; // Adjust path if needed
import { Button, DatePicker, Space } from 'antd'; // Import Ant Design components
import moment from 'moment'; // For date handling

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
  const [filterType, setFilterType] = useState("all"); // New state for filter buttons
  const [selectedDate, setSelectedDate] = useState(null); // New state for date picker

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

  // Chart data mapping (aligned with your latest API structure)
  const userGrowthData = dashboard ? {
    labels: dashboard.userGrowth.map(item => item.date),
    datasets: [
      {
        label: "Users",
        data: dashboard.userGrowth.map(item => item.count),
        borderColor: "#2575fc",
        backgroundColor: "rgba(37,117,252,0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  } : { labels: [], datasets: [] };

  const referralEarningsData = dashboard ? {
    labels: dashboard.referralPerformance.map(item => `Level ${item.refLevel}`),
    datasets: [
      {
        label: "Earnings",
        data: dashboard.referralPerformance.map(item => item.totalAmount),
        backgroundColor: ["#36D1DC", "#5B86E5", "#C471F5"],
      },
    ],
  } : { labels: [], datasets: [] };

  const dailyEarningsData = dashboard ? {
    labels: dashboard.dailyEarnings.map(item => item.date),
    datasets: [
      {
        label: "Profit",
        data: dashboard.dailyEarnings.map(item => item.profit),
        borderColor: "#FF512F",
        backgroundColor: "rgba(255,81,47,0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Referral",
        data: dashboard.dailyEarnings.map(item => item.ref),
        borderColor: "#36D1DC",
        backgroundColor: "rgba(54,209,220,0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  } : { labels: [], datasets: [] };

  const depositWithdrawData = dashboard ? {
    labels: dashboard.investments.depositsVsWithdraws.map(item => item._id),
    datasets: [
      {
        data: dashboard.investments.depositsVsWithdraws.map(item => item.total),
        backgroundColor: ["#f46b45", "#0ba360"],
      },
    ],
  } : { labels: [], datasets: [] };


  const topUsersData = dashboard ? {
    labels: dashboard.topUsers.map(user => user.name),
    datasets: [
      {
        label: "Balance",
        data: dashboard.topUsers.map(user => user.totalBalance),
        backgroundColor: "#6a11cb",
      },
    ],
  } : { labels: [], datasets: [] };

  // Stats cards
  const stats = dashboard ? [
    { label: "Users", value: dashboard.totalUsers, icon: "bi-people", color: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" },
    { label: "Balance + Invest", value: `$${dashboard.totals.totalBalance + dashboard.totals.totalInvest}`, icon: "bi-plus-circle", color: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
    { label: "Balance", value: `$${dashboard.totals.totalBalance}`, icon: "bi-currency-dollar", color: "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)" },
    { label: "Invest", value: `$${dashboard.totals.totalInvest}`, icon: "bi-bar-chart", color: "linear-gradient(135deg, #C471F5 0%, #FA71CD 100%)" },
    { label: "Referral Earn", value: dashboard.totals.totalRefEarn, icon: "bi-arrow-repeat", color: "linear-gradient(135deg, #36D1DC 0%, #5B86E5 100%)" },
    { label: "Earnings", value: dashboard.totals.totalEarn, icon: "bi-speedometer2", color: "linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)" },
    { label: "Deposit", value: `$${dashboard.totals.totalDeposit}`, icon: "bi-graph-up", color: "linear-gradient(135deg, #f46b45 0%, #eea849 100%)" },
    { label: "Withdraw", value: `$${dashboard.totals.totalWithdraw}`, icon: "bi-bag", color: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)" },
  ] : [];

  // Table data - Add _id field
  const tableData = dashboard ? dashboard.allUsers.map((user, idx) => ({
    id: idx + 1,
    _id: user._id, // Add this line to include the _id
    name: user.name,
    email: user.email,
    balance: user.totalBalance,
    deposit: user.depositAmount,
    invest: user.investedAmount,
    refEarn: user.refEarn,
    earning: user.totalEarn,
    // Only invest + balance for totalAmount
    totalAmount: user.investedAmount + user.totalBalance,
    status: user.status,
    date: user.createdAt,
    avatar: `https://i.pravatar.cc/40?img=${idx + 1}`,
  })) : [];

  // Apply filters and search
  const applyFiltersAndSearch = () => {
    let currentFilteredData = tableData;

    // Apply button filters
    if (filterType === "invested") {
      currentFilteredData = currentFilteredData.filter(user => user.invest > 0);
    } else if (filterType === "deposit") {
      currentFilteredData = currentFilteredData.filter(user => user.deposit > 0);
    } else if (filterType === "balance") {
      currentFilteredData = currentFilteredData.filter(user => user.balance > 0);
    }

    // Apply date filter
    if (selectedDate) {
      currentFilteredData = currentFilteredData.filter(user => {
        const userDate = moment(user.date).startOf('day');
        const filterDate = moment(selectedDate).startOf('day');
        return userDate.isSame(filterDate);
      });
    }

    // Apply search filter
    currentFilteredData = currentFilteredData.filter(row =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.email.toLowerCase().includes(search.toLowerCase())
    );

    return currentFilteredData;
  };

  const filteredTableData = applyFiltersAndSearch();

  // Pagination logic
  const totalRows = filteredTableData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedRows = filteredTableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset to page 1 if search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterType, selectedDate]);


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
      alert('User deleted successfully');
    } catch (err) {
      alert('Failed to delete user');
    }
  };

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
            {/* Search Bar */}
            <form className="d-none d-md-flex ms-4" style={{ width: "300px" }} onSubmit={e => e.preventDefault()}>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="search"
                  className="form-control border-start-0"
                  placeholder="Search by name and email"
                  aria-label="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </form>
          </div>

          <div className="d-flex align-items-center">
            {/* Mobile search button - Hidden on desktop */}
            <button className="btn btn-outline-secondary d-md-none me-2" type="button">
              <i className="bi bi-search"></i>
            </button>

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

      {/* Mobile search bar - Appears when search button is clicked */}
      <div className="d-md-none bg-light p-2 border-bottom">
        <div className="input-group">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-muted"></i>
          </span>
          <input
            type="search"
            className="form-control border-start-0"
            placeholder="Search..."
            aria-label="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

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

            {/* Statistic Cards - Horizontal Scrollable */}
            <div className="mb-4">
              <div className="d-flex flex-nowrap overflow-auto pb-2 stats-scroll-container" style={{ scrollbarWidth: 'thin' }}>
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="card flex-shrink-0 me-3 border-0 shadow-sm"
                    style={{
                      width: "200px",
                      background: stat.color,
                      borderRadius: "12px"
                    }}
                  >
                    <div className="card-body text-white">
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
              <h4 className="mb-3 fw-bold text-dark">Analytics Overview</h4>
              <div className="row">
                <div className="col-12">
                  {/* Make the graphs horizontally scrollable in a flex container */}
                  <div className="d-flex flex-nowrap overflow-auto pb-2" style={{ gap: "10px" }}>
                    {/* Graphs as cards, fixed width for each */}
                    <div style={{ minWidth: "300px", maxWidth: "300px" }}>
                      <div className="card border-0 shadow-sm h-100 mb-3">
                        <div className="card-header bg-white border-0">
                          <h6 className="mb-0 fw-bold">User Growth Trend</h6>
                          <small className="text-muted">Monthly new user registrations</small>
                        </div>
                        <div className="card-body">
                          <div className="chart-container" style={{ height: '200px' }}>
                            <Line data={userGrowthData} options={chartOptions} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ minWidth: "300px", maxWidth: "300px" }}>
                      <div className="card border-0 shadow-sm h-100 mb-3">
                        <div className="card-header bg-white border-0">
                          <h6 className="mb-0 fw-bold">Referral Earnings by Level</h6>
                          <small className="text-muted">Earnings distribution across referral levels</small>
                        </div>
                        <div className="card-body">
                          <div className="chart-container" style={{ height: '200px' }}>
                            <Bar data={referralEarningsData} options={chartOptions} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ minWidth: "350px", maxWidth: "350px" }}>
                      <div className="card border-0 shadow-sm h-100 mb-3">
                        <div className="card-header bg-white border-0">
                          <h6 className="mb-0 fw-bold">Daily Profit Trend</h6>
                          <small className="text-muted">Weekly profit and referral earnings</small>
                        </div>
                        <div className="card-body">
                          <div className="chart-container" style={{ height: '200px' }}>
                            <Line data={dailyEarningsData} options={chartOptions} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ minWidth: "350px", maxWidth: "350px" }}>
                      <div className="card border-0 shadow-sm h-100 mb-3">
                        <div className="card-header bg-white border-0">
                          <h6 className="mb-0 fw-bold">Deposit vs Withdraw</h6>
                          <small className="text-muted">Ratio of deposits to withdrawals</small>
                        </div>
                        <div className="card-body">
                          <div className="chart-container" style={{ height: '200px' }}>
                            <Pie data={depositWithdrawData} options={chartOptions} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ minWidth: "350px", maxWidth: "350px" }}>
                      <div className="card border-0 shadow-sm h-100 mb-3">
                        <div className="card-header bg-white border-0">
                          <h6 className="mb-0 fw-bold">Top Users by Balance</h6>
                          <small className="text-muted">Users with highest account balances</small>
                        </div>
                        <div className="card-body">
                          <div className="chart-container" style={{ height: '200px' }}>
                            <Bar
                              data={topUsersData}
                              options={{
                                ...chartOptions,
                                indexAxis: 'y',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End flex container */}
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap"> {/* Added flex-wrap for responsiveness */}
                  <div>
                    <h5 className="mb-0 fw-bold text-dark">User Management</h5>
                    <p className="text-muted mb-0">Manage all users from this panel</p>
                  </div>
                  <Space className="mt-3 mt-md-0"> {/* Margin top for smaller screens */}
                    <Button.Group>
                      <Button type={filterType === "all" ? "primary" : "default"} onClick={() => { setFilterType("all"); setSelectedDate(null); }}>All</Button>
                      <Button type={filterType === "invested" ? "primary" : "default"} onClick={() => { setFilterType("invested"); setSelectedDate(null); }}>Invested</Button>
                      <Button type={filterType === "deposit" ? "primary" : "default"} onClick={() => { setFilterType("deposit"); setSelectedDate(null); }}>Deposit</Button>
                      <Button type={filterType === "balance" ? "primary" : "default"} onClick={() => { setFilterType("balance"); setSelectedDate(null); }}>Balance</Button>
                    </Button.Group>
                    <DatePicker onChange={(date) => { setSelectedDate(date); setFilterType("all"); }} value={selectedDate} /> {/* Clear button filters when date is selected */}
                  </Space>
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
                        <th scope="col">Balance</th>
                        <th scope="col">Deposit</th>
                        <th scope="col">Invest</th>
                        <th scope="col">Ref Earn</th>
                        <th scope="col">Earning</th>
                        <th scope="col">Total Amount</th>
                        <th scope="col">Action</th>
                        <th scope="col">Status</th>
                        <th scope="col" className="pe-4">Date</th>
                        <th scope="col" className="pe-4">Delete User</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRows.map((row, idx) => (
                        <tr
                          key={row.id}
                          className={idx % 2 === 0 ? "table-row-light" : "table-row-dark"}
                        >
                          <td className="ps-4">{row.id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              {row.name}
                            </div>
                          </td>
                          <td>{row.email}</td>
                          <td className="fw-bold text-success">{row.balance}</td>
                          <td>{row.deposit}</td>
                          <td>{row.invest}</td>
                          <td>{row.refEarn}</td>
                          <td>{row.earning}</td>
                          <td className="fw-bold text-primary">{row.totalAmount}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleViewUser(row._id)}
                            >
                              <i className="bi bi-eye me-1"></i> View
                            </button>
                          </td>
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
                          <td className="pe-4">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteUser(row._id)}
                            >
                              <i className="bi bi-trash me-1"></i> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    Showing {paginatedRows.length} out of {totalRows} results
                  </div>
                  <nav aria-label="User pagination">
                    <ul className="pagination mb-0">
                      <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, idx) => (
                        <li key={idx + 1} className={`page-item${currentPage === idx + 1 ? " active" : ""}`}>
                          <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>
                            {idx + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>

            {/* Add a new section below the main table for "Other Users" */}
            {/*  */}
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

export default AdminDashboard;