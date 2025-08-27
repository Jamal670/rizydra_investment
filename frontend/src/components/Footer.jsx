import React from "react";

function Footer() {
  return (
    <div>
      {/* Footer Section */}
      <section className="footer-section bg_img" style={{ background: 'url(/assets/images/footer/bg.png) no-repeat center top' }}>
        <div className="container">
          <div className="row gy-5">
            <div className="col-xl-5 col-lg-5 col-md-6 col-sm-6">
              <div className="footer-widget">
                <h3 className="widget-title">Know About Us</h3>
                <p>
                  We’re helping individuals grow their wealth through <br /> smart investing and innovative technology
                </p>
                <ul className="social-icons">
                  <li>
                    <a href="#0">
                      <i className="lab la-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#0">
                      <i className="lab la-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#0">
                      <i className="lab la-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#0">
                      <i className="lab la-linkedin-in"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-6">
              <div className="footer-widget">
                <h4 className="widget-title">Company</h4>
                <ul className="footer-links">
                  <li>
                    <a href="/contact">
                      <i className="las la-angle-double-right"></i>Support
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="las la-angle-double-right"></i>Terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="las la-angle-double-right"></i>Privacy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-sm-6 col-md-4">
              <div className="footer-widget">
                <h4 className="widget-title">Useful Link</h4>
                <ul className="footer-links">
                  <li>
                    <a href="/earning-plan">
                      <i className="las la-angle-double-right"></i>Earning Plan
                    </a>
                  </li>
                  <li>
                    <a href="/affiliate">
                      <i className="las la-angle-double-right"></i>Affiliate Program
                    </a>
                  </li>
                  <li>
                    <a href="/affiliate">
                      <i className="las la-angle-double-right"></i>Investment
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-sm-6 col-md-4">
              <div className="footer-widget">
                <h4 className="widget-title">Contact Information</h4>
                <ul className="contact-info">
                  <li>
                    742 Evergreen Terrace,
Springfield, IL 62704, USA
                  </li>
                  <li >
                    <a href="/contact">Contact Us</a>
                  </li>
                  <li>
                    info@rizydra.com
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p className="text-center text-white pt-4 p-sm-5 pb-0">
              Copyright &copy;Rizydra 2025. All Rights Reserved
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
