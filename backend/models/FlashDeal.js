const mongoose = require('mongoose');

const flashDealSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  originalPrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  totalStock: { type: Number, required: true },
  soldCount: { type: Number, default: 0 },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('FlashDeal', flashDealSchema);
