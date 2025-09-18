import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import api from "../../Api";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

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

const AdminSpecificUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("earning");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    // Modal states
    const [showInvestmentModal, setShowInvestmentModal] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [showFilterModal, setShowFilterModal] = useState(false);

    // Fetch specific user data
    useEffect(() => {
        if (id) {
            api.get(`/admin/AdminGetSpecificUser/${id}`)
                .then(res => {
                    setUserData(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching user data:", err);
                    setLoading(false);
                });
        }
    }, [id]);

    // Reset to page 1 if search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    if (loading) {
        return (
            <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading user data...</p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <h4 className="text-danger">User not found</h4>
                    <button className="btn btn-primary mt-3" onClick={() => navigate("/admin-users")}>
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    const { user, investments, dailyEarns, referralEarnings } = userData;

    // Calculate total referral users
    const totalReferralUsers = Object.values(user.referralLevelCounts).reduce((sum, count) => sum + count, 0);

    // Chart data preparation
    const prepareChartData = () => {
        // 1. User Overview (Doughnut Chart)
        const userOverviewData = {
            labels: ['Total Balance', 'Deposit Amount', 'Invested Amount'],
            datasets: [{
                data: [user.totalBalance, user.depositAmount, user.investedAmount],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 99, 132, 0.8)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 2
            }]
        };

        // 2. Investments Analysis by Status (Bar Chart)
        const statusGroups = investments.reduce((acc, inv) => {
            acc[inv.status] = (acc[inv.status] || 0) + inv.amount;
            return acc;
        }, {});
        
        const investmentStatusData = {
            labels: Object.keys(statusGroups),
            datasets: [{
                label: 'Amount by Status',
                data: Object.values(statusGroups),
                backgroundColor: [
                    'rgba(255, 206, 86, 0.8)',  // Pending
                    'rgba(75, 192, 192, 0.8)',  // Confirmed
                    'rgba(255, 99, 132, 0.8)'   // Declined
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        };

        // 3. Investments Analysis by Type (Bar Chart)
        const typeGroups = investments.reduce((acc, inv) => {
            acc[inv.type] = (acc[inv.type] || 0) + inv.amount;
            return acc;
        }, {});
        
        const investmentTypeData = {
            labels: Object.keys(typeGroups),
            datasets: [{
                label: 'Amount by Type',
                data: Object.values(typeGroups),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',  // Deposit
                    'rgba(255, 159, 64, 0.8)'   // Withdraw
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        };

        // 4. Daily Earnings (Line Chart)
        const sortedEarnings = [...dailyEarns].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        const dailyEarningsData = {
            labels: sortedEarnings.map(earn => earn.createdAt),
            datasets: [
                {
                    label: 'Daily Profit',
                    data: sortedEarnings.map(earn => earn.dailyProfit),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Referral Earnings',
                    data: sortedEarnings.map(earn => earn.refEarn),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        };

        // 5. Referral Earnings by Level (Stacked Bar Chart)
        const levelGroups = referralEarnings.reduce((acc, ref) => {
            acc[`Level ${ref.refLevel}`] = (acc[`Level ${ref.refLevel}`] || 0) + ref.earningRef;
            return acc;
        }, {});
        
        const referralEarningsData = {
            labels: Object.keys(levelGroups),
            datasets: [{
                label: 'Referral Earnings by Level',
                data: Object.values(levelGroups),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)'
                ],
                borderWidth: 1
            }]
        };

        // 6. Referral Level Counts (Bar Chart)
        const referralCountsData = {
            labels: ['Level 1', 'Level 2', 'Level 3'],
            datasets: [{
                label: 'User Count',
                data: [user.referralLevelCounts.level1, user.referralLevelCounts.level2, user.referralLevelCounts.level3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 205, 86, 1)'
                ],
                borderWidth: 1
            }]
        };

        return {
            userOverviewData,
            investmentStatusData,
            investmentTypeData,
            dailyEarningsData,
            referralEarningsData,
            referralCountsData
        };
    };

    const chartData = prepareChartData();

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        size: 11
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1
            }
        }
    };

    const lineChartOptions = {
        ...chartOptions,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    };

    const barChartOptions = {
        ...chartOptions,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    };

    // Delete user handler
    const handleDeleteUser = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        try {
            await api.post('/admin/adminDeleteUser', { _id: user._id });
            alert('User deleted successfully');
            navigate('/admin-dashboard');
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    // Handle investment modal
    const openInvestmentModal = (investment) => {
        setSelectedInvestment(investment);
        setShowInvestmentModal(true);
    };

    // Handle image preview
    const openImagePreview = (image) => {
        if (image) {
            setSelectedImage(image);
            setShowImageModal(true);
        }
    };

    // Get data based on active tab and apply search/pagination
    const getTableData = () => {
        let data = [];
        switch (activeTab) {
            case "earning":
                data = dailyEarns.map((earn, idx) => ({
                    id: idx + 1,
                    name: user.name,
                    email: user.email,
                    baseAmount: earn.baseAmount,
                    dailyProfit: earn.dailyProfit,
                    refEarn: earn.refEarn,
                    createdAt: earn.createdAt
                }));
                break;
            case "investment":
                data = investments.map((investment, idx) => ({
                    id: idx + 1,
                    name: user.name,
                    email: user.email,
                    exchangeType: investment.exchangeType,
                    amount: investment.amount,
                    userExchange: investment.userExchange,
                    image: investment.image,
                    status: investment.status,
                    type: investment.type,
                    createdAt: investment.createdAt,
                    comment: investment.comment
                }));
                break;
            case "refEarn":
                data = referralEarnings.map((refEarn, idx) => ({
                    id: idx + 1,
                    name: refEarn.name,
                    email: `${refEarn.name}@example.com`,
                    refLevel: refEarn.refLevel,
                    earningRef: refEarn.earningRef,
                    amount: refEarn.amount,
                    createdAt: refEarn.createdAt
                }));
                break;
            default:
                data = [];
        }
        return data;
    };

    const tableData = getTableData();
    const { paginatedRows, totalRows, totalPages } = useSearchPagination(tableData, search, currentPage);

    return (
        <div className="min-vh-100 bg-light" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            {/* Filter Modal */}
            {showFilterModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Filter User Data</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowFilterModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* Data Type Selection */}
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3">Select Data Type to View</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            className={`btn btn-sm ${activeTab === "earning" ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => {
                                                setActiveTab("earning");
                                                setShowFilterModal(false);
                                            }}
                                        >
                                            <i className="bi bi-graph-up me-1"></i> Daily Earn
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn btn-sm ${activeTab === "investment" ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => {
                                                setActiveTab("investment");
                                                setShowFilterModal(false);
                                            }}
                                        >
                                            <i className="bi bi-bag me-1"></i> Investment
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn btn-sm ${activeTab === "refEarn" ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => {
                                                setActiveTab("refEarn");
                                                setShowFilterModal(false);
                                            }}
                                        >
                                            <i className="bi bi-people me-1"></i> Ref Earn
                                        </button>
                                    </div>
                                </div>

                                {/* Current Selection Info */}
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3">Current Selection</h6>
                                    <div className="alert alert-info">
                                        <strong>Active Tab:</strong> {
                                            activeTab === "earning" ? "Daily Earnings" :
                                                activeTab === "investment" ? "Investments" :
                                                    "Referral Earnings"
                                        }
                                        <br />
                                        <strong>Records Found:</strong> {totalRows}
                                        <br />
                                        <strong>Search Term:</strong> {search || "None"}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowFilterModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setShowFilterModal(false)}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Investment Modal */}
            {showInvestmentModal && selectedInvestment && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Investment Information</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowInvestmentModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <p><strong>ID:</strong> {selectedInvestment._id}</p>
                                        <p><strong>Exchange Type:</strong> {selectedInvestment.exchangeType}</p>
                                        <p><strong>Amount:</strong> ${selectedInvestment.amount}</p>
                                        <p><strong>User Exchange:</strong> {selectedInvestment.userExchange}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>Status:</strong>
                                            <span className={`badge ms-2 ${selectedInvestment.status === "Confirmed" ? "bg-success" :
                                                selectedInvestment.status === "Pending" ? "bg-warning" :
                                                    "bg-secondary"
                                                }`}>
                                                {selectedInvestment.status}
                                            </span>
                                        </p>
                                        <p><strong>Type:</strong> {selectedInvestment.type}</p>
                                        <p><strong>Created:</strong> {selectedInvestment.createdAt}</p>
                                        {selectedInvestment.comment && (
                                            <p><strong>Comment:</strong> {selectedInvestment.comment}</p>
                                        )}
                                    </div>
                                </div>
                                {selectedInvestment.image && (
                                    <div className="mt-3">
                                        <p><strong>Image:</strong></p>
                                        <img
                                            src={selectedInvestment.image}
                                            alt="Investment proof"
                                            className="img-fluid rounded cursor-pointer"
                                            style={{ maxHeight: "200px", cursor: "pointer" }}
                                            onClick={() => openImagePreview(selectedInvestment.image)}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowInvestmentModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {showImageModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }} tabIndex="-1">
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content bg-transparent border-0">
                            <div className="modal-header border-0">
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowImageModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body text-center">
                                <img
                                    src={selectedImage}
                                    alt="Full preview"
                                    className="img-fluid"
                                    style={{ maxHeight: "80vh" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Navbar */}
            <nav className="navbar navbar-expand navbar-light bg-white border-bottom px-3 py-2 sticky-top shadow-sm" style={{ zIndex: 1020 }}>
                <div className="container-fluid">
                    <div className="d-flex align-items-center">
                        <button
                            className="btn btn-outline-secondary me-3"
                            onClick={() => navigate("/admin-users")}
                        >
                            <i className="bi bi-arrow-left me-2"></i> Back
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

            <div className="container-fluid py-4">
                {/* User Information Section */}
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                        <div className="row align-items-center">
                            <div className="col-md-2 text-center">
                                <div className="position-relative d-inline-block">
                                    <img
                                        src={user.image || "https://i.pravatar.cc/120"}
                                        alt={user.name}
                                        className="rounded-circle shadow-sm"
                                        width="120"
                                        height="120"
                                        style={{ objectFit: "cover" }}
                                    />
                                    {user.image && (
                                        <button
                                            className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
                                            onClick={() => openImagePreview(user.image)}
                                            style={{ width: "32px", height: "32px" }}
                                        >
                                            <i className="bi bi-eye"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-10">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h3 className="fw-bold text-dark mb-2">{user.name}</h3>
                                        <p className="text-muted mb-1">
                                            <i className="bi bi-envelope me-2"></i>{user.email}
                                        </p>
                                        <p className="text-muted mb-1">
                                            <i className="bi bi-tag me-2"></i>Referral Code: <span className="fw-bold text-primary">{user.referralCode}</span>
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <p className="text-muted mb-1">
                                            <i className="bi bi-person-plus me-2"></i>Referred By:
                                            <span className="fw-bold ms-2">
                                                {user.referredBy || "Direct User"}
                                            </span>
                                        </p>
                                        <p className="text-muted mb-1">
                                            <i className="bi bi-diagram-3 me-2"></i>Referral Level:
                                            <span className="fw-bold ms-2">
                                                {user.referralLevel === 0 ? "Direct" : `Level ${user.referralLevel}`}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Stats Boxes */}
                <div className="mb-4">
                    <h5 className="mb-3 fw-bold text-dark">User Statistics</h5>
                    <div className="d-flex flex-nowrap overflow-auto pb-2" style={{ gap: "1rem", scrollbarWidth: "thin" }}>
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{
                            width: "200px",
                            background: "linear-gradient(135deg, #FF512F 0%, #DD2476 100%)"
                        }}>
                            <div className="card-body text-white text-center p-3">
                                <div className="fw-bold fs-4 mb-1">${user.totalBalance}</div>
                                <div className="opacity-75">Total Balance</div>
                            </div>
                        </div>
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{
                            width: "200px",
                            background: "linear-gradient(135deg, #f46b45 0%, #eea849 100%)"
                        }}>
                            <div className="card-body text-white text-center p-3">
                                <div className="fw-bold fs-4 mb-1">${user.totalEarn}</div>
                                <div className="opacity-75">Total Earn</div>
                            </div>
                        </div>
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{
                            width: "200px",
                            background: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)"
                        }}>
                            <div className="card-body text-white text-center p-3">
                                <div className="fw-bold fs-4 mb-1">${user.refEarn}</div>
                                <div className="opacity-75">Referral Earn</div>
                            </div>
                        </div>
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{
                            width: "200px",
                            background: "linear-gradient(135deg, #C471F5 0%, #FA71CD 100%)"
                        }}>
                            <div className="card-body text-white text-center p-3">
                                <div className="fw-bold fs-4 mb-1">${user.depositAmount}</div>
                                <div className="opacity-75">Deposit Amount</div>
                            </div>
                        </div>
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{
                            width: "200px",
                            background: "linear-gradient(135deg, #36D1DC 0%, #5B86E5 100%)"
                        }}>
                            <div className="card-body text-white text-center p-3">
                                <div className="fw-bold fs-4 mb-1">${user.investedAmount}</div>
                                <div className="opacity-75">Invested Amount</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Referral Level Counts */}
                <div className="mb-4">
                    <h5 className="mb-3 fw-bold text-dark">Referral Level Distribution</h5>
                    <div className="d-flex flex-nowrap overflow-auto pb-2" style={{ gap: "1rem", scrollbarWidth: "thin" }}>
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{
                            width: "200px",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        }}>
                            <div className="card-body text-white text-center p-3">
                                <div className="fw-bold fs-3 mb-1">{totalReferralUsers}</div>
                                <div className="opacity-75">Total Referral Users</div>
                            </div>
                        </div>
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{
                            width: "200px",
                            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                        }}>
                            <div className="card-body text-white text-center p-3">
                                <div className="fw-bold fs-3 mb-1">{user.referralLevelCounts.level1}</div>
                                <div className="opacity-75">Level 1</div>
                            </div>
                        </div>
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{
                            width: "200px",
                            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                        }}>
                            <div className="card-body text-white text-center p-3">
                                <div className="fw-bold fs-3 mb-1">{user.referralLevelCounts.level2}</div>
                                <div className="opacity-75">Level 2</div>
                            </div>
                        </div>
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{
                            width: "200px",
                            background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                        }}>
                            <div className="card-body text-white text-center p-3">
                                <div className="fw-bold fs-3 mb-1">{user.referralLevelCounts.level3}</div>
                                <div className="opacity-75">Level 3</div>
                            </div>
                        </div>
                    </div>

                    {/* Custom scrollbar styling */}
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

                {/* Dashboard Charts Section */}
                <div className="mb-4">
                    <h5 className="mb-3 fw-bold text-dark">Analytics Dashboard</h5>
                    <div className="d-flex flex-nowrap overflow-auto pb-2" style={{ gap: "1rem", scrollbarWidth: "thin" }}>
                        {/* User Overview Chart */}
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{ width: "400px", height: "350px" }}>
                            <div className="card-header bg-white border-0 py-2">
                                <h6 className="mb-0 fw-bold text-dark">User Overview</h6>
                                <small className="text-muted">Fund Distribution</small>
                            </div>
                            <div className="card-body d-flex align-items-center justify-content-center" style={{ height: "280px" }}>
                                <Doughnut data={chartData.userOverviewData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Investment Status Chart */}
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{ width: "400px", height: "350px" }}>
                            <div className="card-header bg-white border-0 py-2">
                                <h6 className="mb-0 fw-bold text-dark">Investment Status</h6>
                                <small className="text-muted">Amount by Status</small>
                            </div>
                            <div className="card-body d-flex align-items-center justify-content-center" style={{ height: "280px" }}>
                                <Bar data={chartData.investmentStatusData} options={barChartOptions} />
                            </div>
                        </div>

                        {/* Investment Type Chart */}
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{ width: "400px", height: "350px" }}>
                            <div className="card-header bg-white border-0 py-2">
                                <h6 className="mb-0 fw-bold text-dark">Investment Type</h6>
                                <small className="text-muted">Deposit vs Withdraw</small>
                            </div>
                            <div className="card-body d-flex align-items-center justify-content-center" style={{ height: "280px" }}>
                                <Bar data={chartData.investmentTypeData} options={barChartOptions} />
                            </div>
                        </div>

                        {/* Daily Earnings Chart */}
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{ width: "400px", height: "350px" }}>
                            <div className="card-header bg-white border-0 py-2">
                                <h6 className="mb-0 fw-bold text-dark">Daily Earnings</h6>
                                <small className="text-muted">Profit & Referral Trends</small>
                            </div>
                            <div className="card-body d-flex align-items-center justify-content-center" style={{ height: "280px" }}>
                                <Line data={chartData.dailyEarningsData} options={lineChartOptions} />
                            </div>
                        </div>

                        {/* Referral Earnings Chart */}
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{ width: "400px", height: "350px" }}>
                            <div className="card-header bg-white border-0 py-2">
                                <h6 className="mb-0 fw-bold text-dark">Referral Earnings</h6>
                                <small className="text-muted">Earnings by Level</small>
                            </div>
                            <div className="card-body d-flex align-items-center justify-content-center" style={{ height: "280px" }}>
                                <Bar data={chartData.referralEarningsData} options={barChartOptions} />
                            </div>
                        </div>

                        {/* Referral Level Counts Chart */}
                        <div className="card border-0 shadow-sm flex-shrink-0" style={{ width: "400px", height: "350px" }}>
                            <div className="card-header bg-white border-0 py-2">
                                <h6 className="mb-0 fw-bold text-dark">Referral Network</h6>
                                <small className="text-muted">User Count by Level</small>
                            </div>
                            <div className="card-body d-flex align-items-center justify-content-center" style={{ height: "280px" }}>
                                <Bar data={chartData.referralCountsData} options={barChartOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Management Section */}
                <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0 py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0 fw-bold text-dark">User Management</h5>
                                <p className="text-muted mb-0">Manage user activities and transactions</p>
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={handleDeleteUser}
                                >
                                    <i className="bi bi-trash me-1"></i> Delete
                                </button>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() => setShowFilterModal(true)}
                                >
                                    <i className="bi bi-filter me-1"></i>Filter
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        {/* Daily Earn Table */}
                        {activeTab === "earning" && (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="ps-4">ID</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Earn</th>
                                            <th scope="col">RefEarn</th>
                                            <th scope="col" className="pe-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedRows.map((earn, idx) => (
                                            <tr key={earn.id}>
                                                <td className="ps-4">{earn.id}</td>
                                                <td className="fw-bold">${earn.baseAmount}</td>
                                                <td className="text-success">${earn.dailyProfit}</td>
                                                <td className="text-primary">${earn.refEarn}</td>
                                                <td className="pe-4">{earn.createdAt}</td>
                                            </tr>
                                        ))}
                                        {paginatedRows.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4 text-muted">
                                                    {search ? "No matching records found" : "No earning records found"}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Investment Table */}
                        {activeTab === "investment" && (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="ps-4">ID</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Exchange</th>
                                            <th scope="col">TrackingID</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Action</th>
                                            <th scope="col" className="pe-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedRows.map((investment, idx) => (
                                            <tr key={investment.id}>
                                                <td className="ps-4">{investment.id}</td>
                                                <td className="fw-bold">${investment.amount}</td>
                                                <td>
                                                    <span>{investment.exchangeType}</span>
                                                </td>
                                                <td>
                                                    <small className="text-muted" style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                                                        {investment.userExchange}
                                                    </small>
                                                </td>
                                                <td>
                                                    <span >
                                                        {investment.type}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${investment.status === "Confirmed" ? "bg-success" :
                                                        investment.status === "Pending" ? "bg-warning" :
                                                            "bg-secondary"
                                                        }`}>
                                                        {investment.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => openInvestmentModal({
                                                            ...investment,
                                                            _id: investment.id,
                                                            comment: investment.comment
                                                        })}
                                                    >
                                                        <i className="bi bi-eye me-1"></i>View
                                                    </button>
                                                </td>
                                                <td className="pe-4">{investment.createdAt}</td>
                                            </tr>
                                        ))}
                                        {paginatedRows.length === 0 && (
                                            <tr>
                                                <td colSpan="8" className="text-center py-4 text-muted">
                                                    {search ? "No matching records found" : "No investment records found"}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Referral Earnings Table */}
                        {activeTab === "refEarn" && (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="ps-4">ID</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">RefLevel</th>
                                            <th scope="col">RefEarn</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col" className="pe-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedRows.map((refEarn, idx) => (
                                            <tr key={refEarn.id}>
                                                <td className="ps-4">{refEarn.id}</td>
                                                <td className="fw-bold">{refEarn.name}</td>
                                                <td>
                                                    <span className="badge bg-primary">Level {refEarn.refLevel}</span>
                                                </td>
                                                <td className="text-success">${refEarn.earningRef}</td>
                                                <td className="fw-bold">${refEarn.amount}</td>
                                                <td className="pe-4">{refEarn.createdAt}</td>
                                            </tr>
                                        ))}
                                        {paginatedRows.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-muted">
                                                    {search ? "No matching records found" : "No referral earning records found"}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pagination Footer */}
                    {totalRows > 0 && (
                        <div className="card-footer bg-white border-0 py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    Showing {paginatedRows.length} out of {totalRows} results
                                </div>
                                <nav aria-label="Table pagination">
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
                    )}
                </div>
            </div>

            <style>{`
                .cursor-pointer {
                    cursor: pointer;
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
                .btn-group .btn {
                    border-radius: 0;
                }
                .btn-group .btn:first-child {
                    border-top-left-radius: 0.375rem;
                    border-bottom-left-radius: 0.375rem;
                }
                .btn-group .btn:last-child {
                    border-top-right-radius: 0.375rem;
                    border-bottom-right-radius: 0.375rem;
                }
            `}</style>
        </div>
    );
};

export default AdminSpecificUser;