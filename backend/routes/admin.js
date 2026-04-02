const express = require('express');
const router = express.Router();

// Middleware
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Controller
const {
  getDashboardStats,
  getAllUsers,
  blockUser,
  unblockUser,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  deleteProduct,
  sendPromoEmail,
} = require('../controllers/adminController');
const { createSale, createFlashDeal } = require('../controllers/promoController');

// ✅ Admin Dashboard Stats
router.get('/dashboard', auth, admin, getDashboardStats);

// ✅ User Management
router.get('/users', auth, admin, getAllUsers);
router.put('/users/block/:id', auth, admin, blockUser);
router.put('/users/unblock/:id', auth, admin, unblockUser);

// ✅ Order Management
router.get('/orders', auth, admin, getAllOrders);
router.put('/orders/:id/status', auth, admin, updateOrderStatus);

// ✅ Product Management
router.get('/products', auth, admin, getAllProducts);
// ✅ Promotion Management
router.post('/promo-email', auth, admin, sendPromoEmail);
router.post('/sale', auth, admin, createSale);
router.post('/flash-deal', auth, admin, createFlashDeal);

module.exports = router;
