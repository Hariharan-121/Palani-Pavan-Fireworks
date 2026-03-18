import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import FireworksOverlay from "../components/FireworksOverlay";

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
      const res = await fetch("http://localhost:5000/api/cart", {
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
      const res = await fetch("http://localhost:5000/api/orders", {
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
          </form>
        </div>
      </div>
    </div>
  );
}
