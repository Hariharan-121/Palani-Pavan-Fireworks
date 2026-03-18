const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const controller = require('../controllers/wishlistController');

// ✅ GET Wishlist
router.get('/', protect, controller.getWishlist);

// ✅ ADD to Wishlist
router.post('/', protect, controller.addToWishlist);

// ✅ REMOVE from Wishlist
router.delete('/:productId', protect, controller.removeFromWishlist);

module.exports = router;
