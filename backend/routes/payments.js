const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentController');
const protect = require('../middleware/auth');

router.post('/create', protect, controller.create);

module.exports = router;
