import React, { useEffect, useState } from "react";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check localStorage for authenticated flag
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div>
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
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/earning-plan">Earning Plan</a></li>
                <li><a href="/affiliate">Affiliate</a></li>
                <li><a href="/contact">Contact</a></li>
                <li>
                  {isLoggedIn ? (
                    <a href="/user-dashboard" className="cmn--btn">Dashboard</a>
                  ) : (
                    <a href="/sign-up" className="cmn--btn">SIGN UP</a>
                  )}
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
