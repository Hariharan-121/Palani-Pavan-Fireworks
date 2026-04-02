import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../utils/auth";
import "./Profile.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ── Sidebar menu items ── */
const USER_MENU = [
  { key: "overview",  icon: "📊", label: "Overview" },
  { key: "profile",   icon: "👤", label: "Personal Info" },
  { key: "orders",    icon: "📦", label: "My Orders" },
  { key: "addresses", icon: "📍", label: "Addresses" },
  { key: "wishlist",  icon: "❤️", label: "Wishlist" },
  { key: "spending",  icon: "💰", label: "Spending" },
];

const ADMIN_MENU = [
  { key: "overview",   icon: "📊", label: "Overview" },
  { key: "profile",    icon: "👤", label: "Personal Info" },
  { key: "all-users",  icon: "👥", label: "All Users" },
  { key: "all-orders", icon: "📦", label: "All Orders" },
  { key: "analytics",  icon: "📈", label: "Site Analytics" },
  { key: "activity",   icon: "🕐", label: "Recent Activity" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Profile() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const userIsAdmin = isAdmin();
  const MENU = userIsAdmin ? ADMIN_MENU : USER_MENU;

  /* ── State ── */
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  /* ── Admin state ── */
  const [allUsers, setAllUsers] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);

  /* ── Edit profile state ── */
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editMobile, setEditMobile] = useState("");

  /* ── Address form state ── */
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [addrForm, setAddrForm] = useState({ label: "", address: "", city: "", state: "", pincode: "", phone: "" });

  const token = localStorage.getItem("token");

  /* ── Helpers ── */
  const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token}` });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  /* ── Fetch all data ── */
  useEffect(() => {
    if (!isAuthenticated()) { setLoading(false); return; }
    
    const fetchAll = async () => {
      try {
        const fetches = [
          fetch(`${API}/api/users/profile`, { headers: headers() }),
          fetch(`${API}/api/orders/my`, { headers: headers() }),
        ];

        // Regular users also fetch addresses & wishlist
        if (!userIsAdmin) {
          fetches.push(
            fetch(`${API}/api/address`, { headers: headers() }),
            fetch(`${API}/api/wishlist`, { headers: headers() }),
          );
        }

        // Admin fetches all users and all orders
        if (userIsAdmin) {
          fetches.push(
            fetch(`${API}/api/users`, { headers: headers() }),
            fetch(`${API}/api/orders`, { headers: headers() }),
          );
        }

        const results = await Promise.all(fetches);
        const userData = await results[0].json();
        const ordersData = await results[1].json();

        setUser(userData);
        setOrders(Array.isArray(ordersData) ? ordersData : []);

        if (!userIsAdmin) {
          const addressData = await results[2].json();
          const wishlistData = await results[3].json();
          setAddresses(Array.isArray(addressData) ? addressData : []);
          setWishlist(Array.isArray(wishlistData) ? wishlistData : []);
        }

        if (userIsAdmin) {
          const usersData = await results[2].json();
          const allOrdersData = await results[3].json();
          setAllUsers(Array.isArray(usersData) ? usersData : []);
          setAllOrders(Array.isArray(allOrdersData) ? allOrdersData : []);
        }

        setEditName(userData.name || "");
        setEditEmail(userData.email || "");
        setEditMobile(userData.mobile || "");
      } catch (e) {
        console.error("Profile fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* ── Computed stats (for regular users) ── */
  const stats = useMemo(() => {
    const totalSpent = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + (o.totalPrice || 0), 0);
    return {
      totalOrders: orders.length,
      totalSpent,
      wishlistCount: wishlist.length,
      addressCount: addresses.length,
    };
  }, [orders, wishlist, addresses]);

  /* ── Admin computed stats ── */
  const adminStats = useMemo(() => {
    const totalRevenue = allOrders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + (o.totalPrice || 0), 0);
    const deliveredOrders = allOrders.filter(o => o.status === "Delivered").length;
    const pendingOrders = allOrders.filter(o => o.status === "Placed" || o.status === "Dispatched").length;
    const cancelledOrders = allOrders.filter(o => o.status === "Cancelled").length;
    return {
      totalUsers: allUsers.length,
      totalOrders: allOrders.length,
      totalRevenue,
      deliveredOrders,
      pendingOrders,
      cancelledOrders,
      avgOrderValue: allOrders.length > 0 ? Math.round(totalRevenue / allOrders.filter(o => o.status !== "Cancelled").length) || 0 : 0,
    };
  }, [allUsers, allOrders]);

  /* ── Monthly revenue (admin) ── */
  const monthlyRevenue = useMemo(() => {
    const map = {};
    MONTHS.forEach(m => map[m] = 0);
    allOrders.filter(o => o.status !== "Cancelled").forEach(o => {
      const d = new Date(o.createdAt);
      const m = MONTHS[d.getMonth()];
      if (m) map[m] += o.totalPrice || 0;
    });
    return MONTHS.map(m => ({ month: m, amount: map[m] }));
  }, [allOrders]);

  const maxRevenue = useMemo(() => Math.max(...monthlyRevenue.map(m => m.amount), 1), [monthlyRevenue]);

  /* ── Spending by month (for users) ── */
  const monthlySpending = useMemo(() => {
    const map = {};
    MONTHS.forEach(m => map[m] = 0);
    orders.filter(o => o.status !== "Cancelled").forEach(o => {
      const d = new Date(o.createdAt);
      const m = MONTHS[d.getMonth()];
      if (m) map[m] += o.totalPrice || 0;
    });
    return MONTHS.map(m => ({ month: m, amount: map[m] }));
  }, [orders]);

  const maxSpending = useMemo(() => Math.max(...monthlySpending.map(m => m.amount), 1), [monthlySpending]);

  /* ── Filtered users for admin search ── */
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return allUsers;
    const q = userSearch.toLowerCase();
    return allUsers.filter(u =>
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.mobile || "").includes(q)
    );
  }, [allUsers, userSearch]);

  /* ── Users who signed up recently (last 7 days) ── */
  const recentUsers = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return allUsers.filter(u => new Date(u.createdAt) >= weekAgo);
  }, [allUsers]);

  /* ── Profile update ── */
  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`${API}/api/users/profile`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ name: editName, email: editEmail, mobile: editMobile }),
      });
      const updated = await res.json();
      setUser(updated);
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, name: updated.name, email: updated.email }));
      setEditing(false);
      showToast("✅ Profile updated successfully!");
    } catch (e) {
      console.error(e);
      showToast("❌ Failed to update profile");
    }
  };

  /* ── Address CRUD ── */
  const openAddressForm = (addr = null) => {
    if (addr) {
      setEditingAddr(addr._id);
      setAddrForm({ label: addr.label || "", address: addr.address || "", city: addr.city || "", state: addr.state || "", pincode: addr.pincode || "", phone: addr.phone || "" });
    } else {
      setEditingAddr(null);
      setAddrForm({ label: "", address: "", city: "", state: "", pincode: "", phone: "" });
    }
    setShowAddrForm(true);
  };

  const handleSaveAddress = async () => {
    try {
      const url = editingAddr ? `${API}/api/address/${editingAddr}` : `${API}/api/address`;
      const method = editingAddr ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(addrForm) });
      const saved = await res.json();
      if (editingAddr) {
        setAddresses(prev => prev.map(a => a._id === editingAddr ? saved : a));
      } else {
        setAddresses(prev => [...prev, saved]);
      }
      setShowAddrForm(false);
      showToast(editingAddr ? "✅ Address updated!" : "✅ Address added!");
    } catch (e) {
      console.error(e);
      showToast("❌ Failed to save address");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await fetch(`${API}/api/address/${id}`, { method: "DELETE", headers: headers() });
      setAddresses(prev => prev.filter(a => a._id !== id));
      showToast("🗑️ Address deleted");
    } catch (e) {
      console.error(e);
    }
  };

  /* ── Wishlist remove ── */
  const handleRemoveWishlist = async (productId) => {
    try {
      await fetch(`${API}/api/wishlist/${productId}`, { method: "DELETE", headers: headers() });
      setWishlist(prev => prev.filter(w => (w.product?._id || w.product) !== productId));
      showToast("Removed from wishlist");
    } catch (e) {
      console.error(e);
    }
  };

  /* ── Re-order ── */
  const handleReorder = async (order) => {
    try {
      for (const item of order.items) {
        await fetch(`${API}/api/cart`, {
          method: "POST",
          headers: headers(),
          body: JSON.stringify({ productId: item.product, qty: item.qty }),
        });
      }
      showToast("🛒 Items added to cart!");
      setTimeout(() => navigate("/cart"), 1500);
    } catch (e) {
      console.error(e);
      showToast("❌ Failed to reorder");
    }
  };

  /* ── Admin: Delete user ── */
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`${API}/api/users/${id}`, { method: "DELETE", headers: headers() });
      setAllUsers(prev => prev.filter(u => u._id !== id));
      showToast("🗑️ User deleted");
    } catch (e) {
      console.error(e);
      showToast("❌ Failed to delete user");
    }
  };

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    window.location.href = "/";
  };

  /* ═══════════════════════════════════════════
     RENDER — Not logged in
     ═══════════════════════════════════════════ */
  if (!isAuthenticated()) {
    return (
      <div className="profile-login-prompt">
        <div className="login-prompt-card">
          <div className="login-prompt-icon">🔒</div>
          <h2>Login to Your Account</h2>
          <p>Please login to view your profile, orders, and more.</p>
          <Link to="/login" className="btn-login-link">Login Now</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     RENDER — Tab Contents
     ═══════════════════════════════════════════ */
  const renderContent = () => {
    switch (tab) {

      /* ══════════════════════════════════════
         OVERVIEW (different for admin vs user)
         ══════════════════════════════════════ */
      case "overview":
        if (userIsAdmin) {
          return (
            <>
              <h2 className="profile-section-title">
                <span className="title-icon">📊</span> Admin Dashboard
              </h2>
              <div className="overview-stats">
                <div className="stat-card" onClick={() => setTab("all-users")}>
                  <div className="stat-icon">👥</div>
                  <div className="stat-value">{adminStats.totalUsers}</div>
                  <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card" onClick={() => setTab("all-orders")}>
                  <div className="stat-icon">📦</div>
                  <div className="stat-value">{adminStats.totalOrders}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
                <div className="stat-card" onClick={() => setTab("analytics")}>
                  <div className="stat-icon">💰</div>
                  <div className="stat-value">₹{adminStats.totalRevenue.toLocaleString()}</div>
                  <div className="stat-label">Total Revenue</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-value">{adminStats.deliveredOrders}</div>
                  <div className="stat-label">Delivered</div>
                </div>
              </div>

              {/* Quick status row */}
              <div className="overview-stats" style={{ marginTop: 0 }}>
                <div className="stat-card stat-pending">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-value">{adminStats.pendingOrders}</div>
                  <div className="stat-label">Pending Orders</div>
                </div>
                <div className="stat-card stat-cancelled">
                  <div className="stat-icon">❌</div>
                  <div className="stat-value">{adminStats.cancelledOrders}</div>
                  <div className="stat-label">Cancelled</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-value">₹{adminStats.avgOrderValue.toLocaleString()}</div>
                  <div className="stat-label">Avg Order Value</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🆕</div>
                  <div className="stat-value">{recentUsers.length}</div>
                  <div className="stat-label">New Users (7d)</div>
                </div>
              </div>

              {/* Recent orders preview */}
              {allOrders.length > 0 && (
                <>
                  <h2 className="profile-section-title" style={{ marginTop: 16 }}>
                    <span className="title-icon">🕐</span> Latest Orders
                  </h2>
                  <div className="orders-list">
                    {allOrders.slice(0, 3).map(order => (
                      <AdminOrderCard key={order._id} order={order} />
                    ))}
                    {allOrders.length > 3 && (
                      <button className="btn-secondary" style={{ alignSelf: "center" }} onClick={() => setTab("all-orders")}>
                        View All Orders →
                      </button>
                    )}
                  </div>
                </>
              )}
            </>
          );
        }

        // Regular user overview
        return (
          <>
            <h2 className="profile-section-title">
              <span className="title-icon">📊</span> Overview
            </h2>
            <div className="overview-stats">
              <div className="stat-card" onClick={() => setTab("orders")}>
                <div className="stat-icon">📦</div>
                <div className="stat-value">{stats.totalOrders}</div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">₹{stats.totalSpent.toLocaleString()}</div>
                <div className="stat-label">Total Spent</div>
              </div>
              <div className="stat-card" onClick={() => setTab("wishlist")}>
                <div className="stat-icon">❤️</div>
                <div className="stat-value">{stats.wishlistCount}</div>
                <div className="stat-label">Wishlist Items</div>
              </div>
              <div className="stat-card" onClick={() => setTab("addresses")}>
                <div className="stat-icon">📍</div>
                <div className="stat-value">{stats.addressCount}</div>
                <div className="stat-label">Saved Addresses</div>
              </div>
            </div>

            {orders.length > 0 && (
              <>
                <h2 className="profile-section-title" style={{ marginTop: 16 }}>
                  <span className="title-icon">🕐</span> Recent Orders
                </h2>
                <div className="orders-list">
                  {orders.slice(0, 3).map(order => (
                    <OrderCard key={order._id} order={order} onReorder={handleReorder} />
                  ))}
                  {orders.length > 3 && (
                    <button className="btn-secondary" style={{ alignSelf: "center" }} onClick={() => setTab("orders")}>
                      View All Orders →
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        );

      /* ══════════════════════════════════════
         PERSONAL INFO (same for both)
         ══════════════════════════════════════ */
      case "profile":
        return (
          <>
            <h2 className="profile-section-title">
              <span className="title-icon">👤</span> Personal Information
            </h2>
            <div className="profile-info-card">
              <div className="info-grid">
                <div className="info-field">
                  <span className="info-label">Full Name</span>
                  {editing ? (
                    <input className="info-input" value={editName} onChange={e => setEditName(e.target.value)} />
                  ) : (
                    <div className="info-value">{user?.name || "—"}</div>
                  )}
                </div>
                <div className="info-field">
                  <span className="info-label">Email Address</span>
                  {editing ? (
                    <input className="info-input" type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                  ) : (
                    <div className="info-value">{user?.email || "—"}</div>
                  )}
                </div>
                <div className="info-field">
                  <span className="info-label">Mobile Number</span>
                  {editing ? (
                    <input className="info-input" value={editMobile} onChange={e => setEditMobile(e.target.value)} />
                  ) : (
                    <div className="info-value">{user?.mobile || "—"}</div>
                  )}
                </div>
                <div className="info-field">
                  <span className="info-label">{userIsAdmin ? "Role" : "Member Since"}</span>
                  <div className="info-value">
                    {userIsAdmin ? (
                      <span style={{ color: "var(--primary)", fontWeight: 800 }}>🛡️ Administrator</span>
                    ) : (
                      user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—"
                    )}
                  </div>
                </div>
                {userIsAdmin && (
                  <div className="info-field">
                    <span className="info-label">Member Since</span>
                    <div className="info-value">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—"}
                    </div>
                  </div>
                )}
              </div>
              <div className="profile-actions">
                {editing ? (
                  <>
                    <button className="btn-primary" onClick={handleSaveProfile}>Save Changes</button>
                    <button className="btn-secondary" onClick={() => { setEditing(false); setEditName(user?.name || ""); setEditEmail(user?.email || ""); setEditMobile(user?.mobile || ""); }}>Cancel</button>
                  </>
                ) : (
                  <button className="btn-primary" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
                )}
              </div>
            </div>
          </>
        );

      /* ══════════════════════════════════════
         MY ORDERS (regular user)
         ══════════════════════════════════════ */
      case "orders":
        return (
          <>
            <h2 className="profile-section-title">
              <span className="title-icon">📦</span> My Orders
            </h2>
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3 className="empty-title">No Orders Yet</h3>
                <p className="empty-text">You haven't placed any orders. Start shopping now!</p>
                <Link to="/product" className="btn-shop">Browse Products</Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order, i) => (
                  <OrderCard key={order._id} order={order} onReorder={handleReorder} style={{ animationDelay: `${i * 0.08}s` }} />
                ))}
              </div>
            )}
          </>
        );

      /* ══════════════════════════════════════
         ADDRESSES (regular user only)
         ══════════════════════════════════════ */
      case "addresses":
        return (
          <>
            <h2 className="profile-section-title">
              <span className="title-icon">📍</span> Saved Addresses
            </h2>
            <div className="address-grid">
              {addresses.map(addr => (
                <div className="address-card" key={addr._id}>
                  {addr.label && <span className="address-label-tag">{addr.label}</span>}
                  <div className="address-text">
                    {addr.address}
                    <br />
                    <span className="address-city">
                      {addr.city}{addr.state ? `, ${addr.state}` : ""}{addr.pincode ? ` - ${addr.pincode}` : ""}
                    </span>
                  </div>
                  {addr.phone && <div className="address-phone">📱 {addr.phone}</div>}
                  <div className="address-actions">
                    <button className="btn-addr btn-addr-edit" onClick={() => openAddressForm(addr)}>✏️ Edit</button>
                    <button className="btn-addr btn-addr-delete" onClick={() => handleDeleteAddress(addr._id)}>🗑️ Delete</button>
                  </div>
                </div>
              ))}
              <div className="add-address-card" onClick={() => openAddressForm()}>
                <div className="add-address-icon">+</div>
                <div className="add-address-text">Add New Address</div>
              </div>
            </div>

            {showAddrForm && (
              <div className="address-form-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAddrForm(false); }}>
                <div className="address-form-modal">
                  <h3>{editingAddr ? "Edit Address" : "Add New Address"}</h3>
                  <div className="form-row">
                    <div className="form-field">
                      <label>Label</label>
                      <input placeholder="e.g. Home, Office" value={addrForm.label} onChange={e => setAddrForm({ ...addrForm, label: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label>Phone</label>
                      <input placeholder="Mobile number" value={addrForm.phone} onChange={e => setAddrForm({ ...addrForm, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field" style={{ flex: 1 }}>
                      <label>Address</label>
                      <input placeholder="Street address" value={addrForm.address} onChange={e => setAddrForm({ ...addrForm, address: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label>City</label>
                      <input placeholder="City" value={addrForm.city} onChange={e => setAddrForm({ ...addrForm, city: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label>State</label>
                      <input placeholder="State" value={addrForm.state} onChange={e => setAddrForm({ ...addrForm, state: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label>Pincode</label>
                      <input placeholder="Pincode" value={addrForm.pincode} onChange={e => setAddrForm({ ...addrForm, pincode: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="btn-primary" onClick={handleSaveAddress}>
                      {editingAddr ? "Update Address" : "Save Address"}
                    </button>
                    <button className="btn-secondary" onClick={() => setShowAddrForm(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </>
        );

      /* ══════════════════════════════════════
         WISHLIST (regular user only)
         ══════════════════════════════════════ */
      case "wishlist":
        return (
          <>
            <h2 className="profile-section-title">
              <span className="title-icon">❤️</span> My Wishlist
            </h2>
            {wishlist.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">❤️</div>
                <h3 className="empty-title">Your Wishlist is Empty</h3>
                <p className="empty-text">Save items you love and come back to them later.</p>
                <Link to="/product" className="btn-shop">Explore Products</Link>
              </div>
            ) : (
              <div className="wishlist-grid">
                {wishlist.map(item => {
                  const product = item.product || {};
                  const imgSrc = product.image
                    ? (product.image.startsWith("http") ? product.image : `${API}${product.image}`)
                    : null;
                  return (
                    <div className="wishlist-card" key={item._id}>
                      <div className="wishlist-img-wrap">
                        {imgSrc ? <img src={imgSrc} alt={product.name} /> : <span className="wishlist-placeholder">🎆</span>}
                        <button className="wishlist-remove" onClick={() => handleRemoveWishlist(product._id)}>✕</button>
                      </div>
                      <div className="wishlist-info">
                        <div className="wishlist-name">{product.name || "Unknown Product"}</div>
                        <div className="wishlist-price">₹{(product.price || 0).toLocaleString()}</div>
                      </div>
                      <button className="wishlist-cart-btn" onClick={() => navigate("/product")}>🛒 Add to Cart</button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        );

      /* ══════════════════════════════════════
         SPENDING (regular user)
         ══════════════════════════════════════ */
      case "spending":
        return (
          <>
            <h2 className="profile-section-title">
              <span className="title-icon">💰</span> Spending Summary
            </h2>
            <div className="spending-card">
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>Monthly Spending ({new Date().getFullYear()})</h3>
              <div className="chart-container">
                <div className="bar-chart">
                  {monthlySpending.map(({ month, amount }) => (
                    <div className="bar-group" key={month}>
                      <div className="bar" style={{ height: `${Math.max((amount / maxSpending) * 230, 4)}px` }}>
                        <span className="bar-tooltip">₹{amount.toLocaleString()}</span>
                      </div>
                      <span className="bar-label">{month}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="spending-summary">
                <div className="spending-stat">
                  <div className="spending-stat-value">₹{stats.totalSpent.toLocaleString()}</div>
                  <div className="spending-stat-label">Total Spent</div>
                </div>
                <div className="spending-stat">
                  <div className="spending-stat-value">{stats.totalOrders}</div>
                  <div className="spending-stat-label">Total Orders</div>
                </div>
                <div className="spending-stat">
                  <div className="spending-stat-value">
                    ₹{stats.totalOrders > 0 ? Math.round(stats.totalSpent / stats.totalOrders).toLocaleString() : 0}
                  </div>
                  <div className="spending-stat-label">Avg. Order Value</div>
                </div>
              </div>
            </div>
          </>
        );

      /* ══════════════════════════════════════
         ALL USERS (admin only)
         ══════════════════════════════════════ */
      case "all-users":
        return (
          <>
            <h2 className="profile-section-title">
              <span className="title-icon">👥</span> All Users
              <span className="nav-badge" style={{ marginLeft: 8 }}>{allUsers.length}</span>
            </h2>

            {/* Search bar */}
            <div className="admin-search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name, email or mobile..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="admin-search-input"
              />
              {userSearch && (
                <button className="search-clear" onClick={() => setUserSearch("")}>✕</button>
              )}
            </div>

            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <React.Fragment key={u._id}>
                      <tr className="user-row" style={{ animationDelay: `${i * 0.05}s` }}>
                        <td>
                          <div className="user-cell">
                            <div className="user-cell-avatar">{(u.name || "U").charAt(0).toUpperCase()}</div>
                            <span className="user-cell-name">{u.name || "Unknown"}</span>
                          </div>
                        </td>
                        <td className="user-cell-email">{u.email}</td>
                        <td>{u.mobile || "—"}</td>
                        <td>
                          <span className={`role-badge ${u.isAdmin ? "role-admin" : "role-user"}`}>
                            {u.isAdmin ? "🛡️ Admin" : "👤 User"}
                          </span>
                        </td>
                        <td className="user-cell-date">
                          {new Date(u.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                        </td>
                        <td>
                          <div className="user-actions-cell">
                            <button
                              className="btn-addr btn-addr-edit"
                              onClick={() => setExpandedUser(expandedUser === u._id ? null : u._id)}
                            >
                              {expandedUser === u._id ? "▲ Close" : "▼ Details"}
                            </button>
                            {!u.isAdmin && (
                              <button className="btn-addr btn-addr-delete" onClick={() => handleDeleteUser(u._id)}>
                                🗑️
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Expanded row */}
                      {expandedUser === u._id && (
                        <tr className="user-expanded-row">
                          <td colSpan="6">
                            <div className="user-expanded-content">
                              <div className="expanded-section">
                                <h4>📋 Full Details</h4>
                                <div className="expanded-grid">
                                  <div><span className="expanded-label">ID:</span> <span className="expanded-val">{u._id}</span></div>
                                  <div><span className="expanded-label">Name:</span> <span className="expanded-val">{u.name}</span></div>
                                  <div><span className="expanded-label">Email:</span> <span className="expanded-val">{u.email}</span></div>
                                  <div><span className="expanded-label">Mobile:</span> <span className="expanded-val">{u.mobile || "—"}</span></div>
                                  <div><span className="expanded-label">OTP Verified:</span> <span className="expanded-val">{u.otpVerified ? "✅ Yes" : "❌ No"}</span></div>
                                  <div><span className="expanded-label">Wallet:</span> <span className="expanded-val">₹{u.wallet || 0}</span></div>
                                  <div><span className="expanded-label">Registered:</span> <span className="expanded-val">{new Date(u.createdAt).toLocaleString("en-IN")}</span></div>
                                </div>
                              </div>
                              {u.addresses && u.addresses.length > 0 && (
                                <div className="expanded-section">
                                  <h4>📍 Saved Addresses ({u.addresses.length})</h4>
                                  {u.addresses.map((addr, ai) => (
                                    <div className="expanded-addr" key={ai}>
                                      {addr.label && <span className="address-label-tag">{addr.label}</span>}
                                      <span>{addr.address}, {addr.city}{addr.pincode ? ` - ${addr.pincode}` : ""}</span>
                                      {addr.phone && <span className="expanded-phone">📱 {addr.phone}</span>}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="empty-state" style={{ borderRadius: 0, borderTop: "none" }}>
                  <div className="empty-icon">🔍</div>
                  <h3 className="empty-title">No Users Found</h3>
                  <p className="empty-text">No users match your search "{userSearch}"</p>
                </div>
              )}
            </div>
          </>
        );

      /* ══════════════════════════════════════
         ALL ORDERS (admin only)
         ══════════════════════════════════════ */
      case "all-orders":
        return (
          <>
            <h2 className="profile-section-title">
              <span className="title-icon">📦</span> All Orders
              <span className="nav-badge" style={{ marginLeft: 8 }}>{allOrders.length}</span>
            </h2>
            {allOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3 className="empty-title">No Orders Yet</h3>
                <p className="empty-text">No orders have been placed yet.</p>
              </div>
            ) : (
              <div className="orders-list">
                {allOrders.map((order, i) => (
                  <AdminOrderCard key={order._id} order={order} style={{ animationDelay: `${i * 0.06}s` }} />
                ))}
              </div>
            )}
          </>
        );

      /* ══════════════════════════════════════
         SITE ANALYTICS (admin only)
         ══════════════════════════════════════ */
      case "analytics":
        return (
          <>
            <h2 className="profile-section-title">
              <span className="title-icon">📈</span> Site Analytics
            </h2>

            {/* Revenue chart */}
            <div className="spending-card">
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>Monthly Revenue ({new Date().getFullYear()})</h3>
              <div className="chart-container">
                <div className="bar-chart">
                  {monthlyRevenue.map(({ month, amount }) => (
                    <div className="bar-group" key={month}>
                      <div className="bar bar-revenue" style={{ height: `${Math.max((amount / maxRevenue) * 230, 4)}px` }}>
                        <span className="bar-tooltip">₹{amount.toLocaleString()}</span>
                      </div>
                      <span className="bar-label">{month}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="spending-summary">
                <div className="spending-stat">
                  <div className="spending-stat-value">₹{adminStats.totalRevenue.toLocaleString()}</div>
                  <div className="spending-stat-label">Total Revenue</div>
                </div>
                <div className="spending-stat">
                  <div className="spending-stat-value">{adminStats.totalOrders}</div>
                  <div className="spending-stat-label">Total Orders</div>
                </div>
                <div className="spending-stat">
                  <div className="spending-stat-value">₹{adminStats.avgOrderValue.toLocaleString()}</div>
                  <div className="spending-stat-label">Avg Order Value</div>
                </div>
              </div>
            </div>

            {/* Order status breakdown */}
            <div className="analytics-breakdown" style={{ marginTop: 24 }}>
              <h3 className="profile-section-title" style={{ fontSize: "1.2rem" }}>
                <span className="title-icon">📊</span> Order Status Breakdown
              </h3>
              <div className="overview-stats">
                <div className="stat-card stat-delivered-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-value">{adminStats.deliveredOrders}</div>
                  <div className="stat-label">Delivered</div>
                  <div className="stat-percent">{adminStats.totalOrders > 0 ? Math.round((adminStats.deliveredOrders / adminStats.totalOrders) * 100) : 0}%</div>
                </div>
                <div className="stat-card stat-pending-card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-value">{adminStats.pendingOrders}</div>
                  <div className="stat-label">Pending</div>
                  <div className="stat-percent">{adminStats.totalOrders > 0 ? Math.round((adminStats.pendingOrders / adminStats.totalOrders) * 100) : 0}%</div>
                </div>
                <div className="stat-card stat-cancelled-card">
                  <div className="stat-icon">❌</div>
                  <div className="stat-value">{adminStats.cancelledOrders}</div>
                  <div className="stat-label">Cancelled</div>
                  <div className="stat-percent">{adminStats.totalOrders > 0 ? Math.round((adminStats.cancelledOrders / adminStats.totalOrders) * 100) : 0}%</div>
                </div>
              </div>
            </div>
          </>
        );

      /* ══════════════════════════════════════
         RECENT ACTIVITY (admin only)
         ══════════════════════════════════════ */
      case "activity":
        const recentOrderActivity = allOrders.slice(0, 10);
        return (
          <>
            <h2 className="profile-section-title">
              <span className="title-icon">🕐</span> Recent Activity
            </h2>

            <div className="activity-timeline">
              {/* New user signups */}
              {recentUsers.length > 0 && (
                <div className="activity-group">
                  <h3 className="activity-group-title">🆕 New User Registrations (Last 7 Days)</h3>
                  {recentUsers.map(u => (
                    <div className="activity-item" key={u._id}>
                      <div className="activity-dot activity-dot-green"></div>
                      <div className="activity-content">
                        <div className="activity-text">
                          <strong>{u.name}</strong> joined as a new user
                        </div>
                        <div className="activity-meta">
                          {u.email} • {new Date(u.createdAt).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recent orders */}
              <div className="activity-group">
                <h3 className="activity-group-title">📦 Recent Orders</h3>
                {recentOrderActivity.length === 0 ? (
                  <div className="empty-state" style={{ padding: 30 }}>
                    <div className="empty-icon">📦</div>
                    <h3 className="empty-title">No Recent Activity</h3>
                  </div>
                ) : (
                  recentOrderActivity.map(order => (
                    <div className="activity-item" key={order._id}>
                      <div className={`activity-dot ${
                        order.status === "Delivered" ? "activity-dot-green" :
                        order.status === "Cancelled" ? "activity-dot-red" :
                        "activity-dot-orange"
                      }`}></div>
                      <div className="activity-content">
                        <div className="activity-text">
                          Order <strong>#{order._id?.slice(-8).toUpperCase()}</strong> — 
                          <span className={`order-status ${`status-${(order.status || "placed").toLowerCase()}`}`} style={{ marginLeft: 8 }}>
                            {order.status || "Placed"}
                          </span>
                        </div>
                        <div className="activity-meta">
                          {order.user?.name || "User"} • ₹{(order.totalPrice || 0).toLocaleString()} • {new Date(order.createdAt).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  /* ═══════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════ */
  return (
    <div className="profile-page">
      {/* ── SIDEBAR ── */}
      <aside className="profile-sidebar">
        <div className="profile-sidebar-header">
          <div className={`profile-avatar ${userIsAdmin ? "admin-avatar" : ""}`}>
            {user?.name ? user.name.charAt(0) : "U"}
          </div>
          <div className="profile-sidebar-name">{user?.name || "User"}</div>
          <div className="profile-sidebar-email">{user?.email || ""}</div>
          {userIsAdmin && <div className="admin-badge-sidebar">🛡️ Administrator</div>}
        </div>
        <nav className="profile-sidebar-nav">
          {MENU.map(item => (
            <div
              key={item.key}
              className={`profile-nav-item ${tab === item.key ? "active" : ""}`}
              onClick={() => setTab(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.key === "orders" && orders.length > 0 && !userIsAdmin && <span className="nav-badge">{orders.length}</span>}
              {item.key === "wishlist" && wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
              {item.key === "all-users" && allUsers.length > 0 && <span className="nav-badge">{allUsers.length}</span>}
              {item.key === "all-orders" && allOrders.length > 0 && <span className="nav-badge">{allOrders.length}</span>}
            </div>
          ))}
        </nav>
        <div className="sidebar-logout">
          <div className="profile-nav-item" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="profile-content">
        {renderContent()}
      </main>

      {/* ── TOAST ── */}
      {toast && <div className="profile-toast">{toast}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ORDER CARD COMPONENT (for regular users)
   ═══════════════════════════════════════════ */
function OrderCard({ order, onReorder, style }) {
  const statusClass = `status-${(order.status || "placed").toLowerCase()}`;
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric"
  });

  return (
    <div className="order-card" style={style}>
      <div className="order-header">
        <div>
          <div className="order-id">Order <span>#{order._id?.slice(-8).toUpperCase()}</span></div>
          <div className="order-date">{date}</div>
        </div>
        <span className={`order-status ${statusClass}`}>{order.status || "Placed"}</span>
      </div>
      <div className="order-items">
        {(order.items || []).map((item, i) => (
          <div className="order-item-row" key={i}>
            <span className="order-item-name">{item.name || "Firework Item"}</span>
            <span className="order-item-qty">× {item.qty}</span>
            <span className="order-item-price">₹{(item.price || 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="order-footer">
        <div className="order-total">Total: <span>₹{(order.totalPrice || 0).toLocaleString()}</span></div>
        <button className="btn-reorder" onClick={() => onReorder(order)}>🔄 Reorder</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ADMIN ORDER CARD (shows user info)
   ═══════════════════════════════════════════ */
function AdminOrderCard({ order, style }) {
  const statusClass = `status-${(order.status || "placed").toLowerCase()}`;
  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric"
  });
  const userName = order.user?.name || "Unknown User";
  const userEmail = order.user?.email || "";

  return (
    <div className="order-card" style={style}>
      <div className="order-header">
        <div>
          <div className="order-id">Order <span>#{order._id?.slice(-8).toUpperCase()}</span></div>
          <div className="order-date">
            <span className="admin-order-user">👤 {userName}</span>
            {userEmail && <span className="admin-order-email"> • {userEmail}</span>}
            <span> • {date}</span>
          </div>
        </div>
        <span className={`order-status ${statusClass}`}>{order.status || "Placed"}</span>
      </div>
      <div className="order-items">
        {(order.items || []).map((item, i) => (
          <div className="order-item-row" key={i}>
            <span className="order-item-name">{item.name || "Firework Item"}</span>
            <span className="order-item-qty">× {item.qty}</span>
            <span className="order-item-price">₹{(item.price || 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="order-footer">
        <div className="order-total">Total: <span>₹{(order.totalPrice || 0).toLocaleString()}</span></div>
        <div className="admin-order-payment">
          💳 {(order.paymentMethod || "N/A").toUpperCase()}
        </div>
      </div>
    </div>
  );
}
