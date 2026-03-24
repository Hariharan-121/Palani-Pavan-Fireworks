import React, { useState } from "react";
import "./Contact.css";
import FireworksOverlay from "../components/FireworksOverlay";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We'll light up your inbox soon. 🧨");
    setFormData({ name: "", email: "", message: "" });
  };

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210";

  return (
    <div className="contact-page fade-in">
      <FireworksOverlay count={8} />
      
      <div className="contact-container section-container">
        <header className="contact-header slide-up">
          <h1 className="section-title gradient-text">Connect With Us</h1>
          <p className="subtitle">Got questions? We're here to light up your celebrations.</p>
        </header>

        <div className="contact-grid">
          <div className="contact-info-panel slide-up">
            <div className="info-card glass-panel pop-in">
              <span className="icon">📍</span>
              <h3>Visit Sivakasi</h3>
              <p>123 Fireworks Lane, Sivakasi, Tamil Nadu, 626123</p>
            </div>
            
            <a 
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Welcome to Sri Palani Pavan Fireworks ✨\n\nI have a query about your products. 🧨🎇")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="info-card glass-panel pop-in" 
              style={{ animationDelay: '0.1s', textDecoration: 'none', color: 'inherit' }}
            >
              <span className="icon">💬</span>
              <h3>WhatsApp Us</h3>
              <p>Instant Support on WhatsApp</p>
              <p>+{whatsappNumber}</p>
            </a>

            <div className="info-card glass-panel pop-in" style={{ animationDelay: '0.2s' }}>
              <span className="icon">📞</span>
              <h3>Call Support</h3>
              <p>+{whatsappNumber}</p>
              <p>+91 11223 34455</p>
            </div>

            <div className="info-card glass-panel pop-in" style={{ animationDelay: '0.3s' }}>
              <span className="icon">📧</span>
              <h3>Email Inquiries</h3>
              <p>orders@sripalanipavan.com</p>
              <p>support@sripalanipavan.com</p>
            </div>
          </div>

          <form className="contact-form glass-panel pop-in" onSubmit={handleSubmit} style={{ animationDelay: '0.4s' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Ex: Rajesh Kumar" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="Ex: raj@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                rows="5" 
                placeholder="What can we help you with?" 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn primary-btn">Send Message 🎇</button>
          </form>
        </div>
      </div>
    </div>
  );
}
