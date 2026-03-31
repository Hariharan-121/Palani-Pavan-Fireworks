import React, { useState } from "react";
import "./Login.css"; // Reuse styling
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [credentials, setCredentials] = useState({
        name: "",
        mobile: "",
        email: "",
        address: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // We use a special endpoint or check these details
            // For now we'll call the admin-login but verify the mobile matches
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/admin-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials)
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                alert("Identity Verified, Welcome Admin! 🎇");
                navigate("/admin");
            } else {
                alert(data.message || "Verification Failed");
            }
        } catch (err) {
            alert("Verification Server Error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-content section-container">
                <div className="login-card glass-panel">
                    <h1 className="section-title gradient-text">Admin Authentication</h1>
                    <p className="subtitle">Verify your identity to access the dashboard.</p>
                    
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input 
                                type="text" 
                                placeholder="Admin Name" 
                                value={credentials.name} 
                                onChange={e => setCredentials({...credentials, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="tel" 
                                placeholder="Mobile Number" 
                                value={credentials.mobile} 
                                onChange={e => setCredentials({...credentials, mobile: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                value={credentials.email} 
                                onChange={e => setCredentials({...credentials, email: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="text" 
                                placeholder="Registered Store Address" 
                                value={credentials.address} 
                                onChange={e => setCredentials({...credentials, address: e.target.value})} 
                                required 
                            />
                        </div>
                        <button type="submit" className="primary-btn" disabled={loading}>
                            {loading ? "Verifying..." : "Access Dashboard 🛠️"}
                        </button>
                    </form>
                    <button className="link-btn" onClick={() => navigate("/login")}>Back to User Login</button>
                </div>
            </div>
        </div>
    );
}
