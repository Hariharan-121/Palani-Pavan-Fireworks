const express = require('express');
const router = express.Router();
const { register, login, phoneLogin, adminLogin, verifyRegistrationOTP } = require('../controllers/authController');
const User = require('../models/User');

// ✅ AUTH ROUTES
router.post('/register', register);
router.post('/login', login);
router.post('/phone-login', phoneLogin);
router.post('/admin-login', adminLogin);
router.post('/verify-registration-otp', verifyRegistrationOTP);

// 📲 SEND OTP (FOR USER-INITIATED TRANS)
router.post('/send-otp', async (req, res, next) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ message: 'Mobile number required' });
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await User.findOneAndUpdate({ mobile }, { otp, otpVerified: false }, { upsert: true, new: true });
    console.log('📲 OTP (Demo):', otp); 
    res.json({ message: 'OTP sent successfully' });
  } catch (err) { next(err); }
});

module.exports = router;
