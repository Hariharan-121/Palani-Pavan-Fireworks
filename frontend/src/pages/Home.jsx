import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import FireworksOverlay from "../components/FireworksOverlay";
import TraditionalLamp from "../components/TraditionalLamp";
import SaleBanner from "../components/SaleBanner";
import logo from "../assets/spp-logo.png";

export default function Home() {
  const navigate = useNavigate();

  const categories = [
    { name: "Sparklers", icon: "✨", color: "#f59e0b" },
    { name: "Rockets", icon: "🚀", color: "#ef4444" },
    { name: "Flower Pots", icon: "🏺", color: "#ec4899" },
    { name: "Ground Wheels", icon: "🌀", color: "#8b5cf6" },
  ];

  const safetyTips = [
    { title: "Safe Distance", icon: "📏", desc: "Maintain at least 5 meters distance from lighted crackers." },
    { title: "Adult Supervision", icon: "👪", desc: "Always supervised by adults when kids use fireworks." },
    { title: "Water Bucket", icon: "🪣", desc: "Keep a bucket of water nearby for emergencies." },
    { title: "Open Space", icon: "🌳", desc: "Always light fireworks in open, non-flammable areas." },
  ];

  return (
    <div className="home-page fade-in">
      {/* 🎉 Sale Banner (Dynamic) */}
      <SaleBanner />

      {/* Hero Section */}
      <section className="hero-section">
        <FireworksOverlay count={40} />
        <TraditionalLamp side="left" />
        <TraditionalLamp side="right" />

        <div className="hero-content">
          <img src={logo} alt="Sri Palani Pavan Fireworks Logo" className="hero-logo pop-in" />
          <div className="hero-text-group slide-up">
            <h1 className="hero-title gradient-text">Sri Palani Pavan Fireworks</h1>
            <p className="hero-subtitle">
              Sivakasi's Most Celebrated Premium Fireworks.
              Safe, High-Quality, and Spectacular for your family.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section-container featured-categories">
        <h2 className="section-title slide-up">Explore Categories</h2>
        <div className="category-grid">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="cat-card glass-panel pop-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => navigate('/product')}
            >
              <div className="cat-icon" style={{ background: cat.color }}>{cat.icon}</div>
              <h3>{cat.name}</h3>
              <p>See all items ➜</p>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Section */}
      <section className="safety-section">
        <div className="section-container">
          <h2 className="section-title gradient-text slide-up">Safety First 🧨</h2>
          <p className="subtitle slide-up">Your safety is our top priority. Please follow these guidelines.</p>
          <div className="safety-grid">
            {safetyTips.map((tip, idx) => (
              <div
                key={idx}
                className="safety-card glass-panel pop-in"
                style={{ animationDelay: `${idx * 0.12}s` }}
              >
                <div className="safety-icon">{tip.icon}</div>
                <h3>{tip.title}</h3>
                <p>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-container faq-section">
        <h2 className="section-title slide-up">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item glass-panel pop-in">
            <h3>Do you ship outside Sivakasi?</h3>
            <p>Yes, we ship to all major cities across India through certified carriers.</p>
          </div>
          <div className="faq-item glass-panel pop-in">
            <h3>Are your products safe for kids?</h3>
            <p>We have a dedicated 'Kids Collection' with low emission and low sound levels.</p>
          </div>
          <div className="faq-item glass-panel pop-in">
            <h3>What is the minimum order value?</h3>
            <p>To ensure safe delivery, we require a minimum order of ₹2,000.</p>
          </div>
          <div className="faq-item glass-panel pop-in">
            <h3>How can I track my order?</h3>
            <p>Once shipped, you will receive a tracking ID via SMS and Email.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

