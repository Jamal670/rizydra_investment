import React, { useEffect, useState } from 'react';

function NotFound() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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

        // Hide loader after 1 second
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
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

            

            {/* Banner Section */}
            <section className="inner-banner bg_img" style={{ background: "url(/assets/images/404/bg.png) no-repeat center bottom" }}>
                <div className="container">
                    <div className="inner-banner-wrapper">
                        <div className="inner-banner-content padding-bottom">
                            <h2 className="inner-banner-title">Sorry! page not found</h2>
                            <ul className="breadcums">
                                <li><a href="/">Home</a></li>
                                <li><span>Error Page</span></li>
                            </ul>
                        </div>
                        <div className="inner-banner-thumb d-none d-md-block">
                            <img src="/assets/images/404/thumb.png" alt="about" />
                        </div>
                    </div>
                </div>
                <div className="shape1 paroller" data-paroller-factor=".2">
                    <img src="/assets/images/about/balls.png" alt="about" />
                </div>
            </section>

            {/* Error Section */}
            <section className="error-page padding-top padding-bottom">
                <div className="container">
                    <div className="error-thumb">
                        <img src="/assets/images/404/404.png" alt="404" />
                    </div>
                    <div className="error-content">
                        <h2 className="title">Sorry, Page Not Found</h2>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem ex ut ipsam sunt laudantium perspiciatis sint veniam modi minima, blanditiis nesciunt, dolorum recusandae vitae repellat ducimus qui maxime hic saepe. Lorem ipsum dolor sit amet, consectetur adipisicing elit. In porro totam nemo minus veritatis corrupti, doloremque cum odio qui facere numquam dolor illum repellat iste officia debitis dolores, magnam maiores.
                        </p>
                        <div className="form--group">
                            <input type="email" className="form--control" placeholder="Search for Page" />
                            <button className="custom-button" type="button">Search</button>
                        </div>
                    </div>
                </div>
            </section>



            

            <a href="#0" className="scrollToTop active"><i className="las la-chevron-up"></i></a>
        </React.Fragment>
    );
}

export default NotFound;