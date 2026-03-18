const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // null = broadcast
  title: String,
  body: String,
  read: { type: Boolean, default: false },
  meta: Object
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
