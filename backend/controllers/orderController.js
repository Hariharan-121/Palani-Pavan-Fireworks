const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');
const User = require('../models/User'); // Required to get user email
const sendEmail = require('../utils/email');

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

  // 📧 Send Confirmation Email
  try {
    const user = await User.findById(req.user._id);
    if(user && user.email) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
          <h1 style="color: #f8931f; text-align: center;">Smart Cracker Shop</h1>
          <h2 style="text-align: center;">Order Confirmed! 🎆</h2>
          <p>Hi ${user.name},</p>
          <p>Thank you for shopping with Sri Palani Pavan Fireworks! Your order has been placed successfully.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f8931f; color: #fff;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name || "Firework Item"}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr style="font-weight: bold;">
                <td colspan="2" style="padding: 15px; text-align: right;">Total Amount:</td>
                <td style="padding: 15px; text-align: right;">₹${totalPrice}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 30px; background: #f9f9f9; padding: 15px; border-radius: 8px;">
            <p><strong>Payment:</strong> ${paymentMethod.toUpperCase()}</p>
            <p><strong>Shipping to:</strong> ${address.address}, ${address.city}</p>
          </div>

          <p style="text-align: center; color: #777; font-size: 0.9em; margin-top: 40px;">
            Wishing you a safe and sparkly celebration! 🪔✨
          </p>
        </div>
      `;
      
      await sendEmail({
        to: user.email,
        subject: `🎆 Order Confirmed # ${order._id} - Smart Cracker Shop`,
        html: emailHtml
      });
    }
  } catch (err) {
    console.error("Failed to send order email", err);
  }

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
