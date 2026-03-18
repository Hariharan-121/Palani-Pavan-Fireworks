import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar glass-panel">
      <div className="nav-container">
        <h2 className="nav-logo gradient-text">SPP FIREWORKS</h2>

        <div className={`nav-links ${isOpen ? "active" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/about" className="nav-link" onClick={() => setIsOpen(false)}>About</NavLink>
          <NavLink to="/contact" className="nav-link" onClick={() => setIsOpen(false)}>Contact</NavLink>
          <NavLink to="/product" className="nav-link" onClick={() => setIsOpen(false)}>Product</NavLink>
          <NavLink to="/login" className="nav-link" onClick={() => setIsOpen(false)}>Login</NavLink>
          <NavLink to="/register" className="nav-link register-btn" onClick={() => setIsOpen(false)}>Register</NavLink>
        </div>

        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          <span className={isOpen ? "close-icon" : "hamburger-icon"}></span>
        </button>
      </div>
    </nav>
  );
}
