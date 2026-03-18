import React from "react";
import "./About.css";
import FireworksOverlay from "../components/FireworksOverlay";

export default function About() {
  return (
    <div className="about-container fade-in">
      <FireworksOverlay count={10} />
      
      <div className="about-content section-container slide-up">
        <div className="about-details">
          <h1 className="section-title gradient-text">Crafting Joy Since 1995</h1>
          <div className="about-text">
            <p>
              SRI PALANI PAVAN FIREWORKS is more than just a supplier; we are 
              purveyors of festive magic. Sourced from the heart of Sivakasi, our products 
              represent the pinnacle of safety and visual brilliance.
            </p>
            <p>
              From the smallest sparkler that lights up a child's eyes to the grand 
              aerial displays that paint the midnight sky, we ensure every moment is 
              unforgettable. Our commitment to quality means certified safety standards 
              and vibrant performance in every box.
            </p>
          </div>
          <button className="gold-btn" onClick={() => window.location.href='/contact'}>Get in Touch 🎇</button>
        </div>
      </div>
    </div>
  );
}
