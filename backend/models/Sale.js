const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  discountPercent: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  bannerColor: { type: String, default: '#f8931f' },
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
