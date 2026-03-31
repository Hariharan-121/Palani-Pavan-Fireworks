const User = require('../models/User');

const admin = async (req, res, next) => {
  try {
    // ✅ Check if user is logged in
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user found' });
    }

    // ✅ Fetch fresh user from DB
    const user = await User.findById(req.user._id);

    // ✅ CHECK FOR ADMIN PRIVILEGES
    if (user && user.isAdmin) {
      return next(); 
    }

    return res.status(403).json({ message: '⚠️ Restricted Access: Admins ONLY.' });

  } catch (error) {
    console.error("Admin Middleware Error:", error);
    return res.status(500).json({ message: 'Admin check failed', error });
  }
};

module.exports = admin;
