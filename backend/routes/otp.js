const express = require('express');
const router = express.Router();
const OTP = require('../models/OTP');
const { sendOTPEmail } = require('../utils/sendOTPEmail');
const { sendSMS } = require('../utils/sendOTPSMS');
const { v4: uuidv4 } = require('uuid');

router.post('/send', async (req, res) => {
  const { contact, via } = req.body; // via: 'email' or 'sms'
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const otp = await OTP.create({ contact, code, expiresAt: new Date(Date.now() + 10*60*1000) });
  if (via === 'email') await sendOTPEmail(contact, code);
  else await sendSMS(contact, `Your OTP is ${code}`);
  res.json({ message: 'OTP sent', id: otp._id });
});

router.post('/verify', async (req, res) => {
  const { contact, code } = req.body;
  const record = await OTP.findOne({ contact, code, used: false, expiresAt: { $gt: new Date() }});
  if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });
  record.used = true;
  await record.save();
  res.json({ message: 'OTP verified' });
});

module.exports = router;
