import React from "react";
import "./Contact.css";
import FireworksOverlay from "../components/FireworksOverlay";

export default function Contact() {
  return (
    <div className="contact-container fade-in">
      <FireworksOverlay count={8} />
      
      <div className="contact-content section-container pop-in">
        <div className="contact-details">
          <h1 className="section-title gradient-text">Connect With Us</h1>
          <p className="subtitle">SRI PALANI PAVAN FIREWORKS - Light up your world.</p>

          <div className="contact-info">
            <div className="info-item">
              <span className="icon">📧</span>
              <p>sppfireworks@gmail.com</p>
            </div>
            <div className="info-item">
              <span className="icon">📞</span>
              <p>+91 98765 43210</p>
            </div>
            <div className="info-item">
              <span className="icon">📍</span>
              <p>Sivakasi, Tamil Nadu, India</p>
            </div>
          </div>

          <button className="primary-btn" onClick={() => window.location.href='mailto:sppfireworks@gmail.com'}>
            Send Email 🧨
          </button>
        </div>
      </div>
    </div>
  );
}
