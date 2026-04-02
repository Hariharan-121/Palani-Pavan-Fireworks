const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/email');

// ================================
// ✅ ADMIN DASHBOARD STATS
// ================================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    // 🏆 Monthly Revenue Agregration (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesStats = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 👤 User Growth stats (Last 30 days)
    const userStats = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 🛒 Top Selling Products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    const totalRevenueResult = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenueResult[0]?.total || 0,
        salesTimeline: salesStats,
        userTimeline: userStats,
        topProducts
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    });
  }
};

// ================================
// ✅ USER MANAGEMENT
// ================================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
};

// ✅ Block User
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User blocked successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to block user',
      error: error.message,
    });
  }
};

// ✅ Unblock User
exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User unblocked successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to unblock user',
      error: error.message,
    });
  }
};

// ================================
// ✅ ORDER MANAGEMENT
// ================================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

// ✅ Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // 📧 Send Status Update Email
    const statusMessages = {
      'Dispatched': 'Your order has been shipped! 🚚 It is on its way to you.',
      'Delivered': 'Your order has been delivered! ✅ Enjoy your fireworks!',
      'Cancelled': 'Your order has been cancelled. ❌ If you paid online, refund will be processed soon.'
    };

    if (statusMessages[status]) {
      await sendEmail({
        to: order.user.email,
        subject: `Order Update: ${status} - Sri Palani Pavan Fireworks`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #f8931f;">Order Status Update</h2>
            <p>Hello <strong>${order.user.name}</strong>,</p>
            <p>${statusMessages[status]}</p>
            <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Order ID:</strong> #${order._id}</p>
              <p><strong>New Status:</strong> <span style="color: #f8931f; font-weight: bold;">${status}</span></p>
            </div>
            <p>Thank you for choosing Sri Palani Pavan Fireworks!</p>
          </div>
        `
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully and email sent',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message,
    });
  }
};

// ✅ Send Promotional Email (Bulk)
exports.sendPromoEmail = async (req, res) => {
  try {
    const { subject, message, target } = req.body; // target: 'all' or specific email

    const users = target === 'all' 
      ? await User.find().select('email name')
      : await User.find({ email: target }).select('email name');

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'No users found' });
    }

    // Send emails (In a real app, use a queue/background job)
    for (const user of users) {
      await sendEmail({
        to: user.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #f8931f;">Special Offer from Sri Palani Pavan Fireworks!</h2>
            <p>Hello ${user.name},</p>
            <div style="white-space: pre-wrap;">${message}</div>
            <p style="margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5174'}" 
                 style="background: #f8931f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                 Shop Now
              </a>
            </p>
          </div>
        `
      });
    }

    res.status(200).json({
      success: true,
      message: `Promotional emails sent to ${users.length} users`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send promotional emails',
      error: error.message,
    });
  }
};

// ================================
// ✅ PRODUCT MANAGEMENT
// ================================
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

// ✅ Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};
