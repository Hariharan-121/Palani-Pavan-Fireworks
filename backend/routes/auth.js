const express = require('express');
const router = express.Router();

// ✅ EXISTING CONTROLLERS (DO NOT CHANGE)
const { register, login, phoneLogin, adminLogin } = require('../controllers/authController');

// ✅ INSERTED FROM 2nd CODE
const User = require('../models/User');

// 🔢 AUTO OTP GENERATOR (NEW)
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// 📲 SEND OTP (NEW ROUTE)
router.post('/send-otp', async (req, res, next) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number required' });
    }

    const otp = generateOTP();

    await User.findOneAndUpdate(
      { mobile },
      { otp, otpVerified: false },
      { upsert: true, new: true }
    );

    console.log('📲 OTP (Demo):', otp); // replace with SMS later

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    next(err);
  }
});

// ✅ EXISTING ROUTES (UNCHANGED)
router.post('/register', register);
router.post('/login', login);

// ✅ NEW PASSWORDLESS ROUTES
router.post('/phone-login', phoneLogin);
router.post('/admin-login', adminLogin);

module.exports = router;
