import React, { useEffect, useState, useRef } from 'react';
import api from '../../Api';

function AcSetting() {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({ name: '', email: '', image: '', referralCode: '', referralLevel: 0 });
    const fileInputRef = useRef(null);
    const [showUpload, setShowUpload] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [updateFields, setUpdateFields] = useState({});

    useEffect(() => {
        // Only load assets once per session
        if (!window.__rizydraAssetsLoaded) {
            // Dynamically load CSS files
            const cssFiles = [
                '/assets/css/bootstrap.min.css',
                '/assets/css/all.min.css',
                '/assets/css/line-awesome.min.css',
                '/assets/css/animate.css',
                '/assets/css/magnific-popup.css',
                '/assets/css/nice-select.css',
                '/assets/css/odometer.css',
                '/assets/css/slick.css',
                '/assets/css/main.css'
            ];
            cssFiles.forEach(href => {
                if (!document.querySelector(`link[href="${href}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = href;
                    document.head.appendChild(link);
                }
            });

            // Dynamically load JS files
            const jsFiles = [
                '/assets/js/jquery-3.3.1.min.js',
                '/assets/js/bootstrap.min.js',
                '/assets/js/jquery.ui.js',
                '/assets/js/slick.min.js',
                '/assets/js/wow.min.js',
                '/assets/js/magnific-popup.min.js',
                '/assets/js/odometer.min.js',
                '/assets/js/viewport.jquery.js',
                '/assets/js/nice-select.js',
                '/assets/js/main.js'
            ];
            jsFiles.forEach(src => {
                if (!document.querySelector(`script[src="${src}"]`)) {
                    const script = document.createElement('script');
                    script.src = src;
                    script.async = false;
                    document.body.appendChild(script);
                }
            });
            window.__rizydraAssetsLoaded = true;
        }

        // Fetch user dashboard data when route is loaded
        api.get('/user/profile', { withCredentials: true })
            .then(res => {
                setUserData({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    image: res.data.image || '',
                    referralCode: res.data.referralCode || '',
                    referralLevel: res.data.referralLevel || 0
                });
            })
            .catch(() => {
                setUserData({ name: '', email: '', image: '' });
            })
            .finally(() => {
                setIsLoading(false);
            });

        // Hide loader after 1 second (optional fallback)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {/* Preloader */}
            {isLoading && (
                <>
                    <div className="loader-bg">
                        <div className="loader-p"></div>
                    </div>
                    <div className="overlay"></div>
                </>
            )}



            {/* Banner Section */}
            <section className="inner-banner bg_img padding-bottom" style={{ background: "url(/assets/images/about/bg.png) no-repeat right bottom" }}>
                <div className="container">
                    <div className="inner-banner-wrapper">
                        <div className="inner-banner-content">
                            <h2 className="inner-banner-title">User <br /> Dashboard</h2>
                            <ul className="breadcums">
                                <li><a href="/">Home</a></li>
                                <li><a href="/user-dashboard">Dashboard</a></li>
                                <li><span>Account Setting</span></li>
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
                                            src={userData.image ? (userData.image.startsWith('data:image') ? userData.image : `data:image/png;base64,${userData.image}`) : "/assets/images/dashboard/userIconss.png"}
                                            alt="dashboard"
                                            style={{ width: "100px", height: "100px" ,borderRadius: "50%", objectFit: "cover" }}
                                        />
                                    </div>

                                    <div className="user-content">
                                         <span>Welcome</span>
                                       <h5 className="name">{userData.name}</h5>
                                        <p className="email">{userData.email}</p>
                                        <hr/>
                                    </div>
                                </div>
                                <ul className="user-dashboard-tab">
                                    <li><a href="/user-dashboard" >Account Overview</a></li>
                                    <li><a href="/earning-history">Earnings History</a></li>
                                    <li><a href="/referal-users">Referral Users</a></li>
                                    <li><a href="/deposit">Deposit/Withdraw</a></li>
                                    <li><a href="/account-settings" className="active">Account Settings</a></li>
                                    <li>
                                        <a
                                            href="#0"
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                try {
                                                    await api.get('/logout', { withCredentials: true });
                                                    window.location.href = '/';
                                                } catch (err) {
                                                    // Optionally handle error
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


                            {/* Profile Update Layout */}
                            <div className="profile-update-container" style={{ maxWidth: '500px', margin: '0 auto', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', padding: '32px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                                    <div className="user-thumb">
                                        {/* Profile image preview logic */}
                                        <div
                                            style={{ width: '120px', height: '120px', borderRadius: '50%', border: '2px solid blue', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px', marginLeft: '20px', cursor: 'pointer', position: 'relative' }}
                                            onClick={() => setShowUpload(true)}
                                            title="Click to change profile image"
                                        >
                                            <img
                                                src={updateFields.image ? updateFields.image : (userData.image ? (userData.image.startsWith('data:image') ? userData.image : `data:image/png;base64,${userData.image}`) : "/assets/images/dashboard/userIconss.png")}
                                                alt="Profile"
                                                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '10px' }}
                                            />
                                            {/* Overlay for upload */}
                                            {showUpload && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0, left: 0, width: '100%', height: '100%',
                                                    background: 'rgba(0,0,0,0.5)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    borderRadius: '50%',
                                                    zIndex: 2
                                                }}>
                                                    <button
                                                        type="button"
                                                        style={{
                                                            background: '#fff',
                                                            border: 'none',
                                                            borderRadius: '20px',
                                                            cursor: 'pointer',
                                                            fontWeight: 'bold',
                                                            color: '#333'
                                                        }}
                                                        onClick={() => {
                                                            setShowUpload(false);
                                                            fileInputRef.current.click();
                                                        }}
                                                    >
                                                        Upload Image
                                                    </button>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        setSelectedImageFile(file);
                                                        // Show preview instantly
                                                        const url = URL.createObjectURL(file);
                                                        setUpdateFields(prev => ({
                                                            ...prev,
                                                            image: url
                                                        }));
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                            <span style={{ display: 'block', fontWeight: 'bold', color: '#333' }}>Referral Code: {userData.referralCode}</span>
                                            <span style={{ display: 'block', color: '#555' }}>Referral Level: {userData.referralLevel}</span>
                                        </div>
                                    </div>
                                </div>
                                <form>
                                    <div className="form-group mb-3">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" id="name" className="form-control" value={updateFields.name !== undefined ? updateFields.name : userData.name} onChange={e => setUpdateFields({ ...updateFields, name: e.target.value })} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" id="email" className="form-control" value={userData.email} disabled />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" id="password" className="form-control" value={updateFields.password || ''} onChange={e => setUpdateFields({ ...updateFields, password: e.target.value })} />
                                    </div>
                                    <div className="form-group mb-4">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <input type="password" id="confirmPassword" className="form-control" value={updateFields.confirmPassword || ''} onChange={e => setUpdateFields({ ...updateFields, confirmPassword: e.target.value })} />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        style={{ padding: '12px 0', fontWeight: 'bold', fontSize: '16px' }}
                                        onClick={async () => {
                                            // Only validate password if user is updating it
                                            if (updateFields.password) {
                                                const password = updateFields.password;
                                                const confirmPassword = updateFields.confirmPassword;
                                                const isLongEnough = password.length >= 8;
                                                const hasUppercase = /[A-Z]/.test(password);
                                                const hasDigit = /\d/.test(password);
                                                if (!isLongEnough || !hasUppercase || !hasDigit) {
                                                    alert('Password must be at least 8 characters long, contain at least one uppercase letter, and one digit.');
                                                    return;
                                                }
                                                if (password !== confirmPassword) {
                                                    alert('Passwords do not match.');
                                                    return;
                                                }
                                            }
                                            try {
                                                const formData = new FormData();
                                                // Only send changed fields
                                                if (updateFields.name && updateFields.name !== userData.name) {
                                                    formData.append('name', updateFields.name);
                                                }
                                                // Email is not editable
                                                if (updateFields.password) {
                                                    formData.append('password', updateFields.password);
                                                }
                                                if (selectedImageFile) {
                                                    formData.append('profileImage', selectedImageFile);
                                                }
                                                await api.post('/user/updateprofile', formData, {
                                                    withCredentials: true,
                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                });
                                                window.location.reload();
                                            } catch (err) {
                                                alert('Profile update failed: ' + (err?.response?.data?.error || err?.message || 'Unknown error'));
                                            }
                                        }}
                                    >
                                        Update Profile
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            



            <a href="#0" className="scrollToTop active"><i className="las la-chevron-up"></i></a>
        </>
    );
}

export default AcSetting;