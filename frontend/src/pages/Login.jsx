import React, { useState } from "react";
import "./Login.css";
import FireworksOverlay from "../components/FireworksOverlay";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/phone-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mobile })
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            alert("Welcome back! 🧨");
            window.location.href = "/";
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        setLoading(false);
        alert("Server error");
    }
  };

  const loginAsAdmin = async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/admin-login`, { method: "POST" });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            alert("Bypassed Login: Welcome Boss! 🎇");
            window.location.href = "/admin";
        } else {
            alert(data.message || "Admin access failed");
        }
    } catch (err) {
        alert("Server error");
    }
  };

  return (
    <div className="login-page fade-in">
      <FireworksOverlay count={8} />
      
      <div className="login-content section-container pop-in">
        <div className="login-card glass-panel">
          <h1 className="section-title gradient-text">Welcome Back</h1>
          <p className="subtitle">Enter your mobile number to light up the shop.</p>

          <form className="login-form" onSubmit={submitHandler}>
            <div className="input-group">
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10 digit mobile number"
              />
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Authenticating..." : "Login Securely 🧨"}
            </button>
          </form>

          <div className="admin-access">
            <p>Building something big? <button onClick={loginAsAdmin} className="admin-link">Admin Access</button></p>
            <p className="register-redirect">New here? <button onClick={() => window.location.href='/register'} className="link-btn">Create Account</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};