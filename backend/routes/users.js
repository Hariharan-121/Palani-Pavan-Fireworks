const express = require('express');
const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');

// ✅ IMPORTANT: protect must be a DIRECT function export
const protect = require('../middleware/auth');

// ✅ Admin middleware must export a function
const admin = require('../middleware/admin');

// ✅ User Profile Routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// ✅ Admin Routes
router.get('/', protect, admin, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
