const express = require('express');
const router = express.Router();

const {
  createCoupon,
  getCoupons,
  applyCoupon,
  deleteCoupon
} = require('../controllers/couponController');

const protect = require('../middleware/auth');   // ✅ default export
const admin = require('../middleware/admin');    // ✅ default export

// ✅ Admin creates coupon
router.post('/', protect, admin, createCoupon);

// ✅ Get all coupons (Admin only)
router.get('/', protect, admin, getCoupons);

// ✅ User applies coupon
router.post('/apply', protect, applyCoupon);

// ✅ Admin delete coupon
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
