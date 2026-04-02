const Sale = require('../models/Sale');
const FlashDeal = require('../models/FlashDeal');
const Product = require('../models/Product');

// ✅ Get Active Sale
exports.getActiveSale = async (req, res) => {
  try {
    const now = new Date();
    const sale = await Sale.findOne({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sale' });
  }
};

// ✅ Get Active Flash Deals
exports.getFlashDeals = async (req, res) => {
  try {
    const now = new Date();
    const deals = await FlashDeal.find({
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    }).populate('product');
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flash deals' });
  }
};

// ✅ Admin: Create Sale
exports.createSale = async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Error creating sale' });
  }
};

// ✅ Admin: Create Flash Deal
exports.createFlashDeal = async (req, res) => {
  try {
    const deal = await FlashDeal.create(req.body);
    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ message: 'Error creating flash deal' });
  }
};
