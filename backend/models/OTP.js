const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  contact: { type: String, required: true }, // email or phone
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('OTP', otpSchema);
