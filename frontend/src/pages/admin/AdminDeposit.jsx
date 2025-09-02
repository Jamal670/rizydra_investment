import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api"; // Adjust path if needed

const rowsPerPage = 10;

// Reusable search + pagination hook
const useSearchPagination = (data, search, currentPage) => {
    const filtered = data.filter(row =>
        row.userData?.name?.toLowerCase().includes(search.toLowerCase()) ||
        row.userData?.email?.toLowerCase().includes(search.toLowerCase())
    );
    const totalRows = filtered.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const paginatedRows = filtered.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    return { filtered, paginatedRows, totalRows, totalPages };
};

const AdminDeposit = () => {
    const navigate = useNavigate();
    const [deposits, setDeposits] = useState([]);
    const [statusBreakdown, setStatusBreakdown] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // Filter modal state
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [tempStatus, setTempStatus] = useState("All");
    const [tempDate, setTempDate] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterDate, setFilterDate] = useState("");

    // Add this state for feedback message
    const [actionMessage, setActionMessage] = useState("");
    const [processingAction, setProcessingAction] = useState(""); // "confirmed" | "declined" | ""

    // New states for decline comment and image preview
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [declineComment, setDeclineComment] = useState("");
    const [fullScreenImage, setFullScreenImage] = useState(null);

    // inside your Deposits table page
    const [depositModalOpen, setDepositModalOpen] = React.useState(false);
    const [depositInit, setDepositInit] = React.useState(null); // { reDepId?, amount?, exchangeType?, userExchange? }
    const [viewRow, setViewRow] = React.useState(null); // the row being viewed

    // Fetch deposits from API
    useEffect(() => {
        api.get("/admin/adminGetAllUsersDeposit")
            .then(res => {
                setDeposits(res.data.deposits || []);
                setStatusBreakdown(res.data.statusBreakdown || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Reset to page 1 if search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // Use reusable search + pagination logic
    // Add filter logic before pagination
    const filteredDeposits = deposits.filter(row => {
        // Status filter
        const statusMatch =
            filterStatus === "All" ||
            row.status === filterStatus ||
            (filterStatus === "Confirmed" && row.status === "Comfirmed"); // typo handling

        // Date filter (convert formattedDate to yyyy-mm-dd for comparison)
        let dateMatch = true;
        if (filterDate) {
            // Try to parse formattedDate to yyyy-mm-dd
            const [day, monthStr, year] = (row.formattedDate || "").split(/[\s,]+/);
            const months = {
                Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
                Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
            };
            const month = months[monthStr];
            const formatted = year && month && day ? `${year}-${month}-${day.padStart(2, "0")}` : "";
            dateMatch = filterDate === formatted;
        }

        // Search filter
        const searchMatch =
            row.userData?.name?.toLowerCase().includes(search.toLowerCase()) ||
            row.userData?.email?.toLowerCase().includes(search.toLowerCase());

        return statusMatch && dateMatch && searchMatch;
    });

    const { paginatedRows, totalRows, totalPages } = useSearchPagination(filteredDeposits, "", currentPage);

    // Modal open handler
    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };

    // Modal close handler
    const handleClose = () => {
        setShowModal(false);
        setSelectedRow(null);
    };
    const handleLogout = () => {
        localStorage.removeItem("authenticated");
        localStorage.removeItem("isAdmin");
        window.location.href = "/login"; // redirect to login
      };

    // Handle Save in filter modal
    const handleFilterSave = () => {
        setFilterStatus(tempStatus);
        setFilterDate(tempDate);
        setShowFilterModal(false);
        setCurrentPage(1);
    };

    // Handle opening filter modal (reset to default/null every time)
    const handleOpenFilter = () => {
        setTempStatus("All"); // or "" if you want truly null, but "All" is user-friendly
        setTempDate("");
        setShowFilterModal(true);
    };

    // Handle Confirmed
    const handleConfirmed = async () => {
        if (!selectedRow?._id) return;
        setProcessingAction("confirmed");
        try {
            const res = await api.post("/admin/adminHandleDepositConfirmed", { _id: selectedRow._id });
            setActionMessage(res.data.message || "Deposit confirmed successfully");
            setShowModal(false);
            setProcessingAction("");
            // Optionally refresh deposits
            const updated = await api.get("/admin/adminGetAllUsersDeposit");
            setDeposits(updated.data.deposits || []);
            setStatusBreakdown(updated.data.statusBreakdown || []);
        } catch (err) {
            setActionMessage("Failed to confirm deposit");
            setProcessingAction("");
        }
    };

    // Handle Declined (open comment modal)
    const handleDeclined = () => {
        setDeclineComment("");
        setShowDeclineModal(true);
    };

    // Submit Declined with comment
    const handleDeclineSubmit = async () => {
        if (!selectedRow?._id) return;
        setProcessingAction("declined");
        try {
            await api.post("/admin/adminHandleDepositDeclined", {
                _id: selectedRow._id,
                comment: declineComment
            });
            setActionMessage("Deposit declined successfully");
            setShowDeclineModal(false);
            setShowModal(false);
            setProcessingAction("");
            // Refresh deposits
            const updated = await api.get("/admin/adminGetAllUsersDeposit");
            setDeposits(updated.data.deposits || []);
            setStatusBreakdown(updated.data.statusBreakdown || []);
        } catch (err) {
            setActionMessage("Failed to decline deposit");
            setProcessingAction("");
            setShowDeclineModal(false);
            setShowModal(false);
        }
    };

    // Image click handler for full-screen view
    const handleImageClick = (img) => {
        setFullScreenImage(img);
    };

    // Handle View button click for user profile
    const handleViewUser = (userId) => {
        navigate(`/admin-specific-user/${userId}`);
    };

    function onClickView(row) {
      setViewRow(row);
    }

    function onClickRedeposit(row) {
      setDepositInit({
        reDepId: row._id,           // critical for redeposit
        // optionally prefill:
        amount: row.amount,
        exchangeType: row.exchangeType,
        userExchange: row.userExchange,
      });
      setDepositModalOpen(true);
    }

    if (loading) return <div className="text-center py-5">Loading...</div>;

    // Stats cards from statusBreakdown
    const statusOrder = ["Confirmed", "Pending", "Declined"];
    const stats = statusOrder
        .map(status => statusBreakdown.find(stat => stat._id === status))
        .filter(Boolean)
        .map(stat => ({
            label: stat._id,
            value: stat.count,
            totalAmount: stat.totalAmount,
            icon:
                stat._id === "Confirmed"
                    ? "bi-check-circle"
                    : stat._id === "Pending"
                        ? "bi-hourglass-split"
                        : "bi-x-circle",
            color:
                stat._id === "Confirmed"
                    ? "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)"
                    : stat._id === "Pending"
                        ? "linear-gradient(135deg, #e5664cff 0%, #d44d8aff 100%)"
                        : "linear-gradient(135deg, #ff0000ff 0%, #ff0000ff 100%)"
        }));

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
                                    <a className="nav-link text-dark" href="/admin-dashboard">
                                        <i className="bi bi-bar-chart me-2"></i> Dashboard
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a className="nav-link text-dark" href="/admin-users">
                                        <i className="bi bi-people me-2"></i> Users
                                    </a>
                                </li>
                                <li className="nav-item mb-2">
                                    <a className="nav-link active bg-primary text-white rounded" href="/admin-deposit">
                                        <i className="bi bi-house me-2"></i> Deposit
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
                            <h2 className="h4 fw-bold text-dark">Deposit Overview</h2>
                        </div>

                        {/* Statistic Cards */}
                        <div className="mb-4">
                            <div className="d-flex flex-nowrap overflow-auto pb-2 stats-scroll-container" style={{ scrollbarWidth: 'thin' }}>
                                {stats.map((stat, idx) => (
                                    <div
                                        key={idx}
                                        className="card flex-shrink-0 me-3 border-0 shadow-sm"
                                        style={{
                                            width: "220px",
                                            background: stat.color,
                                            borderRadius: "12px"
                                        }}
                                    >
                                        <div className="card-body text-white">
                                            <div className="d-flex align-items-center">

                                                <div>
                                                    <div className="fw-bold fs-4">{stat.label} # {stat.value}</div>
                                                    <div className="opacity-75">Total: ${stat.totalAmount ?? 0}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0 py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0 fw-bold text-dark">Deposit Management</h5>
                                        <p className="text-muted mb-0">Manage all deposits from this panel</p>
                                    </div>
                                    <button className="btn btn-outline-primary" onClick={handleOpenFilter}>
                                        <i className="bi bi-filter me-1"></i> Filter
                                    </button>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Balance</th>
                                                <th>Exchange</th>
                                                <th>TrackingID</th>
                                                <th>Amount</th>
                                                <th>Type</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedRows.map((row, idx) => (
                                                <tr key={row._id} className={idx % 2 === 0 ? "table-row-light" : "table-row-dark"}>
                                                    <td>{(currentPage - 1) * rowsPerPage + idx + 1}</td> {/* Sequential number */}
                                                    <td>{row.userData?.name}</td>
                                                    <td>{row.userData?.totalBalance}</td>
                                                    <td>{row.exchangeType}</td>
                                                    <td>{row.userExchange}</td>
                                                    <td>{row.amount}</td>
                                                    <td>{row.type}</td>
                                                    <td>
                                                        <span className={`badge ${row.status === "Confirmed" || row.status === "Comfirmed"
                                                            ? "bg-success"
                                                            : row.status === "Pending"
                                                                ? "bg-warning text-dark"
                                                                : "bg-secondary"
                                                            }`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleView(row)}
                                                        >
                                                            <i className="bi bi-eye me-1"></i> View
                                                        </button>
                                                    </td>
                                                    <td>{row.formattedDate}</td>
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
                                    <nav aria-label="Deposit pagination">
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

                        {/* Deposit Information Modal */}
                        {showModal && selectedRow && (
                            <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title w-100 text-center">Deposit Information</h5>
                                            <button type="button" className="btn-close" onClick={handleClose}></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="d-flex flex-column align-items-left">
                                                {selectedRow.image && (
                                                    <img
                                                        src={`data:image/png;base64,${selectedRow.image}`}
                                                        alt="User"
                                                        className="mb-3"
                                                        width="300"
                                                        height="200"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleImageClick(`data:image/png;base64,${selectedRow.image}`)}
                                                    />
                                                )}
                                                <div className="mb-2"><strong>Name:</strong> {selectedRow.userData?.name}</div>
                                                <div className="mb-2"><strong>Email:</strong> {selectedRow.userData?.email}</div>
                                                <div className="mb-2"><strong>Balance:</strong> {selectedRow.userData?.totalBalance}</div>
                                                <div className="mb-2"><strong>Invest Amount:</strong> {selectedRow.userData?.investedAmount}</div>
                                                <div className="mb-2"><strong>Exchange:</strong> {selectedRow.exchangeType}</div>
                                                <div className="mb-2"><strong>Amount:</strong> {selectedRow.amount}</div>
                                                <div className="mb-2"><strong>TrackingID:</strong> {selectedRow.userExchange}</div>
                                                <div className="mb-2"><strong>Type:</strong> {selectedRow.type}</div>
                                                <div className="mb-2"><strong>Status:</strong> {selectedRow.status}</div>
                                                <div className="mb-2"><strong>Date:</strong> {selectedRow.formattedDate}</div>
                                            </div>
                                        </div>
                                        <div className="modal-footer justify-content-center">
                                            <button
                                                className="btn btn-success me-2"
                                                onClick={handleConfirmed}
                                                disabled={
                                                    processingAction === "Confirmed" ||
                                                    processingAction === "Declined" ||
                                                    selectedRow.status === "Confirmed" ||
                                                    selectedRow.status === "Declined"
                                                }
                                            >
                                                {processingAction === "Confirmed" ? "Processing..." : "Confirmed"}
                                            </button>
                                            <button
                                                className="btn btn-danger me-2"
                                                onClick={handleDeclined}
                                                disabled={
                                                    processingAction === "Confirmed" ||
                                                    processingAction === "Declined" ||
                                                    selectedRow.status === "Confirmed" ||
                                                    selectedRow.status === "Declined"
                                                }
                                            >
                                                {processingAction === "Declined" ? "Processing..." : "Declined"}
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => handleViewUser(selectedRow.userData?._id)}
                                            >
                                                View User Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Decline Comment Modal */}
                        {showDeclineModal && (
                            <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
                                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title w-100 text-center">Leave a comment</h5>
                                            <button type="button" className="btn-close" onClick={() => setShowDeclineModal(false)}></button>
                                        </div>
                                        <div className="modal-body">
                                            <textarea
                                                className="form-control"
                                                rows={4}
                                                placeholder="Write a comment..."
                                                value={declineComment}
                                                onChange={e => setDeclineComment(e.target.value)}
                                            />
                                        </div>
                                        <div className="modal-footer justify-content-center">
                                            <button
                                                className="btn btn-primary"
                                                onClick={handleDeclineSubmit}
                                                disabled={processingAction === "declined" || !declineComment.trim()}
                                            >
                                                {processingAction === "declined" ? "Processing..." : "Submit"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Full-Screen Image Overlay */}
                        {fullScreenImage && (
                            <div
                                style={{
                                    position: "fixed",
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    background: "rgba(0,0,0,0.85)",
                                    zIndex: 2000,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                onClick={() => setFullScreenImage(null)}
                            >
                                <img
                                    src={fullScreenImage}
                                    alt="Full"
                                    style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: "8px", boxShadow: "0 0 20px #000" }}
                                    onClick={e => e.stopPropagation()}
                                />
                                <button
                                    style={{
                                        position: "fixed",
                                        top: 30,
                                        right: 40,
                                        fontSize: "2rem",
                                        background: "transparent",
                                        border: "none",
                                        color: "#fff",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => setFullScreenImage(null)}
                                    aria-label="Close"
                                >&times;</button>
                            </div>
                        )}

                        {/* Filter Modal */}
                        {showFilterModal && (
                            <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
                                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title w-100 text-center">Filter</h5>
                                            <button type="button" className="btn-close" onClick={() => setShowFilterModal(false)}></button>
                                        </div>
                                        <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                                            <p className="fw-bold mb-2">Filter users with status</p>
                                            <div className="mb-3 d-flex flex-wrap gap-2">
                                                {["All", "Confirmed", "Pending", "Declined"].map(status => (
                                                    <button
                                                        key={status}
                                                        type="button"
                                                        className={`btn btn-sm ${tempStatus === status ? "btn-primary" : "btn-outline-primary"}`}
                                                        onClick={() => setTempStatus(status)}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="fw-bold mb-2">Filter by date</p>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={tempDate}
                                                onChange={e => setTempDate(e.target.value)}
                                            />
                                            <small className="text-muted">Pick a date to filter (matches deposit date)</small>
                                        </div>
                                        <div className="modal-footer justify-content-center">
                                            <button className="btn btn-primary" onClick={handleFilterSave}>Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Show feedback message if present */}
                        {actionMessage && (
                            <div className="alert alert-info text-center my-2">{actionMessage}</div>
                        )}
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
                            <a className="nav-link text-dark" href="/admin-users">
                                <i className="bi bi-people me-2"></i> Users
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a
                                className="nav-link active"
                                href="/admin-deposit"
                                style={{ backgroundColor: "lightblue" }}
                            >
                                <i className="bi bi-house me-2"></i> Deposit
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

export default AdminDeposit;