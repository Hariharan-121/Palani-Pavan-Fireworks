import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import FireworksOverlay from "../components/FireworksOverlay";
import { getWhatsAppUrl } from "../utils/whatsapp";

export default function Checkout() {
  const [cart, setCart] = useState({ items: [] });
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setCart(data);
      setLoading(false);
      if (data.items.length === 0) {
        navigate("/cart");
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const total = cart.items.reduce((acc, item) => acc + (item.product?.price * item.qty || 0), 0);

    const orderData = {
      items: cart.items.map(i => ({
        product: i.product._id,
        name: i.product.name,
        price: i.product.price,
        qty: i.qty
      })),
      totalPrice: total,
      paymentMethod: "cod",
      address: { fullAddress: address }
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      
      if (res.ok) {
        alert("Order placed successfully with Cash on Delivery! 🎇");
        navigate("/");
      } else {
        alert("Failed to place order.");
      }
    } catch (err) {
      alert("Error placing order.");
    }
  };

  return (
    <div className="checkout-page fade-in">
      <FireworksOverlay count={5} />
      
      <div className="checkout-content section-container pop-in">
        <div className="checkout-card glass-panel">
          <h2 className="gradient-text">Complete Your Order</h2>
          <div className="order-summary">
            {loading ? (
              <p>Calculating total...</p>
            ) : (
              <>
                <h3 className="gradient-text">Total Price: ₹{cart.items.reduce((acc, item) => acc + (item.product?.price * item.qty || 0), 0)}</h3>
                <p>Payment Mode: <strong>Cash on Delivery 🧨</strong></p>
              </>
            )}
          </div>
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <textarea 
              placeholder="Enter Precise Delivery Address" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              required
              rows="4"
            />
            <button type="submit" className="place-order-btn">Confirm Order 🎇</button>
            <div style={{ marginTop: '15px' }}>
              <p style={{ textAlign: 'center', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>- OR -</p>
              <a 
                href={getWhatsAppUrl(cart.items, cart.items.reduce((acc, item) => acc + (item.product?.price * item.qty || 0), 0), address)} 
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
                  gap: '10px',
                  width: '100%'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <span style={{ fontSize: '1.2rem' }}>💬</span> Order via WhatsApp 🎇
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
