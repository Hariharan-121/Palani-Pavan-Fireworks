const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');
const controller = require('../controllers/productController');

router.get('/', controller.getProducts);
router.get('/:id', controller.getProductById);
router.post('/', protect, admin, upload.single('image'), controller.createProduct);
router.put('/:id', protect, admin, upload.single('image'), controller.updateProduct);
router.delete('/:id', protect, admin, controller.deleteProduct);

module.exports = router;
