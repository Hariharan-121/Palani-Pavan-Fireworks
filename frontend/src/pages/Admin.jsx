import React, { useState, useEffect } from "react";
import "./Admin.css";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar
} from "recharts";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "", category: "" });
  const [imageFile, setImageFile] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
        setError("Please login as Admin to view this page.");
        setLoading(false);
        return;
    }

    const headers = { "Authorization": `Bearer ${token}` };

    try {
      // 1. Fetch Categories (Publicly available usually)
      const catRes = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      const catData = await catRes.json();
      setCategories(Array.isArray(catData) ? catData : []);

      // 2. Tab Specific Fetching
      let endpoint = "";
      if (activeTab === "dashboard") endpoint = "/api/admin/dashboard";
      else if (activeTab === "products") endpoint = "/api/admin/products";
      else if (activeTab === "users") endpoint = "/api/admin/users";
      else if (activeTab === "orders") endpoint = "/api/admin/orders";

      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, { headers });
      
      if (!res.ok) {
        const text = await res.text();
        if (text.includes("<!DOCTYPE")) throw new Error("Server returned HTML (likely 404). Check API URL.");
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "Unauthorized or Server Error");
      }

      const data = await res.json();

      if (activeTab === "dashboard") setStats(data.stats);
      else if (activeTab === "products") setProducts(data.products || []);
      else if (activeTab === "users") setUsers(data.users || []);
      else if (activeTab === "orders") setOrders(data.orders || []);

    } catch (err) {
      console.error("Admin Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // ⌚ AUTO-REFRESH: Automatically update stats every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("category", newProduct.category || categories[0]?._id); 
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert("Product added! 🎆");
        fetchData();
        setNewProduct({ name: "", price: "", description: "", category: "" });
        setImageFile(null);
      }
    } catch (error) {
       alert("Failed to add product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if(res.ok) fetchData();
    } catch (err) { alert("Delete failed"); }
  };

  return (
    <div className="admin-dashboard">
      <button 
        className={`sidebar-toggle ${isSidebarOpen ? 'active' : ''}`} 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>

      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>Admin Panel</h2>
        <ul>
          <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }}>📊 Dashboard</li>
          <li className={activeTab === "products" ? "active" : ""} onClick={() => { setActiveTab("products"); setIsSidebarOpen(false); }}>🧨 Products</li>
          <li className={activeTab === "users" ? "active" : ""} onClick={() => { setActiveTab("users"); setIsSidebarOpen(false); }}>👥 Users</li>
          <li className={activeTab === "orders" ? "active" : ""} onClick={() => { setActiveTab("orders"); setIsSidebarOpen(false); }}>📦 Orders</li>
        </ul>
      </div>

      <div className="admin-content">
        {error && (
            <div className="error-alert glass-panel">
                <p>⚠️ {error}</p>
                <button onClick={() => window.location.href='/login'}>Go to Login</button>
            </div>
        )}

        {loading ? (
          <div className="admin-loader">
             <div className="spinner-ring"></div>
             <p>Loading {activeTab}...</p>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && stats && (
              <div className="admin-section fade-in">
                <h1 className="admin-title gradient-text">Overview</h1>
                <div className="stats-grid">
                  <div className="stat-card glass-panel clickable" onClick={() => setActiveTab("orders")}>
                    <h4>Revenue</h4>
                    <p>₹{stats.totalRevenue?.toLocaleString() || "0"}</p>
                    <span className="inc">Live Data</span>
                  </div>
                  <div className="stat-card glass-panel clickable" onClick={() => setActiveTab("orders")}>
                    <h4>Orders</h4>
                    <p>{stats.totalOrders || 0}</p>
                    <span className="inc">Total Transactions</span>
                  </div>
                  <div className="stat-card glass-panel clickable" onClick={() => setActiveTab("users")}>
                    <h4>Users</h4>
                    <p>{stats.totalUsers || 0}</p>
                    <span className="inc">Active Customers</span>
                  </div>
                  <div className="stat-card glass-panel clickable" onClick={() => setActiveTab("products")}>
                    <h4>Stock</h4>
                    <p>{stats.totalProducts || 0}</p>
                    <span className="inc">Inventory Items</span>
                  </div>
                </div>

                <div className="charts-container">
                  <div className="chart-box glass-panel">
                    <h3>Sales Activity</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={stats.salesTimeline || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="_id" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px' }} />
                        <Line type="monotone" dataKey="revenue" stroke="#f8931f" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "products" && (
              <div className="admin-section fade-in">
                <h3>Product Management</h3>
                <form className="admin-form-glass" onSubmit={handleAddProduct}>
                   <div className="form-row">
                      <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                      <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                      <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required>
                        <option value="">Choose Category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                      <input type="file" onChange={e => setImageFile(e.target.files[0])} />
                      <button type="submit" className="add-btn-admin">Add 🧨</button>
                   </div>
                </form>

                <div className="table-card glass-panel">
                    <table className="admin-table">
                        <thead><tr><th>Cracker</th><th>Price</th><th>Action</th></tr></thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id}>
                                    <td>
                                        <div className="table-p-info">
                                            <img src={`${import.meta.env.VITE_API_URL}/${p.image}`} width="40" height="40" alt="" />
                                            <span>{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="price">₹{p.price}</td>
                                    <td><button className="del-btn" onClick={() => handleDeleteProduct(p._id)}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </div>
            )}

            {activeTab === "users" && (
                <div className="admin-section fade-in">
                    <h3>User Database</h3>
                    <div className="table-card glass-panel">
                        <table className="admin-table">
                            <thead><tr><th>Name</th><th>Email</th><th>Mobile</th></tr></thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.mobile || 'N/A'}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === "orders" && (
                <div className="admin-section fade-in">
                    <h3>Order History</h3>
                    <div className="table-card glass-panel">
                        <table className="admin-table">
                            <thead><tr><th>ID</th><th>Total</th><th>Status</th></tr></thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o._id}>
                                        <td className="small-id">{o._id}</td>
                                        <td className="price">₹{o.totalPrice}</td>
                                        <td><span className={`status-tag ${o.status.toLowerCase()}`}>{o.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
