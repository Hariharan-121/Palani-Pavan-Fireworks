const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');
const controller = require('../controllers/orderController');

router.post('/', protect, controller.placeOrder);
router.get('/my', protect, controller.getMyOrders);
router.get('/', protect, admin, controller.getAllOrders);
router.put('/:id/status', protect, admin, controller.updateStatus);

module.exports = router;
