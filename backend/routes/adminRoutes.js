const express = require('express');
const { getAllUsers, approveAlumni, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

// Admin only
router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.put('/approve/:id', protect, authorizeRoles('admin'), approveAlumni);
router.delete('/users/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;
