import React from "react";
import "./Footer.css";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer-container glass-panel">
      <div className="section-container">
        <div className="footer-grid">
          <div className="footer-brand slide-up">
            <h2 className="footer-logo gradient-text">SRI PALANI PAVAN FIREWORKS</h2>
            <p className="footer-desc">
              Bring the sparkle to your celebrations with Sivakasi's finest premium crackers. 
              Safe, high-quality, and spectacular.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon">Instagram</a>
              <a href="#" className="social-icon">Facebook</a>
              <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210"}`} target="_blank" rel="noopener noreferrer" className="social-icon">WhatsApp</a>
            </div>
          </div>

          <div className="footer-links slide-up" style={{ animationDelay: '0.1s' }}>
            <h3>Quick Links</h3>
            <ul>
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/product">Shop Now</NavLink></li>
              <li><NavLink to="/about">Our Story</NavLink></li>
              <li><NavLink to="/contact">Contact Us</NavLink></li>
            </ul>
          </div>

          <div className="footer-links slide-up" style={{ animationDelay: '0.2s' }}>
            <h3>Customer Care</h3>
            <ul>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Return Policy</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Safety Tips</a></li>
            </ul>
          </div>

          <div className="footer-contact slide-up" style={{ animationDelay: '0.3s' }}>
            <h3>Visit Us</h3>
            <p>123 Fireworks Lane, Sivakasi,</p>
            <p>Tamil Nadu, India - 626123</p>
            <p className="contact-info">📞 +{import.meta.env.VITE_WHATSAPP_NUMBER || "91 98765 43210"}</p>
            <p className="contact-info">📧 support@sppfireworks.com</p>
          </div>
        </div>
        
        <div className="footer-newsletter glass-panel pop-in">
          <div className="newsletter-text">
            <h3>Join our Sparkly Newsletter! ✨</h3>
            <p>Get early access to Diwali offers and safety tips directly in your inbox.</p>
          </div>
          <form className="newsletter-form">
            <input type="email" placeholder="Your Email Address" required />
            <button type="submit" className="primary-btn">Subscribe 🧨</button>
          </form>
        </div>

        <div className="footer-bottom">
          <p>© 2025 SRI PALANI PAVAN. All Rights Reserved. Crafted for Joy 🎇</p>
        </div>
      </div>
    </footer>
  );
}

