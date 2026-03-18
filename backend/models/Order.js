const mongoose = require('mongoose');
const orderItemSchema = require('./OrderItem');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  paymentMethod: { type: String }, // 'razorpay','stripe','paypal','gpay','phonepe','cod'
  paymentResult: { type: Object }, // gateway response
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'Placed' }, // Placed, Dispatched, Delivered, Cancelled
  deliverySlot: String,
  address: Object
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
