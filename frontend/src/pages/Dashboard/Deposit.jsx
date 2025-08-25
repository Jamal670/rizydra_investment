import React, { useEffect, useState, useRef } from 'react';
import api from '../../api';

function Deposit() {
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [binanceTR20, setBinanceTR20] = useState('');
    const [loadingDeposit, setLoadingDeposit] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState('Select');
    const [copySuccess, setCopySuccess] = useState('');
    const [showHelper, setShowHelper] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [depositInput, setDepositInput] = useState("");
    const [depositScreenshot, setDepositScreenshot] = useState(null);
    const [focusedDeposit, setFocusedDeposit] = useState(false);
    const [focusedAddress, setFocusedAddress] = useState(false);
    const fileInputRef = useRef(null);

    const [userData, setUserData] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showTxnModal, setShowTxnModal] = useState(false);

    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawExchange, setWithdrawExchange] = useState('Select');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawUserExchange, setWithdrawUserExchange] = useState('');
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [focusedWithdrawAmount, setFocusedWithdrawAmount] = useState(false); // New state for withdraw amount focus
    const [focusedWithdrawAddress, setFocusedWithdrawAddress] = useState(false); // New state for withdraw address focus

    const [showInvestModal, setShowInvestModal] = useState(false);
    const [investFrom, setInvestFrom] = useState('Deposit');
    const [investTo, setInvestTo] = useState('Invest');
    const [investAmount, setInvestAmount] = useState('');

    const walletAddresses = {
        TRC20: 'TFU1q2LLEpnCJA7udzmUcvozUuyMaFYSyC',
        BEP20: '0x32100614cf179e38452abf61033b686c8256bab6'
    };

    const qrImages = {
        TRC20: '/assets/images/account/TRC20.jpeg',
        BEP20: '/assets/images/account/BEP20.jpeg'
    };

    // Add new state for address validation
    const [addressError, setAddressError] = useState('');
    const [isAddressValid, setIsAddressValid] = useState(false);

    // Address validation function
    const validateAddress = (address, network) => {
        if (!address || !network) return false;

        const trimmedAddress = address.trim();

        if (network === 'TRC20') {
            // TRC20: 34 chars, starts with "T", Base58-like
            if (trimmedAddress.length !== 34) return false;
            // if (!trimmedAddress.startsWith('T')) return false;

            // Base58 validation (A-Z, a-z, 0-9, excluding 0,O,I,l)
            const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
            return base58Regex.test(trimmedAddress);
        }

        if (network === 'BEP20') {
            // BEP20: 42 chars, starts with "0x", hex
            if (trimmedAddress.length !== 42) return false;
            // if (!trimmedAddress.startsWith('0x')) return false;

            // Hex validation for remaining 40 chars
            const hexRegex = /^0x[0-9a-fA-F]{40}$/;
            return hexRegex.test(trimmedAddress);
        }

        return false;
    };

    // Handle address input change with validation
    const handleAddressChange = (address) => {
        setBinanceTR20(address);

        if (selectedNetwork === 'Select') {
            setAddressError('Please select an exchange first');
            setIsAddressValid(false);
            return;
        }

        const isValid = validateAddress(address, selectedNetwork);
        setIsAddressValid(isValid);

        if (!isValid && address) {
            if (selectedNetwork === 'TRC20') {
                setAddressError('TRC20 address must be 34 characters, start with "T", and contain only Base58 characters');
            } else if (selectedNetwork === 'BEP20') {
                setAddressError('BEP20 address must be 42 characters, start with "0x", and contain only hex characters');
            }
        } else {
            setAddressError('');
        }
    };

    // Handle network selection change
    const handleNetworkChange = (network) => {
        setSelectedNetwork(network);
        setBinanceTR20(''); // Clear entered address
        setAddressError(''); // Clear error
        setIsAddressValid(false); // Reset validation
    };

    useEffect(() => {
        if (!window.__rizydraAssetsLoaded) {
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
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get('/user/showdeposit', { withCredentials: true });
                if (res.data.success) setUserData(res.data.data);
            } catch (err) {
                // handle error
            }
        }
        fetchData();
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(walletAddresses[selectedNetwork]);
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 1200);
        } catch {
            setCopySuccess('Failed!');
            setTimeout(() => setCopySuccess(''), 1200);
        }
    };

    const handleDepositVerification = () => setShowVerification(true);

    const handleDepositSubmit = async (e) => {
        e.preventDefault();

        if (!depositScreenshot) {
            alert('Please upload a file.');
            return;
        }

        const formData = new FormData();
        formData.append('exchangeType', selectedNetwork);
        formData.append('ourExchange', walletAddresses[selectedNetwork]);
        formData.append('amount', depositInput);
        formData.append('userExchange', binanceTR20);
        formData.append('type', 'Deposit');
        if (depositScreenshot) {
            formData.append('image', depositScreenshot);
        }

        try {
            const res = await api.post('/user/deposit', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert(res.data.message || 'Deposit submitted!');
            setShowVerification(false);
            setDepositInput('');
            setBinanceTR20('');
            setDepositScreenshot(null);
            setShowModal(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            alert('Deposit failed!');
        }
    };

    const handleScreenshotChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setDepositScreenshot(e.target.files[0]);
        }
    };

    // Helper Modal
    const HelperModal = () => (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.25)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn .25s'
            }}
            onClick={() => setShowHelper(false)}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    padding: '2rem 2rem 1.5rem 2rem',
                    maxWidth: 400,
                    width: '90%',
                    animation: 'slideDown .3s',
                    position: 'relative'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={() => setShowHelper(false)}
                    style={{
                        position: 'absolute',
                        top: 8,
                        right: 10,
                        width: '24px',
                        height: '24px',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '1.2rem',
                        lineHeight: '1rem',
                        cursor: 'pointer',
                        color: '#000',
                        padding: 0,
                        zIndex: 2
                    }}
                    aria-label="Close"
                >
                    &times;
                </button>
                <h4 style={{ fontWeight: 700, marginBottom: 18, color: '#222' }}>How to Deposit</h4>
                <div style={{ fontSize: 16, color: '#333', lineHeight: 1.7 }}>
                    <div style={{ marginBottom: 10 }}>- <b>Copy</b> the exchange code according to the exchange method you selected.</div>
                    <div style={{ marginBottom: 10 }}>- <b>Open your Binance account</b> and transfer USDT to this exchange code.</div>
                    <div style={{ marginBottom: 10 }}>- <b>Once the transfer is complete</b>, return here and upload a screenshot.</div>
                    <div>- <b>After verification</b>, we will credit the USDT to your wallet.</div>
                </div>
            </div>
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideDown {
                    from { transform: translateY(-30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                `}
            </style>
        </div>
    );

    // Modal JSX
    const DepositModal = () => (
        <div
            className="modal"
            style={{
                display: 'block',
                background: 'rgba(0,0,0,0.5)',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 1050
            }}
            tabIndex="-1"
            role="dialog"
        >
            <div
                className="modal-dialog modal-dialog-centered"
                style={{
                    width: '40vw',
                    minWidth: 320,
                    maxWidth: 600,
                    margin: 'auto'
                }}
                role="document"
            >
                <div
                    className="modal-content"
                    style={{ position: 'relative', borderRadius: 12, padding: 0 }}
                >
                    <div
                        className="modal-header"
                        style={{
                            borderBottom: 'none',
                            alignItems: 'center',
                            padding: '1.2rem 1.5rem 0.5rem 1.5rem',
                            background: '#fff',
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            position: 'relative'
                        }}
                    >
                        <img src="/assets/images/account/binanceLogo.png" alt="Binance" style={{ width: 36, height: 36, marginRight: 12 }} />
                        <h5 className="modal-title" style={{ fontWeight: 600, fontSize: 20, margin: 0, lineHeight: '36px' }}>
                            Deposit through Binance
                        </h5>
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            style={{
                                position: 'absolute',
                                top: 12,
                                right: 18,
                                width: 28,
                                height: 28,
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                lineHeight: '1rem',
                                cursor: 'pointer',
                                color: '#222',
                                zIndex: 2
                            }}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                    </div>
                    <div
                        className="modal-body"
                        style={{
                            padding: '1.5rem',
                            maxHeight: '70vh',
                            overflowY: 'auto'
                        }}
                    >
                        <div className="mb-3">
                            <label className="form-label mb-1" style={{ fontWeight: 500 }}>Select your exchange</label>
                            <select
                                className="form-select"
                                value={selectedNetwork}
                                onChange={e => handleNetworkChange(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                <option value="Select">Select</option>
                                <option value="TRC20">TRC20</option>
                                <option value="BEP20">BEP20</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label mb-1" style={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                                Copy and Deposit
                                <span
                                    style={{
                                        marginLeft: 8,
                                        width: 24,
                                        height: 24,
                                        border: '1.5px solid #C9CDCF',
                                        borderRadius: '50%',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        color: '#879196ff',
                                        cursor: 'pointer',
                                        fontSize: 16,
                                        background: '#f8faff',
                                        transition: 'background 0.2s'
                                    }}
                                    onClick={() => setShowHelper(true)}
                                    onMouseEnter={e => e.currentTarget.style.background = '#eaf3ff'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#f8faff'}
                                    title="How to deposit"
                                >?</span>
                            </label>
                            <div className="input-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={walletAddresses[selectedNetwork] || ''}
                                    readOnly
                                    style={{ background: '#f7f7f7', fontWeight: 500, fontSize: 15 }}
                                />
                                <button
                                    className="btn btn-outline-primary"
                                    type="button"
                                    onClick={handleCopy}
                                    style={{ minWidth: 70, fontWeight: 500, margin: 8 }}
                                    disabled={selectedNetwork === 'Select'}
                                >
                                    Copy
                                </button>
                            </div>
                            {copySuccess && (
                                <div style={{ color: '#28a745', fontSize: 13, marginTop: 4 }}>{copySuccess}</div>
                            )}
                        </div>
                        <div className="text-center mb-3">
                            <img
                                src={qrImages[selectedNetwork] || '/assets/images/account/TRC20.jpeg'}
                                alt={selectedNetwork + " QR"}
                                style={{
                                    width: 140,
                                    height: 140,
                                    objectFit: 'contain',
                                    background: '#f5f5f5',
                                    borderRadius: 8,
                                    border: '1px solid #eee'
                                }}
                            />
                        </div>
                        {/* Deposit Verification Section */}
                        {!showVerification && (
                            <div className="text-center">
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', fontWeight: 600, marginTop: 10 }}
                                    onClick={handleDepositVerification}
                                >
                                    Deposit Verification
                                </button>
                            </div>
                        )}
                        {showVerification && (
                            <form onSubmit={handleDepositSubmit} style={{ marginTop: 20, animation: 'slideDown .3s' }}>
                                <div className="mb-3">
                                    <label className="form-label" style={{ fontWeight: 500 }}>
                                        Enter your deposit amount (USDT)
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        className="form-control"
                                        placeholder='Enter your deposit amount'
                                        value={depositInput}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*\.?\d*$/.test(value)) {
                                                setDepositInput(value);
                                            }
                                        }}
                                        onFocus={() => setFocusedDeposit(true)}
                                        onBlur={() => setFocusedDeposit(false)}
                                        ref={(input) => {
                                            if (focusedDeposit && input) {
                                                input.focus();
                                            }
                                        }}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" style={{ fontWeight: 500 }}>
                                        Enter your exchange address
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={binanceTR20}
                                        onChange={e => handleAddressChange(e.target.value)}
                                        onFocus={() => setFocusedAddress(true)}
                                        onBlur={() => setFocusedAddress(false)}
                                        ref={(input) => {
                                            if (focusedAddress && input) {
                                                input.focus();
                                            }
                                        }}
                                        placeholder={selectedNetwork === 'TRC20' ? 'Enter your TRC20 address (34 characters)' : 'Enter your BEP20 address (42 characters)'}
                                        required
                                        style={{
                                            borderColor: addressError ? '#dc3545' : isAddressValid ? '#28a745' : '#ced4da'
                                        }}
                                    />
                                    {addressError && (
                                        <div style={{ color: '#dc3545', fontSize: 12, marginTop: 4 }}>{addressError}</div>
                                    )}
                                    {isAddressValid && (
                                        <div style={{ color: '#28a745', fontSize: 12, marginTop: 4 }}>✓ Valid address</div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" style={{ fontWeight: 500 }}>Upload your screenshot</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleScreenshotChange}
                                        ref={fileInputRef}
                                    />
                                    {depositScreenshot && (
                                        <div style={{ marginTop: 8 }}>
                                            <img
                                                src={URL.createObjectURL(depositScreenshot)}
                                                alt="Screenshot Preview"
                                                style={{ width: 100, borderRadius: 6, border: '1px solid #eee' }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-link"
                                                style={{ color: '#007bff', padding: 0, marginLeft: 10 }}
                                                onClick={() => {
                                                    setDepositScreenshot(null);
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = "";
                                                    }
                                                }}
                                            >
                                                Change Image
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', fontWeight: 600 }}
                                    disabled={!isAddressValid || !depositInput || !depositScreenshot}
                                >
                                    Deposit
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            {showHelper && <HelperModal />}
        </div>
    );

    // Withdraw Modal Component
    const WithdrawModal = () => (
        <div
            className="modal"
            style={{
                display: 'block',
                background: 'rgba(0,0,0,0.5)',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 1050
            }}
            tabIndex="-1"
            role="dialog"
        >
            <div
                className="modal-dialog modal-dialog-centered"
                style={{
                    width: '40vw',
                    minWidth: 320,
                    maxWidth: 600,
                    margin: 'auto'
                }}
                role="document"
            >
                <div
                    className="modal-content"
                    style={{ position: 'relative', borderRadius: 12, padding: 0 }}
                >
                    <div
                        className="modal-header"
                        style={{
                            borderBottom: 'none',
                            alignItems: 'center',
                            padding: '1.2rem 1.5rem 0.5rem 1.5rem',
                            background: '#fff',
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            position: 'relative'
                        }}
                    >
                        <img src="/assets/images/account/binanceLogo.png" alt="Binance" style={{ width: 36, height: 36, marginRight: 12 }} />
                        <h5 className="modal-title" style={{ fontWeight: 600, fontSize: 20, margin: 0, lineHeight: '36px' }}>
                            Withdraw through Binance
                        </h5>
                        <button
                            type="button"
                            onClick={() => setShowWithdrawModal(false)}
                            style={{
                                position: 'absolute',
                                top: 12,
                                right: 18,
                                width: 28,
                                height: 28,
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                lineHeight: '1rem',
                                cursor: 'pointer',
                                color: '#222',
                                zIndex: 2
                            }}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                    </div>
                    <div className="modal-body" style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                        <div className="d-flex flex-column flex-md-row justify-content-evenly mb-4" style={{ gap: 24 }}>
                            <div>
                                <div style={{ fontWeight: 500, fontSize: 15, color: '#888' }}>Total Balance:</div>
                                <div style={{ fontWeight: 700, fontSize: 18, color: '#222' }}>
                                    ${(userData?.totalBalance || 0).toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontWeight: 500, fontSize: 15, color: '#888' }}>Invest Balance:</div>
                                <div style={{ fontWeight: 700, fontSize: 18, color: '#222' }}>${(userData?.investedAmount || 0).toLocaleString()}</div>
                            </div>
                        </div>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (
                                    withdrawExchange === 'Select' ||
                                    !withdrawAmount ||
                                    !withdrawUserExchange
                                ) return;
                                setWithdrawLoading(true);
                                try {
                                    const payload = {
                                        exchangeType: withdrawExchange,
                                        ourExchange: walletAddresses[withdrawExchange],
                                        amount: withdrawAmount,
                                        userExchange: withdrawUserExchange,
                                        type: "Withdraw"
                                    };
                                    const res = await api.post('/user/withdraw', payload, { withCredentials: true });
                                    alert(res.data.message || 'Withdraw request submitted!');
                                    setShowWithdrawModal(false);
                                    setWithdrawExchange('Select');
                                    setWithdrawAmount('');
                                    setWithdrawUserExchange('');
                                } catch (err) {
                                    alert('Withdraw failed!');
                                }
                                setWithdrawLoading(false);
                            }}
                            style={{ marginTop: 10 }}
                        >
                            <div className="mb-3">
                                <label className="form-label" style={{ fontWeight: 500 }}>
                                    Enter your withdraw exchange
                                </label>
                                <select
                                    className="form-select"
                                    value={withdrawExchange}
                                    onChange={e => setWithdrawExchange(e.target.value)}
                                    style={{ width: '100%' }}
                                >
                                    <option value="Select">Select</option>
                                    <option value="BEP20">BEP20 (Recommended)</option>
                                    <option value="TRC20">TRC20</option>
                                </select>
                            </div>
                            {withdrawExchange !== 'Select' && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label" style={{ fontWeight: 500 }}>
                                            Enter your withdraw amount (USDT)
                                        </label>
                                        <input
                                            type="text"
                                            inputMode="decimal"
                                            className="form-control"
                                            value={withdrawAmount}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*\.?\d*$/.test(value)) {
                                                    setWithdrawAmount(value);
                                                }
                                            }}
                                            onFocus={() => setFocusedWithdrawAmount(true)} // Add onFocus
                                            onBlur={() => setFocusedWithdrawAmount(false)}  // Add onBlur
                                            ref={(input) => {
                                                if (focusedWithdrawAmount && input) {
                                                    input.focus();
                                                }
                                            }} // Add ref
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label" style={{ fontWeight: 500 }}>
                                            Enter your exchange address
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={withdrawUserExchange}
                                            onChange={(e) => setWithdrawUserExchange(e.target.value)}
                                            onFocus={() => setFocusedWithdrawAddress(true)}  // Add onFocus
                                            onBlur={() => setFocusedWithdrawAddress(false)}   // Add onBlur
                                            ref={(input) => {
                                                if (focusedWithdrawAddress && input) {
                                                    input.focus();
                                                }
                                            }} // Add ref
                                            placeholder="Enter your exchange address"
                                            autoComplete="off"
                                            spellCheck="false"
                                            required
                                        />
                                    </div>
                                </>
                            )}
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', fontWeight: 600 }}
                                disabled={
                                    withdrawExchange === 'Select' ||
                                    !withdrawAmount ||
                                    !withdrawUserExchange ||
                                    withdrawLoading
                                }
                            >
                                {withdrawLoading ? 'Processing...' : 'Withdraw'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

    // Invest Modal Component
    const InvestModal = () => (
        <div
            className="modal"
            style={{
                display: 'block',
                background: 'rgba(0,0,0,0.5)',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 1050
            }}
            tabIndex="-1"
            role="dialog"
        >
            <div
                className="modal-dialog modal-dialog-centered"
                style={{
                    width: '40vw',
                    minWidth: 320,
                    maxWidth: 600,
                    margin: 'auto'
                }}
                role="document"
            >
                <div
                    className="modal-content"
                    style={{ position: 'relative', borderRadius: 12, padding: 0 }}
                >
                    <div
                        className="modal-header"
                        style={{
                            borderBottom: 'none',
                            alignItems: 'center',
                            padding: '1.2rem 1.5rem 0.5rem 1.5rem',
                            background: '#fff',
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            position: 'relative'
                        }}
                    >
                        <img src="/assets/images/account/binanceLogo.png" alt="Binance" style={{ width: 36, height: 36, marginRight: 12 }} />
                        <h5 className="modal-title" style={{ fontWeight: 600, fontSize: 20, margin: 0, lineHeight: '36px' }}>
                            Invest Your Balance
                        </h5>
                        <button
                            type="button"
                            onClick={() => setShowInvestModal(false)}
                            style={{
                                position: 'absolute',
                                top: 12,
                                right: 18,
                                width: 28,
                                height: 28,
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                lineHeight: '1rem',
                                cursor: 'pointer',
                                color: '#222',
                                zIndex: 2
                            }}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                    </div>
                    <div className="modal-body" style={{ padding: '2rem 1.5rem', background: '#fff' }}>
                        <div className="d-flex flex-column flex-md-row justify-content-evenly mb-4" style={{ gap: 24 }}>
                            <div>
                                <div style={{ fontWeight: 500, fontSize: 15, color: '#888' }}>Total Balance:</div>
                                <div style={{ fontWeight: 700, fontSize: 18, color: '#222' }}>
                                    ${(userData?.totalBalance || 0).toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontWeight: 500, fontSize: 15, color: '#888' }}>Invest Balance:</div>
                                <div style={{ fontWeight: 700, fontSize: 18, color: '#222' }}>${(userData?.investedAmount || 0).toLocaleString()}</div>
                            </div>
                        </div>
                        <form
                            onSubmit={async e => {
                                e.preventDefault();
                                try {
                                    const res = await api.post(
                                        '/user/investamount',
                                        {
                                            from: investFrom,
                                            to: investTo,
                                            amount: investAmount
                                        },
                                        { withCredentials: true }
                                    );
                                    alert(res.data.message || 'Invest submitted!');
                                } catch (err) {
                                    alert(err.response?.data?.message || 'Invest failed!');
                                }
                                setShowInvestModal(false);
                                setInvestAmount('');
                            }}
                        >

                            <div className="d-flex flex-column flex-md-row justify-content-between mb-3" style={{ gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontWeight: 500 }}>From</label>
                                    <select
                                        className="form-select"
                                        value={investFrom}
                                        onChange={e => setInvestFrom(e.target.value)}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="Deposit">Balance</option>
                                        <option value="Invest">Invest</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontWeight: 500 }}>To</label>
                                    <select
                                        className="form-select"
                                        value={investTo}
                                        onChange={e => setInvestTo(e.target.value)}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="Deposit">Balance</option>
                                        <option value="Invest">Invest</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label" style={{ fontWeight: 500 }}>Enter Your Amount (USDT)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={investAmount}
                                    onChange={e => {
                                        const value = e.target.value;
                                        if (/^\d*\.?\d*$/.test(value)) setInvestAmount(value);
                                    }}
                                    required
                                    placeholder="Minimum Invest Amount 100"
                                    style={{ fontSize: 16 }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', fontWeight: 600, fontSize: 17, padding: '12px 0', borderRadius: 8 }}
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

    const totalBalance = Number(userData?.totalBalance) || 0;

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
                                <li><span>Deposit And Withdraw</span></li>
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
                                            src={userData?.image ? (userData?.image.startsWith('data:image') ? userData?.image : `data:image/png;base64,${userData?.image}`) : "/assets/images/dashboard/userIconss.png"}
                                            alt="dashboard"
                                            style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className="user-content">
                                        <span>Welcome</span>
                                        <h5 className="name">{userData?.name || 'User'}</h5>
                                        <p className="email">{userData?.email || ''}</p>
                                        <hr />
                                    </div>
                                </div>
                                <ul className="user-dashboard-tab">
                                    <li><a href="/user-dashboard" >Account Overview</a></li>
                                    <li><a href="/earning-history">Earnings History</a></li>
                                    <li><a href="/referal-users">Referral Users</a></li>
                                    <li><a href="/deposit" className="active">Deposit/Withdraw</a></li>
                                    <li><a href="/account-settings">Account Settings</a></li>
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

                            {/* Dashboard Boxes Section */}
                            <div className="dashboard-boxes">
                                <div className="row justify-content-center g-4 mb-3">
                                    {/* Total Balance */}
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <div className="dashboard-item">
                                            <div className="row align-items-center">
                                                <div className="col-4 text-center">
                                                    <img src="/assets/images/dashboard/wallet.png" alt="dashboard" style={{ width: 48, height: 48 }} />
                                                </div>
                                                <div className="col-8">
                                                    <h6 className="title mb-0" style={{ fontWeight: 600 }}>Total Balance</h6>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 text-center">
                                                    <h3 className="ammount theme-one" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        ${totalBalance.toLocaleString()}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Deposit Amount */}
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <div className="dashboard-item">
                                            <div className="row align-items-center">
                                                <div className="col-4 text-center">
                                                    <img src="/assets/images/dashboard/deposit.png" alt="dashboard" style={{ width: 48, height: 48 }} />
                                                </div>
                                                <div className="col-8">
                                                    <h6 className="title mb-0" style={{ fontWeight: 600 }}>Deposit Amount</h6>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 text-center">
                                                    <h3 className="ammount theme-four" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        ${(userData?.depositAmount || 0).toLocaleString()}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Invested Amount */}
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <div className="dashboard-item">
                                            <div className="row align-items-center">
                                                <div className="col-4 text-center">
                                                    <img src="/assets/images/dashboard/invest.png" alt="dashboard" style={{ width: 48, height: 48 }} />
                                                </div>
                                                <div className="col-8">
                                                    <h6 className="title mb-0" style={{ fontWeight: 600 }}>Invested Amount</h6>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 text-center">
                                                    <h3 className="ammount theme-four" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        ${(userData?.investedAmount || 0).toLocaleString()}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Total Earning */}
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <div className="dashboard-item">
                                            <div className="row align-items-center">
                                                <div className="col-4 text-center">
                                                    <img src="/assets/images/dashboard/profit.png" alt="dashboard" style={{ width: 48, height: 48 }} />
                                                </div>
                                                <div className="col-8">
                                                    <h6 className="title mb-0" style={{ fontWeight: 600 }}>Total Earning</h6>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 text-center">
                                                    <h3 className="ammount theme-two" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        ${(userData?.totalEarn || 0).toLocaleString()}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Referral Earning */}
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <div className="dashboard-item">
                                            <div className="row align-items-center">
                                                <div className="col-4 text-center">
                                                    <img src="/assets/images/dashboard/reference.png" alt="dashboard" style={{ width: 48, height: 48 }} />
                                                </div>
                                                <div className="col-8">
                                                    <h6 className="title mb-0" style={{ fontWeight: 600 }}>Referral Earning</h6>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-12 text-center">
                                                    <h3 className="ammount theme-four" style={{ fontWeight: 700, fontSize: 22 }}>
                                                        ${(userData?.refEarn || 0).toLocaleString()}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center justify-content-lg-between mb-4" style={{ gap: "12px" }}>
                                    <h4 className="title mb-3 mb-lg-0">Deposit history</h4>
                                    <div className="d-flex flex-column flex-lg-row w-100 w-lg-auto justify-content-lg-end" style={{ gap: "12px" }}>
                                        <button
                                            className="btn btn-primary px-4 py-2 w-100 w-lg-auto"
                                            onClick={() => setShowModal(true)}
                                        >
                                            Deposit
                                        </button>
                                        <button
                                            className="btn btn-primary px-4 py-2 w-100 w-lg-auto"
                                            onClick={() => setShowWithdrawModal(true)}
                                        >
                                            Withdraw
                                        </button>
                                        <button
                                            className="btn btn-primary px-4 py-2 w-100 w-lg-auto"
                                            onClick={() => setShowInvestModal(true)}
                                        >
                                            Invest
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <table className="deposit-table">
                                <thead>
                                    <tr>
                                        <th>Amount</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userData?.confirmedInvestments?.map(txn => (
                                        <tr key={txn._id}>
                                            <td>
                                                {txn.type === 'Withdraw'
                                                    ? `- $${Number(txn.amount).toLocaleString()}`
                                                    : txn.type === 'Deposit'
                                                        ? `+ $${Number(txn.amount).toLocaleString()}`
                                                        : `$${Number(txn.amount).toLocaleString()}`}
                                            </td>
                                            <td>{txn.type}</td>
                                            <td>{txn.status}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm"
                                                    style={{
                                                        backgroundColor: '#C9CDCF',
                                                        color: '#000',
                                                        borderRadius: '20px',
                                                        border: 'none',
                                                        padding: '6px 10px',
                                                        fontWeight: 500,
                                                    }}
                                                    onClick={() => {
                                                        setSelectedTransaction(txn);
                                                        setShowTxnModal(true);
                                                    }}
                                                >
                                                    View
                                                </button>

                                            </td>
                                            <td>{txn.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Profit Calculation Section */}
            <section className="profit-calculation wow slideInUp overflow-hidden">
                <div className="container">
                    <div className="profit-calculation-wrapper">
                        <h3 className="title">Calculate How Much You Profit</h3>
                        <form className="profit-form">
                            <div className="row g-4">
                                <div className="col-lg-4 col-md-6">
                                    <div className="form--group">
                                        <select>
                                            <option value="plan01">Select the Plan</option>
                                            <option value="plan01">Business Plan</option>
                                            <option value="plan01">Professional Plan</option>
                                            <option value="plan01">Individual Plan</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <div className="form--group">
                                        <select>
                                            <option value="plan01">Select the Currency</option>
                                            <option value="plan01">Bitcoin</option>
                                            <option value="plan01">Ethereum</option>
                                            <option value="plan01">Ripple</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="form--group">
                                        <input type="text" className="form--control" placeholder="Enter the Ammount" required />
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="profit-title-wrapper d-flex justify-content-between my-5 mb-3">
                            <h5 className="daily-profit text--secondary">Daily Profit - <span className="ammount">0.1200</span>BTC</h5>
                            <h5 className="daily-profit theme-four">Total Profit - <span className="ammount">24.1200</span>BTC</h5>
                        </div>
                        <div className="invest-range-area">
                            <div className="main-amount">
                                <input type="text" className="calculator-invest" id="btc-amount" readOnly />
                            </div>
                            <div className="invest-amount" data-min="01 BTC" data-max="10000 BTC">
                                <div id="btc-range" className="invest-range-slider"></div>
                            </div>
                            <button type="submit" className="custom-button px-0">Invest now</button>
                        </div>
                    </div>
                </div>
            </section>

            <a href="#0" className="scrollToTop active"><i className="las la-chevron-up"></i></a>

            {/* Deposit Modal */}
            {showModal && <DepositModal />}

            {/* Withdraw Modal */}
            {showWithdrawModal && <WithdrawModal />}

            {/* Invest Modal */}
            {showInvestModal && <InvestModal />}

            {/* Transaction Modal */}
            {showTxnModal && selectedTransaction && (
                <div
                    className="modal"
                    style={{
                        display: 'block',
                        background: 'rgba(0,0,0,0.5)',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 2000
                    }}
                    tabIndex="-1"
                    role="dialog"
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        style={{
                            width: '90vw',
                            maxWidth: 600,
                            margin: 'auto'
                        }}
                        role="document"
                    >
                        <div className="modal-content" style={{ borderRadius: 12, padding: 0, maxHeight: '90vh' }}>
                            <div className="modal-header" style={{ justifyContent: 'center', borderBottom: 'none' }}>
                                <h5 className="modal-title" style={{ fontWeight: 700, fontSize: 22, margin: 'auto' }}>
                                    Transaction History
                                </h5>
                            </div>
                            <div className="modal-body" style={{
                                padding: '1.5rem',
                                maxHeight: '60vh',
                                overflowY: 'auto',
                                overflowX: 'hidden'
                            }}>
                                <div style={{ marginBottom: '12px' }}><b>Exchange Type:</b> {selectedTransaction.exchangeType}</div>
                                <div style={{ marginBottom: '12px' }}><b>Exchange Address:</b> {selectedTransaction.ourExchange}</div>
                                <div style={{ marginBottom: '12px' }}><b>Amount:</b> ${Number(selectedTransaction.amount).toLocaleString()}</div>
                                <div style={{ marginBottom: '12px' }}><b>User Exchange Address:</b> {selectedTransaction.userExchange}</div>
                                <div style={{ marginBottom: '12px' }}><b>Status:</b> {selectedTransaction.status}</div>
                                <div style={{ marginBottom: '12px' }}><b>Type:</b> {selectedTransaction.type}</div>
                                <div style={{ marginBottom: '12px' }}><b>Date:</b> {selectedTransaction.date}</div>
                                {selectedTransaction.image && selectedTransaction.image.length > 30 && (
                                    <div style={{ marginTop: 12 }}>
                                        <b>Screenshot:</b><br />
                                        <img
                                            src={`data:image/png;base64,${selectedTransaction.image}`}
                                            alt="Transaction Screenshot"
                                            style={{
                                                maxWidth: '100%',
                                                borderRadius: 8,
                                                border: '1px solid #eee',
                                                marginTop: '8px'
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer" style={{ justifyContent: 'center', borderTop: 'none' }}>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowTxnModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Deposit;