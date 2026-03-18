const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');

exports.placeOrder = async (req, res) => {
  const { items, totalPrice, paymentMethod, address, deliverySlot, paymentResult } = req.body;
  const order = await Order.create({
    user: req.user._id,
    items,
    totalPrice,
    paymentMethod,
    address,
    deliverySlot,
    paymentResult: paymentResult || {}
  });

  // Create payment record (stub)
  await Payment.create({ order: order._id, method: paymentMethod, amount: totalPrice, status: paymentMethod === 'cod' ? 'pending' : 'paid', gatewayResponse: paymentResult || {} });

  // clear cart
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json(order);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user').sort({ createdAt: -1 });
  res.json(orders);
};

exports.updateStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = req.body.status || order.status;
  await order.save();
  res.json(order);
};
