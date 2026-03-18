const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const controller = require('../controllers/addressController');

router.get('/', protect, controller.getAddresses);
router.post('/', protect, controller.addAddress);

module.exports = router;
