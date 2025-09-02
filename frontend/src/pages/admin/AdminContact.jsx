import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api";

const AdminContact = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/admin/admincontactus", { withCredentials: true });
                setContacts(res.data || []);
            } catch (e) {
                setContacts([]);
            }
            setLoading(false);
        })();
    }, []);

    const handleView = (row) => { 
        setSelectedRow(row); 
        setShowModal(true); 
    };
    
    const handleClose = () => { 
        setShowModal(false); 
        setSelectedRow(null); 
    };
    
    const handleLogout = () => {
        localStorage.removeItem("authenticated");
        localStorage.removeItem("isAdmin");
        window.location.href = "/login";
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
                                    <a className="nav-link active bg-primary text-white rounded" href="/admin-contact">
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
                            <h2 className="h4 fw-bold text-dark">Contact Messages</h2>
                        </div>

                        {/* Contact Messages Table */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white border-0 py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0 fw-bold text-dark">Contact Messages</h5>
                                        <p className="text-muted mb-0">Manage all contact messages from users</p>
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
                                                <th scope="col">Phone</th>
                                                <th scope="col">Date</th>
                                                <th scope="col" className="pe-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contacts.map((row, idx) => (
                                                <tr key={row._id} className={idx % 2 === 0 ? "table-row-light" : "table-row-dark"}>
                                                    <td className="ps-4">{idx + 1}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                                                                 style={{width: '36px', height: '36px', fontSize: '14px'}}>
                                                                {row.name ? row.name.charAt(0).toUpperCase() : 'U'}
                                                            </div>
                                                            {row.name}
                                                        </div>
                                                    </td>
                                                    <td>{row.email}</td>
                                                    <td>{row.phone || '-'}</td>
                                                    <td>{new Date(row.createdAt || Date.now()).toLocaleDateString()}</td>
                                                    <td className="pe-4">
                                                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleView(row)}>
                                                            <i className="bi bi-eye me-1"></i> View
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
                                        Showing {contacts.length} of {contacts.length} results
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* View Message Modal */}
                        {showModal && selectedRow && (
                            <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Contact Message Details</h5>
                                            <button type="button" className="btn-close" onClick={handleClose}></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Name</label>
                                                <p>{selectedRow.name}</p>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Email</label>
                                                <p>{selectedRow.email}</p>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Phone</label>
                                                <p>{selectedRow.phone || 'Not provided'}</p>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Message</label>
                                                <div className="border p-3 rounded bg-light">
                                                    {selectedRow.message}
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">Date</label>
                                                <p>{new Date(selectedRow.createdAt || Date.now()).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button className="btn btn-secondary" onClick={handleClose}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                            <a className="nav-link active bg-primary text-white rounded" href="/admin-contact">
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

export default AdminContact;