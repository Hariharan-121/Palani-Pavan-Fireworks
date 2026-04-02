const express = require('express');
const router = express.Router();
const { getActiveSale, getFlashDeals } = require('../controllers/promoController');

// 🏷️ Sale Banner & Flash Deals (Public)
router.get('/sale', getActiveSale);
router.get('/flash-deals', getFlashDeals);

module.exports = router;
