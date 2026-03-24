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

  const total = cart.items.reduce((acc, item) => acc + (item.product?.price * item.qty || 0), 0);

  return (
    <div className="cart-page fade-in">
      <FireworksOverlay count={10} />
      
      <div className="cart-content section-container">
        <h2 className="gradient-text slide-up">Your Festive Bin</h2>
        
        {loading ? (
          <div className="loader fade-in">Gathering your explosives...</div>
        ) : cart.items.length === 0 ? (
          <div className="empty-cart glass-panel pop-in" style={{padding: '60px', textAlign: 'center', borderRadius: '24px'}}>
            <p style={{fontSize: '1.2rem', color: 'var(--text-muted)'}}>Your cart is empty. Let's add some spark! 🧨</p>
            <button className="primary-btn" style={{marginTop: '20px'}} onClick={() => navigate("/product")}>Shop Now</button>
          </div>
        ) : (
          <div className="cart-container slide-up">
            <div className="cart-table-container">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.product?.name || 'Unknown'}</td>
                      <td>₹{item.product?.price || 0}</td>
                      <td>{item.qty}</td>
                      <td>
                        <button className="remove-btn" onClick={() => removeFromCart(item.product?._id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="cart-summary glass-panel">
              <h3>Total: <span className="gradient-text">₹{total}</span></h3>
              <div className="cart-actions" style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <button className="checkout-btn" onClick={() => navigate("/checkout")}>Proceed to Checkout 🧨</button>
                <a 
                  href={getWhatsAppUrl(cart.items, total)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-order-btn"
                  style={{
                    backgroundColor: '#25D366',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <span style={{ fontSize: '1.2rem' }}>💬</span> Order via WhatsApp 🎇
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
