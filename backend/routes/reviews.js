const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const controller = require('../controllers/reviewController');

router.post('/', protect, controller.createReview);
router.get('/product/:productId', controller.getProductReviews);

module.exports = router;
