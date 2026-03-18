const OTP = require('../models/OTP');
const sendOTPEmail = require('../utils/sendOTPEmail');
const sendOTPSMS = require('../utils/sendOTPSMS');

// ✅ Send OTP
exports.sendOTP = async (req, res) => {
  const { email, phone } = req.body;

  const code = Math.floor(100000 + Math.random() * 900000);

  await OTP.create({ email, phone, code });

  if (email) await sendOTPEmail(email, code);
  if (phone) await sendOTPSMS(phone, code);

  res.json({ message: 'OTP sent successfully' });
};

// ✅ Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, phone, code } = req.body;

  const otp = await OTP.findOne({ code, $or: [{ email }, { phone }] });

  if (!otp) return res.status(400).json({ message: 'Invalid OTP' });

  await OTP.deleteOne({ _id: otp._id });

  res.json({ message: 'OTP verified' });
};
