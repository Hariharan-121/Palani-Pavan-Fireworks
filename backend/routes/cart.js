const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const controller = require('../controllers/cartController');

router.get('/', protect, controller.getCart);
router.post('/add', protect, controller.addToCart);
router.delete('/remove/:productId', protect, controller.removeFromCart);

module.exports = router;
