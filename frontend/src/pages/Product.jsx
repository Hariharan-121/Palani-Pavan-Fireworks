import React, { useState, useEffect } from "react";
import "./Product.css";
import FireworksOverlay from "../components/FireworksOverlay";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const catRes = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
        
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        
        const productsArray = Array.isArray(prodData) ? prodData : [];
        setProducts(productsArray);
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const pName = p.name || "";
    const pDesc = p.description || "";
    const matchesSearch = pName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pDesc.toLowerCase().includes(searchQuery.toLowerCase());
    
    let categoryName = "Uncategorized";
    if (p.category && typeof p.category === 'object' && p.category.name) {
      categoryName = p.category.name;
    } else if (p.category) {
      const catObj = categories.find(c => c._id === p.category);
      if (catObj) categoryName = catObj.name;
    }

    const matchesCategory = selectedCategory === "All" || categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating) => (
    <div className="stars-container" title={`${rating || 0} stars`}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`star ${i < Math.floor(rating || 0) ? "filled" : ""}`}>★</span>
      ))}
      <span className="rating-num">({rating ? rating.toFixed(1) : "New"})</span>
    </div>
  );

  const openProduct = async (product) => {
    setSelectedProduct(product);
    setLoadingReviews(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/product/${product._id}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching reviews", e);
    } finally {
      setLoadingReviews(false);
    }
  };

  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to shop! 🧨");
      window.location.href = "/login";
      return;
    }
    alert("Added to cart! (Simulated)");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if(!token) return alert("Please login to leave a review!");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: selectedProduct._id, rating: newReview.rating, comment: newReview.comment })
      });
      if(res.ok) {
        alert("Review shared! 🎆");
        openProduct(selectedProduct);
        setNewReview({ rating: 5, comment: "" });
      }
    } catch (err) { alert("Failed to save review"); }
  };

  return (
    <div className="product-page fade-in">
      <FireworksOverlay count={15} />
      
      <div className="product-container section-container">
        <div className="filter-controls-top glass-panel">
          <div className="search-bar-wrapper">
            <input 
              type="text" 
              placeholder="Search fireworks..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              className="search-input-medium"
            />
            <span className="search-icon-small">🔍</span>
          </div>

          <div className="category-bar">
            <button className={`cat-pill ${selectedCategory === "All" ? "active" : ""}`} onClick={() => setSelectedCategory("All")}>All</button>
            {categories.map(cat => (
              <button key={cat._id} className={`cat-pill ${selectedCategory === cat.name ? "active" : ""}`} onClick={() => setSelectedCategory(cat.name)}>{cat.name}</button>
            ))}
          </div>
        </div>

        <header className="product-header-compact">
          <h1 className="section-title-small gradient-text">Premium Collection</h1>
          <p className="subtitle-small">Explosive celebrations starts here.</p>
        </header>

        {loading ? (
          <div className="product-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="product-card skeleton-card glass-panel"><div className="skeleton-shimmer"></div></div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(p => (
                <div key={p._id} className="product-card glass-panel" onClick={() => openProduct(p)}>
                  <div className="image-wrapper">
                    <img src={`${import.meta.env.VITE_API_URL}/${p.image}`} alt={p.name} />
                    <div className="price-tag">₹{p.price}</div>
                  </div>
                  <div className="product-info">
                    <div className="product-meta">
                      <span className="product-cat">{typeof p.category === 'object' ? p.category?.name : categories.find(c => c._id === p.category)?.name}</span>
                      {p.soundLevel && <span className={`sound-lvl-badge ${p.soundLevel.toLowerCase()}`}>{p.soundLevel} Sound</span>}
                    </div>
                    {renderStars(p.rating)}
                    <h3>{p.name}</h3>
                    <p className="p-desc">{p.description}</p>
                    <button className="add-btn" onClick={e => { e.stopPropagation(); addToCart(p); }}>Quick Buy 🧨</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products glass-panel">No crackers found matching your filter.</div>
            )}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="product-modal-root" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProduct(null)}>✕</button>
            <div className="modal-body-layout">
              <div className="modal-image-sec">
                <img src={`${import.meta.env.VITE_API_URL}/${selectedProduct.image}`} alt={selectedProduct.name} />
              </div>
              <div className="modal-details-sec">
                <h1>{selectedProduct.name}</h1>
                <div className="modal-price">₹{selectedProduct.price}</div>
                <p>{selectedProduct.description}</p>
                <button className="add-btn" onClick={() => addToCart(selectedProduct)}>Add to Bag 🧨</button>

                <div className="reviews-section">
                  <h3>Reviews ({reviews.length})</h3>
                  {loadingReviews ? <p>Loading reviews...</p> : (
                    <div className="reviews-list">
                      {reviews.map((r, i) => (
                        <div key={i} className="review-item">
                          <strong>{r.user?.name || "Customer"}</strong> {renderStars(r.rating)}
                          <p>{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <form className="add-review-form" onSubmit={handleReviewSubmit}>
                    <div className="rating-select">
                      {[1,2,3,4,5].map(v => (
                        <button key={v} type="button" className={newReview.rating >= v ? "star filled" : "star"} onClick={() => setNewReview({...newReview, rating: v})}>★</button>
                      ))}
                    </div>
                    <textarea placeholder="Write a review..." value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} required />
                    <button type="submit" className="submit-rev-btn">Submit 🎇</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}