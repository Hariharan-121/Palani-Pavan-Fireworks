import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import FireworksOverlay from "../components/FireworksOverlay";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    pincode: ""
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Automating email and password as per 'phone-only' request logic
    const registrationPayload = {
      ...formData,
      email: `${formData.mobile}@spb.com`,
      password: "password123" 
    };

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationPayload)
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert("Registration Successful! 🎇 Now Login with your Phone Number.");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      setLoading(false);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="register-page fade-in">
      <FireworksOverlay count={15} />
      
      <div className="register-card glass-panel animate-pop">
        <h1 className="section-title gradient-text">SPP FIREWORKS</h1>
        <p className="subtitle">Register once to light up all your celebrations.</p>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="input-grid">
            <div className="input-group">
              <input name="name" placeholder="Full Name" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input name="mobile" placeholder="Mobile Number" onChange={handleChange} required pattern="[0-9]{10}" />
            </div>
          </div>

          <div className="input-group">
            <input name="address" placeholder="Residential Address / Delivery Point" onChange={handleChange} required />
          </div>

          <div className="input-grid">
            <div className="input-group">
              <input name="city" placeholder="City" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <input name="pincode" placeholder="Pincode" onChange={handleChange} required pattern="[0-9]{6}" />
            </div>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Creating Profile..." : "Create Account 🎇"}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already registered? <button onClick={() => navigate("/login")} className="link-btn">Login here</button></p>
        </div>
      </div>
    </div>
  );
}
