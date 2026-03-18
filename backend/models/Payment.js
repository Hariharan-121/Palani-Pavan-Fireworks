const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  method: { type: String }, // razorpay/stripe/paypal/gpay/phonepe/cod
  amount: Number,
  status: String,
  gatewayResponse: Object
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
