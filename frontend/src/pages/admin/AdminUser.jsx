import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api"; // Make sure this path is correct

const rowsPerPage = 10;

const useSearchPagination = (data, search, currentPage) => {
    // Filter data by name or email
    const filtered = data.filter(row =>
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.email.toLowerCase().includes(search.toLowerCase())
    );
    const totalRows = filtered.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const paginatedRows = filtered.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    return { filtered, paginatedRows, totalRows, totalPages };
};

const AdminUsers = () => {
    const navigate = useNavigate();
    const [usersData, setUsersData] = useState([]);
    const [totals, setTotals] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Filter states
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        referralLevel: null,
        minBalance: "",
        maxBalance: "",
        minInvest: "",
        maxInvest: "",
        selectedDate: ""
    });
    const [filteredUsers, setFilteredUsers] = useState([]);

    // Fetch users from API
    useEffect(() => {
        api.get("/admin/AdminGetAllUsersdata")
            .then(res => {
                setUsersData(res.data.users || []);
                setTotals(res.data.totals || {});
                setFilteredUsers(res.data.users || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Reset to page 1 if search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // Apply filters function
    const applyFilters = () => {
        let filtered = [...usersData];

        // Filter by referral level
        if (filters.referralLevel !== null) {
            filtered = filtered.filter(user => user.referralLevel === filters.referralLevel);
        }

        // Filter by total balance range
        if (filters.minBalance !== "" || filters.maxBalance !== "") {
            filtered = filtered.filter(user => {
                const balance = user.totalBalance;
                const min = filters.minBalance === "" ? 0 : parseFloat(filters.minBalance);
                const max = filters.maxBalance === "" ? Infinity : parseFloat(filters.maxBalance);
                return balance >= min && balance <= max;
            });
        }

        // Filter by invest balance range
        if (filters.minInvest !== "" || filters.maxInvest !== "") {
            filtered = filtered.filter(user => {
                const invest = user.investedAmount;
                const min = filters.minInvest === "" ? 0 : parseFloat(filters.minInvest);
                const max = filters.maxInvest === "" ? Infinity : parseFloat(filters.maxInvest);
                return invest >= min && invest <= max;
            });
        }

        // Filter by date
        if (filters.selectedDate !== "") {
            filtered = filtered.filter(user => {
                const userDate = new Date(user.createdAt);
                const selectedDate = new Date(filters.selectedDate);
                return userDate.toDateString() === selectedDate.toDateString();
            });
        }

        setFilteredUsers(filtered);
        setCurrentPage(1);
        setShowFilterModal(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("authenticated");
        localStorage.removeItem("isAdmin");
        window.location.href = "/login"; // redirect to login
    };

    // Clear filters function
    const clearFilters = () => {
        setFilters({
            referralLevel: null,
            minBalance: "",
            maxBalance: "",
            minInvest: "",
            maxInvest: "",
            selectedDate: ""
        });
        setFilteredUsers(usersData);
        setCurrentPage(1);
    };

    // Handle View button click
    const handleViewUser = (userId) => {
        navigate(`/admin-specific-user/${userId}`);
    };

    // Map API data to table rows - Add _id field
    const tableData = filteredUsers.map((user, idx) => ({
        id: idx + 1,
        _id: user._id, // Add this line to include the _id
        name: user.name,
        email: user.email,
        referralLevel: user.referralLevel,
        balance: user.totalBalance,
        deposit: user.depositAmount,
        invest: user.investedAmount,
        refEarn: user.refEarn,
        earning: user.totalEarn,
        totalAmount: user.investedAmount + user.totalBalance,
        status: user.status,
        date: user.createdAt,
        avatar: `https://i.pravatar.cc/40?img=${idx + 1}`,
    }));

    // Use reusable search + pagination logic
    const { paginatedRows, totalRows, totalPages } = useSearchPagination(tableData, search, currentPage);

    // Add this after fetching totals from API
    const referralLevelCounts = totals.referralLevelCounts || {};

    if (loading) return <div className="text-center py-5">Loading...</div>;

    return (
        <div className="min-vh-100 bg-light" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            {/* Filter Modal */}
            {showFilterModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Filter Users</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowFilterModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* Filter by Referral Level */}
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3">Filter users by referral level</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            className={`btn ${filters.referralLevel === null ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setFilters({ ...filters, referralLevel: null })}
                                        >
                                            All
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn ${filters.referralLevel === 0 ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setFilters({ ...filters, referralLevel: 0 })}
                                        >
                                            Direct
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn ${filters.referralLevel === 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setFilters({ ...filters, referralLevel: 1 })}
                                        >
                                            Level 1
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn ${filters.referralLevel === 2 ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setFilters({ ...filters, referralLevel: 2 })}
                                        >
                                            Level 2
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn ${filters.referralLevel === 3 ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => setFilters({ ...filters, referralLevel: 3 })}
                                        >
                                            Level 3
                                        </button>
                                    </div>
                                </div>

                                {/* Filter by Total Balance */}
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3">Filter users by total balance</h6>
                                    <div className="row">
                                        <div className="col-6">
                                            <label className="form-label">Min Range</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Min balance"
                                                value={filters.minBalance}
                                                onChange={(e) => setFilters({ ...filters, minBalance: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Max Range</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Max balance"
                                                value={filters.maxBalance}
                                                onChange={(e) => setFilters({ ...filters, maxBalance: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Filter by Invest Balance */}
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3">Filter users by Invest balance</h6>
                                    <div className="row">
                                        <div className="col-6">
                                            <label className="form-label">Min Range</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Min invest"
                                                value={filters.minInvest}
                                                onChange={(e) => setFilters({ ...filters, minInvest: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Max Range</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Max invest"
                                                value={filters.maxInvest}
                                                onChange={(e) => setFilters({ ...filters, maxInvest: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Filter by Date */}
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3">Filter by date</h6>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={filters.selectedDate}
                                        onChange={(e) => setFilters({ ...filters, selectedDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={clearFilters}
                                >
                                    Clear All
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowFilterModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={applyFilters}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Mobile search bar */}
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
                                    <a className="nav-link text-dark" href="/admin-dashboard">
                                        <i className="bi bi-people me-2"></i> Dashboard
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a className="nav-link active bg-primary text-white rounded" href="/admin-users">
                                        <i className="bi bi-house me-2"></i> Users
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
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h2 className="h4 fw-bold text-dark">Users Overview</h2>
                        </div>

                        {/* Statistic Cards */}
                        <div className="mb-4">
                            <div className="d-flex flex-nowrap overflow-auto pb-2 stats-scroll-container" style={{ scrollbarWidth: 'thin' }}>
                                <div className="card flex-shrink-0 me-3 border-0 shadow-sm" style={{ width: "200px", background: "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)", borderRadius: "12px" }}>
                                    <div className="card-body text-white">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-white bg-opacity-25 p-3 rounded-circle me-3">
                                                <i className="bi bi-currency-dollar fs-3"></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold fs-4">${totals.totalBalance ?? 0}</div>
                                                <div className="opacity-75">Balance</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card flex-shrink-0 me-3 border-0 shadow-sm" style={{ width: "200px", background: "linear-gradient(135deg, #f46b45 0%, #eea849 100%)", borderRadius: "12px" }}>
                                    <div className="card-body text-white">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-white bg-opacity-25 p-3 rounded-circle me-3">
                                                <i className="bi bi-graph-up fs-3"></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold fs-4">${totals.totalDeposit ?? 0}</div>
                                                <div className="opacity-75">Deposit</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card flex-shrink-0 me-3 border-0 shadow-sm" style={{ width: "200px", background: "linear-gradient(135deg,rgb(95, 237, 149) 0%,rgb(15, 106, 26) 100%)", borderRadius: "12px" }}>
                                    <div className="card-body text-white">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-white bg-opacity-25 p-3 rounded-circle me-3">
                                                <i className="bi bi-bar-chart fs-3"></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold fs-4">${totals.totalWithdraw ?? 0}</div>
                                                <div className="opacity-75">Withdraw</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card flex-shrink-0 me-3 border-0 shadow-sm" style={{ width: "200px", background: "linear-gradient(135deg, #C471F5 0%, #FA71CD 100%)", borderRadius: "12px" }}>
                                    <div className="card-body text-white">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-white bg-opacity-25 p-3 rounded-circle me-3">
                                                <i className="bi bi-bar-chart fs-3"></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold fs-4">${totals.totalInvest ?? 0}</div>
                                                <div className="opacity-75">Invest</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card flex-shrink-0 me-3 border-0 shadow-sm" style={{ width: "200px", background: "linear-gradient(135deg, #36D1DC 0%, #5B86E5 100%)", borderRadius: "12px" }}>
                                    <div className="card-body text-white">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-white bg-opacity-25 p-3 rounded-circle me-3">
                                                <i className="bi bi-arrow-repeat fs-3"></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold fs-4">{totals.totalRefEarn ?? 0}</div>
                                                <div className="opacity-75">Referral Earn</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Referral Level Boxes */}
                        <div className="mb-4">
                            <h5 className="mb-3 fw-bold text-dark">Referral Level Distribution</h5>
                            <div
                                className="d-flex flex-nowrap overflow-auto pb-2"
                                style={{ gap: "1rem", scrollbarWidth: "thin" }}
                            >
                                {Object.entries(referralLevelCounts).map(([level, count]) => (
                                    <div key={level} className="card border-0 shadow-sm" style={{
                                        minWidth: "150px",
                                        background: level === "0" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" :
                                            level === "1" ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" :
                                                level === "2" ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" :
                                                    level === "3" ? "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" :
                                                        "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                                        borderRadius: "12px"
                                    }}>
                                        <div className="card-body text-white text-center p-3">
                                            <div className="fw-bold fs-3 mb-1">{count}</div>
                                            <div className="opacity-75 fs-6">
                                                {level === "0" ? "Direct Users" : `Level ${level}`}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Custom scrollbar for better UI */}
                            <style>{`
        .d-flex.flex-nowrap::-webkit-scrollbar {
            height: 6px;
        }
        .d-flex.flex-nowrap::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        .d-flex.flex-nowrap::-webkit-scrollbar-thumb {
            background: #c5c5c5;
            border-radius: 10px;
        }
        .d-flex.flex-nowrap::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    `}</style>
                        </div>

                        {/* Table Section */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0 py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0 fw-bold text-dark">Users Management</h5>
                                        <p className="text-muted mb-0">Manage all users from this panel</p>
                                    </div>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => setShowFilterModal(true)}
                                    >
                                        <i className="bi bi-filter me-1"></i> Filter
                                    </button>
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
                                                <th scope="col">Ref Level</th>
                                                <th scope="col">Balance</th>
                                                <th scope="col">Deposit</th>
                                                <th scope="col">Invest</th>
                                                <th scope="col">Ref Earn</th>
                                                <th scope="col">Earning</th>
                                                <th scope="col">Total Amount</th>
                                                <th scope="col">Action</th>
                                                <th scope="col">Status</th>
                                                <th scope="col" className="pe-4">Date</th>
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
                                                    <td>{row.referralLevel}</td>
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
                                <i className="bi bi-people me-2"></i> Dashboard
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a
                                className="nav-link active"
                                href="/admin-users"
                                style={{ backgroundColor: "lightblue" }}
                            >
                                <i className="bi bi-house me-2"></i> Users
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

export default AdminUsers;