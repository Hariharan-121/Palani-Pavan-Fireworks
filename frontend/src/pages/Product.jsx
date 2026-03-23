import React, { useState, useEffect } from "react";
import "./Product.css";
import FireworksOverlay from "../components/FireworksOverlay";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const addToCart = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add items to cart 🧨");
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user?.id, productId, quantity: 1 })
      });
      if (res.ok) {
        alert("Boom! Added to Cart! 🎇");
      }
    } catch (err) {
      alert("Error adding to cart");
    }
  };

  return (
    <div className="product-page fade-in">
      <FireworksOverlay count={15} />
      
      <div className="product-container section-container">
        <header className="product-header slide-up">
          <h1 className="section-title gradient-text">Premium Collection</h1>
          <p className="subtitle">Sivakasi's most celebrated explosives, handpicked for you.</p>
        </header>

        {loading ? (
          <div className="loader fade-in">
            <div className="spinner"></div>
            <p>Lighting up the shop...</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.length > 0 ? (
              products.map((p) => (
                <div key={p._id} className="product-card glass-panel pop-in">
                  <div className="image-wrapper">
                    <img src={`${import.meta.env.VITE_API_URL}/${p.image}`} alt={p.name} loading="lazy" />
                    <div className="price-tag">₹{p.price}</div>
                  </div>
                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <button className="add-btn" onClick={() => addToCart(p._id)}>
                      Add to Cart 🧨
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products glass-panel">No fireworks found. Check back soon!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}