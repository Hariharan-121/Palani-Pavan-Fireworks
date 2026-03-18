import React from "react";
import "./Home.css";
import FireworksOverlay from "../components/FireworksOverlay";
import TraditionalLamp from "../components/TraditionalLamp";
import logo from "../assets/spp-logo.png";

export default function Home() {
  return (
    <div className="home-container">
      <FireworksOverlay count={30} />
      
      <TraditionalLamp side="left" />
      <TraditionalLamp side="right" />
      
      <div className="hero-content fade-in">
        <img src={logo} alt="SPP Logo" className="hero-logo pop-in" />
        <div className="hero-text-group slide-up">
          <h1 className="hero-title gradient-text">SPP FIREWORKS</h1>
          <p className="hero-subtitle">
            Experience the Magic of Sivakasi's Finest Premium Crackers. 
            Crafted for safety, designed for joy.
          </p>
          <div className="hero-btns">
            <button className="primary-btn" onClick={() => window.location.href='/product'}>Shop Now 🧨</button>
          </div>
        </div>
      </div>
    </div>
  );
}
