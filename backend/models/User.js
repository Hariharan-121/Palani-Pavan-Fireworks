const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: String,
  address: String,
  city: String,
  pincode: String,
  phone: String
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    // ✅ EXISTING FIELDS (UNCHANGED)
    name: { type: String, required: true },          // fullname → name
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    wallet: { type: Number, default: 0 },
    addresses: [addressSchema],

    // 🔥 INSERTED FROM 2nd CODE (OTP SUPPORT)
    mobile: { type: String, required: true, unique: true },
    otp: { type: String },
    otpVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
