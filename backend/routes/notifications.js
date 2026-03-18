const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const controller = require('../controllers/notificationController');

router.post('/', protect, controller.create);
router.get('/', protect, controller.getUserNotifications);

module.exports = router;
