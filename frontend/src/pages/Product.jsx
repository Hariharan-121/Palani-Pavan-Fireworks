import React, { useState, useEffect } from "react";
import "./Product.css";
import FireworksOverlay from "../components/FireworksOverlay";
import { getWhatsAppUrl } from "../utils/whatsapp";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/products`),
          fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
        ]);
        
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        
        setProducts(prodData);
        setCategories(catData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
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

  const filteredProducts = products.filter(p => {
    const pName = p.name || "";
    const pDesc = p.description || "";
    const matchesSearch = pName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pDesc.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Robust category matching
    let categoryName = "Uncategorized";
    if (typeof p.category === 'object' && p.category?.name) {
      categoryName = p.category.name;
    } else if (typeof p.category === 'string') {
      const catObj = categories.find(c => c._id === p.category);
      if (catObj) categoryName = catObj.name;
    }

    const matchesCategory = selectedCategory === "All" || categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const addToWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to save to wishlist ❤️");
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        alert("Saved to your Wishlist! ❤️✨");
      }
    } catch (err) {
      alert("Error adding to wishlist");
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

        {/* Filter Controls */}
        <div className="filter-controls glass-panel pop-in">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search for fireworks... (e.g. Sparklers, Rockets)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="category-filters">
            <button 
              className={`cat-btn ${selectedCategory === "All" ? "active" : ""}`}
              onClick={() => setSelectedCategory("All")}
            >
              All
            </button>
            {categories.map(cat => (
              <button 
                key={cat._id} 
                className={`cat-btn ${selectedCategory === cat.name ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="product-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="product-card skeleton-card glass-panel pop-in">
                <div className="image-wrapper skeleton-shimmer"></div>
                <div className="product-info">
                  <div className="skeleton-line skeleton-shimmer half"></div>
                  <div className="skeleton-line skeleton-shimmer full"></div>
                  <div className="skeleton-line skeleton-shimmer full"></div>
                  <div className="skeleton-btn skeleton-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <div key={p._id} className="product-card glass-panel pop-in">
                  <div className="image-wrapper">
                    <img src={`${import.meta.env.VITE_API_URL}/${p.image}`} alt={p.name} loading="lazy" />
                    <div className="price-tag">₹{p.price}</div>
                    {p.isCombo && <div className="combo-badge">Combo Pack ✨</div>}
                    <button className="wishlist-btn" onClick={() => addToWishlist(p._id)}>
                      ❤️
                    </button>
                  </div>
                  <div className="product-info">
                    <div className="product-meta">
                      <span className="product-cat">{typeof p.category === 'object' ? p.category?.name : categories.find(c => c._id === p.category)?.name}</span>
                      {p.soundLevel && <span className={`sound-lvl ${p.soundLevel.toLowerCase()}`}>{p.soundLevel} Sound</span>}
                    </div>
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                    <div className="card-footer" style={{ display: 'flex', gap: '8px' }}>
                      {p.stock > 0 ? (
                        <button className="add-btn" style={{ flex: 1 }} onClick={() => addToCart(p._id)}>
                          Add to Cart 🧨
                        </button>
                      ) : (
                        <button className="add-btn out-of-stock" style={{ flex: 1 }} disabled>
                          Out of Stock
                        </button>
                      )}
                      <a 
                        href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210"}?text=${encodeURIComponent("Welcome to Sri Palani Pavan Fireworks ✨\n\nI'm interested in: " + p.name + "\nPrice: ₹" + p.price + "\n\nPlease provide more details. 🧨")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-inquiry-btn"
                        style={{
                          backgroundColor: '#25D366',
                          color: 'white',
                          padding: '0 12px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                          fontSize: '1.2rem'
                        }}
                        title="Inquire on WhatsApp"
                      >
                        💬
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products glass-panel">No fireworks found matching your criteria.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
