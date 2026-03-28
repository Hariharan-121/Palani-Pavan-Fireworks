import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import FireworksOverlay from "../components/FireworksOverlay";
import { getWhatsAppUrl } from "../utils/whatsapp";

export default function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setCart(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCart();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const items = cart?.items || [];
  const total = items.reduce((acc, item) => {
    const price = item.product?.price || 0;
    const qty = item.qty || 0;
    return acc + (price * qty);
  }, 0);

  return (
    <div className="cart-page fade-in">
      <FireworksOverlay count={8} />
      
      <div className="cart-content section-container">
        <header className="cart-header slide-up">
          <h1 className="gradient-text">Your Festive Bin</h1>
          <p className="subtitle">Ready to light up the sky?</p>
        </header>
        
        {loading ? (
          <div className="loader fade-in">Gathering your explosives...</div>
        ) : items.length === 0 ? (
          <div className="empty-cart glass-panel pop-in">
            <div className="empty-icon">🧨</div>
            <p>Your cart is empty. Let's add some spark!</p>
            <button className="primary-btn" onClick={() => navigate("/product")}>Start Shopping</button>
          </div>
        ) : (
          <div className="cart-grid slide-up">
            <div className="cart-items-list">
              {items.map((item, idx) => (
                <div key={item.product?._id || idx} className="cart-item glass-panel pop-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="item-info">
                    <h3>{item.product?.name || 'Unknown Cracker'}</h3>
                    <p className="item-price">₹{item.product?.price || 0} per unit</p>
                  </div>
                  <div className="item-controls">
                    <div className="qty-tag">qty: {item.qty}</div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.product?._id)}>
                      Remove 🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary glass-panel sticky-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items:</span>
                <span>{items.length}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span className="gradient-text">₹{total}</span>
              </div>
              
              <div className="cart-actions">
                <button className="checkout-btn" onClick={() => navigate("/checkout")}>
                  Proceed to Checkout 🧨
                </button>
                <a 
                  href={getWhatsAppUrl(items, total)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-order-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 448 512" fill="currentColor"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.3 107.2 27.3 121.7 0 221.7-100 221.7-221.7 0-59.2-22.9-114.8-65.7-157.6zm-157 341.6c-33.1 0-65.6-8.9-94-25.7l-6.7-4-69.8 18.3 18.7-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 54 81.2 54 130.5 0 101.8-82.7 184.6-184.5 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.4-11.3 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.6 5.5-9.3 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.3 5.7 23.5 9.2 31.6 11.8 13.3 4.2 25.5 3.6 35.1 2.1 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                  Order via WhatsApp 🎇
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
