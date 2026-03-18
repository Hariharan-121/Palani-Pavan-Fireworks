const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  label: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  phone: String
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
