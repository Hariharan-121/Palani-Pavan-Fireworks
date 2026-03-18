const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  soundLevel: { type: String }, // Low/Medium/High
  ageCategory: { type: String }, // Kids/Adults
  isCombo: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
