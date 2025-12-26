const express = require('express');
const {
  createEvent,
  getAllEvents,
  registerEvent,
  getMyEvents,
  deleteEvent
} = require('../controllers/eventController');

const { protect } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

// Admin & Alumni
router.post(
  '/',
  protect,
  authorizeRoles('admin', 'alumni'),
  createEvent
);

// Everyone
router.get(
  '/',
  protect,
  authorizeRoles('admin', 'alumni', 'student'),
  getAllEvents
);

// Register
router.post(
  '/register/:id',
  protect,
  authorizeRoles('admin', 'alumni', 'student'),
  registerEvent
);

// Get alumni's own events
router.get(
  '/my-events',
  protect,
  authorizeRoles('admin', 'alumni'),
  getMyEvents
);

// Delete event
router.delete(
  '/:id',
  protect,
  authorizeRoles('admin', 'alumni'),
  deleteEvent
);

module.exports = router;
