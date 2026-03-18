const Notification = require('../models/Notification');

exports.create = async (req, res) => {
  const { user, title, body, meta } = req.body;
  const n = await Notification.create({ user, title, body, meta });
  res.status(201).json(n);
};

exports.getUserNotifications = async (req, res) => {
  const list = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(list);
};
