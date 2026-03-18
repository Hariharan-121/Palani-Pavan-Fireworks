const Coupon = require('../models/Coupon');

// ✅ Create Coupon (Admin)
exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Coupon creation failed', error });
  }
};

// ✅ Get All Coupons (Admin)
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Fetching coupons failed', error });
  }
};

// ✅ Apply Coupon (User)
exports.applyCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
      return res.status(400).json({ message: 'Invalid or inactive coupon' });
    }

    const discount = Math.min(
      (totalAmount * coupon.discount) / 100,
      coupon.maxDiscount
    );

    res.json({
      discount,
      finalAmount: totalAmount - discount
    });
  } catch (error) {
    res.status(500).json({ message: 'Apply coupon failed', error });
  }
};

// ✅ Delete Coupon (Admin)
exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error });
  }
};
