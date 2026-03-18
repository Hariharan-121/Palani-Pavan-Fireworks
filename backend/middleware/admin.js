const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    // ✅ Check if user is logged in
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user found' });
    }

    // ✅ Fetch fresh user from DB
    const user = await User.findById(req.user._id);

    // ✅ Check admin role
    if (user && user.isAdmin) {
      return next(); // ✅ Admin allowed
    }

    return res.status(403).json({ message: 'Admin access denied' });

  } catch (error) {
    console.error("Admin Middleware Error:", error);
    return res.status(500).json({ message: 'Admin check failed', error });
  }
};

module.exports = admin;
