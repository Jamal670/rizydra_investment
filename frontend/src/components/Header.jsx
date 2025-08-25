import React from "react";

function Header() {
  return (
    <div>
      {/* Header Section */}
      <header className="header">
        <div className="header-bottom">
          <div className="container">
            <div className="header-area">
              <div className="logo">
                <a href="/">
                  <img src="/assets/images/logo.png" alt="logo" />
                </a>
              </div>
              <div className="header-trigger d-block d-lg-none">
                <span></span>
              </div>
              <ul className="menu">
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="/earning-plan">Earning Plan</a>
                </li>
                <li>
                  <a href="/affiliate">Affiliate</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
                <li>
                  <a href="/sign-up" className="cmn--btn">SIGN UP</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
