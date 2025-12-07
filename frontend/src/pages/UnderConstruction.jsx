import React, { useEffect, useState } from 'react';

function UnderConstruction() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Dynamically load CSS and JS files
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

        let loaded = 0;
        const total = cssFiles.length + jsFiles.length;
        const markLoaded = () => {
            loaded += 1;
            if (loaded >= total) {
                setIsLoading(false);
            }
        };

        cssFiles.forEach(href => {
            const existing = document.querySelector(`link[href="${href}"]`);
            if (existing) {
                markLoaded();
            } else {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.onload = markLoaded;
                link.onerror = markLoaded;
                document.head.appendChild(link);
            }
        });

        jsFiles.forEach(src => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                markLoaded();
            } else {
                const script = document.createElement('script');
                script.src = src;
                script.async = false;
                script.onload = markLoaded;
                script.onerror = markLoaded;
                document.body.appendChild(script);
            }
        });

        return () => { /* no-op cleanup */ };
    }, []);

    return (
        <React.Fragment>
            {/* Preloader */}
            {isLoading && (
                <>
                    <div
                        className="loader-bg"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: '#fff',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <img
                            src="/loader.jpeg"
                            alt="Loading..."
                            style={{
                                width: 260,
                                height: 260,
                                animation: 'blink 1s infinite',
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

            

            {/* Under Construction Section */}
            <section className="error-page padding-top padding-bottom">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-xl-8">
                            <div className="error-content text-center">
                                <div className="mb-4">
                                    <i className="las la-tools" style={{ fontSize: '80px', color: '#3f58e3', marginBottom: '30px' }}></i>
                                </div>
                                <h2 className="title mb-4">Under Construction!</h2>
                                <p className="mb-4" style={{ fontSize: '18px', lineHeight: '1.8' }}>
                                    This website is currently under construction as we are upgrading our system to provide you with a better experience.
                                </p>
                                
                                <div className="alert alert-info" style={{ 
                                    background: '#e7f3ff', 
                                    border: '1px solid #3f58e3', 
                                    borderRadius: '10px',
                                    padding: '25px',
                                    margin: '30px 0',
                                    textAlign: 'left'
                                }}>
                                    <h5 className="mb-3" style={{ color: '#3f58e3', fontWeight: '600' }}>
                                        <i className="las la-info-circle me-2"></i>Please note:
                                    </h5>
                                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '16px', lineHeight: '2' }}>
                                        <li>The website will remain unavailable for the next <strong>7 days</strong>.</li>
                                        <li>Your daily profit has been temporarily paused because the website is under maintenance.</li>
                                    </ul>
                                </div>

                                <p className="mb-4" style={{ fontSize: '18px', lineHeight: '1.8', color: '#666' }}>
                                    We will be back soon with improved features.
                                </p>
                                
                                <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#666', fontStyle: 'italic' }}>
                                    Thank you for your patience and understanding.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <a href="#0" className="scrollToTop active"><i className="las la-chevron-up"></i></a>
        </React.Fragment>
    );
}

export default UnderConstruction;

