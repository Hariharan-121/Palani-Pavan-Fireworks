import React, { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import './SaleBanner.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SaleBanner = () => {
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await fetch(`${API}/api/promos/sale`);
        const data = await response.json();
        if (data && data.isActive) {
          setSale(data);
        } else {
          // 🚀 STATIC FALLBACK FOR DEMO
          setSale({
            title: "🪔 FESTIVAL MEGA SALE 🪔",
            subtitle: "Premium Fireworks at Wholesale Prices!",
            discountPercent: 60,
            bannerColor: '#f8931f',
            endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
            isActive: true
          });
        }
      } catch (error) {
        console.error('Error fetching sale data:', error);
        // 🚀 STATIC FALLBACK ON ERROR
        setSale({
          title: "🪔 FESTIVAL MEGA SALE 🪔",
          subtitle: "Premium Fireworks at Wholesale Prices!",
          discountPercent: 60,
          bannerColor: '#f8931f',
          endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, []);

  if (loading || !sale) return null;

  return (
    <div className="sale-banner-container" style={{ background: `linear-gradient(90deg, ${sale.bannerColor || '#f8931f'}, #ff6b00)` }}>
      <div className="sale-banner-sparkles"> ✨ 🎇 🎆 🎇 ✨ </div>

      <div className="sale-banner-content">
        <div className="sale-text-left">
          <span className="sale-badge shake">MEGA SALE!</span>
          <h2 className="sale-title">{sale.title}</h2>
          <p className="sale-subtitle">{sale.subtitle}</p>
        </div>

        <div className="sale-discount-orb">
          <span className="discount-prefix">UP TO</span>
          <span className="discount-value">{sale.discountPercent}%</span>
          <span className="discount-suffix">OFF</span>
        </div>

        <div className="sale-timer-section">
          <p className="timer-headline">Ends in:</p>
          <CountdownTimer targetDate={sale.endDate} />
        </div>

        <button className="sale-shop-now" onClick={() => window.location.href = '/product'}>
          SHOP NOW ➜
        </button>
      </div>

      <div className="sale-banner-sparkles"> ✨ 🎇 🎆 🎇 ✨ </div>
    </div>
  );
};

export default SaleBanner;
