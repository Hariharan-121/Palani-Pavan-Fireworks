import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import { isAdmin, isAuthenticated } from "../utils/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // In a real app we'd use Context, but for this quick upgrade we'll check localStorage/API
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        // Since the current app might not store cart in localStorage yet (it uses API), 
        // we'll fetch it if logged in, or just show 0
        const user = JSON.parse(localStorage.getItem("user"));
        if(user) {
            // Normally fetch from API, but for UI demonstration we'll stick to a placeholder or simple logic
        }
    };

    window.addEventListener("scroll", handleScroll);
    updateCartCount();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <h2 className="nav-logo gradient-text">SRI PALANI PAVAN</h2>

        <div className={`nav-links ${isOpen ? "active" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/product" className="nav-link" onClick={() => setIsOpen(false)}>Shop</NavLink>
          <NavLink to="/about" className="nav-link" onClick={() => setIsOpen(false)}>About</NavLink>
          <NavLink to="/contact" className="nav-link" onClick={() => setIsOpen(false)}>Contact</NavLink>
          
          <div className="nav-actions">
            <NavLink to="/cart" className="nav-cart" onClick={() => setIsOpen(false)}>
              🛒 <span className="cart-badge">0</span>
            </NavLink>
            {isAuthenticated() ? (
              <>
                <NavLink to="/profile" className="nav-link profile-link" onClick={() => setIsOpen(false)}>👤 My Account</NavLink>
                {isAdmin() && (
                  <NavLink to="/admin" className="nav-link admin-glow" onClick={() => setIsOpen(false)}>Admin Panel</NavLink>
                )}
                <button 
                  className="nav-link logout-btn" 
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    localStorage.removeItem("cart");
                    window.location.href = "/";
                  }}
                >
                  Logout 🚪
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-link login-link" onClick={() => setIsOpen(false)}>Login</NavLink>
                <NavLink to="/register" className="nav-link register-btn" onClick={() => setIsOpen(false)}>Register</NavLink>
              </>
            )}
          </div>
        </div>

        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span className={isOpen ? "close-icon" : "hamburger-icon"}></span>
        </button>
      </div>
    </nav>
  );
}

