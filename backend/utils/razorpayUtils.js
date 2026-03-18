const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

// ✅ Create Razorpay Order
exports.createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100, // paise
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`
  };

  const order = await razorpayInstance.orders.create(options);
  return order;
};

// ✅ Verify Payment Signature
exports.verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const crypto = require('crypto');
  const body = orderId + '|' + paymentId;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === signature;
};
