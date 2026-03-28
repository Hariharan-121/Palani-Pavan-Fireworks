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
            

            <div className="info-card glass-panel pop-in" style={{ animationDelay: '0.1s' }}>
              <span className="icon">📞</span>
              <h3>Call Support</h3>
              <p>+{whatsappNumber}</p>
              <p>+91 11223 34455</p>
            </div>

            <div className="info-card glass-panel pop-in" style={{ animationDelay: '0.2s' }}>
              <span className="icon">📧</span>
              <h3>Email Inquiries</h3>
              <p>orders@sripalanipavan.com</p>
              <p>support@sripalanipavan.com</p>
            </div>
          </div>

          <form className="contact-form glass-panel pop-in" onSubmit={handleSubmit} style={{ animationDelay: '0.3s' }}>
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

        {/* Option 7: Google Maps Store Locator */}
        <section className="map-section" style={{ marginTop: '80px', textAlign: 'center' }}>
          <header className="map-header slide-up">
            <h2 className="gradient-text">Visit Our Store 📍</h2>
            <p className="subtitle">Exploration starts here. Visit Sivakasi's premium cracker depot.</p>
          </header>
          
          <div className="map-container glass-panel pop-in" style={{ marginTop: '40px', padding: '10px', borderRadius: '32px', overflow: 'hidden', position: 'relative' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31484.576882200213!2d77.7833!3d9.45!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cf72c4ca7771%3A0xe5a1413a967f62b!2sSivakasi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin" 
              width="100%" 
              height="450" 
              style={{ border: 0, borderRadius: '24px' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            <div style={{ marginTop: '20px', paddingBottom: '20px' }}>
              <a 
                href="https://www.google.com/maps/dir//Sivakasi,+Tamil+Nadu" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="primary-btn"
                style={{ textDecoration: 'none', display: 'inline-block' }}
              >
                Get Directions 🚗
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
