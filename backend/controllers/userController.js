const User = require('../models/User');

// ✅ Get Profile
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
};

// ✅ Update Profile
exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  res.json(updatedUser);
};

// ✅ Admin Get All Users
exports.getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// ✅ Admin Delete User
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User removed' });
};
