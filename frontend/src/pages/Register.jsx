import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import FireworksOverlay from "../components/FireworksOverlay";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "password123",
    address: "",
    city: "",
    pincode: ""
  });
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setStep(2);
        setTimer(30);
      } else {
        setError(data.message || "Registration failed. Please check your data.");
      }
    } catch (err) {
      setLoading(false);
      setError("Server error. Please try again.");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const trimmedEmail = formData.email.toLowerCase().trim();
      const trimmedOtp = otp.toString().trim();

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-registration-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, otp: trimmedOtp })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert("Verification Successful! 🎇 You can now Login to your account.");
        window.location.href = "/login";
      } else {
        setError(data.message || "Invalid OTP! Please try again.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Verification Error:", err);
      setError("Server Error or Network Connection Issue. Please try again.");
    }
  };

  return (
    <div className="register-page fade-in">
      <FireworksOverlay count={15} />
      
      <div className="register-card glass-panel animate-pop">
        <h1 className="section-title gradient-text">SRI PALANI PAVAN FIREWORKS</h1>
        
        {error && <div className="error-msg pop-in">⚠️ {error}</div>}

        {step === 1 ? (
          <>
            <p className="subtitle">Enter details to receive your email OTP.</p>
            <form className="register-form" onSubmit={handleSendOTP}>
              <div className="input-grid">
                <input name="name" placeholder="Full Name" onChange={handleChange} required />
                <input name="mobile" placeholder="Mobile Number" onChange={handleChange} required pattern="[0-9]{10}" />
              </div>
              <input name="email" type="email" placeholder="Email Address (for OTP)" onChange={handleChange} required className="full-width-input" />
              <input name="address" placeholder="Residential Address / Delivery Point" onChange={handleChange} required />
              
              <div className="input-grid">
                <input name="city" placeholder="City" onChange={handleChange} required />
                <input name="pincode" placeholder="Pincode" onChange={handleChange} required pattern="[0-9]{6}" />
              </div>

              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Sending OTP..." : "Send Verification OTP 🎇"}
              </button>
            </form>
          </>
        ) : (
          <div className="otp-container fade-in">
            <p className="subtitle">Enter the 4-digit code sent to<br/><strong>{formData.email}</strong></p>
            <form className="register-form" onSubmit={handleVerifyOTP}>
              <input 
                 className="otp-input" 
                 type="tel" 
                 maxLength="4" 
                 inputMode="numeric"
                 placeholder="0000"
                 onChange={e => setOtp(e.target.value)} 
                 required 
              />
              
              <button type="submit" className="primary-btn pulse" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Register 🧨"}
              </button>

              <div className="resend-info">
                 {timer > 0 ? (
                   <p>Resend OTP in <strong>{timer}s</strong></p>
                 ) : (
                   <button type="button" className="link-btn" onClick={handleSendOTP}>Resend OTP Now</button>
                 )}
              </div>
            </form>
            <button className="back-btn" onClick={() => setStep(1)}>⬅ Back to Details</button>
          </div>
        )}

        <div className="auth-footer">
          <p>Already registered? <button onClick={() => navigate("/login")} className="link-btn">Login here</button></p>
        </div>
      </div>
    </div>
  );
}
