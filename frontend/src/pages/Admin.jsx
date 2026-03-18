import React, { useState, useEffect } from "react";
import "./Admin.css";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "", category: "" });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && activeTab !== "products") {
      unlockAdmin();
    }
    fetchData();
  }, [activeTab]);

  const unlockAdmin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/admin-login", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        fetchData();
      }
    } catch (err) {}
  };

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const headers = token ? { "Authorization": `Bearer ${token}` } : {};

    // Fetch categories first to have them for product creation
    try {
      const catRes = await fetch("http://localhost:5000/api/categories");
      const catData = await catRes.json();
      setCategories(catData);
      if (catData.length > 0 && !newProduct.category) {
        setNewProduct(prev => ({ ...prev, category: catData[0]._id }));
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }

    if (activeTab === "products") {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } else if (activeTab === "users") {
      const res = await fetch("http://localhost:5000/api/users", { headers });
      const data = await res.json();
      setUsers(data);
    } else if (activeTab === "orders") {
      const res = await fetch("http://localhost:5000/api/orders", { headers });
      const data = await res.json();
      setOrders(data);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    if (!newProduct.category && categories.length === 0) {
      alert("No categories found. Please seed the database or create a category first.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("category", newProduct.category || categories[0]._id); 
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert("Product added successfully! 🎇");
        fetchData();
        setNewProduct({ name: "", price: "", description: "" });
        setImageFile(null);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to add product: ${errData.message || res.statusText} (Status: ${res.status})`);
      }
    } catch (error) {
       console.error("Add Product Error:", error);
       alert("Network error while adding product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {}
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>Products</li>
          <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>Users</li>
          <li className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Orders</li>
        </ul>
      </div>

      <div className="admin-content">
        {activeTab === "products" && (
          <div className="admin-section fade-in">
            <h3>Manage Products</h3>
            <form className="add-product-form" onSubmit={handleAddProduct}>
              <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
              <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
              <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required>
                <option value="" disabled>Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input type="text" placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              <button type="submit">Add Product</button>
            </form>

            <table className="admin-table">
              <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Action</th></tr></thead>
              <tbody>
                {products.length ? products.map(p => (
                  <tr key={p._id}>
                    <td>{p.image && <img src={`http://localhost:5000${p.image}`} alt={p.name} width="50" />}</td>
                    <td>{p.name}</td>
                    <td>₹{p.price}</td>
                    <td><button className="del-btn" onClick={() => handleDeleteProduct(p._id)}>Delete</button></td>
                  </tr>
                )) : <tr><td colSpan="4">No products found</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "users" && (
          <div className="admin-section fade-in">
            <h3>Registered Users</h3>
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th></tr></thead>
              <tbody>
                {users.length ? users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.mobile || "N/A"}</td>
                    <td>{u.addresses?.length > 0 ? `${u.addresses[0].address}, ${u.addresses[0].city}` : "N/A"}</td>
                  </tr>
                )) : <tr><td colSpan="4">No users found</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="admin-section fade-in">
            <h3>Placed Orders</h3>
            <table className="admin-table">
              <thead><tr><th>Order ID</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th></tr></thead>
              <tbody>
                {orders.length ? orders.map(o => (
                  <tr key={o._id}>
                    <td>{o._id}</td>
                    <td>{o.items.map(i => `${i.name || i.product?.name} (x${i.qty})`).join(", ")}</td>
                    <td>₹{o.totalPrice}</td>
                    <td><span className={`status ${o.status.toLowerCase()}`}>{o.status}</span></td>
                    <td>{o.paymentMethod.toUpperCase()}</td>
                  </tr>
                )) : <tr><td colSpan="5">No orders found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
