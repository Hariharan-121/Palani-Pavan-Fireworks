const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');
const controller = require('../controllers/categoryController');

router.get('/', controller.getCategories);
router.post('/', protect, admin, controller.createCategory);
router.put('/:id', protect, admin, controller.updateCategory);
router.delete('/:id', protect, admin, controller.deleteCategory);

module.exports = router;
